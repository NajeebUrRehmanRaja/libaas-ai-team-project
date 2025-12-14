"""
Authentication routes for signup and login.
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from typing import Optional
import json

from app.database import create_user, get_user_by_email, upload_image_to_storage
from app.schemas import SignupResponse, LoginRequest, LoginResponse, ClipInsights
from app.auth.utils import hash_password, verify_password, generate_unique_filename, validate_image_type
from app.ai.clip_insights import analyze_image

router = APIRouter()

@router.post("/signup", response_model=SignupResponse)
async def signup(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    gender: str = Form(...),
    height: Optional[str] = Form(None),
    country: Optional[str] = Form(None),
    body_shape: Optional[str] = Form(None),
    skin_tone: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None)
):
    """
    Register a new user with profile details and optional image.
    
    The image is analyzed using CLIP model to generate AI insights
    that will help with outfit recommendations later.
    """
    try:
        # 1. Validate input
        if len(password) < 6:
            raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
        
        if gender not in ['male', 'female', 'other']:
            raise HTTPException(status_code=400, detail="Gender must be 'male', 'female', or 'other'")
        
        # 2. Check if user already exists
        existing_user = await get_user_by_email(email)
        if existing_user:
            raise HTTPException(status_code=400, detail="User with this email already exists")
        
        # 3. Hash password
        password_hash = hash_password(password)
        
        # 4. Process image if provided
        image_url = None
        clip_insights_data = None
        
        if image:
            # Validate image type
            if not validate_image_type(image.content_type):
                raise HTTPException(
                    status_code=400, 
                    detail="Invalid image type. Allowed: JPEG, PNG, GIF, WebP"
                )
            
            # Read image bytes
            image_bytes = await image.read()
            
            # Generate unique filename
            filename = generate_unique_filename(image.filename, email)
            
            # Upload to Supabase Storage
            image_url = await upload_image_to_storage(
                file_bytes=image_bytes,
                filename=filename,
                content_type=image.content_type
            )
            
            # 5. Generate AI insights using CLIP
            clip_insights_data = analyze_image(image_bytes)
        
        # 6. Create user in database
        user_data = {
            "name": name,
            "email": email,
            "password_hash": password_hash,
            "gender": gender,
            "height": height,
            "country": country,
            "body_shape": body_shape,
            "skin_tone": skin_tone,
            "image_url": image_url,
            "clip_insights": clip_insights_data
        }
        
        created_user = await create_user(user_data)
        
        if not created_user:
            raise HTTPException(status_code=500, detail="Failed to create user")
        
        # 7. Return response
        response_data = {
            "message": "Signup successful",
            "user_id": created_user["id"],
            "clip_insights": clip_insights_data
        }
        
        return JSONResponse(content=response_data, status_code=201)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Signup error: {e}")
        raise HTTPException(status_code=500, detail=f"Signup failed: {str(e)}")

@router.post("/login", response_model=LoginResponse)
async def login(credentials: LoginRequest):
    """
    Authenticate user with email and password.
    """
    try:
        # Get user by email
        user = await get_user_by_email(credentials.email)
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Verify password
        if not verify_password(credentials.password, user["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        return {
            "message": "Login successful",
            "user_id": user["id"],
            "name": user["name"],
            "email": user["email"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

@router.get("/profile/{user_id}")
async def get_profile(user_id: str):
    """
    Get user profile by ID with personalized fashion recommendations.
    """
    from app.database import get_user_by_id
    from app.ai.fashion_recommendations import generate_recommendations
    
    try:
        user = await get_user_by_id(user_id)
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Generate personalized recommendations
        recommendations = generate_recommendations(
            gender=user.get("gender"),
            body_shape=user.get("body_shape"),
            skin_tone=user.get("skin_tone"),
            height=user.get("height"),
            country=user.get("country")
        )
        
        # Remove sensitive data
        user.pop("password_hash", None)
        
        # Add recommendations to response
        user["recommendations"] = recommendations
        
        return user
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Profile fetch error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch profile: {str(e)}")

