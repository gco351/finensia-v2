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
  // URL GOOGLE APPS SCRIPT
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

  // --- DATA STATES (Local for UI Editing) ---
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

  // --- INITIALIZATION & SESSION ---
  useEffect(() => {
    setIsMounted(true);
    if (sessionStorage.getItem('finensia_admin_auth') === 'true') setIsLoggedIn(true);
    
    const lockUntil = localStorage.getItem('finensia_lockout_time');
    if (lockUntil && new Date().getTime() < parseInt(lockUntil)) {
      setIsLocked(true);
      setLockTimeRemaining(Math.ceil((parseInt(lockUntil) - new Date().getTime()) / 60000));
    }
  }, []);

  // --- SECURITY LAYER ---
  useEffect(() => {
    if (isLoggedIn || !isMounted) return;
    const handleKeyDown = (e: any) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') || (e.ctrlKey && e.key.toLowerCase() === 'u')) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLoggedIn, isMounted]);

  // --- AUTH LOGIC ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    const secretUser = btoa(loginUsername);
    const secretPass = btoa(loginPassword);
    if (secretUser === 'YWRtaW4=' && secretPass === 'YWRtaW4xMjM=') {
      setIsLoggedIn(true);
      sessionStorage.setItem('finensia_admin_auth', 'true');
    } else {
      const att = failedAttempts + 1;
      setFailedAttempts(att);
      if (att >= 3) {
        const lockTime = new Date().getTime() + 15 * 60000;
        localStorage.setItem('finensia_lockout_time', lockTime.toString());
        setIsLocked(true);
        setLoginError('Akses dikunci selama 15 menit.');
      } else {
        setLoginError(`Username atau Password salah! (${att}/3)`);
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('finensia_admin_auth');
  };

  // --- ACTION HANDLERS ---
  const showNotif = (message: string, type = 'success') => {
    setNotification({ message, type });
    if (type !== 'loading') setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = async (section: string, data: any) => {
    setIsSaving(true);
    showNotif(`Menyimpan data [${section}]...`, 'loading');
    try {
      const response = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "updateData", section, data })
      });
      if (response.ok) showNotif(`Perubahan pada [${section}] berhasil disimpan!`, 'success');
      else throw new Error("Gagal");
    } catch {
      showNotif(`Terjadi kesalahan saat menyimpan [${section}].`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (e: any, setter: Function) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const updateArrayField = (id: number, field: string, val: string, list: any[], setter: Function) => {
    setter(list.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  if (!isMounted) return null;

  // ==========================================
  // LOGIN SCREEN
  // ==========================================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-inter select-none">
        <style>{styles}</style>
        <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl animate-fade-in">
          <div className="flex justify-center mb-8">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${isLocked ? 'bg-red-500' : 'bg-orange-500 shadow-orange-500/20'}`}>
              <Lock className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center text-white font-jakarta mb-8">Secure Admin</h1>
          {loginError && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-sm animate-slide-in">{loginError}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="Username" value={loginUsername} onChange={e=>setLoginUsername(e.target.value)} disabled={isLocked} className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-orange-500 transition" required />
            <input type="password" placeholder="Password" value={loginPassword} onChange={e=>setLoginPassword(e.target.value)} disabled={isLocked} className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-orange-500 transition" required />
            <button type="submit" disabled={isLocked} className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition">Masuk Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD CONTENT
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 flex font-inter text-slate-800 animate-fade-in relative overflow-x-hidden">
      <style>{styles}</style>
      
      {/* NOTIFIKASI */}
      {notification && (
        <div className={`fixed top-6 right-6 z-[100] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in border-l-4 ${notification.type === 'error' ? 'bg-red-900 border-red-500' : 'bg-slate-900 border-orange-500'}`}>
          {notification.type === 'loading' ? <Loader2 className="animate-spin text-orange-500" size={24}/> : <CheckCircle2 className="text-orange-500" size={24}/>}
          <p className="font-medium text-sm">{notification.message}</p>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="hidden md:flex w-72 bg-slate-950 text-slate-400 flex-col fixed h-full z-20">
        <div className="p-8 flex items-center gap-3 border-b border-slate-800">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20"><TrendingUp size={24}/></div>
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
          ].map(menu => (
            <button key={menu.id} onClick={()=>setActiveTab(menu.id)} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${activeTab === menu.id ? 'bg-orange-500 text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}>
              <menu.icon size={20}/> {menu.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-3.5 bg-red-500/10 text-red-400 rounded-xl font-bold hover:bg-red-500 hover:text-white transition"><LogOut size={18}/> Logout</button>
        </div>
      </aside>

      {/* HEADER MOBILE */}
      <div className="md:hidden fixed top-0 w-full bg-slate-950 p-4 flex justify-between items-center z-50 text-white shadow-lg">
        <div className="flex items-center gap-2 font-bold"><TrendingUp className="text-orange-500" size={20}/> Finensia Admin</div>
        <button onClick={()=>setIsMobileMenuOpen(!isMobileMenuOpen)}>{isMobileMenuOpen ? <X/> : <Menu/>}</button>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-16 w-full bg-slate-900 z-40 p-4 border-b border-slate-800 animate-fade-in flex flex-col gap-2">
          {[{id:'about',l:'Tentang Kami'},{id:'testi',l:'Testimoni'},{id:'doc',l:'Dokumentasi'},{id:'video',l:'Video'},{id:'team',l:'Tim'},{id:'admins',l:'Admin'}].map(m=>(
            <button key={m.id} onClick={()=>{setActiveTab(m.id); setIsMobileMenuOpen(false);}} className={`p-4 rounded-xl text-left ${activeTab===m.id ? 'bg-orange-500 text-white font-bold':'text-slate-400'}`}>{m.l}</button>
          ))}
        </div>
      )}

      {/* MAIN */}
      <main className="flex-1 md:ml-72 p-6 md:p-10 pt-24 md:pt-10 max-w-5xl">
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 font-jakarta tracking-tight">Kelola Konten</h1>
          <p className="text-slate-500">Sesuaikan data yang tampil di website utama.</p>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[60vh]">
          
          {/* TAB 1: TENTANG KAMI */}
          {activeTab === 'about' && (
            <div className="p-8 md:p-10 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-6 mb-8 gap-4">
                <h3 className="text-2xl font-bold font-jakarta">1. Foto Tentang Kami</h3>
                <button onClick={()=>handleSave('Tentang Kami', {image: aboutImg})} disabled={isSaving} className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition disabled:opacity-50">
                  <Save size={18}/> {isSaving ? 'Saving...' : 'Simpan Foto'}
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase">Tampilan Saat Ini</p>
                  <div className="aspect-square bg-slate-50 rounded-3xl border-2 border-slate-100 overflow-hidden shadow-inner flex items-center justify-center">
                    <img src={aboutImg} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex flex-col justify-center bg-slate-50 p-8 rounded-3xl border border-slate-200 text-center">
                  <Upload size={40} className="mx-auto mb-4 text-orange-500" />
                  <h4 className="font-bold mb-2">Upload Foto Baru</h4>
                  <p className="text-xs text-slate-400 mb-6">Pilih file foto terbaik untuk bagian Tentang Kami.</p>
                  <input type="file" id="upAbout" className="hidden" accept="image/*" onChange={e=>handleImageUpload(e, setAboutImg)} />
                  <label htmlFor="upAbout" className="cursor-pointer py-3.5 bg-slate-950 text-white rounded-xl font-bold hover:bg-slate-800 transition">Pilih File</label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TESTIMONI */}
          {activeTab === 'testi' && (
            <div className="p-8 md:p-10 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-6 mb-8 gap-4">
                <h3 className="text-2xl font-bold font-jakarta">2. Testimoni Klien</h3>
                <div className="flex gap-3">
                  <button onClick={()=>setTestimonials([{id: Date.now(), name:'', role:'', text:''}, ...testimonials])} className="px-4 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 transition"><Plus size={18}/> Tambah</button>
                  <button onClick={()=>handleSave('Testimoni', testimonials)} disabled={isSaving} className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-orange-600 transition"><Save size={18}/> Simpan Semua</button>
                </div>
              </div>
              <div className="space-y-6">
                {testimonials.map(t => (
                  <div key={t.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Klien</label>
                        <input type="text" value={t.name} onChange={e=>updateArrayField(t.id, 'name', e.target.value, testimonials, setTestimonials)} placeholder="Contoh: Rina Kartika" className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold focus:border-orange-500 outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Kategori / Job</label>
                        <input type="text" value={t.role} onChange={e=>updateArrayField(t.id, 'role', e.target.value, testimonials, setTestimonials)} placeholder="Contoh: Business Owner" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-orange-600 font-bold focus:border-orange-500 outline-none" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Isi Testimoni</label>
                      <textarea rows={3} value={t.text} onChange={e=>updateArrayField(t.id, 'text', e.target.value, testimonials, setTestimonials)} placeholder="Tuliskan ulasan klien di sini..." className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:border-orange-500 outline-none resize-none"></textarea>
                    </div>
                    <button onClick={()=>setTestimonials(testimonials.filter(x=>x.id!==t.id))} className="text-red-500 text-sm font-bold flex items-center gap-1 mt-4 ml-auto"><Trash2 size={14}/> Hapus</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DOKUMENTASI */}
          {activeTab === 'doc' && (
            <div className="p-8 md:p-10 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-6 mb-8 gap-4">
                <h3 className="text-2xl font-bold font-jakarta">3. Dokumentasi Kegiatan</h3>
                <div className="flex gap-3">
                  <button onClick={()=>setDocs([{id: Date.now(), title:'', desc:'', img:'https://placehold.co/800x500/1e293b/f97316?text=Foto'}, ...docs])} className="px-4 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 transition"><Plus size={18}/> Tambah</button>
                  <button onClick={()=>handleSave('Dokumentasi', docs)} disabled={isSaving} className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-orange-600 transition"><Save size={18}/> Simpan Semua</button>
                </div>
              </div>
              <div className="space-y-8">
                {docs.map(d => (
                  <div key={d.id} className="grid md:grid-cols-3 gap-6 p-6 bg-slate-50 border border-slate-200 rounded-3xl">
                    <div className="relative aspect-video rounded-2xl overflow-hidden border-2 bg-white group">
                      <img src={d.img} className="w-full h-full object-cover" />
                      <label className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                         <div className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2"><Upload size={14}/> Ganti Foto</div>
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
                    <div className="md:col-span-2 space-y-4">
                       <input type="text" value={d.title} onChange={e=>updateArrayField(d.id, 'title', e.target.value, docs, setDocs)} placeholder="Judul (ex: Webinar Tax Planning)" className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold focus:border-orange-500 outline-none" />
                       <textarea rows={2} value={d.desc} onChange={e=>updateArrayField(d.id, 'desc', e.target.value, docs, setDocs)} placeholder="Deskripsi (ex: Berbagi insight)" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:border-orange-500 outline-none resize-none"></textarea>
                       <button onClick={()=>setDocs(docs.filter(x=>x.id!==d.id))} className="text-red-500 text-xs font-bold float-right"><Trash2 size={14}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: VIDEO */}
          {activeTab === 'video' && (
            <div className="p-8 md:p-10 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-6 mb-8 gap-4">
                <h3 className="text-2xl font-bold font-jakarta">4. Video Profil</h3>
                <button onClick={()=>handleSave('Video Profil', {url: videoUrl})} disabled={isSaving} className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-orange-600 transition"><Save size={18}/> Simpan Link</button>
              </div>
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">Link Embed YouTube</label>
                    <input type="text" value={videoUrl} onChange={e=>setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/embed/..." className="w-full p-4 border border-slate-200 rounded-2xl bg-slate-50 font-mono text-sm text-blue-600 outline-none focus:bg-white focus:border-orange-500 transition" />
                  </div>
                  <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex gap-4 text-blue-800 text-xs leading-relaxed">
                    <AlertCircle size={24} className="shrink-0 text-blue-500" />
                    <div><p className="font-bold mb-1 uppercase tracking-wider">Tutorial:</p><p>Gunakan format <b>/embed/</b>. Contoh: <br/><span className="bg-white/50 p-1 rounded">youtube.com/embed/XXXXX</span></p></div>
                  </div>
                </div>
                <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                   <iframe width="100%" height="100%" src={videoUrl} frameBorder="0" allowFullScreen></iframe>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PRAKTISI */}
          {activeTab === 'team' && (
            <div className="p-8 md:p-10 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-6 mb-8 gap-4">
                <h3 className="text-2xl font-bold font-jakarta">5. Tim Praktisi</h3>
                <div className="flex gap-3">
                  <button onClick={()=>setTeam([{id: Date.now(), name:'', job:'', img:'https://placehold.co/200x200/1e293b/f97316?text=Foto'}, ...team])} className="px-4 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition"><Plus size={18}/> Tambah</button>
                  <button onClick={()=>handleSave('Tim Praktisi', team)} disabled={isSaving} className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-orange-600 transition"><Save size={18}/> Simpan Semua</button>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {team.map(m => (
                  <div key={m.id} className="p-6 bg-slate-50 border border-slate-200 rounded-3xl flex flex-col sm:flex-row gap-6">
                    <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden border-2 bg-white group mx-auto sm:mx-0 shadow-sm">
                       <img src={m.img} className="w-full h-full object-cover" />
                       <label className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all">
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
                       <input type="text" value={m.name} onChange={e=>updateArrayField(m.id, 'name', e.target.value, team, setTeam)} placeholder="Nama Lengkap" className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold outline-none focus:border-orange-500 shadow-sm" />
                       <input type="text" value={m.job} onChange={e=>updateArrayField(m.id, 'job', e.target.value, team, setTeam)} placeholder="Job (ex: Tax/Accounting)" className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-orange-600 outline-none shadow-sm" />
                       <button onClick={()=>setTeam(team.filter(x=>x.id!==m.id))} className="text-red-400 text-xs font-bold uppercase"><Trash2 size={12}/> Hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: ADMIN */}
          {activeTab === 'admins' && (
            <div className="p-8 md:p-10 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-6 mb-8 gap-4">
                <h3 className="text-2xl font-bold font-jakarta">6. Pengaturan Admin</h3>
                <div className="flex gap-3">
                  <button onClick={()=>setAdminUsers([{id: Date.now(), username:'', name:'', role:'Editor', email:''}, ...adminUsers])} className="px-4 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition"><UserPlus size={18}/> Tambah</button>
                  <button onClick={()=>handleSave('Data Admin', adminUsers)} disabled={isSaving} className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 flex items-center gap-2 hover:bg-orange-600 transition"><Save size={18}/> Simpan Daftar</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b text-[10px] font-bold text-slate-400 uppercase tracking-widest"><th className="pb-4 px-4">Nama</th><th className="pb-4 px-4">Username</th><th className="pb-4 px-4">Level</th><th className="pb-4 px-4">Aksi</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {adminUsers.map(a => (
                      <tr key={a.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-4 px-4">
                          <input type="text" value={a.name} onChange={e=>updateArrayField(a.id, 'name', e.target.value, adminUsers, setAdminUsers)} className="block w-full font-bold bg-transparent outline-none" placeholder="Nama Lengkap" />
                          <input type="text" value={a.email} onChange={e=>updateArrayField(a.id, 'email', e.target.value, adminUsers, setAdminUsers)} className="block w-full text-xs text-slate-400 bg-transparent outline-none" placeholder="email@finensia.com" />
                        </td>
                        <td className="py-4 px-4"><input type="text" value={a.username} onChange={e=>updateArrayField(a.id, 'username', e.target.value, adminUsers, setAdminUsers)} className="w-full p-2 bg-white border border-slate-100 rounded-lg text-sm outline-none" placeholder="user" /></td>
                        <td className="py-4 px-4"><select value={a.role} onChange={e=>updateArrayField(a.id, 'role', e.target.value, adminUsers, setAdminUsers)} className="bg-transparent text-sm font-bold text-orange-600 outline-none"><option>Super Admin</option><option>Editor</option></select></td>
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
