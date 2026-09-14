import type {
  Category,
  ContentItem,
  Order,
  Product,
  SiteSettings,
  Voucher,
} from "./types";

const DEFAULT_API_BASE = "/api";
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE).replace(/\/+$/, "");

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export const api = {
  health: () => apiRequest<{ status: string; name: string; timestamp: string }>("/health"),
  getProducts: () => apiRequest<Product[]>("/products"),
  getCategories: () => apiRequest<Category[]>("/categories"),
  getOrders: () => apiRequest<Order[]>("/orders"),
  getVouchers: () => apiRequest<Voucher[]>("/vouchers"),
  getContent: () => apiRequest<ContentItem[]>("/content"),
  getSettings: () => apiRequest<SiteSettings>("/settings"),
  createOrder: (payload: Partial<Order>) => apiRequest<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  }),
  updateOrder: (id: string, payload: Partial<Order>) => apiRequest<Order>(`/orders/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  }),
};

export function getApiBaseUrl() {
  return API_BASE;
}
