import uuid
from pathlib import Path
from typing import Optional

import aiofiles
from domain.interfaces import BaseUseCase, IFile
from infrastructure.core import settings


class FileUploadService(BaseUseCase):
    """Servicio para manejar la subida de archivos"""

    def __init__(self, upload_directory: str):
        super().__init__()
        self.upload_directory = upload_directory
        self.base_url = settings.app_settings.base_url

        # Crear directorio de subida si no existe
        Path(self.upload_directory).mkdir(parents=True, exist_ok=True)

    async def execute(self, file: IFile, subfolder: str) -> str:
        """
        Sube una imagen y retorna la URL pública

        Args:
            file: Archivo a subir
            subfolder: Subcarpeta donde guardar el archivo

        Returns:
            URL pública del archivo subido
        """
        try:
            # Crear subcarpeta si no existe
            subfolder_path = Path(self.upload_directory) / subfolder
            subfolder_path.mkdir(parents=True, exist_ok=True)

            # Generar nombre único para el archivo
            file_extension = self._get_file_extension(file.filename)
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            file_path = subfolder_path / unique_filename

            # Guardar archivo
            async with aiofiles.open(file_path, "wb") as f:
                content = await file.read()
                await f.write(content)

            # Retornar URL pública
            public_url = f"{self.base_url}/uploads/{subfolder}/{unique_filename}"

            self.logger.info(f"Archivo subido exitosamente: {public_url}")
            return public_url

        except Exception as e:
            self.logger.error(f"Error al subir archivo: {str(e)}")
            raise RuntimeError(f"Error al subir archivo: {str(e)}")

    def _get_file_extension(self, filename: Optional[str]) -> str:
        """Obtiene la extensión del archivo"""
        if not filename:
            return ".jpg"  # Extensión por defecto

        return Path(filename).suffix.lower()

    async def delete_image(self, image_url: str) -> bool:
        """
        Elimina una imagen del sistema de archivos

        Args:
            image_url: URL de la imagen a eliminar

        Returns:
            True si se eliminó exitosamente, False en caso contrario
        """
        try:
            # Extraer ruta relativa de la URL
            if "/uploads/" in image_url:
                relative_path = image_url.split("/uploads/", 1)[1]
                file_path = Path(self.upload_directory) / relative_path

                if file_path.exists():
                    file_path.unlink()
                    self.logger.info(f"Archivo eliminado exitosamente: {image_url}")
                    return True
                else:
                    self.logger.warning(f"Archivo no encontrado: {image_url}")
                    return False
            else:
                self.logger.warning(f"URL no válida para eliminación: {image_url}")
                return False

        except Exception as e:
            self.logger.error(f"Error al eliminar archivo: {str(e)}")
            return False

    def get_upload_directory(self) -> str:
        """Retorna el directorio de subida"""
        return self.upload_directory
