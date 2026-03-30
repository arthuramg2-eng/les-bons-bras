"use client";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  en_cours: { label: "En cours", color: "#2C5F3F", bg: "rgba(76,175,80,0.1)" },
  planifie: { label: "Planifie", color: "#6366F1", bg: "rgba(99,102,241,0.1)" },
  termine: { label: "Termine", color: "#10B981", bg: "rgba(16,185,129,0.1)" },
  en_pause: { label: "En pause", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
};

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || { label: status, color: "#999", bg: "rgba(156,163,175,0.1)" };

  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-medium"
      style={{ background: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  );
}
