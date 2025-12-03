"""IP Lookup endpoint."""
from fastapi import APIRouter, HTTPException, Path
from app.models.network import IPLookupResponse
from app.services.network_service import network_service

router = APIRouter()


@router.get("/{ip_address}", response_model=IPLookupResponse)
async def lookup_ip(ip_address: str = Path(..., description="IP address to lookup")):
    """Lookup IP address information.
    
    Args:
        ip_address: IP address to lookup
    
    Returns:
        Geographic and ISP information
    """
    try:
        result = await network_service.lookup_ip(ip_address)
        return IPLookupResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
