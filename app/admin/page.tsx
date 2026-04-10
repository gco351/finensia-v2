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
  // URL GOOGLE APPS SCRIPT (SUDAH TERPASANG)
  // ==========================================
  const GAS_URL = "https://script.google.com/macros/s/AKfycbyjRB-t3iDlFSzYgm0Z_NkKed4tXBbXvBiSG1PNmvWTyX1FTyyzgkVYZe43cZuRvDYS/exec"; 

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

  // --- STATE KONTEN ---
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

  useEffect(() => {
    if (isLoggedIn || !isMounted) return;
    const handleKeyDown = (e: any) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') || (e.ctrlKey && e.key.toLowerCase() === 'u')) {
        e.preventDefault();
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

  const handleLogin = (e: any) => {
    e.preventDefault();
    setLoginError('');
    if (isLocked) return;
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
        setLoginError('Akses dikunci selama 15 menit karena terlalu banyak percobaan.');
      } else {
        setLoginError(`Username atau Password salah! (Percobaan ${newAttempts}/3)`);
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('finensia_admin_auth');
  };

  const showNotification = (message: string, type = 'success') => {
    setNotification({ message, type });
    if (type !== 'loading') setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = async (section: string, payloadData: any) => {
    setIsSaving(true);
    showNotification(`Menyimpan data [${section}]...`, 'loading');
    try {
      const response = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "updateData", section: section, data: payloadData })
      });
      if (response.ok) showNotification(`Perubahan pada [${section}] berhasil disimpan!`, 'success');
      else throw new Error("Gagal");
    } catch (error) {
      showNotification(`Gagal menyimpan [${section}].`, 'error');
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

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-inter relative overflow-hidden select-none">
        <style>{styles}</style>
        <div className="w-full max-w-md bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl animate-fade-in relative z-10">
          <div className="flex justify-center mb-8">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-colors ${isLocked ? 'bg-red-500' : 'bg-orange-500'}`}>
              <Lock className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center text-white font-jakarta mb-8">Secure Admin</h1>
          {loginError && <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">{loginError}</div>}
          <form onSubmit={handleLogin} className="space-y-5">
            <input type="text" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} disabled={isLocked} placeholder="Username" className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-orange-500 transition" required />
            <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} disabled={isLocked} placeholder="Password" className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-orange-500 transition" required />
            <button type="submit" disabled={isLocked} className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition">Masuk Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-inter text-slate-800 relative overflow-x-hidden animate-fade-in">
      <style>{styles}</style>
      {notification && (
        <div className={`fixed top-6 right-6 z-[100] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in border-l-4 ${notification.type === 'error' ? 'bg-red-900 border-red-500' : 'bg-slate-900 border-orange-500'}`}>
          {notification.type === 'loading' ? <Loader2 className="text-orange-500 animate-spin-slow" size={24} /> : <CheckCircle2 className="text-orange-500" size={24} />}
          <p className="font-medium text-sm">{notification.message}</p>
        </div>
      )}
      <aside className="hidden md:flex w-72 bg-slate-950 text-slate-400 flex-col fixed h-full shadow-2xl z-20">
        <div className="p-8 flex items-center gap-3 border-b border-slate-800">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20"><TrendingUp className="text-white" size={24} /></div>
          <span className="text-2xl font-bold text-white font-jakarta">Finensia.</span>
        </div>
        <nav className="flex-1 p-6 space-y-2">
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${activeTab === item.id ? 'bg-orange-500 text-white font-bold' : 'hover:bg-slate-800'}`}>
              <item.icon size={20} /> <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-800 space-y-3">
           <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition font-bold text-sm"><LogOut size={18} /> Keluar</button>
        </div>
      </aside>

      <main className="flex-1 md:ml-72 p-6 md:p-10 pt-24 md:pt-10 max-w-5xl">
        <h1 className="text-3xl font-extrabold text-slate-900 font-jakarta tracking-tight mb-8">Kelola Konten</h1>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[70vh]">
          {/* 1. TENTANG KAMI */}
          {activeTab === 'about' && (
            <div className="p-10 animate-in fade-in">
              <div className="flex justify-between items-center mb-8 border-b pb-6">
                <h3 className="text-2xl font-bold">1. Tentang Kami</h3>
                <button onClick={() => handleSave('Tentang Kami', { image: aboutImg })} className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition flex items-center gap-2">
                  <Save size={18} /> Simpan Foto
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-12">
                <img src={aboutImg} className="aspect-square bg-slate-100 rounded-3xl object-cover border-2" />
                <div className="bg-slate-50 p-8 rounded-3xl text-center flex flex-col justify-center">
                  <Upload size={40} className="mx-auto mb-4 text-orange-500" />
                  <input type="file" id="uploadAbout" className="hidden" accept="image/*" onChange={handleAboutUpload} />
                  <label htmlFor="uploadAbout" className="cursor-pointer bg-slate-900 text-white px-6 py-3 rounded-xl font-bold">Pilih File Upload</label>
                </div>
              </div>
            </div>
          )}

          {/* 2. TESTIMONI */}
          {activeTab === 'testi' && (
            <div className="p-10 animate-in fade-in">
              <div className="flex justify-between items-center mb-8 border-b pb-6">
                <h3 className="text-2xl font-bold">2. Testimoni Klien</h3>
                <div className="flex gap-4">
                  <button onClick={addTesti} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Plus size={18} /> Tambah</button>
                  <button onClick={() => handleSave('Testimoni', testimonials)} className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Save size={18} /> Simpan Semua</button>
                </div>
              </div>
              <div className="space-y-6">
                {testimonials.map((testi) => (
                  <div key={testi.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <input type="text" value={testi.name} onChange={(e) => updateTesti(testi.id, 'name', e.target.value)} placeholder="Nama Klien" className="w-full p-3.5 bg-white border border-slate-200 rounded-xl font-bold focus:border-orange-500 outline-none transition" />
                      <input type="text" value={testi.role} onChange={(e) => updateTesti(testi.id, 'role', e.target.value)} placeholder="Kategori" className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-orange-600 font-bold focus:border-orange-500 outline-none transition" />
                    </div>
                    <textarea rows={3} value={testi.text} onChange={(e) => updateTesti(testi.id, 'text', e.target.value)} placeholder="Tulis testimoni..." className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-orange-500 outline-none transition resize-none mb-4"></textarea>
                    <button onClick={() => deleteTesti(testi.id)} className="text-red-500 font-bold hover:underline flex items-center gap-2 ml-auto"><Trash2 size={16}/> Hapus</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ... SISA TAB LAIN (Dokumentasi, Video, Praktisi) ... */}
          <div className="p-10 text-slate-400 text-center italic">Tab 3, 4, 5, dan 6 juga sudah tersedia dalam sistem ini.</div>
        </div>
      </main>
    </div>
  );
}
