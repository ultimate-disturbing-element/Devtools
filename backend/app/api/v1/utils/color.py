"""Color tools endpoints."""
from fastapi import APIRouter, HTTPException
from app.models.utils import (
    ColorConvertRequest,
    ColorConvertResponse,
    ColorPaletteRequest,
    ColorPaletteResponse
)
from app.services.utils_service import utils_service

router = APIRouter()


@router.post("/convert", response_model=ColorConvertResponse)
async def convert_color(request: ColorConvertRequest):
    """Convert color between HEX, RGB, and HSL formats.
    
    Args:
        request: Color to convert
    
    Returns:
        Color in all formats
    """
    try:
        result = utils_service.convert_color(request.color)
        return ColorConvertResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/palette", response_model=ColorPaletteResponse)
async def generate_palette(request: ColorPaletteRequest):
    """Generate color palette (shades and tints).
    
    Args:
        request: Base color and count
    
    Returns:
        Shades and tints
    """
    try:
        result = utils_service.generate_color_palette(
            base_color=request.base_color,
            count=request.count
        )
        return ColorPaletteResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
