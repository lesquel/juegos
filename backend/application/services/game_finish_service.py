from typing import Any, Dict, List

from application.use_cases.match.finish_match import FinishMatchUseCase
from dtos.request.match.match_request_dto import (
    MatchParticipationInputDTO,
    MatchParticipationResultsDTO,
)
from infrastructure.logging.logging_config import get_logger

# Alias para mayor claridad

logger = get_logger("application.game_finish_service")


class GameFinishService:
    """
    Service that handles game finishing logic triggered by WebSocket events.

    This service:
    1. Receives game finish events from WebSocket
    2. Calls the FinishMatchUseCase to persist the results
    3. Broadcasts the results to all connected players
    """

    def __init__(self, finish_match_use_case: FinishMatchUseCase):
        self.finish_match_use_case = finish_match_use_case
        self.logger = logger

    async def handle_game_finished(
        self,
        match_id: str,
        participants_data: List[Dict[str, Any]],
        websocket_manager=None,
    ) -> Dict[str, Any]:
        """
        Handle game finished event from WebSocket.

        Args:
            match_id: The match that finished
            participants_data: List of participants with their scores
                Format: [{"user_id": "123", "score": 100}, ...]
            websocket_manager: Manager to broadcast results

        Returns:
            Dict with the finished match data
        """
        try:
            self.logger.info(f"Processing game finish for match {match_id}")

            # Convert participants data to DTO format
            participants_dto = [
                MatchParticipationInputDTO(user_id=p["user_id"], score=p["score"])
                for p in participants_data
            ]

            participation_results = MatchParticipationResultsDTO(
                participants=participants_dto
            )

            # Execute the use case to persist the results
            finished_match = await self.finish_match_use_case.execute(
                match_id=match_id, participation_data=participation_results
            )

            self.logger.info(
                f"Match {match_id} finished successfully. Winner: {finished_match.winner_id}"
            )

            # Prepare broadcast message
            broadcast_message = {
                "type": "game_over",
                "match_id": match_id,
                "winner_id": finished_match.winner_id,
                "final_scores": participants_data,
                "match_data": (
                    finished_match.model_dump()
                    if hasattr(finished_match, "model_dump")
                    else finished_match.__dict__
                ),
                "message": "¡El juego ha finalizado correctamente!",
            }

            # Broadcast to all connected players
            if websocket_manager:
                await websocket_manager.broadcast(match_id, broadcast_message)
                self.logger.info(
                    f"Broadcasted game finish results to all players in match {match_id}"
                )
            else:
                self.logger.warning(
                    f"No websocket manager provided for match {match_id}, skipping broadcast"
                )

            return broadcast_message

        except Exception as e:
            self.logger.error(f"Error finishing game for match {match_id}: {str(e)}")
            self.logger.error(f"Error type: {type(e).__name__}")
            self.logger.error(f"Participants data: {participants_data}")

            # Broadcast error to players
            error_message = {
                "type": "game_finish_error",
                "match_id": match_id,
                "error": "Failed to finish game properly",
                "details": str(e),
            }

            if websocket_manager:
                try:
                    await websocket_manager.broadcast(match_id, error_message)
                except Exception as broadcast_error:
                    self.logger.error(
                        f"Failed to broadcast error message: {str(broadcast_error)}"
                    )

            raise

    def extract_participants_from_game_state(
        self, game_state: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """
        Extract participants and scores from game state.
        This method should be overridden for each specific game type.

        Args:
            game_state: The current game state

        Returns:
            List of participants with scores
        """
        # Default implementation - should be customized per game
        participants = []

        # Example for a two-player game
        if "players" in game_state and "scores" in game_state:
            for i, player_id in enumerate(game_state["players"]):
                score = game_state["scores"].get(player_id, 0)
                participants.append({"user_id": player_id, "score": score})

        return participants

    async def detect_and_finish_game_if_over(
        self, match_id: str, game_state: Dict[str, Any], websocket_manager=None
    ) -> bool:
        """
        Check if game is over based on game state and finish it if needed.

        Args:
            match_id: The match ID
            game_state: Current game state
            websocket_manager: Manager to broadcast results

        Returns:
            True if game was finished, False otherwise
        """
        # This should be implemented per game type
        # Example logic for a generic game
        if self._is_game_over(game_state):
            participants = self.extract_participants_from_game_state(game_state)
            await self.handle_game_finished(match_id, participants, websocket_manager)
            return True

        return False

    def _is_game_over(self, game_state: Dict[str, Any]) -> bool:
        """
        Determine if the game is over based on game state.
        This should be implemented per game type.

        Args:
            game_state: Current game state

        Returns:
            True if game is over
        """
        # Default implementation - should be customized per game
        return (
            game_state.get("game_over", False) or game_state.get("winner") is not None
        )

    def should_auto_finish(self, game_result: Dict[str, Any]) -> bool:
        """
        Determines if a game should be automatically finished based on the move result.

        Args:
            game_result: Result dictionary from game engine apply_move method

        Returns:
            True if the game should be auto-finished, False otherwise
        """
        return game_result.get("game_over", False) and (
            game_result.get("winner") is not None or game_result.get("is_tie", False)
        )
