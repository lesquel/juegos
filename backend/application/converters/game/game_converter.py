from application.mixins import LoggingMixin
from application.mixins.dto_converter_mixin import EntityToDTOConverter
from domain.entities.game.game import GameEntity
from dtos.response.game.game_response import GameResponseDTO


class GameEntityToDTOConverter(
    EntityToDTOConverter[GameEntity, GameResponseDTO], LoggingMixin
):
    """Convierte GameEntity a GameResponseDTO."""

    def __init__(self):
        super().__init__()

    def to_dto(self, entity: GameEntity) -> GameResponseDTO:
        """Convierte GameEntity a GameResponseDTO."""
        self.logger.debug(
            f"Converting GameEntity to GameResponseDTO for game: {entity.game_id}"
        )

        # Convertir categories a IDs si son objetos, mantener si ya son strings
        category_ids = []
        if entity.categories:
            for category in entity.categories:
                category_ids.append(str(category))

        dto = GameResponseDTO(
            game_id=str(entity.game_id),
            game_name=entity.game_name,
            game_description=entity.game_description,
            game_img=entity.game_img,
            game_url=entity.game_url,
            game_capacity=entity.game_capacity,
            house_odds=entity.house_odds,
            game_type=entity.game_type,
            category_ids=category_ids,  # Siempre IDs de string
            created_at=entity.created_at,
            updated_at=entity.updated_at,
        )

        self.logger.debug("Successfully converted GameEntity to GameResponseDTO")
        print(f"Converted GameEntity to DTO: {dto.house_odds}")
        return dto
