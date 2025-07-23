import re
from typing import Optional


class ConnectionValidator:
    """Validator for WebSocket connection parameters"""

    @staticmethod
    def validate_match_id(match_id: str) -> tuple[bool, Optional[str]]:
        """Validate match ID format"""
        if not match_id:
            return False, "Match ID is required"

        if not isinstance(match_id, str):
            return False, "Match ID must be a string"

        # Check if it's a valid UUID format
        uuid_pattern = re.compile(
            r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
            re.IGNORECASE,
        )

        if not uuid_pattern.match(match_id):
            return False, "Match ID must be a valid UUID"

        return True, None

    @staticmethod
    def validate_token(token: str) -> tuple[bool, Optional[str]]:
        """Validate authentication token format"""
        if not token:
            return False, "Token is required"

        if not isinstance(token, str):
            return False, "Token must be a string"

        # Basic JWT format validation (three parts separated by dots)
        parts = token.split(".")
        if len(parts) != 3:
            return False, "Invalid token format"

        # Check if each part is base64-like
        import base64
        import json

        try:
            # Try to decode the header and payload
            header = base64.b64decode(parts[0] + "==")  # Add padding if needed
            payload = base64.b64decode(parts[1] + "==")

            # Try to parse as JSON
            json.loads(header)
            json.loads(payload)

        except Exception:
            return False, "Invalid token structure"

        return True, None

    @staticmethod
    def validate_user_id(user_id: str) -> tuple[bool, Optional[str]]:
        """Validate user ID format"""
        if not user_id:
            return False, "User ID is required"

        if not isinstance(user_id, str):
            return False, "User ID must be a string"

        # Check if it's a valid UUID format
        uuid_pattern = re.compile(
            r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
            re.IGNORECASE,
        )

        if not uuid_pattern.match(user_id):
            return False, "User ID must be a valid UUID"

        return True, None

    @staticmethod
    def validate_connection_params(
        match_id: str, token: str
    ) -> tuple[bool, Optional[str]]:
        """Validate all connection parameters"""
        # Validate match ID
        valid, error = ConnectionValidator.validate_match_id(match_id)
        if not valid:
            return False, f"Match ID validation failed: {error}"

        # Validate token
        valid, error = ConnectionValidator.validate_token(token)
        if not valid:
            return False, f"Token validation failed: {error}"

        return True, None
