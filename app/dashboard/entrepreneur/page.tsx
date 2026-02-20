"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { useProjects } from "@/hooks/useProjects";
import { useProjectRequests } from "@/hooks/useProjectRequests";
import { useOnboardingCheck } from "@/hooks/useOnboardingCheck";
import type {
  Project,
  ProProfile,
  ProjectStatus,
  ProjectRequestWithDetails,
} from "@/lib/supabase/types";

/* ─────────────────────────── HELPERS ─────────────────────────── */

function formatCurrency(n: number) {
  return new Intl.NumberFormat("fr-CA", { style: "currency", currency: "CAD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("fr-CA", { day: "numeric", month: "short", year: "numeric" });
}

function statusConfig(s: ProjectStatus) {
  return {
    en_cours: { label: "En cours", color: "#4CAF50", bg: "rgba(76,175,80,0.1)" },
    planifie: { label: "Planifié", color: "#6366F1", bg: "rgba(99,102,241,0.1)" },
    termine: { label: "Terminé", color: "#10B981", bg: "rgba(16,185,129,0.1)" },
    en_pause: { label: "En pause", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  }[s];
}

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

/* ─────────────────────────── REQUEST CARD ─────────────────────────── */

function RequestCard({
  request,
  onRespond,
  responding,
}: {
  request: ProjectRequestWithDetails;
  onRespond: (id: string, projectId: string, accept: boolean) => void;
  responding: boolean;
}) {
  return (
    <motion.div
      className="bg-white p-6 rounded-2xl border border-[#4CAF50]/20 shadow-md"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-[#111]">{request.project.title}</h3>
          <p className="text-sm text-[#666] font-light mt-1">{request.project.description}</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F59E0B]/10 text-[#F59E0B] flex-shrink-0 ml-4">
          Nouvelle demande
        </span>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-[#666] font-light mb-5">
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {request.client.full_name}
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 10v1" />
          </svg>
          Budget : {formatCurrency(Number(request.project.budget))}
        </span>
        {request.project.address && (
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {request.project.address}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth={2} />
            <path d="M16 2v4M8 2v4M3 10h18" strokeWidth={2} strokeLinecap="round" />
          </svg>
          Reçue le {formatDate(request.created_at)}
        </span>
      </div>

      {request.message && (
        <div className="bg-[#F8F7F4] p-4 rounded-xl mb-5">
          <p className="text-sm text-[#666] font-light italic">&ldquo;{request.message}&rdquo;</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => onRespond(request.id, request.project_id, true)}
          disabled={responding}
          className="flex-1 py-3 rounded-full bg-[#4CAF50] text-white text-sm font-medium hover:bg-[#45a049] shadow-lg transition-all disabled:opacity-50"
        >
          ✓ Accepter
        </button>
        <button
          onClick={() => onRespond(request.id, request.project_id, false)}
          disabled={responding}
          className="flex-1 py-3 rounded-full bg-white text-[#666] text-sm font-medium border border-gray-200 hover:border-red-300 hover:text-red-500 transition-all disabled:opacity-50"
        >
          ✕ Décliner
        </button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DASHBOARD ENTREPRENEUR
   ═══════════════════════════════════════════════════════════════ */

export default function EntrepreneurDashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const { role, profile, userId, loading: roleLoading } = useUserRole();
  const { complete: onboardingComplete, loading: onboardingLoading } = useOnboardingCheck(userId, role);
  const { projects, loading: projectsLoading } = useProjects(userId, role);
  const { requests, loading: requestsLoading, respondToRequest } = useProjectRequests(userId, role);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [responding, setResponding] = useState(false);

  // Redirect to onboarding if profile incomplete
  useEffect(() => {
    if (!onboardingLoading && onboardingComplete === false) {
      router.push("/onboarding");
    }
  }, [onboardingComplete, onboardingLoading, router]);

  const loading = roleLoading || projectsLoading || requestsLoading || onboardingLoading;

  if (loading || onboardingComplete === false) return <LoadingScreen />;

  const proProfile = profile as ProProfile | null;
  const displayName = proProfile?.full_name || "Professionnel";
  const companyName = proProfile?.company_name || "";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleRespond = async (requestId: string, projectId: string, accept: boolean) => {
    setResponding(true);
    await respondToRequest(requestId, projectId, accept);
    setResponding(false);
  };

  /* Stats */
  const activeProjects = projects.filter((p) => p.status === "en_cours");
  const totalRevenue = projects.reduce((s, p) => s + Number(p.budget), 0);
  const avgProgress = projects.length
    ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length)
    : 0;

  return (
    <main className="min-h-screen bg-[#F8F7F4] text-[#111]">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl text-[#4CAF50] font-bold">*</span>
              <span className="text-xl font-light tracking-tight">Les Bons Bras</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-3 bg-[#F8F7F4] pl-4 pr-2 py-1.5 rounded-full">
                <div className="text-right">
                  <p className="text-sm font-medium text-[#111] leading-tight">{displayName}</p>
                  <p className="text-xs text-[#999] font-light">Espace pro</p>
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
                      <p className="text-xs text-[#999] font-light">{companyName}</p>
                    </div>
                  </div>
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
          <p className="text-lg text-[#666] font-light">
            {companyName && <>{companyName} — </>}Gérez vos chantiers et demandes clients.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          {[
            { label: "Demandes en attente", value: `${requests.length}`, icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9", color: "#F59E0B" },
            { label: "Chantiers actifs", value: `${activeProjects.length}`, icon: "M13 10V3L4 14h7v7l9-11h-7z", color: "#4CAF50" },
            { label: "Revenus totaux", value: formatCurrency(totalRevenue), icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 10v1", color: "#6366F1" },
            { label: "Progression moy.", value: `${avgProgress}%`, icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", color: "#0EA5E9" },
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
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Pending requests */}
            {requests.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-light">Nouvelles demandes</h2>
                  <span className="w-7 h-7 rounded-full bg-[#F59E0B] text-white text-xs font-medium flex items-center justify-center">{requests.length}</span>
                </div>
                <div className="space-y-4">
                  {requests.map((req) => (
                    <RequestCard key={req.id} request={req} onRespond={handleRespond} responding={responding} />
                  ))}
                </div>
              </div>
            )}

            {/* Active projects */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-light">Mes chantiers</h2>
                <span className="text-sm text-[#999] font-light">{projects.length} projet{projects.length > 1 ? "s" : ""}</span>
              </div>

              {projects.length === 0 ? (
                <div className="bg-white p-16 rounded-3xl border border-gray-100 text-center">
                  <div className="w-20 h-20 bg-[#4CAF50]/10 rounded-2xl mx-auto mb-5 flex items-center justify-center">
                    <svg className="w-10 h-10 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-light text-[#111] mb-2">Aucun chantier assigné</h3>
                  <p className="text-[#666] font-light">Vos projets apparaîtront ici lorsque des clients vous sélectionneront.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {projects.map((project, i) => {
                    const sc = statusConfig(project.status);
                    const budgetUsed = Number(project.budget) > 0 ? Math.round((Number(project.spent) / Number(project.budget)) * 100) : 0;
                    return (
                      <motion.div
                        key={project.id}
                        className="bg-white p-7 rounded-3xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                          {project.address && <span className="text-xs text-[#999] font-light">{project.address}</span>}
                        </div>
                        <h3 className="text-xl font-normal text-[#111] mb-1.5">{project.title}</h3>
                        <p className="text-sm text-[#666] font-light leading-relaxed mb-5 line-clamp-2">{project.description}</p>
                        <div className="mb-5">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-[#999] font-light">Progression</span>
                            <span className="text-sm font-medium text-[#4CAF50]">{project.progress}%</span>
                          </div>
                          <ProgressBar value={project.progress} height="h-1.5" />
                        </div>
                        <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                          <span className="text-sm text-[#666] font-light">Budget : {formatCurrency(Number(project.budget))}</span>
                          {Number(project.spent) > 0 && <span className="text-sm text-[#999] font-light">{budgetUsed}% utilisé</span>}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <motion.div className="lg:col-span-1" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <h2 className="text-2xl font-light mb-6">Résumé</h2>
            <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-5">
              <div>
                <p className="text-sm text-[#666] font-light mb-1">Entreprise</p>
                <p className="text-lg font-light text-[#111]">{companyName || "—"}</p>
              </div>
              {proProfile?.license_rbq && (
                <div>
                  <p className="text-sm text-[#666] font-light mb-1">Licence RBQ</p>
                  <p className="text-lg font-light text-[#111]">{proProfile.license_rbq}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-[#666] font-light mb-1">Projets terminés</p>
                <p className="text-lg font-light text-[#111]">{projects.filter((p) => p.status === "termine").length}</p>
              </div>
              <div>
                <p className="text-sm text-[#666] font-light mb-1">Vérifié</p>
                <p className="text-lg font-light">
                  {proProfile?.verified ? (
                    <span className="text-[#4CAF50]">✓ Oui</span>
                  ) : (
                    <span className="text-[#999]">En attente</span>
                  )}
                </p>
              </div>
            </div>

            {/* Edit profile link */}
            <Link
              href="/onboarding"
              className="group flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 hover:border-[#4CAF50]/30 hover:shadow-lg transition-all duration-300 mt-4"
            >
              <div className="w-10 h-10 bg-[#4CAF50]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm text-[#111]">Modifier mon profil</p>
                <p className="text-xs text-[#999] font-light">Photos, bio, spécialités</p>
              </div>
              <svg className="w-5 h-5 ml-auto text-[#ccc] group-hover:text-[#4CAF50] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
}