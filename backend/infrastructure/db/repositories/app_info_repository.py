from typing import Optional

from application.mixins.logging_mixin import LoggingMixin
from domain.entities import AppInfoEntity
from domain.repositories.app_info_repository import IAppInfoRepository
from ..models import AppInfoModel, AccountModel
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession


class PostgresAppInfoRepository(IAppInfoRepository, LoggingMixin):
    def __init__(self, db_session: AsyncSession, db_model: AppInfoModel):
        # Configurar atributos necesarios
        self.db = db_session
        self.model = db_model

    async def get_app_info(self) -> Optional[AppInfoEntity]:
        """Obtiene la información de la aplicación (único registro)."""
        self.logger.info("Fetching app info from database")
        stmt = select(self.model).options(selectinload(self.model.accounts))
        result = await self.db.execute(stmt)
        app_info_model = result.scalar_one_or_none()

        if not app_info_model:
            return None
        self.logger.info("App info fetched successfully")
        return self._model_to_entity(app_info_model)

    def _model_to_entity(self, model: AppInfoModel) -> AppInfoEntity:
        """Convierte AppInfoModel a AppInfoEntity."""
        accounts = [
            AccountModel(
                account_id=account.account_id,
                account_owner_name=account.account_owner_name,
                account_number=account.account_number,
                account_type=account.account_type,
                account_description=account.account_description,
            )
            for account in model.accounts
        ]

        return AppInfoEntity(
            app_info_id=model.app_info_id,
            site_name=model.site_name,
            site_icon=model.site_icon,
            site_logo=model.site_logo,
            accounts=accounts,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )
