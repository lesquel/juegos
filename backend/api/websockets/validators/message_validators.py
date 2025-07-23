from typing import Any, Dict, Optional

from pydantic import BaseModel, ValidationError


class MessageValidator:
    """Base validator for WebSocket messages"""

    @staticmethod
    def validate_message_structure(message: dict) -> bool:
        """Validate basic message structure"""
        if not isinstance(message, dict):
            return False

        required_fields = ["type"]
        return all(field in message for field in required_fields)

    @staticmethod
    def validate_message_size(message: dict, max_size: int = 10240) -> bool:
        """Validate message size"""
        import json

        message_size = len(json.dumps(message).encode("utf-8"))
        return message_size <= max_size

    @staticmethod
    def sanitize_message(message: dict) -> dict:
        """Sanitize message content"""
        # Remove any potentially dangerous content
        sanitized = {}
        for key, value in message.items():
            if isinstance(value, str):
                # Basic string sanitization
                sanitized[key] = value.strip()[:1000]  # Limit string length
            elif isinstance(value, (int, float, bool)):
                sanitized[key] = value
            elif isinstance(value, dict):
                sanitized[key] = MessageValidator.sanitize_message(value)
            elif isinstance(value, list):
                sanitized[key] = value[:100]  # Limit list length
            else:
                sanitized[key] = str(value)[:1000]

        return sanitized


class GameMessageSchema(BaseModel):
    """Pydantic schema for game messages"""

    type: str
    player_id: Optional[str] = None
    game_type: Optional[str] = None
    match_id: Optional[str] = None
    move: Optional[Dict[str, Any]] = None

    class Config:
        extra = "allow"  # Allow additional fields


class JoinGameSchema(BaseModel):
    """Schema for join_game messages"""

    type: str = "join_game"
    player_id: Optional[str] = None
    game_type: Optional[str] = None


class MakeMoveSchema(BaseModel):
    """Schema for make_move messages"""

    type: str = "make_move"
    player_id: str
    move: Dict[str, Any]


class GameMessageValidator(MessageValidator):
    """Validator specifically for game messages"""

    MESSAGE_SCHEMAS = {
        "join_game": JoinGameSchema,
        "make_move": MakeMoveSchema,
        "restart_game": GameMessageSchema,
        "get_game_state": GameMessageSchema,
        "create_game": GameMessageSchema,
    }

    @classmethod
    def validate_game_message(
        cls, message: dict
    ) -> tuple[bool, Optional[str], Optional[dict]]:
        """
        Validate game message with Pydantic schemas

        Returns:
            tuple: (is_valid, error_message, validated_data)
        """
        # Basic structure validation
        if not cls.validate_message_structure(message):
            return False, "Invalid message structure", None

        # Size validation
        if not cls.validate_message_size(message):
            return False, "Message too large", None

        # Get message type
        message_type = message.get("type")
        if not message_type:
            return False, "Missing message type", None

        # Get appropriate schema
        schema_class = cls.MESSAGE_SCHEMAS.get(message_type, GameMessageSchema)

        try:
            # Validate with Pydantic
            validated_data = schema_class(**message).dict()
            return True, None, validated_data
        except ValidationError as e:
            error_messages = []
            for error in e.errors():
                field = ".".join(str(x) for x in error["loc"])
                error_messages.append(f"{field}: {error['msg']}")
            return False, "; ".join(error_messages), None

    @classmethod
    def validate_move_data(
        cls, move_data: dict, game_type: str
    ) -> tuple[bool, Optional[str]]:
        """Validate move data based on game type"""
        if game_type in ["connect4", "conecta4"]:
            return cls._validate_connect4_move(move_data)
        elif game_type == "tictactoe":
            return cls._validate_tictactoe_move(move_data)
        else:
            return True, None  # Unknown game type, let game engine validate

    @classmethod
    def _validate_connect4_move(cls, move_data: dict) -> tuple[bool, Optional[str]]:
        """Validate Connect4 move"""
        if "column" not in move_data:
            return False, "Missing column in move data"

        column = move_data["column"]
        if not isinstance(column, int):
            return False, "Column must be an integer"

        if column < 0 or column > 6:
            return False, "Column must be between 0 and 6"

        return True, None

    @classmethod
    def _validate_tictactoe_move(cls, move_data: dict) -> tuple[bool, Optional[str]]:
        """Validate TicTacToe move"""
        required_fields = ["row", "col"]
        for field in required_fields:
            if field not in move_data:
                return False, f"Missing {field} in move data"

            value = move_data[field]
            if not isinstance(value, int):
                return False, f"{field} must be an integer"

            if value < 0 or value > 2:
                return False, f"{field} must be between 0 and 2"

        return True, None
