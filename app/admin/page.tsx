"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
type IconProps = React.ComponentPropsWithoutRef<"span">;
const Target = (props: IconProps) => <span {...props}>👁️</span>;
const Pencil = (props: IconProps) => <span {...props}>✏️</span>;
const X = (props: IconProps) => <span {...props}>🗑️</span>;
import BrandLogo from "../components/BrandLogo";
import { getPricePerKg, getWeightInKg, products as catalogProducts, Product } from "../san-pham/data";
import { USER_STORAGE_KEY } from "../components/AuthModal";
import CategoryManager, { Category } from "./CategoryManager";
import FinanceManager, { FinanceTransaction } from "./FinanceManager";
import InventoryManager, { InventoryRecord } from "./InventoryManager";
import PromotionManager, { Promotion } from "./PromotionManager";
import PermissionManager from "./PermissionManager";
import AdminModal from "./components/AdminModal";
import ConfirmModal from "./components/ConfirmModal";
import styles from "./page.module.css";
import "./modal.css";
import {
  AdminNotification,
  getAdminNotifications,
  addAdminNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
  formatNotificationTime,
  NOTIFICATIONS_UPDATED_EVENT,
} from "../lib/notifications";

type AdminTab = "overview" | "products" | "categories" | "orders" | "customers" | "vouchers" | "finance" | "inventory" | "promotions" | "content" | "permissions";
type NoticeTone = "success" | "info" | "warning" | "error";
type Order = { id: string; createdAt: string; status: string; customer: string; phone: string; email?: string; address?: string; province?: string; district?: string; ward?: string; note?: string; total: number; paidAmount?: number; paymentStatus?: "paid" | "unpaid"; subtotal?: number; items: number; orderType?: "retail" | "combo"; products?: { productId: number; quantity: number; purchasePrice?: number; isGift?: boolean }[]; voucherCode?: string; promotionCode?: string; promotionName?: string; giftProductId?: number; discount?: number; shipping?: number; paymentMethod?: string };
type OrderProduct = { product: Product; quantity: number };
type Voucher = { code: string; desc: string; exp: string; active: boolean; discountType?: "amount" | "percent" | "shipping"; discountValue?: number; conditionType?: "none" | "min_orders" | "min_spend" | "first_order" | "holiday" | "review_reward" | "next_order" | "top_customer"; minOrders?: number; minSpend?: number; holidayDate?: string; holidayName?: string; requireReviewPhoto?: boolean; topRank?: number };
type ContentItem = { id: number; type: "banner" | "about" | "news"; title: string; description: string; image: string; category?: string; date?: string };
type HeroSlideContent = { background: string; product: string; eyebrow: string; title: string; script: string; description: string };
type MemberOfferContent = { title: string; label: string; discount: string; condition: string; button: string; href: string };

const productsKey = "gao-ngon-admin-products";
const ordersKey = "gao-ngon-orders";
const vouchersKey = "gao-ngon-vouchers";
const categoriesKey = "gao-ngon-categories";
const contentKey = "gao-ngon-content";
const heroContentKey = "gao-ngon-hero-slides";
const memberOfferKey = "gao-ngon-member-offer";
const financeKey = "gao-ngon-finance";
const inventoryKey = "gao-ngon-inventory";
const promotionsKey = "gao-ngon-promotions";
const money = (value: number) => `${value.toLocaleString("vi-VN")}đ`;
const inputMoney = (value: string | number) => Number(value || 0) * 1000;
const defaultMemberOffer: MemberOfferContent = { title: "ƯU ĐÃI HỘI VIÊN", label: "GIẢM NGAY", discount: "100K - 500K", condition: "Đơn hàng từ 1.000.000đ", button: "XEM NGAY", href: "/user" };

function readStoredOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ordersKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistOrders(next: Order[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ordersKey, JSON.stringify(next));
    window.dispatchEvent(new Event("gao-ngon-orders-updated"));
  } catch {
    // Ignore storage quota / browser privacy errors and keep state in memory.
  }
}

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<AdminTab>("overview");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customer, setCustomer] = useState<{ name: string; phone: string } | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [inventoryRecords, setInventoryRecords] = useState<InventoryRecord[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [query, setQuery] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [notice, setNotice] = useState<{ text: string; tone: NoticeTone } | null>(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || "null");
    setAuthorized(savedUser?.role === "admin");
    setCheckingAccess(false);
    const storedProducts = localStorage.getItem(productsKey);
    const storedVouchers = localStorage.getItem(vouchersKey);
    const storedCategories = localStorage.getItem(categoriesKey);
    const storedFinance = localStorage.getItem(financeKey);
    const storedInventory = localStorage.getItem(inventoryKey);
    const storedPromotions = localStorage.getItem(promotionsKey);
    const initialProducts = storedProducts ? JSON.parse(storedProducts) as Product[] : catalogProducts;
    const seedProduct = initialProducts[0] || catalogProducts[0];
    const seedDate = new Date().toISOString();
    const seedOrder: Order = { id: "#VG-DEMO-001", createdAt: seedDate, status: "Thành công", customer: "Nguyễn Minh Anh", phone: "0900000001", email: "demo@vigenfood.com", address: "12 Đường Lúa Mới", province: "Cần Thơ", district: "Ninh Kiều", ward: "Tân An", total: seedProduct.price, paidAmount: 0, paymentStatus: "unpaid", subtotal: seedProduct.price, shipping: 0, paymentMethod: "cod", items: 1, products: [{ productId: seedProduct.id, quantity: 1, purchasePrice: seedProduct.price }] };
    const initialOrders = readStoredOrders();
    setProducts(initialProducts);
    setOrders(initialOrders.length ? initialOrders : [seedOrder]);
    if (!initialOrders.length) localStorage.setItem(ordersKey, JSON.stringify([seedOrder]));
    setCustomer(JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || "null"));
    const initialVouchers: Voucher[] = storedVouchers ? JSON.parse(storedVouchers) : [{ code: "GAODON10", desc: "Giảm 10% đơn hàng đầu tiên", exp: "31/12/2026", active: true, discountType: "percent", discountValue: 10 }];
    setVouchers(initialVouchers);
    if (!storedVouchers) localStorage.setItem(vouchersKey, JSON.stringify(initialVouchers));
    setCategories(storedCategories ? JSON.parse(storedCategories) : Array.from(new Set(catalogProducts.map((product) => product.category))).map((name, index) => ({ id: index + 1, name, description: `Các sản phẩm ${name.toLowerCase()}`, active: true })));
    const initialTransactions: FinanceTransaction[] = storedFinance ? JSON.parse(storedFinance) : [{ id: "FIN-DEMO-001", type: "income", amount: seedProduct.price, date: seedDate.slice(0, 10), category: "Bán hàng", method: "Tiền mặt", source: "Doanh thu", status: "completed", contact: seedOrder.customer, reference: seedOrder.id, note: "Dữ liệu mẫu" }];
    const initialInventory: InventoryRecord[] = storedInventory ? JSON.parse(storedInventory) : [{ id: "INV-DEMO-001", type: "import", productId: seedProduct.id, quantity: 100, purchasePrice: Math.round(seedProduct.price * .7), salePrice: seedProduct.price, date: seedDate.slice(0, 10), partner: "Nhà cung cấp mẫu", warehouse: "Kho chính", batch: "LOT-DEMO-001", status: "completed", note: "Dữ liệu mẫu", fundingSource: "capital" }];
    const initialPromotions: Promotion[] = storedPromotions ? JSON.parse(storedPromotions) : [{ id: "PROMO-DEMO-001", code: "DEMO10", requireCode: true, name: "Ưu đãi khách mới", productId: seedProduct.id, minQuantity: 5, benefitType: "percent", benefitValue: 10, giftProductId: seedProduct.id, startDate: seedDate.slice(0, 10), endDate: "2026-12-31", status: "active", note: "Dữ liệu mẫu" }];
    setTransactions(initialTransactions);
    setInventoryRecords(initialInventory);
    setPromotions(initialPromotions);
    if (!storedFinance) localStorage.setItem(financeKey, JSON.stringify(initialTransactions));
    if (!storedInventory) localStorage.setItem(inventoryKey, JSON.stringify(initialInventory));
    if (!storedPromotions) localStorage.setItem(promotionsKey, JSON.stringify(initialPromotions));

    setNotifications(getAdminNotifications());

    const syncOrders = () => {
      setOrders(readStoredOrders());
    };
    const syncNotifications = () => {
      setNotifications(getAdminNotifications());
    };
    window.addEventListener("gao-ngon-orders-updated", syncOrders);
    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, syncNotifications);
    window.addEventListener("storage", syncOrders);
    window.addEventListener("storage", syncNotifications);
    return () => {
      window.removeEventListener("gao-ngon-orders-updated", syncOrders);
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, syncNotifications);
      window.removeEventListener("storage", syncOrders);
      window.removeEventListener("storage", syncNotifications);
    };
  }, []);

  function loginAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") || "").trim().toLowerCase();
    const password = String(data.get("password") || "");
    if (email !== "admin@vigenfood.com" || password !== "VigenFood@2026") {
      setLoginError("Email hoặc mật khẩu quản trị chưa đúng.");
      return;
    }
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ name: "Quản trị viên", phone: email, password, role: "admin" }));
    setAuthorized(true);
    setLoginError("");
  }

  if (checkingAccess) return <main className={`admin-page ${styles.adminPage} admin-loading`}>Đang kiểm tra quyền truy cập...</main>;
  if (!authorized) return <main className={`admin-page ${styles.adminPage}`}><section className="admin-login"><a href="/"><BrandLogo /></a><span className="admin-kicker">VIGEN FOOD / ADMIN</span><h1>Đăng nhập quản trị</h1><p>Chỉ tài khoản quản trị mới có quyền truy cập khu vực này.</p><form onSubmit={loginAdmin}><label>Email quản trị<input name="email" type="email" placeholder="admin@vigenfood.com" required /></label><label>Mật khẩu<input name="password" type="password" placeholder="Nhập mật khẩu" required /></label>{loginError && <small className="admin-login-error">{loginError}</small>}<button className="admin-primary" type="submit">Đăng nhập quản trị →</button></form><a className="admin-back" href="/">← Về website</a></section></main>;

  function saveProducts(next: Product[]) { setProducts(next); localStorage.setItem(productsKey, JSON.stringify(next)); window.dispatchEvent(new Event("gao-ngon-products-updated")); }
  function saveVouchers(next: Voucher[]) { setVouchers(next); localStorage.setItem(vouchersKey, JSON.stringify(next)); }
  function saveCategories(next: Category[]) { setCategories(next); localStorage.setItem(categoriesKey, JSON.stringify(next)); window.dispatchEvent(new Event("gao-ngon-products-updated")); }
  function showNotice(text: string, tone: NoticeTone = "success") { setNotice({ text, tone }); window.setTimeout(() => setNotice(null), 2500); }
  function deleteProduct(id: number) {
    const prod = products.find(p => p.id === id);
    saveProducts(products.filter((product) => product.id !== id));
    const nextPromotions = promotions.map(promotion => promotion.productId === id || promotion.giftProductId === id ? { ...promotion, status: "paused" as const } : promotion);
    if (nextPromotions.some((promotion, index) => promotion.status !== promotions[index].status)) savePromotions(nextPromotions);
    if (prod) addAdminNotification(`Đã xóa sản phẩm "${prod.name}"`, "product", undefined, "products");
    showNotice("Đã xóa sản phẩm; ưu đãi liên quan đã tạm dừng");
  }
  function reserveOrderStock(order: Order, currentProducts: Product[], currentRecords: InventoryRecord[]) {
    if (!order.products?.length || currentRecords.some(record => record.reference === `ORDER:${order.id}`)) {
      return { products: currentProducts, records: currentRecords };
    }
    const exportRecords = order.products.map(item => ({ id: `EXP-${order.id.replace(/[^a-zA-Z0-9]/g, "")}-${item.productId}`, type: "export" as const, productId: item.productId, quantity: item.quantity, purchasePrice: item.purchasePrice || 0, salePrice: order.total / Math.max(1, order.items), date: new Date().toISOString().slice(0, 10), partner: order.customer, warehouse: "Kho chính", batch: "", status: "completed" as const, note: `Xuất kho tự động từ đơn ${order.id}`, reference: `ORDER:${order.id}` }));
    const updatedProducts = currentProducts.map(product => {
      const quantity = order.products?.filter(item => item.productId === product.id).reduce((sum, item) => sum + item.quantity, 0) || 0;
      return quantity ? { ...product, stock: Math.max(0, (product.stock || 0) - quantity) } : product;
    });
    return { products: updatedProducts, records: [...currentRecords, ...exportRecords] };
  }
  function updateOrder(id: string, status: string) {
    const previous = orders.find(order => order.id === id);
    const next = orders.map((order) => order.id === id ? { ...order, status } : order);
    const changed = next.find(order => order.id === id);
    if (previous && changed && previous.status !== changed.status && changed.products?.length) {
      const records = JSON.parse(localStorage.getItem(inventoryKey) || "[]") as InventoryRecord[];
      const existingRecords = records.filter(record => record.reference === `ORDER:${id}`);
      if (changed.status === "Đã hủy" && previous.status !== "Đã hủy" && existingRecords.length) {
        const updatedProducts = products.map(product => { const quantity = existingRecords.filter(record => record.productId === product.id).reduce((sum, record) => sum + record.quantity, 0); return quantity ? { ...product, stock: (product.stock || 0) + quantity } : product; });
        const remainingRecords = records.filter(record => record.reference !== `ORDER:${id}`);
        setProducts(updatedProducts); localStorage.setItem(productsKey, JSON.stringify(updatedProducts));
        setInventoryRecords(remainingRecords); localStorage.setItem(inventoryKey, JSON.stringify(remainingRecords));
      }
    }
    setOrders(next);
    persistOrders(next);
    if (previous && previous.status !== status) {
      addAdminNotification(`Cập nhật trạng thái đơn hàng ${id} thành "${status}"`, "order", `Khách hàng: ${previous.customer}`, "orders");
    }
  }
  function saveOrders(next: Order[]) {
    const normalized = Array.isArray(next) ? next.filter((item) => item && item.customer && item.phone) : [];
    const newOrders = normalized.filter(order => !orders.some(existing => existing.id === order.id));
    let nextProducts = products;
    let nextRecords = inventoryRecords;
    newOrders.forEach(order => {
      const reserved = reserveOrderStock(order, nextProducts, nextRecords);
      nextProducts = reserved.products;
      nextRecords = reserved.records;
    });
    if (newOrders.length) {
      setProducts(nextProducts);
      localStorage.setItem(productsKey, JSON.stringify(nextProducts));
      setInventoryRecords(nextRecords);
      localStorage.setItem(inventoryKey, JSON.stringify(nextRecords));
    }
    setOrders(normalized);
    persistOrders(normalized);
  }
  function saveTransactions(next: FinanceTransaction[]) { setTransactions(next); localStorage.setItem(financeKey, JSON.stringify(next)); }
  function saveInventoryRecords(next: InventoryRecord[]) { setInventoryRecords(next); localStorage.setItem(inventoryKey, JSON.stringify(next)); }
  function savePromotions(next: Promotion[]) { setPromotions(next); localStorage.setItem(promotionsKey, JSON.stringify(next)); }
  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()) && (productCategoryFilter === "all" || product.category === productCategoryFilter));
  const revenue = orders.filter((order) => order.status !== "Đã hủy").reduce((total, order) => total + order.total, 0);
  const pendingOrders = orders.filter((order) => order.status !== "Đã hủy").length;
  const lowStockProducts = products.filter((product) => (product.stock ?? 0) <= (product.minStock ?? 20)).length;
  const pendingInventory = inventoryRecords.filter((record) => record.status === "pending").length;
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <main className={`admin-page ${styles.adminPage}`}>
      <aside className="admin-sidebar">
        <a href="/" className="admin-brand"><BrandLogo compact /></a>
        <span className="admin-label">QUẢN TRỊ CỬA HÀNG</span>
        <nav className="admin-nav">
          {(["overview", "products", "categories", "orders", "customers", "vouchers", "finance", "inventory", "promotions", "content", "permissions"] as AdminTab[]).map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{{ overview: "Tổng quan", products: "Sản phẩm", categories: "Danh mục", orders: "Đơn hàng", customers: "Khách hàng", vouchers: "Mã giảm giá", finance: "Dòng tiền", inventory: "Quản lý kho", promotions: "Combo & ưu đãi", content: "Nội dung", permissions: "Phân quyền" }[item]}</button>)}
        </nav>
        <div className="admin-sidebar-actions"><button className="admin-back" onClick={() => { localStorage.removeItem(USER_STORAGE_KEY); setAuthorized(false); }}>Đăng xuất</button><a className="admin-back" href="/">← Về website</a></div>
      </aside>
      <section className="admin-main">
        <header className="admin-topbar">
          <div className="admin-breadcrumb">
            <span className="admin-breadcrumb-brand">Vigen Food Admin</span>
            <span className="admin-breadcrumb-sep">/</span>
            <span className="admin-breadcrumb-current">
              {{
                overview: "Tổng quan",
                products: "Sản phẩm",
                categories: "Danh mục",
                orders: "Đơn hàng",
                customers: "Khách hàng",
                vouchers: "Mã giảm giá",
                finance: "Dòng tiền",
                inventory: "Quản lý kho",
                promotions: "Combo & Ưu đãi",
                content: "Nội dung Website",
                permissions: "Phân quyền hệ thống",
              }[tab]}
            </span>
          </div>

          <div className="admin-utility-actions">
            <button className="admin-menu-toggle" aria-label="Mở menu">☰</button>
            <label className="admin-top-search">
              ⌕<input placeholder="Tìm kiếm nhanh..." />
            </label>
            <div className="admin-notification-wrap">
              <button aria-label="Thông báo" title="Thông báo" onClick={() => setNotificationOpen(value => !value)}>
                <span className="admin-bell" aria-hidden="true" />
                {unreadCount > 0 && <b className="admin-notification-badge">{unreadCount > 99 ? "99+" : unreadCount}</b>}
              </button>
              {notificationOpen && (
                <div className="admin-notification-dropdown">
                  <div className="admin-notification-header">
                    <div className="admin-notification-title">
                      <strong>Thông báo hệ thống</strong>
                      {unreadCount > 0 && <span className="admin-unread-pill">{unreadCount} mới</span>}
                    </div>
                    <div className="admin-notification-actions">
                      {unreadCount > 0 && (
                        <button type="button" className="admin-notif-action-btn" onClick={() => markAllNotificationsAsRead()}>
                          Đã đọc tất cả
                        </button>
                      )}
                      {notifications.length > 0 && (
                        <button type="button" className="admin-notif-action-btn danger" onClick={() => clearAllNotifications()}>
                          Xóa tất cả
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="admin-notification-list">
                    {notifications.length > 0 ? (
                      notifications.map(item => {
                        const iconMap: Record<string, string> = {
                          order: "🛒",
                          product: "📦",
                          category: "🏷️",
                          voucher: "🎟️",
                          customer: "👤",
                          finance: "💰",
                          inventory: "🏭",
                          promotion: "🎁",
                          content: "📰",
                          permissions: "🔐",
                          system: "🔔",
                        };
                        return (
                          <div
                            key={item.id}
                            className={`admin-notification-item ${!item.read ? "unread" : ""}`}
                            onClick={() => {
                              if (!item.read) markNotificationAsRead(item.id);
                              if (item.targetTab) setTab(item.targetTab as AdminTab);
                              setNotificationOpen(false);
                            }}
                          >
                            <span className="admin-notif-icon">{iconMap[item.type] || "🔔"}</span>
                            <div className="admin-notif-content">
                              <strong className="admin-notif-item-title">{item.title}</strong>
                              {item.message && <p className="admin-notif-item-msg">{item.message}</p>}
                              <small className="admin-notif-time">{formatNotificationTime(item.time)}</small>
                            </div>
                            {!item.read && <span className="admin-notif-unread-dot" title="Chưa đọc" />}
                            <button
                              type="button"
                              className="admin-notif-delete-btn"
                              title="Xóa thông báo"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(item.id);
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <div className="admin-notification-empty">Chưa có thông báo nào</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="admin-user">
              <span>AD</span>
              <div>
                <strong>Quản trị viên</strong>
                <small>Admin</small>
              </div>
              <b>⌄</b>
            </div>
          </div>
        </header>
        {tab === "overview" && <AdminDashboard revenue={revenue} orders={orders} products={products} customer={customer} onTab={setTab} />}
        {tab === "products" && <ProductManager products={filteredProducts} allProducts={products} categories={categories} query={query} setQuery={setQuery} categoryFilter={productCategoryFilter} setCategoryFilter={setProductCategoryFilter} editing={editing} setEditing={setEditing} saveProducts={saveProducts} deleteProduct={deleteProduct} showNotice={showNotice} />}
        {tab === "categories" && <CategoryManager categories={categories} products={products} saveCategories={saveCategories} renameProducts={(oldName, newName) => saveProducts(products.map(product => product.category === oldName ? { ...product, category: newName } : product))} showNotice={showNotice} />}
        {tab === "orders" && <OrderManager orders={orders} products={products} promotions={promotions} updateOrder={updateOrder} saveOrders={saveOrders} showNotice={showNotice} />}
        {tab === "customers" && <CustomerManager orders={orders} />}
        {tab === "vouchers" && <VoucherManager vouchers={vouchers} saveVouchers={saveVouchers} />}
        {tab === "finance" && <FinanceManager transactions={transactions} orders={orders} saveTransactions={saveTransactions} saveOrders={saveOrders} updateOrder={updateOrder} products={products} showNotice={showNotice} />}
        {tab === "inventory" && <InventoryManager products={products} records={inventoryRecords} transactions={transactions} saveRecords={saveInventoryRecords} saveProducts={saveProducts} saveTransactions={saveTransactions} showNotice={showNotice} />}
        {tab === "promotions" && <PromotionManager products={products} promotions={promotions} savePromotions={savePromotions} showNotice={showNotice} />}
        {tab === "content" && <ContentManager showNotice={showNotice} />}
        {tab === "permissions" && <PermissionManager showNotice={showNotice} />}
        {notice && <div className={`admin-notice ${notice.tone}`}>{notice.tone === "error" ? "⚠" : notice.tone === "warning" ? "!" : "✓"} {notice.text}</div>}
      </section>
    </main>
  );
}

/* ===== DASHBOARD ===== */
function AdminDashboard({ revenue, orders, products, customer, onTab }: { revenue: number; orders: Order[]; products: Product[]; customer: { name: string; phone: string } | null; onTab: (tab: AdminTab) => void }) {
  const stats = [
    ["DOANH THU", money(revenue), "↑ 12.8% so với tháng trước", "₫"],
    ["ĐƠN HÀNG", orders.length.toLocaleString("vi-VN"), "↑ 8.2% so với tháng trước", "▣"],
    ["SẢN PHẨM", products.length.toString(), "↑ 5.4% đang quản lý", "▤"],
    ["KHÁCH HÀNG", customer ? "01" : "00", "↑ 16.3% tài khoản đăng ký", "♙"],
  ];
  return <>
    <div className="admin-hero-card">
      <div>
        <span className="admin-kicker">TỔNG QUAN KINH DOANH</span>
        <h2>Tổng quan cửa hàng</h2>
        <p>Theo dõi chỉ số hiệu quả kinh doanh, doanh thu, đơn hàng và sản phẩm bán chạy.</p>
      </div>
    </div>
    <div className="admin-stats">{stats.map(([label, value, note, icon]) => <div className="admin-stat" key={label}><span className="admin-stat-icon">{icon}</span><div><span>{label}</span><strong>{value}</strong><small>{note}</small></div></div>)}</div>
    <div className="admin-dashboard-grid">
      <section className="admin-panel admin-chart-panel"><div className="admin-panel-head"><div><span className="admin-kicker">HIỆU QUẢ KINH DOANH</span><h2>Doanh thu theo tháng</h2></div><select aria-label="Chọn năm"><option>Năm 2026</option><option>Năm 2025</option></select></div><div className="admin-line-chart"><div className="chart-grid-lines"><i /><i /><i /><i /></div><svg viewBox="0 0 720 190" role="img" aria-label="Biểu đồ doanh thu"><defs><linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#e5c666" stopOpacity=".55" /><stop offset="1" stopColor="#e5c666" stopOpacity="0" /></linearGradient></defs><path d="M20 155 L115 125 L205 95 L285 112 L365 75 L445 102 L520 58 L595 92 L680 42 L680 175 L20 175 Z" fill="url(#chart-fill)" /><path d="M20 155 L115 125 L205 95 L285 112 L365 75 L445 102 L520 58 L595 92 L680 42" fill="none" stroke="#e5c666" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />{[[20,155],[115,125],[205,95],[285,112],[365,75],[445,102],[520,58],[595,92],[680,42]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="#f6e29a" stroke="#9b782b" strokeWidth="2" />)}</svg><div className="chart-labels"><span>T1</span><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>T8</span><span>T9</span><span>T10</span><span>T11</span><span>T12</span></div></div></section>
      <section className="admin-panel admin-quick-panel"><div><span className="admin-kicker">THAO TÁC NHANH</span><h2>Quản lý cửa hàng</h2></div><div className="quick-actions"><button onClick={() => onTab("products")}>＋ &nbsp;Thêm sản phẩm</button><button onClick={() => onTab("orders")}>▣ &nbsp;Xem đơn hàng</button><button onClick={() => onTab("vouchers")}>⌁ &nbsp;Tạo mã giảm giá</button></div></section>
    </div>
    <div className="admin-dashboard-grid admin-lower-grid"><section className="admin-panel admin-recent"><div className="admin-panel-head"><div><span className="admin-kicker">HOẠT ĐỘNG GẦN ĐÂY</span><h2>Đơn hàng mới nhất</h2></div><button className="admin-text-button" onClick={() => onTab("orders")}>Xem tất cả →</button></div>{orders.length ? <div className="admin-order-table"><div className="admin-order-header"><span>MÃ ĐƠN</span><span>KHÁCH HÀNG</span><span>TỔNG TIỀN</span><span>TRẠNG THÁI</span></div>{orders.slice(-5).reverse().map((order) => <div className="admin-order-row" key={order.id}><b>{order.id}</b><span>{order.customer}</span><span>{money(order.total)}</span><em>{order.status}</em></div>)}</div> : <div className="admin-empty">Chưa có đơn hàng. Đơn hàng mới sẽ xuất hiện ở đây.</div>}</section><section className="admin-panel admin-best-panel"><div className="admin-panel-head"><div><span className="admin-kicker">SẢN PHẨM BÁN CHẠY</span><h2>Top 5 sản phẩm</h2></div></div>{products.slice(0, 5).map((product, index) => <div className="admin-best-product" key={product.id}><img src={product.image} alt="" /><div><strong>{product.name}</strong><small>Đã bán</small></div><span>{28 - index * 4}%<b style={{ width: `${90 - index * 14}%` }} /></span></div>)}</section></div>
  </>;
}

/* ===== PRODUCT MANAGER ===== */
function ProductManager({ products, allProducts, categories, query, setQuery, categoryFilter, setCategoryFilter, editing, setEditing, saveProducts, deleteProduct, showNotice }: { products: Product[]; allProducts: Product[]; categories: { id: number; name: string; active: boolean }[]; query: string; setQuery: (v: string) => void; categoryFilter: string; setCategoryFilter: (v: string) => void; editing: Product | null; setEditing: (p: Product | null) => void; saveProducts: (p: Product[]) => void; deleteProduct: (id: number) => void; showNotice: (text: string, tone?: NoticeTone) => void }) {
  const [imagePreview, setImagePreview] = useState(editing?.image || "");
  const [imageUrl, setImageUrl] = useState(editing?.image || "");
  const [detail, setDetail] = useState<Product | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 8;
  useEffect(() => { setImagePreview(editing?.image || ""); setImageUrl(editing?.image || ""); }, [editing]);

  const productStock = (product: Product) => product.stock ?? Math.max(0, 320 - product.id * 15);
  const visibleProducts = products.filter(product => {
    if (categoryFilter !== "all" && product.category !== categoryFilter) return false;
    if (statusFilter === "active" && productStock(product) < 50) return false;
    if (statusFilter === "inactive" && productStock(product) >= 50) return false;
    return true;
  });
  const pageCount = Math.max(1, Math.ceil(visibleProducts.length / pageSize));
  const pagedProducts = visibleProducts.slice((page - 1) * pageSize, page * pageSize);
  const totalStock = allProducts.reduce((sum, product) => sum + productStock(product), 0);
  const activeProducts = allProducts.filter(product => productStock(product) >= 50).length;
  const inactiveProducts = allProducts.length - activeProducts;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const category = String(data.get("category") || "").trim();
    const stock = Number(data.get("stock") || 0);
    if (!name || !category) {
      showNotice("Vui lòng nhập tên sản phẩm và danh mục trước khi lưu.", "error");
      return;
    }
    if (stock < 0) {
      showNotice("Tồn kho không được âm. Vui lòng kiểm tra lại số lượng.", "error");
      return;
    }
    const weight = String(data.get("weight") || "");
    const product: Product = { id: editing?.id ? editing.id : Date.now(), name, category, price: Number(data.get("price") || 0) * 1000 * getWeightInKg(weight), originalPrice: Number(data.get("originalPrice") || 0) * 1000 * getWeightInKg(weight) || undefined, discount: Number(data.get("discount") || 0) || undefined, image: imagePreview || imageUrl || "/images/st25.png.jpg", note: String(data.get("note") || ""), reviews: editing?.reviews ?? 0, rating: editing?.rating ?? 5, weight, badge: String(data.get("badge") || ""), origin: String(data.get("origin") || ""), storage: String(data.get("storage") || ""), standard: String(data.get("standard") || ""), tags: String(data.get("tags") || ""), stock, sold: Number(data.get("sold") || 0) };
    saveProducts(editing?.id ? allProducts.map((item) => item.id === editing.id ? product : item) : [...allProducts, product]);
    addAdminNotification(
      editing?.id ? `Cập nhật sản phẩm "${product.name}"` : `Thêm sản phẩm mới "${product.name}"`,
      "product",
      `Danh mục: ${product.category} - Giá: ${money(product.price)}`,
      "products"
    );
    showNotice(editing?.id ? "Đã cập nhật sản phẩm thành công." : "Đã thêm sản phẩm mới.", "success");
    setEditing(null);
    event.currentTarget.reset();
  }
  function uploadImage(event: ChangeEvent<HTMLInputElement>) { const file = event.target.files?.[0]; if (!file || !file.type.startsWith("image/")) return; const reader = new FileReader(); reader.onload = () => { setImagePreview(String(reader.result)); setImageUrl(""); }; reader.readAsDataURL(file); }

  return <>
    <div className="admin-product-heading"><div><span className="admin-kicker">QUẢN LÝ SẢN PHẨM</span><h2>Danh sách sản phẩm</h2><p>Quản lý danh mục gạo, giá bán và tồn kho.</p></div><button className="admin-primary" onClick={() => setEditing({ id: 0, name: "", category: "Gạo thơm", price: 0, image: "", note: "", reviews: 0, rating: 5, weight: "5kg", originalPrice: 0, discount: 0, origin: "Việt Nam", storage: "12 tháng", standard: "VietGAP - VSATTP", tags: "", stock: 0, sold: 0 })}><span aria-hidden="true">+</span> Thêm sản phẩm</button></div>
    <div className="product-crm-stats"><div><span>TỔNG SẢN PHẨM</span><strong>{allProducts.length}</strong><small>Sản phẩm trong hệ thống</small></div><div><span>LOẠI SẢN PHẨM</span><strong>{new Set(allProducts.map(product => product.category)).size}</strong><small>Danh mục đang quản lý</small></div><div><span>TỔNG TỒN KHO</span><strong>{totalStock.toLocaleString("vi-VN")}</strong><small>Đơn vị hàng hóa</small></div><div><span>ĐANG BÁN</span><strong>{activeProducts}</strong><small>Sản phẩm sẵn sàng bán</small></div><div><span>NGỪNG BÁN</span><strong>{inactiveProducts}</strong><small>Cần kiểm tra tồn kho</small></div></div>
    <section className="admin-panel admin-products-panel"><div className="admin-product-filters"><div className="admin-search">⌕<input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Tìm sản phẩm theo tên..." /></div><select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} aria-label="Lọc danh mục"><option value="all">Tất cả danh mục</option>{categories.filter(category => category.active).map(category => <option key={category.id} value={category.name}>{category.name}</option>)}</select><select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} aria-label="Lọc trạng thái"><option value="all">Tất cả trạng thái</option><option value="active">Đang bán</option><option value="inactive">Ngừng bán</option></select></div><div className="admin-product-table"><div className="admin-product-table-head"><span>ẢNH</span><span>SẢN PHẨM</span><span>QUY CÁCH</span><span>DANH MỤC</span><span>GIÁ BÁN</span><span>TỒN KHO</span><span>TRẠNG THÁI</span><span>THAO TÁC</span></div>{pagedProducts.map((product) => <div className="admin-product-row" key={product.id}><img src={product.image} alt="" /><div className="admin-product-name"><span><strong>{product.name}</strong><small>{product.note}</small></span></div><span>{product.weight}</span><span>{product.category}</span><b>{money(product.price)}</b><span>{productStock(product)}</span><em className={productStock(product) < 50 ? "low-stock" : "in-stock"}>{productStock(product) < 50 ? "Ngừng bán" : "Đang bán"}</em><div className="admin-row-actions"><button title="Xem chi tiết" aria-label="Xem chi tiết" onClick={() => setDetail(product)}><Target aria-hidden="true" /></button><button title="Sửa sản phẩm" aria-label="Sửa sản phẩm" onClick={() => setEditing(product)}><Pencil aria-hidden="true" /></button><button className="danger" title="Xóa sản phẩm" aria-label="Xóa sản phẩm" onClick={() => setConfirmDelete(product)}><X aria-hidden="true" /></button></div></div>)}</div><div className="admin-product-pagination"><span>Hiển thị {pagedProducts.length} / {visibleProducts.length} sản phẩm</span><div><button disabled={page <= 1} onClick={() => setPage(page - 1)}>‹</button><b>{page} / {pageCount}</b><button disabled={page >= pageCount} onClick={() => setPage(page + 1)}>›</button></div><span>{pageSize} / trang</span></div></section>

    <AdminModal open={!!detail} onClose={() => setDetail(null)} title={detail?.name || "Chi tiết sản phẩm"} subtitle="Thông tin chi tiết sản phẩm" size="md" footer={<><button className="vg-btn" type="button" onClick={() => setDetail(null)}>Đóng</button></>}>
      {detail && (
        <div className="vg-form-grid">
          <div className="vg-field vg-full"><span className="vg-field-label">Ảnh sản phẩm</span><div className="vg-upload-preview" style={{ minHeight: 180 }}><img src={detail.image || "/images/st25.png.jpg"} alt={detail.name} /></div></div>
          <div className="vg-field"><span className="vg-field-label">Tên sản phẩm</span><input className="vg-input" value={detail.name} readOnly /></div>
          <div className="vg-field"><span className="vg-field-label">Danh mục</span><input className="vg-input" value={detail.category} readOnly /></div>
          <div className="vg-field"><span className="vg-field-label">Khối lượng</span><input className="vg-input" value={detail.weight} readOnly /></div>
          <div className="vg-field"><span className="vg-field-label">Giá bán</span><input className="vg-input" value={money(detail.price)} readOnly /></div>
          <div className="vg-field"><span className="vg-field-label">Giá / kg</span><input className="vg-input" value={money(getPricePerKg(detail))} readOnly /></div>
          <div className="vg-field"><span className="vg-field-label">Tồn kho</span><input className="vg-input" value={detail.stock ?? 0} readOnly /></div>
          <div className="vg-field"><span className="vg-field-label">Đã bán</span><input className="vg-input" value={detail.sold ?? 0} readOnly /></div>
          <div className="vg-field"><span className="vg-field-label">Đánh giá</span><input className="vg-input" value={`${detail.rating ?? 5}/5 (${detail.reviews ?? 0} đánh giá)`} readOnly /></div>
          <div className="vg-field"><span className="vg-field-label">Xuất xứ</span><input className="vg-input" value={detail.origin || "Việt Nam"} readOnly /></div>
          <div className="vg-field"><span className="vg-field-label">Bảo quản</span><input className="vg-input" value={detail.storage || "12 tháng"} readOnly /></div>
          <div className="vg-field"><span className="vg-field-label">Tiêu chuẩn</span><input className="vg-input" value={detail.standard || "VietGAP - VSATTP"} readOnly /></div>
          <div className="vg-field vg-full"><span className="vg-field-label">Mô tả</span><textarea className="vg-textarea" value={detail.note} readOnly /></div>
          <div className="vg-field vg-full"><span className="vg-field-label">Thẻ / cam kết</span><input className="vg-input" value={detail.tags || detail.badge || ""} readOnly /></div>
        </div>
      )}
    </AdminModal>

    {/* Product Edit Modal */}
    <AdminModal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"} subtitle="Quản lý thông tin sản phẩm" size="md" footer={<><button className="vg-btn" type="button" onClick={() => setEditing(null)}>Hủy</button><button className="vg-btn vg-btn-primary" type="submit" form="product-form">Lưu sản phẩm</button></>}>
      <form id="product-form" onSubmit={submit}>
        <div className="vg-form-grid">
          <div className="vg-field"><span className="vg-field-label">Tên sản phẩm <span className="vg-required">*</span></span><input className="vg-input" name="name" defaultValue={editing?.name} required /></div>
          <div className="vg-field"><span className="vg-field-label">Danh mục <span className="vg-required">*</span></span><select className="vg-select" name="category" defaultValue={editing?.category} required>{categories.filter(c => c.active || c.name === editing?.category).map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select></div>
          <div className="vg-field"><span className="vg-field-label">Giá bán / 1kg <span className="vg-required">*</span></span><div className="vg-money-input"><input name="price" type="number" min="0" step="1" defaultValue={editing?.price ? getPricePerKg(editing) / 1000 : ""} placeholder="5000" required /><span>.000 VND/kg</span></div></div>
          <div className="vg-field"><span className="vg-field-label">Giá niêm yết / 1kg</span><div className="vg-money-input"><input name="originalPrice" type="number" min="0" step="1" defaultValue={editing?.originalPrice ? editing.originalPrice / 1000 / getWeightInKg(editing.weight) : ""} placeholder="5000" /><span>.000 VND/kg</span></div></div>
          <div className="vg-field"><span className="vg-field-label">Giảm giá (%)</span><input className="vg-input" name="discount" type="number" min="0" max="100" defaultValue={editing?.discount} /></div>
          <div className="vg-field"><span className="vg-field-label">Khối lượng <span className="vg-required">*</span></span><select className="vg-select" name="weight" defaultValue={editing?.weight} required><option value="2kg">2kg</option><option value="5kg">5kg</option><option value="10kg">10kg</option><option value="20kg">20kg</option><option value="25kg">25kg</option></select></div>
          <div className="vg-field"><span className="vg-field-label">Xuất xứ</span><input className="vg-input" name="origin" defaultValue={editing?.origin} /></div>
          <div className="vg-field"><span className="vg-field-label">Bảo quản</span><input className="vg-input" name="storage" defaultValue={editing?.storage} /></div>
          <div className="vg-field"><span className="vg-field-label">Tiêu chuẩn</span><input className="vg-input" name="standard" defaultValue={editing?.standard} /></div>
          <div className="vg-field"><span className="vg-field-label">Tồn kho</span><input className="vg-input" name="stock" type="number" min="0" defaultValue={editing?.stock} /></div>
          <div className="vg-field"><span className="vg-field-label">Đã bán</span><input className="vg-input" name="sold" type="number" min="0" defaultValue={editing?.sold} /></div>
          <div className="vg-field"><span className="vg-field-label">Badge</span><input className="vg-input" name="badge" defaultValue={editing?.badge} /></div>
          <div className="vg-field vg-full"><span className="vg-field-label">Đặc điểm / cam kết</span><input className="vg-input" name="tags" defaultValue={editing?.tags} placeholder="Chính hãng, Hữu cơ, Nguồn gốc rõ ràng" /></div>
          <div className="vg-field vg-full"><span className="vg-field-label">Ảnh sản phẩm</span><div className="vg-upload-zone"><div className="vg-upload-bar"><label className="vg-upload-btn">⇪ Upload ảnh<input type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadImage} /></label><div className="vg-upload-url"><input value={imageUrl} onChange={(e) => { const next = e.target.value.trim(); setImageUrl(next); if (next) setImagePreview(next); }} placeholder="Hoặc nhập URL ảnh..." /></div></div><div className="vg-upload-preview">{imagePreview ? <img src={imagePreview} alt="Xem trước" /> : <div className="vg-upload-empty"><span className="vg-upload-empty-icon">⊕</span><strong>Kéo thả hoặc click để chọn ảnh</strong><small>JPG, PNG, WEBP - Tối đa 5MB</small></div>}</div></div></div>
          <div className="vg-field vg-full"><span className="vg-field-label">Mô tả <span className="vg-required">*</span></span><input className="vg-input" name="note" defaultValue={editing?.note} required /></div>
        </div>
      </form>
    </AdminModal>

    <ConfirmModal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => { if (confirmDelete) deleteProduct(confirmDelete.id); setConfirmDelete(null); }} title={`Xóa "${confirmDelete?.name}"?`} message="Sản phẩm sẽ bị xóa vĩnh viễn và không thể hoàn tác." />
  </>;
}

/* ===== ORDER MANAGER ===== */
function OrderManager({ orders, products, promotions, updateOrder, saveOrders, showNotice }: { orders: Order[]; products: Product[]; promotions: Promotion[]; updateOrder: (id: string, status: string) => void; saveOrders: (orders: Order[]) => void; showNotice: (text: string, tone?: NoticeTone) => void }) {
  const [editing, setEditing] = useState<Order | null>(null);
  const [detail, setDetail] = useState<Order | null>(null);
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
  const [productPickerOpen, setProductPickerOpen] = useState(false);
  const [promotionPickerOpen, setPromotionPickerOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [voucher, setVoucher] = useState("");
  const [discount, setDiscount] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState<Order | null>(null);
  const [orderFormError, setOrderFormError] = useState("");
  const [filterPeriod, setFilterPeriod] = useState<"all" | "today" | "week" | "month" | "year">("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const getEffectiveStock = (product: Product) => Number(product.stock ?? Math.max(20, 320 - product.id * 15));
  const subtotal = orderProducts.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalWeight = orderProducts.reduce((sum, item) => sum + (Number.parseFloat(item.product.weight || "1") || 1) * item.quantity, 0);
  const shippingFee = totalWeight >= 15 || subtotal === 0 ? 0 : 28000;
  const total = subtotal - discount + shippingFee;

  // --- Thống kê ---
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const monthStr = now.toISOString().slice(0, 7);
  const yearStr = now.toISOString().slice(0, 4);
  const weekStart = new Date(now);
  const dayOfWeek = weekStart.getDay() || 7;
  weekStart.setDate(weekStart.getDate() - dayOfWeek + 1);
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const ordersToday = orders.filter(o => o.createdAt.slice(0, 10) === todayStr);
  const ordersWeek = orders.filter(o => { const date = new Date(o.createdAt); return date >= weekStart && date < weekEnd; });
  const ordersMonth = orders.filter(o => o.createdAt.slice(0, 7) === monthStr);
  const ordersYear = orders.filter(o => o.createdAt.slice(0, 4) === yearStr);
  const revenueToday = ordersToday.filter(o => o.status !== "Đã hủy").reduce((s, o) => s + o.total, 0);
  const revenueWeek = ordersWeek.filter(o => o.status !== "Đã hủy").reduce((s, o) => s + o.total, 0);
  const revenueMonth = ordersMonth.filter(o => o.status !== "Đã hủy").reduce((s, o) => s + o.total, 0);
  const revenueYear = ordersYear.filter(o => o.status !== "Đã hủy").reduce((s, o) => s + o.total, 0);
  const revenueTotal = orders.filter(o => o.status !== "Đã hủy").reduce((s, o) => s + o.total, 0);
  const selectedPeriodLabel = filterPeriod === "today" ? "HÔM NAY" : filterPeriod === "week" ? "TUẦN NÀY" : filterPeriod === "month" ? "THÁNG NÀY" : filterPeriod === "year" ? "NĂM NÀY" : "TẤT CẢ THỜI GIAN";
  const selectedPeriodOrders = filterPeriod === "today" ? ordersToday : filterPeriod === "week" ? ordersWeek : filterPeriod === "month" ? ordersMonth : filterPeriod === "year" ? ordersYear : orders;
  const selectedPeriodRevenue = filterPeriod === "today" ? revenueToday : filterPeriod === "week" ? revenueWeek : filterPeriod === "month" ? revenueMonth : filterPeriod === "year" ? revenueYear : revenueTotal;
  const pendingCount = orders.filter(o => o.status !== "Đã hủy").length;
  const productSummary = (order: Order) => {
    const names = order.products?.map(item => products.find(product => product.id === item.productId)?.name || `Sản phẩm #${item.productId}`) || [];
    return names.length ? names.join(", ") : "Chưa có sản phẩm";
  };

  // --- Lọc đơn hàng ---
  const filteredOrders = orders.filter(o => {
    if (filterPeriod === "today" && o.createdAt.slice(0, 10) !== todayStr) return false;
    if (filterPeriod === "week" && !ordersWeek.some(order => order.id === o.id)) return false;
    if (filterPeriod === "month" && o.createdAt.slice(0, 7) !== monthStr) return false;
    if (filterPeriod === "year" && o.createdAt.slice(0, 4) !== yearStr) return false;
    if (filterStatus !== "all" && o.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.phone.includes(q);
    }
    return true;
  });

  function openOrder(order: Order) {
    setOrderFormError("");
    setEditing(order); setVoucher(""); setDiscount(order.discount || 0);
    setSelectedPromotion(promotions.find(promotion => promotion.code === order.promotionCode) || null);
    const uniqueProducts = products.filter((product, index) => products.findIndex(item => item.id === product.id) === index);
    setOrderProducts(order.id
      ? [{ product: uniqueProducts.find(product => product.id === order.products?.[0]?.productId) || uniqueProducts[0], quantity: Math.max(1, order.items) }]
      : []);
  }
  function choosePromotion(promotion: Promotion) {
    const product = products.find(item => item.id === promotion.productId);
    if (!product) {
      showNotice(`Không thể chọn "${promotion.name}" vì sản phẩm áp dụng không còn tồn tại. Hãy cập nhật lại sản phẩm trong Combo & khuyến mãi.`, "error");
      return;
    }
    const packageCount = Math.max(1, Math.ceil(promotion.minQuantity / Number.parseFloat(product.weight || "1")));
    if (getEffectiveStock(product) < packageCount) {
      showNotice(`Combo "${promotion.name}" đã hết hàng hoặc không đủ ${packageCount} gói để áp dụng.`, "error");
      return;
    }
    setOrderProducts([{ product, quantity: packageCount }]);
    const comboSubtotal = product.price * packageCount;
    setDiscount(promotion.benefitType === "percent" ? Math.round(comboSubtotal * promotion.benefitValue / 100) : promotion.benefitType === "amount" ? Math.min(comboSubtotal, promotion.benefitValue) : 0);
    setSelectedPromotion(promotion);
    setPromotionPickerOpen(false);
  }
  function addProduct(product: Product) { if (orderProducts.some(r => r.product.id === product.id)) return; setOrderProducts(rows => [...rows, { product, quantity: 1 }]); setProductPickerOpen(false); }
  function changeQuantity(id: number, amount: number) { setOrderProducts(rows => rows.map(r => r.product.id === id ? { ...r, quantity: Math.max(1, r.quantity + amount) } : r)); }
  function removeProduct(id: number) { setOrderProducts(rows => rows.filter(r => r.product.id !== id)); }
  function applyVoucher() { setDiscount(voucher.trim().toUpperCase() === "GAODON10" ? Math.round(subtotal * 0.1) : voucher.trim().toUpperCase() === "MEMBER15" ? 15000 : 0); }

  async function exportInvoice(order: Order) {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);
    const invoice = document.createElement("section");
    invoice.style.cssText = "position:fixed;left:-10000px;top:0;width:760px;padding:18px;background:#fff;color:#17231d;font-family:Arial,sans-serif;line-height:1.45;border:2px solid #d3a63d;border-radius:16px;box-sizing:border-box";
    const orderItems = order.products?.length ? order.products : [];
    const itemRows = orderItems.map(item => {
      const product = products.find(entry => entry.id === item.productId);
      return { name: product?.name || `Sản phẩm #${item.productId}`, weight: product?.weight || "", quantity: item.quantity, price: item.purchasePrice || product?.price || 0 };
    });
    const header = document.createElement("div");
    header.style.cssText = "position:relative;display:flex;justify-content:center;align-items:center;min-height:118px;padding:4px 10px 18px;border-bottom:1px solid #eadfca";
    const brand = document.createElement("div");
    brand.style.cssText = "position:absolute;left:10px;top:22px;display:flex;align-items:center;gap:10px";
    const logo = document.createElement("img");
    logo.src = "/images/logo.png";
    logo.alt = "Vigenfood";
    logo.style.cssText = "width:54px;height:54px;object-fit:contain";
    brand.appendChild(logo);
    const wordmark = document.createElement("strong");
    wordmark.textContent = "VIGENFOOD";
    wordmark.style.cssText = "margin-top:4px;color:#c8942e;font-size:25px;letter-spacing:-1px";
    brand.appendChild(wordmark);
    const invoiceHeading = document.createElement("div");
    invoiceHeading.style.cssText = "width:100%;text-align:center";
    const title = document.createElement("h1");
    title.textContent = "HÓA ĐƠN BÁN HÀNG";
    title.style.cssText = "margin:0 0 12px;color:#0c361e;font-size:29px;line-height:1.1";
    invoiceHeading.appendChild(title);
    const orderCode = document.createElement("strong");
    orderCode.textContent = `Mã đơn: ${order.id.replace(/^#/, "")}`;
    orderCode.style.cssText = "display:inline-block;padding:9px 24px;border-radius:8px;color:#fff;background:#0c361e;font-size:15px";
    invoiceHeading.appendChild(orderCode);
    const date = document.createElement("p");
    date.textContent = `Ngày lập: ${new Date(order.createdAt).toLocaleString("vi-VN")}`;
    date.style.cssText = "margin:10px 0 0;font-size:13px";
    invoiceHeading.appendChild(date);
    header.append(brand, invoiceHeading);
    invoice.appendChild(header);

    const contact = document.createElement("p");
    contact.textContent = "⌖  Cần Thơ, Việt Nam     |     ♧  Hotline: 1900 1234";
    contact.style.cssText = "margin:12px 10px 18px;color:#26382d;font-size:13px";
    invoice.appendChild(contact);

    const infoGrid = document.createElement("div");
    infoGrid.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:0 10px 18px";
    const customerPanel = document.createElement("div");
    const statusPanel = document.createElement("div");
    [customerPanel, statusPanel].forEach(panel => { panel.style.cssText = "border:1px solid #e4c989;border-radius:12px;padding:14px 14px 12px;min-height:126px;box-sizing:border-box"; });
    const customerTitle = document.createElement("strong");
    customerTitle.textContent = "♙  THÔNG TIN KHÁCH HÀNG";
    customerTitle.style.cssText = "display:inline-block;margin:-27px 0 10px -4px;padding:8px 14px;border-radius:7px;color:#fff;background:#0c361e;font-size:14px";
    customerPanel.appendChild(customerTitle);
    const address = [order.address, order.ward, order.district, order.province].filter(Boolean).join(", ");
    const paymentNames: Record<string, string> = { cod: "Thanh toán khi nhận hàng", bank: "Chuyển khoản ngân hàng", wallet: "Ví điện tử", vnpay: "Ví điện tử / VNPay" };
    const customerDetails = [`Khách hàng: ${order.customer}`, `Số điện thoại: ${order.phone}`, `Email: ${order.email || "Chưa cập nhật"}`, `Địa chỉ giao hàng: ${address || "Chưa cập nhật"}`, `Thanh toán: ${paymentNames[order.paymentMethod || "cod"] || order.paymentMethod || "Chưa xác định"}`];
    customerDetails.forEach(detail => { const line = document.createElement("div"); line.textContent = detail; line.style.cssText = "padding:5px 0;border-bottom:1px solid #edf0e9;font-size:12px"; customerPanel.appendChild(line); });
    const statusTitle = document.createElement("strong");
    statusTitle.textContent = "◷  TRẠNG THÁI ĐƠN HÀNG";
    statusTitle.style.cssText = "display:inline-block;margin:-27px 0 10px -4px;padding:8px 14px;border-radius:7px;color:#fff;background:#0c361e;font-size:14px";
    statusPanel.appendChild(statusTitle);
    const statusBox = document.createElement("div");
    statusBox.style.cssText = "display:flex;align-items:center;gap:12px;margin-top:8px;padding:14px;border-radius:10px;background:#f0f5eb";
    statusBox.innerHTML = `<span style="display:grid;place-items:center;width:38px;height:38px;border:1px dashed #8eb383;border-radius:50%;color:#fff;background:#0c7b2c;font-size:20px">●</span>`;
    const statusCopy = document.createElement("div");
    const status = document.createElement("b");
    status.textContent = order.status;
    status.style.cssText = "display:block;color:#166321;font-size:14px";
    statusCopy.appendChild(status);
    const statusNote = document.createElement("small");
    statusNote.textContent = order.status === "Đã hủy" ? "Đơn hàng đã bị hủy" : "Đơn hàng thành công";
    statusNote.style.cssText = "font-size:11px";
    statusCopy.appendChild(statusNote);
    statusBox.appendChild(statusCopy);
    statusPanel.appendChild(statusBox);
    infoGrid.append(customerPanel, statusPanel);
    invoice.appendChild(infoGrid);

    const table = document.createElement("div");
    table.style.cssText = "margin:0 10px;border:1px solid #e4c989;border-radius:12px;overflow:hidden";
    const tableHead = document.createElement("div");
    tableHead.textContent = "STT                         SẢN PHẨM                         ĐƠN GIÁ             SỐ LƯỢNG             THÀNH TIỀN";
    tableHead.style.cssText = "padding:12px 14px;color:#fff;background:#0c361e;font-weight:bold;font-size:12px;white-space:pre";
    table.appendChild(tableHead);
    itemRows.forEach((item, index) => {
      const row = document.createElement("div");
      row.style.cssText = "display:grid;grid-template-columns:34px 1fr 90px 60px 95px;align-items:center;gap:8px;padding:14px;font-size:12px;border-bottom:1px solid #eee";
      const number = document.createElement("span"); number.textContent = String(index + 1); row.appendChild(number);
      const productCell = document.createElement("div"); productCell.style.cssText = "display:flex;align-items:center;gap:8px";
      const product = products.find(entry => entry.name === item.name);
      if (product?.image) { const image = document.createElement("img"); image.src = product.image; image.alt = ""; image.style.cssText = "width:38px;height:48px;object-fit:contain"; productCell.appendChild(image); }
      const name = document.createElement("span"); name.textContent = `${item.name} (${item.weight})`; productCell.appendChild(name); row.appendChild(productCell);
      const price = document.createElement("span"); price.textContent = money(item.price); row.appendChild(price);
      const quantity = document.createElement("span"); quantity.textContent = String(item.quantity); row.appendChild(quantity);
      const lineTotal = document.createElement("span"); lineTotal.textContent = money(item.price * item.quantity); row.appendChild(lineTotal);
      table.appendChild(row);
    });
    invoice.appendChild(table);

    const summary = document.createElement("div");
    summary.style.cssText = "margin:18px 10px 0;text-align:right;font-size:13px;line-height:2";
    summary.textContent = `Tạm tính: ${money(order.subtotal ?? order.total + (order.discount || 0) - (order.shipping || 0))}\nGiảm giá: -${money(order.discount || 0)}\nPhí vận chuyển: ${order.shipping ? money(order.shipping) : "Miễn phí"}`;
    summary.style.whiteSpace = "pre-line";
    invoice.appendChild(summary);
    const total = document.createElement("div");
    total.textContent = `TỔNG THANH TOÁN                         ${money(order.total)}`;
    total.style.cssText = "margin:10px 10px 14px;padding:14px 18px;border:1px solid #e4c989;border-radius:9px;text-align:right;color:#0c361e;background:#f1f5ed;font-weight:bold;font-size:19px;white-space:pre";
    invoice.appendChild(total);
    const thanks = document.createElement("div");
    thanks.textContent = "Cảm ơn quý khách đã mua hàng.\nVIGENFOOD luôn nỗ lực mang đến những sản phẩm chất lượng và dịch vụ tốt nhất cho bạn!";
    thanks.style.cssText = "margin:0 10px;padding:16px 20px;border-radius:12px;color:#fff;background:#0c361e;font-size:13px;white-space:pre-line";
    invoice.appendChild(thanks);
    const footer = document.createElement("div");
    footer.textContent = "VIGENFOOD  ·  SẢN PHẨM CHẤT LƯỢNG  ·  GIAO HÀNG NHANH CHÓNG  ·  HỖ TRỢ TẬN TÂM";
    footer.style.cssText = "margin:14px -18px -18px;padding:14px;text-align:center;color:#f5d978;background:#0c361e;font-weight:bold;font-size:12px;letter-spacing:.4px";
    invoice.appendChild(footer);
    document.body.appendChild(invoice);

    try {
      await Promise.all(Array.from(invoice.querySelectorAll("img")).map(image => image.complete ? Promise.resolve() : new Promise<void>(resolve => { image.onload = () => resolve(); image.onerror = () => resolve(); })));
      const canvas = await html2canvas(invoice, { scale: 2, backgroundColor: "#fff" });
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      const width = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const height = (canvas.height * width) / canvas.width;
      const image = canvas.toDataURL("image/jpeg", 0.95);
      let remainingHeight = height;
      let imagePosition = 0;
      pdf.addImage(image, "JPEG", 0, imagePosition, width, height);
      remainingHeight -= pageHeight;
      while (remainingHeight > 0) {
        imagePosition = remainingHeight - height;
        pdf.addPage();
        pdf.addImage(image, "JPEG", 0, imagePosition, width, height);
        remainingHeight -= pageHeight;
      }
      pdf.save(`hoa-don-${order.id.replace(/[^a-zA-Z0-9]/g, "")}.pdf`);
      showNotice(`Đã xuất hóa đơn ${order.id}.`, "success");
    } finally {
      invoice.remove();
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!orderProducts.length) {
      setOrderFormError("Đơn hàng chưa có sản phẩm nào. Vui lòng chọn ít nhất một sản phẩm.");
      showNotice("Đơn hàng chưa có sản phẩm nào. Vui lòng chọn ít nhất một sản phẩm.", "error");
      return;
    }
    const data = new FormData(event.currentTarget);
    const customer = String(data.get("customer") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    if (!customer || !phone) {
      setOrderFormError("Vui lòng nhập tên khách hàng và số điện thoại trước khi lưu đơn.");
      showNotice("Vui lòng nhập tên khách hàng và số điện thoại trước khi lưu đơn.", "error");
      return;
    }
    const notEnoughStock = orderProducts.find(item => getEffectiveStock(item.product) < item.quantity);
    if (notEnoughStock) {
      const msg = `Hàng không đủ: "${notEnoughStock.product.name}" chỉ còn ${getEffectiveStock(notEnoughStock.product)} sản phẩm, bạn đang đặt ${notEnoughStock.quantity}.`;
      setOrderFormError(msg);
      showNotice(msg, "error");
      return;
    }
    const isNewOrder = !editing || !editing.id || editing.id === "";
    const paymentMethod = String(data.get("payment") || "cod");
    const selectedPaymentStatus = String(data.get("paymentStatus") || editing?.paymentStatus || (paymentMethod === "cod" ? "unpaid" : "paid")) as Order["paymentStatus"];
    const paidAmount = selectedPaymentStatus === "paid" ? total : 0;
    const next: Order = { id: String(data.get("id") || `#ORD-${Date.now().toString().slice(-6)}`), createdAt: editing?.createdAt || new Date().toISOString(), status: String(data.get("status")), customer, phone, email: String(data.get("email") || ""), address: String(data.get("address") || ""), province: String(data.get("province") || ""), district: String(data.get("district") || ""), note: String(data.get("note") || ""), total, paidAmount, paymentStatus: paidAmount >= total ? "paid" : "unpaid", subtotal, shipping: shippingFee, paymentMethod, items: orderProducts.reduce((sum, item) => sum + item.quantity, 0), orderType: selectedPromotion ? "combo" : "retail", promotionCode: selectedPromotion?.code, promotionName: selectedPromotion?.name, discount, products: orderProducts.map(item => ({ productId: item.product.id, quantity: item.quantity, purchasePrice: item.product.price })) };
    saveOrders(isNewOrder ? [next, ...orders] : orders.map(order => order.id === editing.id ? next : order));
    setOrderFormError("");
    showNotice(isNewOrder ? "Đã lưu đơn hàng mới." : "Đã cập nhật đơn hàng.", "success");
    setEditing(null);
  }

  return <>
    <div className="admin-hero-card order-hero">
      <div>
        <span className="admin-kicker">QUẢN LÝ ĐƠN HÀNG</span>
        <h2>Danh sách đơn hàng</h2>
        <p>Theo dõi trạng thái đơn hàng, doanh thu tích lũy và quản lý thông tin giao nhận.</p>
      </div>
      <button className="admin-primary" onClick={() => openOrder({ id: "", createdAt: "", status: "Thành công", customer: "", phone: "", total: 0, items: 1 })}>+ Thêm đơn hàng</button>
    </div>

    {/* Thống kê đơn hàng */}
    <div className="admin-stats order-crm-stats">
      <div className="admin-stat order-period-stat"><span className="admin-stat-icon">▣</span><div><span>{selectedPeriodLabel}</span><strong>{selectedPeriodOrders.length} đơn</strong><small>{money(selectedPeriodRevenue)} doanh thu</small></div></div>
      <div className="admin-stat"><span className="admin-stat-icon">Đ</span><div><span>TỔNG ĐƠN</span><strong>{orders.length} đơn</strong><small>{money(revenueTotal)} tổng doanh thu</small></div></div>
      <div className="admin-stat"><span className="admin-stat-icon">C</span><div><span>THÀNH CÔNG</span><strong>{pendingCount} đơn</strong><small>Đã trừ kho</small></div></div>
    </div>
    <div className="order-period-summary"><span>TỔNG TIỀN {selectedPeriodLabel}</span><strong>{money(selectedPeriodRevenue)}</strong><small>{selectedPeriodOrders.length} đơn trong kỳ đã chọn</small></div>

    <section className="admin-panel admin-orders-panel">
      {/* Thanh lọc + tìm kiếm */}
      <div className="admin-table-head">
        <div><strong>{filteredOrders.length} đơn hàng</strong><span>{filterPeriod === "today" ? "Hôm nay" : filterPeriod === "week" ? "Tuần này" : filterPeriod === "month" ? "Tháng này" : filterPeriod === "year" ? "Năm này" : "Tất cả"}{filterStatus !== "all" ? ` · ${filterStatus}` : ""}</span></div>
        <button className="admin-primary" onClick={() => openOrder({ id: "", createdAt: "", status: "Thành công", customer: "", phone: "", total: 0, items: 1 })}>+ Thêm đơn hàng</button>
      </div>
      <div className="admin-product-filters" style={{ marginBottom: 0 }}>
        <div className="admin-search">⌕<input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Tìm mã đơn, tên, SĐT..." /></div>
        <select value={filterPeriod} onChange={(e) => setFilterPeriod(e.target.value as "all" | "today" | "week" | "month" | "year")} aria-label="Lọc theo thời gian">
          <option value="all">Tất cả thời gian</option>
          <option value="today">Hôm nay</option>
          <option value="week">Tuần này</option>
          <option value="month">Tháng này</option>
          <option value="year">Năm này</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} aria-label="Lọc theo trạng thái">
          <option value="all">Tất cả trạng thái</option>
          <option value="Thành công">Thành công</option>
          <option value="Đã hủy">Đã hủy</option>
        </select>
      </div>

      <div className="admin-order-crm-table"><div className="admin-order-crm-head"><span>MÃ ĐƠN</span><span>KHÁCH HÀNG</span><span>SẢN PHẨM</span><span>SỐ LƯỢNG</span><span>TỔNG TIỀN</span><span>TRẠNG THÁI</span><span>NGÀY ĐẶT</span><span>THAO TÁC</span></div>{filteredOrders.length ? filteredOrders.map(order => <div className="admin-order-crm-row" key={order.id}><strong>{order.id}</strong><div><strong>{order.customer}</strong><small>{order.phone}</small></div><span className="order-product-summary">{productSummary(order)}</span><span>{order.items}</span><strong className="order-total">{money(order.total)}<small>{order.paidAmount && order.paidAmount >= order.total ? "Đã thanh toán" : order.paidAmount ? `Còn nợ ${money(order.total - order.paidAmount)}` : "Chưa thanh toán"}</small></strong><select value={order.status} onChange={(e) => updateOrder(order.id, e.target.value)} aria-label={`Trạng thái ${order.id}`}><option>Thành công</option><option>Đã hủy</option></select><span>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</span><div className="admin-row-actions"><button title="Xem chi tiết" aria-label="Xem chi tiết" onClick={() => setDetail(order)}><Target /></button><button title="Sửa đơn hàng" aria-label="Sửa đơn hàng" onClick={() => openOrder(order)}><Pencil /></button><button className="danger" title="Xóa đơn hàng" aria-label="Xóa đơn hàng" onClick={() => setConfirmDelete(order)}><X /></button></div></div>) : <div className="admin-empty">{orders.length ? "Không tìm thấy đơn hàng phù hợp bộ lọc." : "Chưa có đơn hàng trong hệ thống."}</div>}</div>
    </section>

    <AdminModal open={!!detail} onClose={() => setDetail(null)} title={detail?.id ? `Chi tiết ${detail.id}` : "Chi tiết đơn hàng"} subtitle="Thông tin chi tiết đơn hàng" size="lg" footer={<><button className="vg-btn" type="button" onClick={() => setDetail(null)}>Đóng</button><button className="vg-btn vg-btn-primary" type="button" disabled={!detail} onClick={() => detail && exportInvoice(detail)}>▣ Xuất hóa đơn PDF</button></>}>
      {detail && <section className="admin-invoice-preview">
        <header className="admin-invoice-header"><BrandLogo /><div><h3>HÓA ĐƠN BÁN HÀNG</h3><b>Mã đơn: {detail.id}</b><small>Ngày lập: {new Date(detail.createdAt).toLocaleString("vi-VN")}</small></div></header>
        <div className="admin-invoice-contact">Cần Thơ, Việt Nam · Hotline: 1900 1234</div>
        <div className="admin-invoice-info"><div><strong>THÔNG TIN KHÁCH HÀNG</strong><span>{detail.customer}</span><span>{detail.phone}</span><span>{detail.email || "Chưa cập nhật email"}</span><span>{[detail.address, detail.ward, detail.district, detail.province].filter(Boolean).join(", ") || "Chưa cập nhật địa chỉ"}</span></div><div><strong>TRẠNG THÁI ĐƠN HÀNG</strong><b>{detail.status}</b><span>{({ cod: "Thanh toán khi nhận hàng", bank: "Chuyển khoản ngân hàng", wallet: "Ví điện tử", vnpay: "Ví điện tử / VNPay" }[detail.paymentMethod || "cod"] || detail.paymentMethod || "Chưa xác định")}</span><span>{detail.paidAmount && detail.paidAmount >= detail.total ? "Đã thanh toán" : "Chưa thanh toán"}</span><span>{detail.promotionCode || detail.voucherCode ? `Ưu đãi: ${detail.promotionCode || detail.voucherCode}` : "Không dùng ưu đãi"}</span></div></div>
        <div className="admin-invoice-items"><div className="admin-invoice-items-head"><span>STT</span><span>SẢN PHẨM</span><span>ĐƠN GIÁ</span><span>SL</span><span>THÀNH TIỀN</span></div>{detail.products?.length ? detail.products.map((item, index) => { const product = products.find(entry => entry.id === item.productId); const price = item.purchasePrice || product?.price || 0; return <div className="admin-invoice-item" key={`${detail.id}-${item.productId}`}><span>{index + 1}</span><span><b>{product?.name || `Sản phẩm #${item.productId}`}</b><small>{product?.weight || ""}</small></span><span>{money(price)}</span><span>{item.quantity}</span><b>{money(price * item.quantity)}</b></div>; }) : <div className="admin-empty">Không có sản phẩm</div>}</div>
        <div className="admin-invoice-summary"><span>Tạm tính <b>{money(detail.subtotal ?? detail.total + (detail.discount || 0) - (detail.shipping || 0))}</b></span><span>Giảm giá <b>-{money(detail.discount || 0)}</b></span><span>Phí vận chuyển <b>{detail.shipping ? money(detail.shipping) : "Miễn phí"}</b></span><strong>TỔNG THANH TOÁN <b>{money(detail.total)}</b></strong></div>
        {detail.note && <p className="admin-invoice-note">Ghi chú: {detail.note}</p>}<footer>Cảm ơn quý khách đã mua hàng tại VIGENFOOD.</footer>
      </section>}
    </AdminModal>

    {/* Order Edit Modal */}
    <AdminModal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Chỉnh sửa đơn hàng" : "Thêm đơn hàng"} subtitle="Tạo đơn hàng mới cho khách" size="lg" footer={<><button className="vg-btn" type="button" onClick={() => setEditing(null)}>Hủy</button><button className="vg-btn vg-btn-primary" type="submit" form="order-form">▣ Lưu đơn hàng</button></>}>
      <form id="order-form" onSubmit={submit}>
        {orderFormError && (
          <div role="alert" style={{ marginBottom: 14, padding: "10px 12px", borderRadius: 8, background: "rgba(242, 109, 109, 0.1)", border: "1px solid rgba(242,109,109,.45)", color: "#f8c7c7", fontSize: 12, lineHeight: 1.5 }}>
            {orderFormError}
          </div>
        )}
        {/* Section 1: Customer */}
        <div className="vg-section">
          <div className="vg-section-title"><span className="vg-section-num">1</span> THÔNG TIN KHÁCH HÀNG</div>
          <div className="vg-form-grid">
            <div className="vg-field"><span className="vg-field-label">Tên khách hàng <span className="vg-required">*</span></span><input className="vg-input" name="customer" defaultValue={editing?.customer} placeholder="Nhập tên khách hàng" required /></div>
            <div className="vg-field"><span className="vg-field-label">Số điện thoại <span className="vg-required">*</span></span><input className="vg-input" name="phone" defaultValue={editing?.phone} placeholder="Nhập số điện thoại" required /></div>
            <div className="vg-field"><span className="vg-field-label">Email</span><input className="vg-input" name="email" placeholder="Nhập email (nếu có)" type="email" /></div>
            <div className="vg-field"><span className="vg-field-label">Địa chỉ nhận hàng</span><input className="vg-input" name="address" placeholder="Số nhà, đường, phường/xã, tỉnh/thành phố" /></div>
          </div>
        </div>

        {/* Section 2: Products */}
        <div className="vg-section">
          <div className="vg-section-title"><span className="vg-section-num">2</span> SẢN PHẨM ĐẶT HÀNG</div>
          <div className="vg-order-table-head"><span>SẢN PHẨM</span><span>QUY CÁCH</span><span>ĐƠN GIÁ</span><span>SỐ LƯỢNG</span><span>THÀNH TIỀN</span><span></span></div>
          {orderProducts.map((row, index) => <div className="vg-order-table-row" key={`${row.product.id}-${index}`}>
            <div className="vg-order-product-cell"><img src={row.product.image} alt="" /><span><strong>{row.product.name}</strong><small>{row.product.badge || "Thơm dẻo"}</small></span></div>
            <span>{row.product.weight}</span>
            <span>{money(row.product.price)}</span>
            <div className="vg-quantity"><button type="button" onClick={() => changeQuantity(row.product.id, -1)}>−</button><b>{row.quantity}</b><button type="button" onClick={() => changeQuantity(row.product.id, 1)}>+</button></div>
            <span className="vg-line-total">{money(row.product.price * row.quantity)}</span>
            <button className="vg-remove-btn" type="button" onClick={() => removeProduct(row.product.id)} aria-label={`Xóa ${row.product.name}`}>✕</button>
          </div>)}
          <div className="vg-order-add-actions"><button type="button" className="vg-add-product-btn" onClick={() => setProductPickerOpen(true)}>＋ Thêm sản phẩm</button><button type="button" className="vg-add-product-btn vg-add-promotion-btn" onClick={() => setPromotionPickerOpen(true)}>◇ Chọn combo ưu đãi</button></div>
        </div>

        {/* Section 3, 4, 5 */}
        <div className="vg-order-columns">
          <div className="vg-section">
            <div className="vg-section-title"><span className="vg-section-num">3</span> GIAO HÀNG</div>
            <div className="vg-field" style={{ marginBottom: 14 }}><span className="vg-field-label">Đơn vị vận chuyển</span><select className="vg-select" name="shipping"><option>Giao hàng nhanh (GHN)</option><option>Viettel Post</option><option>J&T Express</option></select></div>
            <div className="vg-field" style={{ marginBottom: 14 }}><span className="vg-field-label">Ngày giao dự kiến</span><input className="vg-input" name="deliveryDate" type="date" defaultValue="2026-09-05" /></div>
          </div>
          <div className="vg-section">
            <div className="vg-section-title"><span className="vg-section-num">4</span> THANH TOÁN</div>
            <span className="vg-field-label" style={{ marginBottom: 10, display: "block" }}>Phương thức thanh toán *</span>
            <div className="vg-payment-options"><label><input type="radio" name="payment" value="cod" defaultChecked /> COD</label><label><input type="radio" name="payment" value="bank" /> Chuyển khoản</label><label><input type="radio" name="payment" value="wallet" /> Ví điện tử</label></div>
            <div className="vg-field" style={{ marginTop: 14 }}><span className="vg-field-label">Trạng thái thanh toán</span><select className="vg-select" name="paymentStatus" defaultValue={editing?.paymentStatus || (editing?.paidAmount ? "paid" : "unpaid")}><option value="unpaid">Chưa thanh toán</option><option value="paid">Đã thanh toán</option></select></div>
            <div className="vg-field" style={{ marginTop: 14 }}><span className="vg-field-label">Ghi chú đơn hàng</span><textarea className="vg-textarea" name="note" placeholder="Giao giờ hành chính, gọi trước khi giao..." /></div>
          </div>
          <div className="vg-section">
            <div className="vg-section-title"><span className="vg-section-num">5</span> TỔNG KẾT</div>
            <div className="vg-summary-row"><span>Tạm tính</span><strong>{money(subtotal)}</strong></div>
            <div className="vg-voucher-row"><input value={voucher} onChange={(e) => setVoucher(e.target.value)} placeholder="Nhập mã giảm giá" /><button type="button" onClick={applyVoucher}>Áp dụng</button></div>
            <div className="vg-summary-row"><span>Phí vận chuyển</span><strong>{money(shippingFee)}</strong></div>
            <div className="vg-summary-row vg-summary-total"><span>TỔNG TIỀN</span><strong>{money(total)}</strong></div>
          </div>
        </div>
        <input type="hidden" name="status" value={editing?.status || "Thành công"} />
      </form>
    </AdminModal>

    {/* Product Picker Modal */}
    <AdminModal open={productPickerOpen} onClose={() => setProductPickerOpen(false)} title="Chọn sản phẩm" subtitle="Chọn sản phẩm muốn thêm vào đơn hàng" size="sm">
      <div className="vg-picker-list">
        {products.map(product => { const selected = orderProducts.some(r => r.product.id === product.id); return <button type="button" className={`vg-picker-item ${selected ? "selected" : ""}`} disabled={selected} onClick={() => addProduct(product)} key={product.id}><img src={product.image} alt="" /><span><strong>{product.name}</strong><small>{product.weight} · {money(product.price)}</small></span><b>{selected ? "Đã chọn" : "Chọn"}</b></button>; })}
      </div>
    </AdminModal>
    <AdminModal open={promotionPickerOpen} onClose={() => setPromotionPickerOpen(false)} title="Chọn combo ưu đãi" subtitle="Chọn chương trình đã tạo trong mục Combo & khuyến mãi" size="sm">
      <div className="vg-picker-list">{promotions.filter(promotion => promotion.status === "active").length ? promotions.filter(promotion => promotion.status === "active").map(promotion => {
        const product = products.find(item => item.id === promotion.productId);
        const packageCount = product ? Math.max(1, Math.ceil(promotion.minQuantity / Number.parseFloat(product.weight || "1"))) : 0;
        const outOfStock = !product || getEffectiveStock(product) < packageCount;
        return <button type="button" className={`vg-picker-item ${outOfStock ? "disabled" : ""}`} key={promotion.id} disabled={outOfStock} onClick={() => choosePromotion(promotion)}><span><strong>{promotion.code ? `${promotion.code} · ` : ""}{promotion.name}</strong><small>{product?.name || "Sản phẩm không tồn tại"} · {outOfStock ? "Hết hàng" : `Mua từ ${promotion.minQuantity}kg`}</small></span><b>{outOfStock ? "Hết hàng" : "Chọn"}</b></button>;
      }) : <div className="admin-empty">Chưa có combo đang bật.</div>}</div>
    </AdminModal>

    <ConfirmModal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => { if (confirmDelete) { saveOrders(orders.filter(o => o.id !== confirmDelete.id)); addAdminNotification(`Đã xóa đơn hàng #${confirmDelete.id}`, "order", undefined, "orders"); } setConfirmDelete(null); }} title={`Xóa đơn hàng ${confirmDelete?.id}?`} message="Đơn hàng sẽ bị xóa và không thể hoàn tác." />
  </>;
}


/* ===== CUSTOMER MANAGER ===== */
type Customer = { id: string; name: string; phone: string; email: string; address: string; status: "active" | "inactive" };
function CustomerManager({ orders }: { orders: Order[] }) {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("gao-ngon-customers");
    if (saved) return JSON.parse(saved);
    return [];
  });
  const [editing, setEditing] = useState<Customer | null>(null);
  const [detail, setDetail] = useState<Customer | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Customer | null>(null);
  const [customerGroup, setCustomerGroup] = useState<"all" | "care" | "active">("all");
  const [customerPeriod, setCustomerPeriod] = useState<"all" | "today" | "week" | "month" | "year">("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!orders.length) return;
    setCustomers(current => {
      const next = [...current];
      orders.forEach(order => {
        if (!order.phone) return;
        const existing = next.find(customer => customer.phone === order.phone);
        if (existing) {
          existing.name = order.customer || existing.name;
          return;
        }
        next.push({ id: `CUS-${order.phone}`, name: order.customer || "Khách hàng", phone: order.phone, email: "", address: "", status: "active" });
      });
      localStorage.setItem("gao-ngon-customers", JSON.stringify(next));
      return next;
    });
  }, [orders]);

  function save(next: Customer[]) { setCustomers(next); localStorage.setItem("gao-ngon-customers", JSON.stringify(next)); }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Customer = { id: editing?.id || `CUS${Date.now()}`, name: String(data.get("name")), phone: String(data.get("phone")), email: String(data.get("email")), address: String(data.get("address")), status: String(data.get("status")) as "active" | "inactive" };
    save(editing?.id ? customers.map(c => c.id === editing.id ? next : c) : [...customers, next]);
    addAdminNotification(
      editing?.id ? `Cập nhật thông tin khách hàng "${next.name}"` : `Thêm khách hàng mới "${next.name}"`,
      "customer",
      `SĐT: ${next.phone}`,
      "customers"
    );
    setEditing(null);
  }

  const customerOrders = (customer: Customer) => orders.filter(order => order.phone === customer.phone).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const orderCount = (customer: Customer) => customerOrders(customer).length;
  const careAfterDays = 90;
  const latestOrder = (customer: Customer) => customerOrders(customer)[0];
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const monthStr = now.toISOString().slice(0, 7);
  const yearStr = now.toISOString().slice(0, 4);
  const weekStart = new Date(now);
  const dayOfWeek = weekStart.getDay() || 7;
  weekStart.setDate(weekStart.getDate() - dayOfWeek + 1);
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const isInCustomerPeriod = (order: Order) => {
    if (customerPeriod === "today") return order.createdAt.slice(0, 10) === todayStr;
    if (customerPeriod === "week") { const date = new Date(order.createdAt); return date >= weekStart && date < weekEnd; }
    if (customerPeriod === "month") return order.createdAt.slice(0, 7) === monthStr;
    if (customerPeriod === "year") return order.createdAt.slice(0, 4) === yearStr;
    return true;
  };
  const periodOrders = orders.filter(isInCustomerPeriod);
  const periodCustomerOrders = (customer: Customer) => customerOrders(customer).filter(isInCustomerPeriod);
  const needsCare = (customer: Customer) => {
    const order = latestOrder(customer);
    return !order || Date.now() - new Date(order.createdAt).getTime() >= careAfterDays * 86400000;
  };
  const filteredCustomers = customers.filter(customer => {
    if (!`${customer.name} ${customer.phone}`.toLowerCase().includes(query.toLowerCase())) return false;
    if (customerGroup === "care") return needsCare(customer);
    if (customerGroup === "active") return orderCount(customer) > 0;
    return customerPeriod === "all" || periodCustomerOrders(customer).length > 0;
  });
  const careCount = customers.filter(needsCare).length;
  const activeCount = customers.filter(customer => orderCount(customer) > 0).length;
  const totalPurchased = (customer: Customer) => customerOrders(customer).reduce((sum, order) => sum + order.total, 0);
  const totalPaid = (customer: Customer) => customerOrders(customer).reduce((sum, order) => sum + Math.min(order.total, Math.max(0, order.paidAmount || 0)), 0);
  const totalDebt = (customer: Customer) => Math.max(0, totalPurchased(customer) - totalPaid(customer));
  const periodTotalPurchased = filteredCustomers.reduce((sum, customer) => sum + periodCustomerOrders(customer).reduce((customerSum, order) => customerSum + order.total, 0), 0);
  const periodCustomerCount = filteredCustomers.length;
  const periodOrderCount = filteredCustomers.reduce((sum, customer) => sum + periodCustomerOrders(customer).length, 0);
  const customerPeriodLabel = customerPeriod === "today" ? "Hôm nay" : customerPeriod === "week" ? "Tuần này" : customerPeriod === "month" ? "Tháng này" : customerPeriod === "year" ? "Năm này" : "Tất cả thời gian";
  const formatDate = (value?: string) => value ? new Date(value).toLocaleDateString("vi-VN") : "-";

  return <>
    <div className="admin-hero-card customer-hero">
      <div>
        <span className="admin-kicker">QUẢN LÝ KHÁCH HÀNG</span>
        <h2>Danh sách khách hàng</h2>
        <p>Quản lý quan hệ khách hàng, phân nhóm chăm sóc và lịch sử mua gạo.</p>
      </div>
      <button className="admin-primary" onClick={() => setEditing({ id: "", name: "", phone: "", email: "", address: "", status: "active" })}><span aria-hidden="true">+</span> Thêm khách hàng</button>
    </div>

    <section className="admin-panel">
    <div className="customer-toolbar"><label className="admin-search">⌕<input value={query} onChange={event => setQuery(event.target.value)} placeholder="Tìm theo tên hoặc số điện thoại..." /></label><select className="customer-period-filter" value={customerPeriod} onChange={event => setCustomerPeriod(event.target.value as typeof customerPeriod)} aria-label="Lọc khách hàng theo thời gian"><option value="all">Tất cả thời gian</option><option value="today">Hôm nay</option><option value="week">Tuần này</option><option value="month">Tháng này</option><option value="year">Năm này</option></select><div className="customer-group-filters"><button className={customerGroup === "all" ? "active" : ""} onClick={() => setCustomerGroup("all")}>Tất cả <b>{customers.length}</b></button><button className={customerGroup === "care" ? "active" : ""} onClick={() => setCustomerGroup("care")}>Cần chăm sóc <b>{careCount}</b></button><button className={customerGroup === "active" ? "active" : ""} onClick={() => setCustomerGroup("active")}>Đã phát sinh đơn <b>{activeCount}</b></button></div></div>
    <div className="customer-period-summary"><span>{customerPeriodLabel}</span><strong>{periodCustomerCount} khách</strong><strong>{periodOrderCount} đơn</strong><strong>{money(periodTotalPurchased)}</strong><small>Tổng tiền đã mua</small></div>
    <div className="admin-customer-table"><div className="admin-customer-table-head"><span>KHÁCH HÀNG</span><span>LIÊN HỆ</span><span>ĐỊA CHỈ</span><span>SỐ ĐƠN HÀNG</span><span>TỔNG TIỀN ĐÃ MUA</span><span>CÒN NỢ</span><span>TRẠNG THÁI</span><span>THAO TÁC</span></div>{filteredCustomers.length === 0 ? <div className="admin-empty">Chưa có khách hàng phù hợp.</div> : filteredCustomers.map(c => { const ordersForCustomer = customerOrders(c); const count = ordersForCustomer.length; const customerNeedsCare = needsCare(c); const debt = totalDebt(c); return <div className="admin-customer-row" key={c.id}><div className="customer-identity"><span className="admin-avatar">{c.name.charAt(0)}</span><span><strong>{c.name}</strong><small>{c.id}</small></span></div><div><span>{c.phone}</span><small>{c.email || "Chưa có email"}</small></div><span>{c.address || "Chưa có địa chỉ"}</span><span>{count} đơn</span><strong className="customer-total">{money(customerPeriod === "all" ? totalPurchased(c) : periodCustomerOrders(c).reduce((sum, order) => sum + order.total, 0))}</strong><strong className="customer-total">{debt ? money(debt) : "Đã thanh toán"}</strong><em className={debt ? "customer-care" : customerNeedsCare ? "customer-care" : c.status === "active" ? "in-stock" : "low-stock"}>{debt ? "Còn công nợ" : customerNeedsCare ? "Cần chăm sóc" : count === 1 ? "Khách mới" : "Đã chăm sóc"}</em><div className="admin-row-actions"><button title="Xem chi tiết" aria-label="Xem chi tiết" onClick={() => setDetail(c)}><Target /></button><button title="Sửa" aria-label="Sửa" onClick={() => setEditing(c)}><Pencil /></button><button className="danger" title="Xóa" aria-label="Xóa" onClick={() => setConfirmDelete(c)}><X /></button></div></div>; })}</div>

    <AdminModal open={!!detail} onClose={() => setDetail(null)} title={detail ? `Chi tiết ${detail.name}` : "Chi tiết khách hàng"} subtitle="Thông tin khách hàng và lịch sử mua hàng" size="md" footer={<><button className="vg-btn" type="button" onClick={() => setDetail(null)}>Đóng</button></>}>
      {detail && (
        <div className="customer-detail-content">
          <div className="vg-field"><span className="vg-field-label">Họ và tên</span><input className="vg-input" value={detail.name} readOnly /></div>
          <div className="vg-field"><span className="vg-field-label">Số điện thoại</span><input className="vg-input" value={detail.phone} readOnly /></div>
          <div className="vg-field"><span className="vg-field-label">Email</span><input className="vg-input" value={detail.email || "Chưa có email"} readOnly /></div>
          <div className="vg-field vg-full"><span className="vg-field-label">Địa chỉ</span><input className="vg-input" value={detail.address || "Chưa có địa chỉ"} readOnly /></div>
          <div className="vg-field"><span className="vg-field-label">Trạng thái</span><input className="vg-input" value={detail.status === "active" ? "Hoạt động" : "Khóa"} readOnly /></div>
          <div className="vg-field"><span className="vg-field-label">Số đơn hàng</span><input className="vg-input" value={orderCount(detail)} readOnly /></div>
          <div className="vg-field"><span className="vg-field-label">Công nợ hiện tại</span><input className="vg-input" value={totalDebt(detail) ? money(totalDebt(detail)) : "Không có công nợ"} readOnly /></div>
          <div className="customer-detail-section"><h3>Lịch sử đơn hàng ({customerOrders(detail).length})</h3>{customerOrders(detail).length ? customerOrders(detail).map(order => <div className="customer-history-row" key={order.id}><span><strong>{order.id}</strong><small>{formatDate(order.createdAt)} · {order.status} · {order.paidAmount && order.paidAmount >= order.total ? "Đã thanh toán" : order.paidAmount ? `Còn nợ ${money(order.total - order.paidAmount)}` : "Chưa thanh toán"}</small></span><b>{money(order.total)}</b></div>) : <p>Chưa có đơn hàng.</p>}</div>
          <div className="customer-detail-section"><h3>Lịch sử chăm sóc</h3><p>{customerOrders(detail).length ? `Lần mua gần nhất: ${formatDate(customerOrders(detail)[0].createdAt)}.` : "Chưa có lịch sử chăm sóc."}</p></div>
        </div>
      )}
    </AdminModal>

    <AdminModal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Sửa khách hàng" : "Thêm khách hàng"} subtitle="Quản lý thông tin khách hàng" size="sm" footer={<><button className="vg-btn" type="button" onClick={() => setEditing(null)}>Hủy</button><button className="vg-btn vg-btn-primary" type="submit" form="customer-form">Lưu khách hàng</button></>}>
      <form id="customer-form" onSubmit={submit}>
        <div className="vg-form-grid">
          <div className="vg-field vg-full"><span className="vg-field-label">Họ và tên <span className="vg-required">*</span></span><input className="vg-input" name="name" defaultValue={editing?.name} required /></div>
          <div className="vg-field"><span className="vg-field-label">Số điện thoại <span className="vg-required">*</span></span><input className="vg-input" name="phone" defaultValue={editing?.phone} required /></div>
          <div className="vg-field"><span className="vg-field-label">Email</span><input className="vg-input" name="email" defaultValue={editing?.email} type="email" /></div>
          <div className="vg-field vg-full"><span className="vg-field-label">Địa chỉ</span><input className="vg-input" name="address" defaultValue={editing?.address} /></div>
          <div className="vg-field vg-full"><span className="vg-field-label">Trạng thái</span><select className="vg-select" name="status" defaultValue={editing?.status}><option value="active">Hoạt động</option><option value="inactive">Khóa</option></select></div>
        </div>
      </form>
    </AdminModal>
    <ConfirmModal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => { if (confirmDelete) { save(customers.filter(c => c.id !== confirmDelete.id)); addAdminNotification(`Đã xóa khách hàng "${confirmDelete.name}"`, "customer", undefined, "customers"); } setConfirmDelete(null); }} title="Xóa khách hàng?" message="Thông tin khách hàng sẽ bị xóa và không thể hoàn tác." />
  </section></>;
}

/* ===== VOUCHER MANAGER ===== */
function VoucherManager({ vouchers, saveVouchers }: { vouchers: Voucher[]; saveVouchers: (v: Voucher[]) => void }) {
  const [editing, setEditing] = useState<Voucher | null>(null);
  const [detail, setDetail] = useState<Voucher | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Voucher | null>(null);
  const [conditionType, setConditionType] = useState<Voucher["conditionType"]>("none");
  const [voucherTab, setVoucherTab] = useState<"public" | "reward">("public");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const discountType = String(data.get("discountType")) as Voucher["discountType"];
    const next: Voucher = {
      code: String(data.get("code")).toUpperCase(),
      desc: String(data.get("desc")),
      exp: String(data.get("exp")),
      active: true,
      discountType,
      discountValue: discountType === "shipping" ? 0 : discountType === "amount" ? inputMoney(String(data.get("discountValue") || 0)) : Number(data.get("discountValue") || 0),
      conditionType,
      minOrders: conditionType === "min_orders" ? Number(data.get("minOrders") || 1) : undefined,
      minSpend: conditionType === "min_spend" ? inputMoney(String(data.get("minSpend") || 0)) : undefined,
      holidayName: conditionType === "holiday" ? String(data.get("holidayName") || "").trim() : undefined,
      holidayDate: conditionType === "holiday" ? String(data.get("holidayDate") || "").trim() : undefined,
      requireReviewPhoto: conditionType === "review_reward" ? data.get("requireReviewPhoto") === "on" : undefined,
      topRank: conditionType === "top_customer" ? Number(data.get("topRank") || 10) : undefined,
    };
    if (editing && editing.code !== "") {
      saveVouchers(vouchers.map(v => v.code === editing.code ? next : v));
      addAdminNotification(`Cập nhật mã giảm giá ${next.code}`, "voucher", next.desc, "vouchers");
    } else {
      saveVouchers([...vouchers, next]);
      addAdminNotification(`Thêm mã giảm giá mới ${next.code}`, "voucher", next.desc, "vouchers");
    }
    setEditing(null);
  }

  function openEdit(voucher: Voucher) {
    setConditionType(voucher.conditionType || "none");
    setEditing(voucher);
  }

  function openNew() {
    setConditionType("none");
    setEditing({ code: "", desc: "", exp: "", active: true });
  }

  const conditionLabel = (v: Voucher) => {
    if (v.conditionType === "min_orders" && v.minOrders) return `Tặng khi mua đủ ${v.minOrders} đơn`;
    if (v.conditionType === "min_spend" && v.minSpend) return `Tặng khi chi tiêu đủ ${money(v.minSpend)}`;
    if (v.conditionType === "first_order") return "Tặng cho đơn hàng đầu tiên";
    if (v.conditionType === "holiday") return `Dịp lễ: ${v.holidayName || v.holidayDate || "Ngày đặc biệt"}`;
    if (v.conditionType === "review_reward") return v.requireReviewPhoto ? "Đánh giá + Hình ảnh sản phẩm" : "Đánh giá sản phẩm";
    if (v.conditionType === "next_order") return "Tặng cho đơn hàng tiếp theo";
    if (v.conditionType === "top_customer") return `Dành cho Top ${v.topRank || 10} Khách hàng`;
    return "Công khai";
  };

  const isReward = (v: Voucher) => v.conditionType && v.conditionType !== "none";
  const publicVouchers = vouchers.filter(v => !isReward(v));
  const rewardVouchers = vouchers.filter(v => isReward(v));
  const displayList = voucherTab === "public" ? publicVouchers : rewardVouchers;

  const CONDITION_OPTIONS: { value: NonNullable<Voucher["conditionType"]>; icon: string; label: string; hint: string }[] = [
    { value: "none",          icon: "🌐", label: "Mã công khai",              hint: "Tất cả khách hàng đều dùng được" },
    { value: "min_orders",    icon: "📦", label: "Đủ số đơn hàng",           hint: "Tự động tặng khi mua đủ N đơn" },
    { value: "min_spend",     icon: "💰", label: "Đủ số tiền chi tiêu",       hint: "Tự động tặng khi tổng chi tiêu đủ" },
    { value: "first_order",   icon: "🎉", label: "Đơn hàng đầu tiên",        hint: "Chỉ tặng cho lần mua đầu tiên" },
    { value: "holiday",       icon: "📅", label: "Ngày đặc biệt / Dịp lễ",   hint: "Tặng dịp 2/9, Tết, Noel, 8/3..." },
    { value: "review_reward", icon: "⭐", label: "Đánh giá sản phẩm",         hint: "Tặng khi viết nhận xét + ảnh" },
    { value: "next_order",    icon: "🔄", label: "Quay lại mua (Đơn tới)",    hint: "Tặng sau khi mua đơn hàng" },
    { value: "top_customer",  icon: "🏆", label: "Khách mua nhiều nhất",      hint: "Dành riêng Top khách chi tiêu cao" },
  ];

  return <>
    <div className="admin-hero-card voucher-hero">
      <div>
        <span className="admin-kicker">MÃ GIẢM GIÁ & ƯU ĐÃI</span>
        <h2>Quản lý voucher khuyến mãi</h2>
        <p>Tạo và thiết lập điều kiện tự động tặng mã ưu đãi cho khách hàng hội viên.</p>
      </div>
      <button className="admin-primary" onClick={openNew}><span aria-hidden="true">+</span> Tạo mã</button>
    </div>

    <section className="admin-panel">
    <div className="admin-table-head">
      <div>
        <strong>{vouchers.length} mã giảm giá</strong>
        <div className="voucher-tab-switcher">
          <button className={voucherTab === "public" ? "voucher-tab-active" : ""} onClick={() => setVoucherTab("public")}>
            Mã công khai ({publicVouchers.length})
          </button>
          <button className={voucherTab === "reward" ? "voucher-tab-active" : ""} onClick={() => setVoucherTab("reward")}>
            🎁 Mã thưởng điều kiện ({rewardVouchers.length})
          </button>
        </div>
      </div>
      <button className="admin-primary" onClick={openNew}><span aria-hidden="true">+</span> Tạo mã</button>
    </div>

    {voucherTab === "reward" && (
      <div className="voucher-reward-notice">
        <span>⚡</span>
        <span>Mã thưởng điều kiện sẽ <b>tự động chuyển</b> vào tài khoản khách hàng khi đạt điều kiện. Khách xem và sao chép mã trong mục <b>Ưu đãi hội viên</b> trên trang cá nhân.</span>
      </div>
    )}

    {displayList.length ? displayList.map((voucher) => {
      const realIndex = vouchers.indexOf(voucher);
      return <div className="admin-voucher-row admin-order-full" key={voucher.code}>
        <b>{voucher.code}</b>
        <span>
          {voucher.desc}
          <small>HSD: {voucher.exp}</small>
          {isReward(voucher) && <small className="voucher-condition-badge">🎁 {conditionLabel(voucher)}</small>}
        </span>
        <em className={voucher.active ? "voucher-active" : ""}>{voucher.active ? "Đang bật" : "Đã tắt"}</em>
        <div className="admin-row-actions">
          <button title="Xem chi tiết" aria-label="Xem chi tiết" onClick={() => setDetail(voucher)}><Target /></button>
          <button onClick={() => saveVouchers(vouchers.map((item, i) => i === realIndex ? { ...item, active: !item.active } : item))} title={voucher.active ? "Tắt" : "Bật"}>{voucher.active ? "■" : "▶"}</button>
          <button title="Sửa" aria-label="Sửa" onClick={() => openEdit(voucher)}><Pencil /></button>
          <button className="danger" title="Xóa" aria-label="Xóa" onClick={() => setConfirmDelete(voucher)}><X /></button>
        </div>
      </div>;
    }) : (
      <div className="admin-empty">
        {voucherTab === "public" ? "Chưa có mã công khai nào." : "Chưa có mã thưởng điều kiện nào. Nhấn \"Tạo mã\" và chọn điều kiện để bắt đầu."}
      </div>
    )}

    {/* ── Detail Modal ── */}
    <AdminModal open={!!detail} onClose={() => setDetail(null)} title={detail ? `Chi tiết ${detail.code}` : "Chi tiết mã giảm giá"} subtitle="Thông tin chi tiết voucher" size="sm" footer={<><button className="vg-btn" type="button" onClick={() => setDetail(null)}>Đóng</button></>}>
      {detail && (
        <div className="vg-form-grid">
          <div className="vg-field"><span className="vg-field-label">Mã code</span><input className="vg-input" value={detail.code} readOnly /></div>
          <div className="vg-field"><span className="vg-field-label">Hạn sử dụng</span><input className="vg-input" value={detail.exp} readOnly /></div>
          <div className="vg-field"><span className="vg-field-label">Trạng thái</span><input className="vg-input" value={detail.active ? "Đang bật" : "Đã tắt"} readOnly /></div>
          <div className="vg-field"><span className="vg-field-label">Loại giảm</span><input className="vg-input" value={detail.discountType === "shipping" ? "Miễn phí vận chuyển" : detail.discountType === "amount" ? "Giảm số tiền" : "Giảm phần trăm"} readOnly /></div>
          <div className="vg-field"><span className="vg-field-label">Giá trị giảm</span><input className="vg-input" value={detail.discountType === "shipping" ? "0đ" : detail.discountType === "amount" ? `${(detail.discountValue || 0).toLocaleString("vi-VN")}đ` : `${detail.discountValue || 0}%`} readOnly /></div>
          <div className="vg-field"><span className="vg-field-label">Điều kiện nhận</span><input className="vg-input" value={conditionLabel(detail)} readOnly /></div>
          <div className="vg-field vg-full"><span className="vg-field-label">Mô tả</span><textarea className="vg-textarea" value={detail.desc} readOnly /></div>
        </div>
      )}
    </AdminModal>

    {/* ── Create / Edit Modal ── */}
    <AdminModal open={!!editing} onClose={() => setEditing(null)} title={editing?.code ? "Sửa mã giảm giá" : "Tạo mã giảm giá"} subtitle="Quản lý voucher khuyến mãi" size="sm" footer={<><button className="vg-btn" type="button" onClick={() => setEditing(null)}>Hủy</button><button className="vg-btn vg-btn-primary" type="submit" form="voucher-form">Lưu mã</button></>}>
      <form id="voucher-form" onSubmit={submit}>
        <div className="vg-form-grid">
          <div className="vg-field"><span className="vg-field-label">Mã code <span className="vg-required">*</span></span><input className="vg-input" name="code" defaultValue={editing?.code} placeholder="GAONGON20" required /></div>
          <div className="vg-field"><span className="vg-field-label">Hạn sử dụng <span className="vg-required">*</span></span><input className="vg-input" name="exp" defaultValue={editing?.exp} placeholder="31/12/2026" required /></div>
          <div className="vg-field vg-full"><span className="vg-field-label">Mô tả <span className="vg-required">*</span></span><input className="vg-input" name="desc" defaultValue={editing?.desc} placeholder="Giảm 20.000đ khi viết đánh giá kèm ảnh" required /></div>
          <div className="vg-field"><span className="vg-field-label">Loại giảm</span><select className="vg-select" name="discountType" defaultValue={editing?.discountType || "percent"}><option value="percent">Giảm phần trăm</option><option value="amount">Giảm số tiền</option><option value="shipping">Miễn phí vận chuyển</option></select></div>
          <div className="vg-field"><span className="vg-field-label">Giá trị giảm</span><input className="vg-input" name="discountValue" type="number" min="0" defaultValue={editing?.discountType === "amount" && editing.discountValue ? editing.discountValue / 1000 : editing?.discountValue || ""} placeholder="10 (%) hoặc 20 (nghìn VND)" /></div>

          {/* ══ ĐIỀU KIỆN NHẬN MÃ ══ */}
          <div className="vg-field vg-full voucher-condition-section">
            <span className="vg-field-label">Điều kiện nhận mã <span className="admin-kicker" style={{ marginLeft: 6 }}>TỰ ĐỘNG TẶNG</span></span>
            <div className="voucher-condition-options voucher-condition-grid">
              {CONDITION_OPTIONS.map(opt => (
                <label key={opt.value} className={conditionType === opt.value ? "voucher-cond-selected" : ""}>
                  <input type="radio" name="conditionTypeRadio" value={opt.value} checked={conditionType === opt.value} onChange={() => setConditionType(opt.value)} />
                  <span>{opt.icon} {opt.label}</span>
                  <small>{opt.hint}</small>
                </label>
              ))}
            </div>
          </div>

          {/* ── Nhập số đơn ── */}
          {conditionType === "min_orders" && (
            <div className="vg-field vg-full">
              <span className="vg-field-label">Số đơn hàng tối thiểu <span className="vg-required">*</span></span>
              <div className="voucher-cond-input-row">
                <input className="vg-input" name="minOrders" type="number" min="1" step="1" defaultValue={editing?.minOrders || 2} required />
                <span className="voucher-cond-unit">đơn hàng hoàn thành</span>
              </div>
              <small className="voucher-cond-tip">💡 Hệ thống đếm theo số điện thoại khách hàng khi đặt hàng.</small>
            </div>
          )}

          {/* ── Nhập số tiền chi tiêu ── */}
          {conditionType === "min_spend" && (
            <div className="vg-field vg-full">
              <span className="vg-field-label">Tổng chi tiêu tối thiểu <span className="vg-required">*</span></span>
              <div className="voucher-cond-input-row">
                <input className="vg-input" name="minSpend" type="number" min="1" step="1" defaultValue={editing?.minSpend ? editing.minSpend / 1000 : 500} required />
                <span className="voucher-cond-unit">.000 VND (tổng tất cả đơn)</span>
              </div>
              <small className="voucher-cond-tip">💡 Tính tổng tất cả đơn hàng của khách theo số điện thoại.</small>
            </div>
          )}

          {/* ── Đơn hàng đầu tiên ── */}
          {conditionType === "first_order" && (
            <div className="vg-field vg-full">
              <div className="voucher-cond-auto-note">
                <span>🎉</span>
                <span>Mã sẽ tự động mở khóa cho khách hàng chưa từng đặt đơn nào trước đó.</span>
              </div>
            </div>
          )}

          {/* ── Ngày đặc biệt / Dịp lễ ── */}
          {conditionType === "holiday" && (
            <div className="vg-field vg-full">
              <span className="vg-field-label">Tên dịp lễ / Ngày đặc biệt <span className="vg-required">*</span></span>
              <div className="voucher-cond-input-row" style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 10 }}>
                <input className="vg-input" name="holidayName" defaultValue={editing?.holidayName || "Quốc Khánh 2/9"} placeholder="VD: Quốc Khánh 2/9, Tết Nguyên Đán, Noel, 8/3..." required />
                <input className="vg-input" name="holidayDate" defaultValue={editing?.holidayDate || "02/09"} placeholder="Ngày (DD/MM)" required />
              </div>
              <small className="voucher-cond-tip">📅 Mã sẽ tự động mở khóa vào đúng dịp lễ/ngày đặc biệt này.</small>
            </div>
          )}

          {/* ── Đánh giá sản phẩm ── */}
          {conditionType === "review_reward" && (
            <div className="vg-field vg-full">
              <div className="voucher-cond-auto-note">
                <span>⭐</span>
                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "#fff", fontWeight: 600 }}>
                    <input type="checkbox" name="requireReviewPhoto" defaultChecked={editing?.requireReviewPhoto ?? true} />
                    Yêu cầu bài đánh giá phải kèm HÌNH ẢNH sản phẩm
                  </label>
                  <small style={{ color: "rgba(255,255,255,.5)", marginTop: 4, display: "block" }}>Mã sẽ tự động tặng ngay khi khách gửi nhận xét cho bất kỳ sản phẩm nào.</small>
                </div>
              </div>
            </div>
          )}

          {/* ── Quay lại mua (Đơn tiếp theo) ── */}
          {conditionType === "next_order" && (
            <div className="vg-field vg-full">
              <div className="voucher-cond-auto-note">
                <span>🔄</span>
                <span>Mã sẽ tự động kích hoạt và tặng ngay cho khách sau khi vừa hoàn thành 1 đơn hàng để áp dụng cho lần mua tiếp theo.</span>
              </div>
            </div>
          )}

          {/* ── Khách mua nhiều nhất (Top Khách hàng) ── */}
          {conditionType === "top_customer" && (
            <div className="vg-field vg-full">
              <span className="vg-field-label">Thứ hạng Top Khách hàng <span className="vg-required">*</span></span>
              <div className="voucher-cond-input-row">
                <input className="vg-input" name="topRank" type="number" min="1" step="1" defaultValue={editing?.topRank || 10} required />
                <span className="voucher-cond-unit">Top khách hàng chi tiêu cao nhất</span>
              </div>
              <small className="voucher-cond-tip">🏆 Hệ thống tự động xếp hạng thứ hạng chi tiêu của tất cả khách hàng để tặng quà VIP.</small>
            </div>
          )}
        </div>
      </form>
    </AdminModal>
    <ConfirmModal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => { if (confirmDelete) { saveVouchers(vouchers.filter(v => v.code !== confirmDelete.code)); addAdminNotification(`Đã xóa mã giảm giá ${confirmDelete.code}`, "voucher", undefined, "vouchers"); } setConfirmDelete(null); }} title="Xóa voucher?" message="Mã giảm giá sẽ bị xóa và không thể hoàn tác." />
  </section></>;
}



/* ===== CONTENT MANAGER ===== */
function ContentManager({ showNotice }: { showNotice: (text: string) => void }) {
  const defaults: ContentItem[] = [
    { id: 1, type: "banner", title: "TINH HOA HẠT GẠO", description: "Chọn lọc từ những hạt gạo chất lượng nhất, mang đến bữa cơm dẻo thơm.", image: "/images/hero-rice.png" },
    { id: 2, type: "about", title: "Câu chuyện Vigen Food", description: "Gắn kết nông dân, nhà sản xuất và người tiêu dùng Việt.", image: "/images/vigenfood.png" },
    { id: 3, type: "news", title: "Bí quyết nấu cơm niêu chuẩn vị cung đình", description: "Mẹo nhà bếp", image: "/images/banner1.jpg", category: "Mẹo nhà bếp", date: "24 Tháng 8, 2026" },
  ];
  const [items, setItems] = useState<ContentItem[]>(() => { if (typeof window === "undefined") return defaults; const saved = localStorage.getItem(contentKey); return saved ? JSON.parse(saved) : defaults; });
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [detail, setDetail] = useState<ContentItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ContentItem | null>(null);
  const defaultHeroSlides: HeroSlideContent[] = [
    { background: "/images/rice-landscape.png", product: "/images/st25.png.jpg", eyebrow: "TINH HOA HẠT GẠO", title: "VỊ NGUYÊN FOOD", script: "Từ thiên nhiên - Trọn vị yêu thương", description: "Chọn lọc từ những hạt gạo chất lượng nhất,\nmang đến bữa cơm dẻo thơm, trọn vị cho gia đình bạn." },
    { background: "/images/product-field.jpg", product: "/images/st.png", eyebrow: "HẠT GẠO TỪ ĐỒNG XANH", title: "MÙA VÀNG\nVIỆT NAM", script: "Gom nắng vào từng hạt cơm", description: "Nguồn gạo chọn lọc từ vùng nguyên liệu sạch,\ngiữ trọn vị thơm ngon trong mỗi bữa ăn." },
    { background: "/images/banner1.jpg", product: "/images/hinh gao2t25.jpg", eyebrow: "BỮA CƠM TRỌN VỊ", title: "GẠO NGON\nCHO NHÀ MÌNH", script: "Dẻo thơm mỗi ngày", description: "Những lựa chọn chất lượng cho gia đình hiện đại,\ntiện lợi, an tâm và đậm đà hương vị Việt." },
  ];
  const [heroSlides, setHeroSlides] = useState<HeroSlideContent[]>(() => {
    if (typeof window === "undefined") return defaultHeroSlides;
    try { return JSON.parse(localStorage.getItem(heroContentKey) || "null") || defaultHeroSlides; } catch { return defaultHeroSlides; }
  });
  const [heroEditing, setHeroEditing] = useState<number | null>(null);
  const [memberOffer, setMemberOffer] = useState<MemberOfferContent>(() => {
    if (typeof window === "undefined") return defaultMemberOffer;
    try { return { ...defaultMemberOffer, ...JSON.parse(localStorage.getItem(memberOfferKey) || "null") }; } catch { return defaultMemberOffer; }
  });
  const [memberOfferEditing, setMemberOfferEditing] = useState(false);

  function save(next: ContentItem[]) { setItems(next); localStorage.setItem(contentKey, JSON.stringify(next)); }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: ContentItem = { id: editing?.id || Date.now(), type: String(data.get("type")) as ContentItem["type"], title: String(data.get("title")), description: String(data.get("description")), image: editing?.image || "/images/banner1.jpg", category: String(data.get("category") || ""), date: String(data.get("date") || "") };
    save(editing ? items.map(item => item.id === editing.id ? next : item) : [...items, next]);
    addAdminNotification(editing ? `Cập nhật nội dung "${next.title}"` : `Thêm nội dung mới "${next.title}"`, "content", undefined, "content");
    setEditing(null);
    showNotice(editing ? "Đã cập nhật nội dung" : "Đã thêm nội dung");
  }
  function uploadImage(event: ChangeEvent<HTMLInputElement>) { const file = event.target.files?.[0]; if (!file || !file.type.startsWith("image/")) return; const reader = new FileReader(); reader.onload = () => setEditing(current => current ? { ...current, image: String(reader.result) } : current); reader.readAsDataURL(file); }
  function uploadHeroImage(event: ChangeEvent<HTMLInputElement>, field: "background" | "product") { const file = event.target.files?.[0]; if (!file || !file.type.startsWith("image/") || heroEditing === null) return; const reader = new FileReader(); reader.onload = () => { const value = String(reader.result); setHeroSlides(current => current.map((slide, index) => index === heroEditing ? { ...slide, [field]: value } : slide)); const input = document.querySelector<HTMLInputElement>(`#hero-form [name="${field}"]`); if (input) input.value = value; }; reader.readAsDataURL(file); }
  function saveHeroSlides(next: HeroSlideContent[]) { setHeroSlides(next); localStorage.setItem(heroContentKey, JSON.stringify(next)); window.dispatchEvent(new Event("gao-ngon-content-updated")); }
  function submitHero(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (heroEditing === null) return; const data = new FormData(event.currentTarget); const next = heroSlides.map((slide, index) => index === heroEditing ? { background: String(data.get("background") || ""), product: String(data.get("product") || ""), eyebrow: String(data.get("eyebrow") || ""), title: String(data.get("title") || ""), script: String(data.get("script") || ""), description: String(data.get("description") || "") } : slide); saveHeroSlides(next); addAdminNotification(`Cập nhật slide trang chủ #${heroEditing + 1}`, "content", undefined, "content"); setHeroEditing(null); showNotice("Đã cập nhật slide trang chủ"); }
  function submitMemberOffer(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const data = new FormData(event.currentTarget); const next: MemberOfferContent = { title: String(data.get("title") || ""), label: String(data.get("label") || ""), discount: String(data.get("discount") || ""), condition: String(data.get("condition") || ""), button: String(data.get("button") || ""), href: String(data.get("href") || "/user") }; setMemberOffer(next); localStorage.setItem(memberOfferKey, JSON.stringify(next)); window.dispatchEvent(new Event("gao-ngon-member-offer-updated")); addAdminNotification("Cập nhật nội dung ưu đãi hội viên", "content", undefined, "content"); setMemberOfferEditing(false); showNotice("Đã cập nhật ưu đãi hội viên"); }

  return <div className="admin-content-manager">
    <div className="admin-hero-card content-hero">
      <div>
        <span className="admin-kicker">NỘI DUNG WEBSITE</span>
        <h2>Quản lý nội dung</h2>
        <p>Chỉnh sửa banner trang chủ, thông tin Về chúng tôi và bài viết tin tức.</p>
      </div>
      <button className="admin-primary" onClick={() => setEditing({ id: 0, type: "banner", title: "", description: "", image: "" })}>+ Thêm nội dung</button>
    </div>
    <section className="admin-panel admin-content-group"><span className="admin-kicker">TRANG CHỦ / ƯU ĐÃI HỘI VIÊN</span><h2>{memberOffer.title}</h2><article className="admin-content-card"><div><strong>{memberOffer.label} {memberOffer.discount}</strong><p>{memberOffer.condition}</p><small>Nút: {memberOffer.button} · Link: {memberOffer.href}</small></div><div className="admin-row-actions"><button title="Sửa ưu đãi hội viên" aria-label="Sửa ưu đãi hội viên" onClick={() => setMemberOfferEditing(true)}><Pencil /></button></div></article></section>
    <section className="admin-panel admin-content-group"><span className="admin-kicker">TRANG CHỦ / SLIDER HERO</span><h2>3 ảnh hero trang chủ</h2><div className="admin-content-tabs">{heroSlides.map((slide, index) => <article className="admin-content-card" key={`hero-${index}`}><img src={slide.background} alt={`Slide ${index + 1}`} /><div><strong>{slide.eyebrow}</strong><p>{slide.title.replace(/\n/g, " ")} · {slide.script}</p><small>Ảnh nền và ảnh sản phẩm có thể chỉnh sửa</small></div><div className="admin-row-actions"><button title="Sửa slide" aria-label={`Sửa slide ${index + 1}`} onClick={() => setHeroEditing(index)}><Pencil /></button></div></article>)}</div></section>
    <div className="admin-content-tabs">{(["banner", "about", "news"] as ContentItem["type"][]).map(type => <div className="admin-panel admin-content-group" key={type}><span className="admin-kicker">{type === "banner" ? "TRANG CHỦ / BANNER" : type === "about" ? "VỀ CHÚNG TÔI" : "TIN TỨC"}</span><h2>{type === "banner" ? "Banner & nội dung banner" : type === "about" ? "Nội dung giới thiệu" : "Bài viết tin tức"}</h2>{items.filter(item => item.type === type).map(item => <article className="admin-content-card" key={item.id}><img src={item.image} alt="" /><div><strong>{item.title}</strong><p>{item.description}</p>{item.category && <small>{item.category} · {item.date}</small>}</div><div className="admin-row-actions"><button title="Xem chi tiết" aria-label="Xem chi tiết" onClick={() => setDetail(item)}><Target /></button><button title="Sửa" aria-label="Sửa" onClick={() => setEditing(item)}><Pencil /></button><button className="danger" title="Xóa" aria-label="Xóa" onClick={() => setConfirmDelete(item)}><X /></button></div></article>)}</div>)}</div>

    <AdminModal open={!!detail} onClose={() => setDetail(null)} title={detail ? `Chi tiết ${detail.title}` : "Chi tiết nội dung"} subtitle="Thông tin chi tiết nội dung" size="md" footer={<><button className="vg-btn" type="button" onClick={() => setDetail(null)}>Đóng</button></>}>
      {detail && (
        <div className="vg-form-grid">
          <div className="vg-field"><span className="vg-field-label">Loại</span><input className="vg-input" value={detail.type === "banner" ? "Banner" : detail.type === "about" ? "Về chúng tôi" : "Tin tức"} readOnly /></div>
          <div className="vg-field"><span className="vg-field-label">Tiêu đề</span><input className="vg-input" value={detail.title} readOnly /></div>
          <div className="vg-field"><span className="vg-field-label">Danh mục</span><input className="vg-input" value={detail.category || "Không có"} readOnly /></div>
          <div className="vg-field"><span className="vg-field-label">Ngày đăng</span><input className="vg-input" value={detail.date || "Chưa cập nhật"} readOnly /></div>
          <div className="vg-field vg-full"><span className="vg-field-label">Mô tả</span><textarea className="vg-textarea" value={detail.description} readOnly /></div>
          <div className="vg-field vg-full"><span className="vg-field-label">Hình ảnh</span><div className="vg-upload-preview" style={{ minHeight: 180 }}><img src={detail.image || "/images/banner1.jpg"} alt={detail.title} /></div></div>
        </div>
      )}
    </AdminModal>

    <AdminModal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Chỉnh sửa nội dung" : "Thêm nội dung"} subtitle="Quản lý banner, giới thiệu và tin tức" size="md" footer={<><button className="vg-btn" type="button" onClick={() => setEditing(null)}>Hủy</button><button className="vg-btn vg-btn-primary" type="submit" form="content-form">Lưu nội dung</button></>}>
      <form id="content-form" onSubmit={submit}>
        <div className="vg-form-grid">
          <div className="vg-field"><span className="vg-field-label">Loại nội dung</span><select className="vg-select" name="type" defaultValue={editing?.type}><option value="banner">Banner</option><option value="about">Về chúng tôi</option><option value="news">Tin tức</option></select></div>
          <div className="vg-field"><span className="vg-field-label">Tiêu đề <span className="vg-required">*</span></span><input className="vg-input" name="title" defaultValue={editing?.title} required /></div>
          <div className="vg-field vg-full"><span className="vg-field-label">Mô tả / nội dung <span className="vg-required">*</span></span><textarea className="vg-textarea" name="description" defaultValue={editing?.description} required /></div>
          <div className="vg-field"><span className="vg-field-label">Danh mục</span><input className="vg-input" name="category" defaultValue={editing?.category} placeholder="Mẹo nhà bếp" /></div>
          <div className="vg-field"><span className="vg-field-label">Ngày đăng</span><input className="vg-input" name="date" defaultValue={editing?.date} placeholder="29 Tháng 8, 2026" /></div>
          <div className="vg-field vg-full"><span className="vg-field-label">Hình ảnh</span><div className="vg-upload-zone"><div className="vg-upload-bar"><label className="vg-upload-btn">⇪ Upload ảnh<input type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadImage} /></label><div className="vg-upload-url"><input value={editing?.image || ""} onChange={(e) => setEditing(cur => cur ? { ...cur, image: e.target.value.trim() } : cur)} placeholder="Nhập URL ảnh..." /></div></div><div className="vg-upload-preview">{editing?.image ? <img src={editing.image} alt="Xem trước" /> : <div className="vg-upload-empty"><span className="vg-upload-empty-icon">⊕</span><strong>Kéo thả hoặc click để chọn ảnh</strong><small>JPG, PNG, WEBP - Tối đa 5MB</small></div>}</div></div></div>
        </div>
      </form>
    </AdminModal>
    <AdminModal open={heroEditing !== null} onClose={() => setHeroEditing(null)} title="Chỉnh sửa slide hero" subtitle="Thay ảnh và nội dung hiển thị trên trang chủ" size="lg" footer={<><button className="vg-btn" type="button" onClick={() => setHeroEditing(null)}>Hủy</button><button className="vg-btn vg-btn-primary" type="submit" form="hero-form">Lưu slide</button></>}>
      {heroEditing !== null && <form id="hero-form" onSubmit={submitHero}><div className="vg-form-grid"><div className="vg-field"><span className="vg-field-label">Nhãn nhỏ</span><input className="vg-input" name="eyebrow" defaultValue={heroSlides[heroEditing].eyebrow} /></div><div className="vg-field"><span className="vg-field-label">Câu slogan</span><input className="vg-input" name="script" defaultValue={heroSlides[heroEditing].script} /></div><div className="vg-field vg-full"><span className="vg-field-label">Tiêu đề</span><textarea className="vg-textarea" name="title" defaultValue={heroSlides[heroEditing].title} required /></div><div className="vg-field vg-full"><span className="vg-field-label">Mô tả</span><textarea className="vg-textarea" name="description" defaultValue={heroSlides[heroEditing].description} required /></div><div className="vg-field"><span className="vg-field-label">URL ảnh nền</span><input className="vg-input" name="background" defaultValue={heroSlides[heroEditing].background} required /><label className="vg-upload-btn">⇪ Upload ảnh nền<input type="file" accept="image/png,image/jpeg,image/webp" onChange={event => uploadHeroImage(event, "background")} /></label></div><div className="vg-field"><span className="vg-field-label">URL ảnh sản phẩm</span><input className="vg-input" name="product" defaultValue={heroSlides[heroEditing].product} /><label className="vg-upload-btn">⇪ Upload ảnh sản phẩm<input type="file" accept="image/png,image/jpeg,image/webp" onChange={event => uploadHeroImage(event, "product")} /></label></div></div></form>}
    </AdminModal>
    <AdminModal open={memberOfferEditing} onClose={() => setMemberOfferEditing(false)} title="Chỉnh sửa ưu đãi hội viên" subtitle="Nội dung hiển thị trong khối ưu đãi trang chủ" size="md" footer={<><button className="vg-btn" type="button" onClick={() => setMemberOfferEditing(false)}>Hủy</button><button className="vg-btn vg-btn-primary" type="submit" form="member-offer-form">Lưu ưu đãi</button></>}>
      <form id="member-offer-form" onSubmit={submitMemberOffer}><div className="vg-form-grid"><div className="vg-field vg-full"><span className="vg-field-label">Tiêu đề</span><input className="vg-input" name="title" defaultValue={memberOffer.title} required /></div><div className="vg-field"><span className="vg-field-label">Nhãn ưu đãi</span><input className="vg-input" name="label" defaultValue={memberOffer.label} required /></div><div className="vg-field"><span className="vg-field-label">Mức giảm</span><input className="vg-input" name="discount" defaultValue={memberOffer.discount} required /></div><div className="vg-field vg-full"><span className="vg-field-label">Điều kiện</span><input className="vg-input" name="condition" defaultValue={memberOffer.condition} required /></div><div className="vg-field"><span className="vg-field-label">Tên nút</span><input className="vg-input" name="button" defaultValue={memberOffer.button} required /></div><div className="vg-field"><span className="vg-field-label">Đường dẫn khi bấm</span><input className="vg-input" name="href" defaultValue={memberOffer.href} placeholder="/user" required /></div></div></form>
    </AdminModal>
    <ConfirmModal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => { if (confirmDelete) { save(items.filter(entry => entry.id !== confirmDelete.id)); addAdminNotification(`Đã xóa nội dung "${confirmDelete.title}"`, "content", undefined, "content"); showNotice("Đã xóa nội dung"); } setConfirmDelete(null); }} title={`Xóa "${confirmDelete?.title}"?`} message="Nội dung sẽ bị xóa và không thể hoàn tác." />
  </div>;
}
