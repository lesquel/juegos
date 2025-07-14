


from application.services.file_upload_service import FileUploadService


def get_file_upload_service() -> FileUploadService:
    """
    Proveedor para el servicio de subida de archivos.

    Returns:
        FileUploadService: Servicio de subida de archivos configurado
    """
    return FileUploadService(upload_directory="uploads")


__all__ = [
    "get_file_upload_service",
]