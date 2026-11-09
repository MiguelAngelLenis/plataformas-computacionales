import { apiClient } from "@/lib/api";
import type { CreateRestauranteDto, Restaurante, UpdateRestauranteDto } from "@/types/api";

export const restaurantesService = {
  getAll: () => apiClient.get<Restaurante[]>("/restaurantes"),
  getById: (id: string) => apiClient.get<Restaurante>(`/restaurantes/${id}`),
  create: (data: CreateRestauranteDto) => apiClient.post<Restaurante>("/restaurantes", data),
  update: (id: string, data: UpdateRestauranteDto) => apiClient.patch<Restaurante>(`/restaurantes/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/restaurantes/${id}`),
};
