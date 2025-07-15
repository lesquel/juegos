from domain.entities.match.match import MatchEntity
from domain.repositories.match_repository import IMatchRepository
from domain.repositories.game_repository import IGameRepository
from domain.exceptions.game import GameNotFoundError
from domain.exceptions.match import MatchValidationError
from dtos.request.match.match_request_dto import CreateMatchRequestDTO
from dtos.response.match.match_response_dto import MatchResponseDTO
from application.interfaces.base_use_case import BaseUseCase
from application.mixins.dto_converter_mixin import BidirectionalConverter
from infrastructure.logging import log_execution, log_performance
from datetime import datetime


class CreateMatchUseCase(BaseUseCase[CreateMatchRequestDTO, MatchResponseDTO]):
    """Caso de uso para crear una nueva partida."""

    def __init__(
        self,
        match_repo: IMatchRepository,
        game_repo: IGameRepository,
        match_converter: BidirectionalConverter[MatchEntity, MatchResponseDTO],
    ):
        super().__init__()
        self.match_repo = match_repo
        self.game_repo = game_repo
        self.match_converter = match_converter

    @log_execution(include_args=False, include_result=True, log_level="INFO")
    @log_performance(threshold_seconds=2.0)
    async def execute(self, match_data: CreateMatchRequestDTO) -> MatchResponseDTO:
        """
        Crea una nueva partida.

        Args:
            match_data: Datos para crear la partida

        Returns:
            MatchResponseDTO: Datos de la partida creada

        Raises:
            GameNotFoundError: Si el juego no existe
            MatchValidationError: Si los datos son inválidos
        """
        self.logger.info(f"Creating match for game {match_data.game_id}")

        # Validar que el juego existe
        game = await self.game_repo.get_by_id(match_data.game_id)
        if not game:
            self.logger.error(f"Game not found: {match_data.game_id}")
            raise GameNotFoundError(f"Game with ID {match_data.game_id} not found")

        # Validar fechas
        try:
            start_time = datetime.fromisoformat(match_data.start_time.replace('Z', '+00:00'))
            end_time = datetime.fromisoformat(match_data.end_time.replace('Z', '+00:00'))
            
            if start_time >= end_time:
                raise MatchValidationError("End time must be after start time")
            
            if start_time < datetime.now():
                raise MatchValidationError("Start time cannot be in the past")
                
        except ValueError as e:
            self.logger.error(f"Invalid datetime format: {e}")
            raise MatchValidationError(f"Invalid datetime format: {e}")

        # Crear entidad de partida usando el converter
        match_entity = self.match_converter.to_entity(match_data)
        
        # Crear la partida en el repositorio
        created_match = await self.match_repo.create(match_entity)
        
        self.logger.info(f"Match created successfully with ID: {created_match.match_id}")
        
        # Convertir a DTO de respuesta
        return self.match_converter.to_dto(created_match)
