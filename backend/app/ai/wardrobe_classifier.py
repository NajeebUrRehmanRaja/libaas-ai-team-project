"""
Fashion-CLIP Wardrobe Classifier
Automatically categorizes uploaded clothing items using Fashion-CLIP model.
"""

from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import torch
from typing import Dict, List

# Enable AVIF support
try:
    from pillow_avif import AvifImagePlugin
    print("AVIF support enabled")
except ImportError:
    print("Warning: AVIF support not available")

# Global variables for model caching
_fashion_model = None
_fashion_processor = None
_model_loading_lock = None


def get_fashion_model_and_processor():
    """Get loaded Fashion-CLIP model and processor (lazy loading)"""
    global _fashion_model, _fashion_processor, _model_loading_lock
    
    # If already loaded, return immediately
    if _fashion_model is not None and _fashion_processor is not None:
        return _fashion_model, _fashion_processor
    
    # Load the model (first time only)
    try:
        print("🔄 Loading Fashion-CLIP model (first time only, ~1-2 minutes)...")
        _fashion_model = CLIPModel.from_pretrained("patrickjohncyh/fashion-clip")
        _fashion_processor = CLIPProcessor.from_pretrained("patrickjohncyh/fashion-clip")
        
        # Set to evaluation mode
        _fashion_model.eval()
        
        # Disable gradients for inference
        for param in _fashion_model.parameters():
            param.requires_grad = False
        
        print("[SUCCESS] Fashion-CLIP model loaded successfully!")
        return _fashion_model, _fashion_processor
    
    except Exception as e:
        print(f"[ERROR] Error loading Fashion-CLIP model: {e}")
        print("⚠️  Auto-categorization will be disabled.")
        return None, None


class WardrobeClassifier:
    """Classify wardrobe items using Fashion-CLIP"""
    
    def __init__(self):
        self._model = None
        self._processor = None
        
        # Define classification categories
        self.categories = {
            "main": [
                "Tops & Kurtas", "Bottoms & Shalwar", "Dresses & Lehengas",
                "Dupattas & Scarves", "Shoes & Sandals", "Accessories & Bags",
                "Jewelry", "Cultural / Special"
            ],
            "sub_categories": {
                "Tops & Kurtas": ["shirt", "t-shirt", "kurta", "blouse", "tunic", "sweater", "jacket"],
                "Bottoms & Shalwar": ["pants", "jeans", "shalwar", "palazzo", "shorts", "skirt", "leggings"],
                "Dresses & Lehengas": ["dress", "lehenga", "gown", "maxi dress", "evening dress"],
                "Dupattas & Scarves": ["dupatta", "scarf", "stole", "shawl"],
                "Shoes & Sandals": ["heels", "sandals", "sneakers", "boots", "khussa", "flats"],
                "Accessories & Bags": ["handbag", "clutch", "backpack", "watch", "belt", "sunglasses"],
                "Jewelry": ["necklace", "earrings", "bracelet", "ring", "maang tikka", "bangles"],
                "Cultural / Special": ["sherwani", "bridal wear", "traditional outfit", "ethnic wear"]
            },
            "colors": [
                "red", "blue", "green", "yellow", "black", "white", "gray",
                "pink", "purple", "orange", "brown", "beige", "navy", "maroon",
                "gold", "silver", "cream", "emerald", "multicolor"
            ],
            "styles": [
                "ethnic", "western", "fusion", "formal", "casual",
                "traditional", "modern", "bohemian", "vintage"
            ],
            "patterns": [
                "plain", "embroidered", "printed", "striped", "floral",
                "checkered", "polka dot", "geometric"
            ]
        }
    
    @property
    def model(self):
        """Lazy load model"""
        if self._model is None:
            self._model, self._processor = get_fashion_model_and_processor()
        return self._model
    
    @property
    def processor(self):
        """Lazy load processor"""
        if self._processor is None:
            self._model, self._processor = get_fashion_model_and_processor()
        return self._processor
    
    def classify_image(self, image, labels: List[str]) -> Dict[str, float]:
        """
        Classify image against a list of labels using Fashion-CLIP
        
        Args:
            image: PIL Image
            labels: List of possible labels
        
        Returns:
            Dictionary of {label: confidence_score}
        """
        if self.model is None or self.processor is None:
            return {labels[0]: 0.0}  # Fallback
        
        try:
            # Prepare text prompts with better context for fashion items
            text_prompts = []
            for label in labels:
                # Use more specific prompts for better accuracy
                if any(cat in label for cat in ["Tops", "Bottoms", "Dresses", "Shoes", "Jewelry", "Accessories"]):
                    # Main category - use "clothing" context
                    text_prompts.append(f"a photo of {label.lower()} clothing")
                else:
                    # Sub-categories and attributes
                    text_prompts.append(f"a photo of a {label.lower()}")
            
            # Process inputs
            inputs = self.processor(
                text=text_prompts,
                images=image,
                return_tensors="pt",
                padding=True
            )
            
            # Get predictions
            with torch.no_grad():
                outputs = self.model(**inputs)
                logits_per_image = outputs.logits_per_image
                probs = logits_per_image.softmax(dim=1)
            
            # Create results dictionary
            results = {}
            for i, label in enumerate(labels):
                results[label] = float(probs[0][i].item())
            
            return results
        
        except Exception as e:
            print(f"[ERROR] Classification error: {e}")
            return {labels[0]: 0.0}
    
    def get_top_prediction(self, image, labels: List[str]) -> str:
        """Get the top predicted label"""
        results = self.classify_image(image, labels)
        return max(results, key=results.get)
    
    def categorize_wardrobe_item(self, image_path: str) -> Dict:
        """
        Fully categorize a wardrobe item - IMPROVED: Identify object first, then categorize
        
        Args:
            image_path: Path to the uploaded image
        
        Returns:
            Dictionary with category, color, style, pattern, tags, etc.
        """
        try:
            # Load image
            image = Image.open(image_path).convert("RGB")
            
            # STEP 1: First identify what the object actually IS (comprehensive list)
            all_item_types = [
                # Tops
                "shirt", "t-shirt", "kurta", "blouse", "tunic", "sweater", "jacket", "coat",
                # Bottoms
                "pants", "jeans", "trousers", "shalwar", "palazzo pants", "shorts", "skirt", "leggings",
                # Dresses
                "dress", "lehenga", "gown", "maxi dress", "anarkali",
                # Footwear
                "shoes", "sneakers", "sandals", "heels", "boots", "flats", "slippers",
                # Accessories
                "handbag", "purse", "backpack", "clutch", "belt", "sunglasses", "hat", "cap",
                # Watches & Jewelry
                "wristwatch", "bracelet", "necklace", "earrings", "ring",
                # Scarves & Dupattas
                "scarf", "dupatta", "stole", "shawl"
            ]
            
            # Get what the item actually is
            item_results = self.classify_image(image, all_item_types)
            identified_item = max(item_results, key=item_results.get)
            item_confidence = item_results[identified_item]
            
            print(f"🔍 Identified as: {identified_item} (confidence: {item_confidence:.2%})")
            
            # If confidence is too low, mark as uncategorized
            if item_confidence < 0.30:
                print(f"⚠️ Low confidence ({item_confidence:.2%}), marking as Uncategorized")
                return {
                    "category": "Uncategorized",
                    "sub_category": "item",
                    "color": "unknown",
                    "style": "casual",
                    "pattern": "plain",
                    "name": "Wardrobe Item",
                    "description": "Uploaded item - needs manual categorization",
                    "tags": ["uncategorized", "low-confidence"],
                    "auto_categorized": False
                }
            
            # STEP 2: Map identified item to appropriate category
            item_to_category_map = {
                # Tops
                "shirt": "Tops & Kurtas", "t-shirt": "Tops & Kurtas", "kurta": "Tops & Kurtas",
                "blouse": "Tops & Kurtas", "tunic": "Tops & Kurtas", "sweater": "Tops & Kurtas",
                "jacket": "Tops & Kurtas", "coat": "Tops & Kurtas",
                # Bottoms
                "pants": "Bottoms & Shalwar", "jeans": "Bottoms & Shalwar", "trousers": "Bottoms & Shalwar",
                "shalwar": "Bottoms & Shalwar", "palazzo pants": "Bottoms & Shalwar",
                "shorts": "Bottoms & Shalwar", "skirt": "Bottoms & Shalwar", "leggings": "Bottoms & Shalwar",
                # Dresses
                "dress": "Dresses & Lehengas", "lehenga": "Dresses & Lehengas",
                "gown": "Dresses & Lehengas", "maxi dress": "Dresses & Lehengas",
                "anarkali": "Dresses & Lehengas",
                # Footwear
                "shoes": "Shoes & Sandals", "sneakers": "Shoes & Sandals", "sandals": "Shoes & Sandals",
                "heels": "Shoes & Sandals", "boots": "Shoes & Sandals", "flats": "Shoes & Sandals",
                "slippers": "Shoes & Sandals",
                # Accessories
                "handbag": "Accessories & Bags", "purse": "Accessories & Bags", "backpack": "Accessories & Bags",
                "clutch": "Accessories & Bags", "belt": "Accessories & Bags", "sunglasses": "Accessories & Bags",
                "hat": "Accessories & Bags", "cap": "Accessories & Bags",
                # Watches & Jewelry
                "wristwatch": "Accessories & Bags", "bracelet": "Jewelry", "necklace": "Jewelry",
                "earrings": "Jewelry", "ring": "Jewelry",
                # Scarves
                "scarf": "Dupattas & Scarves", "dupatta": "Dupattas & Scarves",
                "stole": "Dupattas & Scarves", "shawl": "Dupattas & Scarves"
            }
            
            main_category = item_to_category_map.get(identified_item, "Uncategorized")
            sub_category = identified_item
            
            # STEP 3: Determine color
            color = self.get_top_prediction(image, self.categories["colors"])
            
            # STEP 4: Determine style
            style = self.get_top_prediction(image, self.categories["styles"])
            
            # STEP 5: Determine pattern
            pattern = self.get_top_prediction(image, self.categories["patterns"])
            
            # STEP 6: Generate display name - make it descriptive
            style_prefix = "" if style.lower() == "casual" else f"{style.title()} "
            pattern_part = "" if pattern.lower() == "plain" else f"{pattern.title()} "
            
            # Better naming based on item type
            if identified_item in ["wristwatch"]:
                display_name = f"{color.title()} Watch"
            else:
                display_name = f"{color.title()} {pattern_part}{style_prefix}{sub_category.title()}"
            
            description = f"{style} {color} {pattern} {identified_item}"
            
            # Create tags list
            tags = [
                identified_item.lower(),
                style.lower(),
                color.lower()
            ]
            
            if pattern != "plain":
                tags.append(pattern.lower())
            
            print(f"[SUCCESS] Categorized as: {main_category} > {identified_item} (confidence: {item_confidence:.2%})")
            
            return {
                "category": main_category,
                "sub_category": identified_item,
                "color": color,
                "style": style,
                "pattern": pattern,
                "name": display_name,
                "description": description,
                "tags": tags,
                "auto_categorized": True
            }
        
        except Exception as e:
            print(f"[ERROR] Error categorizing item: {e}")
            # Return fallback
            return {
                "category": "Uncategorized",
                "sub_category": "item",
                "color": "unknown",
                "style": "casual",
                "pattern": "plain",
                "name": "Wardrobe Item",
                "description": "Uploaded item",
                "tags": ["uncategorized", "error"],
                "auto_categorized": False
            }

