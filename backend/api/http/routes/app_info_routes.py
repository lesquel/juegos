from application.use_cases.get_app_info_use_case import GetAppInfoUseCase
from dtos.response.app_info_response import AppInfoResponseDTO
from fastapi import APIRouter, Depends
from infrastructure.dependencies.use_cases.app_info_use_cases import (
    get_app_info_use_case,
)
from infrastructure.logging import get_logger

app_info_router = APIRouter(prefix="/app-info", tags=["App Info"])
logger = get_logger("app_info_routes")


@app_info_router.get("/", response_model=AppInfoResponseDTO)
async def get_app_info(use_case: GetAppInfoUseCase = Depends(get_app_info_use_case)):
    """
    Obtener información de la aplicación
    """
    logger.info("Fetching app info")
    return await use_case.execute()
