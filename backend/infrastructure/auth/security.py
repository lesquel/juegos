from domain.exceptions.auth import AuthenticationError
from fastapi import HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer


class CustomHTTPBearer(HTTPBearer):
    async def __call__(self, request: Request) -> HTTPAuthorizationCredentials:
        try:
            credentials = await super().__call__(request)
        except HTTPException as exc:
            raise AuthenticationError("Not authenticated") from exc

        return credentials
