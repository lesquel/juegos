from pathlib import Path
from typing import Optional

from domain.interfaces import BaseUseCase, IFile
from infrastructure.core import settings

from .google_cloud_storage_service import GoogleCloudStorageService


class FileUploadService(BaseUseCase):
    """Servicio para manejar la subida de archivos"""

    def __init__(self):
        super().__init__()
        self.app_settings = settings.app_settings

        # SIEMPRE usar Google Cloud Storage - tanto en desarrollo como producción
        try:
            self.storage_service = GoogleCloudStorageService()
            self.logger.info(
                "Successfully initialized Google Cloud Storage for file uploads"
            )
        except Exception as e:
            self.logger.error(f"Failed to initialize Google Cloud Storage: {e}")
            self.logger.error(
                "Google Cloud Storage is required. Please check your configuration:"
            )
            self.logger.error("1. GCS_BUCKET_NAME environment variable")
            self.logger.error("2. GCS credentials (file or JSON)")
            self.logger.error("3. Proper permissions on the bucket")
            raise RuntimeError(
                f"Google Cloud Storage initialization failed: {e}. "
                "Local storage is not supported in this version."
            )

    async def execute(self, file: IFile, subfolder: str) -> str:
        """
        Sube una imagen y retorna la URL pública

        Args:
            file: Archivo a subir
            subfolder: Subcarpeta donde guardar el archivo

        Returns:
            URL pública del archivo subido
        """
        # Siempre usar Google Cloud Storage
        return await self.storage_service.execute(file, subfolder)

    def _get_file_extension(self, filename: Optional[str]) -> str:
        """Obtiene la extensión del archivo"""
        if not filename:
            return ".jpg"  # Extensión por defecto

        return Path(filename).suffix.lower()

    async def delete_image(self, image_url: str) -> bool:
        """
        Elimina una imagen de Google Cloud Storage

        Args:
            image_url: URL de la imagen a eliminar

        Returns:
            True si se eliminó exitosamente, False en caso contrario
        """
        # Siempre usar Google Cloud Storage
        return await self.storage_service.delete_image(image_url)

    def get_upload_directory(self) -> str:
        """Retorna información del bucket de Google Cloud Storage"""
        return f"Google Cloud Storage Bucket: {self.storage_service.bucket_name}"

    def get_storage_info(self) -> dict:
        """Retorna información del storage configurado"""
        return {
            "type": "Google Cloud Storage",
            "bucket_info": self.storage_service.get_bucket_info(),
        }
