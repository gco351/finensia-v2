"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";

// --- TYPES & INTERFACES ---
type MessageType = "success" | "error" | "";

type MessageState = {
  text: string;
  type: MessageType;
};

type TestimoniItem = {
  id: number;
  nama?: string;
  name?: string;
  job?: string;
  role?: string;
  testimoni?: string;
  text?: string;
};

type DokumenItem = {
  id: number;
  title?: string;
  image?: string;
  img?: string;
  deskripsi?: string;
  desc?: string;
};

type TeamItem = {
  id: number;
  nama?: string;
  name?: string;
  job?: string;
  role?: string;
  image?: string;
  img?: string;
};

type AboutForm = File | null;
type UploadForm = {
  title: string;
  deskripsi: string;
  image: string;
  file: File | null;
};

type TeamForm = {
  nama: string;
  job: string;
  image: string;
  file: File | null;
};

export default function AdminDashboard() {
  // Auth States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // App States
  const [activeTab, setActiveTab] = useState("tentang");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<MessageState>({ text: "", type: "" });

  // Data States
  const [tentangImg, setTentangImg] = useState("");
  const [tentangFile, setTentangFile] = useState<AboutForm>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [testimoni, setTestimoni] = useState<TestimoniItem[]>([]);
  const [dokumentasi, setDokumentasi] = useState<DokumenItem[]>([]);
  const [tim, setTim] = useState<TeamItem[]>([]);

  // Form States
  const [newTesti, setNewTesti] = useState({ nama: "", job: "", testimoni: "" });
  const [newDoc, setNewDoc] = useState<UploadForm>({
    title: "",
    deskripsi: "",
    image: "",
    file: null,
  });
  const [newTeam, setNewTeam] = useState<TeamForm>({
    nama: "",
    job: "",
    image: "",
    file: null,
  });

  // Environment Variables
  const supabaseUrl = typeof process !== "undefined" && process.env ? process.env.NEXT_PUBLIC_SUPABASE_URL || "" : "";
  const supabaseKey = typeof process !== "undefined" && process.env ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "" : "";

  // --- SESSION RESTORE ---
  useEffect(() => {
    const savedToken = sessionStorage.getItem("adminToken");
    if (savedToken) {
      setAuthToken(savedToken);
      setIsLoggedIn(true);
    }
  }, []);

  // --- SUPABASE API HELPERS ---
  const fetchTable = async (tableName: string): Promise<any[]> => {
    if (!supabaseUrl || !supabaseKey) return [];
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/${tableName}?select=*`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${authToken || supabaseKey}`,
        },
      });
      if (!res.ok) throw new Error("Gagal fetch data");
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const insertData = async (tableName: string, data: Record<string, unknown>) => {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/${tableName}`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        console.error(`Database Insert Error on ${tableName}:`, err);
        return false;
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteData = async (tableName: string, id: number) => {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/${tableName}?id=eq.${id}`, {
        method: "DELETE",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${authToken}`,
        },
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  const updateSingleData = async (tableName: string, data: Record<string, unknown>) => {
    try {
      // BUG FIX: Supabase PostgREST menolak DELETE massal tanpa filter. 
      // Kita fetch ID yang ada dulu lalu hapus satu per satu agar bersih dan tidak error 400.
      const existingData = await fetchTable(tableName);
      for (const row of existingData) {
        if (row.id) {
          await deleteData(tableName, row.id as number);
        }
      }
      return await insertData(tableName, data);
    } catch (err) {
      console.error("Update Single Data Error:", err);
      return false;
    }
  };

  const uploadImage = async (file: File | null) => {
    if (!file) return null;
    let bucketName = "IMAGES"; 
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

    try {
      let res = await fetch(`${supabaseUrl}/storage/v1/object/${bucketName}/${fileName}`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${authToken}`,
          "Content-Type": file.type,
        },
        body: file,
      });

      // BUG FIX: Fallback otomatis jika bucket IMAGES (huruf besar) tidak ditemukan, coba images (huruf kecil)
      if (!res.ok && (res.status === 400 || res.status === 404)) {
        bucketName = "images";
        res = await fetch(`${supabaseUrl}/storage/v1/object/${bucketName}/${fileName}`, {
          method: "POST",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${authToken}`,
            "Content-Type": file.type,
          },
          body: file,
        });
      }

      if (!res.ok) {
        const errInfo = await res.json();
        console.error("Storage Upload Error:", errInfo);
        throw new Error("Upload gagal");
      }
      return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${fileName}`;
    } catch (err) {
      console.error("Upload process error:", err);
      return null;
    }
  };

  // --- DATA LOADING ---
  const loadAllData = async () => {
    setIsLoading(true);
    const [dTentang, dVideo, dTesti, dDok, dTim] = await Promise.all([
      fetchTable("tentang_kami"),
      fetchTable("video_profil"),
      fetchTable("testimoni"),
      fetchTable("dokumentasi"),
      fetchTable("tim_praktisi"),
    ]);

    if (dTentang && dTentang.length > 0) setTentangImg(dTentang[0].img || dTentang[0].image || "");
    if (dVideo && dVideo.length > 0) setVideoUrl(dVideo[0].url || "");
    setTestimoni(dTesti || []);
    setDokumentasi(dDok || []);
    setTim(dTim || []);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoggedIn) loadAllData();
  }, [isLoggedIn]);

  // --- AUTH HANDLERS ---
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    try {
      const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailInput, password: passwordInput }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error_description || data.msg || "Kredensial tidak valid.");
      }

      setAuthToken(data.access_token);
      sessionStorage.setItem("adminToken", data.access_token);
      setIsLoggedIn(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setLoginError(msg === "Invalid login credentials" ? "Email atau password salah." : msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setAuthToken("");
    sessionStorage.removeItem("adminToken");
    setIsLoggedIn(false);
    setEmailInput("");
    setPasswordInput("");
  };

  const showMessage = (text: string, type: MessageType = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  // --- CRUD HANDLERS ---
  
  // 1. Tentang Kami
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
        showMessage("Gagal mengunggah gambar ke Storage!", "error");
        setIsLoading(false);
        return;
      }
    }

    // BUG FIX: Gunakan kunci 'img' standar
    const success = await updateSingleData("tentang_kami", { img: finalImgUrl });
    success ? showMessage("Foto Tentang Kami berhasil diperbarui!") : showMessage("Gagal menyimpan ke Database!", "error");
    setIsLoading(false);
  };

  // 4. Video
  const saveVideo = async () => {
    setIsLoading(true);
    const success = await updateSingleData("video_profil", { url: videoUrl });
    success ? showMessage("Video Profil berhasil diperbarui!") : showMessage("Gagal menyimpan ke Database!", "error");
    setIsLoading(false);
  };

  // 2. Testimoni
  const addTesti = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // BUG FIX: Menyesuaikan nama kolom dengan struktur database (name, role, text)
    const dataToSave = { 
      name: newTesti.nama, 
      role: newTesti.job, 
      text: newTesti.testimoni 
    };

    const success = await insertData("testimoni", dataToSave);
    if (success) {
      showMessage("Testimoni berhasil ditambahkan!");
      setNewTesti({ nama: "", job: "", testimoni: "" });
      loadAllData();
    } else {
      showMessage("Gagal menyimpan testimoni! Cek nama kolom database.", "error");
    }
    setIsLoading(false);
  };

  // 3. Dokumentasi
  const addDoc = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    let finalImgUrl = newDoc.image;
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

    // BUG FIX: Menyesuaikan nama kolom dengan struktur database (title, desc, img)
    const dataToSave = { 
      title: newDoc.title, 
      desc: newDoc.deskripsi, 
      img: finalImgUrl 
    };

    const success = await insertData("dokumentasi", dataToSave);
    if (success) {
      showMessage("Dokumentasi berhasil ditambahkan!");
      setNewDoc({ title: "", deskripsi: "", image: "", file: null });
      loadAllData();
    } else {
      showMessage("Gagal menyimpan data dokumentasi! Cek nama kolom.", "error");
    }
    setIsLoading(false);
  };

  // 5. Praktisi
  const addTeam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    let finalImgUrl = newTeam.image;
    if (newTeam.file) {
      const uploadedUrl = await uploadImage(newTeam.file);
      if (uploadedUrl) {
        finalImgUrl = uploadedUrl;
      } else {
        showMessage("Gagal mengunggah foto praktisi ke Storage!", "error");
        setIsLoading(false);
        return;
      }
    }

    // BUG FIX: Menyesuaikan nama kolom dengan struktur database (name, role, img)
    const dataToSave = { 
      name: newTeam.nama, 
      role: newTeam.job, 
      img: finalImgUrl 
    };

    const success = await insertData("tim_praktisi", dataToSave);
    if (success) {
      showMessage("Praktisi berhasil ditambahkan!");
      setNewTeam({ nama: "", job: "", image: "", file: null });
      loadAllData();
    } else {
      showMessage("Gagal menyimpan data praktisi! Cek nama kolom.", "error");
    }
    setIsLoading(false);
  };

  const handleDelete = async (table: string, id: number) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    setIsLoading(true);
    const success = await deleteData(table, id);
    success ? showMessage("Data berhasil dihapus!") : showMessage("Gagal menghapus data! Cek RLS Policy.", "error");
    loadAllData();
    setIsLoading(false);
  };

  // --- LOGIN UI ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center font-sans p-6 relative overflow-hidden">
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

  // --- DASHBOARD UI ---
  const tabs = [
    { id: "tentang", name: "1. Tentang Kami", icon: <ImageIcon size={18} /> },
    { id: "testimoni", name: "2. Testimoni", icon: <MessageSquare size={18} /> },
    { id: "dokumentasi", name: "3. Dokumentasi", icon: <Camera size={18} /> },
    { id: "video", name: "4. Video Profil", icon: <Video size={18} /> },
    { id: "tim", name: "5. Praktisi", icon: <Users size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col md:flex-row">
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
                activeTab === tab.id
                  ? "bg-orange-500 text-white font-medium shadow-md shadow-orange-500/20"
                  : "hover:bg-slate-800 hover:text-white"
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

      <main className="flex-1 p-6 md:p-10 md:h-screen md:overflow-y-auto bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 capitalize">
              Kelola {activeTab.replace("_", " ")}
            </h2>
            <button
              onClick={loadAllData}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition shadow-sm text-sm disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} /> Refresh Data
            </button>
          </div>

          {message.text && (
            <div
              className={`p-4 mb-6 rounded-xl text-sm font-medium flex items-center gap-2 animate-fade-in ${
                message.type === "error"
                  ? "bg-red-50 text-red-600 border border-red-100"
                  : "bg-emerald-50 text-emerald-600 border border-emerald-100"
              }`}
            >
              {message.type === "error" ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}{" "}
              {message.text}
            </div>
          )}

          {/* 1. TENTANG KAMI */}
          {activeTab === "tentang" && (
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
              <label className="block text-sm font-bold text-slate-700 mb-3">1. Ganti Foto Tentang Kami (Upload)</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {/* Menambahkan Key agar input file otomatis ter-reset saat berhasil upload */}
                <input
                  key={tentangFile ? "has-file" : "no-file"}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setTentangFile(e.target.files?.[0] ?? null)}
                  className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 transition-all cursor-pointer"
                />
                <button
                  onClick={saveTentang}
                  disabled={isLoading || (!tentangFile && !tentangImg)}
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md"
                >
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
                  <img src={tentangImg} alt="Preview" className="w-full h-auto" />
                </div>
              )}
            </div>
          )}

          {/* 2. TESTIMONI */}
          {activeTab === "testimoni" && (
            <div className="space-y-8">
              <form onSubmit={addTesti} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 grid md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <h3 className="font-bold text-xl text-slate-800 border-b border-slate-100 pb-3">2. Kelola Testimoni</h3>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Ganti Nama</label>
                  <input
                    type="text"
                    value={newTesti.nama}
                    onChange={(e) => setNewTesti({ ...newTesti, nama: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-orange-500"
                    placeholder="Masukkan nama klien"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Kategori (Misal: Business Owner)</label>
                  <input
                    type="text"
                    value={newTesti.job}
                    onChange={(e) => setNewTesti({ ...newTesti, job: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-orange-500"
                    placeholder="Contoh: Business Owner"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Isi Testimoni</label>
                  <textarea
                    value={newTesti.testimoni}
                    onChange={(e) => setNewTesti({ ...newTesti, testimoni: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 h-28 focus:outline-orange-500"
                    placeholder="Ketik ulasan di sini..."
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <button type="submit" disabled={isLoading} className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 rounded-xl font-bold">
                    Tambah Testimoni
                  </button>
                </div>
              </form>

              <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="p-5 font-bold uppercase tracking-wider text-xs">Klien</th>
                      <th className="p-5 font-bold uppercase tracking-wider text-xs">Aksi (Hapus Data Lama)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {testimoni.map((item, i) => (
                      <tr key={i}>
                        <td className="p-5">
                          <p className="font-bold text-slate-800">{item.nama || item.name}</p>
                          <p className="text-xs text-slate-500">{item.job || item.role}</p>
                        </td>
                        <td className="p-5">
                          <button onClick={() => handleDelete("testimoni", item.id)} className="text-red-500 flex items-center gap-2 font-medium bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100">
                            <Trash2 size={16} /> Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. DOKUMENTASI */}
          {activeTab === "dokumentasi" && (
            <div className="space-y-8">
              <form onSubmit={addDoc} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 grid gap-5">
                <h3 className="font-bold text-xl text-slate-800">3. Kelola Dokumentasi</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Judul (Ex: Webinar Tax Planning)</label>
                  <input
                    type="text"
                    placeholder="Contoh: Webinar Tax Planning"
                    value={newDoc.title}
                    onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Ganti Foto dengan Upload</label>
                  <input
                    key={newDoc.file ? "has-file" : "no-file"}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewDoc({ ...newDoc, file: e.target.files?.[0] ?? null })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Deskripsi (Ex: Berbagi insight...)</label>
                  <textarea
                    value={newDoc.deskripsi}
                    onChange={(e) => setNewDoc({ ...newDoc, deskripsi: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 h-24"
                    placeholder="Contoh: Berbagi insight..."
                  />
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-500/20">
                   Simpan Dokumentasi
                </button>
              </form>

              <div className="grid sm:grid-cols-3 gap-5">
                {dokumentasi.map((item, i) => (
                  <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm relative group border border-slate-100">
                    <img src={item.image || item.img || ""} className="w-full h-40 object-cover" alt="" />
                    <div className="p-3">
                      <p className="font-bold text-xs truncate">{item.title}</p>
                    </div>
                    <button onClick={() => handleDelete("dokumentasi", item.id)} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. VIDEO PROFIL */}
          {activeTab === "video" && (
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
              <label className="block text-sm font-bold text-slate-700 mb-3">4. Ganti Video (Cantumkan Link YouTube)</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 focus:outline-none focus:border-orange-500 transition-all"
                  placeholder="https://www.youtube.com/embed/EJozdWEAdus"
                />
                <button
                  onClick={saveVideo}
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Simpan
                </button>
              </div>
            </div>
          )}

          {/* 5. TIM PRAKTISI */}
          {activeTab === "tim" && (
            <div className="space-y-8">
              <form onSubmit={addTeam} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 grid gap-5">
                <h3 className="font-bold text-xl text-slate-800">5. Kelola Praktisi</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Ubah Nama</label>
                  <input
                    type="text"
                    placeholder="Nama Lengkap Praktisi"
                    value={newTeam.nama}
                    onChange={(e) => setNewTeam({ ...newTeam, nama: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Kategori Job (Misal: Tax/Accounting)</label>
                  <input
                    type="text"
                    placeholder="Contoh: Tax / Accounting"
                    value={newTeam.job}
                    onChange={(e) => setNewTeam({ ...newTeam, job: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Ganti dengan Upload Foto</label>
                  <input
                    key={newTeam.file ? "has-file" : "no-file"}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewTeam({ ...newTeam, file: e.target.files?.[0] ?? null })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5"
                  />
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-500/20">
                   Tambahkan Praktisi
                </button>
              </form>

              <div className="grid sm:grid-cols-2 gap-5">
                {tim.map((item, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4 relative group border border-slate-50 hover:border-orange-100 transition-colors">
                    <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center">
                       {item.image || item.img ? (
                         <img src={item.image || item.img || ""} className="w-full h-full object-cover" alt="" />
                       ) : (
                         <Users className="m-auto text-slate-400" />
                       )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-slate-800">{item.nama || item.name}</h4>
                      <p className="text-xs text-orange-500">{item.job || item.role}</p>
                    </div>
                    <button onClick={() => handleDelete("tim_praktisi", item.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
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
