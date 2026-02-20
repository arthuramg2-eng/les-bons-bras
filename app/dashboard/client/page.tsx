"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { useProjects, useProjectDetails } from "@/hooks/useProjects";
import type {
  Project,
  ProjectPhase,
  ProjectCost,
  ProjectWithDetails,
  ProjectStatus,
  CostCategory,
  ClientProfile,
} from "@/lib/supabase/types";

/* ─────────────────────────── HELPERS ─────────────────────────── */

function formatCurrency(n: number) {
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("fr-CA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateShort(s: string) {
  return new Date(s).toLocaleDateString("fr-CA", {
    day: "numeric",
    month: "short",
  });
}

function statusConfig(s: ProjectStatus) {
  return {
    en_cours: { label: "En cours", color: "#4CAF50", bg: "rgba(76,175,80,0.1)" },
    planifie: { label: "Planifié", color: "#6366F1", bg: "rgba(99,102,241,0.1)" },
    termine: { label: "Terminé", color: "#10B981", bg: "rgba(16,185,129,0.1)" },
    en_pause: { label: "En pause", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  }[s];
}

function categoryConfig(c: CostCategory) {
  return {
    materiaux: { label: "Matériaux", color: "#6366F1", bg: "rgba(99,102,241,0.1)" },
    main_oeuvre: { label: "Main d'œuvre", color: "#4CAF50", bg: "rgba(76,175,80,0.1)" },
    permis: { label: "Permis", color: "#0EA5E9", bg: "rgba(14,165,233,0.1)" },
    autre: { label: "Autre", color: "#9CA3AF", bg: "rgba(156,163,175,0.1)" },
  }[c];
}

function daysUntil(dateStr: string | null) {
  if (!dateStr) return 0;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/* ─────────────────────────── SUB-COMPONENTS ─────────────────────────── */

function ProgressBar({ value, height = "h-2" }: { value: number; height?: string }) {
  return (
    <div className={`w-full ${height} rounded-full overflow-hidden bg-gray-100`}>
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-[#4CAF50] to-[#81C784]"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

function LoadingScreen() {
  return (
    <main className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
      <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.div
          className="w-12 h-12 border-3 border-[#4CAF50]/20 border-t-[#4CAF50] rounded-full mx-auto mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-[#666] font-light text-lg">Chargement...</p>
      </motion.div>
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════════
   VUE DÉTAILLÉE D'UN PROJET
   ═══════════════════════════════════════════════════════════════ */

function ProjectDetailView({
  projectId,
  onBack,
}: {
  projectId: string;
  onBack: () => void;
}) {
  const { project: p, loading } = useProjectDetails(projectId);
  const [activeTab, setActiveTab] = useState<"apercu" | "phases" | "photos" | "couts">("apercu");

  if (loading || !p) return <LoadingScreen />;

  const sc = statusConfig(p.status);
  const budgetPct = p.budget > 0 ? Math.round((p.spent / p.budget) * 100) : 0;
  const startDate = p.start_date || p.created_at;
  const endDate = p.estimated_end_date || p.created_at;
  const weeks = Math.ceil(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24 * 7)
  );
  const donePhases = p.phases.filter((ph) => ph.status === "done").length;
  const remaining = daysUntil(p.estimated_end_date);

  return (
    <main className="min-h-screen bg-[#F8F7F4] text-[#111]">
      {/* Navbar */}
      <nav className="sticky top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-[#666] hover:text-[#111] font-light transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Mes projets
            </button>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: sc.bg, color: sc.color }}>
                {sc.label}
              </span>
              {remaining > 0 && (
                <span className="text-xs text-[#999] font-light hidden sm:inline">{remaining} jours restants</span>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Project header */}
        <motion.div className="mb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-3">{p.title}</h1>
          <p className="text-[#666] font-light leading-relaxed mb-6 max-w-2xl">{p.description}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#666] font-light">
            {p.address && (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {p.address}
              </span>
            )}
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth={2} />
                <path d="M16 2v4M8 2v4M3 10h18" strokeWidth={2} strokeLinecap="round" />
              </svg>
              {formatDate(startDate)} → {formatDate(endDate)}
            </span>
            {p.pro && (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {p.pro.full_name} — {p.pro.company_name}
              </span>
            )}
          </div>
        </motion.div>

        {/* Progress card */}
        <motion.div
          className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg mb-10"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-light text-[#111]">Progression globale</span>
            <span className="text-3xl font-light text-[#4CAF50]">{p.progress}%</span>
          </div>
          <ProgressBar value={p.progress} height="h-3" />
          <div className="flex justify-between mt-4 text-sm text-[#666] font-light">
            <span>Dépensé : <strong className="text-[#111] font-medium">{formatCurrency(p.spent)}</strong></span>
            <span>Budget : <strong className="text-[#111] font-medium">{formatCurrency(p.budget)}</strong></span>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex bg-white rounded-full p-1 mb-10 border border-gray-100">
          {(["apercu", "phases", "photos", "couts"] as const).map((tab) => {
            const labels = { apercu: "Aperçu", phases: "Phases", photos: "Photos", couts: "Coûts" };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-medium rounded-full transition-all duration-300 ${
                  activeTab === tab ? "bg-[#4CAF50] text-white shadow-lg" : "text-[#666] hover:text-[#111]"
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {/* APERÇU */}
          {activeTab === "apercu" && (
            <motion.div key="apercu" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Budget", value: formatCurrency(p.budget), sub: `${formatCurrency(p.budget - p.spent)} restant`, color: "#4CAF50" },
                  { label: "Durée", value: `${weeks} sem.`, sub: remaining > 0 ? `${remaining} jours restants` : "Terminé", color: "#6366F1" },
                  { label: "Phases", value: `${donePhases}/${p.phases.length}`, sub: "complétées", color: "#10B981" },
                  { label: "Photos", value: `${p.photos.length}`, sub: "du chantier", color: "#0EA5E9" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <p className="text-sm text-[#666] font-light mb-1">{stat.label}</p>
                    <p className="text-2xl font-light text-[#111] tracking-tight">{stat.value}</p>
                    <p className="text-xs font-light mt-1" style={{ color: stat.color }}>{stat.sub}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-[#666] font-light">Utilisation du budget</span>
                  <span className="text-sm font-medium text-[#111]">{budgetPct}%</span>
                </div>
                <ProgressBar value={budgetPct} height="h-2" />
                <div className="flex justify-between mt-3">
                  <span className="text-xs text-[#999] font-light">{formatCurrency(p.spent)} dépensé</span>
                  <span className="text-xs text-[#999] font-light">{formatCurrency(p.budget)} budget</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* PHASES */}
          {activeTab === "phases" && (
            <motion.div key="phases" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }} className="bg-white rounded-3xl border border-gray-100 p-8">
              {p.phases.length === 0 ? (
                <p className="text-[#999] font-light text-center py-8">Aucune phase définie pour l&apos;instant.</p>
              ) : (
                p.phases.map((phase, i) => (
                  <div key={phase.id} className="flex gap-5">
                    <div className="flex flex-col items-center">
                      {phase.status === "done" ? (
                        <div className="w-10 h-10 rounded-full bg-[#4CAF50]/10 flex items-center justify-center">
                          <svg className="w-5 h-5 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : phase.status === "in_progress" ? (
                        <div className="w-10 h-10 rounded-full bg-[#4CAF50]/10 flex items-center justify-center">
                          <motion.div className="w-3.5 h-3.5 rounded-full bg-[#4CAF50]" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center bg-[#F8F7F4]">
                          <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                        </div>
                      )}
                      {i < p.phases.length - 1 && (
                        <div className={`w-0.5 flex-1 my-1.5 ${phase.status === "done" ? "bg-[#4CAF50]/40" : "bg-gray-200"}`} />
                      )}
                    </div>
                    <div className="flex-1 pb-8 pt-2">
                      <div className="flex items-center justify-between">
                        <p className={`font-medium ${phase.status === "pending" ? "text-[#999]" : "text-[#111]"}`}>{phase.name}</p>
                        {phase.status === "in_progress" && (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-[#4CAF50]/10 text-[#4CAF50] font-medium">En cours</span>
                        )}
                      </div>
                      <p className="text-sm text-[#999] font-light mt-1">
                        {phase.start_date && formatDate(phase.start_date)}
                        {phase.end_date && ` → ${formatDate(phase.end_date)}`}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {/* PHOTOS */}
          {activeTab === "photos" && (
            <motion.div key="photos" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
              {p.photos.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center">
                  <div className="w-20 h-20 bg-[#F8F7F4] rounded-2xl mx-auto mb-5 flex items-center justify-center">
                    <svg className="w-10 h-10 text-[#ccc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-[#666] font-light">Aucune photo pour l&apos;instant.</p>
                  <p className="text-sm text-[#999] font-light mt-1">Les photos seront ajoutées au fur et à mesure du chantier.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {p.photos.map((photo) => (
                    <div key={photo.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      {photo.url ? (
                        <img src={photo.url} alt={photo.caption || ""} className="aspect-[4/3] w-full object-cover" />
                      ) : (
                        <div className="aspect-[4/3] bg-[#F8F7F4] flex items-center justify-center">
                          <svg className="w-10 h-10 text-[#ccc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="p-4">
                        <p className="font-medium text-sm text-[#111]">{photo.caption}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-[#999] font-light">{formatDate(photo.created_at)}</span>
                          {photo.phase && <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#4CAF50]/10 text-[#4CAF50]">{photo.phase}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* COÛTS */}
          {activeTab === "couts" && (
            <motion.div key="couts" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#666] font-light">Dépensé / Budget</span>
                  <span className="font-medium text-[#111]">{formatCurrency(p.spent)} / {formatCurrency(p.budget)}</span>
                </div>
                <ProgressBar value={budgetPct} height="h-2" />
                <div className="flex justify-between mt-3">
                  <p className="text-xs text-[#999] font-light">{budgetPct}% utilisé</p>
                  <p className="text-xs font-light" style={{ color: budgetPct > 80 ? "#EF4444" : "#4CAF50" }}>{formatCurrency(p.budget - p.spent)} restant</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {(["materiaux", "main_oeuvre", "permis", "autre"] as const).map((cat) => {
                  const cc = categoryConfig(cat);
                  const total = p.costs.filter((c) => c.category === cat).reduce((s, c) => s + Number(c.amount), 0);
                  return (
                    <div key={cat} className="bg-white p-4 rounded-xl border border-gray-100">
                      <div className="w-2 h-2 rounded-full mb-2" style={{ background: cc.color }} />
                      <p className="text-xs text-[#999] font-light">{cc.label}</p>
                      <p className="text-lg font-light text-[#111]">{formatCurrency(total)}</p>
                    </div>
                  );
                })}
              </div>
              {p.costs.length === 0 ? (
                <p className="text-[#999] font-light text-center py-8">Aucune dépense enregistrée.</p>
              ) : (
                <div className="space-y-3">
                  {p.costs.map((cost) => {
                    const cc = categoryConfig(cost.category);
                    return (
                      <div key={cost.id} className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cc.color }} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#111] truncate">{cost.label}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2.5 py-0.5 rounded-full font-light" style={{ background: cc.bg, color: cc.color }}>{cc.label}</span>
                            <span className="text-xs text-[#999] font-light">{formatDate(cost.date)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-[#111]">{formatCurrency(Number(cost.amount))}</p>
                          <span className={`text-xs font-light ${cost.paid ? "text-[#4CAF50]" : "text-[#F59E0B]"}`}>{cost.paid ? "✓ Payé" : "En attente"}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL — DASHBOARD CLIENT
   ═══════════════════════════════════════════════════════════════ */

export default function ClientDashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const { role, profile, userId, loading: roleLoading } = useUserRole();
  const { projects, loading: projectsLoading } = useProjects(userId, role);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const loading = roleLoading || projectsLoading;

  if (loading) return <LoadingScreen />;

  const clientProfile = profile as ClientProfile | null;
  const displayName = clientProfile?.full_name || "Utilisateur";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  /* ─── Stats ─── */
  const totalBudget = projects.reduce((s, p) => s + Number(p.budget), 0);
  const totalSpent = projects.reduce((s, p) => s + Number(p.spent), 0);
  const activeCount = projects.filter((p) => p.status === "en_cours").length;
  const avgProgress = projects.length
    ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length)
    : 0;

  /* ─── Selected project detail view ─── */
  if (selectedProjectId) {
    return <ProjectDetailView projectId={selectedProjectId} onBack={() => setSelectedProjectId(null)} />;
  }

  /* ═══════════════════════════════════════════════════════════════
     DASHBOARD PRINCIPAL
     ═══════════════════════════════════════════════════════════════ */

  return (
    <main className="min-h-screen bg-[#F8F7F4] text-[#111]">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-3xl text-[#4CAF50] font-bold">*</span>
              <span className="text-xl font-light tracking-tight">Les Bons Bras</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/chat-renovation" className="text-[#666] hover:text-[#111] font-light transition-colors text-sm">Assistant IA</Link>
              <Link href="/trouver-un-professionnel" className="text-[#666] hover:text-[#111] font-light transition-colors text-sm">Trouver un pro</Link>
              <div className="flex items-center gap-3 bg-[#F8F7F4] pl-4 pr-2 py-1.5 rounded-full">
                <div className="text-right">
                  <p className="text-sm font-medium text-[#111] leading-tight">{displayName}</p>
                  <p className="text-xs text-[#999] font-light">Espace client</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#4CAF50] flex items-center justify-center text-white text-sm font-medium">
                  {displayName.charAt(0)}
                </div>
              </div>
              <button onClick={handleLogout} className="text-[#999] hover:text-[#666] transition-colors" title="Se déconnecter">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden border-t border-gray-100 pb-4">
                <div className="pt-4 space-y-3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#4CAF50] flex items-center justify-center text-white font-medium">{displayName.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-medium">{displayName}</p>
                      <p className="text-xs text-[#999] font-light">{clientProfile?.email}</p>
                    </div>
                  </div>
                  <Link href="/chat-renovation" className="block py-2 text-[#666] font-light">Assistant IA</Link>
                  <Link href="/trouver-un-professionnel" className="block py-2 text-[#666] font-light">Trouver un pro</Link>
                  <button onClick={handleLogout} className="block py-2 text-red-500 font-light">Se déconnecter</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Welcome */}
        <motion.div className="mb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-2">
            Bonjour, <span className="text-[#4CAF50]">{displayName.split(" ")[0]}</span>
          </h1>
          <p className="text-lg text-[#666] font-light">Voici un aperçu de vos projets de rénovation.</p>
        </motion.div>

        {/* Stats */}
        <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          {[
            { label: "Projets actifs", value: `${activeCount}`, icon: "M13 10V3L4 14h7v7l9-11h-7z", color: "#4CAF50" },
            { label: "Budget total", value: formatCurrency(totalBudget), icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "#6366F1", sub: `${formatCurrency(totalSpent)} dépensé` },
            { label: "Progression moy.", value: `${avgProgress}%`, icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", color: "#F59E0B" },
            { label: "Total projets", value: `${projects.length}`, icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", color: "#0EA5E9" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${stat.color}15` }}>
                  <svg className="w-6 h-6" fill="none" stroke={stat.color} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[#666] font-light">{stat.label}</p>
                  <p className="text-2xl font-light text-[#111] tracking-tight">{stat.value}</p>
                  {"sub" in stat && stat.sub && <p className="text-xs font-light mt-0.5" style={{ color: stat.color }}>{stat.sub}</p>}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light">Mes projets</h2>
              <span className="text-sm text-[#999] font-light">{projects.length} projet{projects.length > 1 ? "s" : ""}</span>
            </div>

            {projects.length === 0 ? (
              <div className="bg-white p-16 rounded-3xl border border-gray-100 text-center">
                <div className="w-20 h-20 bg-[#4CAF50]/10 rounded-2xl mx-auto mb-5 flex items-center justify-center">
                  <svg className="w-10 h-10 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-light text-[#111] mb-2">Aucun projet pour l&apos;instant</h3>
                <p className="text-[#666] font-light mb-6">Commencez par trouver un professionnel pour votre projet.</p>
                <Link href="/trouver-un-professionnel" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#4CAF50] text-white text-sm font-medium hover:bg-[#45a049] shadow-lg transition-all">
                  Trouver un pro
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {projects.map((project, i) => {
                  const sc = statusConfig(project.status);
                  const budgetUsed = Number(project.budget) > 0 ? Math.round((Number(project.spent) / Number(project.budget)) * 100) : 0;
                  return (
                    <motion.button
                      key={project.id}
                      onClick={() => setSelectedProjectId(project.id)}
                      className="group w-full text-left bg-white p-7 rounded-3xl border border-gray-100 hover:border-[#4CAF50]/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                        <svg className="w-5 h-5 text-[#ccc] group-hover:text-[#4CAF50] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-normal text-[#111] mb-1.5 group-hover:text-[#4CAF50] transition-colors">{project.title}</h3>
                      <p className="text-sm text-[#666] font-light leading-relaxed mb-5 line-clamp-2">{project.description}</p>
                      <div className="mb-5">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-[#999] font-light">Progression</span>
                          <span className="text-sm font-medium text-[#4CAF50]">{project.progress}%</span>
                        </div>
                        <ProgressBar value={project.progress} height="h-1.5" />
                      </div>
                      <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                        <span className="text-sm text-[#666] font-light">{project.address || "—"}</span>
                        <div className="text-right">
                          <span className="text-lg font-light text-[#111]">{formatCurrency(Number(project.budget))}</span>
                          {Number(project.spent) > 0 && <span className="text-xs text-[#999] font-light ml-2">({budgetUsed}% utilisé)</span>}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <motion.div className="lg:col-span-1" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <h2 className="text-2xl font-light mb-6">Actions rapides</h2>
            <div className="space-y-3">
              <Link href="/chat-renovation" className="group flex items-center gap-4 bg-gradient-to-r from-[#4CAF50] to-[#45a049] p-5 rounded-2xl text-white hover:shadow-xl transition-all duration-300">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm">Assistant IA</p>
                  <p className="text-xs text-white/80 font-light">Posez vos questions rénovation</p>
                </div>
                <svg className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/trouver-un-professionnel" className="group flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 hover:border-[#4CAF50]/30 hover:shadow-lg transition-all duration-300">
                <div className="w-10 h-10 bg-[#4CAF50]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm text-[#111]">Trouver un pro</p>
                  <p className="text-xs text-[#999] font-light">2,500+ professionnels vérifiés</p>
                </div>
                <svg className="w-5 h-5 ml-auto text-[#ccc] group-hover:text-[#4CAF50] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}