"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { RepartidorForm } from "@/components/repartidores/RepartidorForm";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { EntityCard } from "@/components/ui/EntityCard";
import { EntityDetailLayout } from "@/components/ui/EntityDetailLayout";
import { useEntityDetail } from "@/hooks/useEntityDetail";
import { repartidoresService } from "@/modules/repartidores/services/repartidoresService";
import { restaurantesService } from "@/modules/restaurantes/services/restaurantesService";
import { usersService } from "@/modules/users/services/usersService";
import type { CreateRepartidorDto, Restaurante, UpdateRepartidorDto, User } from "@/types/api";

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

export default function RepartidorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { entity: repartidor, loading, error, reload } = useEntityDetail(id, repartidoresService.getById);
  const [users, setUsers] = useState<User[]>([]);
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [formOverride, setFormOverride] = useState<CreateRepartidorDto | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const form = formOverride ?? (repartidor ? {
    id: repartidor.id,
    name: repartidor.name,
    email: repartidor.email,
    age: repartidor.age,
    phone: repartidor.phone,
    Calificacion: Number(repartidor.Calificacion),
    TiempoEntregaAprox: Number(repartidor.TiempoEntregaAprox),
    GanancciaAcumulada: Number(repartidor.GanancciaAcumulada),
    isActive: repartidor.isActive,
    userId: repartidor.userId,
    restauranteId: repartidor.restauranteId,
  } : emptyForm);

  useEffect(() => {
    void Promise.all([usersService.getAll(), restaurantesService.getAll()])
      .then(([userData, restauranteData]) => {
        setUsers(userData.filter((user) => user.isActive));
        setRestaurantes(restauranteData);
      })
      .catch((cause: unknown) => setSaveError(cause instanceof Error ? cause.message : String(cause)));
  }, []);

  async function update() {
    try {
      setSaveError(null);
      const data: UpdateRepartidorDto = {
        name: form.name,
        email: form.email,
        age: form.age,
        phone: form.phone,
        Calificacion: form.Calificacion,
        TiempoEntregaAprox: form.TiempoEntregaAprox,
        GanancciaAcumulada: form.GanancciaAcumulada,
        isActive: form.isActive,
        userId: form.userId,
        restauranteId: form.restauranteId,
      };
      await repartidoresService.update(id, data);
      await reload();
    } catch (cause: unknown) {
      setSaveError(cause instanceof Error ? cause.message : String(cause));
    }
  }

  if (loading) return <LoadingState label="Cargando repartidor..." />;
  if (error) return <ErrorState message={error} />;
  if (!repartidor) return <EmptyState>Repartidor no encontrado.</EmptyState>;

  return (
    <EntityDetailLayout accent="violet" backHref="/repartidores" backLabel="repartidores" title={repartidor.name} description={`Detalle del repartidor · ${repartidor.id}`}>
      <EntityCard accent="violet">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <p><span className="text-sm text-slate-500">Correo</span><br /><strong className="break-all">{repartidor.email}</strong></p>
          <p><span className="text-sm text-slate-500">Teléfono</span><br /><strong>{repartidor.phone}</strong></p>
          <p><span className="text-sm text-slate-500">Edad</span><br /><strong>{repartidor.age}</strong></p>
          <p><span className="text-sm text-slate-500">Ganancia acumulada</span><br /><strong>${Number(repartidor.GanancciaAcumulada).toFixed(2)}</strong></p>
        </div>
        <div className="mt-5 flex flex-wrap gap-4 text-sm">
          <Link href={`/users/${encodeURIComponent(repartidor.userId)}`} className="font-medium text-blue-800 hover:underline">Cliente: {repartidor.user?.name ?? repartidor.userId}</Link>
          <Link href={`/restaurantes/${repartidor.restauranteId}`} className="font-medium text-emerald-800 hover:underline">Restaurante: {repartidor.restaurante?.name ?? repartidor.restauranteId}</Link>
          <Link href="/pedidos" className="font-medium text-amber-800 hover:underline">{repartidor.pedidos?.length ?? 0} pedidos</Link>
        </div>
      </EntityCard>
      <section className="mt-6">
        <h2 className="text-lg font-semibold">Editar repartidor</h2>
        {saveError && <div className="mt-3"><ErrorState message={saveError} /></div>}
        <RepartidorForm value={form} users={users} restaurantes={restaurantes} onChange={setFormOverride} onSubmit={update} submitLabel="Guardar cambios" editing />
      </section>
    </EntityDetailLayout>
  );
}
