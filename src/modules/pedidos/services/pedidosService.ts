import { apiClient } from "@/lib/api";
import type { CreatePedidoDto, Pedido, UpdatePedidoDto } from "@/types/api";

export const pedidosService = {
  getAll: () => apiClient.get<Pedido[]>("/pedidos"),
  getById: (id: string) => apiClient.get<Pedido>(`/pedidos/${id}`),
  create: (data: CreatePedidoDto) => apiClient.post<Pedido>("/pedidos", data),
  update: (id: string, data: UpdatePedidoDto) => apiClient.patch<Pedido>(`/pedidos/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/pedidos/${id}`),
};
