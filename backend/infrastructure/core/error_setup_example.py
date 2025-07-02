"""
Ejemplo de uso del sistema de errores simplificado - Estilo Django
"""

from fastapi import FastAPI
from interfaces.api.common.exception_handler import setup_exception_handlers
from infrastructure.core.error_utils import ErrorChecker, ErrorRaiser, require_service_id

def setup_error_handling(app: FastAPI):
    """
    Configura el sistema de manejo de errores (similar a Django)
    """
    setup_exception_handlers(app)
    print("✅ Sistema de manejo de errores configurado (estilo Django)")


# ========== EJEMPLO DE USO EN VISTAS/CONTROLADORES ==========

"""
# Ejemplo similar a tu vista de Django:

@router.post("/games/{game_id}/remove-service")
async def remove_service(game_id: str, request: dict):
    # Obtener el juego
    game = game_service.get_by_id(game_id)
    ErrorChecker.ensure_exists(game, "Game", game_id)
    
    # Verificar estado del juego
    if game.status != "pending":
        raise CannotDeletePendingEventRentalError()
    
    # Validar service_id
    service_id = request.get("service_id")
    require_service_id(service_id)  # Función específica como en Django
    
    # Obtener servicio
    service = service_service.get_by_id(service_id)
    ErrorChecker.ensure_exists(service, "Service", service_id)
    
    # Verificar asociación
    association = get_game_service_association(game_id, service_id)
    if not association:
        raise ServiceNotAssociatedError()
    
    # Eliminar asociación
    delete_association(association.id)
    
    return {"detail": "Service removed successfully"}


# ========== RESPUESTAS AUTOMÁTICAS DEL MIDDLEWARE ==========

# Cuando lanzas ErrorChecker.ensure_exists(game, "Game", "abc123")
# El middleware automáticamente devuelve:
{
    "errors": {
        "game_not_found": ["Game not found with identifier: abc123"]
    },
    "code": 404
}

# Cuando lanzas require_service_id(None)
# El middleware automáticamente devuelve:
{
    "errors": {
        "service_id_required": ["service_id is required"]
    },
    "code": 400
}

# Para errores de validación de Pydantic:
{
    "errors": {
        "email": ["field required"],
        "password": ["ensure this value has at least 8 characters"]
    },
    "code": 400
}

# Para errores genéricos no capturados:
{
    "errors": {
        "internal_server_error": ["division by zero"]
    },
    "code": 500
}
"""

# ========== EJEMPLO COMPLETO DE SERVICIO ==========

class GameService:
    """Ejemplo de servicio usando el sistema de errores"""
    
    def get_game_by_id(self, game_id: str):
        """Obtener juego por ID"""
        game = self.repository.find_by_id(game_id)
        # Si no existe, automáticamente lanza GameNotFoundError con código 404
        return ErrorChecker.ensure_exists(game, "Game", game_id)
    
    def create_game(self, name: str, description: str):
        """Crear nuevo juego"""
        # Verificar que no exista ya
        existing_game = self.repository.find_by_name(name)
        ErrorChecker.ensure_not_exists(existing_game, "Game", name)
        
        # Validaciones
        ErrorChecker.ensure_valid(len(name) >= 3, "Game name must be at least 3 characters")
        ErrorChecker.ensure_valid(len(description) >= 10, "Game description must be at least 10 characters")
        
        # Crear el juego
        return self.repository.create(name, description)
    
    def delete_game(self, game_id: str, user_role: str):
        """Eliminar juego"""
        game = self.get_game_by_id(game_id)  # Ya verifica existencia
        
        # Verificar permisos
        ErrorChecker.ensure_authorized(user_role == "admin", "Only admins can delete games")
        
        # Verificar regla de negocio
        ErrorChecker.ensure_business_rule(
            game.matches_count == 0,
            "Cannot delete game with active matches",
            "game_has_matches"
        )
        
        return self.repository.delete(game_id)
