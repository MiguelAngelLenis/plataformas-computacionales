"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RepartidorForm } from "@/components/repartidores/RepartidorForm";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { EntityCard } from "@/components/ui/EntityCard";
import { EntityPageHeader } from "@/components/ui/EntityPageHeader";
import { repartidoresService } from "@/modules/repartidores/services/repartidoresService";
import { restaurantesService } from "@/modules/restaurantes/services/restaurantesService";
import { usersService } from "@/modules/users/services/usersService";
import type { CreateRepartidorDto, Repartidor, Restaurante, User } from "@/types/api";

const emptyForm: CreateRepartidorDto = {
  id: "",
  name: "",
  email: "",
  age: 0,
  phone: "",
  Calificacion: 0,
  TiempoEntregaAprox: 0,
  GanancciaAcumulada: 0,
  isActive: true,
  userId: "",
  restauranteId: 0,
};

export default function RepartidoresPage() {
  const [repartidores, setRepartidores] = useState<Repartidor[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const [repartidorData, userData, restauranteData] = await Promise.all([
        repartidoresService.getAll(),
        usersService.getAll(),
        restaurantesService.getAll(),
      ]);
      setRepartidores(repartidorData);
      setUsers(userData.filter((user) => user.isActive));
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
      await repartidoresService.create(form);
      setForm(emptyForm);
      await load();
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : String(cause));
    }
  }

  async function remove(repartidor: Repartidor) {
    if (!confirm(`¿Desactivar a ${repartidor.name}?`)) return;
    try {
      setError(null);
      await repartidoresService.delete(repartidor.id);
      await load();
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : String(cause));
    }
  }

  useEffect(() => { void Promise.resolve().then(load); }, []);

  return (
    <div className="space-y-6">
      <EntityPageHeader accent="violet" title="Repartidores" description={`${repartidores.length} repartidores activos`} />
      <RepartidorForm value={form} users={users} restaurantes={restaurantes} onChange={setForm} onSubmit={create} submitLabel="+ Crear repartidor" />
      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}
      {!loading && repartidores.length === 0 && <EmptyState>No hay repartidores activos.</EmptyState>}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {repartidores.map((repartidor) => (
          <EntityCard key={repartidor.id} accent="violet">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{repartidor.name}</h2>
                <p className="mt-1 break-all text-sm text-slate-500">{repartidor.email}</p>
              </div>
              <span className="rounded-full bg-violet-50 px-3 py-1 text-sm font-semibold text-violet-800">★ {Number(repartidor.Calificacion).toFixed(1)}</span>
            </div>
            <p className="mt-4 text-sm text-slate-600">{repartidor.restaurante?.name ?? `Restaurante ${repartidor.restauranteId}`}</p>
            <p className="mt-1 text-xs text-slate-500">{repartidor.pedidos?.length ?? 0} pedidos · entrega {Number(repartidor.TiempoEntregaAprox)} min aprox.</p>
            <div className="mt-5 flex items-center justify-between">
              <Link href={`/repartidores/${encodeURIComponent(repartidor.id)}`} className="text-sm font-semibold text-violet-800 hover:underline">Ver / editar</Link>
              <button onClick={() => void remove(repartidor)} className="text-sm font-medium text-red-700 hover:underline">Desactivar</button>
            </div>
          </EntityCard>
        ))}
      </div>
    </div>
  );
}
