"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { PedidoForm } from "@/components/pedidos/PedidoForm";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { EntityCard } from "@/components/ui/EntityCard";
import { EntityDetailLayout } from "@/components/ui/EntityDetailLayout";
import { useEntityDetail } from "@/hooks/useEntityDetail";
import { pedidosService } from "@/modules/pedidos/services/pedidosService";
import { repartidoresService } from "@/modules/repartidores/services/repartidoresService";
import { restaurantesService } from "@/modules/restaurantes/services/restaurantesService";
import { usersService } from "@/modules/users/services/usersService";
import type { CreatePedidoDto, Repartidor, Restaurante, User } from "@/types/api";

const emptyForm: CreatePedidoDto = {
  name: "",
  num_pedido: 1,
  estado_pedido: "",
  costo: 0,
  isActive: true,
  userId: "",
  repartidorId: "",
  restauranteId: 0,
};

export default function PedidoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { entity: pedido, loading, error, reload } = useEntityDetail(id, pedidosService.getById);
  const [users, setUsers] = useState<User[]>([]);
  const [repartidores, setRepartidores] = useState<Repartidor[]>([]);
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [formOverride, setFormOverride] = useState<CreatePedidoDto | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const form = formOverride ?? (pedido ? {
    name: pedido.name,
    num_pedido: pedido.num_pedido,
    estado_pedido: pedido.estado_pedido ?? "",
    costo: Number(pedido.costo),
    isActive: pedido.isActive,
    userId: pedido.userId,
    repartidorId: pedido.repartidorId,
    restauranteId: pedido.restauranteId,
  } : emptyForm);

  useEffect(() => {
    void Promise.all([usersService.getAll(), repartidoresService.getAll(), restaurantesService.getAll()])
      .then(([userData, repartidorData, restauranteData]) => {
        setUsers(userData.filter((user) => user.isActive));
        setRepartidores(repartidorData);
        setRestaurantes(restauranteData);
      })
      .catch((cause: unknown) => setSaveError(cause instanceof Error ? cause.message : String(cause)));
  }, []);

  async function update() {
    try {
      setSaveError(null);
      await pedidosService.update(id, { ...form, estado_pedido: form.estado_pedido || null });
      await reload();
    } catch (cause: unknown) {
      setSaveError(cause instanceof Error ? cause.message : String(cause));
    }
  }

  if (loading) return <LoadingState label="Cargando pedido..." />;
  if (error) return <ErrorState message={error} />;
  if (!pedido) return <EmptyState>Pedido no encontrado.</EmptyState>;

  return (
    <EntityDetailLayout accent="violet" backHref="/pedidos" backLabel="pedidos" title={`Pedido #${pedido.num_pedido}`} description={pedido.name}>
      <EntityCard accent="violet">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <p><span className="text-sm text-slate-500">Costo</span><br /><strong>${Number(pedido.costo).toFixed(2)}</strong></p>
          <p><span className="text-sm text-slate-500">Estado</span><br /><strong>{pedido.estado_pedido || "Sin estado"}</strong></p>
          <p><span className="text-sm text-slate-500">Activo</span><br /><strong>{pedido.isActive ? "Sí" : "No"}</strong></p>
          <p><span className="text-sm text-slate-500">ID</span><br /><strong>{pedido.id}</strong></p>
        </div>
        <div className="mt-5 flex flex-wrap gap-4 text-sm">
          <Link href={`/users/${encodeURIComponent(pedido.userId)}`} className="font-medium text-blue-800 hover:underline">Cliente: {pedido.user?.name ?? pedido.userId}</Link>
          <Link href={`/repartidores/${encodeURIComponent(pedido.repartidorId)}`} className="font-medium text-violet-800 hover:underline">Repartidor: {pedido.repartidor?.name ?? pedido.repartidorId}</Link>
          <Link href={`/restaurantes/${pedido.restauranteId}`} className="font-medium text-emerald-800 hover:underline">Restaurante: {pedido.restaurante?.name ?? pedido.restauranteId}</Link>
        </div>
      </EntityCard>
      <section className="mt-6">
        <h2 className="text-lg font-semibold">Editar pedido</h2>
        {saveError && <div className="mt-3"><ErrorState message={saveError} /></div>}
        <PedidoForm value={form} users={users} repartidores={repartidores} restaurantes={restaurantes} onChange={setFormOverride} onSubmit={update} submitLabel="Guardar cambios" />
      </section>
    </EntityDetailLayout>
  );
}
