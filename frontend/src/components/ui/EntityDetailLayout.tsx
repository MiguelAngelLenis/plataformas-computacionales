import Link from "next/link";
import type { ReactNode } from "react";
import { EntityPageHeader } from "./EntityPageHeader";

export function EntityDetailLayout({
  accent,
  backHref,
  backLabel,
  title,
  description,
  children,
}: {
  accent: "blue" | "emerald" | "violet";
  backHref: string;
  backLabel: string;
  title: string;
  description: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <Link href={backHref} className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-950">
        ← Volver a {backLabel}
      </Link>
      <EntityPageHeader accent={accent} title={title} description={description} />
      {children}
    </div>
  );
}
