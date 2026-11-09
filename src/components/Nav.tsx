"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/users", label: "Clientes" },
  { href: "/products", label: "Productos" },
  { href: "/orders", label: "Órdenes" },
  { href: "/restaurantes", label: "Restaurantes" },
  { href: "/repartidores", label: "Repartidores" },
  { href: "/pedidos", label: "Pedidos" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="flex min-w-0 items-center gap-1.5 overflow-x-auto">
      {links.map((l) => {
        const active = pathname === l.href || pathname.startsWith(l.href + "/");
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`shrink-0 px-3 py-2 rounded-full text-sm font-medium transition border ${
              active
                ? "bg-amber-300 text-slate-950 border-amber-300 shadow-sm"
                : "bg-white/5 text-slate-100 border-white/10 hover:bg-white/12 hover:border-white/20"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
