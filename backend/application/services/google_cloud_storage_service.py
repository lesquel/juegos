import uuid
from pathlib import Path
from typing import Optional

from google.cloud import storage
from application.mixins.logging_mixin import LoggingMixin
from domain.interfaces import BaseUseCase, IFile
from infrastructure.core import settings


class GoogleCloudStorageService(BaseUseCase, LoggingMixin):
    """Servicio para manejar la subida de archivos a Google Cloud Storage"""

    def __init__(self):
        super().__init__()
        self.storage_settings = settings.storage_settings
        self.bucket_name = self.storage_settings.gcs_bucket_name
        self.public_url_base = self.storage_settings.get_public_url_base()

        # Inicializar cliente de Google Cloud Storage
        self.client = self._initialize_storage_client()
        self.bucket = self.client.bucket(self.bucket_name)

    def _initialize_storage_client(self) -> storage.Client:
        """Inicializa el cliente de Google Cloud Storage"""
        try:
            # Intentar diferentes métodos de autenticación

            self.logger.info("Using GCS credentials from environment variable")
            credentials_info = self.storage_settings.gcs_credentials_json
            client = storage.Client.from_service_account_info(
                credentials_info, project=self.storage_settings.gcs_project_id
            )

            # Método 3: Credenciales por defecto (Cloud Run, gcloud auth)
            if not client:
                self.logger.info(
                    "Using default GCS credentials (Cloud Run or gcloud auth)"
                )
                client = storage.Client(project=self.storage_settings.gcs_project_id)

            # Verificar conectividad
            try:
                # Intentar listar el bucket para verificar conectividad
                bucket = client.bucket(self.bucket_name)
                bucket.exists()  # Esto hará la verificación
                self.logger.info(
                    f"Google Cloud Storage client initialized successfully for bucket: {self.bucket_name}"
                )
            except Exception as e:
                self.logger.warning(
                    f"Bucket verification failed, but client created: {e}"
                )

            return client

        except Exception as e:
            self.logger.error(f"Failed to initialize Google Cloud Storage client: {e}")
            self.logger.error("Make sure you have:")
            self.logger.error("1. Configured GCS credentials (file or environment)")
            self.logger.error("2. Set correct project ID and bucket name")
            self.logger.error("3. Proper permissions on the bucket")
            raise RuntimeError(f"Error initializing Google Cloud Storage: {e}")

    async def execute(self, file: IFile, subfolder: str) -> str:
        """
        Sube un archivo a Google Cloud Storage y retorna la URL pública

        Args:
            file: Archivo a subir
            subfolder: Subcarpeta donde guardar el archivo

        Returns:
            URL pública del archivo subido
        """
        try:
            # Validar archivo
            self._validate_file(file)

            # Generar nombre único para el archivo
            file_extension = self._get_file_extension(file.filename)
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            blob_name = f"{subfolder}/{unique_filename}"

            # Crear blob en el bucket
            blob = self.bucket.blob(blob_name)

            # Leer contenido del archivo
            content = await file.read()

            # Subir archivo
            blob.upload_from_string(
                content, content_type=self._get_content_type(file_extension)
            )

            # Con Acceso Uniforme a nivel de bucket, no se necesita hacer público individualmente
            # Los permisos se manejan a nivel de bucket mediante IAM

            # Generar URL pública
            public_url = f"{self.public_url_base}/{blob_name}"

            self.logger.info(f"Archivo subido exitosamente a GCS: {public_url}")
            return public_url

        except Exception as e:
            self.logger.error(f"Error al subir archivo a GCS: {str(e)}")
            raise RuntimeError(f"Error al subir archivo: {str(e)}")

    async def delete_image(self, image_url: str) -> bool:
        """
        Elimina una imagen de Google Cloud Storage

        Args:
            image_url: URL de la imagen a eliminar

        Returns:
            True si se eliminó exitosamente, False en caso contrario
        """
        try:
            # Extraer el nombre del blob de la URL
            blob_name = self._extract_blob_name_from_url(image_url)
            if not blob_name:
                self.logger.warning(
                    f"No se pudo extraer blob name de la URL: {image_url}"
                )
                return False

            # Obtener y eliminar el blob
            blob = self.bucket.blob(blob_name)
            if blob.exists():
                blob.delete()
                self.logger.info(f"Archivo eliminado exitosamente de GCS: {image_url}")
                return True
            else:
                self.logger.warning(f"Archivo no encontrado en GCS: {image_url}")
                return False

        except Exception as e:
            self.logger.error(f"Error al eliminar archivo de GCS: {str(e)}")
            return False

    def _validate_file(self, file: IFile) -> None:
        """Valida el archivo antes de subirlo"""
        if not file.filename:
            raise ValueError("El archivo debe tener un nombre")

        file_extension = self._get_file_extension(file.filename)
        allowed_extensions = self.storage_settings.storage_allowed_extensions

        if file_extension not in allowed_extensions:
            raise ValueError(
                f"Extensión de archivo no permitida: {file_extension}. "
                f"Extensiones permitidas: {', '.join(allowed_extensions)}"
            )

    def _get_file_extension(self, filename: Optional[str]) -> str:
        """Obtiene la extensión del archivo"""
        if not filename:
            return ".jpg"  # Extensión por defecto

        return Path(filename).suffix.lower()

    def _get_content_type(self, file_extension: str) -> str:
        """Determina el content type basado en la extensión"""
        content_types = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".gif": "image/gif",
            ".webp": "image/webp",
        }
        return content_types.get(file_extension, "application/octet-stream")

    def _extract_blob_name_from_url(self, url: str) -> Optional[str]:
        """Extrae el nombre del blob de la URL pública"""
        try:
            # Para URLs de Google Cloud Storage: https://storage.googleapis.com/bucket-name/path/to/file
            if "storage.googleapis.com" in url:
                parts = url.split(f"{self.bucket_name}/", 1)
                if len(parts) == 2:
                    return parts[1]

            # Para URLs personalizadas con base URL personalizada
            if (
                self.storage_settings.storage_public_url_base
                and self.storage_settings.storage_public_url_base in url
            ):
                parts = url.split(
                    f"{self.storage_settings.storage_public_url_base}/", 1
                )
                if len(parts) == 2:
                    return parts[1]

            return None

        except Exception as e:
            self.logger.error(f"Error extrayendo blob name de URL: {e}")
            return None

    def get_bucket_info(self) -> dict:
        """Retorna información del bucket para debugging"""
        try:
            bucket_info = {
                "bucket_name": self.bucket_name,
                "project_id": self.storage_settings.gcs_project_id,
                "public_url_base": self.public_url_base,
                "bucket_exists": self.bucket.exists(),
            }
            return bucket_info
        except Exception as e:
            self.logger.error(f"Error obteniendo información del bucket: {e}")
            return {"error": str(e)}
