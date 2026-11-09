import { FormInput, FormPanel, FormSelect } from "@/components/ui/FormControls";
import type { CreateRepartidorDto, Restaurante, User } from "@/types/api";

export function RepartidorForm({
  value,
  users,
  restaurantes,
  onChange,
  onSubmit,
  submitLabel,
  editing = false,
}: {
  value: CreateRepartidorDto;
  users: User[];
  restaurantes: Restaurante[];
  onChange: (value: CreateRepartidorDto) => void;
  onSubmit: () => void | Promise<void>;
  submitLabel: string;
  editing?: boolean;
}) {
  return (
    <FormPanel onSubmit={onSubmit} className="mt-5 grid gap-3 rounded-2xl border bg-slate-50 p-4 md:grid-cols-3">
      {!editing && <FormInput placeholder="Documento (5-20 dígitos)" value={value.id} onChange={(event) => onChange({ ...value, id: event.target.value })} pattern="\d{5,20}" required />}
      <FormInput placeholder="Nombre" value={value.name} onChange={(event) => onChange({ ...value, name: event.target.value })} minLength={2} maxLength={100} required />
      <FormInput type="email" placeholder="Correo" value={value.email} onChange={(event) => onChange({ ...value, email: event.target.value })} required />
      <FormInput type="number" min={0} max={130} step={1} placeholder="Edad" value={value.age} onChange={(event) => onChange({ ...value, age: Number(event.target.value) })} required />
      <FormInput type="tel" placeholder="Teléfono" value={value.phone} onChange={(event) => onChange({ ...value, phone: event.target.value })} pattern="\+?[0-9]{7,15}" required />
      <FormInput type="number" min={0} step="0.01" placeholder="Calificación" value={value.Calificacion} onChange={(event) => onChange({ ...value, Calificacion: Number(event.target.value) })} required />
      <FormInput type="number" min={0} step="0.01" placeholder="Tiempo entrega aprox." value={value.TiempoEntregaAprox} onChange={(event) => onChange({ ...value, TiempoEntregaAprox: Number(event.target.value) })} required />
      <FormInput type="number" min={0} step="0.01" placeholder="Ganancia acumulada" value={value.GanancciaAcumulada} onChange={(event) => onChange({ ...value, GanancciaAcumulada: Number(event.target.value) })} required />
      <FormSelect value={value.userId} onChange={(event) => onChange({ ...value, userId: event.target.value })} required>
        <option value="">Selecciona un cliente</option>
        {users.map((user) => <option key={user.id} value={user.id}>{user.id} — {user.name}</option>)}
      </FormSelect>
      <FormSelect value={value.restauranteId || ""} onChange={(event) => onChange({ ...value, restauranteId: Number(event.target.value) })} required>
        <option value="">Selecciona un restaurante</option>
        {restaurantes.map((restaurante) => <option key={restaurante.id} value={restaurante.id}>{restaurante.name}</option>)}
      </FormSelect>
      <button className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 font-semibold text-white md:col-span-3">{submitLabel}</button>
    </FormPanel>
  );
}
