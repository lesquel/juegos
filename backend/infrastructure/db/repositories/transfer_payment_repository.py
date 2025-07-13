from typing import Optional, List
from sqlalchemy import select

from domain.entities.transfer.transfer_payment import TransferPaymentEntity
from domain.repositories.transfer_payment_repository import ITransferPaymentRepository
from infrastructure.db.models.transfer_payment_model import TransferPaymentModel
from infrastructure.db.repositories.base_repository import (
    BasePostgresRepository,
)
from interfaces.api.common.filters.specific_filters import TransferPaymentFilterParams
from application.enums import TransferStateEnum


class PostgresTransferPaymentRepository(
    BasePostgresRepository[
        TransferPaymentEntity, TransferPaymentModel, TransferPaymentFilterParams
    ],
    ITransferPaymentRepository,
):
    """Implementación PostgreSQL del repositorio de transferencias de pago."""

    async def update(self, transfer_id: str, entity: TransferPaymentEntity) -> None:
        """Actualiza una transferencia de pago."""
        stmt = select(self.model).where(self.model.transfer_id == transfer_id)
        result = await self.db.execute(stmt)
        transfer_model = result.scalar_one_or_none()

        if transfer_model:
            transfer_model.transfer_img = entity.transfer_img
            transfer_model.transfer_amount = entity.transfer_amount
            transfer_model.transfer_state = entity.transfer_state
            transfer_model.transfer_description = entity.transfer_description
            await self.db.commit()
            self.logger.info(f"Successfully updated transfer payment: {transfer_id}")
        else:
            raise Exception(f"Transfer payment with ID {transfer_id} not found")

    def _model_to_entity(self, model: TransferPaymentModel) -> TransferPaymentEntity:
        """
        Convierte un modelo de transferencia de pago a entidad.

        Args:
            model: El modelo de transferencia de pago a convertir

        Returns:
            TransferPaymentEntity: La entidad convertida
        """
        return TransferPaymentEntity(
            transfer_id=str(model.transfer_id),
            user_id=str(model.user_id),
            transfer_img=model.transfer_img,
            transfer_amount=model.transfer_amount,
            transfer_state=model.transfer_state,
            transfer_description=model.transfer_description,
            created_at=model.created_at.isoformat() if model.created_at else None,
            updated_at=model.updated_at.isoformat() if model.updated_at else None,
        )

    def _entity_to_model(self, entity: TransferPaymentEntity) -> TransferPaymentModel:
        """
        Convierte una entidad de transferencia de pago a modelo.

        Args:
            entity: La entidad de transferencia de pago a convertir

        Returns:
            TransferPaymentModel: El modelo convertido
        """
        model = TransferPaymentModel(
            user_id=entity.user_id,
            transfer_img=entity.transfer_img,
            transfer_amount=entity.transfer_amount,
            transfer_state=entity.transfer_state,
            transfer_description=entity.transfer_description,
        )

        if entity.transfer_id:
            model.transfer_id = entity.transfer_id

        return model

    def _apply_filters(self, query, filter_params: TransferPaymentFilterParams):
        """
        Aplica filtros específicos de transferencia de pago a la consulta.

        Args:
            query: La consulta SQLAlchemy
            filter_params: Los parámetros de filtro

        Returns:
            Query: La consulta con filtros aplicados
        """
        # Aplicar filtros base
        query = super()._apply_filters(query, filter_params)

        # Filtro por usuario
        if filter_params.user_id:
            query = query.filter(TransferPaymentModel.user_id == filter_params.user_id)

        # Filtro por estado
        if filter_params.transfer_state:
            query = query.filter(
                TransferPaymentModel.transfer_state == filter_params.transfer_state
            )

        # Filtro por rango de monto
        if filter_params.min_amount is not None:
            query = query.filter(
                TransferPaymentModel.transfer_amount >= filter_params.min_amount
            )

        if filter_params.max_amount is not None:
            query = query.filter(
                TransferPaymentModel.transfer_amount <= filter_params.max_amount
            )

        return query

    def _get_id_field(self):
        """Obtiene el campo ID del modelo."""
        return self.model.transfer_id

    def _get_entity_id(self, entity: TransferPaymentEntity) -> Optional[str]:
        """Obtiene el ID de una entidad."""
        return entity.transfer_id

    def get_by_user_id(self, user_id: str) -> List[TransferPaymentEntity]:
        """
        Obtiene todas las transferencias de un usuario.

        Args:
            user_id: El ID del usuario

        Returns:
            List[TransferPaymentEntity]: Lista de transferencias del usuario
        """
        models = (
            self.db.query(TransferPaymentModel)
            .filter(TransferPaymentModel.user_id == user_id)
            .all()
        )

        return [self._model_to_entity(model) for model in models]

    def get_by_state(self, state: TransferStateEnum) -> List[TransferPaymentEntity]:
        """
        Obtiene todas las transferencias por estado.

        Args:
            state: El estado de las transferencias

        Returns:
            List[TransferPaymentEntity]: Lista de transferencias con el estado especificado
        """
        models = (
            self.db.query(TransferPaymentModel)
            .filter(TransferPaymentModel.transfer_state == state)
            .all()
        )

        return [self._model_to_entity(model) for model in models]

    def update_state(
        self, transfer_id: str, new_state: TransferStateEnum
    ) -> Optional[TransferPaymentEntity]:
        """
        Actualiza el estado de una transferencia.

        Args:
            transfer_id: El ID de la transferencia
            new_state: El nuevo estado

        Returns:
            Optional[TransferPaymentEntity]: La transferencia actualizada
        """
        model = (
            self.db.query(TransferPaymentModel)
            .filter(TransferPaymentModel.transfer_id == transfer_id)
            .first()
        )

        if not model:
            return None

        model.transfer_state = new_state
        self.db.commit()
        self.db.refresh(model)

        return self._model_to_entity(model)
