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
  // URL GOOGLE APPS SCRIPT
  // ==========================================
  const GAS_URL = "URL_GOOGLE_SCRIPT_ANDA_DI_SINI"; 

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
  const [notification, setNotification] = useState(null); 
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

    const handleKeyDown = (e) => {
      if (e.key === 'F12' || 
         (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') || 
         (e.ctrlKey && e.key.toLowerCase() === 'u') || 
         (e.metaKey && e.altKey && e.key.toLowerCase() === 'i')) {
        e.preventDefault();
        setLoginError("Akses Developer Tools dilarang untuk alasan keamanan!");
      }
    };
    
    const handleContextMenu = (e) => e.preventDefault();

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
  const handleLogin = (e) => {
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
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    if (type !== 'loading') {
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleSave = async (section, payloadData) => {
    if (GAS_URL === "URL_GOOGLE_SCRIPT_ANDA_DI_SINI") {
      showNotification("Gagal: URL Google Script belum diatur di kode!", "error");
      return;
    }

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

  const handleAboutUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAboutImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleArrayImageUpload = (e, id, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'doc') setDocs(docs.map(doc => doc.id === id ? { ...doc, img: reader.result } : doc));
        else if (type === 'team') setTeam(team.map(t => t.id === id ? { ...t, img: reader.result } : t));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateTesti = (id, field, value) => setTestimonials(testimonials.map(t => t.id === id ? { ...t, [field]: value } : t));
  const addTesti = () => setTestimonials([{ id: Date.now(), name: '', role: '', text: '' }, ...testimonials]);
  const deleteTesti = (id) => setTestimonials(testimonials.filter(t => t.id !== id));

  const updateDoc = (id, field, value) => setDocs(docs.map(d => d.id === id ? { ...d, [field]: value } : d));
  const addDoc = () => setDocs([{ id: Date.now(), title: '', desc: '', img: 'https://placehold.co/800x500/1e293b/f97316?text=Upload+Foto' }, ...docs]);
  const deleteDoc = (id) => setDocs(docs.filter(d => d.id !== id));

  const updateTeam = (id, field, value) => setTeam(team.map(t => t.id === id ? { ...t, [field]: value } : t));
  const addTeam = () => setTeam([{ id: Date.now(), name: '', job: '', img: 'https://placehold.co/200x200/1e293b/f97316?text=Upload+Foto' }, ...team]);
  const deleteTeam = (id) => setTeam(team.filter(t => t.id !== id));

  const updateAdminUser = (id, field, value) => setAdminUsers(adminUsers.map(a => a.id === id ? { ...a, [field]: value } : a));
  const addAdminUser = () => setAdminUsers([{ id: Date.now(), username: '', name: '', role: 'Editor', email: '' }, ...adminUsers]);
  const deleteAdminUser = (id) => setAdminUsers(adminUsers.filter(a => a.id !== id));

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
