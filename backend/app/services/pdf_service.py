"""PDF service for PDF manipulation."""
import io
import os
from typing import List
from app.core.exceptions import FileProcessingError


class PDFService:
    """Service for PDF operations."""
    
    def merge_pdfs(self, pdf_files: List[bytes]) -> bytes:
        """Merge multiple PDF files into one."""
        try:
            from PyPDF2 import PdfMerger
            
            merger = PdfMerger()
            
            for pdf_bytes in pdf_files:
                pdf_file = io.BytesIO(pdf_bytes)
                merger.append(pdf_file)
            
            output = io.BytesIO()
            merger.write(output)
            merger.close()
            
            return output.getvalue()
            
        except Exception as e:
            raise FileProcessingError(f"Failed to merge PDFs: {str(e)}")
    
    def split_pdf(self, pdf_bytes: bytes, pages: str = "all") -> List[bytes]:
        """Split PDF into separate pages or ranges.
        
        Args:
            pdf_bytes: PDF file content
            pages: "all" or page ranges like "1-3,5,7-9"
        """
        try:
            from PyPDF2 import PdfReader, PdfWriter
            
            reader = PdfReader(io.BytesIO(pdf_bytes))
            total_pages = len(reader.pages)
            
            if pages == "all":
                page_ranges = [(i, i+1) for i in range(total_pages)]
            else:
                page_ranges = self._parse_page_ranges(pages, total_pages)
            
            result_pdfs = []
            
            for start, end in page_ranges:
                writer = PdfWriter()
                for i in range(start, end):
                    writer.add_page(reader.pages[i])
                
                output = io.BytesIO()
                writer.write(output)
                result_pdfs.append(output.getvalue())
            
            return result_pdfs
            
        except Exception as e:
            raise FileProcessingError(f"Failed to split PDF: {str(e)}")
    
    def _parse_page_ranges(self, ranges: str, total_pages: int) -> List[tuple]:
        """Parse page range string like '1-3,5,7-9'."""
        result = []
        parts = ranges.split(',')
        
        for part in parts:
            part = part.strip()
            if '-' in part:
                start, end = part.split('-')
                start = int(start) - 1  # Convert to 0-indexed
                end = int(end)
                result.append((start, end))
            else:
                page = int(part) - 1
                result.append((page, page + 1))
        
        return result
    
    def pdf_to_text(self, pdf_bytes: bytes) -> str:
        """Extract text from PDF."""
        try:
            from PyPDF2 import PdfReader
            
            reader = PdfReader(io.BytesIO(pdf_bytes))
            text_parts = []
            
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    text_parts.append(text)
            
            return '\n\n'.join(text_parts)
            
        except Exception as e:
            raise FileProcessingError(f"Failed to extract text from PDF: {str(e)}")
    
    def text_to_pdf(self, text: str, output_path: str = None) -> bytes:
        """Convert text to PDF."""
        try:
            from reportlab.lib.pagesizes import letter
            from reportlab.pdfgen import canvas
            
            output = io.BytesIO()
            c = canvas.Canvas(output, pagesize=letter)
            
            # Simple text rendering
            width, height = letter
            y = height - 50
            
            for line in text.split('\n'):
                if y < 50:  # New page
                    c.showPage()
                    y = height - 50
                
                c.drawString(50, y, line[:100])  # Limit line length
                y -= 15
            
            c.save()
            return output.getvalue()
            
        except Exception as e:
            raise FileProcessingError(f"Failed to create PDF: {str(e)}")


# Singleton instance
pdf_service = PDFService()
