"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { ProProfile, ProPortfolio, Review, PortfolioItem } from "@/lib/supabase/types";
import ProMap from "@/components/ProMap";

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

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 1) return "aujourd'hui";
  if (days < 7) return `il y a ${days} jour${days > 1 ? 's' : ''}`;
  if (days < 30) return `il y a ${Math.floor(days / 7)} sem.`;
  if (days < 365) return `il y a ${Math.floor(days / 30)} mois`;
  return `il y a ${Math.floor(days / 365)} an${Math.floor(days / 365) > 1 ? 's' : ''}`;
}

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
  const searchParams = useSearchParams();
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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const handleSendRequest = async () => {
    if (!currentUserId || !selectedPro) return;
    setSendingRequest(true);
    setRequestError(null);

    try {
      // 0. S'assurer que le profil client existe (rattrapage si absent)
      const { data: existingProfile } = await (supabase.from("client_profiles") as any)
        .select("id").eq("user_id", currentUserId).single();

      if (!existingProfile) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await (supabase.from("client_profiles") as any).upsert({
            user_id: currentUserId,
            full_name: user.user_metadata?.full_name || "Client",
            email: user.email || "",
            phone: user.user_metadata?.phone || null,
          }, { onConflict: "user_id" });
        }
      }

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
      const { error: insertError } = await (supabase.from("project_requests") as any)
        .insert({
          project_id: project.id,
          client_id: currentUserId,
          pro_id: selectedPro.user_id,
          status: "pending",
          message: requestMessage || null,
        });

      if (insertError) throw insertError;

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

      // Si ?pro=userId dans l'URL, ouvrir le profil directement
      const proId = searchParams.get("pro");
      if (proId) {
        const target = prosWithPortfolio.find((p) => p.user_id === proId);
        if (target) setSelectedPro(target);
      }
    }
    fetchPros();
  }, []);

  /* ─── Fetch reviews when a pro is selected ─── */
  useEffect(() => {
    if (!selectedPro) { setReviews([]); return; }
    async function fetchReviews() {
      setReviewsLoading(true);
      const { data } = await (supabase.from("reviews") as any)
        .select("*")
        .eq("pro_id", selectedPro!.id)
        .order("created_at", { ascending: false })
        .limit(10);
      setReviews(data || []);
      setReviewsLoading(false);
    }
    fetchReviews();
  }, [selectedPro]);

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
    const portfolioItems: PortfolioItem[] = p.portfolio_items
      ? (typeof p.portfolio_items === 'string' ? JSON.parse(p.portfolio_items as unknown as string) : p.portfolio_items)
      : [];

    return (
      <main className="min-h-screen bg-[#F4F0EB] text-[#111]">
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
          {/* ── Header ── */}
          <motion.div
            className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              {p.cover_url ? (
                <img src={p.cover_url} alt="" className="w-full aspect-[3/1] object-cover" />
              ) : (
                <div className="w-full aspect-[3/1] bg-gradient-to-br from-[#2C5F3F]/20 to-[#2C5F3F]/5" />
              )}
              <div className="absolute bottom-0 left-8 md:left-10 translate-y-1/2">
                {p.avatar_url ? (
                  <img src={p.avatar_url} alt={p.full_name} className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover border-4 border-white shadow-lg" />
                ) : (
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-[#2C5F3F] flex items-center justify-center text-white text-4xl font-light border-4 border-white shadow-lg">
                    {p.full_name.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-16 md:pt-18 px-8 md:px-10 pb-8 md:pb-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-light tracking-tight">{p.full_name}</h1>
                  <p className="text-lg text-[#2C5F3F] font-light">{p.company_name}</p>
                </div>
                {p.verified && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#2C5F3F]/10 text-[#2C5F3F]">
                    ✓ Vérifié
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                {p.specialty?.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full text-xs font-light bg-[#F4F0EB] text-[#666] border border-gray-100">
                    {CATEGORIES.find((c) => c.id === s)?.icon} {CATEGORIES.find((c) => c.id === s)?.label || s}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#666] font-light">
                {p.service_area && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-[#2C5F3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {p.service_area}
                  </span>
                )}
                {p.years_experience > 0 && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-[#2C5F3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {p.years_experience} ans d&apos;expérience
                  </span>
                )}
                {p.hourly_rate && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-[#2C5F3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 10v1" />
                    </svg>
                    {formatRate(p.hourly_rate)}/h
                  </span>
                )}
                {p.license_rbq && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-[#2C5F3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    RBQ : {p.license_rbq}
                  </span>
                )}
              </div>

              {p.rating > 0 && (
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className={`w-5 h-5 ${star <= Math.round(p.rating) ? "text-[#E2711D]" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-[#666] font-light">{p.rating.toFixed(1)} ({p.total_reviews} avis)</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* ── Tagline ── */}
          {p.tagline && (
            <motion.div
              className="bg-[#f5f1eb] border-l-4 border-[#2C5F3F] px-6 py-4 mb-6 rounded-r-xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <p className="text-xl italic text-[#2C5F3F] font-medium">&ldquo;{p.tagline}&rdquo;</p>
            </motion.div>
          )}

          {/* ── Bio (left) + Infos sidebar (right) ── */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Bio — 2 cols */}
            {(p.bio || p.description) && (
              <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 p-8">
                <h2 className="text-xl font-light mb-4">À propos</h2>
                <p className="text-[#666] font-light leading-relaxed whitespace-pre-line">{p.bio || p.description}</p>
              </div>
            )}

            {/* Sidebar infos — 1 col */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 md:sticky md:top-24 self-start">
              {/* Availability badge */}
              {p.availability && (
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                  p.availability.includes('Disponible') && !p.availability.includes('Liste')
                    ? 'bg-green-50 text-green-700'
                    : p.availability.includes('Liste')
                    ? 'bg-orange-50 text-orange-700'
                    : 'bg-blue-50 text-blue-700'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-current" />
                  {p.availability}
                </div>
              )}

              {/* Company info */}
              <div className="space-y-2.5 text-sm">
                {p.founded_year && (
                  <div className="flex items-center gap-2.5 text-[#666]">
                    <span className="text-base">🗓</span>
                    <span>En activité depuis {p.founded_year} ({new Date().getFullYear() - p.founded_year} ans)</span>
                  </div>
                )}
                {p.team_size && (
                  <div className="flex items-center gap-2.5 text-[#666]">
                    <span className="text-base">👥</span>
                    <span>{p.team_size === 1 ? 'Artisan solo' : `Équipe de ${p.team_size} personnes`}</span>
                  </div>
                )}
                {p.languages && p.languages.length > 0 && (
                  <div className="flex items-center gap-2.5 text-[#666]">
                    <span className="text-base">🌍</span>
                    <span>{p.languages.join(' · ')}</span>
                  </div>
                )}
              </div>

              {/* Web links */}
              {(p.website || p.instagram || p.facebook) && (
                <div className="pt-3 border-t border-gray-100 space-y-2.5">
                  {p.website && (
                    <a href={p.website} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-sm text-[#2C5F3F] hover:underline">
                      <span className="text-base">🌐</span> {p.website.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  )}
                  {p.instagram && (
                    <a href={`https://instagram.com/${p.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-sm text-pink-600 hover:underline">
                      <span className="text-base">📸</span> {p.instagram}
                    </a>
                  )}
                  {p.facebook && (
                    <div className="flex items-center gap-2.5 text-sm text-blue-600">
                      <span className="text-base">👍</span> {p.facebook}
                    </div>
                  )}
                </div>
              )}

              {/* CTA button */}
              <button
                onClick={() => setShowRequestForm(true)}
                className="w-full py-3 bg-[#2C5F3F] text-white rounded-full text-sm font-medium hover:bg-[#1a3d27] transition-colors shadow-lg mt-2"
              >
                Demander un devis →
              </button>
            </div>
          </motion.div>

          {/* ── Certifications ── */}
          {p.certifications && p.certifications.length > 0 && (
            <motion.div
              className="bg-white rounded-2xl border border-gray-100 p-6 mb-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <h2 className="text-lg font-semibold mb-4">Certifications & Accréditations</h2>
              <div className="flex flex-wrap gap-2">
                {p.certifications.map((cert, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f0f7f2] text-[#2C5F3F] text-sm rounded-full border border-[#c8dfd0]">
                    <span className="text-xs">✓</span>
                    {cert}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Portfolio items (JSONB) ── */}
          {portfolioItems.length > 0 && (
            <motion.div
              className="bg-white rounded-2xl border border-gray-100 p-6 mb-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-lg font-semibold mb-6">Portfolio — Projets réalisés</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolioItems.map((item, i) => (
                  <div key={i} className="group relative bg-[#f9f7f4] rounded-xl p-5 border border-gray-100 hover:border-[#2C5F3F] transition-colors">
                    <span className="absolute top-4 right-4 text-xs text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                      {item.year}
                    </span>
                    <h3 className="font-semibold text-gray-800 mb-2 pr-12">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-3">{item.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag, j) => (
                        <span key={j} className="text-xs px-2 py-0.5 bg-white text-gray-500 rounded-full border border-gray-200">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Photo portfolio (existing pro_portfolio images) ── */}
          {p.portfolio.length > 0 && (
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
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

          {/* ── Map ── */}
          {p.address && p.latitude && p.longitude && (
            <motion.div
              className="bg-white rounded-2xl border border-gray-100 p-6 mb-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-lg font-semibold mb-1">Zone de service</h2>
              <p className="text-[#666] text-sm font-light mb-4 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#2C5F3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {p.address}
              </p>
              <ProMap
                latitude={Number(p.latitude)}
                longitude={Number(p.longitude)}
                proName={p.full_name}
              />
            </motion.div>
          )}

          {/* ── Reviews ── */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <h2 className="text-xl font-light mb-6">Avis clients</h2>
            {reviewsLoading ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <div className="w-6 h-6 border-2 border-[#2C5F3F] border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-lg font-medium text-[#111] mb-2">Aucun avis pour l&apos;instant</h3>
                <p className="text-sm text-[#999] font-light">Soyez le premier à laisser un avis après votre projet.</p>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl font-light text-[#111]">{p.rating.toFixed(1)}</span>
                    <div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className={`w-5 h-5 ${star <= Math.round(p.rating) ? "text-[#E2711D]" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm text-[#666] font-light mt-0.5">{p.total_reviews} avis</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviews.filter((r) => Math.round(r.rating) === star).length;
                      const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-2 text-sm">
                          <span className="w-4 text-[#666] font-light text-right">{star}</span>
                          <svg className="w-3.5 h-3.5 text-[#E2711D]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#E2711D] rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-6 text-[#999] font-light text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#e8f0e9] flex items-center justify-center text-[#2C5F3F] font-semibold text-sm">
                            {review.client_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-[#111] text-sm">{review.client_name.split(' ').length >= 2 ? `${review.client_name.charAt(0)}. ${review.client_name.split(' ').slice(1).join(' ')}` : review.client_name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <svg key={star} className={`w-3.5 h-3.5 ${star <= Math.round(review.rating) ? "text-[#E2711D]" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                  </svg>
                                ))}
                              </div>
                              {review.project_type && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-[#F4F0EB] text-[#666]">{review.project_type}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-[#999] font-light">{timeAgo(review.created_at)}</span>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-[#666] font-light leading-relaxed">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>

          {/* ── CTA / Request form ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {!isLoggedIn ? (
              <div className="bg-gradient-to-r from-[#2C5F3F] to-[#234B32] rounded-3xl p-8 text-white text-center">
                <h2 className="text-2xl font-light mb-3">Intéressé par ce professionnel ?</h2>
                <p className="text-white/80 font-light mb-6">Connectez-vous pour envoyer une demande.</p>
                <Link href="/connexion" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#2C5F3F] text-sm font-medium hover:shadow-xl transition-all">
                  Se connecter
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>
            ) : requestSent ? (
              <div className="bg-white rounded-3xl border border-[#2C5F3F]/30 p-8 text-center">
                <div className="w-16 h-16 bg-[#2C5F3F]/10 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#2C5F3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-light text-[#111] mb-2">Demande envoyée !</h2>
                <p className="text-[#666] font-light mb-6">{p.full_name} recevra votre demande et pourra l&apos;accepter depuis son tableau de bord.</p>
                <div className="flex gap-3 justify-center">
                  <Link href="/dashboard/client" className="px-6 py-3 rounded-full bg-[#2C5F3F] text-white text-sm font-medium hover:bg-[#234B32] shadow-lg transition-all">
                    Mon tableau de bord
                  </Link>
                  <button onClick={() => { setSelectedPro(null); setRequestSent(false); setShowRequestForm(false); }} className="px-6 py-3 rounded-full bg-white text-[#666] text-sm font-medium border border-gray-200 hover:border-gray-300 transition-all">
                    Voir d&apos;autres pros
                  </button>
                </div>
              </div>
            ) : !showRequestForm ? (
              <div className="bg-gradient-to-r from-[#2C5F3F] to-[#234B32] rounded-3xl p-8 text-white text-center">
                <h2 className="text-2xl font-light mb-3">Intéressé par ce professionnel ?</h2>
                <p className="text-white/80 font-light mb-6">Décrivez votre projet et envoyez une demande directement.</p>
                <button
                  onClick={() => setShowRequestForm(true)}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#2C5F3F] text-sm font-medium hover:shadow-xl transition-all"
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
                      className="w-full bg-[#F4F0EB] border border-gray-200 rounded-xl px-5 py-3.5 text-[#111] placeholder:text-[#999] text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#2C5F3F] transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm text-[#666] font-light mb-1.5">Description *</label>
                    <textarea value={requestDescription} onChange={(e) => setRequestDescription(e.target.value)} rows={4} placeholder="Décrivez les travaux souhaités, l'état actuel, vos attentes..."
                      className="w-full bg-[#F4F0EB] border border-gray-200 rounded-xl px-5 py-3.5 text-[#111] placeholder:text-[#999] text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#2C5F3F] transition-all resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-[#666] font-light mb-1.5">Budget estimé ($)</label>
                      <input type="number" value={requestBudget} onChange={(e) => setRequestBudget(e.target.value)} placeholder="25000"
                        className="w-full bg-[#F4F0EB] border border-gray-200 rounded-xl px-5 py-3.5 text-[#111] placeholder:text-[#999] text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#2C5F3F] transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm text-[#666] font-light mb-1.5">Adresse des travaux</label>
                      <input type="text" value={requestAddress} onChange={(e) => setRequestAddress(e.target.value)} placeholder="1234 rue Exemple, Montréal"
                        className="w-full bg-[#F4F0EB] border border-gray-200 rounded-xl px-5 py-3.5 text-[#111] placeholder:text-[#999] text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#2C5F3F] transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[#666] font-light mb-1.5">Message personnel (optionnel)</label>
                    <textarea value={requestMessage} onChange={(e) => setRequestMessage(e.target.value)} rows={3} placeholder="Bonjour, j'aimerais discuter de mon projet..."
                      className="w-full bg-[#F4F0EB] border border-gray-200 rounded-xl px-5 py-3.5 text-[#111] placeholder:text-[#999] text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#2C5F3F] transition-all resize-none" />
                  </div>

                  {requestError && (
                    <div className="px-5 py-3 rounded-xl text-sm font-light bg-red-50 text-red-600 border border-red-100">{requestError}</div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleSendRequest}
                      disabled={sendingRequest || !requestTitle.trim() || !requestDescription.trim()}
                      className="flex-1 py-4 rounded-full text-sm font-medium text-white bg-[#2C5F3F] hover:bg-[#234B32] shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
    <main className="min-h-screen bg-[#F4F0EB] text-[#111]">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl text-[#2C5F3F] font-bold">*</span>
              <span className="text-xl font-light tracking-tight">Les Bons Bras</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/chat-renovation" className="text-[#666] hover:text-[#111] font-light transition-colors">Assistant IA</Link>
              <Link href="/devenir-professionnel" className="text-[#666] hover:text-[#111] font-light transition-colors">Devenir pro</Link>
              {isLoggedIn ? (
                <Link href="/dashboard" className="px-6 py-2.5 rounded-full bg-[#2C5F3F] text-white text-sm font-medium hover:bg-[#234B32] shadow-lg transition-all">
                  Mon tableau de bord
                </Link>
              ) : (
                <Link href="/connexion" className="px-6 py-2.5 rounded-full bg-[#2C5F3F] text-white text-sm font-medium hover:bg-[#234B32] shadow-lg transition-all">
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
            Trouvez votre <span className="text-[#2C5F3F]">professionnel</span>
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
              className="w-full bg-white border border-gray-200 rounded-full pl-14 pr-5 py-4 text-[#111] placeholder:text-[#999] text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#2C5F3F] shadow-sm transition-all"
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
                    ? "bg-[#2C5F3F] text-white shadow-lg"
                    : "bg-white text-[#666] border border-gray-100 hover:border-[#2C5F3F]/30 hover:shadow-md"
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
              className="w-12 h-12 border-3 border-[#2C5F3F]/20 border-t-[#2C5F3F] rounded-full"
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
            <div className="w-20 h-20 bg-[#F4F0EB] rounded-2xl mx-auto mb-5 flex items-center justify-center">
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
                {/* Cover banner + Avatar superposé */}
                <div className="relative">
                  {pro.cover_url ? (
                    <img src={pro.cover_url} alt="" className="w-full aspect-[16/9] object-cover" />
                  ) : pro.portfolio.length > 0 ? (
                    <img src={pro.portfolio[0].url} alt="" className="w-full aspect-[16/9] object-cover" />
                  ) : (
                    <div className="w-full aspect-[16/9] bg-gradient-to-br from-[#2C5F3F]/10 to-[#2C5F3F]/5 flex items-center justify-center">
                      <span className="text-5xl opacity-50">
                        {CATEGORIES.find((c) => pro.specialty?.includes(c.id))?.icon || "🏠"}
                      </span>
                    </div>
                  )}
                  {/* Avatar superposé */}
                  <div className="absolute bottom-0 left-5 translate-y-1/2">
                    {pro.avatar_url ? (
                      <img src={pro.avatar_url} alt={pro.full_name} className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-md" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-[#2C5F3F] flex items-center justify-center text-white font-medium border-2 border-white shadow-md">
                        {pro.full_name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-10 px-6 pb-6">
                  {/* Name + Verified */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-[#111] group-hover:text-[#2C5F3F] transition-colors">{pro.full_name}</h3>
                      <p className="text-sm text-[#666] font-light">{pro.company_name}</p>
                    </div>
                    {pro.verified && (
                      <span className="text-[#2C5F3F] flex-shrink-0">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </span>
                    )}
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {pro.specialty?.slice(0, 3).map((s) => (
                      <span key={s} className="px-2.5 py-0.5 rounded-full text-xs font-light bg-[#F4F0EB] text-[#666]">
                        {CATEGORIES.find((c) => c.id === s)?.label || s}
                      </span>
                    ))}
                  </div>

                  {/* Tagline */}
                  {pro.tagline && (
                    <p className="text-xs text-[#2C5F3F] italic mt-1 mb-3 line-clamp-1">&ldquo;{pro.tagline}&rdquo;</p>
                  )}

                  {/* Bio excerpt */}
                  {!pro.tagline && (pro.bio || pro.description) && (
                    <p className="text-sm text-[#666] font-light line-clamp-2 mb-3">{pro.bio || pro.description}</p>
                  )}

                  {/* Availability */}
                  {pro.availability && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        pro.availability.includes('Disponible') && !pro.availability.includes('Liste')
                          ? 'bg-green-500' : 'bg-orange-400'
                      }`} />
                      <span className="text-xs text-gray-500">{pro.availability}</span>
                      {pro.team_size && pro.team_size > 1 && (
                        <span className="text-xs text-gray-400">· Équipe de {pro.team_size}</span>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-3 text-xs text-[#999] font-light">
                      {pro.service_area && <span>{pro.service_area}</span>}
                      {pro.years_experience > 0 && <span>· {pro.years_experience} ans</span>}
                    </div>
                    {pro.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-[#E2711D]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span className="text-sm font-light text-[#111]">{pro.rating.toFixed(1)}</span>
                      </div>
                    )}
                    {pro.hourly_rate && !pro.rating && (
                      <span className="text-sm font-light text-[#E2711D]">{formatRate(pro.hourly_rate)}/h</span>
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