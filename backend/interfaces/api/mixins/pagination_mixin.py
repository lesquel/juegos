from interfaces.api.common.pagination import PaginationParams


class PaginationMixin:

    def apply_pagination(self, query, pagination: PaginationParams):
        return query.offset(pagination.offset).limit(pagination.limit)
