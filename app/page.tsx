"use client";

import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  CircleDollarSign, 
  FileText, 
  TrendingUp, 
  BookOpen, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  Star,
  ArrowRight,
  ShieldCheck,
  Users,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Camera, 
  PlaySquare 
} from 'lucide-react';

// --- CUSTOM CSS FOR ANIMATIONS & FONTS ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

  html {
    scroll-behavior: smooth;
    scroll-padding-top: 6rem;
  }

  .font-inter {
    font-family: 'Inter', sans-serif;
  }

  h1, h2, h3, h4, h5, h6, .font-jakarta {
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  @keyframes fall {
    0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
    10% { opacity: 0.6; }
    90% { opacity: 0.6; }
    100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
  }
  .falling-icon {
    position: absolute;
    animation: fall linear infinite;
    color: rgba(249, 115, 22, 0.4); 
    z-index: 0;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-up {
    animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .delay-100 { animation-delay: 150ms; }
  .delay-200 { animation-delay: 300ms; }
  
  .hover-lift {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .hover-lift:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 25px 50px -12px rgba(249, 115, 22, 0.3);
    border-color: rgba(249, 115, 22, 0.4);
  }
  
  .text-gradient {
    background: linear-gradient(to right, #f97316, #fb923c, #f59e0b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const FallingBackground = () => {
  const [icons, setIcons] = useState<any[]>([]);

  useEffect(() => {
    const iconTypes = ['dollar', 'calc', 'file', 'chart'];
    const newIcons = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      type: iconTypes[Math.floor(Math.random() * iconTypes.length)],
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 5 + 5}s`, 
      animationDelay: `${Math.random() * 5}s`,
      size: Math.random() * 20 + 20, 
    }));
    setIcons(newIcons);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((icon) => (
        <div
          key={icon.id}
          className="falling-icon"
          style={{
            left: icon.left,
            animationDuration: icon.animationDuration,
            animationDelay: icon.animationDelay,
            fontSize: `${icon.size}px`
          }}
        >
          {icon.type === 'dollar' && <CircleDollarSign size={icon.size} />}
          {icon.type === 'calc' && <Calculator size={icon.size} />}
          {icon.type === 'file' && <FileText size={icon.size} />}
          {icon.type === 'chart' && <TrendingUp size={icon.size} />}
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const GAS_URL = "https://script.google.com/macros/s/AKfycbyNuAHdIXhC0JRFJCsjxGJWxK211PqlPXdTNz8yApWpCTOWSAlNDStEy2T9b9WPBW2F/exec";

  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const [currentDocIndex, setCurrentDocIndex] = useState(0); 

  // --- STATE DATA (Data Bawaan / Fallback) ---
  const [aboutImg, setAboutImg] = useState("");
  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/embed/tgbNymZ7vqY");
  
  const [testimonials, setTestimonials] = useState<any[]>([
    { name: "Rina Kartika", text: "Pembukuan usaha saya jadi jauh lebih rapi dan terorganisir.", role: "Business Owner" },
    { name: "Ahmad Fauzan", text: "Sekarang saya lebih paham akuntansi dan sudah dapat kerja.", role: "Alumni Kelas" },
    { name: "Dwi Santoso", text: "Timnya profesional dan sangat membantu kelancaran bisnis kami.", role: "CEO" }
  ]);

  const [docs, setDocs] = useState<any[]>([
    {
      img: "https://placehold.co/800x500/1e293b/f97316?text=Kelas+Tatap+Muka",
      title: "Pelatihan Akuntansi Batch 1",
      desc: "Suasana kelas yang interaktif, fokus pada bedah kasus dan penyusunan laporan keuangan secara langsung."
    },
    {
      img: "https://placehold.co/800x500/1e293b/f97316?text=Mentoring+Klien",
      title: "Sesi Mentoring & Setup ERP",
      desc: "Pendampingan intensif bersama pemilik UMKM untuk merancang sistem pencatatan yang efisien."
    }
  ]);

  const [team, setTeam] = useState<any[]>([
    { name: "Adhwa Neisya", role: "Accounting & Tax", img: "" },
    { name: "Chelsea Hamid", role: "Tax Specialist", img: "" },
    { name: "Lucas Abraham", role: "Accounting Specialist", img: "" }
  ]);

  // --- SINKRONISASI DATA SEKALI SAAT HALAMAN DIBUKA ---
  useEffect(() => {
    let isMounted = true;

    const fetchDatabase = async () => {
      try {
        const response = await fetch(`${GAS_URL}?t=${new Date().getTime()}`);
        if (!response.ok) throw new Error("Gagal terhubung");
        
        const json = await response.json();
        
        if (isMounted && json.status === 'success' && json.data) {
          const d = json.data;
          
          if (d['Tentang Kami']?.image) setAboutImg(d['Tentang Kami'].image);
          
          if (d['Video Profil']?.url) {
            let rawUrl = d['Video Profil'].url;
            // Filter otomatis sisa HTML seperti title="YouTube video player"
            rawUrl = rawUrl.split('"')[0].split(' ')[0]; 

            // Jika link belum embed, ubah otomatis
            if (rawUrl.includes('youtu.be/')) {
               rawUrl = rawUrl.replace('youtu.be/', 'www.youtube.com/embed/').split('?')[0];
            } else if (rawUrl.includes('watch?v=')) {
               rawUrl = rawUrl.replace('watch?v=', 'embed/').split('&')[0];
            }
            setVideoUrl(rawUrl);
          }
          
          if (d['Testimoni'] && Array.isArray(d['Testimoni']) && d['Testimoni'].length > 0) {
            setTestimonials(d['Testimoni']);
          }
          if (d['Dokumentasi'] && Array.isArray(d['Dokumentasi']) && d['Dokumentasi'].length > 0) {
            setDocs(d['Dokumentasi']);
          }
          if (d['Tim Praktisi'] && Array.isArray(d['Tim Praktisi']) && d['Tim Praktisi'].length > 0) {
            setTeam(d['Tim Praktisi']);
          }
        }
      } catch (error) {
        console.warn("Gagal menarik data. Menggunakan data cadangan. Pastikan akses Google Script diubah ke 'Anyone'.");
      }
    };

    fetchDatabase();

    return () => {
      isMounted = false;
    };
  }, []);

  const waNumber = "6281226523207"; 
  const waLinkGeneral = `https://wa.me/${waNumber}?text=Halo%20Finensia,%20saya%20ingin%20berkonsultasi%20mengenai%20layanan%20dan%20jasa%20Anda.`;
  const waLinkClass1 = `https://wa.me/${waNumber}?text=Halo%20Finensia,%20saya%20ingin%20daftar%20kelas%20Professional%20Accounting.`;
  const waLinkClass2 = `https://wa.me/${waNumber}?text=Halo%20Finensia,%20saya%20ingin%20daftar%20kelas%20Accounting%20Intensive.`;

  const faqs = [
    { q: "Apakah Finensia cocok untuk pemula?", a: "Ya, layanan kami dirancang untuk pemula hingga profesional." },
    { q: "Apakah bisa untuk UMKM kecil?", a: "Bisa, justru UMKM adalah fokus utama kami." },
    { q: "Apakah laporan keuangan sesuai standar?", a: "Ya, sesuai prinsip akuntansi yang berlaku." },
    { q: "Apakah bisa konsultasi dulu?", a: "Bisa, Anda dapat diskusi sebelum menggunakan layanan." },
    { q: "Apakah data saya aman?", a: "Kami menjaga kerahasiaan data klien secara profesional." }
  ];

  const nextDoc = () => {
    setCurrentDocIndex((prev) => (prev === docs.length - 1 ? 0 : prev + 1));
  };

  const prevDoc = () => {
    setCurrentDocIndex((prev) => (prev === 0 ? docs.length - 1 : prev - 1));
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // --- ANTI COPY/INSPECT ---
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if ((e.ctrlKey || e.metaKey) && ['c', 'u', 's'].includes(e.key.toLowerCase())) e.preventDefault();
      if (e.key === 'F12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'i')) e.preventDefault();
    };
    const handleDragStart = (e: any) => e.preventDefault();
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  return (
    <div 
      className="min-h-screen bg-slate-50 font-inter text-slate-800 select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      <style>{styles}</style>
      
      {/* NAVBAR */}
      <nav className="fixed w-full z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight font-jakarta">Finensia.</span>
            </div>

            <div className="hidden md:flex space-x-8 text-slate-300">
              <a href="#tentang" className="hover:text-orange-500 transition">Tentang</a>
              <a href="#layanan" className="hover:text-orange-500 transition">Layanan</a>
              <a href="#kelas" className="hover:text-orange-500 transition">Kelas</a>
              <a href="#tim" className="hover:text-orange-500 transition">Tim</a>
            </div>
            
            <a 
              href={waLinkGeneral}
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden md:block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full font-medium transition shadow-lg shadow-orange-500/20"
            >
              Hubungi Kami
            </a>

            <button 
              className="md:hidden text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 px-6 py-4">
            <div className="flex flex-col space-y-4 text-slate-300">
              <a href="#tentang" onClick={closeMobileMenu} className="hover:text-orange-500 transition py-2 border-b border-slate-800">Tentang Kami</a>
              <a href="#layanan" onClick={closeMobileMenu} className="hover:text-orange-500 transition py-2 border-b border-slate-800">Layanan</a>
              <a href="#kelas" onClick={closeMobileMenu} className="hover:text-orange-500 transition py-2 border-b border-slate-800">Kelas</a>
              <a href="#tim" onClick={closeMobileMenu} className="hover:text-orange-500 transition py-2 border-b border-slate-800">Tim Praktisi</a>
              <a 
                href={waLinkGeneral}
                target="_blank" 
                rel="noopener noreferrer"
                onClick={closeMobileMenu}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-medium transition w-full mt-4 text-center inline-block"
              >
                Hubungi Kami
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-slate-900 overflow-hidden flex items-center min-h-[90vh]">
        <FallingBackground />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center mt-10 md:mt-0">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-orange-400 mb-8 text-sm md:text-base animate-fade-up">
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
            Partner Keuangan Bisnis Anda
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight animate-fade-up delay-100">
            Transformasi <span className="text-gradient">Keuangan</span><br/> Bisnis Anda.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-up delay-200">
            Solusi akuntansi dan perpajakan terpadu untuk percepatan skala bisnis Anda. Rapi, efisien, dan terstruktur.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-200">
            <a href="#layanan" className="w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-semibold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25">
              Solusi Kami <ArrowRight size={20} />
            </a>
            <a href="#kelas" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-slate-600 hover:bg-slate-800 text-white rounded-full font-semibold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
              Academy <BookOpen size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* TENTANG KAMI */}
      <section id="tentang" className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h4 className="text-orange-500 font-bold mb-2 uppercase tracking-wider text-sm">Tentang Kami</h4>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                Mitra Strategis untuk Keuangan & Pajak Bisnis Anda
              </h2>
              <div className="space-y-4 text-slate-600 text-base md:text-lg leading-relaxed">
                <p>
                  <strong>Finensia</strong> hadir sebagai layanan di bidang akuntansi dan perpajakan yang membantu individu dan pelaku usaha dalam mengelola keuangan secara lebih rapi, efisien, dan terstruktur.
                </p>
                <p>
                  Kami percaya bahwa keuangan yang tertata bukan hanya kewajiban, tetapi fondasi penting untuk pertumbuhan bisnis. Oleh karena itu, kami menghadirkan layanan yang mudah dipahami, aplikatif, dan relevan dengan kebutuhan bisnis saat ini.
                </p>
                <p>
                  Dengan pendekatan yang praktis, Finensia membantu Anda dalam pembukuan, pengelolaan administrasi pajak, hingga peningkatan pemahaman finansial secara menyeluruh.
                </p>
              </div>
            </div>
            <div className="relative order-1 lg:order-2 mb-8 lg:mb-0">
              <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-slate-800 opacity-10"></div>
                 {aboutImg ? (
                   <img src={aboutImg} alt="Tentang Kami" className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center bg-slate-200">
                      <ShieldCheck size={100} className="text-slate-400 md:w-32 md:h-32" />
                   </div>
                 )}
              </div>
              <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-orange-500 p-6 md:p-8 rounded-2xl shadow-xl text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-1">100+</h3>
                <p className="text-orange-100 text-sm md:text-base">Klien Terbantu</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LAYANAN */}
      <section id="layanan" className="py-20 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h4 className="text-orange-500 font-bold mb-2 uppercase tracking-wider text-sm">Layanan Kami</h4>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Solusi Keuangan & Pajak yang Efisien</h2>
            <p className="text-slate-600 text-base md:text-lg">
              Mulai dari pembukuan, administrasi pajak, hingga penyusunan laporan, kami menjaga kerapihan finansial bisnis Anda.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 hover-lift group cursor-default">
              <div className="w-14 h-14 bg-blue-50 text-slate-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-500">
                <BookOpen size={28} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-slate-900">Pembukuan & Jurnal</h3>
              <p className="text-slate-600 mb-6">Pencatatan transaksi keuangan secara rapi dan sesuai standar.</p>
              <div className="pt-6 border-t border-slate-100 mt-auto">
                <p className="text-sm text-slate-500 mb-1">Mulai dari</p>
                <p className="text-xl font-bold text-orange-500">Rp 2.000.000</p>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 hover-lift group cursor-default">
              <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-500">
                <FileText size={28} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-slate-900">Pelaporan SPT & Pajak</h3>
              <p className="text-slate-600 mb-6">Pelaporan pajak tepat waktu, diskusi langsung strategi pajak efisien.</p>
              <div className="pt-6 border-t border-slate-100">
                <p className="text-sm text-slate-500 mb-1">Mulai dari</p>
                <p className="text-xl font-bold text-orange-500">Rp 500.000</p>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 sm:col-span-2 md:col-span-1 hover-lift group cursor-default">
              <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors duration-500">
                <Calculator size={28} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-slate-900">Setup ERP & Sistem</h3>
              <p className="text-slate-600 mb-6">Menyusun struktur akun, merancang alur transaksi terintegrasi.</p>
              <div className="pt-6 border-t border-slate-100">
                <p className="text-sm text-slate-500 mb-1">Mulai dari</p>
                <p className="text-xl font-bold text-orange-500">Rp 1.000.000</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACADEMY */}
      <section id="kelas" className="py-20 md:py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h4 className="text-orange-500 font-bold mb-2 uppercase tracking-wider text-sm">Academy</h4>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Tingkatkan Skill Akuntansi Anda</h2>
            <p className="text-slate-400 text-base md:text-lg">Program pembelajaran dirancang sistematis, berbasis praktik nyata.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            <div className="bg-slate-800 rounded-3xl p-6 md:p-10 border border-slate-700 relative overflow-hidden hover-lift flex flex-col">
              <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
                Paling Diminati
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 pr-24">Professional Accounting</h3>
              <p className="text-slate-400 mb-6 md:mb-8 text-sm md:text-base">Program lengkap untuk siap kerja dan memahami akuntansi secara praktik.</p>
              
              <div className="mb-8">
                <p className="text-slate-500 line-through mb-1">Rp 1.200.000</p>
                <p className="text-3xl md:text-4xl font-extrabold text-orange-500">Rp 599.000</p>
              </div>

              <ul className="space-y-3 md:space-y-4 mb-8">
                {['Basic Accounting', 'Accounting Plus', 'Pajak Dasar', 'Laporan Keuangan', 'Studi kasus', 'Diskusi & mentoring'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300 text-sm md:text-base">
                    <CheckCircle2 size={18} className="text-orange-500 flex-shrink-0 md:w-5 md:h-5" /> {item}
                  </li>
                ))}
                <li className="pt-4 border-t border-slate-700 mt-4">
                  <span className="font-bold text-white block mb-2 text-sm md:text-base">Bonus:</span>
                  <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm text-orange-400">
                    <span className="bg-orange-500/10 px-3 py-1.5 rounded-full">CV Mentoring</span>
                    <span className="bg-orange-500/10 px-3 py-1.5 rounded-full">Mock Interview</span>
                  </div>
                </li>
              </ul>
              
              <a href={waLinkClass1} target="_blank" rel="noopener noreferrer" className="block text-center w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 mt-auto shadow-lg shadow-orange-500/20">
                Daftar Sekarang
              </a>
            </div>

            <div className="bg-slate-800/50 rounded-3xl p-6 md:p-10 border border-slate-700/50 transition-all flex flex-col hover-lift">
              <h3 className="text-xl md:text-2xl font-bold mb-2">Accounting Intensive</h3>
              <p className="text-slate-400 mb-6 md:mb-8 text-sm md:text-base">Belajar dari nol hingga bisa membuat laporan keuangan.</p>
              
              <div className="mb-8">
                <p className="text-slate-500 line-through mb-1">Rp 600.000</p>
                <p className="text-3xl md:text-4xl font-extrabold text-white">Rp 299.000</p>
              </div>

              <ul className="space-y-3 md:space-y-4 mb-10">
                {['Basic Accounting', 'Accounting Plus', 'Laporan Keuangan', 'Studi kasus', 'Diskusi mentor'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300 text-sm md:text-base">
                    <CheckCircle2 size={18} className="text-slate-500 flex-shrink-0 md:w-5 md:h-5" /> {item}
                  </li>
                ))}
              </ul>
              
              <a href={waLinkClass2} target="_blank" rel="noopener noreferrer" className="block text-center w-full py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 mt-auto">
                Daftar Sekarang
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* DOKUMENTASI DINAMIS */}
      {docs && docs.length > 0 && (
        <section className="py-16 md:py-20 bg-slate-100 border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between mb-10 text-center md:text-left gap-4">
              <div>
                <h4 className="text-orange-500 font-bold mb-2 uppercase tracking-wider text-sm flex items-center justify-center md:justify-start gap-2">
                  <Camera size={16} /> Dokumentasi
                </h4>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Momen & Kegiatan Kami</h2>
              </div>
              <div className="flex gap-2">
                <button onClick={prevDoc} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-orange-500 hover:text-white transition shadow-sm"><ChevronLeft size={20} /></button>
                <button onClick={nextDoc} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-orange-500 hover:text-white transition shadow-sm"><ChevronRight size={20} /></button>
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 transition-all duration-300">
                <img src={docs[currentDocIndex]?.img || "https://placehold.co/800x500/1e293b/f97316?text=Gambar+Kosong"} alt={docs[currentDocIndex]?.title} className="w-full h-56 md:h-72 object-cover bg-slate-200" draggable="false" />
                <div className="p-6 md:p-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 font-jakarta">{docs[currentDocIndex]?.title}</h3>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed">{docs[currentDocIndex]?.desc}</p>
                  <div className="flex gap-2 mt-6 justify-center">
                    {docs.map((_, idx) => (
                      <button key={idx} onClick={() => setCurrentDocIndex(idx)} className={`h-2 rounded-full transition-all ${idx === currentDocIndex ? "w-8 bg-orange-500" : "w-2 bg-slate-300 hover:bg-slate-400"}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* VIDEO PROFIL DINAMIS */}
      <section className="py-12 md:py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h4 className="text-orange-500 font-bold mb-2 uppercase tracking-wider text-sm flex items-center justify-center gap-2">
            <PlaySquare size={16} /> Profil Video
          </h4>
          <h2 className="text-2xl font-bold mb-8 font-jakarta text-slate-900">Lebih Dekat dengan Finensia</h2>
          <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-800 relative z-10">
            <iframe width="100%" height="100%" src={videoUrl} title="Video Profil Finensia" frameBorder="0" allowFullScreen className="w-full h-full"></iframe>
          </div>
        </div>
      </section>

      {/* TESTIMONI DINAMIS */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-20 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
              <h4 className="text-orange-500 font-bold mb-2 uppercase tracking-wider text-sm">Testimoni</h4>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Cerita dari Klien Kami</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {testimonials.map((testi, i) => (
                <div key={i} className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 hover-lift flex flex-col justify-between">
                  <div className="flex gap-1 text-orange-500 mb-4 md:mb-6">
                    {[...Array(5)].map((_, j) => <Star key={j} size={16} className="md:w-[18px] md:h-[18px]" fill="currentColor" />)}
                  </div>
                  <p className="text-slate-700 italic mb-6 text-base md:text-lg">"{testi.text}"</p>
                  <div>
                    <h5 className="font-bold text-slate-900">{testi.name}</h5>
                    <p className="text-sm text-slate-500">{testi.role || testi.job}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TIM PRAKTISI DINAMIS */}
      {team && team.length > 0 && (
        <section id="tim" className="py-20 md:py-24 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
              <div>
                <h4 className="text-orange-500 font-bold mb-2 uppercase tracking-wider text-sm">Tim Kami</h4>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Tim Praktisi Ahli.</h2>
                <p className="text-slate-400 text-base md:text-lg mb-6 leading-relaxed">Di balik Finensia, kami mendedikasikan keahlian untuk membantu pelaku bisnis dan calon akuntan memahami dunia keuangan tanpa rasa takut.</p>
                <div className="bg-slate-800 p-6 rounded-2xl border-l-4 border-orange-500 mb-8 md:mb-0">
                  <p className="italic text-slate-300 text-sm md:text-base">"Bagi kami, akuntansi bukan sekadar angka, melainkan sistem yang membantu bisnis bertahan dan berkembang."</p>
                </div>
              </div>
              <div className="grid gap-4">
                 {team.map((member, i) => (
                   <div key={i} className="flex items-center gap-4 md:gap-6 bg-slate-800/50 p-4 rounded-2xl border border-slate-700 hover-lift cursor-default group">
                     <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 overflow-hidden border border-slate-600 group-hover:border-orange-500 transition-colors">
                       {member.img ? <img src={member.img} className="w-full h-full object-cover" alt={member.name} /> : <Users className="text-slate-400 w-6 h-6 md:w-8 md:h-8 group-hover:text-orange-400 transition-colors" />}
                     </div>
                     <div>
                       <h4 className="font-bold text-base md:text-lg text-white">{member.name}</h4>
                       <p className="text-orange-400 text-sm md:text-base">{member.job || member.role}</p>
                     </div>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-20 md:py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Pertanyaan Umum</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <button className="w-full px-5 md:px-6 py-4 md:py-5 text-left flex justify-between items-center font-bold text-slate-800 text-sm md:text-base" onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}>
                  <span className="pr-4">{faq.q}</span>
                  {activeFAQ === index ? <ChevronUp className="text-orange-500 flex-shrink-0" /> : <ChevronDown className="text-slate-400 flex-shrink-0" />}
                </button>
                {activeFAQ === index && (
                  <div className="px-5 md:px-6 pb-4 md:pb-5 text-slate-600 border-t border-slate-100 pt-4 text-sm md:text-base">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-white" size={18} />
              </div>
              <span className="text-xl font-bold text-white tracking-tight font-jakarta">Finensia.</span>
            </div>
            <p className="max-w-sm text-sm md:text-base">Solusi akuntansi dan perpajakan terpadu untuk percepatan skala bisnis Anda.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Layanan</h4>
            <ul className="space-y-2 text-sm md:text-base">
              <li><a href="#layanan" className="hover:text-orange-500 transition">Pembukuan</a></li>
              <li><a href="#layanan" className="hover:text-orange-500 transition">Pajak</a></li>
              <li><a href="#layanan" className="hover:text-orange-500 transition">ERP Setup</a></li>
              <li><a href="#kelas" className="hover:text-orange-500 transition">Academy</a></li>
            </ul>
          </div>
          <div>
             <h4 className="text-white font-bold mb-4">Kontak</h4>
             <ul className="space-y-2 text-sm md:text-base">
              <li>Email: info@finensia.com</li>
              <li>IG: @finensia.id</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-center text-xs md:text-sm">
          &copy; 2026 Finensia. All rights reserved.
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <a href={waLinkGeneral} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#128C7E] hover:scale-110 transition-all z-50 flex items-center justify-center group" aria-label="Chat WhatsApp">
        <span className="absolute right-16 bg-white text-slate-800 text-sm font-bold px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none whitespace-nowrap">Hubungi Kami!</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c-.003 1.396.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.59 6.59 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
      </a>
    </div>
  );
}
