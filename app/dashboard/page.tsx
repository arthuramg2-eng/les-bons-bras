"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ─────────────────────────── TYPES ─────────────────────────── */

type ProjectStatus = "en_cours" | "planifie" | "termine" | "en_pause";

type ProjectPhase = {
  id: string;
  name: string;
  status: "done" | "in_progress" | "pending";
  startDate: string;
  endDate?: string;
};

type ProjectPhoto = {
  id: string;
  url: string;
  caption: string;
  date: string;
  phase: string;
};

type ProjectCost = {
  id: string;
  label: string;
  amount: number;
  category: "materiaux" | "main_oeuvre" | "permis" | "autre";
  date: string;
  paid: boolean;
};

type Project = {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  estimatedEndDate: string;
  budget: number;
  spent: number;
  professional: { name: string; company: string };
  address: string;
  phases: ProjectPhase[];
  photos: ProjectPhoto[];
  costs: ProjectCost[];
  lastUpdate: string;
};

type UserProfile = {
  full_name: string;
  email: string;
  role: "client" | "professionnel";
};

/* ─────────────────────────── MOCK DATA ─────────────────────────── */

const MOCK_PROFILE: UserProfile = {
  full_name: "Arthur Moreau",
  email: "arthur@exemple.com",
  role: "client",
};

const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Rénovation cuisine complète",
    description:
      "Réfection complète de la cuisine : armoires, comptoirs quartz, dosseret céramique, luminaires et plancher.",
    status: "en_cours",
    progress: 65,
    startDate: "2026-01-15",
    estimatedEndDate: "2026-03-20",
    budget: 35000,
    spent: 22750,
    professional: { name: "Marc Gagnon", company: "Rénovations MG Pro" },
    address: "4521 rue Saint-Denis, Montréal",
    phases: [
      { id: "p1", name: "Démolition", status: "done", startDate: "2026-01-15", endDate: "2026-01-22" },
      { id: "p2", name: "Plomberie & électricité", status: "done", startDate: "2026-01-23", endDate: "2026-02-05" },
      { id: "p3", name: "Installation armoires", status: "in_progress", startDate: "2026-02-06" },
      { id: "p4", name: "Comptoirs & dosseret", status: "pending", startDate: "2026-02-20" },
      { id: "p5", name: "Finitions & nettoyage", status: "pending", startDate: "2026-03-10" },
    ],
    photos: [
      { id: "ph1", url: "", caption: "Avant — état initial", date: "2026-01-14", phase: "Avant" },
      { id: "ph2", url: "", caption: "Démolition terminée", date: "2026-01-22", phase: "Démolition" },
      { id: "ph3", url: "", caption: "Nouvelle plomberie", date: "2026-02-03", phase: "Plomberie" },
    ],
    costs: [
      { id: "c1", label: "Armoires sur mesure", amount: 8500, category: "materiaux", date: "2026-01-10", paid: true },
      { id: "c2", label: "Comptoir quartz", amount: 4200, category: "materiaux", date: "2026-01-12", paid: true },
      { id: "c3", label: "Main d'œuvre — démolition", amount: 2800, category: "main_oeuvre", date: "2026-01-22", paid: true },
      { id: "c4", label: "Plombier", amount: 3500, category: "main_oeuvre", date: "2026-02-05", paid: true },
      { id: "c5", label: "Électricien", amount: 2750, category: "main_oeuvre", date: "2026-02-05", paid: true },
      { id: "c6", label: "Permis municipal", amount: 450, category: "permis", date: "2026-01-08", paid: true },
      { id: "c7", label: "Céramique dosseret", amount: 550, category: "materiaux", date: "2026-02-10", paid: false },
    ],
    lastUpdate: "2026-02-16",
  },
  {
    id: "2",
    title: "Salle de bain principale",
    description: "Modernisation complète avec douche à l'italienne, vanité double et céramique grand format.",
    status: "planifie",
    progress: 0,
    startDate: "2026-04-01",
    estimatedEndDate: "2026-05-15",
    budget: 18000,
    spent: 0,
    professional: { name: "Sophie Lavoie", company: "BonBain Montréal" },
    address: "4521 rue Saint-Denis, Montréal",
    phases: [
      { id: "p1", name: "Planification", status: "pending", startDate: "2026-04-01" },
      { id: "p2", name: "Démolition", status: "pending", startDate: "2026-04-10" },
      { id: "p3", name: "Installation", status: "pending", startDate: "2026-04-20" },
      { id: "p4", name: "Finitions", status: "pending", startDate: "2026-05-05" },
    ],
    photos: [],
    costs: [],
    lastUpdate: "2026-02-10",
  },
];

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

function categoryConfig(c: ProjectCost["category"]) {
  return {
    materiaux: { label: "Matériaux", color: "#6366F1", bg: "rgba(99,102,241,0.1)" },
    main_oeuvre: { label: "Main d'œuvre", color: "#4CAF50", bg: "rgba(76,175,80,0.1)" },
    permis: { label: "Permis", color: "#0EA5E9", bg: "rgba(14,165,233,0.1)" },
    autre: { label: "Autre", color: "#9CA3AF", bg: "rgba(156,163,175,0.1)" },
  }[c];
}

function daysUntil(dateStr: string) {
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

/* ═══════════════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL — DASHBOARD
   ═══════════════════════════════════════════════════════════════ */

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>(MOCK_PROFILE);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<"apercu" | "phases" | "photos" | "couts">("apercu");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* ─── Supabase data loading ─── */
  useEffect(() => {
    async function loadData() {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          router.push("/connexion");
          return;
        }

        const { data: profileData } = await supabase
          .from("client_profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single();
        if (profileData) {
          setProfile({
            full_name: profileData.full_name,
            email: profileData.email,
            role: "client",
          });
        }

        const { data: projectsData } = await supabase
          .from("projects")
          .select(
            "*, phases:project_phases(*), photos:project_photos(*), costs:project_costs(*)"
          )
          .eq("client_id", session.user.id)
          .order("created_at", { ascending: false });
        if (projectsData && projectsData.length > 0) setProjects(projectsData);
      } catch {
        console.log("Using mock data");
      }
    }
    loadData();
  }, [router]);

  const handleLogout = async () => {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      await supabase.auth.signOut();
    } catch {}
    router.push("/");
  };

  /* ─── Stats ─── */
  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalSpent = projects.reduce((s, p) => s + p.spent, 0);
  const activeCount = projects.filter((p) => p.status === "en_cours").length;
  const avgProgress = projects.length
    ? Math.round(
        projects.reduce((s, p) => s + p.progress, 0) / projects.length
      )
    : 0;

  /* ─── Activity feed (derived from projects) ─── */
  const activities = projects
    .flatMap((p) => [
      ...p.phases
        .filter((ph) => ph.status === "done" && ph.endDate)
        .map((ph) => ({
          type: "phase" as const,
          project: p.title,
          label: `${ph.name} terminée`,
          date: ph.endDate!,
          icon: "check",
        })),
      ...p.phases
        .filter((ph) => ph.status === "in_progress")
        .map((ph) => ({
          type: "phase" as const,
          project: p.title,
          label: `${ph.name} en cours`,
          date: ph.startDate,
          icon: "progress",
        })),
      ...p.costs
        .filter((c) => c.paid)
        .map((c) => ({
          type: "payment" as const,
          project: p.title,
          label: `${c.label} — ${formatCurrency(c.amount)}`,
          date: c.date,
          icon: "payment",
        })),
    ])
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  /* ═══════════════════════════════════════════════════════════════
     VUE DÉTAILLÉE D'UN PROJET
     ═══════════════════════════════════════════════════════════════ */

  if (selectedProject) {
    const p = selectedProject;
    const sc = statusConfig(p.status);
    const budgetPct =
      p.budget > 0 ? Math.round((p.spent / p.budget) * 100) : 0;
    const weeks = Math.ceil(
      (new Date(p.estimatedEndDate).getTime() -
        new Date(p.startDate).getTime()) /
        (1000 * 60 * 60 * 24 * 7)
    );
    const donePhases = p.phases.filter((ph) => ph.status === "done").length;
    const remaining = daysUntil(p.estimatedEndDate);

    return (
      <main className="min-h-screen bg-[#F8F7F4] text-[#111]">
        {/* ─── Navbar ─── */}
        <nav className="sticky top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={() => setSelectedProject(null)}
                className="flex items-center gap-2 text-[#666] hover:text-[#111] font-light transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Mes projets
              </button>
              <div className="flex items-center gap-3">
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: sc.bg, color: sc.color }}
                >
                  {sc.label}
                </span>
                {remaining > 0 && (
                  <span className="text-xs text-[#999] font-light hidden sm:inline">
                    {remaining} jours restants
                  </span>
                )}
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* ─── Project header ─── */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-3">
              {p.title}
            </h1>
            <p className="text-[#666] font-light leading-relaxed mb-6 max-w-2xl">
              {p.description}
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#666] font-light">
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-[#4CAF50]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {p.address}
              </span>
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-[#4CAF50]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="18"
                    rx="2"
                    strokeWidth={2}
                  />
                  <path
                    d="M16 2v4M8 2v4M3 10h18"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                </svg>
                {formatDate(p.startDate)} → {formatDate(p.estimatedEndDate)}
              </span>
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-[#4CAF50]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {p.professional.name} — {p.professional.company}
              </span>
            </div>
          </motion.div>

          {/* ─── Progress card ─── */}
          <motion.div
            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg mb-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-light text-[#111]">
                Progression globale
              </span>
              <span className="text-3xl font-light text-[#4CAF50]">
                {p.progress}%
              </span>
            </div>
            <ProgressBar value={p.progress} height="h-3" />
            <div className="flex justify-between mt-4 text-sm text-[#666] font-light">
              <span>
                Dépensé :{" "}
                <strong className="text-[#111] font-medium">
                  {formatCurrency(p.spent)}
                </strong>
              </span>
              <span>
                Budget :{" "}
                <strong className="text-[#111] font-medium">
                  {formatCurrency(p.budget)}
                </strong>
              </span>
            </div>
          </motion.div>

          {/* ─── Tabs ─── */}
          <div className="flex bg-white rounded-full p-1 mb-10 border border-gray-100">
            {(["apercu", "phases", "photos", "couts"] as const).map((tab) => {
              const labels = {
                apercu: "Aperçu",
                phases: "Phases",
                photos: "Photos",
                couts: "Coûts",
              };
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-sm font-medium rounded-full transition-all duration-300
                    ${
                      activeTab === tab
                        ? "bg-[#4CAF50] text-white shadow-lg"
                        : "text-[#666] hover:text-[#111]"
                    }`}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </div>

          {/* ─── Tab content ─── */}
          <AnimatePresence mode="wait">
            {/* APERÇU */}
            {activeTab === "apercu" && (
              <motion.div
                key="apercu"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    {
                      label: "Budget",
                      value: formatCurrency(p.budget),
                      sub: `${formatCurrency(p.budget - p.spent)} restant`,
                      color: "#4CAF50",
                    },
                    {
                      label: "Durée",
                      value: `${weeks} sem.`,
                      sub:
                        remaining > 0
                          ? `${remaining} jours restants`
                          : "Terminé",
                      color: "#6366F1",
                    },
                    {
                      label: "Phases",
                      value: `${donePhases}/${p.phases.length}`,
                      sub: "complétées",
                      color: "#10B981",
                    },
                    {
                      label: "Photos",
                      value: `${p.photos.length}`,
                      sub: "du chantier",
                      color: "#0EA5E9",
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                      <p className="text-sm text-[#666] font-light mb-1">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-light text-[#111] tracking-tight">
                        {stat.value}
                      </p>
                      <p
                        className="text-xs font-light mt-1"
                        style={{ color: stat.color }}
                      >
                        {stat.sub}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Quick budget bar in apercu */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-[#666] font-light">
                      Utilisation du budget
                    </span>
                    <span className="text-sm font-medium text-[#111]">
                      {budgetPct}%
                    </span>
                  </div>
                  <ProgressBar value={budgetPct} height="h-2" />
                  <div className="flex justify-between mt-3">
                    <span className="text-xs text-[#999] font-light">
                      {formatCurrency(p.spent)} dépensé
                    </span>
                    <span className="text-xs text-[#999] font-light">
                      {formatCurrency(p.budget)} budget
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PHASES */}
            {activeTab === "phases" && (
              <motion.div
                key="phases"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl border border-gray-100 p-8"
              >
                {p.phases.map((phase, i) => (
                  <div key={phase.id} className="flex gap-5">
                    <div className="flex flex-col items-center">
                      {phase.status === "done" ? (
                        <div className="w-10 h-10 rounded-full bg-[#4CAF50]/10 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-[#4CAF50]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      ) : phase.status === "in_progress" ? (
                        <div className="w-10 h-10 rounded-full bg-[#4CAF50]/10 flex items-center justify-center">
                          <motion.div
                            className="w-3.5 h-3.5 rounded-full bg-[#4CAF50]"
                            animate={{ scale: [1, 1.4, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center bg-[#F8F7F4]">
                          <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                        </div>
                      )}
                      {i < p.phases.length - 1 && (
                        <div
                          className={`w-0.5 flex-1 my-1.5 ${
                            phase.status === "done"
                              ? "bg-[#4CAF50]/40"
                              : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-8 pt-2">
                      <div className="flex items-center justify-between">
                        <p
                          className={`font-medium ${
                            phase.status === "pending"
                              ? "text-[#999]"
                              : "text-[#111]"
                          }`}
                        >
                          {phase.name}
                        </p>
                        {phase.status === "in_progress" && (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-[#4CAF50]/10 text-[#4CAF50] font-medium">
                            En cours
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#999] font-light mt-1">
                        {formatDate(phase.startDate)}
                        {phase.endDate && ` → ${formatDate(phase.endDate)}`}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* PHOTOS */}
            {activeTab === "photos" && (
              <motion.div
                key="photos"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                {p.photos.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center">
                    <div className="w-20 h-20 bg-[#F8F7F4] rounded-2xl mx-auto mb-5 flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-[#ccc]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-[#666] font-light">
                      Aucune photo pour l&apos;instant.
                    </p>
                    <p className="text-sm text-[#999] font-light mt-1">
                      Les photos seront ajoutées au fur et à mesure du chantier.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                    {p.photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="aspect-[4/3] bg-[#F8F7F4] flex items-center justify-center">
                          <svg
                            className="w-10 h-10 text-[#ccc]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div className="p-4">
                          <p className="font-medium text-sm text-[#111]">
                            {photo.caption}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-[#999] font-light">
                              {formatDate(photo.date)}
                            </span>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#4CAF50]/10 text-[#4CAF50]">
                              {photo.phase}
                            </span>
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
              <motion.div
                key="couts"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                {/* Budget summary */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[#666] font-light">
                      Dépensé / Budget
                    </span>
                    <span className="font-medium text-[#111]">
                      {formatCurrency(p.spent)} / {formatCurrency(p.budget)}
                    </span>
                  </div>
                  <ProgressBar value={budgetPct} height="h-2" />
                  <div className="flex justify-between mt-3">
                    <p className="text-xs text-[#999] font-light">
                      {budgetPct}% utilisé
                    </p>
                    <p className="text-xs font-light" style={{ color: budgetPct > 80 ? "#EF4444" : "#4CAF50" }}>
                      {formatCurrency(p.budget - p.spent)} restant
                    </p>
                  </div>
                </div>

                {/* Category summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {(
                    ["materiaux", "main_oeuvre", "permis", "autre"] as const
                  ).map((cat) => {
                    const cc = categoryConfig(cat);
                    const total = p.costs
                      .filter((c) => c.category === cat)
                      .reduce((s, c) => s + c.amount, 0);
                    return (
                      <div
                        key={cat}
                        className="bg-white p-4 rounded-xl border border-gray-100"
                      >
                        <div
                          className="w-2 h-2 rounded-full mb-2"
                          style={{ background: cc.color }}
                        />
                        <p className="text-xs text-[#999] font-light">
                          {cc.label}
                        </p>
                        <p className="text-lg font-light text-[#111]">
                          {formatCurrency(total)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {p.costs.map((cost) => {
                    const cc = categoryConfig(cost.category);
                    return (
                      <div
                        key={cost.id}
                        className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                      >
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ background: cc.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#111] truncate">
                            {cost.label}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className="text-xs px-2.5 py-0.5 rounded-full font-light"
                              style={{ background: cc.bg, color: cc.color }}
                            >
                              {cc.label}
                            </span>
                            <span className="text-xs text-[#999] font-light">
                              {formatDate(cost.date)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-[#111]">
                            {formatCurrency(cost.amount)}
                          </p>
                          <span
                            className={`text-xs font-light ${
                              cost.paid ? "text-[#4CAF50]" : "text-[#F59E0B]"
                            }`}
                          >
                            {cost.paid ? "✓ Payé" : "En attente"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    );
  }

  /* ═══════════════════════════════════════════════════════════════
     DASHBOARD PRINCIPAL
     ═══════════════════════════════════════════════════════════════ */

  return (
    <main className="min-h-screen bg-[#F8F7F4] text-[#111]">
      {/* ─── Navbar (identique à la landing) ─── */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-3xl text-[#4CAF50] font-bold">*</span>
              <span className="text-xl font-light tracking-tight">
                Les Bons Bras
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/chat-renovation"
                className="text-[#666] hover:text-[#111] font-light transition-colors text-sm"
              >
                Assistant IA
              </Link>
              <Link
                href="/trouver-un-professionnel"
                className="text-[#666] hover:text-[#111] font-light transition-colors text-sm"
              >
                Trouver un pro
              </Link>

              {/* User pill */}
              <div className="flex items-center gap-3 bg-[#F8F7F4] pl-4 pr-2 py-1.5 rounded-full">
                <div className="text-right">
                  <p className="text-sm font-medium text-[#111] leading-tight">
                    {profile.full_name}
                  </p>
                  <p className="text-xs text-[#999] font-light">
                    Espace {profile.role}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#4CAF50] flex items-center justify-center text-white text-sm font-medium">
                  {profile.full_name.charAt(0)}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="text-[#999] hover:text-[#666] transition-colors"
                title="Se déconnecter"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    mobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-gray-100 pb-4"
              >
                <div className="pt-4 space-y-3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#4CAF50] flex items-center justify-center text-white font-medium">
                      {profile.full_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{profile.full_name}</p>
                      <p className="text-xs text-[#999] font-light">
                        {profile.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/chat-renovation"
                    className="block py-2 text-[#666] font-light"
                  >
                    Assistant IA
                  </Link>
                  <Link
                    href="/trouver-un-professionnel"
                    className="block py-2 text-[#666] font-light"
                  >
                    Trouver un pro
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block py-2 text-red-500 font-light"
                  >
                    Se déconnecter
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* ─── Content ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Welcome */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-2">
            Bonjour,{" "}
            <span className="text-[#4CAF50]">
              {profile.full_name.split(" ")[0]}
            </span>
          </h1>
          <p className="text-lg text-[#666] font-light">
            Voici un aperçu de vos projets de rénovation.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {[
            {
              label: "Projets actifs",
              value: `${activeCount}`,
              icon: "M13 10V3L4 14h7v7l9-11h-7z",
              color: "#4CAF50",
            },
            {
              label: "Budget total",
              value: formatCurrency(totalBudget),
              icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
              color: "#6366F1",
              sub: `${formatCurrency(totalSpent)} dépensé`,
            },
            {
              label: "Progression moy.",
              value: `${avgProgress}%`,
              icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
              color: "#F59E0B",
            },
            {
              label: "Total projets",
              value: `${projects.length}`,
              icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
              color: "#0EA5E9",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${stat.color}15` }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke={stat.color}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d={stat.icon}
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[#666] font-light">{stat.label}</p>
                  <p className="text-2xl font-light text-[#111] tracking-tight">
                    {stat.value}
                  </p>
                  {stat.sub && (
                    <p
                      className="text-xs font-light mt-0.5"
                      style={{ color: stat.color }}
                    >
                      {stat.sub}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ─── Projects (2 cols) ─── */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light">Mes projets</h2>
              <span className="text-sm text-[#999] font-light">
                {projects.length} projet{projects.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-5">
              {projects.map((project, i) => {
                const sc = statusConfig(project.status);
                const budgetUsed =
                  project.budget > 0
                    ? Math.round((project.spent / project.budget) * 100)
                    : 0;
                const currentPhase = project.phases.find(
                  (ph) => ph.status === "in_progress"
                );

                return (
                  <motion.button
                    key={project.id}
                    onClick={() => {
                      setSelectedProject(project);
                      setActiveTab("apercu");
                    }}
                    className="group w-full text-left bg-white p-7 rounded-3xl border border-gray-100
                               hover:border-[#4CAF50]/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                  >
                    {/* Top row */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{ background: sc.bg, color: sc.color }}
                        >
                          {sc.label}
                        </span>
                        {currentPhase && (
                          <span className="text-xs text-[#999] font-light hidden sm:inline">
                            Phase actuelle : {currentPhase.name}
                          </span>
                        )}
                      </div>
                      <svg
                        className="w-5 h-5 text-[#ccc] group-hover:text-[#4CAF50] group-hover:translate-x-1 transition-all"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-normal text-[#111] mb-1.5 group-hover:text-[#4CAF50] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-[#666] font-light leading-relaxed mb-5 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Progress */}
                    <div className="mb-5">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-[#999] font-light">
                          Progression
                        </span>
                        <span className="text-sm font-medium text-[#4CAF50]">
                          {project.progress}%
                        </span>
                      </div>
                      <ProgressBar value={project.progress} height="h-1.5" />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#4CAF50]/10 flex items-center justify-center">
                          <svg
                            className="w-3.5 h-3.5 text-[#4CAF50]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <span className="text-sm text-[#666] font-light">
                          {project.professional.company}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-light text-[#111]">
                          {formatCurrency(project.budget)}
                        </span>
                        {project.spent > 0 && (
                          <span className="text-xs text-[#999] font-light ml-2">
                            ({budgetUsed}% utilisé)
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* ─── Sidebar: Activity feed ─── */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-light mb-6">Activité récente</h2>

            <div className="bg-white rounded-3xl border border-gray-100 p-6">
              {activities.length === 0 ? (
                <p className="text-[#999] font-light text-sm text-center py-8">
                  Aucune activité pour l&apos;instant.
                </p>
              ) : (
                <div className="space-y-0">
                  {activities.map((act, i) => (
                    <div
                      key={i}
                      className="flex gap-3.5 py-3.5 border-b border-gray-50 last:border-0"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          act.icon === "check"
                            ? "bg-[#4CAF50]/10"
                            : act.icon === "progress"
                            ? "bg-[#6366F1]/10"
                            : "bg-[#F59E0B]/10"
                        }`}
                      >
                        {act.icon === "check" ? (
                          <svg
                            className="w-3.5 h-3.5 text-[#4CAF50]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : act.icon === "progress" ? (
                          <motion.div
                            className="w-2.5 h-2.5 rounded-full bg-[#6366F1]"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        ) : (
                          <svg
                            className="w-3.5 h-3.5 text-[#F59E0B]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 10v1"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#111] font-medium truncate">
                          {act.label}
                        </p>
                        <p className="text-xs text-[#999] font-light mt-0.5">
                          {act.project} · {formatDateShort(act.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div className="mt-6 space-y-3">
              <Link
                href="/chat-renovation"
                className="group flex items-center gap-4 bg-gradient-to-r from-[#4CAF50] to-[#45a049] p-5 rounded-2xl text-white hover:shadow-xl transition-all duration-300"
              >
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm">Assistant IA</p>
                  <p className="text-xs text-white/80 font-light">
                    Posez vos questions rénovation
                  </p>
                </div>
                <svg
                  className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>

              <Link
                href="/trouver-un-professionnel"
                className="group flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 hover:border-[#4CAF50]/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-10 h-10 bg-[#4CAF50]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-[#4CAF50]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm text-[#111]">
                    Trouver un pro
                  </p>
                  <p className="text-xs text-[#999] font-light">
                    2,500+ professionnels vérifiés
                  </p>
                </div>
                <svg
                  className="w-5 h-5 ml-auto text-[#ccc] group-hover:text-[#4CAF50] group-hover:translate-x-1 transition-all"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}