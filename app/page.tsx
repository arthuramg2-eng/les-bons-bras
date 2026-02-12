"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    projet: "",
    message: ""
  });

  const [chatInput, setChatInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de soumission du formulaire
    console.log("Form submitted:", formData);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      // Rediriger vers la page de chat avec le message initial
      window.location.href = `/chat-renovation?message=${encodeURIComponent(chatInput)}`;
    }
  };

  return (
    <main className="bg-white text-[#111] overflow-hidden">

      {/* ================= NAVIGATION ================= */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-3xl text-[#4CAF50] font-bold">*</span>
              <span className="text-xl font-light tracking-tight">Les Bons Bras</span>
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/trouver-un-professionnel" className="text-[#666] hover:text-[#111] font-light transition-colors">
                Trouver un pro
              </Link>
              <Link href="/devenir-professionnel" className="text-[#666] hover:text-[#111] font-light transition-colors">
                Devenir pro
              </Link>
              <Link href="/chat-renovation" className="text-[#666] hover:text-[#111] font-light transition-colors">
                Assistant IA
              </Link>
              <Link href="/#contact" className="px-6 py-2.5 bg-[#4CAF50] text-white rounded-full text-sm font-medium hover:bg-[#45a049] transition-all">
                Démarrer un projet
              </Link>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Background gradients */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#4CAF50] rounded-full blur-3xl opacity-5" />
          <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-[#4CAF50] rounded-full blur-3xl opacity-5" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-[#4CAF50]/10 px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-[#4CAF50] rounded-full animate-pulse" />
                <span className="text-sm font-light text-[#4CAF50]">+2 500 professionnels vérifiés</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-[1.1]">
                Trouvez les meilleurs<br />
                <span className="text-[#4CAF50]">professionnels</span><br />
                pour vos travaux
              </h1>

              <p className="text-xl text-[#666] font-light leading-relaxed max-w-xl">
                Architectes, designers, artisans — nous vous mettons en relation avec des experts vérifiés pour concrétiser vos projets de rénovation.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/trouver-un-professionnel"
                  className="group px-8 py-4 bg-[#4CAF50] text-white rounded-full font-medium hover:bg-[#45a049] transition-all inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  Trouver un professionnel
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="#comment-ca-marche"
                  className="px-8 py-4 border-2 border-[#111] text-[#111] rounded-full font-medium hover:bg-[#111] hover:text-white transition-all inline-flex items-center justify-center"
                >
                  Comment ça marche
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-8 pt-8 border-t border-gray-100">
                <div>
                  <div className="text-3xl font-light text-[#111]">4.9/5</div>
                  <div className="text-sm text-[#666] font-light">Note moyenne</div>
                </div>
                <div>
                  <div className="text-3xl font-light text-[#111]">12k+</div>
                  <div className="text-sm text-[#666] font-light">Projets réalisés</div>
                </div>
                <div>
                  <div className="text-3xl font-light text-[#111]">98%</div>
                  <div className="text-sm text-[#666] font-light">Satisfaction client</div>
                </div>
              </div>
            </div>

            {/* Right image */}
            <div className="relative">
              <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/resultat.jpg"
                  alt="Projet de rénovation"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl max-w-xs">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-[#4CAF50]/10 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#4CAF50]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-[#111]">Marie L.</div>
                    <div className="text-sm text-[#666] font-light">Paris 15ème</div>
                  </div>
                </div>
                <p className="text-sm text-[#666] font-light italic">
                  "Rénovation complète de mon appartement. Équipe au top, résultat impeccable !"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BARRE DE RECHERCHE IA ================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#F8F7F4] to-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#4CAF50] to-[#45a049] p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium text-xl">Assistant IA Rénovation</h3>
                  <p className="text-white/90 text-sm font-light">Posez-moi vos questions sur votre projet de rénovation</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-wrap gap-3">
                {[
                  "💡 Idées de rénovation",
                  "💰 Estimation budget",
                  "🎨 Conseils déco",
                  "📐 Planification projet"
                ].map((action, i) => (
                  <button
                    key={i}
                    onClick={() => setChatInput(action.split(' ').slice(1).join(' '))}
                    className="px-5 py-2.5 bg-[#4CAF50]/10 text-[#4CAF50] rounded-full text-sm font-light hover:bg-[#4CAF50]/20 transition-all hover:scale-105"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleChatSubmit} className="p-6">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ex: Comment moderniser ma cuisine avec un budget de 10 000€ ?"
                  className="flex-1 bg-gray-50 rounded-2xl px-6 py-4 text-[#111] placeholder:text-[#666] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all text-base"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="px-8 py-4 bg-[#4CAF50] text-white rounded-2xl font-medium hover:bg-[#45a049] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <span className="hidden sm:inline">Envoyer</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-[#666] font-light mt-4 text-center">
                💬 Obtenez des conseils personnalisés pour votre projet de rénovation
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* ================= SERVICES GRID ================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F8F7F4]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-4">Tous les corps de métier</h2>
            <p className="text-lg text-[#666] font-light">Trouvez l'expert dont vous avez besoin</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Architectes", icon: "📐", count: "340+" },
              { name: "Designers", icon: "✨", count: "280+" },
              { name: "Plombiers", icon: "💧", count: "450+" },
              { name: "Électriciens", icon: "⚡", count: "520+" },
              { name: "Entrepreneurs", icon: "🏗️", count: "180+" },
              { name: "Paysagistes", icon: "🌿", count: "210+" },
            ].map((service, i) => (
              <Link
                key={i}
                href="/trouver-un-professionnel"
                className="group bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-4xl mb-3">{service.icon}</div>
                <div className="font-medium text-[#111] mb-1">{service.name}</div>
                <div className="text-sm text-[#666] font-light">{service.count}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= COMMENT ÇA MARCHE ================= */}
      <section id="comment-ca-marche" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light mb-4">Comment ça marche</h2>
            <p className="text-lg text-[#666] font-light max-w-2xl mx-auto">
              Un processus simple et transparent en 3 étapes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/4 left-0 right-0 h-0.5 bg-gradient-to-r from-[#4CAF50] via-[#4CAF50] to-[#4CAF50] opacity-20" />

            {[
              {
                number: "01",
                title: "Décrivez votre projet",
                description: "Remplissez un formulaire simple avec vos besoins, budget et délais.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                )
              },
              {
                number: "02",
                title: "Recevez des recommandations",
                description: "Notre algorithme sélectionne les professionnels les plus adaptés à votre projet.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )
              },
              {
                number: "03",
                title: "Choisissez et lancez-vous",
                description: "Comparez les profils, échangez directement et lancez votre projet en toute confiance.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
            ].map((step, i) => (
              <div key={i} className="relative bg-white p-8 rounded-3xl border border-gray-100 hover:border-[#4CAF50]/30 hover:shadow-xl transition-all duration-300 group">
                {/* Number badge */}
                <div className="absolute -top-4 left-8 w-16 h-16 bg-[#4CAF50] rounded-2xl flex items-center justify-center text-white font-medium text-xl shadow-lg group-hover:scale-110 transition-transform">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 bg-[#4CAF50]/10 rounded-xl flex items-center justify-center text-[#4CAF50] mb-6 mt-8 group-hover:bg-[#4CAF50] group-hover:text-white transition-all">
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-normal mb-4 text-[#111]">{step.title}</h3>
                <p className="text-[#666] font-light leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= POURQUOI NOUS CHOISIR ================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F8F7F4]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left - Image */}
            <div className="relative">
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/chantier.jpg"
                  alt="Professionnels de la rénovation"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Stats overlay */}
              <div className="absolute -bottom-6 -right-6 bg-white p-8 rounded-2xl shadow-xl">
                <div className="text-5xl font-light text-[#4CAF50] mb-2">2,500+</div>
                <div className="text-[#666] font-light">Professionnels vérifiés</div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-light leading-tight">
                Un réseau de professionnels d'excellence
              </h2>

              <p className="text-lg text-[#666] font-light leading-relaxed">
                Chaque professionnel est soigneusement sélectionné et vérifié pour garantir la qualité de votre projet.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    ),
                    title: "Vérification rigoureuse",
                    description: "Vérification des certifications, assurances et références clients"
                  },
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    ),
                    title: "Avis vérifiés",
                    description: "Tous les avis proviennent de clients ayant réellement travaillé avec nos pros"
                  },
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ),
                    title: "Paiement sécurisé",
                    description: "Transactions protégées et garantie satisfaction sur tous les projets"
                  },
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-[#4CAF50]/10 rounded-xl flex items-center justify-center text-[#4CAF50] flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-[#111] mb-1">{feature.title}</h3>
                      <p className="text-[#666] font-light text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TÉMOIGNAGES ================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light mb-4">Ce que disent nos clients</h2>
            <p className="text-lg text-[#666] font-light">Plus de 12 000 projets réalisés avec succès</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sophie Martin",
                role: "Rénovation appartement",
                location: "Paris 11ème",
                rating: 5,
                text: "Service impeccable ! J'ai trouvé un architecte d'intérieur génial en quelques jours. La rénovation de mon appartement s'est déroulée sans accroc.",
                avatar: "SM"
              },
              {
                name: "Thomas Dubois",
                role: "Extension maison",
                location: "Lyon",
                rating: 5,
                text: "Excellent suivi du projet. L'entrepreneur général recommandé était très professionnel. Je recommande vivement cette plateforme.",
                avatar: "TD"
              },
              {
                name: "Julie Renard",
                role: "Création jardin",
                location: "Bordeaux",
                rating: 5,
                text: "Le paysagiste trouvé via Les Bons Bras a transformé notre jardin. Résultat au-delà de nos attentes !",
                avatar: "JR"
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 hover:border-[#4CAF50]/30 hover:shadow-xl transition-all duration-300">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-[#4CAF50]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Text */}
                <p className="text-[#666] font-light leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
                  <div className="w-12 h-12 bg-[#4CAF50]/10 rounded-full flex items-center justify-center text-[#4CAF50] font-medium">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-[#111]">{testimonial.name}</div>
                    <div className="text-sm text-[#666] font-light">{testimonial.role} • {testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA FINAL ================= */}
      <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#4CAF50] to-[#45a049] text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-light mb-6">
              Prêt à démarrer votre projet ?
            </h2>
            <p className="text-xl text-white/90 font-light max-w-2xl mx-auto">
              Décrivez vos besoins et recevez des recommandations personnalisées de professionnels vérifiés
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <input
                type="text"
                placeholder="Votre nom"
                value={formData.nom}
                onChange={(e) => setFormData({...formData, nom: e.target.value})}
                className="bg-white/10 border border-white/30 rounded-xl px-6 py-4 text-white placeholder:text-white/60 focus:outline-none focus:border-white transition-all backdrop-blur-sm"
                required
              />
              <input
                type="email"
                placeholder="Votre email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="bg-white/10 border border-white/30 rounded-xl px-6 py-4 text-white placeholder:text-white/60 focus:outline-none focus:border-white transition-all backdrop-blur-sm"
                required
              />
            </div>
            
            <input
              type="text"
              placeholder="Type de projet (ex: Rénovation cuisine, Extension maison...)"
              value={formData.projet}
              onChange={(e) => setFormData({...formData, projet: e.target.value})}
              className="w-full bg-white/10 border border-white/30 rounded-xl px-6 py-4 text-white placeholder:text-white/60 focus:outline-none focus:border-white transition-all mb-6 backdrop-blur-sm"
              required
            />

            <textarea
              placeholder="Décrivez votre projet en quelques mots..."
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              rows={5}
              className="w-full bg-white/10 border border-white/30 rounded-xl px-6 py-4 text-white placeholder:text-white/60 focus:outline-none focus:border-white transition-all resize-none mb-8 backdrop-blur-sm"
              required
            />

            <button
              type="submit"
              className="w-full md:w-auto px-12 py-4 bg-white text-[#4CAF50] rounded-full font-medium hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              Recevoir des recommandations
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <p className="text-sm text-white/70 mt-6 text-center md:text-left font-light">
              🔒 Vos données sont protégées et ne seront jamais partagées
            </p>
          </form>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#111] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-3xl text-[#4CAF50] font-bold">*</span>
                <span className="text-xl font-light">Les Bons Bras</span>
              </div>
              <p className="text-gray-400 font-light text-sm leading-relaxed">
                La plateforme de mise en relation avec les meilleurs professionnels de la rénovation
              </p>
              {/* Social */}
              <div className="flex gap-4 mt-6">
                {['facebook', 'instagram', 'linkedin'].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#4CAF50] transition-all">
                    <span className="sr-only">{social}</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-medium mb-6">Services</h4>
              <ul className="space-y-3 text-sm">
                {['Trouver un pro', 'Devenir professionnel', 'Comment ça marche', 'Tarifs'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors font-light">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Professions */}
            <div>
              <h4 className="font-medium mb-6">Professionnels</h4>
              <ul className="space-y-3 text-sm">
                {['Architectes', 'Designers d\'intérieur', 'Plombiers', 'Électriciens', 'Entrepreneurs', 'Paysagistes'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors font-light">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-medium mb-6">Contact</h4>
              <ul className="space-y-3 text-sm text-gray-400 font-light">
                <li>contact@lesbonsbras.com</li>
                <li>+33 1 23 45 67 89</li>
                <li>Paris, France</li>
              </ul>
              <div className="mt-6">
                <h4 className="font-medium mb-3">Légal</h4>
                <ul className="space-y-2 text-sm">
                  {['Mentions légales', 'CGV', 'Politique de confidentialité'].map((item) => (
                    <li key={item}>
                      <Link href="#" className="text-gray-400 hover:text-white transition-colors font-light">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm font-light">
                © 2025 Les Bons Bras. Tous droits réservés.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400 font-light">
                <span>Fait avec</span>
                <span className="text-[#4CAF50]">*</span>
                <span>à Paris</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}