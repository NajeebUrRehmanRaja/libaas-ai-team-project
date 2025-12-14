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
            from gradio_client import Client
            print("[VTON] Loading IDM-VTON model (more reliable than Kolors)...")
            # Using IDM-VTON which has a stable, documented API
            _gradio_client = Client("yisol/IDM-VTON")
            print("[SUCCESS] IDM-VTON loaded successfully!")
            
            # Log available endpoints for debugging
            try:
                print("[INFO] Checking available API endpoints...")
                _gradio_client.view_api()
            except:
                pass
                
        except Exception as e:
            print(f"[ERROR] Error loading IDM-VTON: {e}")
            _gradio_client = None
    return _gradio_client


class VirtualTryOnService:
    """Service for generating virtual try-on images using Kolors"""
    
    def __init__(self):
        self._client = None
    
    @property
    def client(self):
        """Lazy load the Gradio client"""
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
        Generate virtual try-on image using Kolors model
        
        Args:
            user_image_path: Path to user's photo (full-body or upper-body)
            garment_image_path: Path to clothing item image
            output_dir: Optional directory to save the result
            
        Returns:
            Path to generated try-on image, or None if failed
        """
        if self.client is None:
            print("[ERROR] Gradio client not available")
            return None
        
        try:
            print(f"[TRYON] Generating virtual try-on...")
            print(f"   User image: {user_image_path}")
            print(f"   Garment image: {garment_image_path}")
            
            # Call IDM-VTON API
            # IDM-VTON uses "/tryon" endpoint with specific parameters
            print(f"[INFO] Calling IDM-VTON with images...")
            
            result = await asyncio.to_thread(
                self.client.predict,
                {"background": user_image_path, "layers": [], "composite": None},  # Human image dict
                garment_image_path,  # Garment image
                "Garment photo",  # Garment description
                True,  # is_checked (auto-mask)
                True,  # is_checked_crop (auto-crop)
                30,  # denoise_steps
                42,  # seed
                api_name="/tryon"
            )
            
            print(f"[SUCCESS] Virtual try-on generated: {result}")
            return result
            
        except Exception as e:
            print(f"[ERROR] Virtual try-on error: {e}")
            return None
    
    async def generate_outfit_tryon(
        self,
        user_image_path: str,
        outfit_items: list,
        output_dir: Optional[str] = None
    ) -> Optional[str]:
        """
        Generate try-on for a complete outfit (multiple items)
        
        For now, this will generate try-on for the primary garment (top or dress).
        In the future, we can layer multiple items.
        
        Args:
            user_image_path: Path to user's photo
            outfit_items: List of wardrobe item dictionaries
            output_dir: Optional directory to save results
            
        Returns:
            Path to generated image or None
        """
        if not outfit_items:
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
                if "top" in category or "kurta" in category:
                    primary_garment = item
                    break
        
        if not primary_garment:
            # Fallback to first item
            primary_garment = outfit_items[0]
        
        # Download the garment image
        garment_url = primary_garment.get("image_url")
        if not garment_url:
            return None
        
        # Download garment image to temp file
        import httpx
        temp_garment_path = None
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(garment_url)
                response.raise_for_status()
                
                # Save to temp file
                temp_dir = tempfile.gettempdir()
                temp_garment_path = os.path.join(
                    temp_dir, 
                    f"garment_{primary_garment.get('id', 'temp')}.jpg"
                )
                
                with open(temp_garment_path, "wb") as f:
                    f.write(response.content)
            
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
                except:
                    pass


# Global instance (lazy loaded)
_virtual_tryon_service = None

def get_virtual_tryon_service() -> VirtualTryOnService:
    """Get or create the virtual try-on service instance"""
    global _virtual_tryon_service
    if _virtual_tryon_service is None:
        _virtual_tryon_service = VirtualTryOnService()
    return _virtual_tryon_service

