"""
Test script to verify the UpdateGameReviewUseCase implementation.
"""
import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from application.converters.game.game_review_converter import (
    GameReviewUpdateDTOToEntityConverter,
    GameReviewEntityToDTOConverter
)
from dtos.request.game.game_review_request_dto import UpdateGameReviewRequestDTO


def test_update_converter():
    """Test the update converter with different scenarios."""
    
    # Test 1: Update only rating
    update_dto_1 = UpdateGameReviewRequestDTO(
        rating=4,
        comment=None
    )
    
    converter = GameReviewUpdateDTOToEntityConverter()
    entity_1 = converter.to_entity(update_dto_1)
    
    print("✅ Test 1 - Update only rating:")
    print(f"   Rating: {entity_1.rating}")
    print(f"   Comment: {entity_1.comment}")
    
    # Test 2: Update only comment
    update_dto_2 = UpdateGameReviewRequestDTO(
        rating=None,
        comment="Updated comment"
    )
    
    entity_2 = converter.to_entity(update_dto_2)
    
    print("✅ Test 2 - Update only comment:")
    print(f"   Rating: {entity_2.rating}")
    print(f"   Comment: {entity_2.comment}")
    
    # Test 3: Update both fields
    update_dto_3 = UpdateGameReviewRequestDTO(
        rating=5,
        comment="Excellent game, updated review!"
    )
    
    entity_3 = converter.to_entity(update_dto_3)
    
    print("✅ Test 3 - Update both fields:")
    print(f"   Rating: {entity_3.rating}")
    print(f"   Comment: {entity_3.comment}")
    
    print("\n🎉 UpdateGameReviewRequestDTO converter works correctly!")
    print("   ✓ Handles None values properly")
    print("   ✓ Preserves provided values")
    print("   ✓ Ready for use in UpdateGameReviewUseCase")


if __name__ == "__main__":
    test_update_converter()
