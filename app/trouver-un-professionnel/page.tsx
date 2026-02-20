"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { ProProfile, ProPortfolio } from "@/lib/supabase/types";

/* ─────────────────────────── CONSTANTS ─────────────────────────── */

const CATEGORIES = [
  { id: "all", label: "Tous", icon: "🏠" },
  { id: "architecte", label: "Architecte", icon: "📐" },
  { id: "designer", label: "Designer", icon: "✨" },
  { id: "plombier", label: "Plombier", icon: "💧" },
  { id: "electricien", label: "Électricien", icon: "⚡" },
  { id: "entrepreneur_general", label: "Entrepreneur gén.", icon: "🏗️" },
  { id: "paysagiste", label: "Paysagiste", icon: "🌿" },
];

type ProWithPortfolio = ProProfile & { portfolio: ProPortfolio[] };

/* ─────────────────────────── HELPERS ─────────────────────────── */

function formatRate(rate: number | null) {
  if (!rate) return null;
  return new Intl.NumberFormat("fr-CA", { style: "currency", currency: "CAD", minimumFractionDigits: 0 }).format(rate);
}

function getSpecialtyLabels(ids: string[]) {
  return ids
    .map((id) => CATEGORIES.find((c) => c.id === id)?.label || id)
    .join(", ");
}

/* ═══════════════════════════════════════════════════════════════
   PAGE TROUVER UN PROFESSIONNEL
   ═══════════════════════════════════════════════════════════════ */

export default function TrouverUnProfessionnelPage() {
  const router = useRouter();
  const supabase = createClient();

  const [pros, setPros] = useState<ProWithPortfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPro, setSelectedPro] = useState<ProWithPortfolio | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestTitle, setRequestTitle] = useState("");
  const [requestDescription, setRequestDescription] = useState("");
  const [requestBudget, setRequestBudget] = useState("");
  const [requestAddress, setRequestAddress] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [sendingRequest, setSendingRequest] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const handleSendRequest = async () => {
    if (!currentUserId || !selectedPro) return;
    setSendingRequest(true);
    setRequestError(null);

    try {
      // 1. Créer le projet
      const { data: project, error: projectError } = await (supabase.from("projects") as any)
        .insert({
          client_id: currentUserId,
          title: requestTitle,
          description: requestDescription,
          budget: requestBudget ? parseFloat(requestBudget) : 0,
          address: requestAddress || null,
          status: "planifie",
          progress: 0,
          spent: 0,
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // 2. Créer la demande au pro
      const { error: requestError } = await (supabase.from("project_requests") as any)
        .insert({
          project_id: project.id,
          client_id: currentUserId,
          pro_id: selectedPro.user_id,
          status: "pending",
          message: requestMessage || null,
        });

      if (requestError) throw requestError;

      setRequestSent(true);
    } catch (err: any) {
      setRequestError(err.message || "Une erreur est survenue.");
    } finally {
      setSendingRequest(false);
    }
  };
/* ─── Check auth ─── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setCurrentUserId(session?.user?.id || null);
    });
  }, []);
  
  /* ─── Fetch pros ─── */
  useEffect(() => {
    async function fetchPros() {
      setLoading(true);

      const { data: profiles, error } = await (supabase.from("pro_profiles") as any)
        .select("*")
        .eq("onboarding_complete", true)
        .order("rating", { ascending: false });

      if (error || !profiles) {
        console.error("Error fetching pros:", JSON.stringify(error, null, 2));
        setLoading(false);
        return;
      }

      // Fetch portfolio for each pro
      const proIds = profiles.map((p: any) => p.user_id);
      const { data: portfolios } = await (supabase.from("pro_portfolio") as any)
        .select("*")
        .in("pro_id", proIds.length > 0 ? proIds : ["none"]);

      const prosWithPortfolio: ProWithPortfolio[] = profiles.map((p: any) => ({
        ...p,
        portfolio: (portfolios || []).filter((ph: any) => ph.pro_id === p.user_id),
      }));

      setPros(prosWithPortfolio);
      setLoading(false);
    }
    fetchPros();
  }, []);

  /* ─── Filter ─── */
  const filteredPros = pros.filter((p) => {
    const matchesCategory =
      selectedCategory === "all" || (p.specialty && p.specialty.includes(selectedCategory));
    const matchesSearch =
      searchQuery === "" ||
      p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.service_area || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  /* ═══════════════════════════════════════════════════════════════
     VUE PROFIL DÉTAILLÉ
     ═══════════════════════════════════════════════════════════════ */

  if (selectedPro) {
    const p = selectedPro;
    return (
      <main className="min-h-screen bg-[#F8F7F4] text-[#111]">
        <nav className="sticky top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={() => setSelectedPro(null)}
                className="flex items-center gap-2 text-[#666] hover:text-[#111] font-light transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Retour
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <motion.div
            className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8 md:p-10 mb-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {p.avatar_url ? (
                  <img src={p.avatar_url} alt={p.full_name} className="w-32 h-32 rounded-2xl object-cover" />
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-[#4CAF50] flex items-center justify-center text-white text-4xl font-light">
                    {p.full_name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-light tracking-tight">{p.full_name}</h1>
                    <p className="text-lg text-[#4CAF50] font-light">{p.company_name}</p>
                  </div>
                  {p.verified && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#4CAF50]/10 text-[#4CAF50]">
                      ✓ Vérifié
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  {p.specialty?.map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full text-xs font-light bg-[#F8F7F4] text-[#666] border border-gray-100">
                      {CATEGORIES.find((c) => c.id === s)?.icon} {CATEGORIES.find((c) => c.id === s)?.label || s}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#666] font-light">
                  {p.service_area && (
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {p.service_area}
                    </span>
                  )}
                  {p.years_experience > 0 && (
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {p.years_experience} ans d&apos;expérience
                    </span>
                  )}
                  {p.hourly_rate && (
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 10v1" />
                      </svg>
                      {formatRate(p.hourly_rate)}/h
                    </span>
                  )}
                  {p.license_rbq && (
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      RBQ : {p.license_rbq}
                    </span>
                  )}
                </div>

                {/* Rating */}
                {p.rating > 0 && (
                  <div className="flex items-center gap-2 mt-4">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className={`w-5 h-5 ${star <= Math.round(p.rating) ? "text-[#F59E0B]" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-[#666] font-light">{p.rating.toFixed(1)} ({p.total_reviews} avis)</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Bio */}
          {(p.bio || p.description) && (
            <motion.div
              className="bg-white rounded-2xl border border-gray-100 p-8 mb-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-xl font-light mb-4">À propos</h2>
              <p className="text-[#666] font-light leading-relaxed whitespace-pre-line">{p.bio || p.description}</p>
            </motion.div>
          )}

          {/* Portfolio */}
          {p.portfolio.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-light mb-6">Réalisations</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {p.portfolio.map((photo) => (
                  <div key={photo.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <img src={photo.url} alt={photo.caption || ""} className="aspect-[4/3] w-full object-cover" />
                    {photo.caption && (
                      <div className="p-4">
                        <p className="text-sm text-[#111] font-light">{photo.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* CTA / Request form */}
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {!isLoggedIn ? (
              <div className="bg-gradient-to-r from-[#4CAF50] to-[#45a049] rounded-3xl p-8 text-white text-center">
                <h2 className="text-2xl font-light mb-3">Intéressé par ce professionnel ?</h2>
                <p className="text-white/80 font-light mb-6">Connectez-vous pour envoyer une demande.</p>
                <Link href="/connexion" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#4CAF50] text-sm font-medium hover:shadow-xl transition-all">
                  Se connecter
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>
            ) : requestSent ? (
              <div className="bg-white rounded-3xl border border-[#4CAF50]/30 p-8 text-center">
                <div className="w-16 h-16 bg-[#4CAF50]/10 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-light text-[#111] mb-2">Demande envoyée !</h2>
                <p className="text-[#666] font-light mb-6">{p.full_name} recevra votre demande et pourra l&apos;accepter depuis son tableau de bord.</p>
                <div className="flex gap-3 justify-center">
                  <Link href="/dashboard/client" className="px-6 py-3 rounded-full bg-[#4CAF50] text-white text-sm font-medium hover:bg-[#45a049] shadow-lg transition-all">
                    Mon tableau de bord
                  </Link>
                  <button onClick={() => { setSelectedPro(null); setRequestSent(false); setShowRequestForm(false); }} className="px-6 py-3 rounded-full bg-white text-[#666] text-sm font-medium border border-gray-200 hover:border-gray-300 transition-all">
                    Voir d&apos;autres pros
                  </button>
                </div>
              </div>
            ) : !showRequestForm ? (
              <div className="bg-gradient-to-r from-[#4CAF50] to-[#45a049] rounded-3xl p-8 text-white text-center">
                <h2 className="text-2xl font-light mb-3">Intéressé par ce professionnel ?</h2>
                <p className="text-white/80 font-light mb-6">Décrivez votre projet et envoyez une demande directement.</p>
                <button
                  onClick={() => setShowRequestForm(true)}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#4CAF50] text-sm font-medium hover:shadow-xl transition-all"
                >
                  Demander un devis
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8">
                <h2 className="text-2xl font-light text-[#111] mb-2">Envoyer une demande à {p.full_name}</h2>
                <p className="text-[#666] font-light mb-8">Décrivez votre projet pour que le professionnel puisse évaluer votre demande.</p>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm text-[#666] font-light mb-1.5">Titre du projet *</label>
                    <input type="text" value={requestTitle} onChange={(e) => setRequestTitle(e.target.value)} placeholder="Ex: Rénovation cuisine complète"
                      className="w-full bg-[#F8F7F4] border border-gray-200 rounded-xl px-5 py-3.5 text-[#111] placeholder:text-[#999] text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm text-[#666] font-light mb-1.5">Description *</label>
                    <textarea value={requestDescription} onChange={(e) => setRequestDescription(e.target.value)} rows={4} placeholder="Décrivez les travaux souhaités, l'état actuel, vos attentes..."
                      className="w-full bg-[#F8F7F4] border border-gray-200 rounded-xl px-5 py-3.5 text-[#111] placeholder:text-[#999] text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-[#666] font-light mb-1.5">Budget estimé ($)</label>
                      <input type="number" value={requestBudget} onChange={(e) => setRequestBudget(e.target.value)} placeholder="25000"
                        className="w-full bg-[#F8F7F4] border border-gray-200 rounded-xl px-5 py-3.5 text-[#111] placeholder:text-[#999] text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm text-[#666] font-light mb-1.5">Adresse des travaux</label>
                      <input type="text" value={requestAddress} onChange={(e) => setRequestAddress(e.target.value)} placeholder="1234 rue Exemple, Montréal"
                        className="w-full bg-[#F8F7F4] border border-gray-200 rounded-xl px-5 py-3.5 text-[#111] placeholder:text-[#999] text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[#666] font-light mb-1.5">Message personnel (optionnel)</label>
                    <textarea value={requestMessage} onChange={(e) => setRequestMessage(e.target.value)} rows={3} placeholder="Bonjour, j'aimerais discuter de mon projet..."
                      className="w-full bg-[#F8F7F4] border border-gray-200 rounded-xl px-5 py-3.5 text-[#111] placeholder:text-[#999] text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all resize-none" />
                  </div>

                  {requestError && (
                    <div className="px-5 py-3 rounded-xl text-sm font-light bg-red-50 text-red-600 border border-red-100">{requestError}</div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleSendRequest}
                      disabled={sendingRequest || !requestTitle.trim() || !requestDescription.trim()}
                      className="flex-1 py-4 rounded-full text-sm font-medium text-white bg-[#4CAF50] hover:bg-[#45a049] shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {sendingRequest ? (
                        <>
                          <motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          Envoyer la demande
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setShowRequestForm(false)}
                      className="px-6 py-4 rounded-full text-sm font-medium text-[#666] bg-white border border-gray-200 hover:border-gray-300 transition-all"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    );
  }

  /* ═══════════════════════════════════════════════════════════════
     LISTE DES PROFESSIONNELS
     ═══════════════════════════════════════════════════════════════ */

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
            <div className="hidden md:flex items-center gap-8">
              <Link href="/chat-renovation" className="text-[#666] hover:text-[#111] font-light transition-colors">Assistant IA</Link>
              <Link href="/devenir-professionnel" className="text-[#666] hover:text-[#111] font-light transition-colors">Devenir pro</Link>
              {isLoggedIn ? (
                <Link href="/dashboard" className="px-6 py-2.5 rounded-full bg-[#4CAF50] text-white text-sm font-medium hover:bg-[#45a049] shadow-lg transition-all">
                  Mon tableau de bord
                </Link>
              ) : (
                <Link href="/connexion" className="px-6 py-2.5 rounded-full bg-[#4CAF50] text-white text-sm font-medium hover:bg-[#45a049] shadow-lg transition-all">
                  Connexion
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Header */}
        <motion.div className="mb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-3">
            Trouvez votre <span className="text-[#4CAF50]">professionnel</span>
          </h1>
          <p className="text-lg text-[#666] font-light max-w-2xl">
            Parcourez notre réseau de professionnels vérifiés pour votre prochain projet de rénovation.
          </p>
        </motion.div>

        {/* Search + Filters */}
        <motion.div className="mb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          {/* Search bar */}
          <div className="relative mb-6">
            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom, entreprise, zone..."
              className="w-full bg-white border border-gray-200 rounded-full pl-14 pr-5 py-4 text-[#111] placeholder:text-[#999] text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#4CAF50] shadow-sm transition-all"
            />
          </div>

          {/* Category filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-light whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? "bg-[#4CAF50] text-white shadow-lg"
                    : "bg-white text-[#666] border border-gray-100 hover:border-[#4CAF50]/30 hover:shadow-md"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-[#999] font-light">
            {loading ? "Chargement..." : `${filteredPros.length} professionnel${filteredPros.length > 1 ? "s" : ""} trouvé${filteredPros.length > 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <motion.div
              className="w-12 h-12 border-3 border-[#4CAF50]/20 border-t-[#4CAF50] rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredPros.length === 0 && (
          <motion.div
            className="bg-white p-16 rounded-3xl border border-gray-100 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-20 h-20 bg-[#F8F7F4] rounded-2xl mx-auto mb-5 flex items-center justify-center">
              <svg className="w-10 h-10 text-[#ccc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-light text-[#111] mb-2">Aucun professionnel trouvé</h3>
            <p className="text-[#666] font-light">
              {searchQuery ? "Essayez avec d'autres termes de recherche." : "Aucun professionnel inscrit dans cette catégorie pour l'instant."}
            </p>
          </motion.div>
        )}

        {/* Pro cards grid */}
        {!loading && filteredPros.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPros.map((pro, i) => (
              <motion.button
                key={pro.id}
                onClick={() => setSelectedPro(pro)}
                className="group text-left bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 * i }}
              >
                {/* Portfolio preview */}
                {pro.portfolio.length > 0 ? (
                  <img src={pro.portfolio[0].url} alt="" className="w-full aspect-[16/9] object-cover" />
                ) : (
                  <div className="w-full aspect-[16/9] bg-gradient-to-br from-[#4CAF50]/10 to-[#4CAF50]/5 flex items-center justify-center">
                    <span className="text-5xl opacity-50">
                      {CATEGORIES.find((c) => pro.specialty?.includes(c.id))?.icon || "🏠"}
                    </span>
                  </div>
                )}

                <div className="p-6">
                  {/* Avatar + Name */}
                  <div className="flex items-center gap-3 mb-4">
                    {pro.avatar_url ? (
                      <img src={pro.avatar_url} alt={pro.full_name} className="w-12 h-12 rounded-xl object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#4CAF50] flex items-center justify-center text-white font-medium">
                        {pro.full_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-[#111] group-hover:text-[#4CAF50] transition-colors">{pro.full_name}</h3>
                      <p className="text-sm text-[#666] font-light">{pro.company_name}</p>
                    </div>
                    {pro.verified && (
                      <span className="ml-auto text-[#4CAF50] flex-shrink-0">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </span>
                    )}
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {pro.specialty?.slice(0, 3).map((s) => (
                      <span key={s} className="px-2.5 py-0.5 rounded-full text-xs font-light bg-[#F8F7F4] text-[#666]">
                        {CATEGORIES.find((c) => c.id === s)?.label || s}
                      </span>
                    ))}
                  </div>

                  {/* Bio excerpt */}
                  {(pro.bio || pro.description) && (
                    <p className="text-sm text-[#666] font-light line-clamp-2 mb-4">{pro.bio || pro.description}</p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-3 text-xs text-[#999] font-light">
                      {pro.service_area && <span>{pro.service_area}</span>}
                      {pro.years_experience > 0 && <span>· {pro.years_experience} ans</span>}
                    </div>
                    {pro.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-[#F59E0B]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span className="text-sm font-light text-[#111]">{pro.rating.toFixed(1)}</span>
                      </div>
                    )}
                    {pro.hourly_rate && !pro.rating && (
                      <span className="text-sm font-light text-[#4CAF50]">{formatRate(pro.hourly_rate)}/h</span>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}