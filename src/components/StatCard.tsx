import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  iconBg: string;
}

export default function StatCard({ label, value, icon, iconBg }: StatCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-card border border-border bg-surface p-3 lg:p-4 shadow-card transition-shadow hover:shadow-modal/30">
      <div
        className="flex h-9 w-9 lg:h-10 lg:w-10 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: iconBg }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] lg:text-xs text-text-soft truncate">{label}</p>
        <p className="text-base lg:text-lg font-semibold text-text truncate">{value}</p>
      </div>
    </div>
  );
}
