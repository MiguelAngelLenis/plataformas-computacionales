"use client";

import Link from "next/link";
import { use, useState } from "react";
import { RestauranteForm } from "@/components/restaurantes/RestauranteForm";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { EntityCard } from "@/components/ui/EntityCard";
import { EntityDetailLayout } from "@/components/ui/EntityDetailLayout";
import { useEntityDetail } from "@/hooks/useEntityDetail";
import { restaurantesService } from "@/modules/restaurantes/services/restaurantesService";
import type { CreateRestauranteDto } from "@/types/api";

const emptyForm: CreateRestauranteDto = {
  name: "",
  menu: "",
  TiempoRealizacionAprox: 0,
  Calificacion: 0,
  CapacidadMaxPedidos: 1,
  isAbierto: true,
};

export default function RestauranteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { entity: restaurante, loading, error, reload } = useEntityDetail(id, restaurantesService.getById);
  const [formOverride, setFormOverride] = useState<CreateRestauranteDto | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const form = formOverride ?? (restaurante ? {
    name: restaurante.name,
    menu: restaurante.menu ?? "",
    TiempoRealizacionAprox: Number(restaurante.TiempoRealizacionAprox),
    Calificacion: Number(restaurante.Calificacion),
    CapacidadMaxPedidos: restaurante.CapacidadMaxPedidos,
    isAbierto: restaurante.isAbierto,
  } : emptyForm);

  async function update() {
    try {
      setSaveError(null);
      await restaurantesService.update(id, { ...form, menu: form.menu || null });
      await reload();
    } catch (cause: unknown) {
      setSaveError(cause instanceof Error ? cause.message : String(cause));
    }
  }

  if (loading) return <LoadingState label="Cargando restaurante..." />;
  if (error) return <ErrorState message={error} />;
  if (!restaurante) return <EmptyState>Restaurante no encontrado.</EmptyState>;

  return (
    <EntityDetailLayout accent="emerald" backHref="/restaurantes" backLabel="restaurantes" title={restaurante.name} description={`Detalle del restaurante · ID ${restaurante.id}`}>
      <EntityCard accent="emerald">
        <div className="grid gap-4 sm:grid-cols-3">
          <p><span className="text-sm text-slate-500">Calificación</span><br /><strong>★ {Number(restaurante.Calificacion).toFixed(1)}</strong></p>
          <p><span className="text-sm text-slate-500">Tiempo aproximado</span><br /><strong>{Number(restaurante.TiempoRealizacionAprox)} min</strong></p>
          <p><span className="text-sm text-slate-500">Capacidad máxima</span><br /><strong>{restaurante.CapacidadMaxPedidos} pedidos</strong></p>
        </div>
        <p className="mt-4 text-sm text-slate-600">{restaurante.menu || "Menú no especificado"}</p>
        <p className="mt-4 text-sm">{restaurante.isAbierto ? "🟢 Abierto" : "⚪ Cerrado"}</p>
        <div className="mt-5 flex flex-wrap gap-4 text-sm font-medium">
          <Link href="/repartidores" className="text-violet-800 hover:underline">{restaurante.repartidores?.length ?? 0} repartidores</Link>
          <Link href="/pedidos" className="text-amber-800 hover:underline">{restaurante.pedidos?.length ?? 0} pedidos</Link>
        </div>
      </EntityCard>
      <section className="mt-6">
        <h2 className="text-lg font-semibold">Editar restaurante</h2>
        {saveError && <div className="mt-3"><ErrorState message={saveError} /></div>}
        <RestauranteForm value={form} onChange={setFormOverride} onSubmit={update} submitLabel="Guardar cambios" />
      </section>
    </EntityDetailLayout>
  );
}
