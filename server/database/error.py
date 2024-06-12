class DatabaseException(Exception):
    def __init__(self, message = "An error occurred when interact with database!"):
        self.message = message
        super().__init__(self.message)

class EntityException(Exception):
    def __init__(self, message = "An error occurred when interact with entity!"):
        self.message = message
        super().__init__(self.message)

class OperationFailed(Exception):
    def __init__(self, message = "An error occurred when implement this operation!") -> None:
        self.message = message
        super().__init__(self.message)