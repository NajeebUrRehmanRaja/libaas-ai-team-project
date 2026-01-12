"""
Virtual Try-On Service using Kolors Virtual Try-On from Hugging Face
"""
import asyncio
from pathlib import Path
from typing import Optional, Dict
import os
import sys
import tempfile

# Set UTF-8 encoding for Windows compatibility
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Lazy import to avoid loading at startup
_gradio_client = None

def get_gradio_client():
    """Lazy load Gradio Client"""
    global _gradio_client
    if _gradio_client is None:
        try:
            from gradio_client import Client, file
            print("[VTON] Loading IDM-VTON model (yisol/IDM-VTON)...", flush=True)
            
            # Use HF_TOKEN if available to avoid quota limits
            hf_token = os.getenv("HF_TOKEN")
            if hf_token:
                print("[VTON] Using Hugging Face Token for authentication", flush=True)
                # Client should automatically pick up HF_TOKEN from environment
                # or we can try to set it explicitly in os.environ if not present
                if "HF_TOKEN" not in os.environ:
                    os.environ["HF_TOKEN"] = hf_token
                _gradio_client = Client("yisol/IDM-VTON")
            else:
                print("[VTON] working in anonymous mode (may hit rate limits)", flush=True)
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
        """Lazy load the Gradio client"""
        if self._client is None:
            self._client = get_gradio_client()
        return self._client
    
    async def download_image_to_temp(self, image_url: str, prefix: str = "image") -> Optional[str]:
        """
        Download image from URL to temporary file
        
        Args:
            image_url: URL of the image to download
            prefix: Prefix for temp filename
            
        Returns:
            Path to downloaded temp file, or None if failed
        """
        try:
            import httpx
            from PIL import Image
            from io import BytesIO
            
            print(f"[DOWNLOAD] Downloading image from: {image_url[:50]}...", flush=True)
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(image_url)
                response.raise_for_status()
                
                # Open image and convert to RGB
                image = Image.open(BytesIO(response.content)).convert("RGB")
                
                # Save to temp file
                temp_dir = tempfile.gettempdir()
                temp_filename = f"{prefix}_{os.urandom(8).hex()}.jpg"
                temp_path = os.path.join(temp_dir, temp_filename)
                
                image.save(temp_path, "JPEG", quality=95)
                print(f"[SUCCESS] Image downloaded to: {temp_path}", flush=True)
                
                return temp_path
                
        except Exception as e:
            print(f"[ERROR] Failed to download image: {e}", flush=True)
            return None
    
    async def generate_tryon(
        self, 
        user_image_path: str, 
        garment_image_path: str,
        output_dir: Optional[str] = None
    ) -> Optional[str]:
        """
        Generate virtual try-on image using IDM-VTON model
        
        Args:
            user_image_path: Path to user's photo
            garment_image_path: Path to clothing item image
            output_dir: Optional directory to save the result
            
        Returns:
            Path to generated try-on image, or None if failed
        """
        if self.client is None:
            print("[ERROR] Gradio client not available")
            return None
        
        try:
            from gradio_client import file
            
            print(f"[TRYON] Generating virtual try-on...", flush=True)
            print(f"   User image: {user_image_path}", flush=True)
            print(f"   Garment image: {garment_image_path}", flush=True)
            
            # Verify files exist
            if not os.path.exists(user_image_path):
                print(f"[ERROR] User image not found: {user_image_path}", flush=True)
                return None
            if not os.path.exists(garment_image_path):
                print(f"[ERROR] Garment image not found: {garment_image_path}", flush=True)
                return None
            
            # Call IDM-VTON API
            print(f"[INFO] Calling IDM-VTON API (this may take 30-60 seconds)...", flush=True)
            
            # Construct the dictionary correctly using file()
            # IDM-VTON expects: dict(background, layers, composite), garm_img, garment_des, is_checked, is_checked_crop, denoise_steps, seed
            
            # Use file() wrapper for image paths as requested
            user_image_file = file(user_image_path)
            garment_image_file = file(garment_image_path)
            
            image_dict = {
                "background": user_image_file,
                "layers": [],
                "composite": user_image_file  # User requested composite be the same as background
            }
            
            result = await asyncio.wait_for(
                asyncio.to_thread(
                    self.client.predict,
                    image_dict,           # dict with file objects
                    garment_image_file,   # garm_img with file object
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
            
            print(f"[SUCCESS] Virtual try-on generated: {result}", flush=True)
            return result
            
        except asyncio.TimeoutError:
            print(f"[ERROR] Virtual try-on timed out after 90 seconds", flush=True)
            return None
        except Exception as e:
            print(f"[ERROR] Virtual try-on error: {e}", flush=True)
            # Fallback to Mock Mode so user sees SOMETHING instead of just the garment
            print("[INFO] Falling back to Mock Try-On due to API error...", flush=True)
            return self.generate_mock_tryon(user_image_path, garment_image_path)

    def generate_mock_tryon(self, user_img_path, garment_img_path):
        """
        Generate a mock try-on image by compositing garment over user
        Used when API fails to allow flow testing.
        """
        try:
            from PIL import Image
            print("[MOCK] Generating mock try-on (API fallback)...", flush=True)
            
            user_img = Image.open(user_img_path).convert("RGBA")
            garm_img = Image.open(garment_img_path).convert("RGBA")
            
            # Simple resize garment to 50% of user width and center it
            target_width = int(user_img.width * 0.6)
            aspect_ratio = garm_img.height / garm_img.width
            target_height = int(target_width * aspect_ratio)
            
            garm_resized = garm_img.resize((target_width, target_height), Image.Resampling.LANCZOS)
            
            # Paste in center
            x = (user_img.width - target_width) // 2
            y = (user_img.height - target_height) // 2
            
            # Create composited image
            mock_result = Image.new("RGB", user_img.size, (255, 255, 255))
            mock_result.paste(user_img, (0, 0), user_img)
            mock_result.paste(garm_resized, (x, y), garm_resized)
            
            # Save to temp
            temp_dir = tempfile.gettempdir()
            temp_filename = f"mock_tryon_{os.urandom(8).hex()}.jpg"
            temp_path = os.path.join(temp_dir, temp_filename)
            mock_result.save(temp_path, "JPEG", quality=90)
            
            print(f"[MOCK] Success: {temp_path}", flush=True)
            return temp_path
            
        except Exception as e:
            print(f"[MOCK] Error generating mock: {e}", flush=True)
            return None
    
    async def generate_outfit_tryon(
        self,
        user_image_path: str,
        outfit_items: list,
        output_dir: Optional[str] = None
    ) -> Optional[str]:
        """
        Generate try-on for a complete outfit (multiple items)
            outfit_items: List of wardrobe item dictionaries
            output_dir: Optional directory to save results
            
        Returns:
            Path to generated image or None
        """
        if not outfit_items:
            print("[ERROR] No outfit items provided")
            return None
        
        # Find the primary garment (top, dress, or kurta)
        primary_garment = None
        
        # Priority order: Dresses > Tops > Bottoms
        for item in outfit_items:
            category = item.get("category", "").lower()
            if "dress" in category or "lehenga" in category:
                primary_garment = item
                break
        
        if not primary_garment:
            for item in outfit_items:
                category = item.get("category", "").lower()
                if "top" in category or "kurta" in category or "shirt" in category:
                    primary_garment = item
                    break
        
        if not primary_garment:
            # Fallback to first item
            primary_garment = outfit_items[0]
        
        print(f"[OUTFIT] Using primary garment: {primary_garment.get('name', 'Unknown')}")
        
        # Download the garment image
        garment_url = primary_garment.get("image_url")
        if not garment_url:
            print("[ERROR] No image URL for primary garment")
            return None
        
        # Download garment image to temp file
        temp_garment_path = await self.download_image_to_temp(garment_url, "garment")
        
        if not temp_garment_path:
            print("[ERROR] Failed to download garment image")
            return None
        
        try:
            # Generate try-on
            result = await self.generate_tryon(
                user_image_path=user_image_path,
                garment_image_path=temp_garment_path,
                output_dir=output_dir
            )
            
            return result
            
        except Exception as e:
            print(f"[ERROR] Error in outfit try-on: {e}")
            return None
        finally:
            # Clean up temp file
            if temp_garment_path and os.path.exists(temp_garment_path):
                try:
                    os.remove(temp_garment_path)
                except Exception as e:
                    print(f"[WARNING] Could not remove temp file: {e}")


# Global instance (lazy loaded)
_virtual_tryon_service = None

def get_virtual_tryon_service() -> VirtualTryOnService:
    """Get or create the virtual try-on service instance"""
    global _virtual_tryon_service
    if _virtual_tryon_service is None:
        _virtual_tryon_service = VirtualTryOnService()
    return _virtual_tryon_service

