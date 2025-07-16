"""Conversor DTO para entidad Category."""

from domain.entities.game.category import CategoryEntity
from dtos.response.game.category_response import CategoryResponseDTO
from application.mixins.dto_converter_mixin import EntityToDTOConverter, BidirectionalConverter
from application.mixins import LoggingMixin


class CategoryEntityToDTOConverter(EntityToDTOConverter[CategoryEntity, CategoryResponseDTO], LoggingMixin):
    """Convierte CategoryEntity a CategoryResponseDTO."""

    def __init__(self):
        super().__init__()

    def to_dto(self, entity: CategoryEntity) -> CategoryResponseDTO:
        """Convierte CategoryEntity a CategoryResponseDTO."""
        self.logger.debug(f"Converting CategoryEntity to CategoryResponseDTO for category: {entity.category_id}")
        
        try:
            # Convertir games a IDs si son objetos, mantener si ya son strings
            if entity.games:
                game_ids = []
                for game in entity.games:  # Es una entidad GameEntity
                        game_ids.append(str(game))


            dto = CategoryResponseDTO(
                category_id=str(entity.category_id),
                category_name=entity.category_name,
                category_img=entity.category_img,
                category_description=entity.category_description,
                game_ids=game_ids,  # Siempre IDs de string
                created_at=entity.created_at,
                updated_at=entity.updated_at,
            )
            
            self.logger.debug("Successfully converted CategoryEntity to CategoryResponseDTO")
            return dto
            
        except Exception as e:
            self.logger.error(f"Error converting CategoryEntity to CategoryResponseDTO: {str(e)}")
            raise


class CategoryBidirectionalConverter(BidirectionalConverter[CategoryEntity, CategoryResponseDTO], LoggingMixin):
    """Convertidor bidireccional para Category."""

    def __init__(self):
        super().__init__()

    def to_dto(self, entity: CategoryEntity) -> CategoryResponseDTO:
        """Convierte CategoryEntity a CategoryResponseDTO."""
        self.logger.debug(f"Converting CategoryEntity to CategoryResponseDTO (bidirectional) for category: {entity.category_id}")
        
        try:
            # Convertir games a IDs si son objetos, mantener si ya son strings
            games_ids = []
            if entity.games:
                for game in entity.games:
                    if hasattr(game, 'id'):  # Es un objeto GameModel
                        games_ids.append(str(game.id))
                    elif hasattr(game, 'game_id'):  # Es una entidad GameEntity
                        games_ids.append(str(game.game_id))
                    else:  # Ya es un string (ID)
                        games_ids.append(str(game))
            
            dto = CategoryResponseDTO(
                category_id=str(entity.category_id),
                category_name=entity.category_name,
                category_img=entity.category_img,
                category_description=entity.category_description,
                games=games_ids,  # Siempre IDs de string
                created_at=entity.created_at,
                updated_at=entity.updated_at,
            )
            
            self.logger.debug("Successfully converted CategoryEntity to CategoryResponseDTO (bidirectional)")
            return dto
            
        except Exception as e:
            self.logger.error(f"Error in bidirectional conversion to DTO: {str(e)}")
            raise

    def to_entity(self, dto: CategoryResponseDTO) -> CategoryEntity:
        """Convierte CategoryResponseDTO a CategoryEntity."""
        self.logger.debug(f"Converting CategoryResponseDTO to CategoryEntity for category: {dto.category_id}")
        
        try:
            entity = CategoryEntity(
                category_id=dto.category_id,
                category_name=dto.category_name,
                category_img=dto.category_img,
                category_description=dto.category_description,
                games=dto.games if dto.games else [],  # Ya son IDs
                created_at=dto.created_at,
                updated_at=dto.updated_at,
            )
            
            self.logger.debug("Successfully converted CategoryResponseDTO to CategoryEntity")
            return entity
            
        except Exception as e:
            self.logger.error(f"Error in bidirectional conversion to Entity: {str(e)}")
            raise
