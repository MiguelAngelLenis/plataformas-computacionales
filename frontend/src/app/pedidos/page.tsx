"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PedidoForm } from "@/components/pedidos/PedidoForm";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { EntityCard } from "@/components/ui/EntityCard";
import { EntityPageHeader } from "@/components/ui/EntityPageHeader";
import { pedidosService } from "@/modules/pedidos/services/pedidosService";
import { repartidoresService } from "@/modules/repartidores/services/repartidoresService";
import { restaurantesService } from "@/modules/restaurantes/services/restaurantesService";
import { usersService } from "@/modules/users/services/usersService";
import type { CreatePedidoDto, Pedido, Repartidor, Restaurante, User } from "@/types/api";

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

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [repartidores, setRepartidores] = useState<Repartidor[]>([]);
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const [pedidoData, userData, repartidorData, restauranteData] = await Promise.all([
        pedidosService.getAll(),
        usersService.getAll(),
        repartidoresService.getAll(),
        restaurantesService.getAll(),
      ]);
      setPedidos(pedidoData);
      setUsers(userData.filter((user) => user.isActive));
      setRepartidores(repartidorData);
      setRestaurantes(restauranteData);
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setLoading(false);
    }
  }

  async function create() {
    try {
      setError(null);
      await pedidosService.create(form);
      setForm(emptyForm);
      await load();
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : String(cause));
    }
  }

  async function remove(pedido: Pedido) {
    if (!confirm(`¿Eliminar el pedido ${pedido.num_pedido}?`)) return;
    try {
      setError(null);
      await pedidosService.delete(String(pedido.id));
      await load();
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : String(cause));
    }
  }

  useEffect(() => { void Promise.resolve().then(load); }, []);

  return (
    <div className="space-y-6">
      <EntityPageHeader accent="violet" title="Pedidos" description={`${pedidos.length} pedidos registrados · cliente, repartidor y restaurante`} />
      <PedidoForm value={form} users={users} repartidores={repartidores} restaurantes={restaurantes} onChange={setForm} onSubmit={create} submitLabel="+ Crear pedido" />
      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}
      {!loading && pedidos.length === 0 && <EmptyState>No hay pedidos registrados.</EmptyState>}
      <div className="grid gap-4">
        {pedidos.map((pedido) => (
          <EntityCard key={pedido.id} accent="violet">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">#{pedido.num_pedido} — {pedido.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{pedido.estado_pedido || "Sin estado"} · {pedido.isActive ? "Activo" : "Inactivo"}</p>
              </div>
              <p className="text-xl font-bold">${Number(pedido.costo).toFixed(2)}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
              <span>Cliente: {pedido.user?.name ?? pedido.userId}</span>
              <span>Repartidor: {pedido.repartidor?.name ?? pedido.repartidorId}</span>
              <span>Restaurante: {pedido.restaurante?.name ?? pedido.restauranteId}</span>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <Link href={`/pedidos/${pedido.id}`} className="text-sm font-semibold text-violet-800 hover:underline">Ver / editar</Link>
              <button onClick={() => void remove(pedido)} className="text-sm font-medium text-red-700 hover:underline">Eliminar</button>
            </div>
          </EntityCard>
        ))}
      </div>
    </div>
  );
}
