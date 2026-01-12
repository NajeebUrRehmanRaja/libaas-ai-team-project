"""
CLIP-based image analysis for fashion insights.

Uses the "openai/clip-vit-base-patch32" model for zero-shot image classification
to extract fashion-related insights from user profile images.
"""

import torch
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
from typing import Dict, List, Any, Optional
import io

# Global model and processor (loaded once at startup)
_model: Optional[CLIPModel] = None
_processor: Optional[CLIPProcessor] = None

# Fashion-related labels for zero-shot classification
FASHION_LABELS = [
    "man",
    "woman", 
    "casual",
    "formal",
    "shirt",
    "t-shirt",
    "traditional",
    "summer",
    "winter",
    "hoodie",
    "pants",
    "jeans",
    "dress",
    "kurta",
    "shalwar kameez",
    "blazer",
    "suit",
    "ethnic wear",
    "western wear",
    "accessories",
    "jewelry"
]

def load_clip_model() -> None:
    """
    Load the CLIP model and processor at startup.
    This should be called once during application startup.
    Model loading is now done in background to not block server startup.
    """
    global _model, _processor
    
    try:
        model_name = "openai/clip-vit-base-patch32"
        
        print(f"Loading CLIP model: {model_name}")
        
        # Load model with CPU optimization
        _model = CLIPModel.from_pretrained(model_name)
        _processor = CLIPProcessor.from_pretrained(model_name)
        
        # Set to evaluation mode and optimize for CPU
        _model.eval()
        
        # Disable gradient computation for inference
        for param in _model.parameters():
            param.requires_grad = False
        
        print("CLIP model loaded successfully!")
    except Exception as e:
        print(f"Warning: Could not load CLIP model: {e}")
        print("AI insights will be disabled until model is loaded.")

def get_model_and_processor():
    """
    Get the loaded model and processor.
    
    Returns:
        Tuple of (model, processor) or (None, None) if not loaded
    """
    global _model, _processor
    
    if _model is None or _processor is None:
        # Try to load the model now
        try:
            load_clip_model()
        except Exception as e:
            print(f"Could not load CLIP model on demand: {e}")
            return None, None
    
    return _model, _processor

def analyze_image(image_bytes: bytes) -> Dict[str, Any]:
    """
    Analyze an image using CLIP for fashion-related insights.
    
    Args:
        image_bytes: Raw bytes of the image file
    
    Returns:
        Dictionary containing:
        - top_label: Most confident prediction label
        - top_confidence: Confidence score of top prediction
        - all_predictions: List of all predictions with scores
    """
    try:
        model, processor = get_model_and_processor()
        
        if model is None or processor is None:
            return {
                "top_label": "unknown",
                "top_confidence": 0.0,
                "all_predictions": [],
                "message": "AI model not available - insights will be generated later"
            }
        
        # Load image from bytes
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        
        # Prepare text prompts for zero-shot classification
        text_prompts = [f"a photo of {label}" for label in FASHION_LABELS]
        
        # Process inputs
        inputs = processor(
            text=text_prompts,
            images=image,
            return_tensors="pt",
            padding=True
        )
        
        # Run inference with no gradient computation
        with torch.no_grad():
            outputs = model(**inputs)
            
            # Get image-text similarity scores
            logits_per_image = outputs.logits_per_image
            probs = logits_per_image.softmax(dim=1)
        
        # Convert to list of predictions
        probs_list = probs[0].tolist()
        
        # Create predictions list with labels and scores
        predictions = []
        for label, score in zip(FASHION_LABELS, probs_list):
            predictions.append({
                "label": label,
                "score": round(score, 4)
            })
        
        # Sort by score descending
        predictions.sort(key=lambda x: x["score"], reverse=True)
        
        # Get top prediction
        top_prediction = predictions[0]
        
        result = {
            "top_label": top_prediction["label"],
            "top_confidence": top_prediction["score"],
            "all_predictions": predictions[:10]  # Return top 10 predictions
        }
        
        return result
        
    except Exception as e:
        print(f"Error analyzing image with CLIP: {e}")
        # Return default insights on error
        return {
            "top_label": "unknown",
            "top_confidence": 0.0,
            "all_predictions": [],
            "error": str(e)
        }

def get_fashion_recommendations(clip_insights: Dict[str, Any], user_preferences: Dict[str, str] = None) -> Dict[str, List[str]]:
    """
    Generate fashion recommendations based on CLIP insights and user preferences.
    
    Args:
        clip_insights: CLIP analysis results
        user_preferences: Optional user preferences (body_shape, skin_tone, etc.)
    
    Returns:
        Dictionary with recommended colors, fits, and patterns
    """
    recommendations = {
        "colors": [],
        "fits": [],
        "patterns": []
    }
    
    top_label = clip_insights.get("top_label", "").lower()
    
    # Color recommendations based on detected style
    if "formal" in top_label or "suit" in top_label or "blazer" in top_label:
        recommendations["colors"] = ["Navy", "Charcoal", "Black", "White"]
        recommendations["fits"] = ["Tailored", "Slim fit"]
        recommendations["patterns"] = ["Solid", "Pinstripe", "Subtle check"]
    elif "casual" in top_label or "t-shirt" in top_label or "hoodie" in top_label:
        recommendations["colors"] = ["Earth tones", "Pastels", "Denim blue"]
        recommendations["fits"] = ["Relaxed", "Regular fit"]
        recommendations["patterns"] = ["Graphic prints", "Stripes", "Solid"]
    elif "traditional" in top_label or "kurta" in top_label or "ethnic" in top_label:
        recommendations["colors"] = ["Emerald", "Maroon", "Gold", "Royal blue"]
        recommendations["fits"] = ["A-line", "Straight cut"]
        recommendations["patterns"] = ["Embroidered", "Block print", "Floral"]
    elif "summer" in top_label:
        recommendations["colors"] = ["White", "Pastels", "Light blue"]
        recommendations["fits"] = ["Loose", "Breathable"]
        recommendations["patterns"] = ["Floral", "Tropical", "Light prints"]
    elif "winter" in top_label:
        recommendations["colors"] = ["Deep burgundy", "Forest green", "Navy"]
        recommendations["fits"] = ["Layered", "Cozy"]
        recommendations["patterns"] = ["Cable knit", "Plaid", "Solid"]
    else:
        # Default recommendations
        recommendations["colors"] = ["Emerald", "Maroon", "Cream"]
        recommendations["fits"] = ["A-line", "Defined waist"]
        recommendations["patterns"] = ["Floral", "Minimal prints"]
    
    # Adjust based on user preferences if provided
    if user_preferences:
        skin_tone = user_preferences.get("skin_tone", "").lower()
        
        # Adjust colors based on skin tone
        if skin_tone == "fair":
            recommendations["colors"] = ["Pastels", "Soft pink", "Light blue", "Lavender"]
        elif skin_tone == "warm":
            recommendations["colors"] = ["Emerald", "Coral", "Warm red", "Gold"]
        elif skin_tone == "olive":
            recommendations["colors"] = ["Earth tones", "Burgundy", "Olive green"]
        elif skin_tone == "tan":
            recommendations["colors"] = ["Bright colors", "Orange", "Turquoise"]
        elif skin_tone == "deep":
            recommendations["colors"] = ["Jewel tones", "White", "Gold", "Fuchsia"]
    
    return recommendations

