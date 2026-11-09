export function LoadingState({ label = "Cargando..." }: { label?: string }) {
  return (
    <div className="text-center py-8">
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border text-sm text-slate-600">{label}</span>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700">
      {message} — ¿Backend en {process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}?
    </div>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center py-12 rounded-2xl bg-white border border-dashed">
      <p className="text-sm text-slate-500">{children}</p>
    </div>
  );
}
