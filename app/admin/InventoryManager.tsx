"use client";

import { FormEvent, useEffect, useState } from "react";
const Target = () => <span>👁️</span>;
const Pencil = () => <span>✏️</span>;
const Trash2 = () => <span>🗑️</span>;
import { Product } from "../san-pham/data";
import { FinanceTransaction } from "./FinanceManager";
import AdminModal from "./components/AdminModal";
import ConfirmModal from "./components/ConfirmModal";
import { addAdminNotification } from "../lib/notifications";

export type InventoryRecord = {
  id: string;
  type: "import" | "export";
  productId: number;
  quantity: number;
  purchasePrice: number;
  salePrice: number;
  date: string;
  partner: string;
  warehouse: string;
  batch: string;
  reference?: string;
  status: "completed" | "pending";
  note: string;
  fundingSource?: "revenue" | "capital";
};

const money = (value: number) => `${value.toLocaleString("vi-VN")}đ`;
const inputMoney = (value: string | number) => Number(value || 0) * 1000;
const recordDate = (value: string) => new Date(`${value}T12:00:00`).getTime();
const createBatchCode = () => `LOT-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;
const createInventoryCode = (productName: string) => {
  const productCode = productName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/\bGAO\b/g, "")
    .replace(/[^A-Z0-9]/g, "") || "SP";
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");
  return `${productCode}-${timestamp}`;
};

export default function InventoryManager({ products, records, transactions, saveRecords, saveProducts, saveTransactions, showNotice }: { products: Product[]; records: InventoryRecord[]; transactions: FinanceTransaction[]; saveRecords: (next: InventoryRecord[]) => void; saveProducts: (next: Product[]) => void; saveTransactions: (next: FinanceTransaction[]) => void; showNotice: (text: string, tone?: "success" | "info" | "warning" | "error") => void }) {
  const [editing, setEditing] = useState<InventoryRecord | null>(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const [productEditing, setProductEditing] = useState<Product | null>(null);
  const [detail, setDetail] = useState<InventoryRecord | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<InventoryRecord | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [typeFilter, setTypeFilter] = useState<"all" | InventoryRecord["type"]>("all");
  const [recordCategoryFilter, setRecordCategoryFilter] = useState("all");
  const [recordWarehouseFilter, setRecordWarehouseFilter] = useState("all");
  const [recordStatusFilter, setRecordStatusFilter] = useState<"all" | InventoryRecord["status"]>("all");
  const [recordPeriod, setRecordPeriod] = useState<"day" | "month" | "year">("month");
  const [recordDateFilter, setRecordDateFilter] = useState(new Date().toISOString().slice(0, 10));
  const [recordMonthFilter, setRecordMonthFilter] = useState(new Date().toISOString().slice(0, 7));
  const [recordYearFilter, setRecordYearFilter] = useState(String(new Date().getFullYear()));
  const [query, setQuery] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [summaryPeriod, setSummaryPeriod] = useState<"day" | "month" | "year">("month");
  const [productQuery, setProductQuery] = useState("");
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const [productListCompact, setProductListCompact] = useState(false);
  const [productImagePreview, setProductImagePreview] = useState<string>("");
  const [productImageUrl, setProductImageUrl] = useState("");
  const [productImageSource, setProductImageSource] = useState<"upload" | "url">("upload");

  useEffect(() => {
    const existingImage = productEditing?.image || "";
    const isDataUrl = existingImage.startsWith("data:image/");
    setProductImagePreview(isDataUrl ? existingImage : "");
    setProductImageUrl(isDataUrl ? "" : existingImage);
    setProductImageSource(isDataUrl || !existingImage ? "upload" : "url");
  }, [productEditing]);

  const getProduct = (productId: number) => products.find(product => product.id === productId);
  const getEffectiveStock = (product: Product) => Number(product.stock ?? Math.max(20, 320 - product.id * 15));
  const totalStock = products.reduce((sum, product) => sum + getEffectiveStock(product), 0);
  const lowStock = products.filter(product => getEffectiveStock(product) <= (product.minStock ?? 20)).length;
  const estimatedInventoryValue = products.reduce((sum, product) => {
    const weightInKg = Number.parseFloat(product.weight || "1") || 1;
    return sum + getEffectiveStock(product) * (product.price / weightInKg);
  }, 0);
  const now = new Date();
  const summaryRecords = records.filter(record => {
    const date = new Date(`${record.date}T12:00:00`);
    if (summaryPeriod === "day") return date.toDateString() === now.toDateString();
    if (summaryPeriod === "year") return date.getFullYear() === now.getFullYear();
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  });
  const summaryImported = summaryRecords.filter(record => record.type === "import").reduce((sum, record) => sum + record.quantity, 0);
  const summaryExported = summaryRecords.filter(record => record.type === "export").reduce((sum, record) => sum + record.quantity, 0);
  const filtered = records.filter(record => {
    const recordDateValue = record.date.slice(0, 10);
    const matchesPeriod = recordPeriod === "day" ? recordDateValue === recordDateFilter : recordPeriod === "month" ? recordDateValue.slice(0, 7) === recordMonthFilter : recordDateValue.slice(0, 4) === recordYearFilter;
    if (!matchesPeriod) return false;
    const product = getProduct(record.productId);
    if (typeFilter !== "all" && record.type !== typeFilter) return false;
    if (recordCategoryFilter !== "all" && product?.category !== recordCategoryFilter) return false;
    if (recordWarehouseFilter !== "all" && record.warehouse !== recordWarehouseFilter) return false;
    if (recordStatusFilter !== "all" && record.status !== recordStatusFilter) return false;
    const text = `${record.id} ${record.partner} ${record.batch} ${product?.name || ""}`.toLowerCase();
    return !query.trim() || text.includes(query.toLowerCase());
  }).sort((first, second) => recordDate(second.date) - recordDate(first.date));
  const filteredImported = filtered.filter(record => record.type === "import").reduce((sum, record) => sum + record.quantity, 0);
  const filteredExported = filtered.filter(record => record.type === "export").reduce((sum, record) => sum + record.quantity, 0);
  const inventoryProducts = products.filter(product => {
    const text = `${product.name} ${product.category}`.toLowerCase();
    if (productFilter.trim() && !text.includes(productFilter.toLowerCase())) return false;
    return categoryFilter === "all" || product.category === categoryFilter;
  });
  const inventoryCategories = Array.from(new Set(products.map(product => product.category)));

  function changeStock(productId: number, amount: number) {
    saveProducts(products.map(product => product.id === productId ? { ...product, stock: Math.max(0, getEffectiveStock(product) + amount) } : product));
  }

  function uploadProductImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProductImageSource("upload");
      setProductImagePreview(String(reader.result));
      setProductImageUrl("");
    };
    reader.readAsDataURL(file);
  }

  function recordImpact(record: InventoryRecord) { return record.type === "import" ? record.quantity : -record.quantity; }

  function submitProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("productName") || "").trim();
    const category = String(data.get("productCategory") || "").trim();
    const unit = String(data.get("productUnit") || "kg") as Product["unit"];
    const pricePerUnit = Number(data.get("productPrice") || 0);
    const minStockValue = String(data.get("productMinStock") || "").trim();
    const minStock = Number(minStockValue);
    const weight = String(data.get("productWeight") || productEditing?.weight || "5kg");
    const image = productImagePreview || productImageUrl || productEditing?.image || "/images/st25.png.jpg";
    if (!name || !category || pricePerUnit <= 0 || !minStockValue || !Number.isFinite(minStock) || minStock < 0) {
      showNotice("Vui lòng nhập tên, danh mục, giá bán và tồn tối thiểu hợp lệ.", "error");
      return;
    }
    if (products.some(product => product.id !== productEditing?.id && product.name.toLowerCase() === name.toLowerCase())) {
      showNotice("Tên sản phẩm đã tồn tại.", "error");
      return;
    }
    const product: Product = {
      ...(productEditing || {}),
      id: productEditing?.id || Date.now(),
      name,
      category,
      price: pricePerUnit * 1000,
      image,
      note: String(data.get("productNote") || "").trim(),
      reviews: productEditing?.reviews ?? 0,
      rating: productEditing?.rating ?? 5,
      weight,
      unit,
      stock: productEditing?.stock ?? 0,
      minStock,
      sold: Number(data.get("productSold") || (productEditing?.sold ?? 0)),
      badge: String(data.get("productBadge") || productEditing?.badge || ""),
      origin: String(data.get("productOrigin") || productEditing?.origin || ""),
      storage: String(data.get("productStorage") || productEditing?.storage || ""),
      standard: String(data.get("productStandard") || productEditing?.standard || ""),
      tags: String(data.get("productTags") || productEditing?.tags || ""),
    };
    saveProducts(productEditing ? products.map(item => item.id === productEditing.id ? product : item) : [...products, product]);
    setAddingProduct(false);
    setProductEditing(null);
    setProductImagePreview("");
    setProductImageUrl("");
    showNotice(productEditing ? "Đã cập nhật sản phẩm kho." : "Đã thêm sản phẩm mới vào kho.", "success");
  }

  function syncInventoryFinance(record: InventoryRecord, previousId?: string) {
    const linkedReferences = new Set([
      `INVENTORY:${record.id}`,
      `CAPITAL:INVENTORY:${record.id}`,
      ...(previousId ? [`INVENTORY:${previousId}`, `CAPITAL:INVENTORY:${previousId}`] : []),
    ]);
    const withoutLinked = transactions.filter(transaction => !linkedReferences.has(transaction.reference));
    if (record.status !== "completed") {
      saveTransactions(withoutLinked);
      return;
    }

    const amount = (record.type === "import" ? record.purchasePrice : record.salePrice) * record.quantity;
    if (amount <= 0) {
      saveTransactions(withoutLinked);
      return;
    }

    if (record.type === "export") {
      const income: FinanceTransaction = {
        id: `FIN-${record.id}`,
        type: "income",
        amount,
        date: record.date,
        category: "Bán hàng",
        method: "Tiền mặt",
        source: "Doanh thu",
        status: "completed",
        contact: record.partner,
        reference: `INVENTORY:${record.id}`,
        note: `Doanh thu xuất kho ${record.id}`,
      };
      saveTransactions([...withoutLinked, income]);
      return;
    }

    const source = record.fundingSource === "capital" ? "Vốn tự bỏ ra" : "Doanh thu";
    const expense: FinanceTransaction = {
      id: `FIN-${record.id}`,
      type: "expense",
      amount,
      date: record.date,
      category: "Nhập hàng",
      method: source,
      source,
      status: "completed",
      contact: record.partner,
      reference: `INVENTORY:${record.id}`,
      note: `Chi phí nhập kho ${record.id} - ${source}`,
    };
    saveTransactions([...withoutLinked, expense]);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const selectedProduct = products.find(product => product.name === String(data.get("productName")));
    if (!selectedProduct) {
      showNotice("Vui lòng chọn sản phẩm hợp lệ trong phiếu kho.", "error");
      return;
    }
    const quantity = Number(data.get("quantity") || 0);
    if (quantity <= 0) {
      showNotice("Số lượng phiếu kho phải lớn hơn 0.", "error");
      return;
    }
    const next: InventoryRecord = {
      id: editing?.id || createInventoryCode(selectedProduct.name),
      type: String(data.get("type")) as InventoryRecord["type"],
      productId: selectedProduct.id,
      quantity,
      purchasePrice: String(data.get("type")) === "import"
        ? inputMoney(String(data.get("purchasePrice") || 0)) / quantity
        : editing?.purchasePrice || 0,
      salePrice: selectedProduct.price,
      date: String(data.get("date")),
      partner: String(data.get("partner") || "").trim(),
      warehouse: String(data.get("warehouse") || "Kho chính").trim(),
      batch: String(data.get("batch") || "").trim(),
      status: String(data.get("status")) as InventoryRecord["status"],
      note: String(data.get("note") || "").trim(),
      fundingSource: String(data.get("fundingSource") || "revenue") as InventoryRecord["fundingSource"],
    };
    if (next.type === "export" && getEffectiveStock(selectedProduct) < quantity) {
      showNotice(`Sản phẩm "${selectedProduct.name}" không đủ số lượng tồn kho để xuất ${quantity}.`, "error");
      return;
    }
    let nextProducts = products;
    if (editing?.status === "completed") {
      nextProducts = nextProducts.map(product => product.id === editing.productId ? { ...product, stock: Math.max(0, getEffectiveStock(product) - recordImpact(editing)) } : product);
    }
    if (next.status === "completed") {
      nextProducts = nextProducts.map(product => product.id === next.productId ? { ...product, stock: Math.max(0, getEffectiveStock(product) + recordImpact(next)) } : product);
    }
    if (nextProducts !== products) saveProducts(nextProducts);
    saveRecords(editing?.id ? records.map(record => record.id === editing.id ? next : record) : [next, ...records]);
    syncInventoryFinance(next, editing?.id);
    const itemProductName = products.find(p => p.id === next.productId)?.name || "sản phẩm";
    addAdminNotification(
      editing?.id
        ? `Cập nhật phiếu ${next.type === "import" ? "nhập kho" : "xuất kho"} #${next.id}`
        : `Tạo phiếu ${next.type === "import" ? "nhập kho" : "xuất kho"} mới #${next.id} (${itemProductName})`,
      "inventory",
      undefined,
      "inventory"
    );
    showNotice(next.type === "export" ? "Đã ghi nhận phiếu xuất kho." : "Đã ghi nhận phiếu nhập kho.", "success");
    setEditing(null);
  }

  function removeRecord(record: InventoryRecord) {
    if (record.status === "completed") changeStock(record.productId, -recordImpact(record));
    saveRecords(records.filter(item => item.id !== record.id));
    saveTransactions(transactions.filter(transaction => transaction.reference !== `INVENTORY:${record.id}` && transaction.reference !== `CAPITAL:INVENTORY:${record.id}`));
    addAdminNotification(`Đã xóa phiếu kho #${record.id}`, "inventory", undefined, "inventory");
    setConfirmDelete(null);
  }

  function removeProduct(product: Product) {
    saveProducts(products.filter(item => item.id !== product.id));
    setProductToDelete(null);
  }

  function editProductStock(product: Product) {
    setProductEditing(product);
  }

  const blank: InventoryRecord = { id: "", type: "import", productId: products[0]?.id || 0, quantity: 0, purchasePrice: 0, salePrice: 0, date: new Date().toISOString().slice(0, 10), partner: "", warehouse: "Kho chính", batch: createBatchCode(), status: "completed", note: "", fundingSource: "revenue" };

  return <>
    <div className="admin-inventory-heading"><div><span className="admin-kicker">QUẢN LÝ KHO</span><h2>Quản lý kho</h2><p>Theo dõi tồn kho, phiếu nhập xuất và giá hàng hóa.</p></div><div className="inventory-heading-actions"><button className="admin-primary" onClick={() => { setProductEditing(null); setAddingProduct(true); }}>＋ Thêm sản phẩm</button><button className="admin-primary" onClick={() => { setProductQuery(products[0]?.name || ""); setEditing(blank); }}>＋ Thêm phiếu kho</button></div></div>
    <div className="admin-stats admin-inventory-stats">
      <div className="admin-stat"><span className="admin-stat-icon">▤</span><div><span>LOẠI SẢN PHẨM</span><strong>{products.length.toLocaleString("vi-VN")}</strong><small>Sản phẩm đang quản lý</small></div></div>
      <div className="admin-stat"><span className="admin-stat-icon">▥</span><div><span>TỔNG TỒN KHO (KG)</span><strong>{totalStock.toLocaleString("vi-VN")}</strong><small>Tổng số lượng hiện có</small></div></div>
      <div className="admin-stat"><span className="admin-stat-icon">!</span><div><span>SẮP HẾT HÀNG</span><strong className={lowStock ? "finance-negative" : "finance-profit"}>{lowStock}</strong><small>Theo tồn tối thiểu từng sản phẩm</small></div></div>
      <div className="admin-stat"><span className="admin-stat-icon">₫</span><div><span>GIÁ TRỊ TỒN KHO (ƯỚC TÍNH)</span><strong>{Math.round(estimatedInventoryValue).toLocaleString("vi-VN")}đ</strong><small>Tính theo giá bán / kg</small></div></div>
    </div>
    <section className="admin-panel inventory-summary"><div className="inventory-summary-title"><div><span className="admin-kicker">TỔNG HỢP NHẬP XUẤT THEO KỲ</span><h3>{recordPeriod === "day" ? `Ngày ${recordDateFilter}` : recordPeriod === "month" ? `Tháng ${recordMonthFilter}` : `Năm ${recordYearFilter}`}</h3></div><div className="inventory-period-controls"><select value={recordPeriod} onChange={event => setRecordPeriod(event.target.value as typeof recordPeriod)} aria-label="Chọn thời gian tổng hợp"><option value="day">Theo ngày</option><option value="month">Theo tháng</option><option value="year">Theo năm</option></select>{recordPeriod === "day" && <input type="date" value={recordDateFilter} onChange={event => setRecordDateFilter(event.target.value)} aria-label="Chọn ngày tổng hợp" />}{recordPeriod === "month" && <input type="month" value={recordMonthFilter} onChange={event => setRecordMonthFilter(event.target.value)} aria-label="Chọn tháng tổng hợp" />}{recordPeriod === "year" && <input type="number" min="2000" max="2100" value={recordYearFilter} onChange={event => setRecordYearFilter(event.target.value)} aria-label="Chọn năm tổng hợp" />}</div></div><div className="inventory-summary-values"><div><small>ĐÃ NHẬP TRONG KỲ</small><strong className="finance-income">{filteredImported.toLocaleString("vi-VN")}</strong><span>{filtered.filter(record => record.type === "import").length} phiếu</span></div><div><small>ĐÃ XUẤT TRONG KỲ</small><strong className="finance-expense">{filteredExported.toLocaleString("vi-VN")}</strong><span>{filtered.filter(record => record.type === "export").length} phiếu</span></div><div><small>CHÊNH LỆCH TỒN</small><strong className={filteredImported - filteredExported < 0 ? "finance-negative" : "finance-profit"}>{(filteredImported - filteredExported).toLocaleString("vi-VN")}</strong><span>Nhập trừ xuất</span></div></div></section>
    <section className={`admin-panel admin-inventory-products ${productListCompact ? "inventory-products-compact" : ""}`}><div className="admin-table-head"><div><strong>Danh sách sản phẩm & tồn kho</strong><span>{inventoryProducts.length} sản phẩm</span></div><div className="inventory-product-controls"><div className="inventory-product-filters"><div className="admin-search"><span>⌕</span><input value={productFilter} onChange={event => setProductFilter(event.target.value)} placeholder="Lọc sản phẩm..." /></div><select value={categoryFilter} onChange={event => setCategoryFilter(event.target.value)} aria-label="Lọc danh mục"><option value="all">Tất cả danh mục</option>{inventoryCategories.map(category => <option key={category}>{category}</option>)}</select></div><button className="inventory-collapse-button" type="button" onClick={() => setProductListCompact(value => !value)}>{productListCompact ? "▣ Mở rộng" : "− Thu gọn"}</button></div></div><div className="inventory-product-grid"><div className="inventory-product-list-head"><span>SẢN PHẨM</span><span>ĐƠN VỊ</span><span>TỒN KHO</span><span>TỒN TỐI THIỂU</span><span>GIÁ NHẬP GẦN NHẤT</span><span>GIÁ BÁN</span><span>GHI CHÚ</span><span>THAO TÁC</span></div>{inventoryProducts.map(product => { const latestImport = records.find(record => record.productId === product.id && record.type === "import" && record.purchasePrice); const minStock = product.minStock ?? 20; const stock = getEffectiveStock(product); return <div className="inventory-product-card" key={product.id}><div><strong>{product.name}</strong><small>{product.category}</small></div><span>{product.unit || "kg"}</span><b className={stock <= minStock ? "finance-negative" : "finance-profit"}>{stock.toLocaleString("vi-VN")} {product.unit || "kg"}</b><span>{minStock.toLocaleString("vi-VN")} {product.unit || "kg"}</span><span>{latestImport ? `${money(latestImport.purchasePrice)}/kg` : "—"}</span><strong>{money(Math.round(product.price / (Number.parseFloat(product.weight) || 1)))}/kg</strong><span>{product.note || "—"}</span><div className="inventory-product-actions"><button className="inventory-product-edit" type="button" title={`Sửa ${product.name}`} aria-label={`Sửa ${product.name}`} onClick={() => editProductStock(product)}><Pencil /></button><button className="inventory-product-delete" type="button" title={`Xóa ${product.name}`} aria-label={`Xóa ${product.name}`} onClick={() => setProductToDelete(product)}><Trash2 /></button></div></div>; })}</div>{!inventoryProducts.length && <div className="admin-empty">Không tìm thấy sản phẩm phù hợp.</div>}</section>
    <section className="admin-panel admin-inventory-table"><div className="admin-table-head"><div><strong>Sổ nhập xuất ({filtered.length})</strong><span>Phiếu kho và thông tin đối soát</span></div></div><div className="admin-product-filters inventory-filters"><div className="admin-search">⌕<input value={query} onChange={event => setQuery(event.target.value)} placeholder="Tìm mã phiếu, sản phẩm, đối tác..." /></div><select value={typeFilter} onChange={event => setTypeFilter(event.target.value as typeof typeFilter)} aria-label="Lọc loại phiếu"><option value="all">Nhập và xuất</option><option value="import">Chỉ phiếu nhập</option><option value="export">Chỉ phiếu xuất</option></select><select value={recordCategoryFilter} onChange={event => setRecordCategoryFilter(event.target.value)} aria-label="Lọc danh mục"><option value="all">Tất cả danh mục</option>{inventoryCategories.map(category => <option key={category}>{category}</option>)}</select><select value={recordWarehouseFilter} onChange={event => setRecordWarehouseFilter(event.target.value)} aria-label="Lọc kho"><option value="all">Tất cả kho</option>{Array.from(new Set(records.map(record => record.warehouse).filter(Boolean))).map(warehouse => <option key={warehouse}>{warehouse}</option>)}</select><select value={recordStatusFilter} onChange={event => setRecordStatusFilter(event.target.value as typeof recordStatusFilter)} aria-label="Lọc trạng thái"><option value="all">Tất cả trạng thái</option><option value="completed">Đã ghi nhận</option><option value="pending">Đang chờ</option></select></div>{filtered.length ? <div className="inventory-table"><div className="inventory-table-head"><span>MÃ PHIẾU</span><span>TÊN SẢN PHẨM</span><span>LOẠI PHIẾU</span><span>SỐ LƯỢNG</span><span>GIÁ NHẬP</span><span>GIÁ XUẤT</span><span>NGÀY NHẬP / XUẤT</span><span>THAO TÁC</span></div>{filtered.map(record => { const product = getProduct(record.productId); return <div className="inventory-row" key={record.id}><div><strong>{record.id}</strong><small>{record.partner || "Không có đối tác"}</small></div><div><strong>{product?.name || "Sản phẩm đã xóa"}</strong><small>{product?.category || "Không có danh mục"}</small></div><em className={record.type === "import" ? "finance-income" : "finance-expense"}>{record.type === "import" ? "Nhập hàng" : "Xuất hàng"}<small>{record.status === "completed" ? "Đã ghi nhận" : "Đang chờ"}</small></em><b>{record.quantity.toLocaleString("vi-VN")}</b><span>{money(record.purchasePrice)}<small>{record.batch || "Không có mã lô"}</small></span><span>{money(record.salePrice)}</span><span>{new Date(`${record.date}T12:00:00`).toLocaleDateString("vi-VN")}<small>{record.warehouse}</small></span><div className="admin-row-actions"><button title="Xem chi tiết" aria-label="Xem chi tiết" onClick={() => setDetail(record)}><Target /></button><button title="Sửa phiếu kho" aria-label="Sửa phiếu kho" onClick={() => { setProductQuery(product?.name || ""); setEditing(record); }}><Pencil /></button><button className="danger" title="Xóa phiếu kho" aria-label="Xóa phiếu kho" onClick={() => setConfirmDelete(record)}><Trash2 /></button></div></div>; })}</div> : <div className="admin-empty">Chưa có phiếu nhập xuất phù hợp.</div>}</section>

    <AdminModal open={addingProduct || !!productEditing} onClose={() => { setAddingProduct(false); setProductEditing(null); setProductImagePreview(""); setProductImageUrl(""); }} title={productEditing ? "Chỉnh sửa sản phẩm kho" : "Thêm sản phẩm vào kho"} subtitle="Cập nhật thông tin sản phẩm và tồn tối thiểu" size="md" footer={<><button className="vg-btn" type="button" onClick={() => { setAddingProduct(false); setProductEditing(null); setProductImagePreview(""); setProductImageUrl(""); }}>Hủy</button><button className="vg-btn vg-btn-primary" type="submit" form="inventory-product-form">Lưu sản phẩm</button></>}>
      <form id="inventory-product-form" onSubmit={submitProduct}><div className="vg-form-grid">
        <div className="vg-field vg-full"><span className="vg-field-label">Tên sản phẩm <span className="vg-required">*</span></span><input className="vg-input" name="productName" defaultValue={productEditing?.name} placeholder="Ví dụ: Gạo ST25 Thượng Hạng" required /></div>
        <div className="vg-field"><span className="vg-field-label">Danh mục <span className="vg-required">*</span></span><select className="vg-select" name="productCategory" defaultValue={productEditing?.category || inventoryCategories[0] || "Gạo thơm"} required>{inventoryCategories.map(category => <option key={category}>{category}</option>)}<option value="Gạo trắng">Gạo trắng</option><option value="Gạo thơm">Gạo thơm</option><option value="Gạo nếp">Gạo nếp</option><option value="Gạo lứt">Gạo lứt</option><option value="Gạo dinh dưỡng">Gạo dinh dưỡng</option><option value="Combo">Combo</option></select></div>
        <div className="vg-field"><span className="vg-field-label">Đơn vị tính <span className="vg-required">*</span></span><select className="vg-select" name="productUnit" defaultValue={productEditing?.unit || "kg"}><option value="kg">kg</option><option value="bao">bao</option><option value="thùng">thùng</option><option value="chai">chai</option></select></div>
        <div className="vg-field"><span className="vg-field-label">Giá bán / đơn vị (nghìn VND) <span className="vg-required">*</span></span><div className="vg-money-input"><input name="productPrice" type="number" min="1" step="1" defaultValue={productEditing ? productEditing.price / 1000 : ""} placeholder="32" required /><span>.000 đ / đơn vị</span></div></div>
        <div className="vg-field"><span className="vg-field-label">Khối lượng <span className="vg-required">*</span></span><select className="vg-select" name="productWeight" defaultValue={productEditing?.weight || "5kg"}><option value="2kg">2kg</option><option value="5kg">5kg</option><option value="10kg">10kg</option><option value="20kg">20kg</option><option value="25kg">25kg</option></select></div>
        <div className="vg-field"><span className="vg-field-label">Tồn tối thiểu <span className="vg-required">*</span></span><input className="vg-input" name="productMinStock" type="number" min="0" defaultValue={productEditing?.minStock ?? ""} placeholder="Ví dụ: 20" required /></div>
        <div className="vg-field"><span className="vg-field-label">Xuất xứ</span><input className="vg-input" name="productOrigin" defaultValue={productEditing?.origin || ""} /></div>
        <div className="vg-field"><span className="vg-field-label">Bảo quản</span><input className="vg-input" name="productStorage" defaultValue={productEditing?.storage || ""} /></div>
        <div className="vg-field"><span className="vg-field-label">Tiêu chuẩn</span><input className="vg-input" name="productStandard" defaultValue={productEditing?.standard || ""} /></div>
        <div className="vg-field"><span className="vg-field-label">Đã bán</span><input className="vg-input" name="productSold" type="number" min="0" defaultValue={productEditing?.sold ?? 0} /></div>
        <div className="vg-field"><span className="vg-field-label">Badge</span><input className="vg-input" name="productBadge" defaultValue={productEditing?.badge || ""} /></div>
        <div className="vg-field vg-full"><span className="vg-field-label">Đặc điểm / cam kết</span><input className="vg-input" name="productTags" defaultValue={productEditing?.tags || ""} placeholder="Chính hãng, Hữu cơ, Nguồn gốc rõ ràng" /></div>
        <div className="vg-field vg-full"><span className="vg-field-label">Ảnh sản phẩm</span><div className="vg-upload-zone"><div className="vg-upload-source"><button type="button" className={productImageSource === "upload" ? "active" : ""} onClick={() => { setProductImageSource("upload"); setProductImageUrl(""); setProductImagePreview((current) => current && current.startsWith("data:image/") ? current : ""); }}>Upload ảnh</button><button type="button" className={productImageSource === "url" ? "active" : ""} onClick={() => { setProductImageSource("url"); setProductImagePreview(""); setProductImageUrl(""); }}>URL ảnh</button></div><div className="vg-upload-bar">{productImageSource === "upload" ? <label className="vg-upload-btn">⇪ Upload ảnh<input type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadProductImage} /></label> : <div className="vg-upload-url"><input value={productImageUrl} onChange={(e) => { const next = e.target.value.trim(); setProductImageSource("url"); setProductImageUrl(next); if (next) setProductImagePreview(next); }} placeholder="Hoặc nhập URL ảnh..." /></div>}</div><div className="vg-upload-preview">{productImagePreview || productEditing?.image ? <img src={productImagePreview || productEditing?.image} alt="Xem trước" /> : <div className="vg-upload-empty"><span className="vg-upload-empty-icon">⊕</span><strong>Kéo thả hoặc click để chọn ảnh</strong><small>JPG, PNG, WEBP - Tối đa 5MB</small></div>}</div></div></div>
        <div className="vg-field vg-full"><span className="vg-field-label">Mô tả</span><textarea className="vg-textarea" name="productNote" defaultValue={productEditing?.note} placeholder="Mô tả ngắn về sản phẩm..." /></div>
      </div></form>
    </AdminModal>

    <AdminModal open={!!detail} onClose={() => setDetail(null)} title={detail ? `Chi tiết ${detail.id}` : "Chi tiết phiếu kho"} subtitle="Thông tin chi tiết phiếu nhập xuất" size="md" footer={<button className="vg-btn" type="button" onClick={() => setDetail(null)}>Đóng</button>}>
      {detail && <div className="vg-form-grid">
        <div className="vg-field"><span className="vg-field-label">Mã phiếu</span><input className="vg-input" value={detail.id} readOnly /></div>
        <div className="vg-field"><span className="vg-field-label">Loại phiếu</span><input className="vg-input" value={detail.type === "import" ? "Nhập hàng" : "Xuất hàng"} readOnly /></div>
        <div className="vg-field"><span className="vg-field-label">Sản phẩm</span><input className="vg-input" value={getProduct(detail.productId)?.name || "Sản phẩm đã xóa"} readOnly /></div>
        <div className="vg-field"><span className="vg-field-label">Số lượng</span><input className="vg-input" value={detail.quantity} readOnly /></div>
        <div className="vg-field"><span className="vg-field-label">Giá nhập</span><input className="vg-input" value={money(detail.purchasePrice)} readOnly /></div>
        <div className="vg-field"><span className="vg-field-label">Giá xuất</span><input className="vg-input" value={money(detail.salePrice)} readOnly /></div>
        <div className="vg-field"><span className="vg-field-label">Ngày</span><input className="vg-input" value={detail.date} readOnly /></div>
        <div className="vg-field"><span className="vg-field-label">Đối tác</span><input className="vg-input" value={detail.partner || "Không có"} readOnly /></div>
        <div className="vg-field"><span className="vg-field-label">Kho lưu trữ</span><input className="vg-input" value={detail.warehouse || "Kho chính"} readOnly /></div>
        <div className="vg-field"><span className="vg-field-label">Mã lô</span><input className="vg-input" value={detail.batch || "Không có"} readOnly /></div>
        <div className="vg-field"><span className="vg-field-label">Trạng thái</span><input className="vg-input" value={detail.status === "completed" ? "Đã ghi nhận" : "Đang chờ"} readOnly /></div>
        <div className="vg-field"><span className="vg-field-label">Nguồn tiền</span><input className="vg-input" value={detail.fundingSource === "capital" ? "Vốn tự bỏ ra" : "Doanh thu"} readOnly /></div>
        <div className="vg-field vg-full"><span className="vg-field-label">Ghi chú</span><textarea className="vg-textarea" value={detail.note || "Không có ghi chú"} readOnly /></div>
      </div>}
    </AdminModal>
    <AdminModal open={!!editing} onClose={() => { setEditing(null); setProductMenuOpen(false); }} title={editing?.id ? "Chỉnh sửa phiếu kho" : "Thêm phiếu kho mới"} subtitle="Ghi nhận nhập hàng hoặc xuất hàng" size="lg" footer={<><button className="vg-btn" type="button" onClick={() => { setEditing(null); setProductMenuOpen(false); }}>Hủy</button><button className="vg-btn vg-btn-primary" type="submit" form="inventory-form">Lưu phiếu kho</button></>}>
      <form id="inventory-form" onSubmit={submit}><div className="vg-form-grid">
        <div className="vg-field"><span className="vg-field-label">Loại phiếu <span className="vg-required">*</span></span><select className="vg-select" name="type" defaultValue={editing?.type} required><option value="import">Nhập hàng</option><option value="export">Xuất hàng</option></select></div>
        <div className="vg-field inventory-product-picker"><span className="vg-field-label">Sản phẩm <span className="vg-required">*</span></span><input className="vg-input" name="productName" value={productQuery} onFocus={() => setProductMenuOpen(true)} onChange={event => { setProductQuery(event.target.value); setProductMenuOpen(true); }} placeholder="Gõ để tìm hoặc chọn sản phẩm" autoComplete="off" required />{productMenuOpen && <div className="inventory-product-menu">{products.filter(product => `${product.name} ${product.category} ${product.weight}`.toLowerCase().includes(productQuery.toLowerCase())).map(product => <button type="button" className="inventory-product-option" key={product.id} onClick={() => { setProductQuery(product.name); setProductMenuOpen(false); }}><strong>{product.name}</strong><small>{product.weight} · {product.category}</small></button>)}{!products.some(product => `${product.name} ${product.category} ${product.weight}`.toLowerCase().includes(productQuery.toLowerCase())) && <span className="inventory-product-empty">Không tìm thấy sản phẩm</span>}</div>}</div>
        <div className="vg-field"><span className="vg-field-label">Số lượng <span className="vg-required">*</span></span><input className="vg-input" name="quantity" type="number" min="1" defaultValue={editing?.quantity || ""} placeholder="100" required /></div>
        <div className="vg-field"><span className="vg-field-label">Ngày nhập / xuất <span className="vg-required">*</span></span><input className="vg-input" name="date" type="date" defaultValue={editing?.date || blank.date} required /></div>
        <div className="vg-field"><span className="vg-field-label">Tổng tiền nhập (nghìn VND)</span><div className="vg-money-input"><input name="purchasePrice" type="number" min="0" step="1" defaultValue={editing?.purchasePrice ? (editing.purchasePrice * (editing.quantity || 1)) / 1000 : ""} placeholder="1800" /><span>.000 VND</span></div></div>
        <div className="vg-field"><span className="vg-field-label">Nguồn tiền nhập kho <span className="vg-required">*</span></span><select className="vg-select" name="fundingSource" defaultValue={editing?.fundingSource || "revenue"}><option value="revenue">Doanh thu</option><option value="capital">Vốn tự bỏ ra</option></select></div>
        <div className="vg-field"><span className="vg-field-label">Nhà cung cấp / đối tác</span><input className="vg-input" name="partner" defaultValue={editing?.partner} placeholder="Tên nhà cung cấp hoặc khách hàng" /></div>
        <div className="vg-field"><span className="vg-field-label">Kho lưu trữ</span><input className="vg-input" name="warehouse" defaultValue={editing?.warehouse || "Kho chính"} placeholder="Kho chính" /></div>
        <div className="vg-field"><span className="vg-field-label">Mã lô / mã phiếu</span><input className="vg-input" name="batch" defaultValue={editing?.batch} placeholder="LOT-2026-001" /></div>
        <div className="vg-field"><span className="vg-field-label">Trạng thái</span><select className="vg-select" name="status" defaultValue={editing?.status}><option value="completed">Đã ghi nhận</option><option value="pending">Đang chờ</option></select></div>
        <div className="vg-field vg-full"><span className="vg-field-label">Ghi chú</span><textarea className="vg-textarea" name="note" defaultValue={editing?.note} placeholder="Thông tin vận chuyển, hạn sử dụng, lý do xuất kho..." /></div>
      </div></form>
    </AdminModal>
    <ConfirmModal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => { if (confirmDelete) removeRecord(confirmDelete); }} title={`Xóa phiếu ${confirmDelete?.id}?`} message="Phiếu kho sẽ bị xóa và số tồn liên quan được hoàn lại." />
    <ConfirmModal open={!!productToDelete} onClose={() => setProductToDelete(null)} onConfirm={() => { if (productToDelete) removeProduct(productToDelete); }} title={`Xóa sản phẩm ${productToDelete?.name}?`} message="Sản phẩm sẽ bị xóa khỏi danh sách kho. Lịch sử phiếu nhập xuất vẫn được giữ lại." />
  </>;
}
