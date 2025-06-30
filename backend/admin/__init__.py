"""
Módulo de administración para el backend de juegos
"""

from .admin_views import UserAdmin
from .authentication_backend import authentication_backend, AdminAuth
from .admin_config import initialize_admin

list_admin_views = [UserAdmin]

