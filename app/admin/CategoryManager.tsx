"use client";

import { FormEvent, useMemo, useState } from "react";
const Target = () => <span>👁️</span>;
const Pencil = () => <span>✏️</span>;
const Trash2 = () => <span>🗑️</span>;
import { Product } from "../san-pham/data";
import AdminModal from "./components/AdminModal";
import ConfirmModal from "./components/ConfirmModal";

import { addAdminNotification } from "../lib/notifications";

export type Category = { id: number; name: string; description: string; active: boolean };

export default function CategoryManager({ categories, products, saveCategories, renameProducts, showNotice }: { categories: Category[]; products: Product[]; saveCategories: (categories: Category[]) => void; renameProducts: (oldName: string, newName: string) => void; showNotice: (text: string) => void }) {
  const [editing, setEditing] = useState<Category | null>(null);
  const [detail, setDetail] = useState<Category | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Category | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const description = String(data.get("description") || "").trim();
    const active = data.get("active") === "true";
    if (categories.some((category) => category.name.toLowerCase() === name.toLowerCase() && category.id !== editing?.id)) {
      showNotice("Tên danh mục đã tồn tại");
      return;
    }
    if (editing?.id) {
      const oldName = categories.find(category => category.id === editing.id)?.name || "";
      saveCategories(categories.map((category) => category.id === editing.id ? { ...category, name, description, active } : category));
      if (oldName !== name) renameProducts(oldName, name);
      addAdminNotification(`Đã cập nhật danh mục "${name}"`, "category", undefined, "categories");
    } else {
      saveCategories([...categories, { id: Date.now(), name, description, active: true }]);
      addAdminNotification(`Đã thêm danh mục mới "${name}"`, "category", undefined, "categories");
    }
    setEditing(null);
    showNotice(editing?.id ? "Đã cập nhật danh mục" : "Đã thêm danh mục");
  }

  function handleDelete(category: Category) {
    if (products.some((product) => product.category === category.name)) {
      showNotice("Không thể xóa danh mục đang có sản phẩm");
      return;
    }
    setConfirmDelete(category);
  }

  const filteredCategories = useMemo(() => categories.filter((category) => {
    const matchesQuery = `${category.name} ${category.description}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "all" || (status === "active" ? category.active : !category.active);
    return matchesQuery && matchesStatus;
  }), [categories, query, status]);

  return <>
    <div className="admin-hero-card category-hero">
      <div>
        <span className="admin-kicker">QUẢN LÝ DANH MỤC</span>
        <h2>Danh sách danh mục</h2>
        <p>Phân loại và kiểm soát hiển thị sản phẩm.</p>
      </div>
      <div className="category-hero-summary">
        <strong>{categories.length}</strong>
        <span>nhóm sản phẩm</span>
      </div>
      <button className="admin-primary" onClick={() => setEditing({ id: 0, name: "", description: "", active: true })}><span aria-hidden="true">+</span> Thêm danh mục</button>
    </div>

    <section className="admin-panel">
    <div className="admin-category-filters"><label className="admin-search">⌕<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm danh mục..." /></label><select value={status} onChange={(event) => setStatus(event.target.value as "all" | "active" | "inactive")} aria-label="Lọc trạng thái"><option value="all">Tất cả trạng thái</option><option value="active">Đang bật</option><option value="inactive">Đã tắt</option></select></div>
    <div className="admin-category-table"><div className="admin-category-head"><span>DANH MỤC</span><span>MÔ TẢ</span><span>SẢN PHẨM</span><span>TRẠNG THÁI</span><span>THAO TÁC</span></div>{filteredCategories.length ? filteredCategories.map((category) => { const count = products.filter((product) => product.category === category.name).length; return <div className="admin-category-row" key={category.id}><strong>{category.name}</strong><span>{category.description}</span><b>{count} sản phẩm</b><button className={category.active ? "category-active" : ""} onClick={() => saveCategories(categories.map((item) => item.id === category.id ? { ...item, active: !item.active } : item))}>{category.active ? "Đang bật" : "Đã tắt"}</button><div className="admin-row-actions"><button onClick={() => setDetail(category)} title="Xem chi tiết" aria-label="Xem chi tiết"><Target /></button><button onClick={() => setEditing(category)} title="Sửa danh mục" aria-label="Sửa danh mục"><Pencil /></button><button className="danger" onClick={() => handleDelete(category)} title="Xóa danh mục" aria-label="Xóa danh mục"><Trash2 /></button></div></div>; }) : <div className="admin-empty">Không tìm thấy danh mục phù hợp.</div>}</div>

    <AdminModal open={!!detail} onClose={() => setDetail(null)} title={detail ? `Chi tiết ${detail.name}` : "Chi tiết danh mục"} subtitle="Thông tin chi tiết danh mục" size="sm" footer={<><button className="vg-btn" type="button" onClick={() => setDetail(null)}>Đóng</button></>}>
      {detail && (
        <div className="vg-form-grid">
          <div className="vg-field"><span className="vg-field-label">Tên danh mục</span><input className="vg-input" value={detail.name} readOnly /></div>
          <div className="vg-field"><span className="vg-field-label">Trạng thái</span><input className="vg-input" value={detail.active ? "Đang bật" : "Đã tắt"} readOnly /></div>
          <div className="vg-field"><span className="vg-field-label">Số sản phẩm</span><input className="vg-input" value={products.filter((product) => product.category === detail.name).length} readOnly /></div>
          <div className="vg-field vg-full"><span className="vg-field-label">Mô tả</span><textarea className="vg-textarea" value={detail.description} readOnly /></div>
        </div>
      )}
    </AdminModal>

    <AdminModal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"} subtitle="Phân loại sản phẩm theo nhóm" size="sm" footer={<><button className="vg-btn" type="button" onClick={() => setEditing(null)}>Hủy</button><button className="vg-btn vg-btn-primary" type="submit" form="category-form">Lưu danh mục</button></>}>
      <form id="category-form" onSubmit={submit}>
        <div className="vg-form-grid">
          <div className="vg-field vg-full"><span className="vg-field-label">Tên danh mục <span className="vg-required">*</span></span><input className="vg-input" name="name" defaultValue={editing?.name} autoFocus required /></div>
          <div className="vg-field vg-full"><span className="vg-field-label">Mô tả <span className="vg-required">*</span></span><input className="vg-input" name="description" defaultValue={editing?.description} required /></div>
          <div className="vg-field vg-full"><span className="vg-field-label">Trạng thái</span><select className="vg-select" name="active" defaultValue={String(editing?.active)}><option value="true">Đang bật</option><option value="false">Đã tắt</option></select></div>
        </div>
      </form>
    </AdminModal>
    <ConfirmModal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => { if (confirmDelete) { saveCategories(categories.filter(item => item.id !== confirmDelete.id)); addAdminNotification(`Đã xóa danh mục "${confirmDelete.name}"`, "category", undefined, "categories"); showNotice("Đã xóa danh mục"); } setConfirmDelete(null); }} title={`Xóa danh mục "${confirmDelete?.name}"?`} message="Danh mục sẽ bị xóa và không thể hoàn tác." />
  </section>
  </>;
}
