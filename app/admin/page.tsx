"use client";

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ImagePlus, 
  MessageSquare, 
  Video, 
  Users, 
  Monitor, 
  Save, 
  Upload, 
  Plus, 
  Trash2,
  AlertCircle,
  Menu,
  X,
  CheckCircle2,
  Lock,
  User,
  Key,
  ShieldAlert,
  LogOut,
  UserPlus,
  Loader2,
  Camera,
  PlaySquare
} from 'lucide-react';

// --- STYLES ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');
  .font-inter { font-family: 'Inter', sans-serif; }
  .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
  .no-scrollbar::-webkit-scrollbar { display: none; }
  @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  .animate-slide-in { animation: slideIn 0.3s ease-out forwards; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
`;

export default function AdminDashboard() {
  // ==========================================
  // CONFIG & SECURITY
  // ==========================================
  const GAS_URL = "https://script.google.com/macros/s/AKfycbyjRB-t3iDlFSzYgm0Z_NkKed4tXBbXvBiSG1PNmvWTyX1FTyyzgkVYZe43cZuRvDYS/exec"; 

  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);

  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState('about');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState<any>(null); 
  const [isSaving, setIsSaving] = useState(false);

  // --- CONTENT DATA STATE ---
  const [aboutImg, setAboutImg] = useState("https://placehold.co/600x600/1e293b/f97316?text=Foto+Tentang+Kami");
  const [testimonials, setTestimonials] = useState([
    { id: 1, name: 'Rina Kartika', role: 'Business Owner', text: 'Pembukuan usaha saya jadi jauh lebih rapi.' }
  ]);
  const [docs, setDocs] = useState([
    { id: 1, title: 'Webinar Tax Planning', desc: 'Sesi berbagi strategi pajak.', img: 'https://placehold.co/800x500/1e293b/f97316?text=Dokumentasi+1' }
  ]);
  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/embed/tgbNymZ7vqY");
  const [team, setTeam] = useState([
    { id: 1, name: 'Adhwa Neisya', job: 'Tax/Accounting', img: 'https://placehold.co/200x200/1e293b/f97316?text=Praktisi' }
  ]);
  const [adminUsers, setAdminUsers] = useState([
    { id: 1, username: 'admin', name: 'Adhwa Neisya', role: 'Super Admin', email: 'adhwa@finensia.com' }
  ]);

  // --- INIT & SESSION ---
  useEffect(() => {
    setIsMounted(true);
    if (sessionStorage.getItem('finensia_auth') === 'true') setIsLoggedIn(true);
    
    const lockUntil = localStorage.getItem('finensia_lock_time');
    if (lockUntil && new Date().getTime() < parseInt(lockUntil)) {
      setIsLocked(true);
      setLockTimeRemaining(Math.ceil((parseInt(lockUntil) - new Date().getTime()) / 60000));
    }
  }, []);

  // --- SECURITY LAYER: NO INSPECT ---
  useEffect(() => {
    if (isLoggedIn || !isMounted) return;
    const prevent = (e: any) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') || (e.ctrlKey && e.key.toLowerCase() === 'u')) e.preventDefault();
    };
    document.addEventListener('keydown', prevent);
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    return () => document.removeEventListener('keydown', prevent);
  }, [isLoggedIn, isMounted]);

  // --- AUTH LOGIC ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    // admin / admin123
    if (btoa(loginUsername) === 'YWRtaW4=' && btoa(loginPassword) === 'YWRtaW4xMjM=') {
      setIsLoggedIn(true);
      sessionStorage.setItem('finensia_auth', 'true');
      localStorage.removeItem('finensia_attempts');
    } else {
      const att = failedAttempts + 1;
      setFailedAttempts(att);
      if (att >= 3) {
        const until = new Date().getTime() + 15 * 60000;
        localStorage.setItem('finensia_lock_time', until.toString());
        setIsLocked(true);
        setLoginError("Terlalu banyak percobaan! Terkunci 15 menit.");
      } else {
        setLoginError(`Salah! Percobaan ${att}/3`);
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('finensia_auth');
  };

  // --- ACTIONS ---
  const showNotif = (msg: string, type: string = 'success') => {
    setNotification({ message: msg, type });
    if (type !== 'loading') setTimeout(() => setNotification(null), 3000);
  };

  const saveToGAS = async (section: string, data: any) => {
    setIsSaving(true);
    showNotif(`Menyimpan [${section}]...`, 'loading');
    try {
      const res = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'updateData', section, data })
      });
      if (res.ok) showNotif(`[${section}] Berhasil Disimpan!`);
      else throw new Error();
    } catch {
      showNotif(`Gagal mengirim ke database.`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // --- HANDLERS ---
  const handleImg = (e: any, setter: any) => {
    const file = e.target.files[0];
    if (file) {
      const r = new FileReader();
      r.onloadend = () => setter(r.result as string);
      r.readAsDataURL(file);
    }
  };

  const updateArr = (id: number, field: string, val: string, state: any[], setter: any) => {
    setter(state.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  if (!isMounted) return null;

  // ==========================================
  // LOGIN SCREEN
  // ==========================================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-inter select-none">
        <style>{styles}</style>
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl animate-fade-in">
          <div className="flex justify-center mb-8">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isLocked ? 'bg-red-500' : 'bg-orange-500 shadow-lg shadow-orange-500/20'}`}>
              <Lock className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center text-white font-jakarta mb-2">Secure Login</h1>
          <p className="text-slate-500 text-center text-sm mb-8">Finensia Admin Control</p>
          {loginError && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-2"><ShieldAlert size={16}/> {loginError}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="Username" value={loginUsername} onChange={e=>setLoginUsername(e.target.value)} className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-orange-500 transition" required />
            <input type="password" placeholder="Password" value={loginPassword} onChange={e=>setLoginPassword(e.target.value)} className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-orange-500 transition" required />
            <button type="submit" disabled={isLocked} className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition shadow-lg shadow-orange-500/20 disabled:bg-slate-700">Masuk Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD MAIN
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 flex font-inter text-slate-800 animate-fade-in">
      <style>{styles}</style>
      
      {/* NOTIF TOAST */}
      {notification && (
        <div className={`fixed top-6 right-6 z-[100] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in border-l-4 ${notification.type === 'error' ? 'bg-red-900 border-red-500' : 'bg-slate-900 border-orange-500'}`}>
          {notification.type === 'loading' ? <Loader2 className="animate-spin text-orange-500" size={20}/> : <CheckCircle2 className="text-orange-500" size={20}/>}
          <p className="font-medium text-sm">{notification.message}</p>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="hidden md:flex w-72 bg-slate-950 text-slate-400 flex-col fixed h-full z-20">
        <div className="p-8 flex items-center gap-3 border-b border-slate-800">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white"><TrendingUp size={24}/></div>
          <span className="text-2xl font-bold text-white font-jakarta">Finensia.</span>
        </div>
        <nav className="flex-1 p-6 space-y-2">
          {[
            { id: 'about', icon: ImagePlus, label: '1. Tentang Kami' },
            { id: 'testi', icon: MessageSquare, label: '2. Testimoni' },
            { id: 'doc', icon: Camera, label: '3. Dokumentasi' },
            { id: 'video', icon: PlaySquare, label: '4. Video Profil' },
            { id: 'team', icon: Users, label: '5. Praktisi' },
            { id: 'admins', icon: UserPlus, label: '6. Kelola Admin' },
          ].map(m => (
            <button key={m.id} onClick={()=>setActiveTab(m.id)} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${activeTab === m.id ? 'bg-orange-500 text-white font-bold' : 'hover:bg-slate-800'}`}>
              <m.icon size={20}/> {m.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-3.5 bg-red-500/10 text-red-400 rounded-xl font-bold hover:bg-red-500 hover:text-white transition"><LogOut size={18}/> Keluar</button>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 md:ml-72 p-6 md:p-10 pt-10 max-w-5xl">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 font-jakarta">Kelola Konten</h1>
            <p className="text-slate-500">Update tampilan website Finensia.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
             <div className="text-right"><p className="font-bold text-sm">Adhwa Neisya</p><p className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">Super Admin</p></div>
             <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold border border-slate-200">A</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[60vh]">
          
          {/* 1. ABOUT */}
          {activeTab === 'about' && (
            <div className="p-8 animate-fade-in">
              <div className="flex justify-between items-center border-b pb-6 mb-8">
                <h3 className="text-2xl font-bold font-jakarta">1. Tentang Kami</h3>
                <button onClick={()=>saveToGAS('Tentang Kami', {image: aboutImg})} disabled={isSaving} className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition disabled:opacity-50">
                   <Save size={18}/> {isSaving ? 'Saving...' : 'Simpan Foto'}
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-10">
                <div className="aspect-square bg-slate-50 rounded-3xl border-2 border-slate-100 overflow-hidden shadow-inner"><img src={aboutImg} className="w-full h-full object-cover" /></div>
                <div className="flex flex-col justify-center bg-slate-50 p-8 rounded-3xl border border-slate-200 text-center">
                  <Upload size={40} className="mx-auto mb-4 text-orange-500" />
                  <h4 className="font-bold mb-2">Ganti Foto Baru</h4>
                  <p className="text-xs text-slate-400 mb-6">Pilih file foto terbaik dari perangkat Anda.</p>
                  <input type="file" id="upAbout" className="hidden" accept="image/*" onChange={e=>handleImg(e, setAboutImg)} />
                  <label htmlFor="upAbout" className="cursor-pointer py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition">Pilih File</label>
                </div>
              </div>
            </div>
          )}

          {/* 2. TESTIMONI */}
          {activeTab === 'testi' && (
            <div className="p-8 animate-fade-in">
              <div className="flex justify-between items-center border-b pb-6 mb-8">
                <h3 className="text-2xl font-bold font-jakarta">2. Testimoni Klien</h3>
                <div className="flex gap-3">
                  <button onClick={()=>setTestimonials([{id: Date.now(), name:'', role:'', text:''}, ...testimonials])} className="px-4 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2"><Plus size={18}/> Tambah</button>
                  <button onClick={()=>saveToGAS('Testimoni', testimonials)} disabled={isSaving} className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center gap-2"><Save size={18}/> Simpan Semua</button>
                </div>
              </div>
              <div className="space-y-6">
                {testimonials.map(t => (
                  <div key={t.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input type="text" value={t.name} onChange={e=>updateArr(t.id, 'name', e.target.value, testimonials, setTestimonials)} placeholder="Nama Klien" className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold focus:border-orange-500 outline-none transition" />
                      <input type="text" value={t.role} onChange={e=>updateArr(t.id, 'role', e.target.value, testimonials, setTestimonials)} placeholder="Pekerjaan" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-orange-600 font-bold focus:border-orange-500 outline-none transition" />
                    </div>
                    <textarea rows={3} value={t.text} onChange={e=>updateArr(t.id, 'text', e.target.value, testimonials, setTestimonials)} placeholder="Ulasan klien..." className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:border-orange-500 outline-none transition resize-none"></textarea>
                    <button onClick={()=>setTestimonials(testimonials.filter(x=>x.id!==t.id))} className="text-red-500 text-sm font-bold flex items-center gap-1 mt-4 ml-auto hover:underline"><Trash2 size={14}/> Hapus Baris</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. DOKUMENTASI */}
          {activeTab === 'doc' && (
            <div className="p-8 animate-fade-in">
              <div className="flex justify-between items-center border-b pb-6 mb-8">
                <h3 className="text-2xl font-bold font-jakarta">3. Dokumentasi</h3>
                <div className="flex gap-3">
                  <button onClick={()=>setDocs([{id: Date.now(), title:'', desc:'', img:'https://placehold.co/800x500/1e293b/f97316?text=Upload+Foto'}, ...docs])} className="px-4 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2"><Plus size={18}/> Tambah</button>
                  <button onClick={()=>saveToGAS('Dokumentasi', docs)} disabled={isSaving} className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center gap-2"><Save size={18}/> Simpan Semua</button>
                </div>
              </div>
              <div className="space-y-8">
                {docs.map(d => (
                  <div key={d.id} className="grid md:grid-cols-3 gap-6 p-6 bg-slate-50 border border-slate-200 rounded-3xl">
                    <div className="relative aspect-video rounded-2xl overflow-hidden border bg-white group">
                      <img src={d.img} className="w-full h-full object-cover" />
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                         <Upload className="text-white"/>
                         <input type="file" className="hidden" accept="image/*" onChange={e=>{
                            const f = e.target.files?.[0];
                            if(f){
                              const r = new FileReader();
                              r.onloadend = () => setDocs(docs.map(x=>x.id===d.id ? {...x, img: r.result as string} : x));
                              r.readAsDataURL(f);
                            }
                         }}/>
                      </label>
                    </div>
                    <div className="md:col-span-2 flex flex-col justify-between">
                       <div className="space-y-4">
                         <input type="text" value={d.title} onChange={e=>updateArr(d.id, 'title', e.target.value, docs, setDocs)} placeholder="Judul Dokumentasi" className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold outline-none focus:border-orange-500 transition" />
                         <textarea rows={2} value={d.desc} onChange={e=>updateArr(d.id, 'desc', e.target.value, docs, setDocs)} placeholder="Keterangan singkat..." className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-500 transition resize-none"></textarea>
                       </div>
                       <button onClick={()=>setDocs(docs.filter(x=>x.id!==d.id))} className="text-red-500 text-sm font-bold flex items-center gap-1 mt-4 ml-auto"><Trash2 size={16}/> Hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. VIDEO */}
          {activeTab === 'video' && (
            <div className="p-8 animate-fade-in">
              <div className="flex justify-between items-center border-b pb-6 mb-8">
                <h3 className="text-2xl font-bold font-jakarta">4. Video Profil</h3>
                <button onClick={()=>saveToGAS('Video Profil', {url: videoUrl})} disabled={isSaving} className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center gap-2"><Save size={18}/> Simpan Link</button>
              </div>
              <div className="grid lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <label className="block text-sm font-bold text-slate-700">Link Embed YouTube</label>
                  <input type="text" value={videoUrl} onChange={e=>setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/embed/..." className="w-full p-4 border border-slate-200 rounded-2xl bg-slate-50 font-mono text-sm text-blue-600 outline-none focus:bg-white focus:border-orange-500 transition" />
                  <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex gap-4 text-blue-800 text-xs">
                    <AlertCircle size={20} className="shrink-0 text-blue-500" />
                    <div><p className="font-bold mb-1">Penting:</p><p>Gunakan link embed (ada kata <b>/embed/</b>) agar video bisa langsung dimainkan di web.</p></div>
                  </div>
                </div>
                <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                  <iframe width="100%" height="100%" src={videoUrl} frameBorder="0" allowFullScreen></iframe>
                </div>
              </div>
            </div>
          )}

          {/* 5. PRAKTISI */}
          {activeTab === 'team' && (
            <div className="p-8 animate-fade-in">
              <div className="flex justify-between items-center border-b pb-6 mb-8">
                <h3 className="text-2xl font-bold font-jakarta">5. Tim Praktisi</h3>
                <div className="flex gap-3">
                  <button onClick={()=>setTeam([{id: Date.now(), name:'', job:'', img:'https://placehold.co/200x200/1e293b/f97316?text=Foto'}, ...team])} className="px-4 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2"><Plus size={18}/> Tambah</button>
                  <button onClick={()=>saveToGAS('Tim Praktisi', team)} disabled={isSaving} className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center gap-2"><Save size={18}/> Simpan Semua</button>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {team.map(m => (
                  <div key={m.id} className="p-6 bg-slate-50 border border-slate-200 rounded-3xl flex gap-6">
                    <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden border-2 bg-white group">
                       <img src={m.img} className="w-full h-full object-cover" />
                       <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                         <Upload className="text-white" size={20}/>
                         <input type="file" className="hidden" accept="image/*" onChange={e=>{
                            const f = e.target.files?.[0];
                            if(f){
                              const r = new FileReader();
                              r.onloadend = () => setTeam(team.map(x=>x.id===m.id ? {...x, img: r.result as string} : x));
                              r.readAsDataURL(f);
                            }
                         }}/>
                      </label>
                    </div>
                    <div className="flex-1 space-y-3">
                       <input type="text" value={m.name} onChange={e=>updateArr(m.id, 'name', e.target.value, team, setTeam)} placeholder="Nama Lengkap" className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold outline-none focus:border-orange-500" />
                       <input type="text" value={m.job} onChange={e=>updateArr(m.id, 'job', e.target.value, team, setTeam)} placeholder="Jabatan/Role" className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-orange-600 outline-none focus:border-orange-500" />
                       <button onClick={()=>setTeam(team.filter(x=>x.id!==m.id))} className="text-red-400 hover:text-red-600 transition"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. KELOLA ADMIN */}
          {activeTab === 'admins' && (
            <div className="p-8 animate-fade-in">
              <div className="flex justify-between items-center border-b pb-6 mb-8">
                <h3 className="text-2xl font-bold font-jakarta">6. Kelola Admin</h3>
                <div className="flex gap-3">
                  <button onClick={()=>setAdminUsers([{id: Date.now(), username:'', name:'', role:'Editor', email:''}, ...adminUsers])} className="px-4 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2"><UserPlus size={18}/> Tambah</button>
                  <button onClick={()=>saveToGAS('Data Admin', adminUsers)} disabled={isSaving} className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center gap-2"><Save size={18}/> Simpan List</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b text-xs font-bold text-slate-400 uppercase"><th className="pb-4 px-4">Nama / Email</th><th className="pb-4 px-4">Username</th><th className="pb-4 px-4">Akses</th><th className="pb-4 px-4">Aksi</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {adminUsers.map(a => (
                      <tr key={a.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-4 px-4">
                          <input type="text" value={a.name} onChange={e=>updateArr(a.id, 'name', e.target.value, adminUsers, setAdminUsers)} className="block w-full font-bold bg-transparent outline-none focus:text-orange-500" placeholder="Nama" />
                          <input type="text" value={a.email} onChange={e=>updateArr(a.id, 'email', e.target.value, adminUsers, setAdminUsers)} className="block w-full text-xs text-slate-400 bg-transparent outline-none" placeholder="Email" />
                        </td>
                        <td className="py-4 px-4"><input type="text" value={a.username} onChange={e=>updateArr(a.id, 'username', e.target.value, adminUsers, setAdminUsers)} className="w-full p-2 bg-white border border-slate-100 rounded-lg text-sm outline-none" placeholder="user" /></td>
                        <td className="py-4 px-4"><select value={a.role} onChange={e=>updateArr(a.id, 'role', e.target.value, adminUsers, setAdminUsers)} className="bg-transparent text-sm font-bold text-orange-600 outline-none"><option>Super Admin</option><option>Editor</option></select></td>
                        <td className="py-4 px-4"><button onClick={()=>setAdminUsers(adminUsers.filter(x=>x.id!==a.id))} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
