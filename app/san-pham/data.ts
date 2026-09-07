export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  note: string;
  reviews: number;
  rating: number;
  weight: string;
  unit?: "kg" | "bao" | "thùng" | "chai";
  badge?: string;
  originalPrice?: number;
  discount?: number;
  origin?: string;
  storage?: string;
  standard?: string;
  tags?: string;
  stock?: number;
  minStock?: number;
  sold?: number;
};

export function getWeightInKg(weight?: string) {
  const value = Number.parseFloat(weight || "1");
  return Number.isFinite(value) && value > 0 ? value : 1;
}

export function getPricePerKg(product: Product) {
  return Math.round(product.price / getWeightInKg(product.weight));
}

export function getPackagePrice(product: Product, weight = product.weight) {
  return Math.round(getPricePerKg(product) * getWeightInKg(weight));
}

export type Category = { id: number; name: string; description: string; active: boolean };
export type CartItem = { product: Product; quantity: number; weight: string };

export const CART_STORAGE_KEY = "gao-ngon-cart";
export const PRODUCTS_STORAGE_KEY = "gao-ngon-admin-products";
export const CATEGORIES_STORAGE_KEY = "gao-ngon-categories";
export const ORDERS_STORAGE_KEY = "gao-ngon-orders";
export const VOUCHERS_STORAGE_KEY = "gao-ngon-vouchers";
export const CONTENT_STORAGE_KEY = "gao-ngon-content";
export const PRODUCTS_UPDATED_EVENT = "gao-ngon-products-updated";

export const products: Product[] = [
  { id: 1, name: "Gạo ST25 Thượng Hạng", category: "Gạo trắng", price: 135000, image: "/images/st25.png.jpg", note: "Dẻo thơm, hạt dài, vị ngọt hậu", reviews: 128, rating: 5, weight: "5kg", badge: "Best Seller" },
  { id: 2, name: "Gạo Nhật Japonica", category: "Gạo thơm", price: 120000, image: "/images/st25.png.jpg", note: "Mềm dẻo, tròn vị cho bữa cơm nhà", reviews: 98, rating: 4.9, weight: "5kg", badge: "Bán chạy" },
  { id: 3, name: "Gạo Nàng Thơm Chợ Đào", category: "Gạo thơm", price: 105000, image: "/images/st25.png.jpg", note: "Hương thơm dịu, cơm mềm tự nhiên", reviews: 87, rating: 4.8, weight: "5kg" },
  { id: 4, name: "Gạo Tám Thơm", category: "Gạo thơm", price: 85000, image: "/images/st25.png.jpg", note: "Hạt trong, thơm nhẹ, dễ ăn mỗi ngày", reviews: 56, rating: 4.8, weight: "5kg", badge: "Mới" },
  { id: 5, name: "Gạo Nếp Thơm Điện Biên", category: "Gạo nếp", price: 95000, image: "/images/st25.png.jpg", note: "Dẻo quánh, trắng trong, thơm lâu", reviews: 43, rating: 4.7, weight: "2kg" },
  { id: 6, name: "Gạo Lứt Đỏ Hữu Cơ", category: "Gạo lứt", price: 110000, image: "/images/st25.png.jpg", note: "Giàu chất xơ, lựa chọn lành mạnh", reviews: 38, rating: 4.9, weight: "1kg", badge: "Hữu cơ" },
  { id: 7, name: "Gạo Thơm Lài Sữa", category: "Gạo thơm", price: 92000, image: "/images/st25.png.jpg", note: "Mùi thơm dịu dàng, cơm tơi mềm", reviews: 41, rating: 4.7, weight: "5kg" },
  { id: 8, name: "Nếp Cẩm Tây Bắc", category: "Gạo nếp", price: 115000, image: "/images/st25.png.jpg", note: "Đậm vị, màu tự nhiên, dẻo ngon", reviews: 35, rating: 4.8, weight: "1kg" },
  { id: 9, name: "Gạo Mầm Dinh Dưỡng", category: "Gạo dinh dưỡng", price: 145000, image: "/images/st25.png.jpg", note: "Bổ sung dưỡng chất cho gia đình", reviews: 29, rating: 4.9, weight: "2kg", badge: "Mới" },
  { id: 10, name: "Combo Gạo Nhà Mình", category: "Combo", price: 295000, image: "/images/st25.png.jpg", note: "Đủ vị ngon, tiết kiệm cho cả nhà", reviews: 64, rating: 5, weight: "10kg", badge: "Tiết kiệm" },
];

export const categories: Category[] = [
  { id: 1, name: "Gạo trắng", description: "Các sản phẩm gạo trắng chất lượng", active: true },
  { id: 2, name: "Gạo thơm", description: "Gạo thơm nấu cơm dẻo mềm", active: true },
  { id: 3, name: "Gạo nếp", description: "Gạo nếp dẻo và thơm", active: true },
  { id: 4, name: "Gạo lứt", description: "Gạo lứt dinh dưỡng, an toàn", active: true },
  { id: 5, name: "Gạo dinh dưỡng", description: "Gạo dinh dưỡng cho sức khỏe", active: true },
  { id: 6, name: "Combo", description: "Combo tiết kiệm cho gia đình", active: true },
];

export function readStorageValue<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorageValue<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getCatalogProducts() {
  return readStorageValue<Product[]>(PRODUCTS_STORAGE_KEY, products);
}

export function saveCatalogProducts(nextProducts: Product[]) {
  writeStorageValue(PRODUCTS_STORAGE_KEY, nextProducts);
  dispatchProductsUpdated();
}

export function getCatalogCategories() {
  const saved = readStorageValue<Category[]>(CATEGORIES_STORAGE_KEY, categories);
  return saved.length ? saved : categories;
}

export function saveCatalogCategories(nextCategories: Category[]) {
  writeStorageValue(CATEGORIES_STORAGE_KEY, nextCategories);
}

export function dispatchCartUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("gao-ngon-cart-updated"));
}

export function dispatchProductsUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(PRODUCTS_UPDATED_EVENT));
}

export function getCartItems(): CartItem[] {
  return readStorageValue<CartItem[]>(CART_STORAGE_KEY, []);
}

export function saveCartItems(nextItems: CartItem[]) {
  writeStorageValue(CART_STORAGE_KEY, nextItems);
  dispatchCartUpdated();
}

export const defaultVouchers = [
  { code: "GAODON10", desc: "Giảm 10% đơn hàng đầu tiên", exp: "31/12/2026", active: true },
  { code: "FREESHIP", desc: "Miễn phí vận chuyển đơn từ 200k", exp: "30/09/2026", active: true },
  { code: "MEMBER15", desc: "Ưu đãi hội viên - giảm 15.000đ", exp: "31/10/2026", active: true },
];

export const defaultContent = [
  { id: 1, type: "banner", title: "TINH HOA HẠT GẠO", description: "Chọn lọc từ những hạt gạo chất lượng nhất, mang đến bữa cơm dẻo thơm.", image: "/images/hero-rice.png" },
  { id: 2, type: "about", title: "Câu chuyện Vigen Food", description: "Gắn kết nông dân, nhà sản xuất và người tiêu dùng Việt.", image: "/images/vigenfood.png" },
  { id: 3, type: "news", title: "Bí quyết nấu cơm niêu chuẩn vị cung đình", description: "Mẹo nhà bếp", image: "/images/banner1.jpg", category: "Mẹo nhà bếp", date: "24 Tháng 8, 2026" },
];
