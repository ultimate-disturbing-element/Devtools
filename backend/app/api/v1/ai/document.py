"""AI Document Generator endpoint."""
from fastapi import APIRouter, HTTPException
from app.models.ai import DocumentGenerateRequest, DocumentGenerateResponse
from app.services.ai_service import ai_service

router = APIRouter()


@router.post("/generate", response_model=DocumentGenerateResponse)
async def generate_document(request: DocumentGenerateRequest):
    """Generate a document using AI.
    
    Args:
        request: Document generation parameters
    
    Returns:
        Generated document content
    """
    try:
        content, format_type = await ai_service.generate_document(
            title=request.title,
            description=request.description,
            tone=request.tone,
            format=request.format
        )
        
        return DocumentGenerateResponse(
            content=content,
            format=format_type,
            download_url=None  # Could implement file storage here
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
