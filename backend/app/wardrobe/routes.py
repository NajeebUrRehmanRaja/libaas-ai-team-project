"""
Wardrobe API Routes
Handle wardrobe item upload, categorization, listing, and management.
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional, Dict
import uuid
from datetime import datetime
import tempfile
import os

from app.database import (
    create_wardrobe_item,
    get_user_wardrobe,
    delete_wardrobe_item,
    update_wardrobe_item,
    upload_wardrobe_image
)
from app.ai.wardrobe_classifier import WardrobeClassifier

router = APIRouter(prefix="/wardrobe", tags=["wardrobe"])

# Lazy classifier instance
_classifier = None

def get_classifier():
    """Get or create classifier instance (lazy loading)"""
    global _classifier
    if _classifier is None:
        _classifier = WardrobeClassifier()
    return _classifier


@router.post("/upload")
async def upload_wardrobe_item(
    user_id: str = Form(...),
    file: UploadFile = File(...)
):
    """
    Upload and auto-categorize a wardrobe item using Fashion-CLIP.
    """
    try:
        # 1. Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # 2. Read file
        file_bytes = await file.read()
        
        # 3. Generate unique filename
        file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
        unique_filename = f"{user_id}/{uuid.uuid4()}.{file_extension}"
        
        # 4. Save to temporary location for classification (cross-platform)
        temp_dir = tempfile.gettempdir()
        temp_filename = f"{uuid.uuid4()}.{file_extension}"
        temp_path = os.path.join(temp_dir, temp_filename)
        
        with open(temp_path, "wb") as f:
            f.write(file_bytes)
        
        # 5. Auto-categorize using Fashion-CLIP
        print(f"Categorizing wardrobe item for user {user_id}...")
        classifier = get_classifier()
        classification = classifier.categorize_wardrobe_item(temp_path)
        
        # 6. Upload image to Supabase Storage
        image_url = await upload_wardrobe_image(
            file_bytes,
            unique_filename,
            file.content_type
        )
        
        # 7. Create wardrobe item record
        item_data = {
            "user_id": user_id,
            "name": classification["name"],
            "description": classification["description"],
            "image_url": image_url,
            "category": classification["category"],
            "sub_category": classification["sub_category"],
            "color": classification["color"],
            "style": classification["style"],
            "pattern": classification["pattern"],
            "tags": classification["tags"],
            "auto_categorized": classification["auto_categorized"]
        }
        
        created_item = await create_wardrobe_item(item_data)
        
        if not created_item:
            raise HTTPException(status_code=500, detail="Failed to create wardrobe item")
        
        # 8. Clean up temp file
        try:
            os.remove(temp_path)
        except Exception as e:
            print(f"Warning: Could not remove temp file {temp_path}: {e}")
        
        return JSONResponse(
            content={
                "success": True,
                "item": created_item,
                "message": f"Added {classification['name']} to your wardrobe!"
            },
            status_code=201
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error uploading wardrobe item: {e}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@router.get("/items/{user_id}")
async def get_wardrobe_items(user_id: str):
    """
    Get all wardrobe items for a user.
    """
    try:
        items = await get_user_wardrobe(user_id)
        
        return {
            "success": True,
            "count": len(items),
            "items": items
        }
    
    except Exception as e:
        print(f"Error fetching wardrobe: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch wardrobe: {str(e)}")


@router.delete("/items/{item_id}")
async def delete_wardrobe_item_endpoint(item_id: str, user_id: str):
    """
    Delete a wardrobe item.
    """
    try:
        success = await delete_wardrobe_item(item_id, user_id)
        
        if success:
            return {
                "success": True,
                "message": "Item deleted successfully"
            }
        else:
            raise HTTPException(status_code=404, detail="Item not found")
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting wardrobe item: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete item: {str(e)}")


@router.patch("/items/{item_id}")
async def update_wardrobe_item_endpoint(
    item_id: str,
    user_id: str = Form(...),
    name: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    tags: Optional[str] = Form(None)  # Comma-separated
):
    """
    Update a wardrobe item.
    """
    try:
        updates = {}
        
        if name:
            updates["name"] = name
        if category:
            updates["category"] = category
        if tags:
            updates["tags"] = tags.split(",")
        
        updates["updated_at"] = datetime.now().isoformat()
        
        updated_item = await update_wardrobe_item(item_id, user_id, updates)
        
        if not updated_item:
            raise HTTPException(status_code=404, detail="Item not found")
        
        return {
            "success": True,
            "item": updated_item,
            "message": "Item updated successfully"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating wardrobe item: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to update item: {str(e)}")


@router.post("/recategorize/{user_id}")
async def recategorize_all_items(user_id: str):
    """
    Re-categorize all wardrobe items for a user using Fashion-CLIP.
    Useful for items that were uploaded before Fashion-CLIP was working.
    """
    try:
        from app.database import get_user_wardrobe, update_wardrobe_item
        from PIL import Image
        import requests
        from io import BytesIO
        
        # Get all user's wardrobe items
        items = await get_user_wardrobe(user_id)
        
        if not items:
            return {
                "success": True,
                "message": "No items to recategorize",
                "updated": 0
            }
        
        classifier = get_classifier()
        updated_count = 0
        
        for item in items:
            try:
                # Download image from Supabase
                image_url = item.get("image_url")
                if not image_url:
                    continue
                
                response = requests.get(image_url)
                image = Image.open(BytesIO(response.content)).convert("RGB")
                
                # Save temporarily for classification
                temp_dir = tempfile.gettempdir()
                temp_filename = f"{uuid.uuid4()}.jpg"
                temp_path = os.path.join(temp_dir, temp_filename)
                image.save(temp_path)
                
                # Classify
                classification = classifier.categorize_wardrobe_item(temp_path)
                
                # Update item
                updates = {
                    "name": classification["name"],
                    "description": classification["description"],
                    "category": classification["category"],
                    "sub_category": classification["sub_category"],
                    "color": classification["color"],
                    "style": classification["style"],
                    "pattern": classification["pattern"],
                    "tags": classification["tags"],
                    "auto_categorized": True,
                    "updated_at": datetime.now().isoformat()
                }
                
                await update_wardrobe_item(item["id"], user_id, updates)
                updated_count += 1
                
                # Cleanup
                try:
                    os.remove(temp_path)
                except:
                    pass
                
            except Exception as e:
                print(f"Error recategorizing item {item.get('id')}: {e}")
                continue
        
        return {
            "success": True,
            "message": f"Successfully recategorized {updated_count} items!",
            "updated": updated_count,
            "total": len(items)
        }
    
    except Exception as e:
        print(f"Error in recategorization: {e}")
        raise HTTPException(status_code=500, detail=f"Recategorization failed: {str(e)}")


def _generate_outfit_description(outfit: Dict, event_type: str, user_profile: Optional[Dict]) -> str:
    """Generate a personalized description for an outfit"""
    items = outfit.get("items", [])
    primary_color = (outfit.get("primary_color") or "").title()
    style = (outfit.get("style") or "").title()
    
    # Get body shape and skin tone if available
    body_shape = (user_profile.get("body_shape") or "").title() if user_profile else ""
    skin_tone = (user_profile.get("skin_tone") or "").title() if user_profile else ""
    
    # Build description
    description_parts = []
    
    # Event context
    event_descriptions = {
        "wedding": "Perfect for a wedding celebration",
        "mehndi": "Vibrant and festive for a mehndi ceremony",
        "cultural": "Elegantly traditional for a cultural event",
        "office": "Professional and polished for the workplace",
        "casual": "Comfortable and stylish for everyday wear",
        "party": "Eye-catching and fun for a party",
        "formal": "Sophisticated and elegant for a formal occasion"
    }
    
    description_parts.append(event_descriptions.get(event_type.lower(), "Perfect for any occasion"))
    
    # Personalization based on user profile
    if body_shape:
        description_parts.append(f"This ensemble flatters your {body_shape} silhouette")
    
    if skin_tone and primary_color:
        description_parts.append(f"featuring {primary_color} tones that complement your {skin_tone} complexion")
    elif primary_color:
        description_parts.append(f"featuring beautiful {primary_color} tones")
    
    # Style mention
    if style:
        description_parts.append(f"The {style} style adds the perfect finishing touch")
    
    return ". ".join(description_parts) + "."


@router.post("/generate-looks")
async def generate_outfit_looks(
    user_id: str = Form(...),
    event_type: str = Form("casual"),
    num_looks: int = Form(5)
):
    """
    Generate AI-powered outfit looks with virtual try-on.
    
    Args:
        user_id: User's ID
        event_type: Type of event (wedding, casual, party, etc.)
        num_looks: Number of looks to generate (3, 5, or 7)
    
    Returns:
        List of generated outfit looks with try-on images
    """
    try:
        from app.database import get_user_wardrobe, get_user_by_id, upload_wardrobe_image
        from app.ai.outfit_recommender import get_outfit_recommender
        from app.ai.virtual_tryon import get_virtual_tryon_service
        import asyncio
        
        print(f"[GENERATE] Generating {num_looks} looks for user {user_id} ({event_type} event)")
        
        # 1. Get user's wardrobe items
        wardrobe_items = await get_user_wardrobe(user_id)
        
        if not wardrobe_items:
            raise HTTPException(
                status_code=400, 
                detail="No wardrobe items found. Please add some clothes to your wardrobe first!"
            )
        
        print(f"[WARDROBE] Found {len(wardrobe_items)} wardrobe items")
        
        # 2. Get user profile for personalization
        user_profile = await get_user_by_id(user_id)
        
        # 3. Generate outfit combinations
        outfit_recommender = get_outfit_recommender()
        outfits = outfit_recommender.generate_outfits(
            wardrobe_items=wardrobe_items,
            event_type=event_type,
            num_looks=num_looks,
            user_profile=user_profile
        )
        
        if not outfits:
            raise HTTPException(
                status_code=400,
                detail="Could not generate outfits. Please add more variety to your wardrobe."
            )
        
        print(f"[SUCCESS] Generated {len(outfits)} outfit combinations")
        
        # 4. Check if user has a profile image for virtual try-on
        user_image_url = user_profile.get("image_url") if user_profile else None
        
        # 5. Generate looks with outfit item images
        # Note: Virtual try-on is disabled for now due to Hugging Face Spaces API issues
        # Users will see outfit combinations with their actual wardrobe items
        generated_looks = []
        
        for idx, outfit in enumerate(outfits, 1):
            items = outfit.get("items", [])
            
            look = {
                "id": idx,
                "match_score": outfit.get("match_score", 85),
                "description": _generate_outfit_description(
                    outfit, 
                    event_type, 
                    user_profile
                ),
                "items": items,
                "primary_color": outfit.get("primary_color", "unknown"),
                "style": outfit.get("style", "casual"),
                # Use the primary garment image as the look image
                "tryon_image_url": items[0].get("image_url") if items else None
            }
            
            print(f"[SUCCESS] Created look {idx} with {len(items)} items")
            generated_looks.append(look)
        
        print(f"[SUCCESS] Successfully generated {len(generated_looks)} looks!")
        
        return {
            "success": True,
            "looks": generated_looks,
            "event_type": event_type,
            "message": f"Generated {len(generated_looks)} perfect looks for your {event_type} event!"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Error generating looks: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to generate looks: {str(e)}"
        )

