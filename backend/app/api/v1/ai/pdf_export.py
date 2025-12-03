from fastapi import APIRouter
from pydantic import BaseModel
from fastapi.responses import FileResponse
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import uuid
import os

router = APIRouter()

class PDFRequest(BaseModel):
    text: str
    title: str

@router.post("/export", response_class=FileResponse)
async def export_pdf(payload: PDFRequest):
    file_id = str(uuid.uuid4())
    file_path = f"temp_{file_id}.pdf"

    # Create PDF
    c = canvas.Canvas(file_path, pagesize=letter)
    width, height = letter

    y = height - 50
    c.setFont("Helvetica-Bold", 18)
    c.drawString(40, y, payload.title)
    y -= 40

    c.setFont("Helvetica", 12)
    for line in payload.text.split("\n"):
        if y < 50:
            c.showPage()
            c.setFont("Helvetica", 12)
            y = height - 50
        c.drawString(40, y, line)
        y -= 20

    c.save()

    return FileResponse(
        file_path,
        filename=f"{payload.title}.pdf",
        media_type="application/pdf",
    )
