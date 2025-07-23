import asyncio
import re
from typing import Optional

from application.services.file_upload_service import FileUploadService
from infrastructure.db.connection import SessionLocal
from markupsafe import Markup
from sqlalchemy import select
from starlette.requests import Request
from wtforms import FileField, validators


class ImageUploadAdminMixin:
    """Mixin para manejar subida de imágenes en vistas de administración"""

    @property
    def image_field_name(self) -> str:
        """Nombre del campo de imagen en el modelo"""
        raise NotImplementedError("Debe implementar image_field_name")

    @property
    def image_subfolder(self) -> str:
        """Subcarpeta donde se guardarán las imágenes"""
        raise NotImplementedError("Debe implementar image_subfolder")

    @property
    def primary_key_field(self):
        """Campo de clave primaria del modelo"""
        raise NotImplementedError("Debe implementar primary_key_field")

    def setup_image_handling(self):
        """Configurar el manejo de imágenes (llamar en __init__)"""
        self._setup_image_field()
        self._setup_image_formatters()

    def _setup_image_field(self):
        """Configurar el campo de imagen en el formulario"""
        if not hasattr(self, "form_overrides"):
            self.form_overrides = {}
        if not hasattr(self, "form_args"):
            self.form_args = {}

        self.form_overrides[self.image_field_name] = FileField
        self.form_args[self.image_field_name] = {
            "label": "Imagen",
            "validators": [validators.Optional()],
            "render_kw": {"accept": "image/*", "class": "form-control-file"},
        }

    def _setup_image_formatters(self):
        """Configurar formateadores de imagen para tabla y detalles"""
        if not hasattr(self, "column_formatters"):
            self.column_formatters = {}
        if not hasattr(self, "column_formatters_detail"):
            self.column_formatters_detail = {}

        # Formatter para tabla (imagen pequeña)
        self.column_formatters[self.image_field_name] = lambda m, a: Markup(
            self._render_img(getattr(m, self.image_field_name), detail=False)
        )

        # Formatter para vista de detalle (imagen grande)
        self.column_formatters_detail[self.image_field_name] = lambda m, a: Markup(
            self._render_img(getattr(m, self.image_field_name), detail=True)
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
        """Crear modelo con procesamiento de imagen"""
        data = await self._process_image_upload(request, data, is_update=False)
        return await super().insert_model(request, data)

    async def edit_model(self, request: Request, pk: str, data: dict):
        """Actualizar modelo con procesamiento de imagen"""
        data = await self._process_image_upload(request, data, is_update=True, pk=pk)
        return await super().edit_model(request, pk, data)

    async def _process_image_upload(
        self,
        request: Request,
        data: dict,
        is_update: bool = False,
        pk: Optional[str] = None,
    ) -> dict:
        """Procesar subida de imagen"""
        form_data = await request.form()
        upload_service = FileUploadService(upload_directory="uploads")
        processed = data.copy()

        image_file = form_data.get(self.image_field_name)

        if (
            image_file
            and hasattr(image_file, "filename")
            and image_file.filename.strip()
        ):
            # Si es edición, eliminar la imagen anterior
            if is_update and pk:
                await self._delete_old_image(pk)

            # Subir nueva imagen
            image_url = await upload_service.execute(
                image_file, subfolder=self.image_subfolder
            )
            processed[self.image_field_name] = image_url

        # Si se intentó subir pero el archivo es inválido
        elif hasattr(processed.get(self.image_field_name, {}), "filename"):
            processed.pop(self.image_field_name, None)

        # Limpiar HTML (casos antiguos)
        image_value = processed.get(self.image_field_name)
        if isinstance(image_value, str) and image_value.startswith("<div"):
            url_match = re.search(r'src="([^"]+)"', image_value)
            processed[self.image_field_name] = url_match.group(1) if url_match else ""

        return processed

    async def _delete_old_image(self, pk: str):
        """Eliminar imagen anterior al actualizar"""
        try:
            if hasattr(self, "model") and self.model:
                with SessionLocal() as session:
                    stmt = select(getattr(self.model, self.image_field_name)).where(
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
