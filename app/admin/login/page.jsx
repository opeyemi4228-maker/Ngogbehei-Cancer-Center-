"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { setAdminSession, checkAdminSession } from "@/lib/adminStorage";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (checkAdminSession()) {
      router.replace("/admin");
    } else {
      setReady(true);
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("Enter your username and password.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.trim(), password }),
    });
    if (res.ok) {
      setAdminSession();
      router.replace("/admin");
    } else {
      setLoading(false);
      setError("Incorrect credentials.");
    }
  };

  if (!ready) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 font-montserrat"
      style={{ background: "#F5F4F0" }}>

      <div className="w-full max-w-[380px]">

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-[6px] flex items-center justify-center"
            style={{ background: "#0D1F35" }}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 2L4 5v5c0 3.55 2.58 6.87 6 7.68C13.42 16.87 16 13.55 16 10V5l-6-3z" fill="white" />
            </svg>
          </div>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#0D1F35", letterSpacing: "-0.025em" }}>
            Ngogbehei Cancer Center
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl p-8" style={{ border: "1px solid #E8E7E3" }}>
          <h1 className="font-black text-[1.6rem] text-gray-900 mb-1" style={{ letterSpacing: "-0.04em" }}>
            Sign in
          </h1>
          <p className="text-[13px] font-medium text-gray-400 mb-7">
            Admin portal — authorised access only.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="username"
                className="block text-[11px] font-black tracking-[0.1em] uppercase text-gray-500 mb-1.5">
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={e => { setUsername(e.target.value); setError(""); }}
                placeholder="admin"
                style={{ borderColor: error ? "#FCA5A5" : "#E8E7E3" }}
                className="w-full px-3.5 py-2.5 border rounded-[7px] text-[13.5px] font-semibold text-gray-800 placeholder-gray-300 outline-none transition-all focus:border-[#0D1F35] focus:ring-2 focus:ring-[#0D1F35]/10"
              />
            </div>

            <div>
              <label htmlFor="password"
                className="block text-[11px] font-black tracking-[0.1em] uppercase text-gray-500 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  style={{ borderColor: error ? "#FCA5A5" : "#E8E7E3" }}
                  className="w-full px-3.5 py-2.5 pr-10 border rounded-[7px] text-[13.5px] font-semibold text-gray-800 placeholder-gray-300 outline-none transition-all focus:border-[#0D1F35] focus:ring-2 focus:ring-[#0D1F35]/10"
                />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-[12.5px] font-semibold text-red-500 px-0.5">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-[7px] text-white text-[14px] font-black transition-all focus:outline-none focus:ring-2 focus:ring-[#0D1F35]/30 disabled:opacity-60 mt-2"
              style={{ background: "#0D1F35", letterSpacing: "-0.01em" }}>
              {loading ? "Signing in…" : "Sign in →"}
            </button>
          </form>
        </div>

        <p className="text-center text-[11.5px] font-medium text-gray-400 mt-5">
          © {new Date().getFullYear()} Ngogbehei Cancer Center
        </p>
      </div>
    </div>
  );
}
