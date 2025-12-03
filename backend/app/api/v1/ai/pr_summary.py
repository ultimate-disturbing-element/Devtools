"""AI PR Summary Generator endpoint."""
from fastapi import APIRouter, HTTPException
from app.models.ai import PRSummaryRequest, PRSummaryResponse
from app.services.ai_service import ai_service

router = APIRouter()


@router.post("/summarize", response_model=PRSummaryResponse)
async def generate_pr_summary(request: PRSummaryRequest):
    """Generate a PR summary using AI.
    
    Args:
        request: PR summary generation parameters
    
    Returns:
        PR summary with risks, changes, and testing suggestions
    """
    try:
        result = await ai_service.generate_pr_summary(
            pr_description=request.pr_description,
            diff=request.diff
        )
        
        return PRSummaryResponse(
            summary=result["summary"],
            risks=result["risks"],
            changes=result["changes"],
            testing_suggestions=result["testing_suggestions"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
