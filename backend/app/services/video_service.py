"""Video processing service."""
import os
import tempfile
from app.core.exceptions import FileProcessingError


class VideoService:
    """Service for video operations."""
    
    def video_to_gif(
        self,
        video_bytes: bytes,
        start_time: float = 0,
        duration: float = 5,
        fps: int = 10,
        width: int = 480
    ) -> bytes:
        """Convert video to GIF.
        
        Args:
            video_bytes: Source video bytes
            start_time: Start time in seconds
            duration: Duration in seconds
            fps: Frames per second for GIF
            width: Width of output GIF (height auto-scaled)
        """
        try:
            from moviepy.editor import VideoFileClip
            
            # Write video to temp file
            with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as temp_video:
                temp_video.write(video_bytes)
                temp_video_path = temp_video.name
            
            # Convert to GIF
            with tempfile.NamedTemporaryFile(suffix='.gif', delete=False) as temp_gif:
                temp_gif_path = temp_gif.name
            
            try:
                video = VideoFileClip(temp_video_path)
                
                # Trim video
                end_time = min(start_time + duration, video.duration)
                video = video.subclip(start_time, end_time)
                
                # Resize
                video = video.resize(width=width)
                
                # Write GIF
                video.write_gif(temp_gif_path, fps=fps)
                video.close()
                
                # Read GIF bytes
                with open(temp_gif_path, 'rb') as f:
                    gif_bytes = f.read()
                
                return gif_bytes
                
            finally:
                # Cleanup
                if os.path.exists(temp_video_path):
                    os.unlink(temp_video_path)
                if os.path.exists(temp_gif_path):
                    os.unlink(temp_gif_path)
            
        except Exception as e:
            raise FileProcessingError(f"Failed to convert video to GIF: {str(e)}")


# Singleton instance
video_service = VideoService()
