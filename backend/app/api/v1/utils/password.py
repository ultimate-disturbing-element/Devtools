"""Password tools endpoints."""
from fastapi import APIRouter, HTTPException
from app.models.utils import (
    PasswordCheckRequest,
    PasswordCheckResponse,
    PasswordGenerateRequest,
    PasswordGenerateResponse
)
from app.services.utils_service import utils_service

router = APIRouter()


@router.post("/check", response_model=PasswordCheckResponse)
async def check_password_strength(request: PasswordCheckRequest):
    """Check password strength.
    
    Args:
        request: Password to check
    
    Returns:
        Password strength analysis
    """
    try:
        result = utils_service.check_password_strength(request.password)
        return PasswordCheckResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/generate", response_model=PasswordGenerateResponse)
async def generate_password(request: PasswordGenerateRequest):
    """Generate a secure password.
    
    Args:
        request: Password generation parameters
    
    Returns:
        Generated password with strength score
    """
    try:
        password = utils_service.generate_password(
            length=request.length,
            include_uppercase=request.include_uppercase,
            include_lowercase=request.include_lowercase,
            include_numbers=request.include_numbers,
            include_symbols=request.include_symbols
        )
        
        # Check strength of generated password
        strength = utils_service.check_password_strength(password)
        
        return PasswordGenerateResponse(
            password=password,
            strength_score=strength["score"]
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
