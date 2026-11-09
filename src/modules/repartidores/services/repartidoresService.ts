import { apiClient } from "@/lib/api";
import type { CreateRepartidorDto, Repartidor, UpdateRepartidorDto } from "@/types/api";

export const repartidoresService = {
  getAll: () => apiClient.get<Repartidor[]>("/repartidores"),
  getById: (id: string) => apiClient.get<Repartidor>(`/repartidores/${id}`),
  create: (data: CreateRepartidorDto) => apiClient.post<Repartidor>("/repartidores", data),
  update: (id: string, data: UpdateRepartidorDto) => apiClient.patch<Repartidor>(`/repartidores/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/repartidores/${id}`),
};
