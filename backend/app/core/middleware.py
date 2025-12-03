"""Middleware for request/response handling."""
from fastapi import Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from .exceptions import DevToolsException
import time
import logging

logger = logging.getLogger(__name__)


class ErrorHandlerMiddleware(BaseHTTPMiddleware):
    """Middleware to handle exceptions globally."""
    
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response
        except DevToolsException as exc:
            logger.error(f"DevToolsException: {exc.message}")
            return JSONResponse(
                status_code=exc.status_code,
                content={
                    "error": exc.message,
                    "status_code": exc.status_code
                }
            )
        except Exception as exc:
            logger.error(f"Unhandled exception: {str(exc)}")
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={
                    "error": "Internal server error",
                    "status_code": 500
                }
            )


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware to log incoming requests."""
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        logger.info(f"Request: {request.method} {request.url.path}")
        
        response = await call_next(request)
        
        process_time = time.time() - start_time
        logger.info(
            f"Response: {request.method} {request.url.path} "
            f"Status: {response.status_code} Time: {process_time:.3f}s"
        )
        
        response.headers["X-Process-Time"] = str(process_time)
        return response
