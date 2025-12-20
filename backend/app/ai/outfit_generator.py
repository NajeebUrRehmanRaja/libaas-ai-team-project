"""
AI-Powered Outfit Generator Service
Uses GPT-4o-mini to generate detailed outfit recommendations
"""
import os
import json
from typing import List, Dict, Optional
from openai import AsyncOpenAI

# Initialize OpenAI client (will be None if API key not set)
api_key = os.getenv("OPENAI_API_KEY")
client = AsyncOpenAI(api_key=api_key) if api_key else None


async def generate_outfit_recommendations(
    user_profile: Dict,
    event_type: str,
    event_venue: str,
    event_time: str,
    weather: str,
    theme: str,
    num_looks: int = 3,
    wardrobe_items: List[Dict] = []
) -> List[Dict]:
    """
    Generate outfit recommendations using GPT-4o-mini
    
    Args:
        user_profile: User profile data (body_shape, skin_tone, gender, etc.)
        event_type: Type of event (wedding, party, office, etc.)
        event_venue: Venue type (garden, hotel, restaurant, etc.)
        event_time: Time of day (morning, afternoon, evening, night)
        weather: Weather/season (hot, warm, cool, cold, rainy)
        theme: Style theme (desi, formal, elite, casual, traditional, modern, fusion)
        num_looks: Number of outfit recommendations to generate (3, 5, or 7)
        wardrobe_items: User's wardrobe inventory for matching
    
    Returns:
        List of outfit recommendation dictionaries
    """
    
    # Check if OpenAI client is available
    if client is None:
        raise Exception("OpenAI API key not configured. Please add OPENAI_API_KEY to your .env file.")
    
    # Build the prompt (GPT generates outfit requirements only, no wardrobe matching)
    prompt = build_outfit_prompt(
        user_profile=user_profile,
        event_type=event_type,
        event_venue=event_venue,
        event_time=event_time,
        weather=weather,
        theme=theme,
        num_looks=num_looks
    )
    
    try:
        print(f"[OUTFIT_GEN] Generating {num_looks} outfit recommendations for {event_type}...", flush=True)
        
        response = await client.chat.completions.create(
            model="gpt-4o-mini-2024-07-18",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert Pakistani fashion stylist with deep knowledge of South Asian fashion, cultural dress codes, and modern styling. You provide detailed, practical outfit recommendations that consider body type, skin tone, event context, and cultural appropriateness."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=1.0,
            max_tokens=3000,
            response_format={"type": "json_object"}
        )
        
        # Parse the response
        content = response.choices[0].message.content
        recommendations_data = json.loads(content)
        
        print(f"[SUCCESS] Generated {len(recommendations_data.get('outfits', []))} outfit recommendations", flush=True)
        print(f"[MATCHING] Starting wardrobe matching with {len(wardrobe_items)} items...", flush=True)
        
        # Structure the response and apply backend matching
        outfits = []
        for idx, outfit in enumerate(recommendations_data.get("outfits", []), 1):
            sections = {}
            total_matches = 0
            
            # Process each section
            for section_name in ["top", "layer", "bottom", "footwear", "accessories"]:
                if section_name in outfit and outfit[section_name]:
                    data = outfit[section_name]
                    
                    # Handle accessories (list format, no matching)
                    if section_name == "accessories":
                        sections[section_name] = {"items": data.get("items", [])}
                        continue
                        
                    # Handle main sections
                    processed_section = {
                        "item": data.get("item", ""),
                        "details": data.get("details", [])
                    }
                    
                    # Apply backend matching algorithm
                    match = find_wardrobe_match(
                        outfit_section=data,
                        wardrobe_items=wardrobe_items,
                        section_name=section_name
                    )
                    
                    if match:
                        processed_section["wardrobe_match"] = match
                        total_matches += 1
                        print(f"[MATCH] {section_name}: ✓ {match.get('name')} (score: {match.get('_match_score', 0)})", flush=True)
                    else:
                        print(f"[MATCH] {section_name}: ✗ No suitable match found", flush=True)
                    
                    sections[section_name] = processed_section

            print(f"[OUTFIT {idx}] Total matches: {total_matches}/4 sections", flush=True)
            
            processed_outfit = {
                "title": outfit.get("title", f"Look {idx}"),
                "sections": sections
            }
            
            outfits.append({
                "id": idx,
                "title": outfit.get("title", f"Look {idx}"),
                "description": outfit.get("description", ""),
                "sections": sections,
                "full_text_prompt": build_image_prompt(processed_outfit, user_profile)
            })
        
        return outfits
        
    except Exception as e:
        print(f"[ERROR] Failed to generate outfit recommendations: {e}", flush=True)
        raise e


def find_wardrobe_match(
    outfit_section: Dict,
    wardrobe_items: List[Dict],
    section_name: str
) -> Optional[Dict]:
    """
    Find best matching wardrobe item for an outfit section using scoring algorithm.
    
    Scoring:
    - Color similarity: 40 points (high importance)
    - Fabric match: 20 points (medium importance)
    - Style match: 20 points (medium importance)
    - Name keywords: 20 points (bonus)
    
    Minimum threshold: 40 points (at least color match required)
    
    Args:
        outfit_section: GPT's outfit requirement with item, color, fabric, style
        wardrobe_items: User's wardrobe inventory
        section_name: 'top', 'bottom', 'footwear', 'layer'
    
    Returns:
        Best matching item or None
    """
    required_category = outfit_section.get("category", section_name)
    required_color = outfit_section.get("color", "").lower()
    required_fabric = outfit_section.get("fabric", "").lower()
    required_style = outfit_section.get("style", "").lower()
    required_item = outfit_section.get("item", "").lower()
    
    # Filter by category (mandatory)
    candidates = [
        item for item in wardrobe_items 
        if item.get("category", "").lower() == required_category.lower()
    ]
    
    if not candidates:
        return None
    
    # Score each candidate
    scored_candidates = []
    for item in candidates:
        score = 0
        match_flags = {
            "color": False,
            "fabric": False,
            "style": False,
            "name": False
        }
        
        # Color match (high importance: 40 points)
        item_color = item.get("color", "").lower()
        if required_color and item_color:
            if required_color in item_color or item_color in required_color:
                score += 40
                match_flags["color"] = True
        
        # Fabric match (medium importance: 20 points)
        item_description = item.get("description", "").lower()
        if required_fabric and required_fabric in item_description:
            score += 20
            match_flags["fabric"] = True
        
        # Style match (medium importance: 20 points)
        if required_style and required_style in item_description:
            score += 20
            match_flags["style"] = True
        
        # Name keyword match (bonus: 20 points)
        item_name = item.get("name", "").lower()
        if required_item:
            # Check if any word from required item appears in wardrobe item name
            required_words = required_item.split()
            if any(word in item_name for word in required_words if len(word) > 3):
                score += 20
                match_flags["name"] = True
        
        scored_candidates.append((score, item, match_flags))
    
    # Sort by score (highest first)
    scored_candidates.sort(key=lambda x: x[0], reverse=True)
    
    # Validation Logic (User Requested):
    # 1. Color match AND (Fabric OR Name OR Style)
    # 2. Strong Name match AND (Fabric OR Style OR Color)
    
    # Get best candidate
    best_score, best_item, flags = scored_candidates[0]
    
    has_secondary = flags["fabric"] or flags["style"] or flags["name"]
    has_name_plus = flags["name"] and (flags["fabric"] or flags["style"] or flags["color"])
    
    input_matches_rules = False
    
    # Rule 1: Color + Something
    if flags["color"] and has_secondary:
        input_matches_rules = True
        
    # Rule 2: Name + Something (even if color mismatch)
    elif has_name_plus:
        input_matches_rules = True
        
    if input_matches_rules:
        # Add score to item for debugging
        best_item_with_score = best_item.copy()
        best_item_with_score["_match_score"] = best_score
        return best_item_with_score
    
    return None


def build_outfit_prompt(
    user_profile: Dict,
    event_type: str,
    event_venue: str,
    event_time: str,
    weather: str,
    theme: str,
    num_looks: int
) -> str:
    """Build the GPT-4o-mini prompt for outfit generation (requirements only)"""
    
    # Extract user profile data
    gender = user_profile.get("gender", "male")
    body_shape = user_profile.get("body_shape", "")
    skin_tone = user_profile.get("skin_tone", "")
    height = user_profile.get("height", "")
    
    prompt = f"""
    You are an expert Pakistani fashion stylist AI.

    TASK:
    Generate {num_looks} complete outfit recommendations for a Pakistani {gender}.
    The outfits should be culturally appropriate, stylish, and suitable for the event.

    EVENT CONTEXT:
    - Event Type: {event_type}
    - Venue: {event_venue}
    - Time of Day: {event_time}
    - Weather: {weather}
    - Theme: {theme}

    USER PROFILE:
    - Gender: {gender}
    - Body Shape: {body_shape or "Not specified"}
    - Skin Tone: {skin_tone or "Not specified"}
    - Height: {height or "Not specified"}

    OUTPUT INSTRUCTIONS:
    - For each outfit section, provide specific REQUIREMENTS (color, fabric, style).
    - These requirements will be used to search the user's wardrobe.
    - Be specific about colors (e.g., "Navy Blue" instead of just "Blue").
    - Be specific about fabrics (e.g., "Silk", "Cotton", "Jamawar").

    OUTPUT FORMAT (STRICT JSON):
    {{
      "outfits": [
        {{
          "title": "Outfit Title",
          "description": "Brief description of the look",
          "top": {{
            "item": "Name/Description of item (e.g., Navy Blue Embroidered Kurta)",
            "details": ["detail1", "detail2"],
            "category": "top",
            "color": "navy blue",
            "fabric": "silk",
            "style": "formal"
          }},
          "layer": {{
            "item": "Waistcoat or Shawl description (optional)",
            "details": ["..."],
            "category": "layer",
            "color": "black",
            "fabric": "velvet",
            "style": "embroidered"
          }},
          "bottom": {{
            "item": "Trousers/Shalwar description",
            "details": ["..."],
            "category": "bottom",
            "color": "white",
            "fabric": "cotton",
            "style": "straight cut"
          }},
          "footwear": {{
            "item": "Shoe description",
            "details": ["..."],
            "category": "footwear",
            "color": "brown",
            "fabric": "leather",
            "style": "peshawari chappal"
          }},
          "accessories": {{
            "items": ["Watch", "Cufflinks"]
          }}
        }}
      ]
    }}
    """
    
    return prompt


def build_image_prompt(outfit: Dict, user_profile: Dict) -> str:
    """
    Build a detailed text prompt for image generation from outfit recommendation
    This will be used later with nano-banana or similar image generation model
    """
    
    gender = user_profile.get("gender", "male")
    body_shape = user_profile.get("body_shape", "")
    skin_tone = user_profile.get("skin_tone", "")
    
    # Extract outfit details
    title = outfit.get("title", "")
    sections = outfit.get("sections", {})
    
    # Build detailed description
    prompt_parts = []
    
    # Start with person description
    person_desc = f"A well-groomed Pakistani {gender}"
    if body_shape:
        person_desc += f" with {body_shape} build"
    if skin_tone:
        person_desc += f" and {skin_tone} skin tone"
    
    prompt_parts.append(person_desc)
    
    # Add outfit details
    if "top" in sections:
        top = sections["top"]
        top_desc = f"wearing {top.get('item', '')}"
        if top.get('details'):
            top_desc += f" ({', '.join(top['details'])})"
        prompt_parts.append(top_desc)
    
    if "layer" in sections:
        layer = sections["layer"]
        layer_desc = f"with {layer.get('item', '')}"
        if layer.get('details'):
            layer_desc += f" ({', '.join(layer['details'])})"
        prompt_parts.append(layer_desc)
    
    if "bottom" in sections:
        bottom = sections["bottom"]
        bottom_desc = f"paired with {bottom.get('item', '')}"
        if bottom.get('details'):
            bottom_desc += f" ({', '.join(bottom['details'])})"
        prompt_parts.append(bottom_desc)
    
    if "footwear" in sections:
        footwear = sections["footwear"]
        footwear_desc = f"wearing {footwear.get('item', '')}"
        if footwear.get('details'):
            footwear_desc += f" ({', '.join(footwear['details'])})"
        prompt_parts.append(footwear_desc)

    if "accessories" in sections:
        accessories = sections["accessories"]
        if accessories.get("items"):
            acc_desc = f"accessorized with {', '.join(accessories['items'])}"
            prompt_parts.append(acc_desc)
    
    # Add styling context
    prompt_parts.append("Full body shot, professional photography, natural lighting, clean background")
    
    full_prompt = ", ".join(prompt_parts)
    
    return full_prompt
