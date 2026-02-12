"use client";

import Link from "next/link";
import { useState } from "react";

type Step = 1 | 2 | 3 | 4;

interface FormData {
  // Étape 1 - Type de professionnel
  metier: string;
  
  // Étape 2 - Informations personnelles
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  
  // Étape 3 - Informations business
  nomEntreprise: string;
  siret: string;
  ville: string;
  codePostal: string;
  experience: string;
  description: string;
  
  // Étape 4 - Documents
  assurance: File | null;
  kbis: File | null;
  certifications: File | null;
}

export default function DevenirProfessionnel() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    metier: "",
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    nomEntreprise: "",
    siret: "",
    ville: "",
    codePostal: "",
    experience: "",
    description: "",
    assurance: null,
    kbis: null,
    certifications: null,
  });

  const metiers = [
    { id: "architecte", label: "Architecte", icon: "📐" },
    { id: "designer", label: "Designer d'intérieur", icon: "✨" },
    { id: "plombier", label: "Plombier", icon: "💧" },
    { id: "electricien", label: "Électricien", icon: "⚡" },
    { id: "entrepreneur", label: "Entrepreneur général", icon: "🏗️" },
    { id: "paysagiste", label: "Paysagiste", icon: "🌿" },
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
  };

  const handleFileChange = (field: keyof FormData, file: File | null) => {
    setFormData({ ...formData, [field]: file });
  };

  const progress = (currentStep / 4) * 100;

  // Écran de confirmation
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl text-center animate-scaleIn">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-[#4CAF50] rounded-full mx-auto flex items-center justify-center mb-6 animate-successPop">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Success Message */}
            <h2 className="text-3xl md:text-4xl font-light text-[#111] mb-4">
              Candidature envoyée !
            </h2>
            <p className="text-lg text-[#666] font-light mb-8 leading-relaxed">
              Merci {formData.prenom} pour votre candidature. Notre équipe va l'examiner et vous contactera sous 48h.
            </p>

            {/* Info cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-[#F8F7F4] rounded-2xl p-6">
                <div className="text-3xl mb-2">📧</div>
                <div className="text-sm text-[#666] font-light">Email de confirmation envoyé</div>
              </div>
              <div className="bg-[#F8F7F4] rounded-2xl p-6">
                <div className="text-3xl mb-2">⏱️</div>
                <div className="text-sm text-[#666] font-light">Réponse sous 48h</div>
              </div>
              <div className="bg-[#F8F7F4] rounded-2xl p-6">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-sm text-[#666] font-light">Profil en vérification</div>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#4CAF50] text-white rounded-xl font-medium hover:bg-[#45a049] transition-all"
            >
              Retour à l'accueil
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl text-[#4CAF50] font-bold">*</span>
              <span className="text-xl font-light">Les Bons Bras</span>
            </Link>
            <Link href="/" className="text-[#666] hover:text-[#111] font-light text-sm">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-light text-[#666]">
              Étape {currentStep} sur 4
            </div>
            <div className="text-sm font-light text-[#666]">
              {Math.round(progress)}% complété
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#4CAF50] h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      

      {/* Form Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit}>
          
          {/* ÉTAPE 1 - Type de professionnel */}
          {currentStep === 1 && (
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm space-y-8 animate-fadeIn">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4CAF50]/10 rounded-2xl mb-4">
                  <svg className="w-8 h-8 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-light text-[#111]">
                  Quel est votre métier ?
                </h2>
                <p className="text-lg text-[#666] font-light">
                  Sélectionnez votre domaine d'expertise principal
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-8">
                {metiers.map((metier) => (
                  <button
                    key={metier.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, metier: metier.id })}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-center ${
                      formData.metier === metier.id
                        ? "border-[#4CAF50] bg-[#4CAF50]/5 shadow-lg"
                        : "border-gray-200 hover:border-[#4CAF50]/50 hover:shadow-md"
                    }`}
                  >
                    <div className="text-4xl mb-3">{metier.icon}</div>
                    <div className="font-normal text-[#111] text-sm">{metier.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ÉTAPE 2 - Informations personnelles */}
          {currentStep === 2 && (
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm space-y-8 animate-fadeIn">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4CAF50]/10 rounded-2xl mb-4">
                  <svg className="w-8 h-8 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-light text-[#111]">
                  Vos informations personnelles
                </h2>
                <p className="text-lg text-[#666] font-light">
                  Dites-nous en plus sur vous
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-8">
                <div>
                  <label className="block text-sm font-medium text-[#111] mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#4CAF50] transition-all font-light"
                    placeholder="Jean"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111] mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#4CAF50] transition-all font-light"
                    placeholder="Dupont"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111] mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#4CAF50] transition-all font-light"
                    placeholder="jean.dupont@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111] mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#4CAF50] transition-all font-light"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 - Informations business */}
          {currentStep === 3 && (
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm space-y-8 animate-fadeIn">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4CAF50]/10 rounded-2xl mb-4">
                  <svg className="w-8 h-8 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-light text-[#111]">
                  Votre entreprise
                </h2>
                <p className="text-lg text-[#666] font-light">
                  Parlez-nous de votre activité
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-8">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#111] mb-2">
                    Nom de l'entreprise *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nomEntreprise}
                    onChange={(e) => setFormData({ ...formData, nomEntreprise: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#4CAF50] transition-all font-light"
                    placeholder="Dupont Rénovation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111] mb-2">
                    SIRET *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.siret}
                    onChange={(e) => setFormData({ ...formData, siret: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#4CAF50] transition-all font-light"
                    placeholder="123 456 789 00010"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111] mb-2">
                    Années d'expérience *
                  </label>
                  <select
                    required
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#4CAF50] transition-all font-light"
                  >
                    <option value="">Sélectionnez</option>
                    <option value="0-2">0 à 2 ans</option>
                    <option value="3-5">3 à 5 ans</option>
                    <option value="6-10">6 à 10 ans</option>
                    <option value="11-15">11 à 15 ans</option>
                    <option value="15+">Plus de 15 ans</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111] mb-2">
                    Ville *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ville}
                    onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#4CAF50] transition-all font-light"
                    placeholder="Paris"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111] mb-2">
                    Code postal *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.codePostal}
                    onChange={(e) => setFormData({ ...formData, codePostal: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#4CAF50] transition-all font-light"
                    placeholder="75001"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#111] mb-2">
                    Description de votre activité *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#4CAF50] transition-all resize-none font-light"
                    placeholder="Décrivez votre expertise, vos spécialités, vos réalisations..."
                  />
                  <p className="text-sm text-[#666] mt-2 font-light">
                    Cette description apparaîtra sur votre profil
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 4 - Documents */}
          {currentStep === 4 && (
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm space-y-8 animate-fadeIn">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4CAF50]/10 rounded-2xl mb-4">
                  <svg className="w-8 h-8 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-light text-[#111]">
                  Vos documents
                </h2>
                <p className="text-lg text-[#666] font-light">
                  Ajoutez vos documents professionnels pour validation
                </p>
              </div>

              <div className="space-y-6 pt-8">
                {/* Assurance */}
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-[#4CAF50] transition-all">
                  <label className="block cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#4CAF50]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-[#111]">Assurance décennale *</div>
                        <div className="text-sm text-[#666] font-light">
                          {formData.assurance ? formData.assurance.name : "PDF, max 10 MB"}
                        </div>
                      </div>
                      <svg className="w-6 h-6 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => handleFileChange("assurance", e.target.files?.[0] || null)}
                    />
                  </label>
                </div>

                {/* KBIS */}
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-[#4CAF50] transition-all">
                  <label className="block cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#4CAF50]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-[#111]">Extrait KBIS *</div>
                        <div className="text-sm text-[#666] font-light">
                          {formData.kbis ? formData.kbis.name : "PDF, max 10 MB"}
                        </div>
                      </div>
                      <svg className="w-6 h-6 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => handleFileChange("kbis", e.target.files?.[0] || null)}
                    />
                  </label>
                </div>

                {/* Certifications */}
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-[#4CAF50] transition-all">
                  <label className="block cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#4CAF50]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-[#111]">Certifications (optionnel)</div>
                        <div className="text-sm text-[#666] font-light">
                          {formData.certifications ? formData.certifications.name : "PDF, max 10 MB"}
                        </div>
                      </div>
                      <svg className="w-6 h-6 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => handleFileChange("certifications", e.target.files?.[0] || null)}
                    />
                  </label>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-blue-800 font-light">
                      <strong className="font-medium">Vos documents sont sécurisés.</strong> Ils sont uniquement utilisés pour valider votre profil et ne seront jamais partagés publiquement.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between items-center pt-8">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-8 py-3 border-2 border-gray-300 text-[#111] rounded-xl font-medium hover:bg-gray-50 transition-all inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Précédent
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={currentStep === 1 && !formData.metier}
                className="px-8 py-3 bg-[#4CAF50] text-white rounded-xl font-medium hover:bg-[#45a049] transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 ml-auto"
              >
                Continuer
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                className="px-8 py-3 bg-[#4CAF50] text-white rounded-xl font-medium hover:bg-[#45a049] transition-all inline-flex items-center gap-2 ml-auto shadow-lg hover:shadow-xl"
              >
                Soumettre ma candidature
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            )}
          </div>
        </form>

        {/* Help section */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[#666] font-light mb-4">
            Une question ? Notre équipe est là pour vous aider
          </p>
          <Link href="/contact" className="text-[#4CAF50] hover:underline font-medium text-sm">
            Contactez-nous
          </Link>
        </div>
      </div>

      {/* Animations CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes successPop {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out;
        }
        
        .animate-successPop {
          animation: successPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
}