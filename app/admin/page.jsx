"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { RefreshCw, ArrowUpRight } from "lucide-react";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function timeAgo(iso) {
  const s = (Date.now() - new Date(iso)) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function toUSD(amount, currency) {
  const rates = { USD: 1, NGN: 1 / 1600, GBP: 1.27, EUR: 1.09 };
  return amount * (rates[currency] || 1);
}

const TYPE_DOT = { contact: "#3B82F6", volunteer: "#059669", donation: "#F59E0B", newsletter: "#8B5CF6" };
const TYPE_LABEL = { contact: "Contact", volunteer: "Volunteer", donation: "Donation", newsletter: "Subscriber" };

function Sk({ w = "80px", h = "14px" }) {
  return <div className="animate-pulse rounded" style={{ width: w, height: h, background: "#EDEDEB" }} />;
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [c, v, d, n] = await Promise.all([
      fetch("/api/admin/contacts").then(r => r.json()).catch(() => []),
      fetch("/api/admin/volunteers").then(r => r.json()).catch(() => []),
      fetch("/api/admin/donations").then(r => r.json()).catch(() => []),
      fetch("/api/admin/newsletter").then(r => r.json()).catch(() => []),
    ]);
    setData({ contacts: c, volunteers: v, donations: d, newsletter: n });
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const stats = useMemo(() => {
    if (!data) return null;
    const today = new Date().toDateString();
    const newToday = [
      ...data.contacts, ...data.volunteers, ...data.donations, ...data.newsletter,
    ].filter(e => new Date(e.createdAt).toDateString() === today).length;
    const totalUSD = data.donations.reduce((s, d) => s + toUSD(d.amount, d.currency), 0);
    return {
      contacts: data.contacts.length,
      volunteers: data.volunteers.length,
      donations: data.donations.length,
      newsletter: data.newsletter.length,
      newToday,
      totalUSD,
    };
  }, [data]);

  const recent = useMemo(() => {
    if (!data) return [];
    return [
      ...data.contacts.map(e => ({ ...e, _type: "contact" })),
      ...data.volunteers.map(e => ({ ...e, _type: "volunteer" })),
      ...data.donations.map(e => ({ ...e, _type: "donation" })),
      ...data.newsletter.map(e => ({ ...e, _type: "newsletter" })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);
  }, [data]);

  const STAT_TILES = [
    { label: "Contacts",    key: "contacts",   href: "/admin/contacts" },
    { label: "Volunteers",  key: "volunteers", href: "/admin/volunteers" },
    { label: "Donations",   key: "donations",  href: "/admin/donations" },
    { label: "Subscribers", key: "newsletter", href: "/admin/newsletter" },
  ];

  return (
    <div className="px-6 sm:px-8 py-8" style={{ maxWidth: 1000, margin: "0 auto" }}>

      {/* Page header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="font-black text-[1.9rem] text-[#0D1F35] leading-none mb-2"
            style={{ letterSpacing: "-0.045em" }}>
            {greeting()}.
          </h1>
          <p className="text-[13px] font-medium" style={{ color: "#999" }}>
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long", day: "numeric", month: "long", year: "numeric",
            })}
          </p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-[7px] text-[12.5px] font-semibold transition-all focus:outline-none hover:bg-white"
          style={{ color: "#888", border: "1px solid #E8E7E3" }}>
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stat tiles — flush grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 mb-8 rounded-xl overflow-hidden"
        style={{ border: "1px solid #E8E7E3", gap: 1, background: "#E8E7E3" }}>
        {STAT_TILES.map(({ label, key, href }) => (
          <Link key={key} href={href}
            className="group bg-white px-5 pt-5 pb-4 flex flex-col gap-3 transition-colors hover:bg-[#FDFCFA] focus:outline-none">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black tracking-[0.14em] uppercase"
                style={{ color: "#AAAAAA" }}>
                {label}
              </span>
              <ArrowUpRight size={11}
                className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {loading || !stats ? (
              <Sk w="48px" h="38px" />
            ) : (
              <span className="font-black leading-none" style={{ fontSize: "2.4rem", color: "#0D1F35", letterSpacing: "-0.05em" }}>
                {stats[key].toLocaleString()}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Bottom two-col */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5">

        {/* Activity feed */}
        <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #E8E7E3" }}>
          <div className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: "1px solid #E8E7E3" }}>
            <h2 className="font-black text-[13.5px] text-[#0D1F35]" style={{ letterSpacing: "-0.02em" }}>
              Recent activity
            </h2>
            {!loading && (
              <span className="text-[11.5px] font-medium" style={{ color: "#AAAAAA" }}>
                {recent.length} entries
              </span>
            )}
          </div>

          {loading ? (
            <div>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-3.5"
                  style={{ borderBottom: "1px solid #F5F4F0" }}>
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#EDEDEB" }} />
                  <Sk w="130px" />
                  <div className="flex-1" />
                  <Sk w="50px" />
                </div>
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="py-16 text-center px-6">
              <p className="text-[13px] font-semibold" style={{ color: "#BBBBBB" }}>No activity yet</p>
              <p className="text-[12px] mt-1" style={{ color: "#CCCCCC" }}>
                Form submissions will appear here.
              </p>
            </div>
          ) : (
            <div>
              {recent.map(item => (
                <div key={item.id}
                  className="flex items-center gap-3 px-6 py-3 hover:bg-[#FDFCFA] transition-colors"
                  style={{ borderBottom: "1px solid #F5F4F0" }}>
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: TYPE_DOT[item._type] }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-gray-800 truncate">
                      {item.name || item.email}
                    </p>
                    <p className="text-[11.5px]" style={{ color: "#AAAAAA" }}>
                      {TYPE_LABEL[item._type]}
                    </p>
                  </div>
                  <span className="text-[11.5px] tabular-nums flex-shrink-0" style={{ color: "#BBBBBB" }}>
                    {timeAgo(item.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary panel */}
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #E8E7E3" }}>
            <div className="px-5 py-4" style={{ borderBottom: "1px solid #E8E7E3" }}>
              <h2 className="font-black text-[13.5px] text-[#0D1F35]" style={{ letterSpacing: "-0.02em" }}>
                All sections
              </h2>
            </div>
            <div>
              {[
                { label: "Contacts",    href: "/admin/contacts",   key: "contacts" },
                { label: "Volunteers",  href: "/admin/volunteers", key: "volunteers" },
                { label: "Donations",   href: "/admin/donations",  key: "donations" },
                { label: "Subscribers", href: "/admin/newsletter", key: "newsletter" },
              ].map(({ label, href, key }) => (
                <Link key={key} href={href}
                  className="group flex items-center justify-between px-5 py-3 transition-colors hover:bg-[#FDFCFA] focus:outline-none"
                  style={{ borderBottom: "1px solid #F5F4F0" }}>
                  <span className="text-[13px] font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                    {label}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {stats && (
                      <span className="text-[12px] font-bold tabular-nums" style={{ color: "#BBBBBB" }}>
                        {stats[key]}
                      </span>
                    )}
                    <ArrowUpRight size={11} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                  </div>
                </Link>
              ))}
              <a href="/" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-5 py-3.5 text-[12.5px] font-medium transition-colors hover:text-gray-700 focus:outline-none"
                style={{ color: "#AAAAAA" }}>
                <ArrowUpRight size={11} />
                View live website
              </a>
            </div>
          </div>

          {!loading && stats && stats.newToday > 0 && (
            <div className="rounded-xl px-5 py-4" style={{ background: "#0D1F35" }}>
              <p className="text-[10px] font-black tracking-[0.15em] uppercase mb-1"
                style={{ color: "rgba(255,255,255,0.4)" }}>New today</p>
              <p className="font-black text-white text-[2rem] leading-none"
                style={{ letterSpacing: "-0.05em" }}>
                {stats.newToday}
              </p>
              <p className="text-[12px] mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                {stats.newToday === 1 ? "submission" : "submissions"} received today
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
