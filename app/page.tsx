"use client";

import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  DollarSign, 
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
  PlayCircle,
  Gift
} from 'lucide-react';

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(null);

  const waLink = "https://wa.me/6281226523207?text=Halo%20Finensia,%20saya%20ingin%20berkonsultasi.";

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* NAVBAR */}
      <nav className="fixed w-full z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">Finensia.</span>
          </div>
          <div className="hidden md:flex space-x-8 text-slate-300">
            <a href="#layanan" className="hover:text-orange-500 transition">Layanan</a>
            <a href="#kelas" className="hover:text-orange-500 transition">Kelas</a>
            <a href={waLink} className="bg-orange-500 text-white px-6 py-2 rounded-full font-bold">Hubungi Kami</a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-40 pb-20 bg-slate-900 text-white text-center px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
            Transformasi <span className="text-orange-500">Keuangan</span> Bisnis Anda.
          </h1>
          <p className="text-xl text-slate-400 mb-12">
            Solusi akuntansi dan perpajakan terpadu untuk percepatan skala bisnis Anda. Rapi, efisien, dan terstruktur.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#layanan" className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-full font-bold text-lg transition shadow-lg shadow-orange-500/20">
              Solusi Kami
            </a>
            <a href="#kelas" className="border-2 border-slate-700 hover:bg-slate-800 px-8 py-4 rounded-full font-bold text-lg transition">
              Program Belajar
            </a>
          </div>
        </div>
      </section>

      {/* LAYANAN */}
      <section id="layanan" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Layanan Unggulan</h2>
          <p className="text-slate-500">Kami membantu mengelola sisi finansial agar Anda bisa fokus membesarkan bisnis.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Pembukuan", icon: <BookOpen className="text-orange-500"/>, desc: "Pencatatan harian yang rapi dan sesuai standar akuntansi." },
            { title: "Laporan Pajak", icon: <FileText className="text-orange-500"/>, desc: "Pelaporan SPT dan diskusi strategi pajak yang efisien." },
            { title: "Sistem Akuntansi", icon: <Calculator className="text-orange-500"/>, desc: "Penyusunan sistem pencatatan otomatis untuk bisnis Anda." }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6">{item.icon}</div>
              <h3 className="text-xl font-bold mb-4">{item.title}</h3>
              <p className="text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 py-12 text-slate-500 text-center border-t border-slate-900">
        <p>© 2026 FINENSIA INDONESIA. Solusi Akuntansi Profesional.</p>
      </footer>
    </div>
  );
}
