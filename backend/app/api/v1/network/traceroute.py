"""Traceroute endpoint."""
from fastapi import APIRouter, HTTPException
from app.models.network import TracerouteRequest, TracerouteResponse
from app.services.network_service import network_service

router = APIRouter()


@router.post("", response_model=TracerouteResponse)
async def traceroute_host(request: TracerouteRequest):
    """Perform traceroute to a host.
    
    Args:
        request: Traceroute parameters
    
    Returns:
        List of hops
    """
    try:
        result = await network_service.traceroute(request.host, request.max_hops)
        return TracerouteResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
