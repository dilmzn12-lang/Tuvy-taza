import type { Timestamp } from "firebase/firestore";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  available: boolean;
}

export type OrderItemStatus = "pending" | "preparing" | "ready";
export type OrderStatus = "pending" | "preparing" | "ready" | "completed";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  status: OrderItemStatus;
  notes?: string;
}

export interface Order {
  id: string;
  restaurantId?: string;
  tableInfo: string;
  type?: string;
  total?: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: Timestamp | null;
}

export interface CartLine {
  id: string;
  name: string;
  price: number;
  quantity: number;
}
