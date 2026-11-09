import type { ReactNode } from "react";

type Accent = "blue" | "emerald" | "violet" | "slate";

const accentClasses: Record<Accent, string> = {
  blue: "bg-gradient-to-r from-blue-500 to-indigo-600",
  emerald: "bg-gradient-to-r from-emerald-500 to-teal-600",
  violet: "bg-gradient-to-r from-violet-500 to-indigo-600",
  slate: "bg-gradient-to-r from-slate-400 to-slate-600",
};

// Cascarón visual común para las tarjetas de usuarios, productos y órdenes.
export function EntityCard({
  accent,
  children,
  className = "",
}: {
  accent: Accent;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article className={`group relative overflow-hidden rounded-[20px] border border-stone-200/90 bg-[#fffdf9] shadow-[0_8px_24px_rgb(71,55,34,0.06)] hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgb(71,55,34,0.12)] transition ${className}`}>
      <div className={`h-1.5 ${accentClasses[accent]}`} />
      <div className="p-5">{children}</div>
    </article>
  );
}
