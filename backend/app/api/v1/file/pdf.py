"""PDF tools endpoints."""
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import Response
from typing import List
from app.services.pdf_service import pdf_service

router = APIRouter()


@router.post("/merge")
async def merge_pdfs(files: List[UploadFile] = File(...)):
    """Merge multiple PDF files.
    
    Args:
        files: List of PDF files
    
    Returns:
        Merged PDF file
    """
    try:
        pdf_bytes_list = []
        for file in files:
            content = await file.read()
            pdf_bytes_list.append(content)
        
        merged_pdf = pdf_service.merge_pdfs(pdf_bytes_list)
        
        return Response(
            content=merged_pdf,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=merged.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/split")
async def split_pdf(
    file: UploadFile = File(...),
    pages: str = Form(default="all")
):
    """Split PDF into separate pages or ranges.
    
    Args:
        file: PDF file
        pages: Page ranges (e.g., "all", "1-3,5,7-9")
    
    Returns:
        ZIP file containing split PDFs (for simplicity, returning first page)
    """
    try:
        content = await file.read()
        split_pdfs = pdf_service.split_pdf(content, pages)
        
        # Return first split (in production, return ZIP)
        if split_pdfs:
            return Response(
                content=split_pdfs[0],
                media_type="application/pdf",
                headers={"Content-Disposition": "attachment; filename=page_1.pdf"}
            )
        else:
            raise HTTPException(status_code=400, detail="No pages to split")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/to-text")
async def pdf_to_text(file: UploadFile = File(...)):
    """Extract text from PDF.
    
    Args:
        file: PDF file
    
    Returns:
        Extracted text
    """
    try:
        content = await file.read()
        text = pdf_service.pdf_to_text(content)
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/from-text")
async def text_to_pdf(text: str = Form(...)):
    """Convert text to PDF.
    
    Args:
        text: Text content
    
    Returns:
        PDF file
    """
    try:
        pdf_bytes = pdf_service.text_to_pdf(text)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=document.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
