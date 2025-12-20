
import asyncio
from typing import Optional, Dict
import os
import sys
import tempfile

# Set UTF-8 encoding for Windows compatibility
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

_gradio_client = None

def get_gradio_client():
    """Lazy load Gradio Client for IDM-VTON"""
    global _gradio_client
    if _gradio_client is None:
        try:
            from gradio_client import Client
            print("[VTON] Loading IDM-VTON model (yisol/IDM-VTON)...", flush=True)
            _gradio_client = Client("yisol/IDM-VTON")
            print("[SUCCESS] IDM-VTON loaded successfully!", flush=True)
            
        except Exception as e:
            print(f"[ERROR] Error loading IDM-VTON: {e}", flush=True)
            _gradio_client = None
    return _gradio_client


class VirtualTryOnService:
    """Service for generating virtual try-on images using IDM-VTON"""
    
    def __init__(self):
        self._client = None
    
    @property
    def client(self):
        if self._client is None:
            self._client = get_gradio_client()
        return self._client
    
    async def generate_tryon(
        self, 
        user_image_path: str, 
        garment_image_path: str,
        output_dir: Optional[str] = None
    ) -> Optional[str]:
        """
        Generate virtual try-on image using IDM-VTON model
        """
        if self.client is None:
            print("[ERROR] Gradio client not available")
            return None
        
        try:
            from gradio_client import file
            
            print(f"[TRYON] Generating virtual try-on...", flush=True)
            print(f"   User image: {user_image_path}", flush=True)
            print(f"   Garment image: {garment_image_path}", flush=True)
            
            # Call IDM-VTON API
            print(f"[INFO] Calling IDM-VTON API (this may take 30-60 seconds)...", flush=True)
            
            # IDM-VTON expects: dict(background, layers, composite), garm_img, garment_des, is_checked, is_checked_crop, denoise_steps, seed
            
            # Use file() wrapper
            user_image_file = file(user_image_path)
            garment_image_file = file(garment_image_path)
            
            # Construct the dictionary correctly for the ImageEditor component
            image_dict = {
                "background": user_image_file,
                "layers": [],
                "composite": user_image_file
            }
            
            result = await asyncio.wait_for(
                asyncio.to_thread(
                    self.client.predict,
                    image_dict,           # dict (ImageEditor input)
                    garment_image_file,   # garm_img
                    "Garment photo",      # garment_des
                    True,                 # is_checked (auto-mask)
                    True,                 # is_checked_crop (auto-crop)
                    30,                   # denoise_steps
                    42,                   # seed
                    api_name="/tryon"
                ),
                timeout=90.0
            )
            
            # Result is a tuple (output, masked_output), we want the first one
            if isinstance(result, (list, tuple)):
                result = result[0]
            
            print(f"[SUCCESS] Virtual try-on generated: {result}")
            return result
            
        except asyncio.TimeoutError:
            print(f"[ERROR] Virtual try-on timed out after 90 seconds", flush=True)
            return None
        except Exception as e:
            print(f"[ERROR] Virtual try-on error: {e}", flush=True)
            import traceback
            traceback.print_exc()
            return None
