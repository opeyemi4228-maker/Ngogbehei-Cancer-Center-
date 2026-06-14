"use client";

import { useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, Download, ChevronDown, ChevronUp, Trash2, Mail, Phone } from "lucide-react";

function timeAgo(iso) {
  const s = (Date.now() - new Date(iso)) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function exportCSV(rows) {
  const h = ["Name", "Email", "Phone", "Location", "Pathway", "Availability", "Skills", "Why", "Date"];
  const r = rows.map(d => [
    `"${(d.name || "").replace(/"/g, '""')}"`, d.email, d.phone || "", d.location || "",
    d.pathway || "", d.availability || "",
    `"${(d.skills || "").replace(/"/g, '""')}"`,
    `"${(d.why || "").replace(/"/g, '""')}"`,
    new Date(d.createdAt).toLocaleDateString("en-GB"),
  ]);
  const csv = [h.join(","), ...r.map(x => x.join(","))].join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = `ncc-volunteers-${Date.now()}.csv`; a.click();
}

const PATHWAY_COLORS = {
  "Community Outreach":      { bg: "#F0FDF4", color: "#166534" },
  "Healthcare Professional": { bg: "#EFF6FF", color: "#1D4ED8" },
  "Cancer Educator":         { bg: "#FAF5FF", color: "#6D28D9" },
  "Virtual Communications":  { bg: "#FFF7ED", color: "#9A3412" },
  "Fundraiser & Event Host": { bg: "#FEF3C7", color: "#92400E" },
  "Research Support":        { bg: "#FFF1F2", color: "#BE123C" },
};

function PathwayTag({ label }) {
  const s = PATHWAY_COLORS[label] || { bg: "#F5F4F0", color: "#555" };
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 10.5, fontWeight: 700, padding: "2px 7px", borderRadius: 4 }}>
      {label}
    </span>
  );
}

const PATHWAYS = ["All", "Community Outreach", "Healthcare Professional", "Cancer Educator", "Virtual Communications", "Fundraiser & Event Host", "Research Support"];

function RowSk() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-3.5" style={{ borderBottom: "1px solid #F5F4F0" }}>
          <div className="animate-pulse rounded h-3 bg-[#EDEDEB] flex-1" />
          <div className="animate-pulse rounded h-3 bg-[#EDEDEB] w-36 hidden sm:block" />
          <div className="animate-pulse rounded h-3 bg-[#EDEDEB] w-28 hidden md:block" />
          <div className="animate-pulse rounded h-3 bg-[#EDEDEB] w-14" />
        </div>
      ))}
    </>
  );
}

function DeleteModal({ onConfirm, onCancel }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(3px)" }}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        transition={{ duration: 0.14 }}
        className="bg-white rounded-xl p-6 max-w-xs w-full shadow-xl" style={{ border: "1px solid #E8E7E3" }}>
        <h3 className="font-black text-[15px] text-gray-900 mb-1.5" style={{ letterSpacing: "-0.02em" }}>Delete this application?</h3>
        <p className="text-[12.5px] font-medium text-gray-400 mb-5 leading-relaxed">
          Permanently removes the record. Cannot be undone.
        </p>
        <div className="flex gap-2">
          <button onClick={onCancel}
            className="flex-1 py-2 rounded-[7px] text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors focus:outline-none"
            style={{ border: "1px solid #E8E7E3" }}>
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2 rounded-[7px] bg-red-500 text-white text-[13px] font-bold hover:bg-red-600 transition-colors focus:outline-none">
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function VolunteersPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pathway, setPathway] = useState("All");
  const [expanded, setExpanded] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/volunteers");
    if (res.ok) setEntries(await res.json());
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return entries.filter(e =>
      (pathway === "All" || e.pathway === pathway) &&
      (!q || [e.name, e.email, e.location, e.pathway, e.skills, e.why].some(v => (v || "").toLowerCase().includes(q)))
    );
  }, [entries, search, pathway]);

  const pathwayCounts = useMemo(() => {
    const m = {};
    entries.forEach(e => { if (e.pathway) m[e.pathway] = (m[e.pathway] || 0) + 1; });
    return m;
  }, [entries]);

  const del = async (id) => {
    await fetch("/api/admin/entries", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "volunteers", id }),
    });
    setConfirmDelete(null); setExpanded(null); load();
  };

  const toggle = id => setExpanded(v => v === id ? null : id);

  return (
    <div className="px-6 sm:px-8 py-8" style={{ maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-black text-[1.5rem] text-[#0D1F35]" style={{ letterSpacing: "-0.035em" }}>Volunteers</h1>
          <p className="text-[13px] font-medium mt-0.5" style={{ color: "#999" }}>
            {loading ? "Loading…" : `${entries.length} ${entries.length === 1 ? "application" : "applications"}`}
          </p>
        </div>
        <button onClick={() => exportCSV(filtered)} disabled={filtered.length === 0}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-[7px] text-[12.5px] font-semibold transition-all hover:bg-white focus:outline-none disabled:opacity-40"
          style={{ color: "#888", border: "1px solid #E8E7E3" }}>
          <Download size={12} />
          Export{filtered.length > 0 ? ` (${filtered.length})` : ""}
        </button>
      </div>

      {/* Pathway breakdown */}
      {!loading && entries.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-4">
          {Object.entries(pathwayCounts).map(([p, n]) => (
            <button key={p}
              onClick={() => setPathway(pathway === p ? "All" : p)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12px] font-semibold transition-all focus:outline-none"
              style={{
                border: "1px solid",
                borderColor: pathway === p ? "#0D1F35" : "#E8E7E3",
                background: pathway === p ? "#0D1F35" : "white",
                color: pathway === p ? "white" : "#888",
              }}>
              {p}
              <span className="font-black">{n}</span>
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="flex gap-2 mb-4 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#BBBBBB" }} />
          <input type="search" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search volunteers…"
            className="w-full pl-9 pr-8 py-2.5 bg-white rounded-[7px] text-[13px] font-medium text-gray-800 placeholder-gray-300 outline-none transition-all"
            style={{ border: "1px solid #E8E7E3" }} />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none" style={{ color: "#BBBBBB" }}>
              <X size={13} />
            </button>
          )}
        </div>
        <select value={pathway} onChange={e => setPathway(e.target.value)}
          className="py-2.5 px-3 bg-white rounded-[7px] text-[13px] font-medium text-gray-600 outline-none"
          style={{ border: "1px solid #E8E7E3" }}>
          {PATHWAYS.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #E8E7E3" }}>
        <div className="hidden md:grid px-6 py-3"
          style={{ gridTemplateColumns: "2fr 1.8fr 1.8fr 1fr 36px", gap: 16, borderBottom: "1px solid #E8E7E3" }}>
          {["Name", "Email", "Pathway", "Date", ""].map((h, i) => (
            <span key={i} className="text-[10.5px] font-black tracking-[0.12em] uppercase" style={{ color: "#BBBBBB" }}>{h}</span>
          ))}
        </div>

        {loading ? <RowSk /> : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[13.5px] font-semibold" style={{ color: "#BBBBBB" }}>No volunteers found</p>
            <p className="text-[12px] mt-1" style={{ color: "#CCCCCC" }}>
              {search ? "Try a different search." : "Volunteer applications appear here."}
            </p>
          </div>
        ) : filtered.map(item => (
          <div key={item.id}>
            <div className="hidden md:grid px-6 py-3.5 cursor-pointer transition-colors hover:bg-[#FDFCFA]"
              style={{ gridTemplateColumns: "2fr 1.8fr 1.8fr 1fr 36px", gap: 16, borderBottom: "1px solid #F5F4F0", alignItems: "center" }}
              onClick={() => toggle(item.id)}>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-gray-800 truncate">{item.name}</p>
                {item.location && <p className="text-[11.5px] truncate" style={{ color: "#AAAAAA" }}>{item.location}</p>}
              </div>
              <span className="text-[13px] text-gray-500 truncate">{item.email}</span>
              <span>{item.pathway ? <PathwayTag label={item.pathway} /> : <span style={{ color: "#DDD" }}>—</span>}</span>
              <span className="text-[12.5px] tabular-nums" style={{ color: "#AAAAAA" }}>{timeAgo(item.createdAt)}</span>
              <button className="focus:outline-none" style={{ color: "#CCCCCC" }}>
                {expanded === item.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
            </div>

            <div className="md:hidden px-5 py-4 cursor-pointer transition-colors hover:bg-[#FDFCFA]"
              style={{ borderBottom: "1px solid #F5F4F0" }} onClick={() => toggle(item.id)}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-bold text-gray-800 truncate">{item.name}</p>
                  <p className="text-[12px] truncate mt-0.5" style={{ color: "#AAAAAA" }}>{item.email}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {item.pathway && <PathwayTag label={item.pathway} />}
                    <span className="text-[11px]" style={{ color: "#BBBBBB" }}>{timeAgo(item.createdAt)}</span>
                  </div>
                </div>
                <ChevronDown size={13} className="flex-shrink-0 mt-0.5" style={{ color: "#CCCCCC" }} />
              </div>
            </div>

            <AnimatePresence>
              {expanded === item.id && (
                <motion.div key={`e-${item.id}`}
                  initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }}
                  className="overflow-hidden" style={{ background: "#FAFAF8", borderBottom: "1px solid #E8E7E3" }}>
                  <div className="px-6 sm:px-8 py-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-4">
                      <div>
                        <p className="text-[9.5px] font-black tracking-[0.14em] uppercase mb-1.5" style={{ color: "#AAAAAA" }}>Email</p>
                        <a href={`mailto:${item.email}`} className="text-[13px] font-semibold text-[#0D1F35] hover:underline">{item.email}</a>
                      </div>
                      {item.phone && (
                        <div>
                          <p className="text-[9.5px] font-black tracking-[0.14em] uppercase mb-1.5" style={{ color: "#AAAAAA" }}>Phone</p>
                          <a href={`tel:${item.phone}`} className="text-[13px] font-semibold text-gray-700">{item.phone}</a>
                        </div>
                      )}
                      {item.location && (
                        <div>
                          <p className="text-[9.5px] font-black tracking-[0.14em] uppercase mb-1.5" style={{ color: "#AAAAAA" }}>Location</p>
                          <p className="text-[13px] font-semibold text-gray-700">{item.location}</p>
                        </div>
                      )}
                      {item.availability && (
                        <div>
                          <p className="text-[9.5px] font-black tracking-[0.14em] uppercase mb-1.5" style={{ color: "#AAAAAA" }}>Availability</p>
                          <p className="text-[13px] font-semibold text-gray-700">{item.availability}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-[9.5px] font-black tracking-[0.14em] uppercase mb-1.5" style={{ color: "#AAAAAA" }}>Applied</p>
                        <p className="text-[13px] font-semibold text-gray-700">
                          {new Date(item.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9.5px] font-black tracking-[0.14em] uppercase mb-1.5" style={{ color: "#AAAAAA" }}>Consent</p>
                        <p className="text-[13px] font-semibold text-gray-700">
                          {item.over18 ? "Over 18 ✓" : ""}{item.consent ? " · Consented ✓" : ""}
                        </p>
                      </div>
                    </div>
                    {item.skills && (
                      <div className="mb-4">
                        <p className="text-[9.5px] font-black tracking-[0.14em] uppercase mb-2" style={{ color: "#AAAAAA" }}>Skills</p>
                        <p className="text-[13px] text-gray-700 leading-relaxed">{item.skills}</p>
                      </div>
                    )}
                    <div className="mb-5">
                      <p className="text-[9.5px] font-black tracking-[0.14em] uppercase mb-2" style={{ color: "#AAAAAA" }}>Why they want to volunteer</p>
                      <p className="text-[13px] text-gray-700 leading-relaxed">{item.why}</p>
                    </div>
                    <div className="flex items-center gap-2 pt-4" style={{ borderTop: "1px solid #EEEDE9" }}>
                      <a href={`mailto:${item.email}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-white text-[12px] font-bold hover:opacity-90 transition-opacity"
                        style={{ background: "#0D1F35" }}>
                        <Mail size={11} /> Contact
                      </a>
                      {item.phone && (
                        <a href={`tel:${item.phone}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                          style={{ border: "1px solid #E8E7E3" }}>
                          <Phone size={11} /> Call
                        </a>
                      )}
                      <button onClick={() => setConfirmDelete(item.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12px] font-semibold ml-auto hover:text-red-600 hover:bg-red-50 transition-colors focus:outline-none"
                        style={{ color: "#BBBBBB", border: "1px solid #E8E7E3" }}>
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {!loading && filtered.length > 0 && (
        <p className="mt-3 text-[12px] font-medium" style={{ color: "#AAAAAA" }}>
          Showing <strong style={{ color: "#666" }}>{filtered.length}</strong> of {entries.length}
        </p>
      )}

      <AnimatePresence>
        {confirmDelete && (
          <DeleteModal key="del" onConfirm={() => del(confirmDelete)} onCancel={() => setConfirmDelete(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
