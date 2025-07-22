from typing import List, Optional, Tuple

from domain.entities import AppInfoEntity
from domain.repositories import A
from domain.repositories.app_info_repository import IAppInfoRepository
from infrastructure.db.models.app_info_model import AppInfoModel
from interfaces.api.common.filters.specific_filters import CategoryFilterParams
from interfaces.api.common.pagination import PaginationParams
from interfaces.api.common.sort import SortParams
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import CategoryModel
from .base_repository import BaseReadOnlyPostgresRepository


class PostgresAppInfoRepository(
IAppInfoRepository,
):
    def __init__(
        self, db_session: AsyncSession, db_model: AppInfoModel, *args, **kwargs
    ):  
        # Configurar atributos necesarios
        self.db = db_session
        self.model = db_model

    async def get_app_info(self) -> Optional[AppInfoEntity]:
        """Obtiene la información de la aplicación (único registro)."""
        stmt = select(self.model).options(selectinload(self.model.accounts))
        result = await self.db.execute(stmt)
        app_info_model = result.scalar_one_or_none()
        
        if not app_info_model:
            return None
            
        return self._model_to_entity(app_info_model) 
    

    def _model_to_entity(self, model: AppInfoModel) -> AppInfoEntity:
        """Convierte AppInfoModel a AppInfoEntity."""
        return AppInfoEntity(
            site_name=model.site_name,
            site_icon=model.site_icon,
            site_logo=model.site_logo,
            accounts=model.accounts,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )