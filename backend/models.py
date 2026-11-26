from typing import List, Optional
from pydantic import BaseModel

class Song(BaseModel):
    id: str
    title: str
    artist: str
    album: str
    genre: str
    duration: float  # seconds
    audio_url: str
    cover_url: str
    # Mood Dimensions (0.0 to 1.0)
    valence: float       # Positivity (0 = dark/sad, 1 = cheerful/euphoric)
    energy: float        # Intensity/Arousal (0 = sleepy/calm, 1 = hyper/loud)
    danceability: float  # Rhythm stability (0 = ambient, 1 = dancefloor)
    tempo_bpm: int
    mood_tags: List[str]
    # Melody representation (relative semitone steps for QBH matching)
    contour: List[int]

class MoodRequest(BaseModel):
    mood: Optional[str] = "Happy"
    prompt: Optional[str] = None
    count: Optional[int] = 10

class MoodResponse(BaseModel):
    target_valence: float
    target_energy: float
    matched_mood: str
    explanation: str
    songs: List[Song]

class HumMatchResult(BaseModel):
    song: Song
    similarity_score: float  # 0 to 100%
    confidence: str          # High, Moderate, Low

class HumSearchResponse(BaseModel):
    matches: List[HumMatchResult]
    extracted_pitch_samples: int
    detected_key: Optional[str] = "Detected from pitch contour"
