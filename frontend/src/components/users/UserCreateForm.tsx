import { FormInput, FormPanel } from "@/components/ui/FormControls";

export type UserFormValues = { id: string; name: string; email: string; age: number; phone: string };

// Formulario controlado y reutilizable: no importa usersService ni modifica el estado directamente.
export function UserCreateForm({ value, onChange, onSubmit }: {
  value: UserFormValues;
  onChange: (value: UserFormValues) => void;
  onSubmit: () => void | Promise<void>;
}) {
  return (
    <FormPanel onSubmit={onSubmit} className="mt-6 grid md:grid-cols-5 gap-3 p-4 rounded-2xl bg-slate-50 border">
      <FormInput className="focus:ring-2 focus:ring-blue-500" placeholder="ID 5-20 dígitos" value={value.id} onChange={event => onChange({ ...value, id: event.target.value })} required />
      <FormInput className="focus:ring-2 focus:ring-blue-500" placeholder="Nombre" value={value.name} onChange={event => onChange({ ...value, name: event.target.value })} required />
      <FormInput className="focus:ring-2 focus:ring-blue-500" placeholder="Email" value={value.email} onChange={event => onChange({ ...value, email: event.target.value })} required />
      <FormInput className="focus:ring-2 focus:ring-blue-500" type="number" placeholder="Edad" value={value.age} onChange={event => onChange({ ...value, age: Number(event.target.value) })} required />
      <FormInput className="focus:ring-2 focus:ring-blue-500" placeholder="Tel +573..." value={value.phone} onChange={event => onChange({ ...value, phone: event.target.value })} required />
      <button className="md:col-span-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow hover:opacity-90 transition">+ Crear usuario</button>
    </FormPanel>
  );
}
