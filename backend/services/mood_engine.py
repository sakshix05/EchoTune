import math
from typing import List, Tuple
from models import Song, MoodResponse
from database import SONGS_CATALOG

# Circumplex Model Coordinates (Valence, Energy/Arousal)
MOOD_COORDINATES = {
    "happy": (0.85, 0.75),
    "cheerful": (0.90, 0.80),
    "euphoric": (0.95, 0.90),
    "chill": (0.70, 0.35),
    "relaxed": (0.65, 0.25),
    "focus": (0.60, 0.38),
    "study": (0.55, 0.30),
    "melancholic": (0.20, 0.25),
    "sad": (0.15, 0.20),
    "heartbroken": (0.10, 0.18),
    "energetic": (0.85, 0.92),
    "workout": (0.78, 0.95),
    "hype": (0.90, 0.95),
    "romantic": (0.80, 0.45),
    "angry": (0.25, 0.88),
    "sleep": (0.45, 0.10)
}

# Semantic dictionary for natural language query mapping
KEYWORD_MAPPINGS = {
    "stress": ("chill", 0.60, 0.30),
    "tired": ("relaxed", 0.50, 0.20),
    "exhausted": ("relaxed", 0.50, 0.20),
    "crying": ("sad", 0.15, 0.20),
    "breakup": ("sad", 0.15, 0.20),
    "gym": ("workout", 0.80, 0.95),
    "lift": ("workout", 0.80, 0.95),
    "run": ("energetic", 0.85, 0.90),
    "party": ("hype", 0.92, 0.95),
    "dancing": ("hype", 0.90, 0.90),
    "exam": ("study", 0.55, 0.35),
    "code": ("focus", 0.65, 0.40),
    "programming": ("focus", 0.65, 0.40),
    "date": ("romantic", 0.82, 0.48),
    "love": ("romantic", 0.85, 0.50),
    "rainy": ("melancholic", 0.25, 0.25),
    "sun": ("happy", 0.90, 0.80)
}

def analyze_prompt_to_mood(prompt: str) -> Tuple[float, float, str, str]:
    """Analyzes a free-text prompt to extract Valence and Energy coordinates."""
    prompt_lower = prompt.lower()
    
    # Check for direct mood keyword hits
    for word, (mood_name, val, ene) in KEYWORD_MAPPINGS.items():
        if word in prompt_lower:
            return val, ene, mood_name.capitalize(), f"Detected intention relating to '{word}'"

    # Check against circumplex categories
    for mood, (val, ene) in MOOD_COORDINATES.items():
        if mood in prompt_lower:
            return val, ene, mood.capitalize(), f"Matched emotional state '{mood}'"

    # Default fallback to balanced Chill/Good vibes
    return 0.70, 0.50, "Balanced Chill", "Default balanced affective state applied"

def recommend_by_mood(mood_name: str = None, prompt: str = None, top_k: int = 6) -> MoodResponse:
    """Finds songs closest to the target mood in (Valence, Energy) space."""
    target_valence, target_energy = 0.70, 0.50
    matched_label = "Chill"
    explanation = "Standard recommendation"

    if prompt and prompt.strip():
        target_valence, target_energy, matched_label, explanation = analyze_prompt_to_mood(prompt)
    elif mood_name and mood_name.lower() in MOOD_COORDINATES:
        matched_label = mood_name.capitalize()
        target_valence, target_energy = MOOD_COORDINATES[mood_name.lower()]
        explanation = f"Selected preset: {matched_label}"
    
    # Calculate Euclidean distance in 2D affective space
    scored_songs = []
    for song in SONGS_CATALOG:
        # Distance = sqrt( (v1 - v2)^2 + (e1 - e2)^2 )
        dist = math.sqrt(
            (song.valence - target_valence) ** 2 + 
            (song.energy - target_energy) ** 2
        )
        scored_songs.append((dist, song))
    
    # Sort by closest distance
    scored_songs.sort(key=lambda x: x[0])
    recommended = [song for _, song in scored_songs[:top_k]]

    return MoodResponse(
        target_valence=round(target_valence, 2),
        target_energy=round(target_energy, 2),
        matched_mood=matched_label,
        explanation=explanation,
        songs=recommended
    )
