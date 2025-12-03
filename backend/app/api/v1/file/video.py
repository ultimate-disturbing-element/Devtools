"""Video to GIF conversion endpoint."""
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import Response
from app.services.video_service import video_service

router = APIRouter()


@router.post("/to-gif")
async def video_to_gif(
    file: UploadFile = File(...),
    start_time: float = Form(default=0),
    duration: float = Form(default=5),
    fps: int = Form(default=10),
    width: int = Form(default=480)
):
    """Convert video to GIF.
    
    Args:
        file: Video file
        start_time: Start time in seconds
        duration: Duration in seconds
        fps: Frames per second
        width: Width of GIF
    
    Returns:
        GIF file
    """
    try:
        content = await file.read()
        
        gif_bytes = video_service.video_to_gif(
            video_bytes=content,
            start_time=start_time,
            duration=duration,
            fps=fps,
            width=width
        )
        
        return Response(
            content=gif_bytes,
            media_type="image/gif",
            headers={"Content-Disposition": "attachment; filename=output.gif"}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
