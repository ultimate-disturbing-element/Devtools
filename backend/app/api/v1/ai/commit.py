"""AI Commit Message Generator endpoint."""
from fastapi import APIRouter, HTTPException
from app.models.ai import CommitMessageRequest, CommitMessageResponse
from app.services.ai_service import ai_service

router = APIRouter()


@router.post("/generate", response_model=CommitMessageResponse)
async def generate_commit_message(request: CommitMessageRequest):
    """Generate a commit message using AI.
    
    Args:
        request: Commit message generation parameters
    
    Returns:
        Generated commit messages in various formats
    """
    try:
        result = await ai_service.generate_commit_message(
            diff=request.diff,
            description=request.description
        )
        
        return CommitMessageResponse(
            short_message=result["short_message"],
            extended_message=result["extended_message"],
            conventional_format=result["conventional_format"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
