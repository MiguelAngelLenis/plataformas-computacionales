import { FormInput, FormPanel, FormSelect } from "@/components/ui/FormControls";
import type { CreatePedidoDto, Repartidor, Restaurante, User } from "@/types/api";

export function PedidoForm({
  value,
  users,
  repartidores,
  restaurantes,
  onChange,
  onSubmit,
  submitLabel,
}: {
  value: CreatePedidoDto;
  users: User[];
  repartidores: Repartidor[];
  restaurantes: Restaurante[];
  onChange: (value: CreatePedidoDto) => void;
  onSubmit: () => void | Promise<void>;
  submitLabel: string;
}) {
  const availableRepartidores = repartidores.filter((item) => item.restauranteId === value.restauranteId);

  return (
    <FormPanel onSubmit={onSubmit} className="mt-5 grid gap-3 rounded-2xl border bg-slate-50 p-4 md:grid-cols-3">
      <FormInput placeholder="Nombre / descripción" value={value.name} onChange={(event) => onChange({ ...value, name: event.target.value })} maxLength={100} required />
      <FormInput type="number" min={1} step={1} placeholder="Número de pedido" value={value.num_pedido} onChange={(event) => onChange({ ...value, num_pedido: Number(event.target.value) })} required />
      <FormInput type="number" min={0} step="0.01" placeholder="Costo" value={value.costo} onChange={(event) => onChange({ ...value, costo: Number(event.target.value) })} required />
      <FormInput placeholder="Estado del pedido" value={value.estado_pedido ?? ""} onChange={(event) => onChange({ ...value, estado_pedido: event.target.value })} />
      <FormSelect value={value.userId} onChange={(event) => onChange({ ...value, userId: event.target.value })} required>
        <option value="">Selecciona un cliente</option>
        {users.map((user) => <option key={user.id} value={user.id}>{user.id} — {user.name}</option>)}
      </FormSelect>
      <FormSelect value={value.restauranteId || ""} onChange={(event) => onChange({ ...value, restauranteId: Number(event.target.value), repartidorId: "" })} required>
        <option value="">Selecciona un restaurante</option>
        {restaurantes.map((restaurante) => <option key={restaurante.id} value={restaurante.id}>{restaurante.name}</option>)}
      </FormSelect>
      <FormSelect value={value.repartidorId} onChange={(event) => onChange({ ...value, repartidorId: event.target.value })} required>
        <option value="">Selecciona un repartidor</option>
        {availableRepartidores.map((repartidor) => <option key={repartidor.id} value={repartidor.id}>{repartidor.name}</option>)}
      </FormSelect>
      <label className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm">
        <input type="checkbox" checked={value.isActive ?? true} onChange={(event) => onChange({ ...value, isActive: event.target.checked })} />
        Activo
      </label>
      <button className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 py-2.5 font-semibold text-slate-950 md:col-span-3">{submitLabel}</button>
    </FormPanel>
  );
}
