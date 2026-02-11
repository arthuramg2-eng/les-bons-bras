"use client";

import Link from "next/link";
import { useState } from "react";

const services = [
  { 
    label: "Plombier", 
    slug: "plombier",
    description: "Installation, dépannage et rénovation sanitaire",
    icon: "💧"
  },
  { 
    label: "Électricien", 
    slug: "electricien",
    description: "Installation électrique et domotique",
    icon: "⚡"
  },
  { 
    label: "Entrepreneur général", 
    slug: "entrepreneur-general",
    description: "Gestion complète de projets de rénovation",
    icon: "🏗️"
  },
  { 
    label: "Designer d'intérieur", 
    slug: "designer-interieur",
    description: "Conception et aménagement d'espaces",
    icon: "✨"
  },
  { 
    label: "Architecte", 
    slug: "architecte",
    description: "Conception architecturale et rénovation",
    icon: "📐"
  },
  { 
    label: "Paysagiste", 
    slug: "paysagiste",
    description: "Création et entretien d'espaces verts",
    icon: "🌿"
  },
];

export default function TrouverUnProfessionnel() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = services.filter(service =>
    service.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* HERO SECTION */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Bouton retour */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-[#666] hover:text-[#111] transition-colors mb-12 group font-light text-sm"
          >
            <svg 
              className="w-4 h-4 group-hover:-translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à l'accueil
          </Link>

          {/* Hero content */}
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="text-5xl text-[#4CAF50] font-bold">*</div>
            </div>
            <h1 className="text-4xl md:text-6xl font-light text-[#111] mb-6 tracking-tight">
              Quel type de professionnel<br />recherchez-vous ?
            </h1>
            <p className="text-lg text-[#666] font-light leading-relaxed max-w-2xl mx-auto">
              Sélectionnez un service et découvrez les meilleurs professionnels vérifiés pour votre projet.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <svg 
                className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher un type de professionnel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border-2 border-gray-200 rounded-full text-[#111] placeholder:text-[#999] outline-none focus:border-[#4CAF50] transition-all font-light"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => (
            <Link
              key={service.slug}
              href={`/trouver-un-professionnel/${service.slug}`}
              className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-[#4CAF50]/20"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-[#4CAF50]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">{service.icon}</span>
              </div>

              {/* Content */}
              <div className="mb-6">
                <h3 className="text-2xl font-normal text-[#111] mb-2 group-hover:text-[#4CAF50] transition-colors">
                  {service.label}
                </h3>
                <p className="text-sm text-[#666] font-light leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-2 text-[#4CAF50] font-light group-hover:gap-3 transition-all">
                <span className="text-sm">Voir les professionnels</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* No results */}
        {filteredServices.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-light text-[#111] mb-2">Aucun service trouvé</h3>
            <p className="text-[#666] font-light">
              Essayez avec d'autres mots-clés
            </p>
          </div>
        )}
      </section>

      {/* TRUST SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl p-12 shadow-sm">
          <h2 className="text-3xl font-light text-[#111] text-center mb-12">
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-lg font-normal text-[#111] mb-2">Avis clients authentiques</h3>
              <p className="text-sm text-[#666] font-light leading-relaxed">
                Notes et témoignages vérifiés de clients réels
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#4CAF50]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-normal text-[#111] mb-2">Mise en relation rapide</h3>
              <p className="text-sm text-[#666] font-light leading-relaxed">
                Trouvez le bon professionnel en quelques clics
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-[#4CAF50] to-[#45a049] rounded-3xl p-12 text-center text-white shadow-xl">
          <h2 className="text-3xl md:text-4xl font-light mb-4">
            Vous êtes un professionnel ?
          </h2>
          <p className="text-white/90 mb-8 font-light max-w-2xl mx-auto leading-relaxed text-lg">
            Rejoignez notre réseau et développez votre activité en touchant de nouveaux clients.
          </p>
          <Link
            href="/devenir-professionnel"
            className="inline-block px-10 py-4 bg-white text-[#4CAF50] rounded-full text-sm font-medium tracking-wide hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            Devenir professionnel partenaire
          </Link>
        </div>
      </section>

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
                La plateforme de mise en relation avec les meilleurs professionnels de la rénovation
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
              <h4 className="font-normal mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400 font-light">
                <li>contact@lesbonsbras.com</li>
                <li>+33 1 23 45 67 89</li>
                <li>Paris, France</li>
              </ul>
            </div>

            <div>
              <h4 className="font-normal mb-4">Légal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/mentions-legales" className="text-gray-400 hover:text-white transition-colors font-light">Mentions légales</Link></li>
                <li><Link href="/cgv" className="text-gray-400 hover:text-white transition-colors font-light">CGV</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors font-light">À propos</Link></li>
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