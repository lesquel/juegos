from abc import abstractmethod

from app.entities import User


class UserRepository:

    @abstractmethod
    def get_all(self) -> list[User]:
        """
        Retrieves all users from the repository.

        :return: A list of User objects.
        """
        pass

    @abstractmethod
    def get_by_id(self, user_id: str) -> User:
        """
        Retrieves a user by their ID.

        :param user_id: The ID of the user to retrieve.
        :return: The User object corresponding to the given ID.
        """
        pass

    @abstractmethod
    def get_by_email(self, email: str) -> User:
        """
        Retrieves a user by their email address.

        :param email: The email address of the user to retrieve.
        :return: The User object corresponding to the given email.
        """
        pass

    @abstractmethod
    def save(self, user: User) -> None:
        """
        Saves a user to the repository.

        :param user: The User object to save.
        :return: None
        """
        pass

    @abstractmethod
    def update(self, user_id: str, user: User) -> None:
        """
        Updates a user in the repository.

        :param user: The User object with updated information.
        :return: None
        """
        pass

    @abstractmethod
    def delete(self, user_id: str) -> None:
        """
        Deletes a user from the repository by their ID.

        :param user_id: The ID of the user to delete.
        :return: None
        """
        pass
