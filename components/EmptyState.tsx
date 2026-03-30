"use client";

import Link from "next/link";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function EmptyState({ icon, title, description, ctaLabel, ctaHref }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-[#111] mb-2">{title}</h3>
      <p className="text-sm text-[#999] font-light max-w-sm mx-auto">{description}</p>
      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full bg-[#2C5F3F] text-white text-sm font-medium hover:bg-[#234B32] shadow-lg transition-all"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
