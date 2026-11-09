/**
 * usersService — capa de servicio para Users
 * Patrón igual que en NextJS-Api-Shop: cada módulo tiene su services/
 * Usa apiClient de lib/api.ts (fetch tipado)
 */

import { apiClient } from "@/lib/api";
import type { User, CreateUserDto, UpdateUserDto } from "@/types/api";

export const usersService = {
  getAll: () => apiClient.get<User[]>("/users"),
  getById: (id: string) => apiClient.get<User>(`/users/${id}`),
  create: (data: CreateUserDto) => apiClient.post<User>("/users", data),
  update: (id: string, data: UpdateUserDto) => apiClient.put<User>(`/users/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/users/${id}`),
};
