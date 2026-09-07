"use client";

import { FormEvent, useState } from "react";
const Pencil = () => <span>✏️</span>;
const Trash2 = () => <span>🗑️</span>;
import { Product } from "../san-pham/data";
import AdminModal from "./components/AdminModal";
import ConfirmModal from "./components/ConfirmModal";
import { addAdminNotification } from "../lib/notifications";

export type Promotion = {
  id: string;
  code?: string;
  requireCode?: boolean;
  name: string;
  productId: number;
  minQuantity: number;
  benefitType: "amount" | "percent" | "gift" | "shipping";
  benefitValue: number;
  giftProductId: number;
  startDate: string;
  endDate: string;
  status: "active" | "paused";
  note: string;
};

const money = (value: number) => `${value.toLocaleString("vi-VN")}đ`;
const inputMoney = (value: string | number) => Number(value || 0) * 1000;
const benefitLabel = (promotion: Promotion, products: Product[]) => {
  if (promotion.benefitType === "amount") return `Giảm ${money(promotion.benefitValue)}`;
  if (promotion.benefitType === "percent") return `Giảm ${promotion.benefitValue}%`;
  if (promotion.benefitType === "shipping") return "Miễn phí vận chuyển";
  return `Tặng ${products.find(product => product.id === promotion.giftProductId)?.name || "sản phẩm"}`;
};

export default function PromotionManager({ products, promotions, savePromotions, showNotice }: { products: Product[]; promotions: Promotion[]; savePromotions: (next: Promotion[]) => void; showNotice: (text: string, tone?: "success" | "info" | "warning" | "error") => void }) {
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [detail, setDetail] = useState<Promotion | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Promotion | null>(null);
  const [query, setQuery] = useState("");
  const [benefitType, setBenefitType] = useState<Promotion["benefitType"]>("amount");
  const [benefitValue, setBenefitValue] = useState(0);
  const [previewProductId, setPreviewProductId] = useState(products[0]?.id || 0);
  const [previewQuantity, setPreviewQuantity] = useState(5);

  const filtered = promotions.filter(promotion => {
    const product = products.find(item => item.id === promotion.productId);
    return `${promotion.code || ""} ${promotion.name} ${product?.name || ""} ${benefitLabel(promotion, products)}`.toLowerCase().includes(query.toLowerCase());
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const minQuantity = Number(data.get("minQuantity") || 0);
    const startDate = String(data.get("startDate") || "");
    const endDate = String(data.get("endDate") || "");
    if (!name) {
      showNotice("Vui lòng nhập tên chương trình khuyến mãi.", "error");
      return;
    }
    if (minQuantity <= 0) {
      showNotice("Mức tối thiểu mua phải lớn hơn 0 kg.", "error");
      return;
    }
    if (startDate && endDate && startDate > endDate) {
      showNotice("Ngày bắt đầu không thể lớn hơn ngày kết thúc.", "error");
      return;
    }
    const benefitType = String(data.get("benefitType")) as Promotion["benefitType"];
    const benefitValue = benefitType === "shipping" || benefitType === "gift" ? 0 : benefitType === "amount" ? inputMoney(String(data.get("benefitValue") || 0)) : Number(data.get("benefitValue") || 0);
    if (benefitType === "percent" && (benefitValue < 1 || benefitValue > 100)) {
      showNotice("Phần trăm giảm phải nằm trong khoảng 1% đến 100%.", "error");
      return;
    }
    if (benefitType === "amount" && benefitValue <= 0) {
      showNotice("Số tiền giảm phải lớn hơn 0.", "error");
      return;
    }
    const next: Promotion = {
      id: editing?.id || `PROMO-${Date.now().toString().slice(-6)}`,
      code: String(data.get("code") || "").trim().toUpperCase(),
      requireCode: data.get("requireCode") === "on",
      name,
      productId: Number(data.get("productId")),
      minQuantity,
      benefitType,
      benefitValue,
      giftProductId: Number(data.get("giftProductId") || 0),
      startDate,
      endDate,
      status: String(data.get("status")) as Promotion["status"],
      note: String(data.get("note") || "").trim(),
    };
    savePromotions(editing?.id ? promotions.map(item => item.id === editing.id ? next : item) : [next, ...promotions]);
    addAdminNotification(
      editing?.id
        ? `Cập nhật chương trình khuyến mãi "${next.name}"`
        : `Tạo chương trình khuyến mãi mới "${next.name}"`,
      "promotion",
      undefined,
      "promotions"
    );
    showNotice(editing?.id ? "Đã cập nhật chương trình khuyến mãi." : "Đã tạo chương trình khuyến mãi mới.", "success");
    setEditing(null);
  }

  const blank: Promotion = { id: "", name: "Mua 5kg giảm giá", productId: products[0]?.id || 0, minQuantity: 5, benefitType: "amount", benefitValue: 10000, giftProductId: products[1]?.id || 0, startDate: new Date().toISOString().slice(0, 10), endDate: "2026-12-31", status: "active", note: "" };

  return <>
    <div className="admin-promotion-heading"><div><span className="admin-kicker">CHƯƠNG TRÌNH KHUYẾN MÃI</span><h2>Combo & khuyến mãi</h2><p>Tạo chương trình mua đủ số lượng, giảm giá, tặng quà hoặc freeship.</p></div><button className="admin-primary" onClick={() => { setPreviewProductId(blank.productId); setPreviewQuantity(blank.minQuantity); setBenefitType(blank.benefitType); setBenefitValue(blank.benefitValue / 1000); setEditing(blank); }}>＋ Tạo chương trình</button></div>
    <section className="admin-panel admin-promotion-panel"><div className="admin-table-head"><div><strong>{promotions.length} chương trình</strong><span>Quản lý ưu đãi bán hàng</span></div><div className="admin-search promotion-search">⌕<input value={query} onChange={event => setQuery(event.target.value)} placeholder="Tìm chương trình..." /></div></div>
      {filtered.length ? <div className="promotion-table"><div className="promotion-table-head"><span>CHƯƠNG TRÌNH</span><span>ĐIỀU KIỆN</span><span>ƯU ĐÃI</span><span>THỜI GIAN</span><span>TRẠNG THÁI</span><span>THAO TÁC</span></div>{filtered.map(promotion => { const product = products.find(item => item.id === promotion.productId); return <div className="promotion-row" key={promotion.id}><div><strong>{promotion.code ? `${promotion.code} · ` : ""}{promotion.name}</strong><small>{product?.name || "Sản phẩm đã xóa"}</small></div><span>Mua từ <b>{promotion.minQuantity}kg</b></span><strong className="finance-income">{benefitLabel(promotion, products)}</strong><span>{promotion.startDate} → {promotion.endDate}</span><em className={promotion.status === "active" ? "promo-active" : "promo-paused"}>{promotion.status === "active" ? "Đang bật" : "Tạm dừng"}</em><div className="admin-row-actions"><button title="Đổi trạng thái" onClick={() => { const nextStatus = promotion.status === "active" ? "paused" : "active"; savePromotions(promotions.map(item => item.id === promotion.id ? { ...item, status: nextStatus } : item)); addAdminNotification(`Chuyển trạng thái khuyến mãi "${promotion.name}" sang ${nextStatus === "active" ? "Đang bật" : "Tạm dừng"}`, "promotion", undefined, "promotions"); }}>{promotion.status === "active" ? "■" : "▶"}</button><button title="Sửa chương trình" aria-label="Sửa chương trình" onClick={() => { setPreviewProductId(promotion.productId); setPreviewQuantity(promotion.minQuantity); setBenefitType(promotion.benefitType); setBenefitValue(promotion.benefitType === "amount" ? promotion.benefitValue / 1000 : promotion.benefitValue); setEditing(promotion); }}><Pencil /></button><button className="danger" title="Xóa chương trình" aria-label="Xóa chương trình" onClick={() => setConfirmDelete(promotion)}><Trash2 /></button></div></div>; })}</div> : <div className="admin-empty">Chưa có chương trình phù hợp.</div>}
    </section>
    <AdminModal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Sửa chương trình khuyến mãi" : "Tạo chương trình khuyến mãi"} subtitle="Thiết lập điều kiện và quyền lợi cho khách hàng" size="lg" footer={<><button className="vg-btn" type="button" onClick={() => setEditing(null)}>Hủy</button><button className="vg-btn vg-btn-primary" type="submit" form="promotion-form">Lưu chương trình</button></>}>
      <form id="promotion-form" onSubmit={submit}><div className="vg-form-grid">
        <div className="vg-field"><span className="vg-field-label">Mã chương trình</span><input className="vg-input" name="code" defaultValue={editing?.code} placeholder="Để trống nếu áp dụng tự động" /></div>
        <div className="vg-field"><span className="vg-field-label">Tên chương trình <span className="vg-required">*</span></span><input className="vg-input" name="name" defaultValue={editing?.name} placeholder="Mua 5kg Gạo ST25 - Giảm 10.000đ" required /></div>
        <div className="vg-field"><span className="vg-field-label">Sản phẩm áp dụng <span className="vg-required">*</span></span><select className="vg-select" name="productId" value={previewProductId} onChange={event => setPreviewProductId(Number(event.target.value))} required>{products.map(product => <option key={product.id} value={product.id}>{product.name}</option>)}</select></div>
        <div className="vg-field"><span className="vg-field-label">Đơn giá / đơn vị</span><div className="vg-money-input"><input type="number" value={Math.round((products.find(product => product.id === previewProductId)?.price || 0) / (Number.parseFloat(products.find(product => product.id === previewProductId)?.weight || "1") || 1) / 1000)} readOnly /><span>.000 đ/kg</span></div></div>
        <div className="vg-field"><span className="vg-field-label">Mức tối thiểu (kg) <span className="vg-required">*</span></span><input className="vg-input" name="minQuantity" type="number" min="1" step="1" value={previewQuantity || ""} onChange={event => setPreviewQuantity(Math.max(1, Number(event.target.value) || 0))} required /></div>
        <div className="vg-field vg-full"><label className="promotion-code-toggle"><input type="checkbox" name="requireCode" defaultChecked={editing?.requireCode} /> Chỉ áp dụng khi khách nhập mã chương trình</label></div>
        <div className="vg-field"><span className="vg-field-label">Hình thức ưu đãi <span className="vg-required">*</span></span><select className="vg-select" name="benefitType" value={benefitType} onChange={event => { const nextType = event.target.value as Promotion["benefitType"]; setBenefitType(nextType); setBenefitValue(nextType === "percent" ? 10 : nextType === "amount" ? 10 : 0); }} required><option value="amount">Giảm số tiền</option><option value="percent">Giảm phần trăm</option><option value="gift">Tặng sản phẩm</option><option value="shipping">Miễn phí vận chuyển</option></select></div>
        {benefitType !== "shipping" && benefitType !== "gift" && <div className="vg-field"><span className="vg-field-label">{benefitType === "percent" ? "Phần trăm giảm (%)" : "Số tiền giảm (nghìn VND)"} <span className="vg-required">*</span></span>{benefitType === "amount" ? <div className="vg-money-input"><input name="benefitValue" type="number" min="0" step="1" value={benefitValue || ""} onChange={event => setBenefitValue(Number(event.target.value) || 0)} placeholder="10" required /><span>.000 VND</span></div> : <input className="vg-input" name="benefitValue" type="number" min="0" max="100" step="1" value={benefitValue || ""} onChange={event => setBenefitValue(Math.min(100, Number(event.target.value) || 0))} placeholder="10" required />}</div>}
        {benefitType === "gift" && <div className="vg-field"><span className="vg-field-label">Sản phẩm tặng <span className="vg-required">*</span></span><select className="vg-select" name="giftProductId" defaultValue={editing?.giftProductId || products[1]?.id} required>{products.map(product => <option key={product.id} value={product.id}>{product.name}</option>)}</select></div>}
        {(() => { const product = products.find(item => item.id === previewProductId) || products[0]; const packageWeight = Number.parseFloat(product?.weight || "1") || 1; const packageCount = Math.max(1, Math.ceil(previewQuantity / packageWeight)); const basePrice = (product?.price || 0) * packageCount; const saving = benefitType === "percent" ? Math.round(basePrice * benefitValue / 100) : benefitType === "amount" ? Math.min(basePrice, inputMoney(benefitValue)) : 0; return <div className="promotion-price-preview"><span className="admin-kicker">TẠM TÍNH GIÁ COMBO</span><div className="promotion-price-line"><span>Sản phẩm</span><b>{product?.name || "Chưa chọn sản phẩm"}</b></div><div className="promotion-price-line"><span>Số lượng</span><b>{packageCount} gói ({previewQuantity}kg)</b></div><div className="promotion-price-line"><span>Giá gốc</span><b>{money(basePrice)}</b></div><div className="promotion-price-line promotion-saving"><span>Tiền giảm</span><b>{saving ? `- ${money(saving)}` : benefitType === "shipping" ? "Miễn phí vận chuyển" : benefitType === "gift" ? "Tặng thêm sản phẩm" : "0đ"}</b></div><div className="promotion-price-total"><span>KHÁCH CẦN TRẢ</span><strong>{money(Math.max(0, basePrice - saving))}</strong></div></div>; })()}
        <div className="vg-field"><span className="vg-field-label">Ngày bắt đầu <span className="vg-required">*</span></span><input className="vg-input" name="startDate" type="date" defaultValue={editing?.startDate || blank.startDate} required /></div>
        <div className="vg-field"><span className="vg-field-label">Ngày kết thúc <span className="vg-required">*</span></span><input className="vg-input" name="endDate" type="date" defaultValue={editing?.endDate || blank.endDate} required /></div>
        <div className="vg-field"><span className="vg-field-label">Trạng thái</span><select className="vg-select" name="status" defaultValue={editing?.status || "active"}><option value="active">Đang bật</option><option value="paused">Tạm dừng</option></select></div>
        <div className="vg-field vg-full"><span className="vg-field-label">Ghi chú / điều khoản</span><textarea className="vg-textarea" name="note" defaultValue={editing?.note} placeholder="Áp dụng một lần cho mỗi đơn, không cộng dồn..." /></div>
      </div></form>
    </AdminModal>
    <ConfirmModal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => { if (confirmDelete) { savePromotions(promotions.filter(item => item.id !== confirmDelete.id)); addAdminNotification(`Đã xóa chương trình khuyến mãi "${confirmDelete.name}"`, "promotion", undefined, "promotions"); } setConfirmDelete(null); }} title={`Xóa chương trình ${confirmDelete?.name}?`} message="Chương trình khuyến mãi sẽ bị xóa và không thể hoàn tác." />
  </>;
}
