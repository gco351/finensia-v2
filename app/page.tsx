import React, { useState, useEffect, useRef } from 'react';
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

  html { scroll-behavior: smooth; scroll-padding-top: 5rem; }
  .font-inter { font-family: 'Inter', sans-serif; }
  h1, h2, h3, h4, h5, h6, .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }

  /* Icon Fall Animation */
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

  /* Scroll Reveal Effect */
  .reveal-on-scroll {
    opacity: 0;
    transform: translateY(40px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .reveal-on-scroll.animate-reveal {
    opacity: 1;
    transform: translateY(0);
  }
  .delay-100 { transition-delay: 100ms; }
  .delay-200 { transition-delay: 200ms; }
  .delay-300 { transition-delay: 300ms; }

  /* Hover Lift & Glow */
  .hover-lift { 
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
  }
  .hover-lift:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px -15px rgba(249, 115, 22, 0.15);
    border-color: rgba(249, 115, 22, 0.3);
  }

  /* Glowing Blobs */
  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    z-index: 0;
    opacity: 0.4;
    animation: floatBlob 10s infinite alternate ease-in-out;
  }
  @keyframes floatBlob {
    0% { transform: translate(0, 0) scale(1); }
    100% { transform: translate(30px, -40px) scale(1.1); }
  }

  /* Text Gradients */
  .text-gradient {
    background: linear-gradient(135deg, #f97316, #fb923c, #f59e0b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  /* Smooth Fade for Images */
  .fade-image {
    animation: fadeIn 0.5s ease-in-out forwards;
  }
  @keyframes fadeIn {
    from { opacity: 0; filter: blur(4px); }
    to { opacity: 1; filter: blur(0); }
  }
`;

// --- DATA STATIS AWAL ---
const waNumber = "6281226523207"; 
const waLinkGeneral = `https://wa.me/${waNumber}?text=Halo%20Finensia,%20saya%20ingin%20berkonsultasi.`;

const faqs = [
  { q: "Apakah Finensia cocok untuk pemula?", a: "Ya, layanan kami dirancang untuk pemula hingga profesional." },
  { q: "Apakah bisa untuk UMKM kecil?", a: "Bisa, justru UMKM adalah fokus utama kami." },
  { q: "Apakah laporan keuangan sesuai standar?", a: "Ya, sesuai prinsip akuntansi yang berlaku umum di Indonesia." },
  { q: "Apakah bisa konsultasi dulu?", a: "Tentu bisa, Anda dapat berdiskusi terlebih dahulu sebelum menggunakan layanan kami." },
  { q: "Apakah data saya aman?", a: "Sangat aman. Kami menjaga kerahasiaan data klien secara profesional." }
];

const fallbackTestimonials = [
  { name: "Rina Kartika", text: "Pembukuan usaha saya jadi jauh lebih rapi dan terorganisir.", role: "Business Owner" },
  { name: "Ahmad Fauzan", text: "Sekarang saya lebih paham akuntansi dan sudah dapat kerja.", role: "Alumni Kelas" },
  { name: "Dwi Santoso", text: "Timnya profesional dan sangat membantu kelancaran bisnis kami.", role: "CEO" }
];

const fallbackDocs = [
  {
    img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    title: "Pelatihan Akuntansi Batch 1",
    desc: "Suasana kelas yang interaktif, fokus pada bedah kasus dan penyusunan laporan keuangan secara langsung."
  },
  {
    img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    title: "Sesi Mentoring & Setup ERP",
    desc: "Pendampingan intensif bersama pemilik UMKM untuk merancang sistem pencatatan yang efisien."
  },
  {
    img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    title: "Webinar Tax Planning",
    desc: "Berbagi insight mengenai strategi optimalisasi pajak yang aman dan sesuai regulasi bersama pelaku usaha."
  }
];

const fallbackTeam = [
  { name: "Adhwa Neisya", role: "Accounting & Tax" },
  { name: "Chelsea Hamid", role: "Tax Specialist" },
  { name: "Lucas Abraham", role: "Accounting Specialist" }
];

// --- KOMPONEN BACKGROUND ANIMASI ---
const FallingBackground = () => {
  const [icons, setIcons] = useState([]);

  useEffect(() => {
    const iconTypes = ['dollar', 'calc', 'file', 'chart'];
    const newIcons = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      type: iconTypes[Math.floor(Math.random() * iconTypes.length)],
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 8 + 7}s`, 
      animationDelay: `${Math.random() * 5}s`,
      size: Math.random() * 15 + 15, 
    }));
    setIcons(newIcons);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-100">
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
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const [currentDocIndex, setCurrentDocIndex] = useState(0); 
  const [isScrolled, setIsScrolled] = useState(false);
  const [imageKey, setImageKey] = useState(0); // Untuk re-trigger animasi fade

  // --- STATE DATA ---
  const [testimonials] = useState(fallbackTestimonials);
  const [docs] = useState(fallbackDocs);
  const [team] = useState(fallbackTeam);

  // --- SCROLL OBSERVER EFFECT ---
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-reveal');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const nextDoc = () => {
    if(docs.length > 0) {
      setCurrentDocIndex((prev) => (prev === docs.length - 1 ? 0 : prev + 1));
      setImageKey(prev => prev + 1);
    }
  };

  const prevDoc = () => {
    if(docs.length > 0) {
      setCurrentDocIndex((prev) => (prev === 0 ? docs.length - 1 : prev - 1));
      setImageKey(prev => prev + 1);
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 font-inter text-slate-800 select-none overflow-x-hidden">
      <style>{styles}</style>
      
      {/* NAVBAR */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0b1120]/90 backdrop-blur-lg border-b border-slate-800/50 py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-16 flex items-center justify-between transition-all">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-9 h-9 bg-gradient-to-tr from-[#f97316] to-[#fb923c] rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                <TrendingUp className="text-white" size={20} />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight font-jakarta">Finensia.</span>
            </div>

            <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
              <a href="#tentang" className="hover:text-white transition hover:-translate-y-0.5 transform inline-block">Tentang</a>
              <a href="#layanan" className="hover:text-white transition hover:-translate-y-0.5 transform inline-block">Layanan</a>
              <a href="#kelas" className="hover:text-white transition hover:-translate-y-0.5 transform inline-block">Kelas</a>
              <a href="#tim" className="hover:text-white transition hover:-translate-y-0.5 transform inline-block">Tim</a>
            </div>
            
            <a 
              href={waLinkGeneral}
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden md:block bg-[#f97316] hover:bg-[#ea580c] text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all hover:shadow-[0_0_15px_rgba(249,115,22,0.5)] hover:scale-105"
            >
              Hubungi Kami
            </a>

            <button 
              className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-[#0b1120]/95 backdrop-blur-xl border-b border-slate-800 transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col space-y-4 text-slate-300 px-6 py-4">
            <a href="#tentang" onClick={closeMobileMenu} className="hover:text-[#f97316] transition py-2 border-b border-slate-800">Tentang Kami</a>
            <a href="#layanan" onClick={closeMobileMenu} className="hover:text-[#f97316] transition py-2 border-b border-slate-800">Layanan</a>
            <a href="#kelas" onClick={closeMobileMenu} className="hover:text-[#f97316] transition py-2 border-b border-slate-800">Kelas</a>
            <a href="#tim" onClick={closeMobileMenu} className="hover:text-[#f97316] transition py-2 border-b border-slate-800">Tim Praktisi</a>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-[#0b1120] overflow-hidden flex items-center min-h-[90vh]">
        <FallingBackground />
        
        {/* Animated Background Blobs */}
        <div className="blob bg-orange-600 w-96 h-96 top-0 left-[-10%] mix-blend-screen"></div>
        <div className="blob bg-blue-600 w-80 h-80 bottom-0 right-[-5%] mix-blend-screen animation-delay-2000"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center mt-10 md:mt-0">
          <div className="reveal-on-scroll inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/40 border border-slate-700/50 text-[#f97316] mb-8 text-xs md:text-sm font-medium backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-[#f97316] shadow-[0_0_8px_#f97316] animate-pulse"></span>
            Partner Keuangan Bisnis Anda
          </div>
          
          <h1 className="reveal-on-scroll delay-100 text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 leading-[1.1] font-jakarta drop-shadow-lg">
            Transformasi <span className="text-gradient drop-shadow-none">Keuangan</span><br/> Bisnis Anda.
          </h1>
          
          <p className="reveal-on-scroll delay-200 text-base md:text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Solusi akuntansi dan perpajakan terpadu untuk percepatan skala bisnis Anda. Rapi, efisien, dan terstruktur.
          </p>
          
          <div className="reveal-on-scroll delay-300 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#layanan" className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white rounded-full font-semibold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.4)] text-sm group">
              Solusi Kami <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#kelas" className="w-full sm:w-auto px-8 py-3.5 bg-white/5 backdrop-blur-md border border-slate-600 hover:border-slate-400 hover:bg-white/10 text-white rounded-full font-semibold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm">
              Academy <BookOpen size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* 2. TENTANG KAMI */}
      <section id="tentang" className="py-20 md:py-28 bg-white relative overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 rounded-l-full opacity-50 -z-10 transform translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="order-2 lg:order-1 reveal-on-scroll">
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="h-px w-8 bg-[#f97316]"></span>
                <h4 className="text-[#f97316] font-bold uppercase tracking-wider text-xs">TENTANG KAMI</h4>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-[1.2] font-jakarta">
                Mitra Strategis untuk Keuangan & Pajak Bisnis Anda
              </h2>
              <div className="space-y-4 text-slate-600 text-sm md:text-base leading-relaxed">
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
            
            <div className="relative order-1 lg:order-2 mb-8 lg:mb-0 max-w-md mx-auto lg:mx-0 lg:ml-auto reveal-on-scroll delay-200">
              <div className="aspect-square bg-[#e2e8f0] rounded-[2rem] overflow-hidden relative flex items-center justify-center border-[6px] border-white shadow-2xl shadow-slate-200 group">
                 <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Tim Finensia" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-[#f97316] to-[#ea580c] p-6 rounded-2xl shadow-xl text-white border-[6px] border-white transform hover:-translate-y-2 transition-transform duration-300">
                <h3 className="text-2xl font-bold mb-1 font-jakarta">100+</h3>
                <p className="text-white/90 text-xs font-medium">Klien Terbantu</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LAYANAN */}
      <section id="layanan" className="py-20 md:py-28 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 reveal-on-scroll">
            <div className="inline-flex items-center gap-2 mb-4 justify-center w-full">
               <span className="h-px w-6 bg-[#f97316]"></span>
               <h4 className="text-[#f97316] font-bold uppercase tracking-wider text-xs">LAYANAN KAMI</h4>
               <span className="h-px w-6 bg-[#f97316]"></span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 font-jakarta">Solusi Keuangan & Pajak yang Efisien</h2>
            <p className="text-slate-500 text-sm md:text-base">
              Mulai dari pembukuan, administrasi pajak, hingga penyusunan laporan, kami menjaga kerapihan finansial bisnis Anda.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover-lift group cursor-default flex flex-col reveal-on-scroll relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 font-jakarta group-hover:text-blue-600 transition-colors">Pembukuan & Pelaporan Keuangan</h3>
              <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                Pencatatan transaksi keuangan secara rapi dan sesuai standar akuntansi.
              </p>
              <div className="pt-6 border-t border-slate-100 mt-auto">
                <p className="text-xs text-slate-400 mb-1 font-medium">Mulai dari</p>
                <p className="text-lg font-extrabold text-slate-900">Rp 2.000.000</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover-lift group cursor-default flex flex-col reveal-on-scroll delay-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-[#f97316] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="w-12 h-12 bg-orange-50 text-[#f97316] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#f97316] group-hover:text-white transition-colors duration-300 shadow-sm">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 font-jakarta group-hover:text-[#f97316] transition-colors">Pelaporan SPT, Konsultasi & Tax Planning</h3>
              <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                Pelaporan pajak tepat waktu, diskusi langsung untuk strategi pajak yang efisien.
              </p>
              <div className="pt-6 border-t border-slate-100 mt-auto">
                <p className="text-xs text-slate-400 mb-1 font-medium">Mulai dari</p>
                <p className="text-lg font-extrabold text-[#f97316]">Rp 500.000</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 sm:col-span-2 md:col-span-1 hover-lift group cursor-default flex flex-col reveal-on-scroll delay-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-700 to-slate-900 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="w-12 h-12 bg-slate-100 text-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-slate-800 group-hover:text-white transition-colors duration-300 shadow-sm">
                <Calculator size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 font-jakarta group-hover:text-slate-800 transition-colors">Setup ERP & Sistem Keuangan</h3>
              <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                Menyusun struktur akun, merancang alur transaksi dan SOP terintegrasi, serta membangun sistem.
              </p>
              <div className="pt-6 border-t border-slate-100 mt-auto">
                <p className="text-xs text-slate-400 mb-1 font-medium">Mulai dari</p>
                <p className="text-lg font-extrabold text-slate-900">Rp 1.000.000</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ACADEMY */}
      <section id="kelas" className="py-20 md:py-28 bg-[#0b1120] text-white relative overflow-hidden">
        {/* Animated Background Blob */}
        <div className="blob bg-[#f97316] w-[500px] h-[500px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none mix-blend-screen"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 reveal-on-scroll">
            <h4 className="text-[#f97316] font-bold mb-3 uppercase tracking-wider text-xs">ACADEMY</h4>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 font-jakarta">Tingkatkan Skill Akuntansi Anda</h2>
            <p className="text-slate-400 text-sm md:text-base">
              Program pembelajaran dirancang sistematis, berbasis praktik nyata, dan mudah dipahami untuk kebutuhan kerja maupun bisnis.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {/* Card 1 */}
            <div className="bg-[#151f32]/80 backdrop-blur-md rounded-[2rem] p-8 md:p-10 border border-[#f97316]/30 relative flex flex-col hover:-translate-y-2 transition-transform duration-300 shadow-[0_0_30px_rgba(249,115,22,0.1)] reveal-on-scroll">
              <div className="absolute top-0 right-6 bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white text-[10px] font-bold px-4 py-1.5 rounded-b-lg uppercase tracking-wider shadow-md">
                PALING DIMINATI
              </div>
              <h3 className="text-2xl font-bold mb-2 font-jakarta mt-2 text-white">Professional Accounting</h3>
              <p className="text-slate-400 mb-8 text-sm leading-relaxed">Program lengkap untuk siap kerja dan memahami akuntansi secara praktik.</p>
              
              <div className="mb-8 border-b border-slate-700/50 pb-6">
                <p className="text-slate-500 line-through text-sm mb-1 decoration-red-500/50">Rp 1.200.000</p>
                <p className="text-4xl font-extrabold text-[#f97316] font-jakarta">Rp 599.000</p>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {['Basic Accounting', 'Accounting Plus', 'Pajak Dasar', 'Laporan Keuangan', 'Studi kasus', 'Diskusi & mentoring'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                    <CheckCircle2 size={18} className="text-[#f97316] flex-shrink-0" /> {item}
                  </li>
                ))}
                <li className="pt-6">
                  <span className="font-bold text-white block mb-3 text-sm">Bonus:</span>
                  <div className="flex flex-wrap gap-2 text-xs text-[#f97316] font-medium">
                    <span className="bg-[#f97316]/10 border border-[#f97316]/20 px-3 py-1.5 rounded-full">CV Mentoring</span>
                    <span className="bg-[#f97316]/10 border border-[#f97316]/20 px-3 py-1.5 rounded-full">Mock Interview</span>
                  </div>
                </li>
              </ul>
              
              <button className="w-full py-4 bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:opacity-90 text-white rounded-xl font-bold transition-all text-sm shadow-lg shadow-orange-500/25">
                Daftar Sekarang
              </button>
            </div>

            {/* Card 2 */}
            <div className="bg-[#151f32]/40 backdrop-blur-sm rounded-[2rem] p-8 md:p-10 border border-slate-800 flex flex-col hover:-translate-y-2 transition-transform duration-300 reveal-on-scroll delay-100 group">
              <h3 className="text-2xl font-bold mb-2 font-jakarta mt-2 text-white">Accounting Intensive</h3>
              <p className="text-slate-400 mb-8 text-sm leading-relaxed">Belajar dari nol hingga bisa membuat laporan keuangan.</p>
              
              <div className="mb-8 border-b border-slate-800 pb-6">
                <p className="text-slate-500 line-through text-sm mb-1">Rp 600.000</p>
                <p className="text-4xl font-extrabold text-white font-jakarta">Rp 299.000</p>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {['Basic Accounting', 'Accounting Plus', 'Laporan Keuangan', 'Studi kasus', 'Diskusi mentor'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                    <CheckCircle2 size={18} className="text-slate-600 flex-shrink-0 group-hover:text-slate-400 transition-colors" /> {item}
                  </li>
                ))}
              </ul>
              
              <button className="w-full py-4 bg-transparent border border-slate-700 hover:border-slate-500 hover:bg-white/5 text-white rounded-xl font-bold transition-all text-sm">
                Daftar Sekarang
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DOKUMENTASI */}
      <section className="py-20 md:py-28 bg-[#f8fafc]">
        <div className="max-w-4xl mx-auto px-6 reveal-on-scroll">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h4 className="text-[#f97316] font-bold mb-3 uppercase tracking-wider text-xs flex items-center justify-center md:justify-start gap-2">
                <Camera size={14} /> DOKUMENTASI
              </h4>
              <h2 className="text-3xl font-extrabold text-slate-900 font-jakarta">Momen & Kegiatan Kami</h2>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={prevDoc}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-white hover:bg-[#f97316] hover:border-[#f97316] shadow-sm transition-all duration-300"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextDoc}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-white hover:bg-[#f97316] hover:border-[#f97316] shadow-sm transition-all duration-300"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 md:p-10 transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {/* Gambar 1:1 Kecil dengan Efek Transisi */}
              <div className="w-48 h-48 md:w-56 md:h-56 flex-shrink-0 rounded-[1.5rem] overflow-hidden shadow-lg border-4 border-slate-50 bg-slate-100 relative group">
                <img 
                  key={imageKey} // Force re-render for fade animation
                  src={docs[currentDocIndex]?.img} 
                  alt={docs[currentDocIndex]?.title} 
                  className="w-full h-full object-cover fade-image group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[1.5rem]"></div>
              </div>
              
              {/* Deskripsi */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 font-jakarta">
                  {docs[currentDocIndex]?.title}
                </h3>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-8">
                  {docs[currentDocIndex]?.desc}
                </p>
                
                {/* Indikator Slider (Titik-titik) */}
                <div className="flex gap-2 justify-center md:justify-start">
                  {docs.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentDocIndex(idx);
                        setImageKey(prev => prev + 1);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentDocIndex ? "w-8 bg-[#f97316]" : "w-2 bg-slate-200 hover:bg-slate-300"
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PROFIL VIDEO */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center reveal-on-scroll">
          <h4 className="text-[#f97316] font-bold mb-3 uppercase tracking-wider text-xs flex items-center justify-center gap-2">
            <PlaySquare size={14} /> PROFIL VIDEO
          </h4>
          <h2 className="text-3xl font-extrabold mb-10 font-jakarta text-slate-900">Lebih Dekat dengan Finensia</h2>
          
          <div className="aspect-video w-full rounded-[2rem] overflow-hidden bg-slate-900 shadow-2xl relative border-[6px] border-slate-50 group">
             <div className="absolute inset-0 bg-[#f97316] opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"></div>
             <iframe 
               width="100%" 
               height="100%" 
               src="https://www.youtube.com/embed/EJozdWEAdus?rel=0" 
               title="Video Profil Finensia" 
               frameBorder="0" 
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
               allowFullScreen
               className="w-full h-full absolute inset-0 rounded-[1.5rem]"
             ></iframe>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONI */}
      <section className="py-20 md:py-28 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 reveal-on-scroll">
            <h4 className="text-[#f97316] font-bold mb-3 uppercase tracking-wider text-xs">TESTIMONI</h4>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 font-jakarta">Cerita dari Klien Kami</h2>
            <p className="text-slate-500 text-sm md:text-base">
              Kepercayaan klien adalah prioritas kami. Finensia telah membantu berbagai pelaku usaha merapikan keuangannya.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testi, i) => (
              <div key={i} className={`bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between hover-lift reveal-on-scroll delay-${(i % 3) * 100}`}>
                <div>
                  <div className="flex gap-1 text-[#f97316] mb-6">
                    {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-slate-600 italic mb-8 text-sm leading-relaxed relative">
                    <span className="text-4xl text-slate-200 absolute -top-4 -left-2 font-serif">"</span>
                    <span className="relative z-10">{testi.text}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold font-jakarta uppercase text-sm">
                    {testi.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 font-jakarta text-sm">{testi.name}</h5>
                    <p className="text-xs text-slate-500">{testi.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. TIM PRAKTISI */}
      <section id="tim" className="py-20 md:py-28 bg-[#0b1120] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f97316]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="reveal-on-scroll">
              <h4 className="text-[#f97316] font-bold mb-3 uppercase tracking-wider text-xs">TIM KAMI</h4>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 font-jakarta">Tim Praktisi Ahli.</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Di balik Finensia, kami mendedikasikan keahlian untuk membantu pelaku bisnis dan calon akuntan memahami dunia keuangan tanpa rasa takut.
              </p>
              <div className="bg-[#151f32]/80 backdrop-blur-sm p-6 rounded-2xl border-l-4 border-[#f97316] shadow-lg">
                <p className="italic text-slate-300 text-sm leading-relaxed">
                  "Bagi kami, akuntansi bukan sekadar angka, melainkan sistem yang membantu bisnis bertahan dan berkembang."
                </p>
              </div>
            </div>
            
            <div className="grid gap-4">
               {team.map((member, i) => (
                 <div key={i} className={`flex items-center gap-5 bg-[#151f32]/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-800/50 hover:border-[#f97316]/50 hover:bg-[#151f32] transition-all duration-300 group reveal-on-scroll delay-${(i%3)*100} cursor-default hover:-translate-y-1 shadow-md hover:shadow-orange-900/20`}>
                   <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-700 text-slate-400 group-hover:bg-[#f97316]/10 group-hover:text-[#f97316] transition-colors">
                     <Users size={20} />
                   </div>
                   <div>
                     <h4 className="font-bold text-sm md:text-base text-white font-jakarta group-hover:text-[#f97316] transition-colors">{member.name}</h4>
                     <p className="text-slate-400 text-xs md:text-sm mt-1">{member.role}</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ & FOOTER */}
      <section className="py-20 md:py-28 bg-[#f8fafc]">
        <div className="max-w-3xl mx-auto px-6 reveal-on-scroll">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 font-jakarta">Pertanyaan Umum</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${activeFAQ === index ? 'border-[#f97316]/30 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <button 
                  className="w-full px-6 py-5 text-left flex justify-between items-center font-bold text-slate-800 text-sm outline-none"
                  onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                >
                  <span className={activeFAQ === index ? 'text-[#f97316]' : ''}>{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${activeFAQ === index ? 'bg-[#f97316]/10 text-[#f97316]' : 'bg-slate-50 text-slate-400'}`}>
                    <ChevronDown className={`transition-transform duration-300 ${activeFAQ === index ? "rotate-180" : ""}`} size={18} />
                  </div>
                </button>
                <div 
                  className={`px-6 text-slate-500 text-sm leading-relaxed transition-all duration-300 overflow-hidden ${activeFAQ === index ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0b1120] text-slate-400 py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6 opacity-90 hover:opacity-100 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-lg flex items-center justify-center shadow-lg">
                <TrendingUp className="text-white" size={16} />
              </div>
              <span className="text-xl font-bold text-white tracking-tight font-jakarta">Finensia.</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">Solusi akuntansi dan perpajakan terpadu untuk percepatan skala bisnis Anda. Rapi, efisien, dan terstruktur.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-5 text-sm font-jakarta tracking-wide">Layanan</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#layanan" className="hover:text-[#f97316] transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-600"></span> Pembukuan</a></li>
              <li><a href="#layanan" className="hover:text-[#f97316] transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-600"></span> Pajak</a></li>
              <li><a href="#layanan" className="hover:text-[#f97316] transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-600"></span> ERP Setup</a></li>
              <li><a href="#kelas" className="hover:text-[#f97316] transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-600"></span> Academy</a></li>
            </ul>
          </div>
          <div>
             <h4 className="text-white font-bold mb-5 text-sm font-jakarta tracking-wide">Kontak</h4>
             <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-600"></span> Email: info@finensia.com</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-600"></span> IG: @finensia.id</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800/50 text-center text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Finensia. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href={waLinkGeneral}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-[0_8px_25px_0_rgba(37,211,102,0.4)] hover:scale-110 hover:-translate-y-1 transition-all duration-300 z-50 flex items-center justify-center group"
      >
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16" className="relative z-10">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c-.003 1.396.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.59 6.59 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
        </svg>
      </a>
    </div>
  );
}
