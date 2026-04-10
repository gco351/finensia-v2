"use client";

import React, { useState } from 'react';
import { 
  Calculator, 
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
  Award,
  Clock,
  Briefcase
} from 'lucide-react';

export default function LandingPage() {
  const [activeFAQ, setActiveFAQ] = useState(null);
  const waLink = "https://wa.me/6281226523207?text=Halo%20Finensia,%20saya%20ingin%20berkonsultasi.";

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* NAVBAR */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
              <TrendingUp className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              Finensia.
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#layanan" className="font-medium hover:text-orange-500 transition">Layanan</a>
            <a href="#keunggulan" className="font-medium hover:text-orange-500 transition">Mengapa Kami</a>
            <a href={waLink} className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold hover:bg-orange-500 transition-all shadow-md">
              Free Konsultasi
            </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-orange-50 via-transparent to-transparent -z-10"></div>
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-bold mb-8 animate-bounce">
            <Award size={16} /> Partner Akuntansi Terpercaya 2026
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-[1.1]">
            Berhenti Pusing Urus <span className="text-orange-500 italic">Keuangan & Pajak.</span>
          </h1>
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Finensia membantu UKM & Perusahaan mengelola pembukuan, pelaporan pajak, hingga sistem audit dengan standar profesional.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href={waLink} className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-5 rounded-2xl font-bold text-lg transition shadow-xl shadow-orange-200 flex items-center justify-center gap-2">
              Mulai Konsultasi <ArrowRight size={20} />
            </a>
            <a href="#layanan" className="bg-white border-2 border-slate-200 hover:border-orange-500 px-10 py-5 rounded-2xl font-bold text-lg transition flex items-center justify-center">
              Lihat Layanan
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Klien Aktif", val: "500+" },
            { label: "Laporan Pajak", val: "1.2k+" },
            { label: "Tim Ahli", val: "15+" },
            { label: "Akurasi Data", val: "100%" }
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-black text-slate-900 mb-1">{s.val}</div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LAYANAN DETAIL */}
      <section id="layanan" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-4xl font-bold mb-4">Layanan Finansial Terpadu</h2>
          <div className="w-20 h-1.5 bg-orange-500 mx-auto rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { 
              title: "Pembukuan & Laporan", 
              icon: <BookOpen className="text-blue-500"/>, 
              desc: "Penyusunan laporan laba rugi, neraca, dan arus kas bulanan secara akurat.",
              features: ["Standar SAK EP", "Rekonsiliasi Bank", "Jurnal Harian"]
            },
            { 
              title: "Kepatuhan Pajak", 
              icon: <ShieldCheck className="text-orange-500"/>, 
              desc: "Perhitungan PPh 21, 23, 25, hingga PPN. Aman dari denda administrasi.",
              features: ["SPT Tahunan", "E-Faktur", "Tax Planning"]
            },
            { 
              title: "Sistem & Audit", 
              icon: <Calculator className="text-emerald-500"/>, 
              desc: "Implementasi sistem akuntansi digital dan audit internal perusahaan.",
              features: ["Cloud Accounting", "SOP Keuangan", "Stock Opname"]
            }
          ].map((item, idx) => (
            <div key={idx} className="group p-10 rounded-[40px] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:shadow-orange-200/50 transition-all duration-500">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">{item.desc}</p>
              <ul className="space-y-3">
                {item.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                    <CheckCircle2 size={16} className="text-orange-500" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-slate-900 rounded-[50px] p-12 md:p-20 relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="relative z-10 md:max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Siap Merapikan Keuangan Bisnis Anda?</h2>
            <p className="text-slate-400 text-lg mb-0 font-medium">Jangan biarkan pajak dan pembukuan menghambat pertumbuhan bisnis Anda. Konsultasikan sekarang GRATIS.</p>
          </div>
          <a href={waLink} className="relative z-10 bg-orange-500 hover:bg-orange-600 text-white px-12 py-6 rounded-2xl font-black text-xl transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-orange-500/20">
            Chat WhatsApp Sekarang
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-100 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-2 opacity-50">
              <TrendingUp className="text-slate-900" size={20} />
              <span className="text-xl font-bold">Finensia.</span>
            </div>
            <p className="text-slate-400 font-medium tracking-tight">© 2026 PT FINENSIA DIGITAL INDONESIA. Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
