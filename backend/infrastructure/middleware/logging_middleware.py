import time
import uuid
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from infrastructure.logging import get_logger

logger = get_logger("http_requests")


class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware para logging automático de requests HTTP"""

    async def dispatch(self, request: Request, call_next):
        # Generar ID único para el request
        request_id = str(uuid.uuid4())[:8]
        
        # Información del request
        method = request.method
        url = str(request.url)
        client_ip = request.client.host if request.client else "unknown"
        user_agent = request.headers.get("user-agent", "unknown")
        
        # Log del inicio del request
        logger.info(
            f"[{request_id}] {method} {url} - IP: {client_ip} - User-Agent: {user_agent[:50]}..."
        )
        
        # Timing
        start_time = time.time()
        
        try:
            # Procesar request
            response = await call_next(request)
            
            # Calcular tiempo de procesamiento
            process_time = time.time() - start_time
            
            # Log del response exitoso
            logger.info(
                f"[{request_id}] {method} {url} - Status: {response.status_code} - "
                f"Time: {process_time:.3f}s"
            )
            
            # Agregar headers de debugging
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Process-Time"] = f"{process_time:.3f}"
            
            return response
            
        except Exception as e:
            # Calcular tiempo incluso en caso de error
            process_time = time.time() - start_time
            
            # Log del error
            logger.error(
                f"[{request_id}] {method} {url} - ERROR: {str(e)} - Time: {process_time:.3f}s"
            )
            
            # Re-lanzar la excepción
            raise
