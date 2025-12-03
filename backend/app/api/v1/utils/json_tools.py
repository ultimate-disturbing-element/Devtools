"""JSON tools endpoints."""
from fastapi import APIRouter, HTTPException
from app.models.utils import (
    JSONValidateRequest,
    JSONValidateResponse,
    JSONDiffRequest,
    JSONDiffResponse
)
from app.services.utils_service import utils_service

router = APIRouter()


@router.post("/validate", response_model=JSONValidateResponse)
async def validate_json(request: JSONValidateRequest):
    """Validate and format JSON.
    
    Args:
        request: JSON string to validate
    
    Returns:
        Validation result with formatted JSON
    """
    try:
        result = utils_service.validate_json(request.json_string)
        return JSONValidateResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/diff", response_model=JSONDiffResponse)
async def diff_json(request: JSONDiffRequest):
    """Compare two JSON objects.
    
    Args:
        request: Two JSON strings to compare
    
    Returns:
        Diff showing added, removed, and modified keys
    """
    try:
        result = utils_service.diff_json(request.json1, request.json2)
        return JSONDiffResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
