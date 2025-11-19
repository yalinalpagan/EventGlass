import React, { useState, useEffect, useCallback } from 'react';
import { 
  Camera, Plus, Upload, Moon, Sun, Share2, X, 
  Image as ImageIcon, ChevronRight, ChevronLeft,
  Copy, Check, Loader2, Download, ArrowRight, Sparkles, Link as LinkIcon,
  AlertTriangle, Lock, FileArchive, Smartphone, Palette, RefreshCw, Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

// --- SUPABASE CONFIGURATION ---
// 👇👇👇 BURAYI KENDİ SUPABASE BİLGİLERİNLE DOLDUR 👇👇👇
const supabaseUrl = "https://macgaodeesbzxufdhzja.supabase.co"; // Örn: https://xyz.supabase.co
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hY2dhb2RlZXNienh1ZmRoemphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NTc3NTksImV4cCI6MjA3OTEzMzc1OX0.RRZcBuO7QrgW3z5PHgjZNPf_vEPaIvjuVW9pzW8w6jE"; // Örn: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
// 👆👆👆👆👆👆

let supabase;
let configError = false;

try {
    if (supabaseUrl.includes("BURAYA")) {
        configError = true;
    } else {
        supabase = createClient(supabaseUrl, supabaseKey);
    }
} catch (e) {
    console.error("Supabase init error", e);
    configError = true;
}

// --- USER ID ---
const getUserId = () => {
    let uid = localStorage.getItem('eg_uid');
    if(!uid) {
        uid = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('eg_uid', uid);
    }
    return uid;
};
const currentUser = getUserId();

// --- ASSETS ---
const IMAGE_OPTIONS = [
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80", 
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&q=80", 
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80", 
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80", 
];

const GRADIENT_OPTIONS = [
  { id: "gradient-1", class: "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500" },
  { id: "gradient-2", class: "bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600" },
  { id: "gradient-3", class: "bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600" },
  { id: "gradient-4", class: "bg-gradient-to-r from-orange-400 via-rose-400 to-purple-500" },
];

const SOLID_COLORS = ["#1e293b", "#b91c1c", "#0f766e", "#4338ca", "#be185d", "#000000"];

// --- UI COMPONENTS ---
const GlassCard = ({ children, className = "", onClick }) => (
  <div onClick={onClick} className={`relative overflow-hidden bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] rounded-3xl transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', className = "", onClick, disabled, icon: Icon }) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 border-transparent",
    secondary: "bg-white/20 hover:bg-white/30 text-slate-800 dark:text-white border border-white/20",
    glass: "bg-white/10 hover:bg-white/20 text-slate-800 dark:text-white border border-white/20 backdrop-blur-md",
  };
  return (
    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} onClick={onClick} disabled={disabled} className={`relative flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}>
      {Icon && <Icon size={18} />}
      {children}
    </motion.button>
  );
};

const CopyButton = ({ text, label, icon: Icon, variant = "secondary", className }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return <Button variant={variant} className={className} icon={copied ? Check : Icon} onClick={handleCopy}>{copied ? 'Kopyalandı!' : label}</Button>;
};

// --- MAIN APP ---
export default function EventGlassApp() {
  const [view, setView] = useState('landing'); 
  const [theme, setTheme] = useState('dark');
  const [currentEventId, setCurrentEventId] = useState(null);
  
  useEffect(() => {
    const init = async () => {
      if (!window.JSZip) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        document.head.appendChild(script);
      }
      
      const params = new URLSearchParams(window.location.search);
      const urlEventId = params.get('event');
      if (urlEventId) {
        setCurrentEventId(urlEventId);
        setView('event');
      }
      
      const loader = document.getElementById('app-loader');
      if (loader) loader.style.display = 'none';
    };
    init();
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) setTheme('light');
  }, []);

  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); }, [theme]);

  const goHome = () => {
    setView('landing');
    setCurrentEventId(null);
    const url = new URL(window.location);
    url.searchParams.delete('event');
    window.history.pushState({}, '', url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToCreate = () => setView('create');
  const goToEvent = (id) => {
    setCurrentEventId(id);
    setView('event');
    const url = new URL(window.location);
    url.searchParams.set('event', id);
    window.history.pushState({}, '', url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (configError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-slate-900 text-white">
        <Database size={48} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Supabase Ayarları Eksik</h1>
        <p className="max-w-md text-slate-400 mb-4">Lütfen <code>src/App.jsx</code> dosyasındaki <code>supabaseUrl</code> ve <code>supabaseKey</code> alanlarını doldurun.</p>
        <p className="text-xs text-slate-600">Projenizdeki SQL Tablolarını oluşturduğunuzdan emin olun.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-slate-900 dark:text-slate-100 transition-colors duration-500 overflow-x-hidden bg-slate-50 dark:bg-slate-950">
      <div className="fixed inset-0 -z-10 overflow-hidden">
         <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
         <div className="absolute bottom-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
         <div className={`absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 brightness-100 contrast-150 mix-blend-overlay`} />
      </div>

      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-6 px-6 py-3 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/20">
          <div onClick={goHome} className="flex items-center gap-3 cursor-pointer group select-none">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
              <Camera className="text-white" size={16} />
            </div>
            <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300">EventGlass</span>
          </div>
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
          <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-500 dark:text-slate-400">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </motion.div>
      </nav>

      <main className="pt-32 pb-12 px-4 md:px-8 max-w-7xl mx-auto min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          {view === 'landing' && <LandingPage key="landing" onCreateClick={goToCreate} onJoinClick={goToEvent} />}
          {view === 'create' && <CreateEventPage key="create" onCancel={goHome} onCreated={goToEvent} />}
          {view === 'event' && currentEventId && <EventDetailPage key="event" eventId={currentEventId} onInvalidId={goHome} />}
        </AnimatePresence>
      </main>
      
      <footer className="py-6 text-center">
        <span className="text-xs font-black tracking-[0.6em] opacity-30 uppercase font-mono">YALIN</span>
      </footer>
    </div>
  );
}

// --- SUB COMPONENTS ---

function LandingPage({ onCreateClick, onJoinClick }) {
  const [joinId, setJoinId] = useState('');
  const handleJoin = (e) => { e.preventDefault(); if (joinId.trim().length > 3) onJoinClick(joinId.trim()); };

  return (
    <div className="flex flex-col items-center justify-center flex-grow text-center gap-16">
      <div className="space-y-8 max-w-4xl relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20">
          <Sparkles size={14} /> Kemik Kadro Edition
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[1.1]">
          Anılarınızı <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 animate-gradient-x">Sonsuzlaştırın</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
          Etkinlikleriniz için Supabase destekli, yeni nesil fotoğraf paylaşım platformu.
        </motion.p>
      </div>

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <GlassCard onClick={onCreateClick} className="p-8 group cursor-pointer hover:border-blue-500/40 dark:hover:border-blue-500/40 hover:shadow-2xl transition-all text-left">
          <div className="flex justify-between items-start mb-6">
             <div className="p-4 rounded-2xl bg-blue-600 text-white shadow-lg group-hover:scale-110 transition-transform"><Plus size={32} /></div>
             <ArrowRight className="text-slate-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Etkinlik Oluştur</h3>
          <p className="text-slate-500 dark:text-slate-400">Kendi özel alanını yarat, anıları topla.</p>
        </GlassCard>
        <GlassCard className="p-8 text-left flex flex-col justify-between">
          <div className="mb-6">
             <div className="p-4 w-fit rounded-2xl bg-purple-600 text-white shadow-lg mb-6"><Smartphone size={32} /></div>
             <h3 className="text-2xl font-bold mb-2">Mevcuta Katıl</h3>
             <p className="text-slate-500 dark:text-slate-400">Davet kodunu gir ve galeriye anında eriş.</p>
          </div>
          <form onSubmit={handleJoin} className="relative w-full">
            <input type="text" placeholder="EVT-XXXX-..." className="w-full pl-4 pr-12 py-4 rounded-xl bg-slate-100 dark:bg-black/20 border-transparent focus:bg-white dark:focus:bg-black/40 focus:border-purple-500 focus:outline-none transition-all font-mono uppercase" value={joinId} onChange={(e) => setJoinId(e.target.value)} />
            <button type="submit" disabled={joinId.length < 4} className="absolute right-2 top-2 bottom-2 aspect-square bg-purple-600 rounded-lg text-white hover:bg-purple-700 flex items-center justify-center"><ArrowRight size={20} /></button>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}

function CreateEventPage({ onCancel, onCreated }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', cover: IMAGE_OPTIONS[0] });
  const [tab, setTab] = useState('images');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const eventId = "EVT-" + Math.floor(1000 + Math.random() * 9000) + "-" + Math.random().toString(36).substring(2, 5).toUpperCase();
      
      const { error } = await supabase.from('events').insert({
        id: eventId,
        title: formData.name,
        description: formData.description,
        cover_url: formData.cover,
        creator_id: currentUser
      });

      if (error) throw error;

      onCreated(eventId);
    } catch (error) {
      console.error("Error:", error);
      alert("Oluşturulurken hata oluştu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto mt-8">
      <div className="flex items-center gap-2 mb-8 text-slate-500 cursor-pointer hover:text-blue-500 transition-colors w-fit" onClick={onCancel}>
        <div className="p-2 rounded-full bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-white/20"><ChevronLeft size={20} /></div>
        <span className="font-medium">Geri Dön</span>
      </div>
      <GlassCard className="p-8 md:p-12">
        <div className="flex justify-between items-start">
            <h2 className="text-4xl font-bold mb-2">Yeni Etkinlik</h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Supabase veritabanı üzerinde alan oluşturun.</p>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold ml-1 text-slate-600 dark:text-slate-300">Etkinlik Adı</label>
              <input required type="text" placeholder="Örn: Kemik Kadro Toplantısı" className="w-full px-4 py-4 rounded-xl bg-slate-50 dark:bg-black/20 border-transparent border focus:border-blue-500 focus:bg-white dark:focus:bg-black/40 focus:outline-none transition-all font-medium text-lg" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-semibold ml-1 text-slate-600 dark:text-slate-300">Açıklama</label>
              <textarea rows={2} placeholder="Detaylar..." className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border-transparent border focus:border-blue-500 focus:bg-white dark:focus:bg-black/40 focus:outline-none transition-all resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold ml-1 text-slate-600 dark:text-slate-300">Kapak Teması</label>
              <div className="flex gap-2 p-1 bg-slate-100 dark:bg-white/5 rounded-lg">
                {['images', 'gradients', 'colors'].map(t => (
                    <button key={t} type="button" onClick={() => setTab(t)} className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${tab === t ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 min-h-[100px]">
              {tab === 'images' && IMAGE_OPTIONS.map((opt, idx) => (
                <div key={idx} onClick={() => setFormData({...formData, cover: opt})} className={`relative aspect-video rounded-xl cursor-pointer overflow-hidden transition-all ${formData.cover === opt ? 'ring-4 ring-blue-500 scale-105 z-10' : 'hover:opacity-80'}`}>
                  <img src={opt} className="w-full h-full object-cover" alt="theme" />
                  {formData.cover === opt && <div className="absolute inset-0 bg-black/20 flex items-center justify-center"><div className="bg-white rounded-full p-1"><Check size={14} className="text-blue-500" /></div></div>}
                </div>
              ))}
              {tab === 'gradients' && GRADIENT_OPTIONS.map((opt) => (
                <div key={opt.id} onClick={() => setFormData({...formData, cover: opt.id})} className={`relative aspect-video rounded-xl cursor-pointer overflow-hidden transition-all ${formData.cover === opt.id ? 'ring-4 ring-blue-500 scale-105 z-10' : 'hover:opacity-80'} ${opt.class}`}>
                   {formData.cover === opt.id && <div className="absolute inset-0 flex items-center justify-center"><div className="bg-white rounded-full p-1"><Check size={14} className="text-blue-500" /></div></div>}
                </div>
              ))}
              {tab === 'colors' && SOLID_COLORS.map((color) => (
                <div key={color} onClick={() => setFormData({...formData, cover: color})} className={`relative aspect-video rounded-xl cursor-pointer overflow-hidden transition-all ${formData.cover === color ? 'ring-4 ring-blue-500 scale-105 z-10' : 'hover:opacity-80'}`} style={{ backgroundColor: color }}>
                    {formData.cover === color && <div className="absolute inset-0 flex items-center justify-center"><div className="bg-white rounded-full p-1"><Check size={14} className="text-blue-500" /></div></div>}
                </div>
              ))}
            </div>
          </div>
          <Button type="submit" variant="primary" className="w-full py-5 text-lg mt-4 rounded-xl" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : 'Etkinliği Başlat'}
          </Button>
        </form>
      </GlassCard>
    </motion.div>
  );
}

function EventDetailPage({ eventId, onInvalidId }) {
  const [event, setEvent] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  
  const currentIndex = selectedPhoto ? photos.findIndex(p => p.id === selectedPhoto.id) : -1;
  const shareUrl = `${window.location.origin}${window.location.pathname}?event=${eventId}`;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedPhoto) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setSelectedPhoto(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, photos]);

  const handleNext = () => {
      const idx = photos.findIndex(p => p.id === selectedPhoto.id);
      if (idx < photos.length - 1) setSelectedPhoto(photos[idx + 1]);
  };
  const handlePrev = () => {
      const idx = photos.findIndex(p => p.id === selectedPhoto.id);
      if (idx > 0) setSelectedPhoto(photos[idx - 1]);
  };

  // FETCH DATA (Supabase)
  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    const fetchEvent = async () => {
        const { data, error } = await supabase.from('events').select('*').eq('id', eventId).single();
        if (error || !data) {
            setError('not_found');
        } else {
            setEvent({ ...data, coverUrl: data.cover_url });
        }
        setLoading(false);
    };
    fetchEvent();
  }, [eventId]);

  // REALTIME SUBSCRIPTION
  useEffect(() => {
    if (!eventId) return;
    
    // Initial Fetch
    supabase.from('photos').select('*').eq('event_id', eventId).order('created_at', { ascending: false })
      .then(({ data }) => {
          if (data) setPhotos(data);
      });

    // Subscribe
    const subscription = supabase
      .channel('public:photos')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'photos', filter: `event_id=eq.${eventId}` }, (payload) => {
        setPhotos(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
        supabase.removeChannel(subscription);
    };
  }, [eventId]);

  const handleFileUpload = async (files) => {
    setUploading(true);
    try {
      const promises = Array.from(files).map(async (file) => {
          const fileName = `${eventId}/${Date.now()}_${Math.random().toString(36).substring(7)}`;
          
          // Upload to Supabase Storage
          const { data: uploadData, error: uploadError } = await supabase.storage.from('event-photos').upload(fileName, file);
          if (uploadError) throw uploadError;

          // Get Public URL
          const { data: { publicUrl } } = supabase.storage.from('event-photos').getPublicUrl(fileName);

          // Insert Row
          const { error: dbError } = await supabase.from('photos').insert({
             event_id: eventId,
             url: publicUrl,
             name: file.name,
             uploader_id: currentUser
          });
          if(dbError) throw dbError;
      });
      await Promise.all(promises);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Yükleme sırasında hata oluştu: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadSingle = async (e, photo) => {
    e.stopPropagation(); e.preventDefault();
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = `yalinalpagan-${photo.id}.jpg`;
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
    } catch (err) { console.error("DL Error", err); }
  };

  const handleDownloadAll = async () => {
    if (!window.JSZip) { alert("ZIP kütüphanesi eksik."); return; }
    setIsDownloadingAll(true);
    const zip = new window.JSZip();
    const folder = zip.folder(`Yalin-Event-${eventId}`);
    try {
      await Promise.all(photos.map(async (p, i) => {
          const res = await fetch(p.url);
          const blob = await res.blob();
          folder.file(`photo-${i+1}.jpg`, blob);
      }));
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `Yalin-Event-${eventId}.zip`;
      link.click();
    } catch (e) { console.error(e); alert("İndirme hatası."); }
    finally { setIsDownloadingAll(false); }
  };

  if (error === 'not_found') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
        <Lock size={48} className="text-red-500" />
        <h2 className="text-3xl font-bold">Etkinlik Yok</h2>
        <Button onClick={onInvalidId}>Ana Sayfa</Button>
      </div>
    );
  }

  if (loading && !event) return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="animate-spin text-blue-500" size={40} /></div>;

  const isImage = event?.coverUrl?.startsWith('http');
  const isGradient = event?.coverUrl?.startsWith('gradient-');
  const isColor = !isImage && !isGradient;
  const gradientClass = isGradient ? GRADIENT_OPTIONS.find(g => g.id === event.coverUrl)?.class : '';

  return (
    <div className="space-y-8 pb-20 relative mt-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative h-[45vh] rounded-[2.5rem] overflow-hidden shadow-2xl group" style={isColor ? { backgroundColor: event.coverUrl } : {}}>
        {isImage && <img src={event?.coverUrl} alt="Cover" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] ease-out group-hover:scale-105" />}
        {isGradient && <div className={`absolute inset-0 w-full h-full ${gradientClass}`} />}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl text-sm font-mono border border-white/10 tracking-wider text-white/90">{event?.id}</span>
               </div>
               <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight drop-shadow-xl">{event?.title}</h1>
               {event?.description && <p className="text-xl text-white/80 max-w-2xl font-light">{event.description}</p>}
            </div>
            <div className="flex gap-3">
               <Button variant="glass" icon={Share2} onClick={() => setShowShareModal(true)}>Davet Et</Button>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <GlassCard className="p-0 overflow-hidden border-dashed border-2 border-blue-500/20 hover:border-blue-500/50 transition-all group">
          <label className="flex flex-col items-center justify-center py-16 cursor-pointer relative">
             <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors" />
             <div className="p-6 rounded-full bg-blue-500/10 text-blue-600 mb-4 group-hover:scale-110 transition-transform">{uploading ? <Loader2 className="animate-spin" size={40} /> : <Upload size={40} />}</div>
             <h3 className="text-2xl font-bold">Fotoğraf Ekle</h3>
             <p className="text-slate-500 mt-2">Supabase Storage'a kaydetmek için tıklayın.</p>
             <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e.target.files)} disabled={uploading} />
          </label>
        </GlassCard>
      </motion.div>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 px-2">
          <h3 className="text-3xl font-bold tracking-tight">Galeri <span className="text-slate-400 text-xl font-normal align-top ml-1">({photos.length})</span></h3>
          {photos.length > 0 && <Button variant="secondary" className="py-2.5 text-xs rounded-full" icon={isDownloadingAll ? Loader2 : FileArchive} onClick={handleDownloadAll} disabled={isDownloadingAll}>{isDownloadingAll ? 'Hazırlanıyor...' : 'Tümünü İndir'}</Button>}
        </div>
        
        {photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-white/5">
            <div className="p-6 rounded-full bg-slate-100 dark:bg-white/5"><ImageIcon size={48} className="opacity-30" /></div>
            <p className="text-lg font-medium">Henüz fotoğraf yok.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {photos.map((photo) => (
                <motion.div layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} key={photo.id} onClick={() => setSelectedPhoto(photo)} className="aspect-square rounded-2xl overflow-hidden cursor-zoom-in relative group bg-slate-200 dark:bg-slate-800 shadow-sm hover:shadow-xl transition-all">
                  <img src={photo.url} alt="Memory" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showShareModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] w-screen h-screen bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setShowShareModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] max-w-sm w-full shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold">Davet Et</h3>
                <button onClick={() => setShowShareModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X size={24} /></button>
              </div>
              <div className="flex flex-col items-center gap-8">
                <div className="p-6 bg-white rounded-3xl shadow-inner">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`} alt="Event QR" className="w-48 h-48 mix-blend-multiply" />
                </div>
                <div className="flex gap-3 w-full">
                   <CopyButton text={eventId} label="ID" icon={Copy} className="flex-1" />
                   <CopyButton text={shareUrl} label="Link" icon={LinkIcon} variant="primary" className="flex-1" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center overflow-hidden" onClick={() => setSelectedPhoto(null)}>
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent">
               <button onClick={() => setSelectedPhoto(null)} className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"><X size={24} /></button>
               <button onClick={(e) => handleDownloadSingle(e, selectedPhoto)} className="flex items-center gap-2 px-5 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-lg"><Download size={20} /> <span className="hidden md:inline">İndir</span></button>
            </div>
            <div className="relative w-full h-full flex items-center justify-center px-4">
              {currentIndex > 0 && <button onClick={(e) => {e.stopPropagation(); handlePrev()}} className="absolute left-4 z-50 p-4 rounded-full bg-white/10 text-white backdrop-blur-md hover:scale-110 transition-all"><ChevronLeft size={32} /></button>}
              <motion.img key={selectedPhoto.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} src={selectedPhoto.url} alt="Full view" className="max-w-full max-h-full object-contain" onClick={e => e.stopPropagation()} />
              {currentIndex < photos.length - 1 && <button onClick={(e) => {e.stopPropagation(); handleNext()}} className="absolute right-4 z-50 p-4 rounded-full bg-white/10 text-white backdrop-blur-md hover:scale-110 transition-all"><ChevronRight size={32} /></button>}
            </div>
            <div className="absolute bottom-8 text-white/20 text-xs font-black tracking-[1em]">YALIN</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
