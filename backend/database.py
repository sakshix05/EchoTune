from models import Song
from typing import List, Optional

# Realistic catalog of royalty-free songs with audio stream links,
# emotional circumplex attributes (Valence, Energy, Danceability, BPM),
# and melodic contours (relative semitone steps for Hum-to-Search matching).

SONGS_CATALOG: List[Song] = [
    Song(
        id="song_1",
        title="Sunset Memories",
        artist="Aura Sky",
        album="Golden Hour EP",
        genre="Lo-Fi / Chillhop",
        duration=145.0,
        audio_url="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3",
        cover_url="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80",
        valence=0.72,
        energy=0.35,
        danceability=0.68,
        tempo_bpm=82,
        mood_tags=["Chill", "Focus", "Relaxed", "Study"],
        contour=[0, 2, 4, 2, 0, -3, 0, 2] # Characteristic melodic motif
    ),
    Song(
        id="song_2",
        title="Neon Voltage",
        artist="CyberPulse",
        album="Synthwave Odyssey",
        genre="Synthwave / Electro",
        duration=180.0,
        audio_url="https://cdn.pixabay.com/download/audio/2022/03/10/audio_c330541785.mp3?filename=electronic-future-beats-117997.mp3",
        cover_url="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80",
        valence=0.88,
        energy=0.92,
        danceability=0.85,
        tempo_bpm=128,
        mood_tags=["Energetic", "Workout", "Hype", "Party"],
        contour=[0, 3, 5, 7, 10, 12, 10, 7]
    ),
    Song(
        id="song_3",
        title="Rainy Windowpane",
        artist="Elena Rostova",
        album="Nocturnes for Autumn",
        genre="Classical / Piano",
        duration=195.0,
        audio_url="https://cdn.pixabay.com/download/audio/2022/11/06/audio_c6f2df8b10.mp3?filename=sad-piano-126274.mp3",
        cover_url="https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=500&auto=format&fit=crop&q=80",
        valence=0.18,
        energy=0.20,
        danceability=0.25,
        tempo_bpm=65,
        mood_tags=["Melancholic", "Sad", "Heartbroken", "Calm"],
        contour=[0, -1, -3, -5, -3, -1, 0, -4]
    ),
    Song(
        id="song_4",
        title="Midnight Espresso",
        artist="The Velvet Trio",
        album="Blue Room Sessions",
        genre="Jazz / Lounge",
        duration=162.0,
        audio_url="https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=smooth-jazz-11440.mp3",
        cover_url="https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=500&auto=format&fit=crop&q=80",
        valence=0.65,
        energy=0.42,
        danceability=0.60,
        tempo_bpm=95,
        mood_tags=["Chill", "Focus", "Romantic", "Late Night"],
        contour=[0, 4, 7, 11, 7, 4, 2, 0]
    ),
    Song(
        id="song_5",
        title="Summer Highs",
        artist="Solaris",
        album="Coastal Breeze",
        genre="Indie Pop / Tropical",
        duration=170.0,
        audio_url="https://cdn.pixabay.com/download/audio/2022/01/26/audio_d0c6ff1101.mp3?filename=tropical-house-11352.mp3",
        cover_url="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&auto=format&fit=crop&q=80",
        valence=0.92,
        energy=0.80,
        danceability=0.88,
        tempo_bpm=120,
        mood_tags=["Happy", "Euphoric", "Summer", "Dance"],
        contour=[0, 2, 4, 5, 7, 9, 7, 4]
    ),
    Song(
        id="song_6",
        title="Apex Predator",
        artist="Iron Rift",
        album="Forged in Steel",
        genre="Hard Rock / Metal",
        duration=210.0,
        audio_url="https://cdn.pixabay.com/download/audio/2022/04/27/audio_34b2164a66.mp3?filename=heavy-rock-action-112188.mp3",
        cover_url="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80",
        valence=0.40,
        energy=0.96,
        danceability=0.45,
        tempo_bpm=142,
        mood_tags=["Workout", "Hype", "Aggressive", "Intense"],
        contour=[0, 3, 5, 6, 5, 3, 0, -2]
    ),
    Song(
        id="song_7",
        title="Starlight Reverie",
        artist="Celeste",
        album="Infinite Space",
        genre="Ambient / Meditation",
        duration=240.0,
        audio_url="https://cdn.pixabay.com/download/audio/2022/10/25/audio_2448375815.mp3?filename=deep-meditation-ambient-124982.mp3",
        cover_url="https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=500&auto=format&fit=crop&q=80",
        valence=0.55,
        energy=0.15,
        danceability=0.10,
        tempo_bpm=55,
        mood_tags=["Relaxed", "Sleep", "Meditation", "Calm"],
        contour=[0, 2, 0, -2, 0, 4, 2, 0]
    ),
    Song(
        id="song_8",
        title="Parisian Moonlight",
        artist="Amélie Laurent",
        album="Café Bohème",
        genre="Acoustic / French Chanson",
        duration=155.0,
        audio_url="https://cdn.pixabay.com/download/audio/2022/08/04/audio_323dc46221.mp3?filename=french-accordion-chanson-116677.mp3",
        cover_url="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&auto=format&fit=crop&q=80",
        valence=0.78,
        energy=0.48,
        danceability=0.62,
        tempo_bpm=108,
        mood_tags=["Romantic", "Warm", "Happy", "Acoustic"],
        contour=[0, 1, 4, 5, 8, 7, 5, 4]
    )
]

def get_all_songs() -> List[Song]:
    return SONGS_CATALOG

def get_song_by_id(song_id: str) -> Optional[Song]:
    for song in SONGS_CATALOG:
        if song.id == song_id:
            return song
    return None
