/**
 * Tipos compartidos con el backend NestJS
 * Espejo de las entities y DTOs del backend para tipar el frontend.
 */

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  phone: string;
  isActive: boolean;
}

export interface CreateUserDto {
  id: string;
  name: string;
  email: string;
  age: number;
  phone: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  age?: number;
  phone?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  stock: number;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  user: User;
  items: OrderItem[];
  total: number;
  status: "PENDING" | "PAID" | "CANCELLED";
  createdAt: string;
}

export interface CreateOrderDto {
  userId: string;
  items: { productId: string; quantity: number }[];
}

export interface Restaurante {
  id: number;
  name: string;
  menu: string | null;
  TiempoRealizacionAprox: number;
  Calificacion: number;
  CapacidadMaxPedidos: number;
  isAbierto: boolean;
  users?: User[];
  repartidores?: Repartidor[];
  pedidos?: Pedido[];
}

export interface CreateRestauranteDto {
  name: string;
  menu?: string | null;
  TiempoRealizacionAprox: number;
  Calificacion: number;
  CapacidadMaxPedidos: number;
  isAbierto?: boolean;
}

export type UpdateRestauranteDto = Partial<CreateRestauranteDto>;

export interface Repartidor {
  id: string;
  name: string;
  email: string;
  age: number;
  phone: string;
  isActive: boolean;
  Calificacion: number;
  TiempoEntregaAprox: number;
  GanancciaAcumulada: number;
  userId: string;
  user?: User;
  restauranteId: number;
  restaurante?: Restaurante;
  pedidos?: Pedido[];
}

export interface CreateRepartidorDto {
  id: string;
  name: string;
  email: string;
  age: number;
  phone: string;
  Calificacion: number;
  TiempoEntregaAprox: number;
  GanancciaAcumulada: number;
  isActive?: boolean;
  userId: string;
  restauranteId: number;
}

export type UpdateRepartidorDto = Partial<Omit<CreateRepartidorDto, "id">>;

export interface Pedido {
  id: number;
  name: string;
  num_pedido: number;
  estado_pedido: string | null;
  isActive: boolean;
  costo: number;
  userId: string;
  user?: User;
  repartidorId: string;
  repartidor?: Repartidor;
  restauranteId: number;
  restaurante?: Restaurante;
}

export interface CreatePedidoDto {
  name: string;
  num_pedido: number;
  estado_pedido?: string | null;
  costo: number;
  isActive?: boolean;
  userId: string;
  repartidorId: string;
  restauranteId: number;
}

export type UpdatePedidoDto = Partial<CreatePedidoDto>;
