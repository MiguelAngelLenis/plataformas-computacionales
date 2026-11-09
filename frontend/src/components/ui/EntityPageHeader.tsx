import type { ReactNode } from "react";

type Accent = "blue" | "emerald" | "violet";

const accentClasses: Record<Accent, string> = {
  blue: "from-blue-600 via-indigo-600 to-violet-600",
  emerald: "from-emerald-600 via-teal-600 to-cyan-600",
  violet: "from-violet-600 via-indigo-600 to-blue-600",
};

// El contenido variable se inserta con children y la acción opcional con action.
export function EntityPageHeader({
  accent,
  title,
  description,
  action,
  children,
}: {
  accent: Accent;
  title: string;
  description: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className={`rounded-[24px] bg-gradient-to-br ${accentClasses[accent]} p-[1px]`}>
      <div className="rounded-[23px] bg-[#fffdf9]/95 p-6 shadow-[0_8px_24px_rgb(71,55,34,0.05)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
          {action}
        </div>
        {children}
      </div>
    </section>
  );
}
