"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RestauranteForm } from "@/components/restaurantes/RestauranteForm";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { EntityCard } from "@/components/ui/EntityCard";
import { EntityPageHeader } from "@/components/ui/EntityPageHeader";
import { restaurantesService } from "@/modules/restaurantes/services/restaurantesService";
import type { CreateRestauranteDto, Restaurante } from "@/types/api";

const emptyForm: CreateRestauranteDto = {
  name: "",
  menu: "",
  TiempoRealizacionAprox: 0,
  Calificacion: 0,
  CapacidadMaxPedidos: 1,
  isAbierto: true,
};

export default function RestaurantesPage() {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      setRestaurantes(await restaurantesService.getAll());
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setLoading(false);
    }
  }

  async function create() {
    try {
      await restaurantesService.create({ ...form, menu: form.menu || null });
      setForm(emptyForm);
      await load();
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : String(cause));
    }
  }

  async function remove(restaurante: Restaurante) {
    if (!confirm(`¿Eliminar el restaurante ${restaurante.name}?`)) return;
    try {
      setError(null);
      await restaurantesService.delete(String(restaurante.id));
      await load();
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : String(cause));
    }
  }

  useEffect(() => { void Promise.resolve().then(load); }, []);

  return (
    <div className="space-y-6">
      <EntityPageHeader accent="emerald" title="Restaurantes" description={`${restaurantes.length} restaurantes registrados`} />
      <RestauranteForm value={form} onChange={setForm} onSubmit={create} submitLabel="+ Crear restaurante" />
      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}
      {!loading && restaurantes.length === 0 && <EmptyState>No hay restaurantes registrados.</EmptyState>}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {restaurantes.map((restaurante) => (
          <EntityCard key={restaurante.id} accent="emerald">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{restaurante.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{restaurante.isAbierto ? "Abierto" : "Cerrado"} · ID {restaurante.id}</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">★ {Number(restaurante.Calificacion).toFixed(1)}</span>
            </div>
            <p className="mt-4 line-clamp-2 text-sm text-slate-600">{restaurante.menu || "Menú no especificado"}</p>
            <p className="mt-3 text-xs text-slate-500">{restaurante.CapacidadMaxPedidos} pedidos de capacidad · {Number(restaurante.TiempoRealizacionAprox)} min aprox.</p>
            <div className="mt-5 flex items-center justify-between">
              <Link href={`/restaurantes/${restaurante.id}`} className="text-sm font-semibold text-emerald-800 hover:underline">Ver / editar</Link>
              <button onClick={() => void remove(restaurante)} className="text-sm font-medium text-red-700 hover:underline">Eliminar</button>
            </div>
          </EntityCard>
        ))}
      </div>
    </div>
  );
}
