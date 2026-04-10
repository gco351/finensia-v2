"use client";

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, ImagePlus, MessageSquare, Video, Users, Monitor, Save, Upload, Plus, Trash2,
  AlertCircle, Menu, X, CheckCircle2, Lock, User, Key, ShieldAlert, LogOut, UserPlus, Loader2, Camera, PlaySquare, RefreshCw
} from 'lucide-react';

// --- CUSTOM STYLES ---
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
  // CONFIGURATION (LINK GOOGLE SCRIPT BOS)
  // ==========================================
  const GAS_URL = "https://script.google.com/macros/s/AKfycbwG1EeLiRedbDh_Vc6ztm87swe8Z4nHwOR6Tg_TTmIbR23m5nodKt6_NlpckYIN5fk9/exec"; 

  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);

  // --- UI STATES ---
  const [activeTab, setActiveTab] = useState('about');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: string} | null>(null); 
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // --- DATA STATES ---
  const [aboutImg, setAboutImg] = useState("https://placehold.co/600x600/1e293b/f97316?text=Foto+Tentang+Kami");
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [docs, setDocs] = useState<any[]>([]);
  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/embed/tgbNymZ7vqY");
  const [team, setTeam] = useState<any[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);

  // ==========================================
  // SYNC DATA (MENARIK DATA DARI DATABASE)
  // ==========================================
  const refreshData = async () => {
    setIsLoadingData(true);
    try {
      // Tambahkan timestamp (?t=) untuk menghindari cache browser
      const res = await fetch(`${GAS_URL}?t=${new Date().getTime()}`);
      const json = await res.json();
      
      if (json.status === 'success' && json.data) {
        const d = json.data;
        if (d['Tentang Kami']?.image) setAboutImg(d['Tentang Kami'].image);
        if (d['Testimoni'] && Array.isArray(d['Testimoni'])) setTestimonials(d['Testimoni']);
        if (d['Dokumentasi'] && Array.isArray(d['Dokumentasi'])) setDocs(d['Dokumentasi']);
        if (d['Video Profil']?.url) setVideoUrl(d['Video Profil'].url);
        if (d['Tim Praktisi'] && Array.isArray(d['Tim Praktisi'])) setTeam(d['Tim Praktisi']);
        if (d['Data Admin'] && Array.isArray(d['Data Admin'])) setAdminUsers(d['Data Admin']);
      }
    } catch (err) {
      console.error("Gagal sinkron database:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    if (sessionStorage.getItem('finensia_auth') === 'true') {
      setIsLoggedIn(true);
      refreshData();
    }
    
    const lockUntil = localStorage.getItem('finensia_lock_time');
    if (lockUntil && new Date().getTime() < parseInt(lockUntil)) {
      setIsLocked(true);
      setLockTimeRemaining(Math.ceil((parseInt(lockUntil) - new Date().getTime()) / 60000));
    }
  }, []);

  // ==========================================
  // AUTHENTICATION
  // ==========================================
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    // Login: admin / admin123
    if (btoa(loginUsername) === 'YWRtaW4=' && btoa(loginPassword) === 'YWRtaW4xMjM=') {
      setIsLoggedIn(true);
      sessionStorage.setItem('finensia_auth', 'true');
      refreshData();
    } else {
      const att = failedAttempts + 1;
      setFailedAttempts(att);
      if (att >= 3) {
        const until = new Date().getTime() + 15 * 60000;
        localStorage.setItem('finensia_lock_time', until.toString());
        setIsLocked(true);
        setLoginError("Terkunci 15 menit.");
      } else {
        setLoginError(`Kredensial salah! Percobaan ${att}/3`);
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('finensia_auth');
  };

  // ==========================================
  // SAVE ACTIONS
  // ==========================================
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
      if (res.ok) {
        showNotif(`[${section}] Berhasil Disimpan!`);
        setTimeout(() => refreshData(), 1000);
      } else throw new Error();
    } catch {
      showNotif(`Gagal menyimpan data.`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImgUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const r = new FileReader();
      r.onloadend = () => setter(r.result as string);
      r.readAsDataURL(file);
    }
  };

  const updateArr = (id: number, field: string, val: string, list: any[], setter: (val: any[]) => void) => {
    setter(list.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  if (!isMounted) return null;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-inter">
        <style>{styles}</style>
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl animate-fade-in text-center">
          <div className="flex justify-center mb-8">
            <div className={`p-4 rounded-2xl ${isLocked ? 'bg-red-500':'bg-orange-500'}`}><Lock className="text-white" size={40}/></div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-8 font-jakarta">Finensia Admin</h1>
          {loginError && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-sm">{loginError}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="Username" value={loginUsername} onChange={e=>setLoginUsername(e.target.value)} className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-orange-500 transition" required />
            <input type="password" placeholder="Password" value={loginPassword} onChange={e=>setLoginPassword(e.target.value)} className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-orange-500 transition" required />
            <button type="submit" disabled={isLocked} className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold shadow-lg transition active:scale-95 disabled:bg-slate-700">Masuk</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-inter text-slate-800 animate-fade-in relative overflow-x-hidden">
      <style>{styles}</style>
      
      {notification && (
        <div className={`fixed top-6 right-6 z-[100] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in border-l-4 ${notification.type === 'error' ? 'bg-red-900 border-red-500' : 'bg-slate-900 border-orange-500'}`}>
          {notification.type === 'loading' ? <Loader2 className="animate-spin text-orange-500" size={24}/> : <CheckCircle2 className="text-orange-500" size={24}/>}
          <p className="font-medium text-sm">{notification.message}</p>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="hidden md:flex w-72 bg-slate-950 text-slate-400 flex-col fixed h-full z-20 shadow-2xl">
        <div className="p-8 flex items-center gap-3 border-b border-slate-800 text-white">
          <TrendingUp className="text-orange-500" size={28}/> <span className="text-2xl font-bold font-jakarta">Finensia.</span>
        </div>
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto no-scrollbar">
          {[
            { id: 'about', icon: ImagePlus, label: '1. Tentang Kami' },
            { id: 'testi', icon: MessageSquare, label: '2. Testimoni' },
            { id: 'doc', icon: Camera, label: '3. Dokumentasi' },
            { id: 'video', icon: PlaySquare, label: '4. Video Profil' },
            { id: 'team', icon: Users, label: '5. Praktisi' },
            { id: 'admins', icon: UserPlus, label: '6. Kelola Admin' },
          ].map(m => (
            <button key={m.id} onClick={()=>setActiveTab(m.id)} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${activeTab === m.id ? 'bg-orange-500 text-white font-bold shadow-lg shadow-orange-500/20' : 'hover:bg-slate-800 hover:text-white'}`}>
              <m.icon size={20}/> {m.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-800 flex flex-col gap-2">
           <button onClick={refreshData} disabled={isLoadingData} className="w-full flex items-center justify-center gap-2 p-3.5 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition disabled:opacity-50"><RefreshCw size={18} className={isLoadingData?'animate-spin':''}/> Sinkron Data</button>
           <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-3.5 bg-red-500/10 text-red-400 rounded-xl font-bold hover:bg-red-500 hover:text-white transition"><LogOut size={18}/> Keluar</button>
        </div>
      </aside>

      {/* MOBILE MENU */}
      <div className="md:hidden fixed top-0 w-full bg-slate-950 p-4 flex justify-between items-center z-50 text-white">
        <div className="flex items-center gap-2 font-bold"><TrendingUp className="text-orange-500" size={20}/> Admin</div>
        <button onClick={()=>setIsMobileMenuOpen(!isMobileMenuOpen)}>{isMobileMenuOpen ? <X/> : <Menu/>}</button>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-16 w-full bg-slate-900 z-40 p-4 border-b border-slate-800 animate-fade-in flex flex-col gap-2">
          {[{id:'about',l:'Tentang Kami'},{id:'testi',l:'Testimoni'},{id:'doc',l:'Dokumentasi'},{id:'video',l:'Video'},{id:'team',l:'Tim'},{id:'admins',l:'Admin'}].map(m=>(
            <button key={m.id} onClick={()=>{setActiveTab(m.id); setIsMobileMenuOpen(false);}} className={`p-4 rounded-xl text-left ${activeTab===m.id ? 'bg-orange-500 text-white font-bold':'text-slate-400'}`}>{m.l}</button>
          ))}
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 md:ml-72 p-6 md:p-10 pt-24 md:pt-10 max-w-5xl relative">
        {isLoadingData && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-50 flex items-center justify-center flex-col gap-3">
            <Loader2 className="animate-spin text-orange-500" size={40}/>
            <p className="font-bold">Mengambil Data Spreadsheet...</p>
          </div>
        )}
        
        <h1 className="text-3xl font-extrabold text-slate-900 font-jakarta mb-8">Kelola Website</h1>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden min-h-[60vh]">
          
          {/* TAB 1: TENTANG KAMI */}
          {activeTab === 'about' && (
            <div className="p-8 md:p-10 animate-fade-in">
              <div className="flex justify-between items-center border-b pb-6 mb-8">
                <h3 className="text-2xl font-bold">1. Tentang Kami (Foto)</h3>
                <button onClick={()=>saveToGAS('Tentang Kami', {image: aboutImg})} disabled={isSaving} className="px-8 py-3 bg-orange-500 text-white rounded-xl font-bold shadow-lg hover:bg-orange-600 transition disabled:opacity-50"><Save size={20}/> Simpan</button>
              </div>
              <div className="grid md:grid-cols-2 gap-10">
                <div className="aspect-square bg-slate-50 rounded-3xl border-2 overflow-hidden flex items-center justify-center"><img src={aboutImg} className="w-full h-full object-cover" /></div>
                <div className="bg-slate-50 p-10 rounded-3xl border border-slate-200 text-center flex flex-col justify-center items-center">
                  <Upload size={48} className="mb-4 text-orange-500" />
                  <input type="file" id="upAbout" className="hidden" accept="image/*" onChange={e=>handleImgUpload(e, setAboutImg)} />
                  <label htmlFor="upAbout" className="cursor-pointer px-10 py-4 bg-slate-950 text-white rounded-2xl font-bold hover:bg-slate-800 transition">Pilih Foto</label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TESTIMONI */}
          {activeTab === 'testi' && (
            <div className="p-8 md:p-10 animate-fade-in">
              <div className="flex justify-between items-center border-b pb-6 mb-8">
                <h3 className="text-2xl font-bold">2. Testimoni Klien</h3>
                <div className="flex gap-4">
                  <button onClick={()=>setTestimonials([{id: Date.now(), name:'', role:'', text:''}, ...testimonials])} className="px-5 py-3.5 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition"><Plus size={20}/> Tambah</button>
                  <button onClick={()=>saveToGAS('Testimoni', testimonials)} disabled={isSaving} className="px-8 py-3.5 bg-orange-500 text-white rounded-xl font-bold shadow-lg flex items-center gap-2 hover:bg-orange-600 transition"><Save size={20}/> Simpan Semua</button>
                </div>
              </div>
              <div className="space-y-6">
                {testimonials.map(t => (
                  <div key={t.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Nama</label><input type="text" value={t.name} onChange={e=>updateArr(t.id, 'name', e.target.value, testimonials, setTestimonials)} placeholder="Nama Klien" className="w-full p-3 bg-white border rounded-xl font-bold" /></div>
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Kategori</label><input type="text" value={t.role} onChange={e=>updateArr(t.id, 'role', e.target.value, testimonials, setTestimonials)} placeholder="Contoh: Business Owner" className="w-full p-3 bg-white border rounded-xl text-orange-600 font-bold" /></div>
                    </div>
                    <textarea rows={3} value={t.text} onChange={e=>updateArr(t.id, 'text', e.target.value, testimonials, setTestimonials)} placeholder="Isi testimoni..." className="w-full p-4 bg-white border rounded-xl text-sm resize-none"></textarea>
                    <button onClick={()=>setTestimonials(testimonials.filter(x=>x.id!==t.id))} className="text-red-500 text-xs font-bold mt-4 flex items-center gap-1 hover:underline ml-auto"><Trash2 size={14}/> Hapus</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DOKUMENTASI */}
          {activeTab === 'doc' && (
            <div className="p-8 md:p-10 animate-fade-in">
              <div className="flex justify-between items-center border-b pb-6 mb-8">
                <h3 className="text-2xl font-bold">3. Dokumentasi & Momen</h3>
                <div className="flex gap-4">
                  <button onClick={()=>setDocs([{id: Date.now(), title:'', desc:'', img:'https://placehold.co/800x500/1e293b/f97316?text=Foto'}, ...docs])} className="px-5 py-3.5 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition"><Plus size={20}/> Tambah</button>
                  <button onClick={()=>saveToGAS('Dokumentasi', docs)} disabled={isSaving} className="px-8 py-3.5 bg-orange-500 text-white rounded-xl font-bold shadow-lg flex items-center gap-2 hover:bg-orange-600 transition"><Save size={20}/> Simpan Semua</button>
                </div>
              </div>
              <div className="space-y-8">
                {docs.map(d => (
                  <div key={d.id} className="grid md:grid-cols-3 gap-8 p-8 bg-slate-50 border rounded-[2rem] relative">
                    <div className="relative aspect-video rounded-2xl overflow-hidden border-2 bg-white group">
                      <img src={d.img} className="w-full h-full object-cover" />
                      <label className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all">
                         <div className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 shadow-xl"><Upload size={14}/> Ganti Foto</div>
                         <input type="file" className="hidden" accept="image/*" onChange={e=>{
                            const f = e.target.files?.[0]; if(f){ const r = new FileReader(); r.onloadend = () => setDocs(docs.map(x=>x.id===d.id ? {...x, img: r.result as string} : x)); r.readAsDataURL(f); }
                         }}/>
                      </label>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                       <input type="text" value={d.title} onChange={e=>updateArr(d.id, 'title', e.target.value, docs, setDocs)} placeholder="Judul (ex: Webinar Tax Planning)" className="w-full p-3 bg-white border rounded-xl font-bold focus:border-orange-500" />
                       <textarea rows={2} value={d.desc} onChange={e=>updateArr(d.id, 'desc', e.target.value, docs, setDocs)} placeholder="Deskripsi Singkat (ex: Berbagi insight strategis...)" className="w-full p-3 bg-white border rounded-xl text-sm focus:border-orange-500 resize-none"></textarea>
                       <button onClick={()=>setDocs(docs.filter(x=>x.id!==d.id))} className="text-red-500 text-xs font-bold float-right hover:underline"><Trash2 size={14}/> Hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: VIDEO PROFIL */}
          {activeTab === 'video' && (
            <div className="p-8 md:p-10 animate-fade-in">
              <div className="flex justify-between items-center border-b pb-6 mb-8">
                <h3 className="text-2xl font-bold">4. Video Profil (YouTube)</h3>
                <button onClick={()=>saveToGAS('Video Profil', {url: videoUrl})} disabled={isSaving} className="px-8 py-3 bg-orange-500 text-white rounded-xl font-bold shadow-lg hover:bg-orange-600 transition"><Save size={20}/> Simpan Link</button>
              </div>
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="space-y-2"><label className="block text-sm font-bold text-slate-700">Link Embed YouTube</label><input type="text" value={videoUrl} onChange={e=>setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/embed/..." className="w-full p-4 border border-slate-200 rounded-2xl bg-slate-50 font-mono text-sm outline-none focus:bg-white focus:border-orange-500 transition" /></div>
                  <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 text-blue-800 text-xs leading-relaxed italic">Gunakan format link dengan kata /embed/. Contoh: youtube.com/embed/ID_VIDEO</div>
                </div>
                <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-white"><iframe width="100%" height="100%" src={videoUrl} frameBorder="0" allowFullScreen></iframe></div>
              </div>
            </div>
          )}

          {/* TAB 5: TIM PRAKTISI */}
          {activeTab === 'team' && (
            <div className="p-8 md:p-10 animate-fade-in">
              <div className="flex justify-between items-center border-b pb-6 mb-8">
                <h3 className="text-2xl font-bold">5. Tim Praktisi Ahli</h3>
                <div className="flex gap-4">
                  <button onClick={()=>setTeam([{id: Date.now(), name:'', job:'', img:'https://placehold.co/200x200/1e293b/f97316?text=Foto'}, ...team])} className="px-5 py-3.5 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition"><Plus size={20}/> Tambah</button>
                  <button onClick={()=>saveToGAS('Tim Praktisi', team)} disabled={isSaving} className="px-8 py-3.5 bg-orange-500 text-white rounded-xl font-bold shadow-lg flex items-center gap-2 hover:bg-orange-600 transition"><Save size={20}/> Simpan Semua</button>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {team.map(m => (
                  <div key={m.id} className="p-6 bg-slate-50 border border-slate-200 rounded-3xl flex gap-6 hover:border-orange-300 transition-colors">
                    <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden border-2 bg-white group">
                       <img src={m.img} className="w-full h-full object-cover" />
                       <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all">
                         <Upload className="text-white" size={20}/>
                         <input type="file" className="hidden" accept="image/*" onChange={e=>{
                            const f = e.target.files?.[0]; if(f){ const r = new FileReader(); r.onloadend = () => setTeam(team.map(x=>x.id===m.id ? {...x, img: r.result as string} : x)); r.readAsDataURL(f); }
                         }}/>
                      </label>
                    </div>
                    <div className="flex-1 space-y-3">
                       <input type="text" value={m.name} onChange={e=>updateArr(m.id, 'name', e.target.value, team, setTeam)} placeholder="Nama Lengkap" className="w-full p-2 bg-white border rounded-lg font-bold focus:border-orange-500 outline-none" />
                       <input type="text" value={m.job} onChange={e=>updateArr(m.id, 'job', e.target.value, team, setTeam)} placeholder="Job (ex: Tax Specialist)" className="w-full p-2 bg-white border rounded-lg text-xs font-bold text-orange-600 focus:border-orange-500 outline-none" />
                       <button onClick={()=>setTeam(team.filter(x=>x.id!==m.id))} className="text-red-400 text-xs font-bold uppercase hover:underline"><Trash2 size={12}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: KELOLA ADMIN */}
          {activeTab === 'admins' && (
            <div className="p-8 md:p-10 animate-fade-in">
              <div className="flex justify-between items-center border-b pb-6 mb-8">
                <h3 className="text-2xl font-bold">6. Akun Admin Dashboard</h3>
                <div className="flex gap-4">
                  <button onClick={()=>setAdminUsers([{id: Date.now(), username:'', name:'', role:'Editor', email:''}, ...adminUsers])} className="px-5 py-3.5 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition"><UserPlus size={20}/> Tambah</button>
                  <button onClick={()=>saveToGAS('Data Admin', adminUsers)} disabled={isSaving} className="px-8 py-3.5 bg-orange-500 text-white rounded-xl font-bold shadow-lg flex items-center gap-2 hover:bg-orange-600 transition"><Save size={20}/> Simpan Daftar</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead><tr className="border-b text-xs font-bold text-slate-400 uppercase tracking-widest"><th className="pb-4 px-4">Nama</th><th className="pb-4 px-4">Username</th><th className="pb-4 px-4">Akses</th><th className="pb-4 px-4">Aksi</th></tr></thead>
                  <tbody className="divide-y divide-slate-50">
                    {adminUsers.map(a => (
                      <tr key={a.id} className="hover:bg-slate-50 transition">
                        <td className="py-4 px-4">
                          <input type="text" value={a.name} onChange={e=>updateArr(a.id, 'name', e.target.value, adminUsers, setAdminUsers)} className="block w-full font-bold bg-transparent outline-none" placeholder="Nama" />
                          <input type="text" value={a.email} onChange={e=>updateArr(a.id, 'email', e.target.value, adminUsers, setAdminUsers)} className="block w-full text-xs text-slate-400 bg-transparent outline-none" placeholder="email@finensia.com" />
                        </td>
                        <td className="py-4 px-4"><input type="text" value={a.username} onChange={e=>updateArr(a.id, 'username', e.target.value, adminUsers, setAdminUsers)} className="w-full p-2 border border-slate-100 rounded-lg text-sm outline-none" placeholder="user" /></td>
                        <td className="py-4 px-4"><select value={a.role} onChange={e=>updateArr(a.id, 'role', e.target.value, adminUsers, setAdminUsers)} className="bg-transparent text-sm font-bold text-orange-600 outline-none cursor-pointer"><option>Super Admin</option><option>Editor</option></select></td>
                        <td className="py-4 px-4"><button onClick={()=>setAdminUsers(adminUsers.filter(x=>x.id!==a.id))} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"><Trash2 size={16}/></button></td>
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
