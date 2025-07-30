from application.mixins.dto_converter_mixin import BidirectionalConverter
from domain.entities.game.game_review import GameReviewEntity
from domain.exceptions.auth import AuthenticationError
from domain.exceptions.game import GameReviewNotFoundError
from domain.interfaces.base_use_case import BaseUseCase
from domain.repositories.game_review_repository import IGameReviewRepository
from dtos.request.game.game_review_request import UpdateGameReviewRequestDTO
from dtos.response.game.game_review_response import GameReviewResponseDTO
from dtos.response.user.user_response import UserBaseResponseDTO
from infrastructure.logging import log_execution, log_performance


class UpdateGameReviewUseCase(
    BaseUseCase[UpdateGameReviewRequestDTO, GameReviewResponseDTO]
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
        self, review_id: str, update_dto: UpdateGameReviewRequestDTO
    ) -> GameReviewResponseDTO:
        self.logger.info(f"Updating review {review_id} by user {self.user.user_id}")

        # Buscar la reseña existente
        existing_review = await self.review_repository.get_by_id(review_id)
        if not existing_review:
            self.logger.error(f"Review {review_id} not found")
            raise GameReviewNotFoundError(f"Review with ID {review_id} not found")

        # Verificar que el usuario es el propietario de la reseña
        if str(existing_review.user_id) != str(self.user.user_id):
            self.logger.error(
                f"User {self.user.user_id} is not authorized to update review {review_id}"
            )
            raise AuthenticationError("You can only update your own reviews")

        existing_review.comment = update_dto.comment
        existing_review.rating = update_dto.rating

        # Guardar la reseña actualizada en el repositorio
        updated_review = await self.review_repository.update(
            existing_review.review_id, existing_review
        )

        # Convertir entidad a DTO de respuesta
        return self.converter.to_dto(updated_review)
