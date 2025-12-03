"""Ping endpoint."""
from fastapi import APIRouter, HTTPException
from app.models.network import PingRequest, PingResponse
from app.services.network_service import network_service

router = APIRouter()


@router.post("", response_model=PingResponse)
async def ping_host(request: PingRequest):
    """Ping a host.
    
    Args:
        request: Ping parameters
    
    Returns:
        Ping statistics
    """
    try:
        result = await network_service.ping(request.host, request.count)
        return PingResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
