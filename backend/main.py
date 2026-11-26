from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import uvicorn

from models import Song, MoodRequest, MoodResponse, HumSearchResponse
from database import get_all_songs, get_song_by_id, SONGS_CATALOG
from services.mood_engine import recommend_by_mood
from services.hum_engine import process_hum_audio

app = FastAPI(
    title="AuraBeat AI Music Platform API",
    description="Backend API with Hum-to-Search (QBH) and Mood-Aware Music Recommendation Engines",
    version="1.0.0"
)

# Enable CORS for React frontend (Vite default port 5173 and others)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "AuraBeat AI Music Engine",
        "endpoints": [
            "/api/songs",
            "/api/mood/recommend",
            "/api/hum/search",
            "/api/stats"
        ]
    }

@app.get("/api/songs", response_model=List[Song])
def list_songs(genre: Optional[str] = None):
    """Retrieve full catalog or filter by genre."""
    songs = get_all_songs()
    if genre:
        return [s for s in songs if s.genre.lower() == genre.lower()]
    return songs

@app.get("/api/songs/{song_id}", response_model=Song)
def get_song(song_id: str):
    """Retrieve individual song details."""
    song = get_song_by_id(song_id)
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    return song

@app.post("/api/mood/recommend", response_model=MoodResponse)
def get_mood_recommendations(req: MoodRequest):
    """
    Recommends songs based on mood tag or free-text NLP prompt
    using Russell's Circumplex Affective Model (Valence & Energy).
    """
    return recommend_by_mood(mood_name=req.mood, prompt=req.prompt, top_k=req.count or 6)

@app.post("/api/hum/search", response_model=HumSearchResponse)
async def hum_to_search(audio: UploadFile = File(...)):
    """
    Accepts hummed audio from browser microphone, extracts fundamental pitch F0,
    converts to a key-invariant melodic contour, and performs Dynamic Time Warping (DTW) matching.
    """
    audio_bytes = await audio.read()
    return process_hum_audio(audio_bytes)

@app.get("/api/stats")
def get_platform_stats():
    """Returns analytics regarding catalog distribution and affective vector clusters."""
    return {
        "total_songs": len(SONGS_CATALOG),
        "genres": list(set(s.genre for s in SONGS_CATALOG)),
        "available_moods": ["Happy", "Chill", "Melancholic", "Energetic", "Focus", "Romantic", "Workout"],
        "algorithms": {
            "hum_matching": "Fast Dynamic Time Warping (FastDTW) + Autocorrelation Pitch Tracking",
            "mood_engine": "Circumplex Affective Vector Space (Valence-Energy Euclidean Clustering)"
        }
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
