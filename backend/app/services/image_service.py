"""Image processing service."""
import io
from typing import Tuple, Optional
from app.core.exceptions import FileProcessingError


class ImageService:
    """Service for image operations."""
    
    def convert_image(
        self,
        image_bytes: bytes,
        target_format: str,
        resize: Optional[Tuple[int, int]] = None,
        quality: int = 85
    ) -> bytes:
        """Convert image to different format.
        
        Args:
            image_bytes: Source image bytes
            target_format: Target format (png, jpg, jpeg, webp)
            resize: Optional (width, height) tuple
            quality: Quality for lossy formats (1-100)
        """
        try:
            from PIL import Image
            
            # Open image
            img = Image.open(io.BytesIO(image_bytes))
            
            # Convert RGBA to RGB if saving as JPEG
            if target_format.lower() in ['jpg', 'jpeg'] and img.mode in ['RGBA', 'P']:
                rgb_img = Image.new('RGB', img.size, (255, 255, 255))
                rgb_img.paste(img, mask=img.split()[3] if img.mode == 'RGBA' else None)
                img = rgb_img
            
            # Resize if requested
            if resize:
                img = img.resize(resize, Image.Resampling.LANCZOS)
            
            # Save to bytes
            output = io.BytesIO()
            
            save_kwargs = {}
            if target_format.lower() in ['jpg', 'jpeg', 'webp']:
                save_kwargs['quality'] = quality
            
            img.save(output, format=target_format.upper(), **save_kwargs)
            
            return output.getvalue()
            
        except Exception as e:
            raise FileProcessingError(f"Failed to convert image: {str(e)}")
    
    def get_image_info(self, image_bytes: bytes) -> dict:
        """Get image information."""
        try:
            from PIL import Image
            
            img = Image.open(io.BytesIO(image_bytes))
            
            return {
                "format": img.format,
                "mode": img.mode,
                "width": img.width,
                "height": img.height,
                "size_bytes": len(image_bytes)
            }
            
        except Exception as e:
            raise FileProcessingError(f"Failed to get image info: {str(e)}")


# Singleton instance
image_service = ImageService()
