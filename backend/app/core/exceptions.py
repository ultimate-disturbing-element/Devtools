"""Custom exceptions for the application."""


class DevToolsException(Exception):
    """Base exception for all application errors."""
    
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class FileProcessingError(DevToolsException):
    """Exception raised when file processing fails."""
    
    def __init__(self, message: str):
        super().__init__(message, status_code=400)


class ValidationError(DevToolsException):
    """Exception raised when validation fails."""
    
    def __init__(self, message: str):
        super().__init__(message, status_code=422)


class AIServiceError(DevToolsException):
    """Exception raised when AI service fails."""
    
    def __init__(self, message: str):
        super().__init__(message, status_code=503)


class NetworkError(DevToolsException):
    """Exception raised when network operations fail."""
    
    def __init__(self, message: str):
        super().__init__(message, status_code=500)
