import asyncio
import re
from typing import Optional

from application.services.file_upload_service import FileUploadService
from infrastructure.db.connection import SessionLocal
from infrastructure.db.models import AppInfoModel
from markupsafe import Markup
from sqladmin import ModelView
from sqlalchemy import select
from starlette.requests import Request
from wtforms import FileField, validators


class AppInfoAdmin(ModelView, model=AppInfoModel):
    """Panel de administración para información de la aplicación"""

    name = "Información de la Aplicación"
    name_plural = "Información de la Aplicación"
    icon = "fa-solid fa-info-circle"

    # Configuración de campos de imagen
    image_fields = {"site_icon": "site_icons", "site_logo": "site_logos"}

    @property
    def primary_key_field(self):
        return AppInfoModel.app_info_id

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.setup_image_handling()

    def setup_image_handling(self):
        """Configurar el manejo de múltiples imágenes"""
        self._setup_image_fields()
        self._setup_image_formatters()

    def _setup_image_fields(self):
        """Configurar los campos de imagen en el formulario"""
        if not hasattr(self, "form_overrides"):
            self.form_overrides = {}
        if not hasattr(self, "form_args"):
            self.form_args = {}

        for field_name in self.image_fields.keys():
            self.form_overrides[field_name] = FileField
            self.form_args[field_name] = {
                "label": f"Imagen ({field_name.replace('_', ' ').title()})",
                "validators": [validators.Optional()],
                "render_kw": {"accept": "image/*", "class": "form-control-file"},
            }

    def _setup_image_formatters(self):
        """Configurar formateadores de imagen para tabla y detalles"""
        if not hasattr(self, "column_formatters"):
            self.column_formatters = {}
        if not hasattr(self, "column_formatters_detail"):
            self.column_formatters_detail = {}

        for field_name in self.image_fields.keys():
            # Formatter para tabla (imagen pequeña)
            self.column_formatters[field_name] = lambda m, a, fn=field_name: Markup(
                self._render_img(getattr(m, fn), detail=False)
            )

            # Formatter para vista de detalle (imagen grande)
            self.column_formatters_detail[
                field_name
            ] = lambda m, a, fn=field_name: Markup(
                self._render_img(getattr(m, fn), detail=True)
            )

    @staticmethod
    def _render_img(img_value: str, detail: bool = False) -> str:
        """Renderizar imagen como HTML seguro"""
        if not img_value:
            return '<span style="color: #999;">Sin imagen</span>'

        # Limpiar HTML de imágenes antiguas
        if img_value.startswith("<div"):
            url_match = re.search(r'src="([^"]+)"', img_value)
            img_value = url_match.group(1) if url_match else ""

        if not img_value:
            return '<span style="color: #999;">Sin imagen</span>'

        width, height = ("200px", "150px") if detail else ("100px", "60px")
        font_size = "12px" if detail else "10px"

        return f"""
            <div style="text-align: center;">
                <img src="{img_value}" alt="Imagen"
                     style="max-width: {width}; max-height: {height}; object-fit: cover;
                            border-radius: 4px; cursor: pointer;"
                     onclick="window.open('{img_value}', '_blank')"
                     title="Click para ver imagen completa"/>
                <br><small style="color: #666; font-size: {font_size};">Click para ampliar</small>
            </div>
        """

    async def insert_model(self, request: Request, data: dict):
        """Crear modelo con procesamiento de múltiples imágenes"""
        data = await self._process_image_uploads(request, data, is_update=False)
        return await super().insert_model(request, data)

    async def edit_model(self, request: Request, pk: str, data: dict):
        """Actualizar modelo con procesamiento de múltiples imágenes"""
        data = await self._process_image_uploads(request, data, is_update=True, pk=pk)
        return await super().edit_model(request, pk, data)

    async def _process_image_uploads(
        self,
        request: Request,
        data: dict,
        is_update: bool = False,
        pk: Optional[str] = None,
    ) -> dict:
        """Procesar subida de múltiples imágenes"""
        form_data = await request.form()
        upload_service = FileUploadService()  # Ahora siempre usa GCS
        processed = data.copy()

        for field_name, subfolder in self.image_fields.items():
            image_file = form_data.get(field_name)

            if (
                image_file
                and hasattr(image_file, "filename")
                and image_file.filename.strip()
            ):
                # Si es edición, eliminar la imagen anterior
                if is_update and pk:
                    await self._delete_old_image(pk, field_name)

                # Subir nueva imagen
                image_url = await upload_service.execute(
                    image_file, subfolder=subfolder
                )
                processed[field_name] = image_url

            # Si se intentó subir pero el archivo es inválido
            elif hasattr(processed.get(field_name, {}), "filename"):
                processed.pop(field_name, None)

            # Limpiar HTML (casos antiguos)
            image_value = processed.get(field_name)
            if isinstance(image_value, str) and image_value.startswith("<div"):
                url_match = re.search(r'src="([^"]+)"', image_value)
                processed[field_name] = url_match.group(1) if url_match else ""

        return processed

    async def _delete_old_image(self, pk: str, field_name: str):
        """Eliminar imagen anterior al actualizar"""
        try:
            if hasattr(self, "model") and self.model:
                with SessionLocal() as session:
                    stmt = select(getattr(self.model, field_name)).where(
                        self.primary_key_field == pk
                    )
                    result = session.execute(stmt)
                    current_img = result.scalar_one_or_none()

                    if current_img and not current_img.startswith("<div"):
                        upload_service = FileUploadService(upload_directory="uploads")
                        _ = asyncio.create_task(
                            upload_service.delete_image(current_img)
                        )
        except Exception:
            pass

    def is_accessible(self, request: Request) -> bool:
        """Habilita el acceso libre (personaliza si quieres autenticación)"""
        return True

    # Columnas visibles en tabla
    column_list = [
        AppInfoModel.app_info_id,
        AppInfoModel.site_name,
        AppInfoModel.site_icon,
        AppInfoModel.site_logo,
        AppInfoModel.accounts,
    ]

    column_details_list = column_list

    # Campos editables
    form_columns = [
        AppInfoModel.site_name,
        AppInfoModel.site_icon,
        AppInfoModel.site_logo,
        AppInfoModel.accounts,
    ]

    # Etiquetas personalizadas
    column_labels = {
        AppInfoModel.app_info_id: "ID de Información",
        AppInfoModel.site_name: "Nombre del Sitio",
        AppInfoModel.site_icon: "Ícono del Sitio",
        AppInfoModel.site_logo: "Logo del Sitio",
        AppInfoModel.accounts: "Cuentas Asociadas",
    }

    # Formato de columnas (tabla principal)
    column_formatters = {
        AppInfoModel.site_name: lambda m, a: m.site_name if m.site_name else "N/A",
        AppInfoModel.accounts: lambda m, a: Markup(
            "<ul>"
            + "".join(f"<li>{acc.account_owner_name}</li>" for acc in m.accounts)
            + "</ul>"
        ),
    }

    # Exportar
    can_export = True
    export_max_rows = 1000
    export_types = ["csv", "xlsx"]
