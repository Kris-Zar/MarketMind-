"""Domain and application errors mapped cleanly at the HTTP boundary."""

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


class AppError(Exception):
    """Base application error carrying a safe user-facing message."""

    def __init__(self, code: str, message: str, status_code: int = 400) -> None:
        super().__init__(message)
        self.code = code
        self.message = message
        self.status_code = status_code


class NotFoundError(AppError):
    """Raised when a requested entity does not exist."""

    def __init__(self, entity: str, identifier: str) -> None:
        super().__init__(
            code="not_found",
            message=f"{entity} '{identifier}' was not found.",
            status_code=404,
        )


class ValidationAppError(AppError):
    """Raised when domain validation fails."""

    def __init__(self, message: str) -> None:
        super().__init__(code="validation_error", message=message, status_code=422)


def register_exception_handlers(app: FastAPI) -> None:
    """Register global exception handlers that never leak stack traces or secrets."""

    @app.exception_handler(AppError)
    async def handle_app_error(_request: Request, exc: AppError) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": {"code": exc.code, "message": exc.message}},
        )
