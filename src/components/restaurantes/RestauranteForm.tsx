import { FormInput, FormPanel } from "@/components/ui/FormControls";
import type { CreateRestauranteDto } from "@/types/api";

export function RestauranteForm({
  value,
  onChange,
  onSubmit,
  submitLabel,
}: {
  value: CreateRestauranteDto;
  onChange: (value: CreateRestauranteDto) => void;
  onSubmit: () => void | Promise<void>;
  submitLabel: string;
}) {
  return (
    <FormPanel onSubmit={onSubmit} className="mt-5 grid gap-3 rounded-2xl border bg-slate-50 p-4 md:grid-cols-3">
      <FormInput placeholder="Nombre del restaurante" value={value.name} onChange={(event) => onChange({ ...value, name: event.target.value })} required />
      <FormInput placeholder="Menú (opcional)" value={value.menu ?? ""} onChange={(event) => onChange({ ...value, menu: event.target.value })} />
      <FormInput type="number" min={0} step="0.01" placeholder="Tiempo aprox. (min)" value={value.TiempoRealizacionAprox} onChange={(event) => onChange({ ...value, TiempoRealizacionAprox: Number(event.target.value) })} required />
      <FormInput type="number" min={0} step="0.01" placeholder="Calificación" value={value.Calificacion} onChange={(event) => onChange({ ...value, Calificacion: Number(event.target.value) })} required />
      <FormInput type="number" min={1} step={1} placeholder="Capacidad máxima de pedidos" value={value.CapacidadMaxPedidos} onChange={(event) => onChange({ ...value, CapacidadMaxPedidos: Number(event.target.value) })} required />
      <label className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm">
        <input type="checkbox" checked={value.isAbierto ?? true} onChange={(event) => onChange({ ...value, isAbierto: event.target.checked })} />
        Abierto
      </label>
      <button className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 py-2.5 font-semibold text-white md:col-span-3">{submitLabel}</button>
    </FormPanel>
  );
}
