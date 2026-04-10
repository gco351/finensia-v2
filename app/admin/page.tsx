"use client";

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, ImagePlus, MessageSquare, Video, Users, Monitor, Save, Upload, Plus, Trash2,
  AlertCircle, Menu, X, CheckCircle2, Lock, User, Key, ShieldAlert, LogOut, UserPlus, Loader2, Camera, PlaySquare
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
  // CONFIGURATION & API URL
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

  // --- UI STATES ---
  const [activeTab, setActiveTab] = useState('about');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState<any>(null); 
  const [isSaving, setIsSaving] = useState(false);

  // --- DATA STATES (Diisi dari Spreadsheet) ---
  const [aboutImg, setAboutImg] = useState("https://placehold.co/600x600/1e293b/f97316?text=Memuat...");
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [docs, setDocs] = useState<any[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [team, setTeam] = useState<any[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);

  // ==========================================
  // SYNC DATA FUNCTIONS
  // ==========================================
  const refreshData = async () => {
    try {
      const res = await fetch(GAS_URL);
      const json = await res.json();
      if (json.status === 'success' && json.data) {
        const d = json.data;
        // Memasukkan data dari database ke state local
        if (d['Tentang Kami']?.image) setAboutImg(d['Tentang Kami'].image);
        if (d['Testimoni']) setTestimonials(d['Testimoni']);
        if (d['Dokumentasi']) setDocs(d['Dokumentasi']);
        if (d['Video Profil']?.url) setVideoUrl(d['Video Profil'].url);
        if (d['Tim Praktisi']) setTeam(d['Tim Praktisi']);
        if (d['Data Admin']) setAdminUsers(d['Data Admin']);
      }
    } catch (err) {
      console.error("Gagal melakukan sinkronisasi:", err);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    // Cek Sesi Login
    if (sessionStorage.getItem('finensia_auth') === 'true') {
      setIsLoggedIn(true);
      refreshData();
    }
    
    // Cek Status Terkunci (Brute Force Protection)
    const lockUntil = localStorage.getItem('finensia_lock_time');
    if (lockUntil && new Date().getTime() < parseInt(lockUntil)) {
      setIsLocked(true);
      setLockTimeRemaining(Math.ceil((parseInt(lockUntil) - new Date().getTime()) / 60000));
    }
  }, []);

  // ==========================================
  // AUTHENTICATION LOGIC
  // ==========================================
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    // admin / admin123
    if (btoa(loginUsername) === 'YWRtaW4=' && btoa(loginPassword) === 'YWRtaW4xMjM=') {
      setIsLoggedIn(true);
      sessionStorage.setItem('finensia_auth', 'true');
      localStorage.removeItem('finensia_attempts');
      refreshData();
    } else {
      const att = failedAttempts + 1;
      setFailedAttempts(att);
      if (att >= 3) {
        const until = new Date().getTime() + 15 * 60000; // Kunci 15 Menit
        localStorage.setItem('finensia_lock_time', until.toString());
        setIsLocked(true);
        setLoginError("Terlalu banyak percobaan! Terkunci 15 menit.");
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
  // SAVE & ACTION HANDLERS
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
        showNotif(`Data [${section}] Berhasil Disimpan!`);
        refreshData(); // Ambil ulang data agar tampilan sinkron
      } else throw new Error();
    } catch {
      showNotif(`Gagal mengirim ke database Google.`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Handler Upload Gambar (Base64)
  const handleImg = (e: any, setter: any) => {
    const file = e.target.files[0];
    if (file) {
      const r = new FileReader();
      r.onloadend = () => setter(r.result as string);
      r.readAsDataURL(file);
    }
  };

  // Handler Update Array State (Testimoni, Docs, Team)
  const updateArr = (id: any, field: string, val: string, state: any[], setter: any) => {
    setter(state.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  if (!isMounted) return null;

  // ==========================================
  // UI: LOGIN SCREEN
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
          <h1 className="text-3xl font-bold text-center text-white font-jakarta mb-2 tracking-tight">Finensia Admin</h1>
          <p className="text-slate-500 text-center text-sm mb-8">Masukkan password untuk mengelola website</p>
          {loginError && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-2 animate-slide-in">
              <ShieldAlert size={16}/> {loginError}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="text" 
              placeholder="Username" 
              value={loginUsername} 
              onChange={e=>setLoginUsername(e.target.value)} 
              className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-orange-500 transition" 
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={loginPassword} 
              onChange={e=>setLoginPassword(e.target.value)} 
              className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-orange-500 transition" 
              required 
            />
            <button type="submit" disabled={isLocked} className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition shadow-lg shadow-orange-500/20 disabled:bg-slate-700">
              Masuk Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI: DASHBOARD MAIN
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 flex font-inter text-slate-800 animate-fade-in relative overflow-x-hidden">
      <style>{styles}</style>
      
      {/* GLOBAL NOTIFICATION TOAST */}
      {notification && (
        <div className={`fixed top-6 right-6 z-[100] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in border-l-4 ${notification.type === 'error' ? 'bg-red-900 border-red-500' : 'bg-slate-900 border-orange-500'}`}>
          {notification.type === 'loading' ? <Loader2 className="animate-spin text-orange-500" size={20}/> : <CheckCircle2 className="text-orange-500" size={20}/>}
          <p className="font-medium text-sm">{notification.message}</p>
        </div>
      )}

      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex w-72 bg-slate-950 text-slate-400 flex-col fixed h-full z-20 shadow-2xl">
        <div className="p-8 flex items-center gap-3 border-b border-slate-800 text-white">
          <TrendingUp className="text-orange-500" size={28}/> <span className="text-2xl font-bold font-jakarta">Finensia.</span>
        </div>
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto no-scrollbar">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-4 ml-2">Menu Kontrol Utama</p>
          {[
            { id: 'about', icon: ImagePlus, label: '1. Tentang Kami' },
            { id: 'testi', icon: MessageSquare, label: '2. Testimoni' },
            { id: 'doc', icon: Camera, label: '3. Dokumentasi' },
            { id: 'video', icon: PlaySquare, label: '4. Video Profil' },
            { id: 'team', icon: Users, label: '5. Praktisi' },
            { id: 'admins', icon: UserPlus, label: '6. Kelola Admin' },
          ].map(m => (
            <button 
              key={m.id} 
              onClick={()=>setActiveTab(m.id)} 
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${activeTab === m.id ? 'bg-orange-500 text-white font-bold shadow-lg shadow-orange-500/20' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              <m.icon size={20}/> {m.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-3.5 bg-red-500/10 text-red-400 rounded-xl font-bold hover:bg-red-500 hover:text-white transition">
            <LogOut size={18}/> Keluar
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 md:ml-72 p-6 md:p-10 pt-10 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 font-jakarta tracking-tight">Kelola Konten</h1>
            <p className="text-slate-500 mt-1">Data yang disimpan akan langsung ter-update di Landing Page.</p>
          </div>
          <div className="bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
             <div className="text-right">
                <p className="font-bold text-slate-900 text-sm">Adhwa Neisya</p>
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center justify-end gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Super Admin
                </p>
             </div>
             <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold border border-slate-200">AN</div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden min-h-[65vh] relative">
          
          {/* 1. TENTANG KAMI - UPLOAD FOTO */}
          {activeTab === 'about' && (
            <div className="p-8 md:p-10 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-center border-b pb-8 mb-10 gap-4">
                <div>
                   <h3 className="text-2xl font-bold font-jakarta">1. Tentang Kami</h3>
                   <p className="text-slate-400 text-sm">Ganti foto representatif perusahaan.</p>
                </div>
                <button onClick={()=>saveToGAS('Tentang Kami', {image: aboutImg})} disabled={isSaving} className="flex items-center gap-2 px-8 py-3.5 bg-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition disabled:opacity-50">
                  <Save size={20}/> {isSaving ? 'Menyimpan...' : 'Simpan Foto'}
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-3">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Foto Saat Ini</p>
                   <div className="aspect-square bg-slate-50 rounded-3xl border-2 border-slate-100 overflow-hidden shadow-inner flex items-center justify-center">
                     <img src={aboutImg} className="w-full h-full object-cover" alt="Preview" />
                   </div>
                </div>
                <div className="flex flex-col justify-center bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200 text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500 shadow-sm border border-slate-100"><Upload size={40} /></div>
                  <h4 className="text-xl font-bold mb-2">Upload Foto Baru</h4>
                  <p className="text-sm text-slate-400 mb-8 px-4">Pastikan ukuran foto proporsional (1:1) agar tampil sempurna di website.</p>
                  <input type="file" id="upAbout" className="hidden" accept="image/*" onChange={e=>handleImg(e, setAboutImg)} />
                  <label htmlFor="upAbout" className="cursor-pointer py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition shadow-xl">Pilih File Foto</label>
                </div>
              </div>
            </div>
          )}

          {/* 2. TESTIMONI - EDIT NAMA/KATEGORI/TEKS */}
          {activeTab === 'testi' && (
            <div className="p-8 md:p-10 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-center border-b pb-8 mb-10 gap-4">
                <div>
                   <h3 className="text-2xl font-bold font-jakarta">2. Testimoni Klien</h3>
                   <p className="text-slate-400 text-sm">Update nama klien dan kategori (job owner).</p>
                </div>
                <div className="flex gap-4">
                  <button onClick={()=>setTestimonials([{id: Date.now(), name:'', role:'', text:''}, ...testimonials])} className="px-5 py-3.5 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition"><Plus size={20}/> Tambah Baris</button>
                  <button onClick={()=>saveToGAS('Testimoni', testimonials)} disabled={isSaving} className="px-8 py-3.5 bg-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 flex items-center gap-2 hover:bg-orange-600 transition"><Save size={20}/> Simpan Semua</button>
                </div>
              </div>
              <div className="space-y-6">
                {testimonials.length === 0 && <p className="text-center py-20 text-slate-400 italic">Belum ada data testimoni.</p>}
                {testimonials.map(t => (
                  <div key={t.id} className="p-8 bg-slate-50 rounded-3xl border border-slate-200 hover:border-orange-200 transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-extrabold text-slate-400 uppercase ml-1">Nama Lengkap Klien</label>
                         <input type="text" value={t.name} onChange={e=>updateArr(t.id, 'name', e.target.value, testimonials, setTestimonials)} placeholder="Contoh: Rina Kartika" className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold focus:border-orange-500 outline-none transition shadow-sm" />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-extrabold text-slate-400 uppercase ml-1">Kategori / Jabatan</label>
                         <input type="text" value={t.role} onChange={e=>updateArr(t.id, 'role', e.target.value, testimonials, setTestimonials)} placeholder="Contoh: Business Owner" className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-orange-600 font-bold focus:border-orange-500 outline-none transition shadow-sm" />
                      </div>
                    </div>
                    <div className="space-y-1.5 mb-6">
                       <label className="text-[10px] font-extrabold text-slate-400 uppercase ml-1">Isi Ulasan Testimoni</label>
                       <textarea rows={3} value={t.text} onChange={e=>updateArr(t.id, 'text', e.target.value, testimonials, setTestimonials)} placeholder="Tuliskan ulasan klien di sini..." className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm focus:border-orange-500 outline-none transition resize-none shadow-sm"></textarea>
                    </div>
                    <div className="flex justify-end">
                       <button onClick={()=>setTestimonials(testimonials.filter(x=>x.id!==t.id))} className="text-red-500 text-xs font-bold hover:bg-red-50 px-4 py-2 rounded-xl transition flex items-center gap-1.5"><Trash2 size={14}/> Hapus Testimoni</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. DOKUMENTASI - UPLOAD FOTO & EDIT TEKS */}
          {activeTab === 'doc' && (
            <div className="p-8 md:p-10 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-center border-b pb-8 mb-10 gap-4">
                <div>
                   <h3 className="text-2xl font-bold font-jakarta">3. Dokumentasi Kegiatan</h3>
                   <p className="text-slate-400 text-sm">Ganti foto, judul kegiatan, dan deskripsi acara.</p>
                </div>
                <div className="flex gap-4">
                  <button onClick={()=>setDocs([{id: Date.now(), title:'', desc:'', img:'https://placehold.co/800x500/1e293b/f97316?text=Upload'}, ...docs])} className="px-5 py-3.5 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition"><Plus size={20}/> Tambah Momen</button>
                  <button onClick={()=>saveToGAS('Dokumentasi', docs)} disabled={isSaving} className="px-8 py-3.5 bg-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 flex items-center gap-2 hover:bg-orange-600 transition"><Save size={20}/> Simpan Semua</button>
                </div>
              </div>
              <div className="space-y-8">
                {docs.map(d => (
                  <div key={d.id} className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-slate-50 border border-slate-200 rounded-[2rem] relative group">
                    <div className="relative aspect-video rounded-2xl overflow-hidden border-2 bg-white group shadow-sm">
                      <img src={d.img} className="w-full h-full object-cover" alt="Momen" />
                      <label className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all backdrop-blur-sm">
                         <div className="bg-white text-slate-900 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xl"><Upload size={14}/> Ganti Foto</div>
                         <input type="file" className="hidden" accept="image/*" onChange={e=>{
                            const f = e.target.files[0]; if(f){ const r = new FileReader(); r.onloadend = () => setDocs(docs.map(x=>x.id===d.id ? {...x, img: r.result as string} : x)); r.readAsDataURL(f); }
                         }}/>
                      </label>
                    </div>
                    <div className="md:col-span-2 flex flex-col justify-between space-y-4">
                       <div className="space-y-4">
                         <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Judul Kegiatan</label>
                            <input type="text" value={d.title} onChange={e=>updateArr(d.id, 'title', e.target.value, docs, setDocs)} placeholder="Contoh: Webinar Tax Planning" className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold outline-none focus:border-orange-500 transition shadow-sm" />
                         </div>
                         <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Deskripsi / Detail Acara</label>
                            <textarea rows={2} value={d.desc} onChange={e=>updateArr(d.id, 'desc', e.target.value, docs, setDocs)} placeholder="Contoh: Sesi berbagi strategi pajak..." className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-orange-500 transition resize-none shadow-sm"></textarea>
                         </div>
                       </div>
                       <button onClick={()=>setDocs(docs.filter(x=>x.id!==d.id))} className="text-red-500 text-xs font-bold self-end flex items-center gap-1.5 hover:underline"><Trash2 size={14}/> Hapus Baris</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. VIDEO PROFIL - LINK YOUTUBE */}
          {activeTab === 'video' && (
            <div className="p-8 md:p-10 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-center border-b pb-8 mb-10 gap-4">
                <div>
                   <h3 className="text-2xl font-bold font-jakarta">4. Video Profil Utama</h3>
                   <p className="text-slate-400 text-sm">Ganti video di landing page via link YouTube.</p>
                </div>
                <button onClick={()=>saveToGAS('Video Profil', {url: videoUrl})} disabled={isSaving} className="px-8 py-3.5 bg-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 flex items-center gap-2 hover:bg-orange-600 transition"><Save size={20}/> Simpan Link Baru</button>
              </div>
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700 ml-1">Link Embed YouTube</label>
                    <input type="text" value={videoUrl} onChange={e=>setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/embed/..." className="w-full p-5 border border-slate-200 rounded-[2rem] bg-slate-50 font-mono text-sm outline-none focus:bg-white focus:border-orange-500 transition shadow-inner" />
                  </div>
                  <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex gap-4 text-blue-800 text-xs leading-relaxed">
                    <AlertCircle size={24} className="shrink-0 text-blue-500" />
                    <div><p className="font-extrabold mb-1 uppercase tracking-tighter">Cara Mengambil Link:</p><p>Gunakan link dengan format <b>/embed/</b>. <br/> Contoh: <i>youtube.com/embed/XXXXXX</i></p></div>
                  </div>
                </div>
                <div className="space-y-3">
                   <p className="text-[10px] font-bold text-slate-400 uppercase text-center tracking-widest">Tampilan Video Sekarang</p>
                   <div className="aspect-video bg-black rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
                     <iframe width="100%" height="100%" src={videoUrl} frameBorder="0" allowFullScreen></iframe>
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. TIM PRAKTISI - UPLOAD FOTO & EDIT ROLE */}
          {activeTab === 'team' && (
            <div className="p-8 md:p-10 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-center border-b pb-8 mb-10 gap-4">
                <div>
                   <h3 className="text-2xl font-bold font-jakarta">5. Tim Praktisi Ahli</h3>
                   <p className="text-slate-400 text-sm">Update foto profil, nama, dan keahlian tim.</p>
                </div>
                <div className="flex gap-4">
                  <button onClick={()=>setTeam([{id: Date.now(), name:'', job:'', img:'https://placehold.co/200x200/1e293b/f97316?text=Foto'}, ...team])} className="px-5 py-3.5 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition"><Plus size={20}/> Tambah Anggota</button>
                  <button onClick={()=>saveToGAS('Tim Praktisi', team)} disabled={isSaving} className="px-8 py-3.5 bg-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 flex items-center gap-2 hover:bg-orange-600 transition"><Save size={20}/> Simpan Semua</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {team.map(m => (
                  <div key={m.id} className="p-8 bg-slate-50 border border-slate-200 rounded-[2.5rem] flex flex-col sm:flex-row gap-8 hover:border-orange-300 transition-colors">
                    <div className="relative w-28 h-28 shrink-0 rounded-3xl overflow-hidden border-4 border-white bg-white group mx-auto sm:mx-0 shadow-lg">
                       <img src={m.img} className="w-full h-full object-cover" alt="Team" />
                       <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all backdrop-blur-sm">
                         <Upload className="text-white" size={24}/>
                         <input type="file" className="hidden" accept="image/*" onChange={e=>{
                            const f = e.target.files[0]; if(f){ const r = new FileReader(); r.onloadend = () => setTeam(team.map(x=>x.id===m.id ? {...x, img: r.result as string} : x)); r.readAsDataURL(f); }
                         }}/>
                      </label>
                    </div>
                    <div className="flex-1 space-y-4">
                       <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Lengkap</label>
                          <input type="text" value={m.name} onChange={e=>updateArr(m.id, 'name', e.target.value, team, setTeam)} placeholder="Nama Praktisi" className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold outline-none focus:border-orange-500 transition shadow-sm" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Kategori / Job</label>
                          <input type="text" value={m.job} onChange={e=>updateArr(m.id, 'job', e.target.value, team, setTeam)} placeholder="Contoh: Tax / Accounting" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-orange-600 outline-none focus:border-orange-500 transition shadow-sm" />
                       </div>
                       <button onClick={()=>setTeam(team.filter(x=>x.id!==m.id))} className="text-red-400 text-xs font-bold flex items-center gap-1 hover:underline"><Trash2 size={12}/> Hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. DATA ADMIN - KELOLA AKUN */}
          {activeTab === 'admins' && (
            <div className="p-8 md:p-10 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-center border-b pb-8 mb-10 gap-4">
                <div>
                   <h3 className="text-2xl font-bold font-jakarta">6. Pengaturan Admin</h3>
                   <p className="text-slate-400 text-sm">Atur akses siapa saja yang boleh masuk dashboard.</p>
                </div>
                <div className="flex gap-4">
                  <button onClick={()=>setAdminUsers([{id: Date.now(), username:'', name:'', role:'Editor', email:''}, ...adminUsers])} className="px-5 py-3.5 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition"><UserPlus size={20}/> Tambah User</button>
                  <button onClick={()=>saveToGAS('Data Admin', adminUsers)} disabled={isSaving} className="px-8 py-3.5 bg-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 flex items-center gap-2 hover:bg-orange-600 transition"><Save size={20}/> Simpan Daftar</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]"><th className="pb-5 px-5">Nama Admin</th><th className="pb-5 px-5">Username</th><th className="pb-5 px-5">Hak Akses</th><th className="pb-5 px-5">Aksi</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {adminUsers.map(a => (
                      <tr key={a.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-5 px-5">
                          <input type="text" value={a.name} onChange={e=>updateArr(a.id, 'name', e.target.value, adminUsers, setAdminUsers)} className="block w-full font-bold bg-transparent outline-none focus:text-orange-500" placeholder="Nama" />
                          <input type="text" value={a.email} onChange={e=>updateArr(a.id, 'email', e.target.value, adminUsers, setAdminUsers)} className="block w-full text-[10px] text-slate-400 bg-transparent outline-none" placeholder="Email" />
                        </td>
                        <td className="py-5 px-5"><input type="text" value={a.username} onChange={e=>updateArr(a.id, 'username', e.target.value, adminUsers, setAdminUsers)} className="w-full p-3 bg-white border border-slate-100 rounded-xl text-sm outline-none shadow-sm" placeholder="user" /></td>
                        <td className="py-5 px-5"><select value={a.role} onChange={e=>updateArr(a.id, 'role', e.target.value, adminUsers, setAdminUsers)} className="bg-transparent text-sm font-bold text-orange-600 outline-none cursor-pointer"><option>Super Admin</option><option>Editor</option></select></td>
                        <td className="py-5 px-5"><button onClick={()=>setAdminUsers(adminUsers.filter(x=>x.id!==a.id))} className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition"><Trash2 size={18}/></button></td>
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
