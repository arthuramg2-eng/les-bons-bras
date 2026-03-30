"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import StarRating from "@/components/StarRating";

const SPECIALTY_MAP: Record<string, { label: string; icon: string; description: string }> = {
  architecte: {
    label: "Architecte",
    icon: "📐",
    description: "Des architectes qualifies pour concevoir vos projets de renovation et d'agrandissement.",
  },
  "designer-interieur": {
    label: "Designer interieur",
    icon: "✨",
    description: "Des designers d'interieur pour transformer vos espaces avec style et fonctionnalite.",
  },
  electricien: {
    label: "Electricien",
    icon: "⚡",
    description: "Des electriciens certifies pour tous vos travaux electriques en toute securite.",
  },
  "entrepreneur-general": {
    label: "Entrepreneur general",
    icon: "🏗️",
    description: "Des entrepreneurs generaux pour coordonner vos projets de renovation complets.",
  },
  paysagiste: {
    label: "Paysagiste",
    icon: "🌿",
    description: "Des paysagistes creatifs pour amenager vos espaces exterieurs.",
  },
  plombier: {
    label: "Plombier",
    icon: "💧",
    description: "Des plombiers experts pour vos installations et reparations sanitaires.",
  },
};

interface Pro {
  id: string;
  user_id: string;
  full_name: string;
  company_name: string;
  specialty: string[];
  avatar_url: string | null;
  cover_url: string | null;
  rating: number;
  total_reviews: number;
  service_area: string | null;
  years_experience: number;
  hourly_rate: number | null;
  verified: boolean;
  bio: string | null;
  description: string | null;
}

export default function SpecialtyPage() {
  const params = useParams();
  const slug = params.specialty as string;
  const config = SPECIALTY_MAP[slug];

  const [pros, setPros] = useState<Pro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!config) { setLoading(false); return; }

    async function fetchPros() {
      const supabase = createClient();
      const { data } = await (supabase.from("pro_profiles") as any)
        .select("id, user_id, full_name, company_name, specialty, avatar_url, cover_url, rating, total_reviews, service_area, years_experience, hourly_rate, verified, bio, description")
        .eq("verified", true)
        .contains("specialty", [config.label])
        .order("rating", { ascending: false });
      setPros(data || []);
      setLoading(false);
    }
    fetchPros();
  }, [slug, config]);

  if (!config) {
    return (
      <div className="min-h-screen bg-[#F4F0EB] flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-semibold text-[#2C5F3F]">Specialite introuvable</h1>
        <Link href="/trouver-un-professionnel" className="px-6 py-2 bg-[#2C5F3F] text-white rounded-full hover:bg-[#234B32] transition-colors">
          Voir tous les professionnels
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F0EB]">
      {/* HERO */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/trouver-un-professionnel"
            className="inline-flex items-center gap-2 text-[#666] hover:text-[#111] transition-colors mb-8 group font-light text-sm"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour aux services
          </Link>

          <div className="text-center max-w-3xl mx-auto">
            <div className="text-5xl mb-4">{config.icon}</div>
            <h1 className="text-4xl md:text-5xl font-light text-[#111] mb-4 tracking-tight">
              Trouvez un {config.label.toLowerCase()} de confiance
            </h1>
            <p className="text-lg text-[#666] font-light leading-relaxed">
              {config.description}
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#2C5F3F] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : pros.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">{config.icon}</div>
            <h2 className="text-2xl font-light text-[#111] mb-2">Aucun {config.label.toLowerCase()} disponible</h2>
            <p className="text-[#666] font-light mb-6">Revenez bientot, de nouveaux professionnels s'inscrivent chaque jour.</p>
            <Link href="/trouver-un-professionnel" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2C5F3F] text-white text-sm font-medium hover:bg-[#234B32] transition-all">
              Voir tous les professionnels
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-[#666] font-light mb-6">{pros.length} {config.label.toLowerCase()}{pros.length > 1 ? "s" : ""} disponible{pros.length > 1 ? "s" : ""}</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pros.map((pro) => (
                <Link
                  key={pro.id}
                  href={`/trouver-un-professionnel?pro=${pro.user_id}`}
                  className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Cover */}
                  <div className="relative h-40">
                    {pro.cover_url ? (
                      <img src={pro.cover_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#2C5F3F]/20 to-[#2C5F3F]/5" />
                    )}
                    <div className="absolute top-4 left-4 flex gap-2">
                      {pro.verified && (
                        <span className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-[#2C5F3F]">
                          ✓ Verifie
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <div className="flex items-start gap-3 mb-3">
                      {pro.avatar_url ? (
                        <img src={pro.avatar_url} alt={pro.full_name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 -mt-8 border-2 border-white shadow" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-[#2C5F3F] flex items-center justify-center text-white text-lg font-light flex-shrink-0 -mt-8 border-2 border-white shadow">
                          {pro.full_name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0 pt-1">
                        <h3 className="font-medium text-[#111] group-hover:text-[#2C5F3F] transition-colors truncate">{pro.full_name}</h3>
                        <p className="text-sm text-[#666] font-light truncate">{pro.company_name}</p>
                      </div>
                    </div>

                    {(pro.bio || pro.description) && (
                      <p className="text-sm text-[#666] font-light leading-relaxed mb-4 line-clamp-2">{pro.bio || pro.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-[#666] font-light mb-4 pb-4 border-b border-gray-100">
                      {pro.service_area && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {pro.service_area}
                        </span>
                      )}
                      {pro.years_experience > 0 && (
                        <span>{pro.years_experience} ans d'exp.</span>
                      )}
                      {pro.hourly_rate && (
                        <span className="text-[#E2711D] font-medium">{pro.hourly_rate}$/h</span>
                      )}
                    </div>

                    <StarRating rating={pro.rating} count={pro.total_reviews} size="sm" />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#2C5F3F] to-[#234B32] rounded-3xl p-12 text-center text-white shadow-xl mt-16">
          <h2 className="text-3xl font-light mb-4">
            Vous ne trouvez pas ce que vous cherchez ?
          </h2>
          <p className="text-white/90 mb-8 font-light max-w-2xl mx-auto leading-relaxed">
            Decrivez-nous votre projet et nous vous mettrons en relation avec les professionnels les plus adaptes.
          </p>
          <Link
            href="/chat-renovation"
            className="inline-block px-10 py-4 bg-white text-[#2C5F3F] rounded-full text-sm font-medium hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
          >
            Parler a l'assistant IA
          </Link>
        </section>
      </div>
    </div>
  );
}
