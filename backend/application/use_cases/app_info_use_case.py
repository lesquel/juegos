from .base_use_case import BaseUseCase



class GetAppInfoUseCase(BaseUseCase):
    def __init__(self, app_info_repository):
        self.app_info_repository = app_info_repository
    
    def execute(self):
        return self.app_info_repository.get_app_info()