"use client";

import StarRating from "./StarRating";

interface ProCardProps {
  pro: {
    id: string;
    full_name: string;
    company_name: string;
    specialty: string[];
    avatar_url?: string | null;
    cover_url?: string | null;
    rating: number;
    total_reviews: number;
    service_area?: string | null;
    years_experience?: number;
    verified: boolean;
  };
  onClick?: () => void;
}

export default function ProCard({ pro, onClick }: ProCardProps) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-[#2C5F3F]/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Cover */}
      <div className="relative">
        {pro.cover_url ? (
          <img src={pro.cover_url} alt="" className="w-full aspect-[3/1] object-cover" />
        ) : (
          <div className="w-full aspect-[3/1] bg-gradient-to-br from-[#2C5F3F]/20 to-[#2C5F3F]/5" />
        )}
        {pro.verified && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 text-[#2C5F3F] backdrop-blur-sm">
            ✓ Verifie
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          {pro.avatar_url ? (
            <img src={pro.avatar_url} alt={pro.full_name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-[#2C5F3F] flex items-center justify-center text-white text-lg font-light flex-shrink-0">
              {pro.full_name.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-medium text-[#111] group-hover:text-[#2C5F3F] transition-colors truncate">{pro.full_name}</h3>
            <p className="text-sm text-[#666] font-light truncate">{pro.company_name}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {pro.specialty?.slice(0, 2).map((s) => (
            <span key={s} className="px-2.5 py-0.5 rounded-full text-xs font-light bg-[#F4F0EB] text-[#666]">
              {s}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <StarRating rating={pro.rating} count={pro.total_reviews} size="sm" />
          {pro.service_area && (
            <span className="text-xs text-[#999] font-light truncate ml-2">{pro.service_area}</span>
          )}
        </div>
      </div>
    </button>
  );
}
