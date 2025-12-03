"""OCR endpoints."""
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from app.services.ocr_service import ocr_service

router = APIRouter()


@router.post("/image")
async def ocr_image(
    file: UploadFile = File(...),
    lang: str = Form(default="eng")
):
    """Extract text from image using OCR.
    
    Args:
        file: Image file
        lang: Language code (e.g., 'eng', 'fra')
    
    Returns:
        Extracted text
    """
    try:
        content = await file.read()
        text = ocr_service.image_to_text(content, lang)
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/pdf")
async def ocr_pdf(
    file: UploadFile = File(...),
    lang: str = Form(default="eng")
):
    """Extract text from PDF using OCR.
    
    Args:
        file: PDF file
        lang: Language code
    
    Returns:
        Extracted text
    """
    try:
        content = await file.read()
        text = ocr_service.pdf_to_text_ocr(content, lang)
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/video")
async def ocr_video_frame(
    file: UploadFile = File(...),
    frame_time: float = Form(default=0),
    lang: str = Form(default="eng")
):
    """Extract text from video frame using OCR.
    
    Args:
        file: Video file
        frame_time: Time in seconds to extract frame
        lang: Language code
    
    Returns:
        Extracted text
    """
    try:
        content = await file.read()
        text = ocr_service.video_frame_to_text(content, frame_time, lang)
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
