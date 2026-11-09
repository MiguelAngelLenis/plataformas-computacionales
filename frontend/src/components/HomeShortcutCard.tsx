import Link from "next/link";

type Accent = "blue" | "emerald" | "violet";

const styles: Record<Accent, { icon: string; glow: string; link: string }> = {
  blue: { icon: "bg-blue-600", glow: "from-blue-100 to-indigo-100", link: "text-blue-600" },
  emerald: { icon: "bg-emerald-600", glow: "from-emerald-100 to-teal-100", link: "text-emerald-600" },
  violet: { icon: "bg-violet-600", glow: "from-violet-100 to-indigo-100", link: "text-violet-600" },
};

export function HomeShortcutCard({ href, accent, icon, title, description, action }: {
  href: string;
  accent: Accent;
  icon: string;
  title: string;
  description: string;
  action: string;
}) {
  const style = styles[accent];
  return (
    <Link href={href} className="group relative overflow-hidden rounded-[24px] border border-stone-200/90 bg-[#fffdf9] p-6 shadow-[0_8px_24px_rgb(71,55,34,0.06)] hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgb(71,55,34,0.12)] transition">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${style.glow} rounded-full blur-2xl -mr-12 -mt-12 group-hover:scale-110 transition`} />
      <div className="relative">
        <div className={`w-10 h-10 rounded-xl ${style.icon} text-white flex items-center justify-center`}>{icon}</div>
        <h3 className="font-semibold mt-3">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
        <span className={`inline-flex mt-3 text-sm font-medium ${style.link}`}>{action} →</span>
      </div>
    </Link>
  );
}
