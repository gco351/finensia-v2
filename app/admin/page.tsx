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
  Loader2
} from 'lucide-react';

// --- CUSTOM STYLES ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');
  .font-inter { font-family: 'Inter', sans-serif; }
  .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
  
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  .animate-slide-in { animation: slideIn 0.3s ease-out forwards; }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-spin-slow { animation: spin 2s linear infinite; }
`;

export default function AdminDashboard() {
  // ==========================================
  // URL GOOGLE APPS SCRIPT (SUDAH FIX)
  // ==========================================
  const GAS_URL = "https://script.google.com/macros/s/AKfycbwiiBGWqYItwBQ5818pj7Y3uK04YIuYfLJzSUtvc0m82f5XJ6AoxUWBcbC9XWqwM7Pi/exec"; 

  const [isMounted, setIsMounted] = useState(false);

  // --- STATE LOGIN & SECURITY ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);

  // --- STATE DASHBOARD NAV & NOTIF ---
  const [activeTab, setActiveTab] = useState('about');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState<any>(null); 
  const [isSaving, setIsSaving] = useState(false);

  // --- STATE KONTEN (Mock Data) ---
  const [aboutImg, setAboutImg] = useState("https://placehold.co/600x600/1e293b/f97316?text=Foto+Tentang+Kami");
  const [testimonials, setTestimonials] = useState([
    { id: 1, name: 'Rina Kartika', role: 'Business Owner', text: 'Pembukuan usaha saya jadi jauh lebih rapi dan terorganisir.' }
  ]);
  const [docs, setDocs] = useState([
    { id: 1, title: 'Webinar Tax Planning', desc: 'Berbagi insight mengenai strategi.', img: 'https://placehold.co/800x500/1e293b/f97316?text=Dokumentasi+1' }
  ]);
  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/embed/tgbNymZ7vqY");
  const [team, setTeam] = useState([
    { id: 1, name: 'Adhwa Neisya', job: 'Tax/Accounting', img: 'https://placehold.co/200x200/1e293b/f97316?text=Foto+Praktisi' }
  ]);
  const [adminUsers, setAdminUsers] = useState([
    { id: 1, username: 'admin', name: 'Adhwa Neisya', role: 'Super Admin', email: 'adhwa@finensia.com' }
  ]);

  // ==========================================
  // LAYER 1 & 4: INIT SECURITY & SESSION CHECK
  // ==========================================
  useEffect(() => {
    setIsMounted(true);

    const auth = sessionStorage.getItem('finensia_admin_auth');
    if (auth === 'true') setIsLoggedIn(true);

    const lockUntil = localStorage.getItem('finensia_lockout_time');
    if (lockUntil) {
      const now = new Date().getTime();
      if (now < parseInt(lockUntil)) {
        setIsLocked(true);
        setLockTimeRemaining(Math.ceil((parseInt(lockUntil) - now) / 60000));
      } else {
        localStorage.removeItem('finensia_lockout_time');
        localStorage.removeItem('finensia_failed_attempts');
      }
    }

    const attempts = localStorage.getItem('finensia_failed_attempts');
    if (attempts) setFailedAttempts(parseInt(attempts));
  }, []);

  // ==========================================
  // LAYER 2: ANTI-INSPECT ELEMENT 
  // ==========================================
  useEffect(() => {
    if (isLoggedIn || !isMounted) return;

    const handleKeyDown = (e: any) => {
      if (e.key === 'F12' || 
         (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') || 
         (e.ctrlKey && e.key.toLowerCase() === 'u') || 
         (e.metaKey && e.altKey && e.key.toLowerCase() === 'i')) {
        e.preventDefault();
        setLoginError("Akses Developer Tools dilarang untuk alasan keamanan!");
      }
    };
    
    const handleContextMenu = (e: any) => e.preventDefault();

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isLoggedIn, isMounted]);

  // ==========================================
  // FUNGSI LOGIN & LOCKOUT
  // ==========================================
  const handleLogin = (e: any) => {
    e.preventDefault();
    setLoginError('');

    if (isLocked) {
      setLoginError(`Akun terkunci sementara. Coba lagi dalam ${lockTimeRemaining} menit.`);
      return;
    }

    const secretUser = btoa(loginUsername);
    const secretPass = btoa(loginPassword);

    if (secretUser === 'YWRtaW4=' && secretPass === 'YWRtaW4xMjM=') {
      setIsLoggedIn(true);
      sessionStorage.setItem('finensia_admin_auth', 'true');
      setFailedAttempts(0);
      localStorage.removeItem('finensia_failed_attempts');
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      localStorage.setItem('finensia_failed_attempts', newAttempts.toString());

      if (newAttempts >= 3) {
        const lockTime = new Date().getTime() + 15 * 60000;
        localStorage.setItem('finensia_lockout_time', lockTime.toString());
        setIsLocked(true);
        setLockTimeRemaining(15);
        setLoginError('Terlalu banyak percobaan! Akses dikunci selama 15 menit.');
      } else {
        setLoginError(`Username atau Password salah! (Percobaan ${newAttempts}/3)`);
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('finensia_admin_auth');
    setLoginUsername('');
    setLoginPassword('');
  };

  // ==========================================
  // FUNGSI SIMPAN KE GOOGLE SCRIPT
  // ==========================================
  const showNotification = (message: string, type = 'success') => {
    setNotification({ message, type });
    if (type !== 'loading') {
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleSave = async (section: string, payloadData: any) => {
    setIsSaving(true);
    showNotification(`Menyimpan data [${section}] ke database...`, 'loading');

    try {
      const response = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "updateData", section: section, data: payloadData })
      });

      if (response.ok) {
        showNotification(`Perubahan pada [${section}] berhasil disimpan!`, 'success');
      } else {
        throw new Error("Gagal terhubung ke server");
      }
    } catch (error) {
      console.error(error);
      showNotification(`Terjadi kesalahan saat menyimpan [${section}].`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAboutUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAboutImg(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleArrayImageUpload = (e: any, id: number, type: string) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultString = reader.result as string; 
        if (type === 'doc') setDocs(docs.map(doc => doc.id === id ? { ...doc, img: resultString } : doc));
        else if (type === 'team') setTeam(team.map(t => t.id === id ? { ...t, img: resultString } : t));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateTesti = (id: number, field: string, value: string) => setTestimonials(testimonials.map(t => t.id === id ? { ...t, [field]: value } : t));
  const addTesti = () => setTestimonials([{ id: Date.now(), name: '', role: '', text: '' }, ...testimonials]);
  const deleteTesti = (id: number) => setTestimonials(testimonials.filter(t => t.id !== id));

  const updateDoc = (id: number, field: string, value: string) => setDocs(docs.map(d => d.id === id ? { ...d, [field]: value } : d));
  const addDoc = () => setDocs([{ id: Date.now(), title: '', desc: '', img: 'https://placehold.co/800x500/1e293b/f97316?text=Upload+Foto' }, ...docs]);
  const deleteDoc = (id: number) => setDocs(docs.filter(d => d.id !== id));

  const updateTeam = (id: number, field: string, value: string) => setTeam(team.map(t => t.id === id ? { ...t, [field]: value } : t));
  const addTeam = () => setTeam([{ id: Date.now(), name: '', job: '', img: 'https://placehold.co/200x200/1e293b/f97316?text=Upload+Foto' }, ...team]);
  const deleteTeam = (id: number) => setTeam(team.filter(t => t.id !== id));

  const updateAdminUser = (id: number, field: string, value: string) => setAdminUsers(adminUsers.map(a => a.id === id ? { ...a, [field]: value } : a));
  const addAdminUser = () => setAdminUsers([{ id: Date.now(), username: '', name: '', role: 'Editor', email: '' }, ...adminUsers]);
  const deleteAdminUser = (id: number) => setAdminUsers(adminUsers.filter(a => a.id !== id));

  const menuItems = [
    { id: 'about', icon: ImagePlus, label: '1. Tentang Kami' },
    { id: 'testi', icon: MessageSquare, label: '2. Testimoni' },
    { id: 'doc', icon: ImagePlus, label: '3. Dokumentasi' },
    { id: 'video', icon: Video, label: '4. Video Profil' },
    { id: 'team', icon: Users, label: '5. Praktisi' },
    { id: 'admins', icon: UserPlus, label: '6. Kelola Admin' },
  ];

  if (!isMounted) return null;

  // ==========================================
  // TAMPILAN LOGIN SCREEN
  // ==========================================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-inter relative overflow-hidden select-none">
        <style>{styles}</style>
        
        <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>

        <div className="w-full max-w-md bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl animate-fade-in relative z-10">
          <div className="flex justify-center mb-8">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-colors ${isLocked ? 'bg-red-500 shadow-red-500/20' : 'bg-orange-500 shadow-orange-500/20'}`}>
              {isLocked ? <ShieldAlert className="text-white" size={32} /> : <Lock className="text-white" size={32} />}
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-center text-white font-jakarta mb-2">Secure Admin</h1>
          <p className="text-slate-400 text-center text-sm mb-8">
            {isLocked ? `Sistem terkunci. Tunggu ${lockTimeRemaining} menit.` : 'Masuk dengan kredensial yang sah'}
          </p>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 text-sm font-medium animate-slide-in">
              <ShieldAlert size={20} className="flex-shrink-0" /> <span className="leading-tight">{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  disabled={isLocked}
                  placeholder="Masukkan username" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  disabled={isLocked}
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLocked}
              className="w-full py-4 mt-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition shadow-lg shadow-orange-500/20 disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
            >
              {isLocked ? 'Akses Terkunci' : 'Masuk Dashboard'}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-800 text-center flex items-center justify-center gap-2 text-xs text-slate-500">
            <CheckCircle2 size={14} className="text-emerald-500" /> Dilindungi oleh Finensia Security Layer
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // TAMPILAN DASHBOARD UTAMA
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 flex font-inter text-slate-800 relative overflow-x-hidden animate-fade-in">
      <style>{styles}</style>

      {/* TOAST NOTIFICATION */}
      {notification && (
        <div className={`fixed top-6 right-6 z-[100] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in border-l-4 
          ${notification.type === 'error' ? 'bg-red-900 border-red-500' : 'bg-slate-900 border-orange-500'}`}>
          {notification.type === 'loading' ? (
            <Loader2 className="text-orange-500 animate-spin-slow" size={24} />
          ) : notification.type === 'error' ? (
            <ShieldAlert className="text-red-500" size={24} />
          ) : (
            <CheckCircle2 className="text-orange-500" size={24} />
          )}
          <p className="font-medium text-sm">{notification.message}</p>
        </div>
      )}

      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex w-72 bg-slate-950 text-slate-400 flex-col fixed h-full shadow-2xl z-20">
        <div className="p-8 flex items-center gap-3 border-b border-slate-800">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20">
            <TrendingUp className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold text-white font-jakarta tracking-tight">Finensia<span className="text-orange-500">.</span></span>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto no-scrollbar">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-4 px-4">Menu Kontrol Website</p>
          {menuItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
                activeTab === item.id 
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 font-bold' 
                : 'hover:bg-slate-800 hover:text-white font-medium'
              }`}
            >
              <item.icon size={20} /> <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800 space-y-3">
           <a href="/" target="_blank" className="flex items-center justify-center gap-2 p-3.5 bg-slate-800 rounded-xl text-white hover:bg-slate-700 transition font-bold text-sm">
              <Monitor size={18} /> Lihat Website
           </a>
           <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition font-bold text-sm">
              <LogOut size={18} /> Keluar
           </button>
        </div>
      </aside>

      {/* HEADER MOBILE */}
      <div className="md:hidden fixed top-0 w-full bg-slate-950 text-white p-4 flex items-center justify-between z-50 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <TrendingUp size={16} />
          </div>
          <span className="text-xl font-bold font-jakarta">Finensia Admin</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 hover:bg-slate-800 rounded-lg">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MENU MOBILE DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-16 w-full bg-slate-900 z-40 border-b border-slate-800 shadow-xl overflow-y-auto max-h-[80vh]">
          <div className="p-4 flex flex-col gap-2">
            {menuItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                className={`flex items-center gap-3 p-4 rounded-xl ${activeTab === item.id ? 'bg-orange-500 text-white font-bold' : 'text-slate-400 font-medium'}`}
              >
                <item.icon size={20} /> {item.label}
              </button>
            ))}
            <div className="border-t border-slate-800 mt-2 pt-4 px-2">
              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-4 bg-red-500/10 text-red-400 rounded-xl font-bold">
                <LogOut size={18} /> Keluar (Logout)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 md:ml-72 p-6 md:p-10 pt-24 md:pt-10 max-w-5xl">
        <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8 md:mb-12">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 font-jakarta tracking-tight">Kelola Konten</h1>
            <p className="text-slate-500 mt-1">Ubah teks, foto, dan video yang tampil di halaman depan.</p>
          </div>
          <div className="hidden md:flex items-center gap-4 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
             <div className="text-right">
                <p className="font-bold text-slate-900 text-sm">{loginUsername === 'admin' ? 'Adhwa Neisya' : loginUsername}</p>
                <p className="text-xs text-emerald-500 font-bold flex items-center gap-1 justify-end"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Super Admin</p>
             </div>
             <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-extrabold text-slate-700 border border-slate-200">
                <User size={20} />
             </div>
          </div>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[70vh]">
          
          {/* 1. TENTANG KAMI */}
          {activeTab === 'about' && (
            <div className="p-6 md:p-10 animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 mb-8 gap-4">
                <div>
                  <h3 className="text-2xl font-bold font-jakarta text-slate-900">1. Tentang Kami</h3>
                  <p className="text-sm text-slate-500">Ubah foto representasi perusahaan Anda.</p>
                </div>
                <button 
                  onClick={() => handleSave('Tentang Kami', { image: aboutImg })} 
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/20 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={18} className="animate-spin-slow" /> : <Save size={18} />} 
                  {isSaving ? 'Menyimpan...' : 'Simpan Foto'}
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700">Foto Saat Ini (Preview)</label>
                  <div className="aspect-square bg-slate-100 rounded-3xl border-2 border-slate-200 overflow-hidden relative shadow-inner">
                    <img src={aboutImg} className="w-full h-full object-cover" alt="About Preview" />
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100 text-orange-500">
                      <Upload size={28} />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2">Ganti Foto Baru</h4>
                    <p className="text-xs text-slate-500 mb-6 px-4">Foto akan dikonversi agar bisa diunggah ke Google Script.</p>
                    <input type="file" id="uploadAbout" className="hidden" accept="image/*" onChange={handleAboutUpload} />
                    <label htmlFor="uploadAbout" className="cursor-pointer block w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition">
                      Pilih File Upload
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. TESTIMONI */}
          {activeTab === 'testi' && (
            <div className="p-6 md:p-10 animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 mb-8 gap-4">
                <div>
                  <h3 className="text-2xl font-bold font-jakarta text-slate-900">2. Testimoni Klien</h3>
                  <p className="text-sm text-slate-500">Ubah nama, kategori (contoh: Business Owner), dan ulasan.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={addTesti} className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition">
                    <Plus size={18} /> Tambah
                  </button>
                  <button 
                    onClick={() => handleSave('Testimoni', testimonials)} 
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/20 disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 size={18} className="animate-spin-slow" /> : <Save size={18} />} 
                    Simpan Semua
                  </button>
                </div>
              </div>
              <div className="grid gap-6">
                {testimonials.map((testi) => (
                  <div key={testi.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nama Klien</label>
                        <input type="text" value={testi.name} onChange={(e) => updateTesti(testi.id, 'name', e.target.value)} placeholder="Contoh: Rina Kartika" className="w-full p-3.5 bg-white border border-slate-200 rounded-xl font-bold focus:border-orange-500 outline-none transition" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Kategori (Job/Peran)</label>
                        <input type="text" value={testi.role} onChange={(e) => updateTesti(testi.id, 'role', e.target.value)} placeholder="Contoh: Business Owner" className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-orange-600 font-bold focus:border-orange-500 outline-none transition" />
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Isi Testimoni</label>
                      <textarea rows={3} value={testi.text} onChange={(e) => updateTesti(testi.id, 'text', e.target.value)} placeholder="Tuliskan ulasan klien di sini..." className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-orange-500 outline-none transition resize-none"></textarea>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-slate-200">
                       <button onClick={() => deleteTesti(testi.id)} className="px-5 py-2.5 text-red-500 font-bold hover:bg-red-50 rounded-xl flex items-center justify-center gap-2 transition"><Trash2 size={16}/> Hapus Baris Ini</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. DOKUMENTASI */}
          {activeTab === 'doc' && (
            <div className="p-6 md:p-10 animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 mb-8 gap-4">
                <div>
                  <h3 className="text-2xl font-bold font-jakarta text-slate-900">3. Dokumentasi / Kegiatan</h3>
                  <p className="text-sm text-slate-500">Upload foto kegiatan, edit judul acara, dan deskripsi.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={addDoc} className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition">
                    <Plus size={18} /> Tambah
                  </button>
                  <button 
                    onClick={() => handleSave('Dokumentasi', docs)} 
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/20 disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 size={18} className="animate-spin-slow" /> : <Save size={18} />} Simpan Semua
                  </button>
                </div>
              </div>
              <div className="space-y-8">
                {docs.map((doc) => (
                  <div key={doc.id} className="grid md:grid-cols-3 gap-6 items-start p-6 border border-slate-200 rounded-3xl bg-slate-50">
                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Foto Dokumentasi</label>
                      <div className="aspect-video bg-white rounded-2xl overflow-hidden relative border border-slate-200 group">
                         <img src={doc.img} className="w-full h-full object-cover" alt="Doc" />
                         <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <input type="file" id={`file-doc-${doc.id}`} onChange={(e) => handleArrayImageUpload(e, doc.id, 'doc')} className="hidden" accept="image/*" />
                            <label htmlFor={`file-doc-${doc.id}`} className="cursor-pointer bg-white text-slate-900 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
                              <Upload size={16}/> Ganti Foto
                            </label>
                         </div>
                      </div>
                    </div>
                    <div className="md:col-span-2 flex flex-col h-full">
                      <div className="space-y-4 flex-1">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Judul Kegiatan</label>
                          <input type="text" value={doc.title} onChange={(e) => updateDoc(doc.id, 'title', e.target.value)} placeholder="Contoh: Webinar Tax Planning" className="w-full p-3.5 bg-white border border-slate-200 rounded-xl font-bold focus:border-orange-500 outline-none transition" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Deskripsi Kegiatan</label>
                          <textarea rows={3} value={doc.desc} onChange={(e) => updateDoc(doc.id, 'desc', e.target.value)} placeholder="Contoh: Berbagi insight mengenai..." className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-orange-500 outline-none transition resize-none"></textarea>
                        </div>
                      </div>
                      <div className="flex justify-end pt-6 border-t border-slate-200 mt-6">
                        <button onClick={() => deleteDoc(doc.id)} className="px-4 py-2 text-red-500 font-bold hover:bg-red-50 rounded-xl transition flex items-center gap-2"><Trash2 size={18}/> Hapus Baris</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. VIDEO PROFIL */}
          {activeTab === 'video' && (
            <div className="p-6 md:p-10 animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 mb-8 gap-4">
                <div>
                  <h3 className="text-2xl font-bold font-jakarta text-slate-900">4. Video Profil</h3>
                  <p className="text-sm text-slate-500">Tautkan video YouTube untuk ditampilkan di website.</p>
                </div>
                <button 
                  onClick={() => handleSave('Video Profil', { url: videoUrl })} 
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/20 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={18} className="animate-spin-slow" /> : <Save size={18} />} Simpan Tautan
                </button>
              </div>
              <div className="grid lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Link YouTube (Embed URL)</label>
                    <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/embed/..." className="w-full p-4 border border-slate-300 rounded-2xl bg-slate-50 font-mono text-sm text-blue-600 outline-none focus:border-orange-500 focus:bg-white transition shadow-inner" />
                  </div>
                  <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 flex gap-4 text-blue-800 text-sm">
                    <AlertCircle size={24} className="flex-shrink-0 text-blue-500 mt-1" />
                    <div>
                      <p className="font-bold text-blue-900 mb-1">Catatan Penting:</p>
                      <p className="text-slate-600">Pastikan link mengandung kata <b>/embed/</b> agar video bisa diputar di dalam website tanpa pindah aplikasi.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700">Preview Pemutar Video</label>
                  <div className="aspect-video w-full bg-slate-950 rounded-3xl overflow-hidden shadow-xl border-4 border-slate-100">
                    {videoUrl.includes('embed') ? (
                       <iframe width="100%" height="100%" src={videoUrl} title="Preview Video" frameBorder="0" allowFullScreen></iframe>
                    ) : (
                       <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-100 gap-2">
                         <Video size={32} />
                         <p className="text-sm font-medium">Link video tidak valid.</p>
                       </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. TIM PRAKTISI */}
          {activeTab === 'team' && (
            <div className="p-6 md:p-10 animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 mb-8 gap-4">
                <div>
                  <h3 className="text-2xl font-bold font-jakarta text-slate-900">5. Tim Praktisi</h3>
                  <p className="text-sm text-slate-500">Kelola foto, nama, dan bidang keahlian anggota tim.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={addTeam} className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition">
                    <Plus size={18} /> Tambah Anggota
                  </button>
                  <button 
                    onClick={() => handleSave('Tim Praktisi', team)} 
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/20 disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 size={18} className="animate-spin-slow" /> : <Save size={18} />} Simpan Semua
                  </button>
                </div>
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                {team.map((member) => (
                  <div key={member.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-200 transition hover:border-slate-300">
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="flex-shrink-0 mx-auto sm:mx-0">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white overflow-hidden relative group border-2 border-slate-200 shadow-sm">
                           <img src={member.img} className="w-full h-full object-cover" alt={member.name} />
                           <label htmlFor={`team-upload-${member.id}`} className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm">
                              <Upload size={24} className="text-white" />
                           </label>
                           <input type="file" onChange={(e) => handleArrayImageUpload(e, member.id, 'team')} id={`team-upload-${member.id}`} className="hidden" accept="image/*" />
                        </div>
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nama Lengkap</label>
                          <input type="text" value={member.name} onChange={(e) => updateTeam(member.id, 'name', e.target.value)} placeholder="Contoh: Adhwa Neisya" className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold focus:border-orange-500 outline-none transition" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Kategori / Job</label>
                          <input type="text" value={member.job} onChange={(e) => updateTeam(member.id, 'job', e.target.value)} placeholder="Contoh: Tax / Accounting" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-orange-600 font-bold text-sm focus:border-orange-500 outline-none transition" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-5 border-t border-slate-200 flex justify-end gap-3">
                       <button onClick={() => deleteTeam(member.id)} className="p-2.5 text-slate-400 hover:text-red-500 transition rounded-xl hover:bg-red-50"><Trash2 size={20} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. KELOLA ADMIN */}
          {activeTab === 'admins' && (
            <div className="p-6 md:p-10 animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 mb-8 gap-4">
                <div>
                  <h3 className="text-2xl font-bold font-jakarta text-slate-900">6. Kelola Admin</h3>
                  <p className="text-sm text-slate-500">Atur siapa saja yang memiliki akses ke dashboard ini.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={addAdminUser} className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition">
                    <UserPlus size={18} /> Tambah Admin
                  </button>
                  <button 
                    onClick={() => handleSave('Data Admin', adminUsers)} 
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/20 disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 size={18} className="animate-spin-slow" /> : <Save size={18} />} Simpan Daftar
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <th className="pb-4 pt-2 px-4">Nama Lengkap</th>
                        <th className="pb-4 pt-2 px-4">Username (Login)</th>
                        <th className="pb-4 pt-2 px-4">Hak Akses</th>
                        <th className="pb-4 pt-2 px-4 text-center">Hapus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {adminUsers.map((admin) => (
                        <tr key={admin.id} className="hover:bg-white transition-colors">
                          <td className="py-4 px-4">
                            <input 
                              type="text" 
                              value={admin.name}
                              onChange={(e) => updateAdminUser(admin.id, 'name', e.target.value)} 
                              placeholder="Nama Admin" 
                              className="w-full bg-transparent border-none font-bold text-slate-900 focus:ring-0 outline-none"
                            />
                            <input 
                              type="text" 
                              value={admin.email}
                              onChange={(e) => updateAdminUser(admin.id, 'email', e.target.value)} 
                              placeholder="email@finensia.com" 
                              className="w-full bg-transparent border-none text-xs text-slate-500 focus:ring-0 outline-none mt-1"
                            />
                          </td>
                          <td className="py-4 px-4">
                            <input 
                              type="text" 
                              value={admin.username}
                              onChange={(e) => updateAdminUser(admin.id, 'username', e.target.value)} 
                              placeholder="username_admin" 
                              className="w-full bg-transparent border border-slate-200 rounded-lg p-2 text-sm text-slate-700 outline-none focus:border-orange-500 transition"
                            />
                          </td>
                          <td className="py-4 px-4">
                            <select 
                              value={admin.role}
                              onChange={(e) => updateAdminUser(admin.id, 'role', e.target.value)}
                              className="bg-transparent border border-slate-200 rounded-lg p-2 text-sm font-bold text-orange-600 outline-none focus:border-orange-500 transition cursor-pointer"
                            >
                              <option value="Super Admin">Super Admin</option>
                              <option value="Editor">Editor</option>
                            </select>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <button onClick={() => deleteAdminUser(admin.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Hapus">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
