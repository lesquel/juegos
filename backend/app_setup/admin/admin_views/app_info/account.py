from infrastructure.db.models import AccountModel
from sqladmin import ModelView


class AccountAdmin(ModelView, model=AccountModel):
    name = "Cuenta"
    name_plural = "Cuentas"
    icon = "fa-solid fa-user"
    column_list = [
        AccountModel.account_id,
        AccountModel.account_owner_name,
        AccountModel.account_number,
        AccountModel.account_type,
    ]
    form_columns = [
        AccountModel.account_owner_name,
        AccountModel.account_number,
        AccountModel.account_description,
        AccountModel.account_type,
    ]
