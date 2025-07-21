from application.mixins.dto_converter_mixin import BidirectionalConverter
from domain.entities.game.game_review import GameReviewEntity
from domain.interfaces.base_use_case import BaseUseCase
from domain.repositories.game_review_repository import IGameReviewRepository
from dtos.request.game.game_review_request import CreateGameReviewRequestDTO
from dtos.response.game.game_review_response import GameReviewResponseDTO
from dtos.response.user.user_response import UserBaseResponseDTO
from infrastructure.logging import log_execution, log_performance


class CreateGameReviewUseCase(
    BaseUseCase[CreateGameReviewRequestDTO, GameReviewResponseDTO]
):
    def __init__(
        self,
        user: UserBaseResponseDTO,
        review_repository: IGameReviewRepository,
        game_review_converter: BidirectionalConverter[
            GameReviewEntity, GameReviewResponseDTO
        ],
    ):
        super().__init__()
        self.user = user
        self.review_repository = review_repository
        self.converter = game_review_converter

    @log_execution(include_args=False, include_result=True, log_level="INFO")
    @log_performance(threshold_seconds=2.0)
    async def execute(
        self, game_id: str, review_dto: CreateGameReviewRequestDTO
    ) -> GameReviewResponseDTO:
        self.logger.info(
            f"Creating review for game {game_id} by user {self.user.user_id}"
        )

        # Usar converter para transformar DTO a entidad
        new_review = self.converter.to_entity(review_dto)

        # Asignar datos adicionales que no vienen en el DTO
        new_review.user_id = self.user.user_id
        new_review.game_id = game_id

        # Guardar la review en el repositorio (save method handles duplicate check)
        saved_review = await self.review_repository.save(new_review)

        # Usar converter para transformar entidad a DTO de respuesta
        return self.converter.to_dto(saved_review)
