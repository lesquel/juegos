from application.services.file_upload_service import FileUploadService


def get_file_upload_service() -> FileUploadService:
    """
    Proveedor para el servicio de subida de archivos.
    Ahora se autoconfigura para usar Google Cloud Storage en producción
    o almacenamiento local en desarrollo.

    Returns:
        FileUploadService: Servicio de subida de archivos configurado
    """
    # El servicio ahora se autoconfigura internamente
    return FileUploadService()


__all__ = [
    "get_file_upload_service",
]
