from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from domain.exceptions.auth import AuthenticationError


class CustomHTTPBearer(HTTPBearer):
    async def __call__(self, request: Request) -> HTTPAuthorizationCredentials:

        try:
            credentials = await super().__call__(request)
        except HTTPException as exc:
            raise AuthenticationError("Not authenticated") from exc

        return credentials
