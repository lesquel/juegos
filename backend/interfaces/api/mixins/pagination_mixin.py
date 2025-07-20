from interfaces.api.common.pagination import PaginationParams


class PaginationMixin:
    def apply_pagination(self, stmt, pagination: PaginationParams):
        return stmt.offset(pagination.offset).limit(pagination.limit)
