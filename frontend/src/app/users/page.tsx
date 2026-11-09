"use client";
import { useEffect, useState } from "react";
import { usersService } from "@/modules/users/services/usersService";
import type { User } from "@/types/api";
import { UserCard } from "@/components/users/UserCard";
import { UserCreateForm } from "@/components/users/UserCreateForm";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { EntityPageHeader } from "@/components/ui/EntityPageHeader";

export default function UsersPage() {
  // Componente contenedor: aquí viven el estado y las llamadas a usersService.
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [form, setForm] = useState({ id: "", name: "", email: "", age: 0, phone: "" });

  async function load() {
    try {
      setLoading(true);
      setErr(null);
      const data = await usersService.getAll();
      setUsers(data);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  async function create() {
    try {
      await usersService.create({ ...form, age: Number(form.age) });

      setForm({ id: "", name: "", email: "", age: 0, phone: "" });

      await load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : String(e));
    }
  }

  // eslint-disable-next-line
  useEffect(() => { void load(); }, []);

  return (
    <div className="space-y-6">
      <EntityPageHeader accent="blue" title="Users" description={<>CRUD con validación y soft delete • {users.length} activos</>} action={<button onClick={() => void load()} className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-black">Recargar</button>}>
        {/* UserCreateForm recibe el estado controlado y reporta cambios con onChange. */}
        <UserCreateForm value={form} onChange={setForm} onSubmit={create} />
      </EntityPageHeader>

      {loading && <LoadingState />}
      {err && <ErrorState message={err} />}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(user => <UserCard key={user.id} user={user} onDeactivate={async item => { if (confirm(`Desactivar a ${item.name}?`)) { await usersService.delete(item.id); await load(); } }} />)}
      </div>
      {users.length === 0 && !loading && <EmptyState>No hay usuarios — crea uno arriba</EmptyState>}
    </div>
  );
}
