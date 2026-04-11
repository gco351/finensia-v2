"use client";

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Video, 
  MessageSquare, 
  Camera, 
  Users, 
  LogOut,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  AlertCircle,
  UploadCloud,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  Settings,
  Link2
} from 'lucide-react';

export default function AdminDashboard() {
  // Auth States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // App States
  const [activeTab, setActiveTab] = useState("pengaturan");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  // Fitur reset key agar input file kembali kosong setelah sukses upload
  const [resetKey, setResetKey] = useState(Date.now());

  // Data States
  const [logoImg, setLogoImg] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [tentangImg, setTentangImg] = useState("");
  const [tentangFile, setTentangFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [testimoni, setTestimoni] = useState([]);
  const [dokumentasi, setDokumentasi] = useState([]);
  const [tim, setTim] = useState([]);
  
  // Link States
  const [waLink, setWaLink] = useState("");
  const [kelas1Link, setKelas1Link] = useState("");
  const [kelas2Link, setKelas2Link] = useState("");

  // Form States for adding new items
  const [newTesti, setNewTesti] = useState({ nama: "", job: "", testimoni: "" });
  const [newDoc, setNewDoc] = useState({ title: "", deskripsi: "", img: "", file: null });
  const [newTeam, setNewTeam] = useState({ nama: "", job: "", img: "", file: null });

  // Environment Variables
  const supabaseUrl = typeof process !== 'undefined' && process.env ? process.env.NEXT_PUBLIC_SUPABASE_URL || "" : "";
  const supabaseKey = typeof process !== 'undefined' && process.env ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "" : "";

  // --- SESSION RESTORE ---
  useEffect(() => {
    const savedToken = sessionStorage.getItem('adminToken');
    if (savedToken) {
      setAuthToken(savedToken);
      setIsLoggedIn(true);
    }
  }, []);

  // --- SUPABASE API HELPERS ---
  const fetchTable = async (tableName) => {
    if (!supabaseUrl || !supabaseKey) return [];
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/${encodeURIComponent(tableName)}?select=*`, {
        headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${authToken || supabaseKey}` }
      });
      if (!res.ok) throw new Error("Gagal fetch data");
      return await res.json();
    } catch (err) {
      console.error("Fetch Error:", err);
      return [];
    }
  };

  const insertData = async (tableName, data) => {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/${encodeURIComponent(tableName)}`, {
        method: 'POST',
        headers: { 
          'apikey': supabaseKey, 
          'Authorization': `Bearer ${authToken}`, 
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const errInfo = await res.json();
        console.error(`Insert Error [${tableName}]:`, errInfo);
        return false;
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteData = async (tableName, id) => {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/${encodeURIComponent(tableName)}?id=eq.${id}`, {
        method: 'DELETE',
        headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${authToken}` }
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  const updateSingleData = async (tableName, data) => {
    try {
      const existingData = await fetchTable(tableName);
      for (const row of existingData) {
        if (row.id) {
          await deleteData(tableName, row.id);
        }
      }
      return await insertData(tableName, data);
    } catch (err) {
      return false;
    }
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    let bucketName = 'IMAGES';
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

    try {
      let res = await fetch(`${supabaseUrl}/storage/v1/object/${bucketName}/${fileName}`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': file.type
        },
        body: file
      });

      if (!res.ok && (res.status === 400 || res.status === 404)) {
        bucketName = 'images';
        res = await fetch(`${supabaseUrl}/storage/v1/object/${bucketName}/${fileName}`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': file.type
          },
          body: file
        });
      }

      if (!res.ok) {
        const errInfo = await res.json();
        console.error("Storage Error:", errInfo);
        throw new Error("Upload gagal");
      }
      return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${fileName}`;
    } catch (err) {
      console.error("Error upload:", err);
      return null;
    }
  };

  // --- LOAD DATA ---
  const loadAllData = async () => {
    setIsLoading(true);
    const [dTentang, dVideo, dTesti, dDok, dTim, dPengaturan, dLink] = await Promise.all([
      fetchTable('tentang_kami'),
      fetchTable('video_profil'),
      fetchTable('testimoni'),
      fetchTable('dokumentasi'),
      fetchTable('tim_praktisi'),
      fetchTable('pengaturan_logo'), 
      fetchTable('pengaturan_link')
    ]);

    if (dTentang && dTentang.length > 0) setTentangImg(dTentang[0].image || dTentang[0].img || "");
    if (dVideo && dVideo.length > 0) setVideoUrl(dVideo[0].url || "");
    
    if (dPengaturan && dPengaturan.length > 0) setLogoImg(dPengaturan[0].image || dPengaturan[0].logo || "");
    
    if (dLink && dLink.length > 0) {
      setWaLink(dLink[0].wa_umum || "");
      setKelas1Link(dLink[0].kelas_1 || "");
      setKelas2Link(dLink[0].kelas_2 || "");
    }

    setTestimoni(dTesti || []);
    setDokumentasi(dDok || []);
    setTim(dTim || []);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoggedIn) loadAllData();
  }, [isLoggedIn]);

  // --- AUTH HANDLERS ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    try {
      const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: emailInput, password: passwordInput })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error_description || data.msg || "Kredensial tidak valid.");
      }

      setAuthToken(data.access_token);
      sessionStorage.setItem('adminToken', data.access_token);
      setIsLoggedIn(true);
    } catch (err) {
      setLoginError(err.message === "Invalid login credentials" ? "Email atau password salah." : err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setAuthToken("");
    sessionStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    setEmailInput("");
    setPasswordInput("");
  };

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  // --- DATA HANDLERS ---

  const saveLogo = async () => {
    setIsLoading(true);
    let finalImgUrl = logoImg;
    
    if (logoFile) {
      const uploadedUrl = await uploadImage(logoFile);
      if (uploadedUrl) {
        finalImgUrl = uploadedUrl;
        setLogoImg(uploadedUrl);
        setLogoFile(null);
      } else {
        showMessage("Gagal mengunggah logo ke Storage!", "error");
        setIsLoading(false);
        return;
      }
    }

    const success = await updateSingleData('pengaturan_logo', { image: finalImgUrl });
    if (success) {
      showMessage("Logo website berhasil disimpan!");
      setResetKey(Date.now()); 
    } else {
      showMessage("Gagal menyimpan ke database! Pastikan tabel pengaturan_logo sudah dibuat.", "error");
    }
    setIsLoading(false);
  };

  const deleteLogo = async () => {
    if (!window.confirm("Yakin ingin menghapus logo ini?")) return;
    setIsLoading(true);
    
    const success = await updateSingleData('pengaturan_logo', { image: "" });
    if (success) {
      setLogoImg("");
      setLogoFile(null);
      setResetKey(Date.now());
      showMessage("Logo berhasil dihapus!");
    } else {
      showMessage("Gagal menghapus logo!", "error");
    }
    setIsLoading(false);
  };

  const saveLinks = async () => {
    setIsLoading(true);
    const dataToSave = {
      wa_umum: waLink,
      kelas_1: kelas1Link,
      kelas_2: kelas2Link
    };
    const success = await updateSingleData('pengaturan_link', dataToSave);
    success ? showMessage("Link tombol berhasil diperbarui!") : showMessage("Gagal menyimpan ke database!", "error");
    setIsLoading(false);
  };

  const saveTentang = async () => {
    setIsLoading(true);
    let finalImgUrl = tentangImg;
    
    if (tentangFile) {
      const uploadedUrl = await uploadImage(tentangFile);
      if (uploadedUrl) {
        finalImgUrl = uploadedUrl;
        setTentangImg(uploadedUrl);
        setTentangFile(null);
      } else {
        showMessage("Gagal mengunggah gambar!", "error");
        setIsLoading(false);
        return;
      }
    }

    const success = await updateSingleData('tentang_kami', { image: finalImgUrl });
    if (success) {
      showMessage("Foto Tentang Kami berhasil disimpan!");
      setResetKey(Date.now());
    } else {
      showMessage("Gagal menyimpan ke database!", "error");
    }
    setIsLoading(false);
  };

  const saveVideo = async () => {
    setIsLoading(true);
    const success = await updateSingleData('video_profil', { url: videoUrl });
    success ? showMessage("Video Profil berhasil disimpan!") : showMessage("Gagal menyimpan!", "error");
    setIsLoading(false);
  };

  const addTesti = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const dataToSave = { 
      name: newTesti.nama, 
      role: newTesti.job, 
      text: newTesti.testimoni 
    };

    const success = await insertData('testimoni', dataToSave);
    if (success) {
      showMessage("Testimoni ditambahkan!");
      setNewTesti({ nama: "", job: "", testimoni: "" });
      loadAllData();
    } else {
      showMessage("Gagal menambahkan testimoni!", "error");
    }
    setIsLoading(false);
  };

  const addDoc = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let finalImgUrl = newDoc.img;
    if (newDoc.file) {
      const uploadedUrl = await uploadImage(newDoc.file);
      if (uploadedUrl) {
        finalImgUrl = uploadedUrl;
      } else {
        showMessage("Gagal mengunggah gambar dokumentasi!", "error");
        setIsLoading(false);
        return;
      }
    }

    const dataToSave = { 
      title: newDoc.title, 
      desc: newDoc.deskripsi, 
      img: finalImgUrl 
    };

    const success = await insertData('dokumentasi', dataToSave);
    if (success) {
      showMessage("Dokumentasi ditambahkan!");
      setNewDoc({ title: "", deskripsi: "", img: "", file: null });
      setResetKey(Date.now());
      loadAllData();
    } else {
      showMessage("Gagal menambahkan dokumentasi!", "error");
    }
    setIsLoading(false);
  };

  const addTeam = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let finalImgUrl = newTeam.img;
    if (newTeam.file) {
      const uploadedUrl = await uploadImage(newTeam.file);
      if (uploadedUrl) {
        finalImgUrl = uploadedUrl;
      } else {
        showMessage("Gagal mengunggah foto praktisi!", "error");
        setIsLoading(false);
        return;
      }
    }

    const dataToSave = { 
      name: newTeam.nama, 
      role: newTeam.job, 
      img: finalImgUrl 
    };

    const success = await insertData('tim_praktisi', dataToSave);
    if (success) {
      showMessage("Praktisi berhasil ditambahkan!");
      setNewTeam({ nama: "", job: "", img: "", file: null });
      setResetKey(Date.now());
      loadAllData();
    } else {
      showMessage("Gagal menambahkan praktisi!", "error");
    }
    setIsLoading(false);
  };

  const handleDelete = async (table, id) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    setIsLoading(true);
    const success = await deleteData(table, id);
    success ? showMessage("Data berhasil dihapus!") : showMessage("Gagal menghapus data!", "error");
    loadAllData();
    setIsLoading(false);
  };

  // --- LOGIN SCREEN ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center font-inter p-6 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-700 relative z-10">
          <div className="flex flex-col items-center justify-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-orange-500 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <LayoutDashboard className="text-white" size={32} />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white tracking-tight">Finensia Admin</h1>
              <p className="text-slate-400 text-sm mt-1">Silakan masuk dengan kredensial Anda</p>
            </div>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">Email Admin</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="text-slate-500" size={18} />
                </div>
                <input 
                  type="email" 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  placeholder="admin@finensia.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">Kata Sandi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="text-slate-500" size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-11 pr-12 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-2 text-red-400 text-sm animate-pulse">
                <AlertCircle size={16} /> {loginError}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/20 flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : "Masuk ke Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- MAIN DASHBOARD UI ---
  const tabs = [
    { id: "pengaturan", name: "Pengaturan Logo", icon: <Settings size={18} /> },
    { id: "tombol", name: "Pengaturan Link", icon: <Link2 size={18} /> },
    { id: "tentang", name: "Tentang Kami", icon: <ImageIcon size={18} /> },
    { id: "video", name: "Video Profil", icon: <Video size={18} /> },
    { id: "testimoni", name: "Testimoni", icon: <MessageSquare size={18} /> },
    { id: "dokumentasi", name: "Dokumentasi", icon: <Camera size={18} /> },
    { id: "tim", name: "Tim Praktisi", icon: <Users size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-inter flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 md:min-h-screen flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="text-white" size={18} />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">Finensia Admin</span>
        </div>
        <nav className="p-4 space-y-1 flex-grow overflow-x-auto flex md:flex-col md:overflow-visible">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id ? "bg-orange-500 text-white font-medium shadow-md shadow-orange-500/20" : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all font-medium"
          >
            <LogOut size={18} /> Keluar (Logout)
          </button>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main className="flex-1 p-6 md:p-10 md:h-screen md:overflow-y-auto bg-slate-50">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 capitalize">Kelola {activeTab.replace('_', ' ')}</h2>
            <button onClick={loadAllData} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition shadow-sm text-sm disabled:opacity-50">
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} /> Refresh Data
            </button>
          </div>

          {message.text && (
            <div className={`p-4 mb-6 rounded-xl text-sm font-medium flex items-center gap-2 animate-fade-in ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
              {message.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />} {message.text}
            </div>
          )}

          {/* TAB: PENGATURAN WEB (LOGO) */}
          {activeTab === "pengaturan" && (
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="mb-6 pb-6 border-b border-slate-100 flex justify-between items-end">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Logo Website</h3>
                  <p className="text-sm text-slate-500">Ganti logo pada header dan footer.</p>
                </div>
                {logoImg && (
                  <button onClick={deleteLogo} disabled={isLoading} className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors">
                    <Trash2 size={16} /> Hapus Logo
                  </button>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="flex-1 w-full">
                  <input 
                    key={`logo-${resetKey}`}
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setLogoFile(e.target.files?.[0] || null)} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-all cursor-pointer"
                  />
                  {logoFile && (
                    <p className="text-xs text-blue-500 mt-3 flex items-center gap-1.5 bg-blue-50 p-2 rounded-lg inline-block">
                      <UploadCloud size={14} /> File siap diunggah: <strong>{logoFile.name}</strong>
                    </p>
                  )}
                </div>
                
                <button onClick={saveLogo} disabled={isLoading || !logoFile} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md">
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Simpan Logo
                </button>
              </div>
              
              {logoImg && !logoFile && (
                <div className="mt-8 p-6 rounded-2xl bg-slate-900 inline-block border border-slate-700 shadow-inner">
                  <p className="text-slate-400 text-xs font-medium mb-3 uppercase tracking-wider">Logo Aktif Saat Ini</p>
                  <img src={logoImg} alt="Preview Logo" className="h-12 w-auto object-contain bg-white/10 p-2 rounded-lg" />
                </div>
              )}
            </div>
          )}

          {/* TAB: PENGATURAN LINK */}
          {activeTab === "tombol" && (
            <div className="space-y-8">
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="mb-6 pb-6 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800">Pengaturan Tombol WhatsApp & Kelas</h3>
                  <p className="text-sm text-slate-500">Ubah link tautan untuk masing-masing tombol pendaftaran atau kontak.</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">1. Link Ikon WhatsApp / Hubungi Kami</label>
                    <input 
                      type="text" 
                      value={waLink} 
                      onChange={(e) => setWaLink(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-blue-500"
                      placeholder="https://wa.me/628..."
                    />
                    <p className="text-[10px] text-slate-400 mt-1.5 ml-1">Ini adalah link utama untuk tombol "Hubungi Kami" dan Icon Floating WA.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">2. Link Pendaftaran Kelas 1 (Professional)</label>
                    <input 
                      type="text" 
                      value={kelas1Link} 
                      onChange={(e) => setKelas1Link(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-blue-500"
                      placeholder="https://wa.me/628... atau link gform"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">3. Link Pendaftaran Kelas 2 (Intensive)</label>
                    <input 
                      type="text" 
                      value={kelas2Link} 
                      onChange={(e) => setKelas2Link(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-blue-500"
                      placeholder="https://wa.me/628... atau link gform"
                    />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                  <button onClick={saveLinks} disabled={isLoading} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md">
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Simpan Semua Link
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: TENTANG KAMI */}
          {activeTab === "tentang" && (
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
              <label className="block text-sm font-bold text-slate-700 mb-3">Upload Gambar Tentang Kami</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <input 
                  key={`tentang-${resetKey}`}
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setTentangFile(e.target.files?.[0] || null)} 
                  className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 transition-all cursor-pointer"
                />
                <button onClick={saveTentang} disabled={isLoading || (!tentangFile && !tentangImg)} className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md">
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Simpan Perubahan
                </button>
              </div>
              {tentangFile && (
                <p className="text-xs text-orange-500 mt-3 flex items-center gap-1.5 bg-orange-50 p-2 rounded-lg inline-block">
                  <UploadCloud size={14} /> File siap diunggah: <strong>{tentangFile.name}</strong>
                </p>
              )}
              {tentangImg && !tentangFile && (
                <div className="mt-8 rounded-2xl overflow-hidden border-4 border-slate-100 max-w-sm relative group">
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-medium">Gambar Aktif Saat Ini</p>
                  </div>
                  <img src={tentangImg} alt="Preview" className="w-full h-auto" />
                </div>
              )}
            </div>
          )}

          {/* TAB: VIDEO PROFIL */}
          {activeTab === "video" && (
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
              <label className="block text-sm font-bold text-slate-700 mb-3">URL YouTube Embed</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="text" 
                  value={videoUrl} 
                  onChange={(e) => setVideoUrl(e.target.value)} 
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  placeholder="https://www.youtube.com/embed/EJozdWEAdus"
                />
                <button onClick={saveVideo} disabled={isLoading} className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md">
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Simpan
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5 bg-slate-50 p-3 rounded-lg inline-block border border-slate-100">
                <AlertCircle size={14} className="text-blue-500" />
                Format yang benar: <strong>https://www.youtube.com/embed/ID_VIDEO_ANDA</strong>
              </p>
            </div>
          )}

          {/* TAB: TESTIMONI */}
          {activeTab === "testimoni" && (
            <div className="space-y-8">
              <form onSubmit={addTesti} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 grid md:grid-cols-2 gap-5">
                <div className="md:col-span-2"><h3 className="font-bold text-xl text-slate-800 border-b border-slate-100 pb-3">Tambah Testimoni Baru</h3></div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Nama Klien</label>
                  <input type="text" value={newTesti.nama} onChange={e=>setNewTesti({...newTesti, nama: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-orange-500" placeholder="Contoh: Budi Santoso" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Peran / Jabatan</label>
                  <input type="text" value={newTesti.job} onChange={e=>setNewTesti({...newTesti, job: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-orange-500" placeholder="Contoh: Business Owner" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Isi Testimoni</label>
                  <textarea value={newTesti.testimoni} onChange={e=>setNewTesti({...newTesti, testimoni: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 h-28 resize-none focus:outline-orange-500" placeholder="Tulis testimoni di sini..." required></textarea>
                </div>
                <div className="md:col-span-2 mt-2">
                  <button type="submit" disabled={isLoading} className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-70">
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />} Tambah Testimoni
                  </button>
                </div>
              </form>

              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                      <tr><th className="p-5 font-bold uppercase tracking-wider text-xs">Klien</th><th className="p-5 font-bold uppercase tracking-wider text-xs">Testimoni</th><th className="p-5 font-bold uppercase tracking-wider text-xs text-center w-20">Aksi</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {testimoni.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-5">
                            <p className="font-bold text-slate-800">{item.name || item.nama}</p>
                            <p className="text-xs text-orange-500 font-medium mt-0.5">{item.role || item.job}</p>
                          </td>
                          <td className="p-5 text-slate-600 italic">"{item.text || item.testimoni}"</td>
                          <td className="p-5 text-center">
                            <button onClick={() => handleDelete('testimoni', item.id)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2.5 rounded-xl transition-all" title="Hapus Testimoni">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {testimoni.length === 0 && <tr><td colSpan={3} className="p-8 text-center text-slate-400 italic">Belum ada data testimoni.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DOKUMENTASI */}
          {activeTab === "dokumentasi" && (
            <div className="space-y-8">
              <form onSubmit={addDoc} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 grid gap-5">
                <div><h3 className="font-bold text-xl text-slate-800 border-b border-slate-100 pb-3">Tambah Dokumentasi Baru</h3></div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Judul Kegiatan</label>
                  <input type="text" value={newDoc.title} onChange={e=>setNewDoc({...newDoc, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-orange-500" placeholder="Judul Dokumentasi" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Upload Foto Kegiatan</label>
                  <input 
                    key={`doc-${resetKey}`}
                    type="file" 
                    accept="image/*"
                    onChange={e=>setNewDoc({...newDoc, file: e.target.files?.[0] || null})} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 cursor-pointer" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Deskripsi Singkat</label>
                  <textarea value={newDoc.deskripsi} onChange={e=>setNewDoc({...newDoc, deskripsi: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 h-24 resize-none focus:outline-orange-500" placeholder="Deskripsikan kegiatan ini..."></textarea>
                </div>
                <div className="mt-2">
                  <button type="submit" disabled={isLoading} className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-70">
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />} Simpan Dokumentasi
                  </button>
                </div>
              </form>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
                {dokumentasi.map((item, i) => (
                  <div key={i} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative group">
                    <div className="aspect-video w-full bg-slate-100 relative overflow-hidden">
                      <img src={item.img || item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <button onClick={() => handleDelete('dokumentasi', item.id)} className="bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-xl transition shadow-lg w-full flex justify-center items-center gap-2 font-bold text-sm">
                          <Trash2 size={16} /> Hapus
                        </button>
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-bold text-slate-800 mb-1.5 truncate text-sm">{item.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.desc || item.deskripsi}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: TIM PRAKTISI */}
          {activeTab === "tim" && (
            <div className="space-y-8">
              <form onSubmit={addTeam} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 grid md:grid-cols-2 gap-5">
                <div className="md:col-span-2"><h3 className="font-bold text-xl text-slate-800 border-b border-slate-100 pb-3">Tambah Praktisi</h3></div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Nama Lengkap</label>
                  <input type="text" value={newTeam.nama} onChange={e=>setNewTeam({...newTeam, nama: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-orange-500" placeholder="Nama anggota" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Kategori Job</label>
                  <input type="text" value={newTeam.job} onChange={e=>setNewTeam({...newTeam, job: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-orange-500" placeholder="Contoh: Tax Specialist" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Upload Foto Profil</label>
                  <input 
                    key={`team-${resetKey}`}
                    type="file" 
                    accept="image/*"
                    onChange={e=>setNewTeam({...newTeam, file: e.target.files?.[0] || null})} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 cursor-pointer" 
                  />
                </div>
                <div className="md:col-span-2 mt-2">
                  <button type="submit" disabled={isLoading} className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-70">
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />} Tambahkan Praktisi
                  </button>
                </div>
              </form>

              <div className="grid sm:grid-cols-2 gap-5">
                {tim.map((item, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4 relative group hover:border-orange-200 transition-colors">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                      {item.img || item.image ? <img src={item.img || item.image} className="w-full h-full object-cover" alt="" /> : <Users size={20} className="text-slate-400" />}
                    </div>
                    <div className="flex-1 pr-10">
                      <h4 className="font-bold text-sm text-slate-800 truncate">{item.name || item.nama}</h4>
                      <p className="text-xs text-orange-500 font-medium truncate mt-0.5">{item.role || item.job}</p>
                    </div>
                    <button onClick={() => handleDelete('tim_praktisi', item.id)} className="absolute right-4 text-slate-300 hover:text-red-500 hover:bg-red-50 p-2.5 rounded-xl transition-all" title="Hapus Anggota">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
