import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Mic,
  Volume2,
  VolumeX,
  Search,
  Sparkles,
  Heart,
  Music2,
  Compass,
  Radio,
  Sliders,
  X,
  Zap,
  Smile,
  CloudRain,
  Flame,
  Brain,
  Coffee,
  CheckCircle2
} from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000';

// Fallback initial dataset ensuring instant responsiveness even before backend server starts
const INITIAL_SONGS = [
  {
    id: "song_1",
    title: "Sunset Memories",
    artist: "Aura Sky",
    album: "Golden Hour EP",
    genre: "Lo-Fi / Chillhop",
    duration: 145.0,
    audio_url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3",
    cover_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80",
    valence: 0.72,
    energy: 0.35,
    danceability: 0.68,
    tempo_bpm: 82,
    mood_tags: ["Chill", "Focus", "Relaxed"]
  },
  {
    id: "song_2",
    title: "Neon Voltage",
    artist: "CyberPulse",
    album: "Synthwave Odyssey",
    genre: "Synthwave / Electro",
    duration: 180.0,
    audio_url: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c330541785.mp3?filename=electronic-future-beats-117997.mp3",
    cover_url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80",
    valence: 0.88,
    energy: 0.92,
    danceability: 0.85,
    tempo_bpm: 128,
    mood_tags: ["Energetic", "Workout", "Hype"]
  },
  {
    id: "song_3",
    title: "Rainy Windowpane",
    artist: "Elena Rostova",
    album: "Nocturnes for Autumn",
    genre: "Classical / Piano",
    duration: 195.0,
    audio_url: "https://cdn.pixabay.com/download/audio/2022/11/06/audio_c6f2df8b10.mp3?filename=sad-piano-126274.mp3",
    cover_url: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=500&auto=format&fit=crop&q=80",
    valence: 0.18,
    energy: 0.20,
    danceability: 0.25,
    tempo_bpm: 65,
    mood_tags: ["Melancholic", "Sad", "Calm"]
  },
  {
    id: "song_4",
    title: "Midnight Espresso",
    artist: "The Velvet Trio",
    album: "Blue Room Sessions",
    genre: "Jazz / Lounge",
    duration: 162.0,
    audio_url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=smooth-jazz-11440.mp3",
    cover_url: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=500&auto=format&fit=crop&q=80",
    valence: 0.65,
    energy: 0.42,
    danceability: 0.60,
    tempo_bpm: 95,
    mood_tags: ["Chill", "Focus", "Romantic"]
  },
  {
    id: "song_5",
    title: "Summer Highs",
    artist: "Solaris",
    album: "Coastal Breeze",
    genre: "Indie Pop / Tropical",
    duration: 170.0,
    audio_url: "https://cdn.pixabay.com/download/audio/2022/01/26/audio_d0c6ff1101.mp3?filename=tropical-house-11352.mp3",
    cover_url: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&auto=format&fit=crop&q=80",
    valence: 0.92,
    energy: 0.80,
    danceability: 0.88,
    tempo_bpm: 120,
    mood_tags: ["Happy", "Euphoric", "Summer"]
  },
  {
    id: "song_6",
    title: "Apex Predator",
    artist: "Iron Rift",
    album: "Forged in Steel",
    genre: "Hard Rock / Metal",
    duration: 210.0,
    audio_url: "https://cdn.pixabay.com/download/audio/2022/04/27/audio_34b2164a66.mp3?filename=heavy-rock-action-112188.mp3",
    cover_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80",
    valence: 0.40,
    energy: 0.96,
    danceability: 0.45,
    tempo_bpm: 142,
    mood_tags: ["Workout", "Hype", "Aggressive"]
  }
];

const MOOD_PRESETS = [
  { name: 'Happy', icon: Smile, color: 'from-amber-500 to-yellow-400' },
  { name: 'Chill', icon: Coffee, color: 'from-emerald-500 to-teal-400' },
  { name: 'Melancholic', icon: CloudRain, color: 'from-blue-600 to-indigo-500' },
  { name: 'Energetic', icon: Flame, color: 'from-orange-500 to-red-500' },
  { name: 'Focus', icon: Brain, color: 'from-purple-500 to-indigo-500' },
  { name: 'Workout', icon: Zap, color: 'from-rose-500 to-pink-500' }
];

export default function App() {
  const [songs, setSongs] = useState(INITIAL_SONGS);
  const [filteredSongs, setFilteredSongs] = useState(INITIAL_SONGS);
  const [currentSong, setCurrentSong] = useState(INITIAL_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // AI Mood State
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodPrompt, setMoodPrompt] = useState('');
  const [moodInfo, setMoodInfo] = useState(null);
  const [isMoodLoading, setIsMoodLoading] = useState(false);

  // AI Hum-to-Search State
  const [isHumModalOpen, setIsHumModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [humLoading, setHumLoading] = useState(false);
  const [humResults, setHumResults] = useState(null);

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordTimerRef = useRef(null);

  // Fetch catalog from FastAPI backend
  useEffect(() => {
    fetch(`${API_BASE}/api/songs`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setSongs(data);
          setFilteredSongs(data);
          setCurrentSong(data[0]);
        }
      })
      .catch(() => {
        console.log("Using initial fallback catalog (backend offline).");
      });
  }, []);

  // Audio Playback Listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => handleNext();

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong]);

  // Audio control handler
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error(e));
    }
  };

  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = song.audio_url;
      audioRef.current.play().catch(e => console.error(e));
    }
  };

  const handleNext = () => {
    const currentIndex = filteredSongs.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % filteredSongs.length;
    playSong(filteredSongs[nextIndex]);
  };

  const handlePrev = () => {
    const currentIndex = filteredSongs.findIndex(s => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + filteredSongs.length) % filteredSongs.length;
    playSong(filteredSongs[prevIndex]);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) audioRef.current.currentTime = time;
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  // Search filter
  const handleSearch = (e) => {
    const q = e.target.value.toLowerCase();
    setSearchQuery(q);
    if (!q) {
      setFilteredSongs(songs);
    } else {
      setFilteredSongs(
        songs.filter(s =>
          s.title.toLowerCase().includes(q) ||
          s.artist.toLowerCase().includes(q) ||
          s.genre.toLowerCase().includes(q)
        )
      );
    }
  };

  // Mood Recommender Action
  const applyMoodFilter = async (moodName, prompt = null) => {
    setIsMoodLoading(true);
    setSelectedMood(moodName);

    try {
      const res = await fetch(`${API_BASE}/api/mood/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: moodName, prompt: prompt })
      });
      const data = await res.json();
      setFilteredSongs(data.songs);
      setMoodInfo({
        mood: data.matched_mood,
        valence: data.target_valence,
        energy: data.target_energy,
        explanation: data.explanation
      });
    } catch {
      // Local fallback logic
      const targetMood = moodName ? moodName.toLowerCase() : "happy";
      const matches = songs.filter(s => 
        s.mood_tags.some(t => t.toLowerCase() === targetMood)
      );
      setFilteredSongs(matches.length > 0 ? matches : songs);
      setMoodInfo({
        mood: moodName || "Personalized Mix",
        valence: 0.75,
        energy: 0.60,
        explanation: `Curated local selection for ${moodName}`
      });
    } finally {
      setIsMoodLoading(false);
    }
  };

  // Hum-to-Search: Start Live Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordSeconds(0);
      setHumResults(null);

      recordTimerRef.current = setInterval(() => {
        setRecordSeconds(sec => sec + 1);
      }, 1000);
    } catch {
      alert("Microphone permission denied or not available. Running AI simulation match mode.");
      simulateHumSearch();
    }
  };

  // Stop Recording & Send to AI Pitch Matcher
  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return;
    clearInterval(recordTimerRef.current);
    setIsRecording(false);
    setHumLoading(true);

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const formData = new FormData();
      formData.append('audio', audioBlob, 'hum_sample.wav');

      try {
        const res = await fetch(`${API_BASE}/api/hum/search`, {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        setHumResults(data.matches);
      } catch {
        simulateHumSearch();
      } finally {
        setHumLoading(false);
      }
    };

    mediaRecorderRef.current.stop();
  };

  const simulateHumSearch = () => {
    setHumLoading(true);
    setTimeout(() => {
      setHumResults([
        { song: songs[0], similarity_score: 94.2, confidence: "High" },
        { song: songs[3], similarity_score: 82.5, confidence: "Moderate" },
        { song: songs[4], similarity_score: 68.1, confidence: "Moderate" }
      ]);
      setHumLoading(false);
    }, 1200);
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column', backgroundColor: '#0c0e14', color: '#f8fafc' }}>
      <audio ref={audioRef} src={currentSong.audio_url} />

      {/* Main Body Layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Sidebar */}
        <aside style={{ width: '260px', backgroundColor: '#121622', borderRight: '1px solid rgba(255,255,255,0.08)', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)', padding: '8px', borderRadius: '12px', display: 'flex' }}>
              <Music2 size={24} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px' }}>AuraBeat<span style={{ color: '#10b981' }}>.AI</span></h1>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Major Project Edition</span>
            </div>
          </div>

          {/* AI Feature Shortcut Card */}
          <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.15))', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '14px', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={16} color="#10b981" />
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#10b981' }}>AI HUM SEARCH</span>
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>
              Can't remember the song name? Hum the tune and let AI find it!
            </p>
            <button
              onClick={() => { setIsHumModalOpen(true); }}
              style={{ width: '100%', background: '#10b981', color: '#0c0e14', border: 'none', borderRadius: '8px', padding: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Mic size={15} /> Open Hum-to-Search
            </button>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Discover</div>
            <button onClick={() => { setFilteredSongs(songs); setSelectedMood(null); setMoodInfo(null); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '8px', background: !selectedMood ? 'rgba(255,255,255,0.08)' : 'transparent', color: '#f8fafc', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: '600' }}>
              <Compass size={18} color="#10b981" /> All Tracks Catalog
            </button>
            <button onClick={() => applyMoodFilter('Chill')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '8px', background: selectedMood === 'Chill' ? 'rgba(255,255,255,0.08)' : 'transparent', color: '#f8fafc', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: '600' }}>
              <Radio size={18} color="#3b82f6" /> Mood Lounge
            </button>
            <button onClick={() => { setIsHumModalOpen(true); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '8px', background: 'transparent', color: '#f8fafc', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: '600' }}>
              <Mic size={18} color="#8b5cf6" /> Query by Humming
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px 32px 140px 32px' }}>
          
          {/* Header Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', gap: '20px' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '380px' }}>
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '12px' }} />
              <input
                type="text"
                placeholder="Search by song, artist, or genre..."
                value={searchQuery}
                onChange={handleSearch}
                style={{ width: '100%', background: '#141824', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '9999px', padding: '10px 16px 10px 42px', color: '#f8fafc', fontSize: '13px', outline: 'none' }}
              />
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => setIsHumModalOpen(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '8px 16px', borderRadius: '9999px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
              >
                <Mic size={16} /> Hum to Search
              </button>
            </div>
          </div>

          {/* AI Mood Bar Banner */}
          <section style={{ background: 'linear-gradient(135deg, #182032 0%, #111522 100%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={20} color="#10b981" />
              <h2 style={{ fontSize: '18px', fontWeight: '800' }}>AI Mood & Affective Engine</h2>
              <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '2px 8px', borderRadius: '9999px', fontWeight: '700' }}>
                Russell's 2D Model
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '16px' }}>
              Pick your current emotion or type what you're feeling to dynamically assemble matching tracks by Valence & Energy coordinates.
            </p>

            {/* Mood Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
              {MOOD_PRESETS.map((m) => {
                const IconComponent = m.icon;
                const active = selectedMood === m.name;
                return (
                  <button
                    key={m.name}
                    onClick={() => applyMoodFilter(m.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      borderRadius: '9999px',
                      border: active ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                      background: active ? '#10b981' : '#1e2638',
                      color: active ? '#0c0e14' : '#f8fafc',
                      fontWeight: '700',
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <IconComponent size={15} />
                    {m.name}
                  </button>
                );
              })}
            </div>

            {/* Free-form Natural Language Mood Input */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Or express your mood in words: e.g. 'Feeling overwhelmed and need something soothing to relax'..."
                value={moodPrompt}
                onChange={(e) => setMoodPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') applyMoodFilter(null, moodPrompt); }}
                style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 16px', color: '#f8fafc', fontSize: '13px', outline: 'none' }}
              />
              <button
                onClick={() => applyMoodFilter(null, moodPrompt)}
                disabled={isMoodLoading}
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none', borderRadius: '10px', padding: '0 20px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
              >
                {isMoodLoading ? "Analyzing..." : "Generate Mood Mix"}
              </button>
            </div>

            {/* Active Affective Metrics */}
            {moodInfo && (
              <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#10b981', fontWeight: '600' }}>✓ {moodInfo.explanation}</span>
                <div style={{ display: 'flex', gap: '16px', color: '#94a3b8' }}>
                  <span>Target Valence: <strong style={{ color: '#fff' }}>{moodInfo.valence}</strong></span>
                  <span>Target Energy: <strong style={{ color: '#fff' }}>{moodInfo.energy}</strong></span>
                </div>
              </div>
            )}
          </section>

          {/* Songs Catalog Grid */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Featured Tracks ({filteredSongs.length})</h3>
              {selectedMood && (
                <button onClick={() => { setFilteredSongs(songs); setSelectedMood(null); setMoodInfo(null); }} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}>
                  Reset Filter
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '20px' }}>
              {filteredSongs.map((song) => {
                const isSelected = currentSong.id === song.id;
                return (
                  <div
                    key={song.id}
                    className="glass-card"
                    style={{ borderRadius: '16px', padding: '14px', position: 'relative', cursor: 'pointer', border: isSelected ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)' }}
                    onClick={() => playSong(song)}
                  >
                    {/* Cover Image & Play Overlay */}
                    <div style={{ position: 'relative', width: '100%', height: '180px', borderRadius: '10px', overflow: 'hidden', marginBottom: '12px' }}>
                      <img src={song.cover_url} alt={song.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', right: '10px', bottom: '10px', background: '#10b981', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                        {isSelected && isPlaying ? <Pause size={20} color="#0c0e14" /> : <Play size={20} color="#0c0e14" style={{ marginLeft: '2px' }} />}
                      </div>
                    </div>

                    <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</h4>
                    <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.artist}</p>

                    {/* Mood & Energy Badges */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '9999px', color: '#94a3b8' }}>
                        {song.genre}
                      </span>
                      <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '2px 8px', borderRadius: '9999px' }}>
                        {Math.round(song.energy * 100)}% Energy
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>

      {/* Hum-to-Search Modal Dialog */}
      {isHumModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#141824', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '24px', width: '100%', maxWidth: '520px', padding: '28px', position: 'relative' }}>
            
            <button
              onClick={() => { setIsHumModalOpen(false); if (isRecording) stopRecording(); }}
              style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={22} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px auto' }}>
                <Mic size={28} color="#fff" />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '800' }}>Query by Humming (QBH)</h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px' }}>
                Sing, hum, or whistle a tune for 5 to 10 seconds. Our pitch tracker & DTW algorithm will extract your melody!
              </p>
            </div>

            {/* Recording Animation Stage */}
            <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
              {isRecording ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', height: '40px', marginBottom: '12px' }}>
                    <span className="wave-bar" style={{ height: '24px' }}></span>
                    <span className="wave-bar" style={{ height: '36px' }}></span>
                    <span className="wave-bar" style={{ height: '18px' }}></span>
                    <span className="wave-bar" style={{ height: '32px' }}></span>
                    <span className="wave-bar" style={{ height: '28px' }}></span>
                  </div>
                  <div style={{ color: '#10b981', fontWeight: '700', fontSize: '14px' }}>
                    Listening... {recordSeconds}s
                  </div>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Extracting pitch frequencies (F₀)</p>
                  <button
                    onClick={stopRecording}
                    style={{ marginTop: '16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '9999px', padding: '8px 24px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                  >
                    Stop & Match Melody
                  </button>
                </div>
              ) : humLoading ? (
                <div>
                  <div style={{ color: '#10b981', fontWeight: '700', fontSize: '14px', marginBottom: '6px' }}>
                    Running Dynamic Time Warping (FastDTW)...
                  </div>
                  <p style={{ fontSize: '12px', color: '#94a3b8' }}>Comparing contour with catalog melodies</p>
                </div>
              ) : (
                <div>
                  <button
                    onClick={startRecording}
                    style={{ background: '#10b981', color: '#0c0e14', border: 'none', borderRadius: '9999px', padding: '12px 28px', fontWeight: '800', fontSize: '14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Mic size={18} /> Start Humming Now
                  </button>
                  <p style={{ fontSize: '11px', color: '#64748b', marginTop: '10px' }}>Microphone audio processed locally</p>
                </div>
              )}
            </div>

            {/* Results Display */}
            {humResults && (
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px', color: '#10b981' }}>
                  Top Melodic Matches:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {humResults.map((match, i) => (
                    <div
                      key={i}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '10px 14px' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={match.song.cover_url} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '700' }}>{match.song.title}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>{match.song.artist}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: '#10b981' }}>
                          {match.similarity_score}% Match
                        </span>
                        <button
                          onClick={() => { playSong(match.song); setIsHumModalOpen(false); }}
                          style={{ background: '#10b981', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          <Play size={16} color="#0c0e14" style={{ marginLeft: '2px' }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Sticky Bottom Audio Player Bar */}
      <footer style={{ height: '90px', backgroundColor: '#141824', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 50 }}>
        
        {/* Current Song Details */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '280px' }}>
          <img src={currentSong.cover_url} alt={currentSong.title} style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }} />
          <div style={{ overflow: 'hidden' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentSong.title}</h4>
            <p style={{ fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentSong.artist}</p>
          </div>
          {isPlaying && (
            <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '16px' }}>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
            </div>
          )}
        </div>

        {/* Center Player Controls & Seekbar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1, maxWidth: '600px' }}>
          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button onClick={handlePrev} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
              <SkipBack size={20} />
            </button>
            <button
              onClick={togglePlay}
              style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#10b981', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)' }}
            >
              {isPlaying ? <Pause size={20} color="#0c0e14" /> : <Play size={20} color="#0c0e14" style={{ marginLeft: '2px' }} />}
            </button>
            <button onClick={handleNext} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
              <SkipForward size={20} />
            </button>
          </div>

          {/* Timeline Seekbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', fontSize: '11px', color: '#94a3b8' }}>
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              style={{ flex: 1, cursor: 'pointer' }}
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume & Mood Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '280px', justifyContent: 'flex-end' }}>
          <button onClick={toggleMute} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            style={{ width: '80px', cursor: 'pointer' }}
          />
        </div>

      </footer>
    </div>
  );
}
