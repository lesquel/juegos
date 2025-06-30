#!/usr/bin/env python3
"""
Script de prueba para verificar que el sistema de logging funciona correctamente
"""

import sys
import os

# Agregar el directorio raíz al path para las importaciones
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from infrastructure.logging import get_logger, LoggingConfig

def test_logging():
    """Prueba el sistema de logging"""
    
    print("=== TESTING LOGGING SYSTEM ===")
    
    # Obtener diferentes loggers
    app_logger = get_logger("app")
    auth_logger = get_logger("auth_routes")
    db_logger = get_logger("user_repository")
    
    # Probar diferentes niveles de logging
    print("\n1. Testing different log levels:")
    app_logger.debug("This is a DEBUG message")
    app_logger.info("This is an INFO message")
    app_logger.warning("This is a WARNING message")
    app_logger.error("This is an ERROR message")
    
    print("\n2. Testing different loggers:")
    auth_logger.info("Login attempt for user: test@example.com")
    auth_logger.warning("Failed login attempt for user: test@example.com")
    
    db_logger.debug("Getting user by email: test@example.com")
    db_logger.info("User found in database: test@example.com")
    
    print("\n3. Testing exception logging:")
    try:
        raise ValueError("This is a test exception")
    except Exception as e:
        app_logger.error(f"Exception occurred: {str(e)}")
    
    print("\n✅ Logging test completed!")
    print("📂 Check the logs/ directory for generated log files")
    print("📄 Expected files: dev.log, dev_errors.log")


if __name__ == "__main__":
    test_logging()
