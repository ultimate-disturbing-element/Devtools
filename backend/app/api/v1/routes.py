from fastapi import APIRouter
from .ai.pdf_export import router as pdf_export_router

# Create main router
router = APIRouter()

# Import all sub-routers
from .ai.document_generator import router as document_generator_router

# Register routes
router.include_router(
    document_generator_router,
    prefix="/ai/document",
    tags=["AI Document Generator"]
)

router.include_router(
    pdf_export_router, 
    prefix="/ai/pdf", 
    tags=["PDF Export"]
)