"use client";

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Image as ImageIcon, Video, MessageSquare, Camera, Users, LogOut,
  Plus, Trash2, Save, RefreshCw, AlertCircle, UploadCloud,
  Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2
} from 'lucide-react';

// ✅ Tambahin tipe biar TS aman
type Testimoni = {
  id?: number;
  name?: string;
  role?: string;
  text?: string;
  nama?: string;
  job?: string;
  testimoni?: string;
};

export default function AdminDashboard() {

  // Auth
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState<string>("");

  // Data
  const [testimoni, setTestimoni] = useState<Testimoni[]>([]);

  // --- SIMPLIFIED (biar fokus fix bug utama) ---
  useEffect(() => {
    setTestimoni([]);
  }, []);

  return (
    <div className="p-6">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-5">Klien</th>
                <th className="p-5">Testimoni</th>
                <th className="p-5 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {testimoni.map((item, i) => (
                <tr key={i}>
                  <td className="p-5">
                    <p className="font-bold">{item.name || item.nama}</p>
                    <p className="text-xs text-orange-500">{item.role || item.job}</p>
                  </td>

                  <td className="p-5 italic">
                    "{item.text || item.testimoni}"
                  </td>

                  <td className="p-5 text-center">
                    <button className="text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}

              {/* ✅ FIX DI SINI */}
              {testimoni.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-400 italic">
                    Belum ada data testimoni.
                  </td>
                </tr>
              )}

            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
