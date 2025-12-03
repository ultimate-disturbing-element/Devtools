"""OCR service for text extraction."""
import io
import tempfile
import os
from typing import List
from app.core.exceptions import FileProcessingError


class OCRService:
    """Service for OCR operations."""
    
    def image_to_text(self, image_bytes: bytes, lang: str = 'eng') -> str:
        """Extract text from image using OCR."""
        try:
            import pytesseract
            from PIL import Image
            
            img = Image.open(io.BytesIO(image_bytes))
            text = pytesseract.image_to_string(img, lang=lang)
            
            return text.strip()
            
        except Exception as e:
            raise FileProcessingError(f"Failed to perform OCR on image: {str(e)}")
    
    def pdf_to_text_ocr(self, pdf_bytes: bytes, lang: str = 'eng') -> str:
        """Extract text from PDF using OCR."""
        try:
            import pytesseract
            from pdf2image import convert_from_bytes
            
            # Convert PDF pages to images
            images = convert_from_bytes(pdf_bytes)
            
            text_parts = []
            for i, img in enumerate(images):
                text = pytesseract.image_to_string(img, lang=lang)
                if text.strip():
                    text_parts.append(f"--- Page {i+1} ---\n{text}")
            
            return '\n\n'.join(text_parts)
            
        except Exception as e:
            raise FileProcessingError(f"Failed to perform OCR on PDF: {str(e)}")
    
    def video_frame_to_text(
        self,
        video_bytes: bytes,
        frame_time: float = 0,
        lang: str = 'eng'
    ) -> str:
        """Extract text from a video frame using OCR.
        
        Args:
            video_bytes: Video file bytes
            frame_time: Time in seconds to extract frame
            lang: Language for OCR
        """
        try:
            import pytesseract
            from moviepy.editor import VideoFileClip
            from PIL import Image
            import numpy as np
            
            # Write video to temp file
            with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as temp_video:
                temp_video.write(video_bytes)
                temp_video_path = temp_video.name
            
            try:
                video = VideoFileClip(temp_video_path)
                
                # Extract frame
                frame = video.get_frame(frame_time)
                video.close()
                
                # Convert to PIL Image
                img = Image.fromarray(frame.astype('uint8'), 'RGB')
                
                # Perform OCR
                text = pytesseract.image_to_string(img, lang=lang)
                
                return text.strip()
                
            finally:
                if os.path.exists(temp_video_path):
                    os.unlink(temp_video_path)
            
        except Exception as e:
            raise FileProcessingError(f"Failed to perform OCR on video frame: {str(e)}")


# Singleton instance
ocr_service = OCRService()
