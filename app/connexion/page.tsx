"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

/* ─────────────────────────── TYPES ─────────────────────────── */

type UserRole = "client" | "professionnel";
type AuthMode = "login" | "signup";

/* ═══════════════════════════════════════════════════════════════
   PAGE DE CONNEXION — LES BONS BRAS
   ═══════════════════════════════════════════════════════════════ */

export default function ConnexionPage() {
  const router = useRouter();
  const supabase = createClient();
  const [role, setRole] = useState<UserRole | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [licenseRBQ, setLicenseRBQ] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  /* ─── AUTH HANDLERS ─── */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      

      if (authMode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role,
              full_name: fullName,
              phone,
              ...(role === "professionnel" && {
                company_name: companyName,
                license_rbq: licenseRBQ,
              }),
            },
          },
        });

        if (signUpError) throw signUpError;
        router.push("/dashboard");
        router.refresh();
      } else {
        const { data, error: signInError } =
          await supabase.auth.signInWithPassword({ email, password });

        if (signInError) throw signInError;
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(
        err.message === "Invalid login credentials"
          ? "Identifiants invalides. Vérifiez votre courriel et mot de passe."
          : err.message || "Une erreur est survenue."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      

      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (err: any) {
      setError(err.message || "Erreur de connexion Google.");
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════ */

  return (
    <main className="min-h-screen bg-white text-[#111] overflow-hidden">
      {/* ─── NAVIGATION (identique à la landing) ─── */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-3xl text-[#4CAF50] font-bold">*</span>
              <span className="text-xl font-light tracking-tight">
                Les Bons Bras
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/trouver-un-professionnel"
                className="text-[#666] hover:text-[#111] font-light transition-colors"
              >
                Trouver un pro
              </Link>
              <Link
                href="/devenir-professionnel"
                className="text-[#666] hover:text-[#111] font-light transition-colors"
              >
                Devenir pro
              </Link>
              <Link
                href="/chat-renovation"
                className="text-[#666] hover:text-[#111] font-light transition-colors"
              >
                Assistant IA
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── CONTENU ─── */}
      <div className="min-h-screen flex pt-20">
        {/* ═══ COLONNE GAUCHE — VISUEL ═══ */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#4CAF50] to-[#45a049] items-center justify-center overflow-hidden">
          {/* Background blobs */}
          <div className="absolute inset-0">
            <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-white rounded-full blur-3xl opacity-10" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white rounded-full blur-3xl opacity-10" />
          </div>

          <div className="relative z-10 max-w-md px-12 text-white">
            <div className="flex items-center gap-2 mb-8">
              <span className="text-4xl font-bold">*</span>
              <span className="text-2xl font-light">Les Bons Bras</span>
            </div>

            <h2 className="text-4xl font-light leading-tight mb-6">
              Votre espace pour gérer vos projets de rénovation
            </h2>

            <p className="text-white/80 font-light leading-relaxed mb-10">
              Suivez l&apos;avancement de vos travaux, communiquez avec vos
              professionnels et gardez le contrôle de votre budget — tout au
              même endroit.
            </p>

            {/* Feature list */}
            <div className="space-y-5">
              {[
                "Suivi en temps réel de vos chantiers",
                "Photos et mises à jour automatiques",
                "Budget et dépenses centralisés",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-white"
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
                  <span className="text-white/90 font-light">{item}</span>
                </div>
              ))}
            </div>

            {/* Trust badge */}
            <div className="mt-12 pt-8 border-t border-white/20 flex items-center gap-8">
              <div>
                <div className="text-2xl font-light">2,500+</div>
                <div className="text-sm text-white/70 font-light">
                  Professionnels
                </div>
              </div>
              <div>
                <div className="text-2xl font-light">12k+</div>
                <div className="text-sm text-white/70 font-light">
                  Projets réalisés
                </div>
              </div>
              <div>
                <div className="text-2xl font-light">98%</div>
                <div className="text-sm text-white/70 font-light">
                  Satisfaction
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ COLONNE DROITE — FORMULAIRE ═══ */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16 bg-[#F8F7F4]">
          <motion.div
            className="w-full max-w-[440px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatePresence mode="wait">
              {/* ═══ ÉTAPE 1 : CHOIX DU RÔLE ═══ */}
              {!role && (
                <motion.div
                  key="role-select"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h1 className="text-4xl font-light tracking-tight mb-3">
                    Bienvenue
                  </h1>
                  <p className="text-[#666] font-light mb-10">
                    Choisissez votre profil pour accéder à votre espace.
                  </p>

                  <div className="space-y-4">
                    {/* Client card */}
                    <button
                      onClick={() => setRole("client")}
                      className="group w-full bg-white p-6 rounded-2xl text-left
                                 border border-gray-100 hover:border-[#4CAF50]/30
                                 hover:shadow-xl transition-all duration-300
                                 hover:-translate-y-1"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-[#4CAF50]/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#4CAF50] transition-all">
                          <svg
                            className="w-7 h-7 text-[#4CAF50] group-hover:text-white transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
                            />
                            <circle cx="12" cy="7" r="4" strokeWidth={1.5} />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-[#111] mb-0.5">
                            Client
                          </h3>
                          <p className="text-sm text-[#666] font-light">
                            Suivez vos projets de rénovation en temps réel
                          </p>
                        </div>
                        <svg
                          className="w-5 h-5 text-[#666] group-hover:text-[#4CAF50] group-hover:translate-x-1 transition-all"
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
                    </button>

                    {/* Professionnel card */}
                    <button
                      onClick={() => setRole("professionnel")}
                      className="group w-full bg-white p-6 rounded-2xl text-left
                                 border border-gray-100 hover:border-[#4CAF50]/30
                                 hover:shadow-xl transition-all duration-300
                                 hover:-translate-y-1"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-[#4CAF50]/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#4CAF50] transition-all">
                          <svg
                            className="w-7 h-7 text-[#4CAF50] group-hover:text-white transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <rect
                              x="2"
                              y="7"
                              width="20"
                              height="14"
                              rx="2"
                              strokeWidth={1.5}
                            />
                            <path
                              d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
                              strokeLinecap="round"
                              strokeWidth={1.5}
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-[#111] mb-0.5">
                            Professionnel
                          </h3>
                          <p className="text-sm text-[#666] font-light">
                            Gérez vos chantiers et communiquez avec vos clients
                          </p>
                        </div>
                        <svg
                          className="w-5 h-5 text-[#666] group-hover:text-[#4CAF50] group-hover:translate-x-1 transition-all"
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
                    </button>
                  </div>

                  <p className="text-center text-sm text-[#666] font-light mt-8">
                    Pas encore inscrit ?{" "}
                    <span className="text-[#4CAF50]">
                      Choisissez votre profil pour commencer
                    </span>
                  </p>
                </motion.div>
              )}

              {/* ═══ ÉTAPE 2 : FORMULAIRE AUTH ═══ */}
              {role && (
                <motion.div
                  key="auth-form"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Back */}
                  <button
                    onClick={() => {
                      setRole(null);
                      setError(null);
                      setAuthMode("login");
                    }}
                    className="flex items-center gap-1.5 text-sm text-[#666] hover:text-[#111] font-light mb-8 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
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
                    Changer de profil
                  </button>

                  {/* Header */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[#4CAF50]/10 rounded-xl flex items-center justify-center">
                      {role === "client" ? (
                        <svg className="w-5 h-5 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                          <circle cx="12" cy="7" r="4" strokeWidth={1.5} />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect x="2" y="7" width="20" height="14" rx="2" strokeWidth={1.5} />
                          <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" strokeLinecap="round" strokeWidth={1.5} />
                        </svg>
                      )}
                    </div>
                    <h2 className="text-2xl font-light tracking-tight">
                      {authMode === "login" ? "Connexion" : "Inscription"}{" "}
                      <span className="text-[#4CAF50]">
                        {role === "client" ? "Client" : "Pro"}
                      </span>
                    </h2>
                  </div>
                  <p className="text-sm text-[#666] font-light mb-8">
                    {authMode === "login"
                      ? "Accédez à votre espace personnel"
                      : "Créez votre compte en quelques secondes"}
                  </p>

                  {/* Auth mode toggle */}
                  <div className="flex bg-white rounded-full p-1 mb-8 border border-gray-100">
                    {(["login", "signup"] as AuthMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => {
                          setAuthMode(mode);
                          setError(null);
                        }}
                        className={`flex-1 py-2.5 text-sm font-medium rounded-full transition-all duration-300
                          ${
                            authMode === mode
                              ? "bg-[#4CAF50] text-white shadow-lg"
                              : "text-[#666] hover:text-[#111]"
                          }`}
                      >
                        {mode === "login" ? "Se connecter" : "Créer un compte"}
                      </button>
                    ))}
                  </div>

                  {/* Google OAuth */}
                  <button
                    onClick={handleGoogleAuth}
                    className="w-full flex items-center justify-center gap-3
                               py-3.5 rounded-full bg-white border border-gray-200
                               text-sm font-medium text-[#111]
                               hover:shadow-lg hover:border-gray-300
                               active:scale-[0.99] transition-all duration-200"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continuer avec Google
                  </button>

                  {/* Divider */}
                  <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-[#666] font-light">OU</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nom — signup only */}
                    <AnimatePresence>
                      {authMode === "signup" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <label className="block text-sm text-[#666] font-light mb-1.5">
                            Nom complet
                          </label>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Jean Tremblay"
                            required
                            className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5
                                       text-[#111] placeholder:text-[#999] text-sm font-light
                                       focus:outline-none focus:ring-2 focus:ring-[#4CAF50]
                                       transition-all"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Champs pro */}
                    <AnimatePresence>
                      {authMode === "signup" && role === "professionnel" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-sm text-[#666] font-light mb-1.5">
                              Nom de l&apos;entreprise
                            </label>
                            <input
                              type="text"
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                              placeholder="Rénovations XYZ inc."
                              required
                              className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5
                                         text-[#111] placeholder:text-[#999] text-sm font-light
                                         focus:outline-none focus:ring-2 focus:ring-[#4CAF50]
                                         transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-[#666] font-light mb-1.5">
                              Licence RBQ{" "}
                              <span className="text-[#999]">(optionnel)</span>
                            </label>
                            <input
                              type="text"
                              value={licenseRBQ}
                              onChange={(e) => setLicenseRBQ(e.target.value)}
                              placeholder="1234-5678-90"
                              className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5
                                         text-[#111] placeholder:text-[#999] text-sm font-light
                                         focus:outline-none focus:ring-2 focus:ring-[#4CAF50]
                                         transition-all"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Email */}
                    <div>
                      <label className="block text-sm text-[#666] font-light mb-1.5">
                        Courriel
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vous@exemple.com"
                        required
                        className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5
                                   text-[#111] placeholder:text-[#999] text-sm font-light
                                   focus:outline-none focus:ring-2 focus:ring-[#4CAF50]
                                   transition-all"
                      />
                    </div>

                    {/* Téléphone — signup only */}
                    <AnimatePresence>
                      {authMode === "signup" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <label className="block text-sm text-[#666] font-light mb-1.5">
                            Téléphone
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="(514) 555-1234"
                            className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5
                                       text-[#111] placeholder:text-[#999] text-sm font-light
                                       focus:outline-none focus:ring-2 focus:ring-[#4CAF50]
                                       transition-all"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Password */}
                    <div>
                      <label className="block text-sm text-[#666] font-light mb-1.5">
                        Mot de passe
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          minLength={6}
                          className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 pr-12
                                     text-[#111] placeholder:text-[#999] text-sm font-light
                                     focus:outline-none focus:ring-2 focus:ring-[#4CAF50]
                                     transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#666] transition-colors"
                        >
                          {showPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" strokeWidth={1.5} strokeLinecap="round" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" strokeWidth={1.5} />
                            </svg>
                          )}
                        </button>
                      </div>
                      {authMode === "login" && (
                        <Link
                          href="/mot-de-passe-oublie"
                          className="block text-xs text-[#4CAF50] mt-2 text-right
                                     font-light hover:underline transition-colors"
                        >
                          Mot de passe oublié ?
                        </Link>
                      )}
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="px-5 py-3 rounded-xl text-sm font-light bg-red-50 text-red-600 border border-red-100"
                        >
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 rounded-full text-sm font-medium text-white
                                 bg-[#4CAF50] hover:bg-[#45a049]
                                 shadow-lg hover:shadow-xl
                                 transition-all duration-300
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                          Chargement...
                        </>
                      ) : authMode === "login" ? (
                        <>
                          Se connecter
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </>
                      ) : (
                        <>
                          Créer mon compte
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Terms */}
                  {authMode === "signup" && (
                    <p className="text-center text-xs text-[#999] font-light mt-5 leading-relaxed">
                      En créant un compte, vous acceptez nos{" "}
                      <Link
                        href="/conditions"
                        className="text-[#666] underline hover:text-[#111]"
                      >
                        conditions d&apos;utilisation
                      </Link>{" "}
                      et notre{" "}
                      <Link
                        href="/confidentialite"
                        className="text-[#666] underline hover:text-[#111]"
                      >
                        politique de confidentialité
                      </Link>
                      .
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </main>
  );
}