"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import type { ProProfile } from "@/lib/supabase/types";

/* ─────────────────────────── TYPES ─────────────────────────── */

type PlanId = "bras-actif" | "bras-fiable" | "bras-dor";

interface Plan {
  id: PlanId;
  name: string;
  badgeColor: string;
  badgeBg: string;
  monthlyPrice: number;
  commission: number;
  features: string[];
  highlight: boolean;
  description: string;
}

/* ─────────────────────────── DATA ─────────────────────────── */

const PLANS: Plan[] = [
  {
    id: "bras-actif",
    name: "Bras Actif",
    badgeColor: "#2C5F3F",
    badgeBg: "rgba(44,95,63,0.1)",
    monthlyPrice: 99,
    commission: 10,
    features: [
      "Profil sur la plateforme",
      "Accès aux demandes clients",
      "Visibilité standard",
    ],
    highlight: false,
    description: "Idéal pour démarrer et tester la plateforme.",
  },
  {
    id: "bras-fiable",
    name: "Bras Fiable",
    badgeColor: "#6366F1",
    badgeBg: "rgba(99,102,241,0.1)",
    monthlyPrice: 129,
    commission: 7,
    features: [
      "Meilleure visibilité dans les résultats",
      "Badge Fiable",
      "Priorité modérée sur les demandes",
      "Accès à plus de projets",
    ],
    highlight: true,
    description: "Le plan préféré des professionnels établis.",
  },
  {
    id: "bras-dor",
    name: "Bras d'Or",
    badgeColor: "#D97706",
    badgeBg: "rgba(217,119,6,0.1)",
    monthlyPrice: 149,
    commission: 5,
    features: [
      "Top visibilité",
      "Badge Bras d'Or",
      "Accès en premier aux meilleurs projets",
      "Mise en avant spéciale",
    ],
    highlight: false,
    description: "Pour les pros qui veulent le maximum de clients.",
  },
];

/* ─────────────────────────── HELPERS ─────────────────────────── */

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-CA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function LoadingScreen() {
  return (
    <main className="min-h-screen bg-[#F4F0EB] flex items-center justify-center">
      <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.div
          className="w-12 h-12 border-3 border-[#2C5F3F]/20 border-t-[#2C5F3F] rounded-full mx-auto mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-[#666] font-light text-lg">Chargement...</p>
      </motion.div>
    </main>
  );
}

/* ─────────────────────────── PLAN CARD ─────────────────────────── */

function PlanCard({
  plan,
  isCurrentPlan,
  onSelect,
  pending,
}: {
  plan: Plan;
  isCurrentPlan: boolean;
  onSelect: (id: PlanId) => void;
  pending: boolean;
}) {
  return (
    <motion.div
      className={`relative bg-white rounded-3xl border-2 p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        plan.highlight
          ? "border-[#2C5F3F] shadow-lg"
          : isCurrentPlan
          ? "border-[#2C5F3F]/50"
          : "border-gray-100"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {plan.highlight && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-[#2C5F3F] text-white text-xs font-medium px-4 py-1.5 rounded-full">
            Le plus populaire
          </span>
        </div>
      )}

      <div className="flex items-start gap-4 mb-6">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl font-bold"
          style={{ background: plan.badgeBg, color: plan.badgeColor }}
        >
          ✳
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[#111] uppercase tracking-wide">
            {plan.name}
          </h3>
          <p className="text-sm text-[#666] font-light mt-0.5">{plan.description}</p>
        </div>
      </div>

      <div className="mb-6 pb-6 border-b border-gray-100">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-light text-[#111]">{plan.monthlyPrice}$</span>
          <span className="text-[#666] font-light text-sm">/ mois</span>
        </div>
        <div className="mt-2">
          <span
            className="text-sm font-medium px-3 py-1 rounded-full"
            style={{ background: plan.badgeBg, color: plan.badgeColor }}
          >
            + {plan.commission}% par projet
          </span>
        </div>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-[#444] font-light">
            <svg
              className="w-4 h-4 mt-0.5 flex-shrink-0"
              fill="none"
              stroke={plan.badgeColor}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>

      {isCurrentPlan ? (
        <div className="w-full py-3 rounded-full bg-[#2C5F3F]/10 text-[#2C5F3F] text-sm font-medium text-center">
          ✓ Plan actuel
        </div>
      ) : (
        <button
          onClick={() => onSelect(plan.id)}
          disabled={pending}
          className={`w-full py-3 rounded-full text-sm font-medium transition-all disabled:opacity-50 ${
            plan.highlight
              ? "bg-[#2C5F3F] text-white hover:bg-[#234B32] shadow-lg"
              : "bg-[#F4F0EB] text-[#2C5F3F] hover:bg-[#2C5F3F] hover:text-white"
          }`}
        >
          {pending ? "Enregistrement..." : "Choisir ce plan"}
        </button>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BILLING PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function FacturationPage() {
  const router = useRouter();
  const supabase = createClient();
  const { role, profile, userId, loading } = useUserRole();

  const [currentPlan, setCurrentPlan] = useState<PlanId>("bras-actif");
  const [subscriptionStatus, setSubscriptionStatus] = useState<"active" | "canceled" | "pending">("active");
  const [renewalDate, setRenewalDate] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  /* Load subscription from Supabase once profile is ready */
  useEffect(() => {
    if (loading || !userId || role !== "professionnel") return;

    async function fetchSubscription() {
      const { data, error } = await (supabase.from("pro_profiles") as any)
        .select("subscription_plan, subscription_status, subscription_started_at, subscription_renewal_date")
        .eq("user_id", userId)
        .single();

      if (!error && data) {
        if (data.subscription_plan) setCurrentPlan(data.subscription_plan as PlanId);
        if (data.subscription_status) setSubscriptionStatus(data.subscription_status);
        if (data.subscription_renewal_date) setRenewalDate(data.subscription_renewal_date);
        if (data.subscription_started_at) setStartedAt(data.subscription_started_at);
      }
      setDataLoaded(true);
    }

    fetchSubscription();
  }, [loading, userId, role]);

  /* Redirect non-pros */
  useEffect(() => {
    if (!loading && role !== "professionnel") {
      router.push("/dashboard");
    }
  }, [loading, role, router]);

  if (loading || !dataLoaded || (!loading && role !== "professionnel")) return <LoadingScreen />;

  const displayName = (profile as ProProfile | null)?.full_name || "Professionnel";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSelectPlan = async (planId: PlanId) => {
    if (planId === currentPlan) return;
    setPending(true);

    const now = new Date();
    const renewal = new Date(now);
    renewal.setMonth(renewal.getMonth() + 1);

    const { error } = await (supabase.from("pro_profiles") as any)
      .update({
        subscription_plan: planId,
        subscription_status: "active",
        subscription_started_at: now.toISOString(),
        subscription_renewal_date: renewal.toISOString(),
      })
      .eq("user_id", userId);

    if (error) {
      showToast("error", "Erreur lors du changement de plan. Réessayez.");
    } else {
      setCurrentPlan(planId);
      setSubscriptionStatus("active");
      setStartedAt(now.toISOString());
      setRenewalDate(renewal.toISOString());
      showToast("success", `Plan ${PLANS.find((p) => p.id === planId)?.name} activé avec succès !`);
    }

    setPending(false);
  };

  const activePlan = PLANS.find((p) => p.id === currentPlan)!;

  return (
    <main className="min-h-screen bg-[#F4F0EB] text-[#111]">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl text-[#2C5F3F] font-bold">*</span>
              <span className="text-xl font-light tracking-tight">Les Bons Bras</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard/entrepreneur"
                className="text-sm text-[#666] hover:text-[#2C5F3F] font-light transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Tableau de bord
              </Link>
              <div className="flex items-center gap-3 bg-[#F4F0EB] pl-4 pr-2 py-1.5 rounded-full">
                <div className="text-right">
                  <p className="text-sm font-medium text-[#111] leading-tight">{displayName}</p>
                  <p className="text-xs text-[#999] font-light">Espace pro</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#2C5F3F] flex items-center justify-center text-white text-sm font-medium">
                  {displayName.charAt(0)}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-[#999] hover:text-[#666] transition-colors"
                title="Se déconnecter"
              >
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
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-gray-100 pb-4"
              >
                <div className="pt-4 space-y-3">
                  <Link href="/dashboard/entrepreneur" className="block py-2 text-sm text-[#666] font-light">
                    ← Tableau de bord
                  </Link>
                  <button onClick={handleLogout} className="block py-2 text-red-500 font-light">
                    Se déconnecter
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">

        {/* Page header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#2C5F3F] text-white rounded-xl flex items-center justify-center font-bold text-lg">
              ✳
            </div>
            <p className="text-xs uppercase tracking-widest text-[#999] font-medium">
              Système de niveaux
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-3">
            Mon <span className="text-[#2C5F3F]">abonnement</span>
          </h1>
          <p className="text-lg text-[#666] font-light max-w-xl">
            Choisissez le plan qui correspond à vos ambitions. Changez de niveau à tout moment.
          </p>
        </motion.div>

        {/* Current plan banner */}
        <motion.div
          className="bg-white border border-[#2C5F3F]/20 rounded-2xl p-5 mb-10 flex flex-col sm:flex-row sm:items-center gap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: activePlan.badgeBg, color: activePlan.badgeColor }}
          >
            ✳
          </div>
          <div className="flex-1">
            <p className="text-sm text-[#666] font-light">Votre abonnement actuel</p>
            <p className="text-lg font-medium text-[#111]">
              {activePlan.name} —{" "}
              <span className="font-light text-[#2C5F3F]">
                {activePlan.monthlyPrice}$ / mois + {activePlan.commission}% par projet
              </span>
            </p>
            {renewalDate && (
              <p className="text-xs text-[#999] font-light mt-1">
                Prochain renouvellement : {formatDate(renewalDate)}
                {startedAt && ` · Actif depuis le ${formatDate(startedAt)}`}
              </p>
            )}
          </div>
          <span
            className={`self-start sm:self-center px-3 py-1 text-xs font-medium rounded-full ${
              subscriptionStatus === "active"
                ? "bg-[#2C5F3F]/10 text-[#2C5F3F]"
                : subscriptionStatus === "canceled"
                ? "bg-red-50 text-red-600"
                : "bg-amber-50 text-amber-600"
            }`}
          >
            {subscriptionStatus === "active" ? "Actif" : subscriptionStatus === "canceled" ? "Annulé" : "En attente"}
          </span>
        </motion.div>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl text-sm font-medium z-50 flex items-center gap-2 ${
                toast.type === "success" ? "bg-[#2C5F3F] text-white" : "bg-red-600 text-white"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={toast.type === "success" ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}
                />
              </svg>
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Plans grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={currentPlan === plan.id}
              onSelect={handleSelectPlan}
              pending={pending}
            />
          ))}
        </motion.div>

        {/* FAQ */}
        <motion.div
          className="bg-white rounded-3xl border border-gray-100 p-8 md:p-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <h2 className="text-2xl font-light mb-8">Questions fréquentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                q: "Puis-je changer de plan à tout moment ?",
                a: "Oui. Le changement prend effet immédiatement et la facturation est ajustée au prorata.",
              },
              {
                q: "Comment la commission est-elle calculée ?",
                a: "La commission est prélevée uniquement sur les projets réalisés via la plateforme, sur le montant total facturé au client.",
              },
              {
                q: "Que se passe-t-il si j'annule mon abonnement ?",
                a: "Votre profil reste visible jusqu'à la fin de la période déjà payée. Aucun remboursement partiel n'est effectué.",
              },
              {
                q: "Le badge change-t-il immédiatement ?",
                a: "Oui, votre badge et votre niveau de visibilité sont mis à jour dès l'activation du nouveau plan.",
              },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <p className="font-medium text-[#111] text-sm">{item.q}</p>
                <p className="text-sm text-[#666] font-light leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Back link */}
        <div className="mt-10 text-center">
          <Link
            href="/dashboard/entrepreneur"
            className="inline-flex items-center gap-2 text-sm text-[#999] hover:text-[#2C5F3F] font-light transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    </main>
  );
}
