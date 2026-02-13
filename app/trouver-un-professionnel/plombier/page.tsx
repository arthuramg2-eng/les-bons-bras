"use client";

import Link from "next/link";
import { useState } from "react";

export default function PlombierPage() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const plombiers = [
    {
      id: 1,
      nom: "Plomberie Expert",
      description: "Installation et rénovation sanitaire complète",
      experience: "16 ans",
      ville: "Paris",
      note: 4.8,
      avis: 167,
      image: "/images/plombier1.jpg",
      disponible: true,
      specialites: ["Installation", "Rénovation"],
      tarif: "60€/h",
      verified: true,
      testimonial: "Installation parfaite de notre salle de bain, très professionnel."
    },
    {
      id: 2,
      nom: "Aqua Services",
      description: "Dépannage urgent et entretien de plomberie 24/7",
      experience: "13 ans",
      ville: "Lyon",
      note: 4.9,
      avis: 192,
      image: "/images/plombier2.jpg",
      disponible: true,
      specialites: ["Dépannage urgent", "24/7"],
      tarif: "70€/h",
      verified: true,
      testimonial: "Intervention très rapide en pleine nuit, problème résolu."
    },
    {
      id: 3,
      nom: "Pro Sanitaire",
      description: "Spécialiste en chauffage et chaudière",
      experience: "19 ans",
      ville: "Marseille",
      note: 4.7,
      avis: 145,
      image: "/images/plombier3.jpg",
      disponible: false,
      specialites: ["Chauffage", "Chaudière"],
      tarif: "65€/h",
      verified: true,
      testimonial: "Excellent travail sur notre système de chauffage."
    },
  ];

  const filters = [
    { id: "verified", label: "✓ Vérifiés", icon: "✓" },
    { id: "available", label: "Disponible cette semaine", icon: "📅" },
    { id: "top-rated", label: "⭐ 4.8+", icon: "⭐" },
    { id: "urgent", label: "Dépannage urgent", icon: "🚨" },
    { id: "heating", label: "Chauffage", icon: "♨️" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* HERO SECTION */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Bouton retour */}
          <Link 
            href="/trouver-un-professionnel"
            className="inline-flex items-center gap-2 text-[#666] hover:text-[#111] transition-colors mb-8 group font-light text-sm"
          >
            <svg 
              className="w-4 h-4 group-hover:-translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour aux services
          </Link>

          {/* Hero content */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="text-4xl text-[#4CAF50] font-bold">*</div>
            </div>
            <h1 className="text-4xl md:text-5xl font-light text-[#111] mb-4 tracking-tight">
              Trouvez un plombier de confiance
            </h1>
            <p className="text-lg text-[#666] font-light leading-relaxed">
              Des experts en plomberie qualifiés, notés par des clients réels.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border-2 border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-shadow p-2 flex flex-col md:flex-row gap-2">
              <div className="flex-1 px-6 py-3 border-r border-gray-200">
                <label className="text-xs font-medium text-[#111] block mb-1">Ville</label>
                <input 
                  type="text" 
                  placeholder="Paris, Lyon, Marseille..." 
                  className="w-full text-sm text-[#666] outline-none font-light"
                />
              </div>
              <div className="flex-1 px-6 py-3">
                <label className="text-xs font-medium text-[#111] block mb-1">Type d'intervention</label>
                <input 
                  type="text" 
                  placeholder="Fuite, installation..." 
                  className="w-full text-sm text-[#666] outline-none font-light"
                />
              </div>
              <button className="bg-[#111] text-white px-8 py-4 rounded-full font-light hover:bg-[#2a2a2a] transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Rechercher
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(activeFilter === filter.id ? null : filter.id)}
                className={`px-6 py-2.5 rounded-full border-2 font-light text-sm whitespace-nowrap transition-all ${
                  activeFilter === filter.id
                    ? "bg-[#111] text-white border-[#111]"
                    : "bg-white text-[#666] border-gray-300 hover:border-[#111]"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6 text-sm text-[#666] font-light">
          {plombiers.length} plombiers disponibles
        </div>

        {/* CARDS GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {plombiers.map((plombier, index) => (
            <div
              key={plombier.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-64 bg-gray-200 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#4CAF50]/20 to-transparent" />
                {/* Placeholder - remplacez par vos vraies images */}
                <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">
                  *
                </div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {plombier.verified && (
                    <span className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-[#111] flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-[#4CAF50]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Vérifié
                    </span>
                  )}
                  {plombier.disponible && (
                    <span className="bg-[#4CAF50] text-white px-3 py-1 rounded-full text-xs font-light flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      Disponible
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Header */}
                <div className="mb-3">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-normal text-[#111] group-hover:text-[#4CAF50] transition-colors">
                      {plombier.nom}
                    </h3>
                    <div className="flex items-center gap-1 bg-[#F8F7F4] px-2.5 py-1 rounded-lg">
                      <svg className="w-4 h-4 text-[#4CAF50]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-medium text-[#111]">{plombier.note}</span>
                      <span className="text-xs text-[#666]">({plombier.avis})</span>
                    </div>
                  </div>
                  
                  {/* Specialités */}
                  <div className="flex gap-2 mb-3">
                    {plombier.specialites.map((spec, i) => (
                      <span key={i} className="text-xs text-[#666] bg-[#F8F7F4] px-2.5 py-1 rounded-full font-light">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-[#666] font-light leading-relaxed mb-4 line-clamp-2">
                  {plombier.description}
                </p>

                {/* Meta info */}
                <div className="flex items-center gap-4 text-xs text-[#666] font-light mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {plombier.ville}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {plombier.experience}
                  </div>
                </div>

                {/* Testimonial */}
                {plombier.testimonial && (
                  <div className="mb-4 p-3 bg-[#F8F7F4] rounded-xl">
                    <p className="text-xs text-[#666] font-light italic line-clamp-2">
                      "{plombier.testimonial}"
                    </p>
                  </div>
                )}

                {/* Price & CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-[#111] font-medium">À partir de {plombier.tarif}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button className="bg-[#111] text-white px-4 py-3 rounded-xl font-light text-sm hover:bg-[#2a2a2a] transition-all">
                    Contacter
                  </button>
                  <button className="border-2 border-[#111] text-[#111] px-4 py-3 rounded-xl font-light text-sm hover:bg-[#111] hover:text-white transition-all">
                    Voir le profil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* TRUST SECTION */}
        <section className="bg-white rounded-3xl p-12 shadow-sm mb-16">
          <h2 className="text-2xl font-light text-[#111] text-center mb-10">
            Pourquoi choisir Les Bons Bras ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#4CAF50]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-normal text-[#111] mb-2">Professionnels vérifiés</h3>
              <p className="text-sm text-[#666] font-light leading-relaxed">
                Chaque professionnel est vérifié et validé par notre équipe
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#4CAF50]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-normal text-[#111] mb-2">Paiement sécurisé</h3>
              <p className="text-sm text-[#666] font-light leading-relaxed">
                Transactions protégées et garanties satisfaction
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#4CAF50]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-normal text-[#111] mb-2">Service client réactif</h3>
              <p className="text-sm text-[#666] font-light leading-relaxed">
                Une équipe disponible pour vous accompagner
              </p>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="bg-gradient-to-br from-[#4CAF50] to-[#45a049] rounded-3xl p-12 text-center text-white shadow-xl">
          <h2 className="text-3xl font-light mb-4">
            Vous ne trouvez pas ce que vous cherchez ?
          </h2>
          <p className="text-white/90 mb-8 font-light max-w-2xl mx-auto leading-relaxed">
            Décrivez-nous votre projet et nous vous mettrons en relation avec les professionnels les plus adaptés.
          </p>
          <Link
            href="/#contact"
            className="inline-block px-10 py-4 bg-white text-[#4CAF50] rounded-full text-sm font-medium tracking-wide hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            Décrire mon projet
          </Link>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#111] text-white py-12 px-4 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[#4CAF50] text-2xl font-bold">*</span>
                <h3 className="text-xl font-light">Les Bons Bras</h3>
              </div>
              <p className="text-gray-400 font-light text-sm">
                La plateforme de mise en relation avec les meilleurs professionnels
              </p>
            </div>

            <div>
              <h4 className="font-normal mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/trouver-un-professionnel" className="text-gray-400 hover:text-white transition-colors font-light">Trouver un pro</Link></li>
                <li><Link href="/devenir-professionnel" className="text-gray-400 hover:text-white transition-colors font-light">Devenir pro</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-normal mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors font-light">À propos</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors font-light">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-normal mb-4">Légal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/mentions-legales" className="text-gray-400 hover:text-white transition-colors font-light">Mentions légales</Link></li>
                <li><Link href="/cgv" className="text-gray-400 hover:text-white transition-colors font-light">CGV</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm font-light">
              © 2025 Les Bons Bras. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}