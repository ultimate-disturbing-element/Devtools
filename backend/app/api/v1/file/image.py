"""Image conversion endpoints."""
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import Response
from typing import Optional
from app.services.image_service import image_service

router = APIRouter()


@router.post("/convert")
async def convert_image(
    file: UploadFile = File(...),
    target_format: str = Form(...),
    width: Optional[int] = Form(None),
    height: Optional[int] = Form(None),
    quality: int = Form(default=85)
):
    """Convert image to different format.
    
    Args:
        file: Image file
        target_format: Target format (png, jpg, jpeg, webp)
        width: Optional width for resizing
        height: Optional height for resizing
        quality: Quality for lossy formats (1-100)
    
    Returns:
        Converted image
    """
    try:
        content = await file.read()
        
        resize = None
        if width and height:
            resize = (width, height)
        
        converted = image_service.convert_image(
            image_bytes=content,
            target_format=target_format,
            resize=resize,
            quality=quality
        )
        
        media_type = f"image/{target_format.lower()}"
        
        return Response(
            content=converted,
            media_type=media_type,
            headers={"Content-Disposition": f"attachment; filename=converted.{target_format}"}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/info")
async def get_image_info(file: UploadFile = File(...)):
    """Get image information.
    
    Args:
        file: Image file
    
    Returns:
        Image metadata
    """
    try:
        content = await file.read()
        info = image_service.get_image_info(content)
        return info
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
