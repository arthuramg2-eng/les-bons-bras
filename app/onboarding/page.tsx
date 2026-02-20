"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import type { ProProfile } from "@/lib/supabase/types";

/* ─────────────────────────── CONSTANTS ─────────────────────────── */

const SPECIALTIES = [
  { id: "architecte", label: "Architecte", icon: "📐" },
  { id: "designer", label: "Designer d'intérieur", icon: "✨" },
  { id: "plombier", label: "Plombier", icon: "💧" },
  { id: "electricien", label: "Électricien", icon: "⚡" },
  { id: "entrepreneur_general", label: "Entrepreneur général", icon: "🏗️" },
  { id: "paysagiste", label: "Paysagiste", icon: "🌿" },
];

type Step = 1 | 2 | 3 | 4;

interface PortfolioImage {
  file: File;
  preview: string;
  caption: string;
}

/* ═══════════════════════════════════════════════════════════════
   PAGE D'ONBOARDING — ENTREPRENEURS
   ═══════════════════════════════════════════════════════════════ */

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const { role, profile, userId, loading: roleLoading } = useUserRole();

  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Infos de base
  const [companyName, setCompanyName] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseRBQ, setLicenseRBQ] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");

  // Step 2: Spécialités
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  // Step 3: Photos
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Step 4: Bio
  const [bio, setBio] = useState("");

  // Préremplir avec les données existantes
  useEffect(() => {
    if (profile && role === "professionnel") {
      const p = profile as ProProfile;
      setCompanyName(p.company_name || "");
      setFullName(p.full_name || "");
      setPhone(p.phone || "");
      setLicenseRBQ(p.license_rbq || "");
      if (p.specialty) setSelectedSpecialties(p.specialty);
      if (p.description) setBio(p.description);
      if (p.avatar_url) setAvatarPreview(p.avatar_url);
    }
  }, [profile, role]);

  // Redirect si pas pro
  useEffect(() => {
    if (!roleLoading && role !== "professionnel") {
      router.push("/dashboard");
    }
  }, [role, roleLoading, router]);

  /* ─── HANDLERS ─── */

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handlePortfolioAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: PortfolioImage[] = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      caption: "",
    }));

    setPortfolio((prev) => [...prev, ...newImages].slice(0, 10));
  };

  const removePortfolioImage = (index: number) => {
    setPortfolio((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCaption = (index: number, caption: string) => {
    setPortfolio((prev) =>
      prev.map((img, i) => (i === index ? { ...img, caption } : img))
    );
  };

  const toggleSpecialty = (id: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  /* ─── SUBMIT ─── */

  const handleSubmit = async () => {
    if (!userId) return;
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Upload avatar
      let avatarUrl = avatarPreview;
      if (avatar) {
        const ext = avatar.name.split(".").pop();
        const path = `${userId}/avatar.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(path, avatar, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(path);
        avatarUrl = urlData.publicUrl;
      }

      // 2. Upload portfolio images
      for (const img of portfolio) {
        const ext = img.file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const path = `${userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("portfolio")
          .upload(path, img.file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("portfolio")
          .getPublicUrl(path);

        // Insert into pro_portfolio table
        await (supabase.from("pro_portfolio") as any).insert({
          pro_id: userId,
          url: urlData.publicUrl,
          caption: img.caption || null,
          category: selectedSpecialties[0] || null,
        });
      }

      // 3. Update pro profile
      const { error: updateError } = await (supabase.from("pro_profiles") as any)
        .update({
          full_name: fullName,
          company_name: companyName,
          phone: phone || null,
          license_rbq: licenseRBQ || null,
          specialty: selectedSpecialties,
          description: bio || null,
          avatar_url: avatarUrl || null,
          years_experience: yearsExperience ? parseInt(yearsExperience) : 0,
          service_area: serviceArea || null,
          hourly_rate: hourlyRate ? parseFloat(hourlyRate) : null,
          onboarding_complete: true,
        })
        .eq("user_id", userId);
      if (updateError) throw updateError;

      router.push("/dashboard/entrepreneur");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
      setIsSubmitting(false);
    }
  };

  /* ─── VALIDATION PAR ÉTAPE ─── */

  const canProceed = () => {
    switch (step) {
      case 1:
        return companyName.trim() !== "" && fullName.trim() !== "";
      case 2:
        return selectedSpecialties.length > 0;
      case 3:
        return true; // Photos optionnelles
      case 4:
        return true; // Bio optionnelle
      default:
        return false;
    }
  };

  if (roleLoading) {
    return (
      <main className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
        <motion.div
          className="w-12 h-12 border-3 border-[#4CAF50]/20 border-t-[#4CAF50] rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
      </main>
    );
  }

  /* ═══════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════ */

  return (
    <main className="min-h-screen bg-[#F8F7F4] text-[#111]">
      {/* Navbar minimal */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl text-[#4CAF50] font-bold">*</span>
              <span className="text-xl font-light tracking-tight">Les Bons Bras</span>
            </Link>
            <span className="text-sm text-[#999] font-light">Étape {step}/4</span>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex-1 h-1.5 rounded-full overflow-hidden bg-gray-200">
                <motion.div
                  className="h-full rounded-full bg-[#4CAF50]"
                  initial={{ width: 0 }}
                  animate={{ width: s <= step ? "100%" : "0%" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* ═══ ÉTAPE 1 : INFOS DE BASE ═══ */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-3">
                Complétez votre <span className="text-[#4CAF50]">profil professionnel</span>
              </h1>
              <p className="text-[#666] font-light mb-10">
                Ces informations seront visibles par les clients sur votre page.
              </p>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm text-[#666] font-light mb-1.5">Nom complet *</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jean Tremblay"
                    className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-[#111] placeholder:text-[#999] text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all" />
                </div>
                <div>
                  <label className="block text-sm text-[#666] font-light mb-1.5">Nom de l&apos;entreprise *</label>
                  <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Rénovations XYZ inc."
                    className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-[#111] placeholder:text-[#999] text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#666] font-light mb-1.5">Téléphone</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(514) 555-1234"
                      className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-[#111] placeholder:text-[#999] text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm text-[#666] font-light mb-1.5">Licence RBQ</label>
                    <input type="text" value={licenseRBQ} onChange={(e) => setLicenseRBQ(e.target.value)} placeholder="1234-5678-90"
                      className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-[#111] placeholder:text-[#999] text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-[#666] font-light mb-1.5">Années d&apos;exp.</label>
                    <input type="number" value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} placeholder="10"
                      className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-[#111] placeholder:text-[#999] text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm text-[#666] font-light mb-1.5">Zone de service</label>
                    <input type="text" value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} placeholder="Grand Montréal"
                      className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-[#111] placeholder:text-[#999] text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm text-[#666] font-light mb-1.5">Taux horaire ($)</label>
                    <input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} placeholder="75"
                      className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-[#111] placeholder:text-[#999] text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ ÉTAPE 2 : SPÉCIALITÉS ═══ */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-3">
                Vos <span className="text-[#4CAF50]">spécialités</span>
              </h1>
              <p className="text-[#666] font-light mb-10">
                Sélectionnez les catégories dans lesquelles vous offrez vos services.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {SPECIALTIES.map((spec) => {
                  const selected = selectedSpecialties.includes(spec.id);
                  return (
                    <button
                      key={spec.id}
                      onClick={() => toggleSpecialty(spec.id)}
                      className={`group p-6 rounded-2xl text-left border-2 transition-all duration-300 hover:-translate-y-1 ${
                        selected
                          ? "border-[#4CAF50] bg-[#4CAF50]/5 shadow-lg"
                          : "border-gray-100 bg-white hover:border-[#4CAF50]/30 hover:shadow-lg"
                      }`}
                    >
                      <div className="text-3xl mb-3">{spec.icon}</div>
                      <h3 className={`text-lg font-medium ${selected ? "text-[#4CAF50]" : "text-[#111]"}`}>
                        {spec.label}
                      </h3>
                      {selected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="mt-2 w-6 h-6 rounded-full bg-[#4CAF50] flex items-center justify-center"
                        >
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ═══ ÉTAPE 3 : PHOTOS ═══ */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-3">
                Votre <span className="text-[#4CAF50]">portfolio</span>
              </h1>
              <p className="text-[#666] font-light mb-10">
                Ajoutez une photo de profil et des photos de vos réalisations.
              </p>

              {/* Avatar */}
              <div className="mb-10">
                <label className="block text-sm text-[#666] font-light mb-3">Photo de profil</label>
                <div className="flex items-center gap-5">
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#4CAF50] flex items-center justify-center overflow-hidden transition-colors bg-white"
                  >
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-8 h-8 text-[#ccc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    )}
                  </button>
                  <div>
                    <p className="text-sm text-[#111] font-medium">Cliquez pour ajouter</p>
                    <p className="text-xs text-[#999] font-light">JPG, PNG — max 5 Mo</p>
                  </div>
                  <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </div>
              </div>

              {/* Portfolio */}
              <div>
                <label className="block text-sm text-[#666] font-light mb-3">Photos de réalisations (max 10)</label>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {portfolio.map((img, i) => (
                    <div key={i} className="relative group bg-white rounded-xl border border-gray-100 overflow-hidden">
                      <img src={img.preview} alt="" className="aspect-[4/3] w-full object-cover" />
                      <button
                        onClick={() => removePortfolioImage(i)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <input
                        type="text"
                        value={img.caption}
                        onChange={(e) => updateCaption(i, e.target.value)}
                        placeholder="Légende..."
                        className="w-full px-3 py-2 text-xs text-[#111] font-light border-t border-gray-100 focus:outline-none"
                      />
                    </div>
                  ))}

                  {portfolio.length < 10 && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-[4/3] rounded-xl border-2 border-dashed border-gray-300 hover:border-[#4CAF50] flex flex-col items-center justify-center transition-colors bg-white"
                    >
                      <svg className="w-8 h-8 text-[#ccc] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className="text-xs text-[#999] font-light">Ajouter</span>
                    </button>
                  )}
                </div>

                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handlePortfolioAdd} className="hidden" />
              </div>
            </motion.div>
          )}

          {/* ═══ ÉTAPE 4 : BIO ═══ */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-3">
                Parlez de <span className="text-[#4CAF50]">vous</span>
              </h1>
              <p className="text-[#666] font-light mb-10">
                Décrivez votre expérience, votre approche et ce qui vous distingue.
              </p>

              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={8}
                placeholder="Avec plus de 15 ans d'expérience dans la rénovation résidentielle au Québec, notre équipe se spécialise dans..."
                className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-[#111] placeholder:text-[#999] text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all resize-none"
              />
              <p className="text-xs text-[#999] font-light mt-2 text-right">{bio.length}/1000 caractères</p>

              {/* Résumé */}
              <div className="mt-10 bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-lg font-medium text-[#111] mb-4">Résumé de votre profil</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#666] font-light">Entreprise</span>
                    <span className="text-[#111] font-medium">{companyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666] font-light">Spécialités</span>
                    <span className="text-[#111] font-medium">
                      {selectedSpecialties.map((s) => SPECIALTIES.find((sp) => sp.id === s)?.label).join(", ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666] font-light">Photos portfolio</span>
                    <span className="text-[#111] font-medium">{portfolio.length}</span>
                  </div>
                  {serviceArea && (
                    <div className="flex justify-between">
                      <span className="text-[#666] font-light">Zone</span>
                      <span className="text-[#111] font-medium">{serviceArea}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-6 px-5 py-3 rounded-xl text-sm font-light bg-red-50 text-red-600 border border-red-100"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex gap-4 mt-10">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => (s - 1) as Step)}
              className="flex-1 py-4 rounded-full text-sm font-medium text-[#666] bg-white border border-gray-200 hover:border-gray-300 transition-all"
            >
              ← Retour
            </button>
          )}
          {step < 4 ? (
            <button
              onClick={() => setStep((s) => (s + 1) as Step)}
              disabled={!canProceed()}
              className="flex-1 py-4 rounded-full text-sm font-medium text-white bg-[#4CAF50] hover:bg-[#45a049] shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Continuer
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-4 rounded-full text-sm font-medium text-white bg-[#4CAF50] hover:bg-[#45a049] shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                  Enregistrement...
                </>
              ) : (
                <>
                  Publier mon profil
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}