"""UUID Generator endpoint."""
from fastapi import APIRouter, Query

from app.services.utils_service import utils_service

router = APIRouter()


@router.get("/generate")
async def generate_uuids(count: int = Query(default=1, ge=1, le=100)):
    """Generate UUID v4 identifiers.
    
    Args:
        count: Number of UUIDs to generate (1-100)
    
    Returns:
        List of UUIDs
    """
    uuids = utils_service.generate_uuids(count)
    return {"uuids": uuids, "count": len(uuids)}
