"""CURL Command Builder endpoint."""
from fastapi import APIRouter, HTTPException
from app.models.network import CURLBuildRequest, CURLBuildResponse
from app.services.network_service import network_service

router = APIRouter()


@router.post("/build", response_model=CURLBuildResponse)
async def build_curl_command(request: CURLBuildRequest):
    """Build a CURL command from parameters.
    
    Args:
        request: CURL parameters
    
    Returns:
        Generated CURL command
    """
    try:
        command = network_service.build_curl_command(
            url=request.url,
            method=request.method,
            headers=request.headers,
            body=request.body,
            auth=request.auth
        )
        return CURLBuildResponse(command=command)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
