"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type Settings = { storeName: string; storeDescription: string; logoUrl: string; faviconUrl: string; address: string; hotline: string; email: string; shippingPolicy: string; returnPolicy: string; privacyPolicy: string; seoTitle: string; seoDescription: string; seoKeywords: string; codEnabled: boolean; bankTransferEnabled: boolean; momoEnabled: boolean; vnpayEnabled: boolean; maintenanceMode: boolean; showOutOfStock: boolean; allowGuestCheckout: boolean };
const settingsKey = "gao-ngon-settings";
const defaults: Settings = { storeName: "Vigen Food", storeDescription: "Gạo ngon, nguồn gốc rõ ràng cho mỗi bữa cơm Việt.", logoUrl: "/images/logo.png", faviconUrl: "/images/logo.png", address: "12 Đường Lúa Mới, Ninh Kiều, Cần Thơ", hotline: "0900 000 001", email: "hello@vigenfood.com", shippingPolicy: "Miễn phí vận chuyển cho đơn hàng từ 15kg.", returnPolicy: "Đổi trả trong 7 ngày nếu sản phẩm có lỗi từ nhà sản xuất.", privacyPolicy: "Thông tin khách hàng được bảo mật và chỉ dùng cho việc xử lý đơn hàng.", seoTitle: "Vigen Food | Gạo ngon cho bữa cơm Việt", seoDescription: "Mua gạo ngon chính hãng, truy xuất nguồn gốc và giao hàng tận nơi.", seoKeywords: "gạo ngon, gạo sạch, Vigen Food, gạo Việt Nam", codEnabled: true, bankTransferEnabled: true, momoEnabled: false, vnpayEnabled: false, maintenanceMode: false, showOutOfStock: true, allowGuestCheckout: true };

function getSettings(): Settings { try { const value = JSON.parse(localStorage.getItem(settingsKey) || "null"); return value ? { ...defaults, ...value } : defaults; } catch { return defaults; } }
function Field({ label, value, onChange, area = false, type = "text" }: { label: string; value: string; onChange: (value: string) => void; area?: boolean; type?: string }) { return <label>{label}{area ? <textarea value={value} onChange={event => onChange(event.target.value)} /> : <input type={type} value={value} onChange={event => onChange(event.target.value)} />}</label>; }
function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const [source, setSource] = useState<"upload" | "url">("upload");
  useEffect(() => {
    setSource(value && !value.startsWith("data:image/") ? "url" : "upload");
  }, [value]);

  function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => { setSource("upload"); onChange(String(reader.result)); };
    reader.readAsDataURL(file);
  }

  return <div className="admin-image-field"><div className="admin-image-field-heading"><span>{label}</span><small>PNG, JPG, WEBP hoặc SVG</small></div><div className="admin-image-body"><div className="admin-image-upload"><div className="vg-upload-source"><button type="button" className={source === "upload" ? "active" : ""} onClick={() => { setSource("upload"); onChange(""); }}>Upload ảnh</button><button type="button" className={source === "url" ? "active" : ""} onClick={() => setSource("url")}>URL ảnh</button></div><div className="admin-image-input">{source === "upload" ? <label className="admin-image-upload-button"><span>↑</span> Chọn ảnh<input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={upload} /></label> : <input type="text" value={value} onChange={event => onChange(event.target.value)} placeholder="Dán đường dẫn ảnh..." />}</div></div><div className="admin-image-preview-wrap">{value ? <img className="admin-image-preview" src={value} alt={`Xem trước ${label.toLowerCase()}`} /> : <span aria-hidden="true">{label === "Logo" ? "L" : "F"}</span>}</div></div></div>;
}
function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) { return <label><input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} /> {label}</label>; }
function Section({ number, title, description, children }: { number: string; title: string; description: string; children: React.ReactNode }) { return <section className="admin-panel admin-settings-section"><div className="admin-settings-section-title"><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div></div>{children}</section>; }

export default function SettingsManager({ showNotice }: { showNotice: (text: string, tone?: "success" | "error") => void }) {
  const [settings, setSettings] = useState<Settings>(defaults);
  useEffect(() => setSettings(getSettings()), []);
  const update = (key: keyof Settings, value: string | boolean) => setSettings(current => ({ ...current, [key]: value }));
  const save = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); localStorage.setItem(settingsKey, JSON.stringify(settings)); window.dispatchEvent(new Event("gao-ngon-settings-updated")); showNotice("Đã lưu cấu hình website."); };
  const reset = () => { setSettings(defaults); localStorage.setItem(settingsKey, JSON.stringify(defaults)); showNotice("Đã khôi phục cấu hình mặc định."); };
  return <form className="admin-settings" onSubmit={save}>
    <div className="admin-settings-heading"><div><span className="admin-kicker">CẤU HÌNH HỆ THỐNG</span><h2>Cài đặt cửa hàng</h2><p>Quản lý thông tin hiển thị, chính sách và các thiết lập vận hành website.</p></div><div className="admin-settings-actions"><button type="button" className="admin-back" onClick={reset}>Khôi phục mặc định</button><button type="submit" className="admin-primary">Lưu thay đổi</button></div></div>
    <Section number="01" title="Thông tin cửa hàng" description="Thông tin cơ bản được dùng trên website và trong đơn hàng."><div className="admin-settings-grid"><Field label="Tên cửa hàng" value={settings.storeName} onChange={value => update("storeName", value)} /><Field label="Mô tả ngắn" value={settings.storeDescription} onChange={value => update("storeDescription", value)} /></div></Section>
    <Section number="02" title="Logo & thương hiệu" description="Nhập đường dẫn hoặc tải trực tiếp logo và favicon của website."><div className="admin-settings-grid"><ImageField label="Logo" value={settings.logoUrl} onChange={value => update("logoUrl", value)} /><ImageField label="Favicon" value={settings.faviconUrl} onChange={value => update("faviconUrl", value)} /></div></Section>
    <Section number="03" title="Địa chỉ & liên hệ" description="Thông tin hiển thị tại chân trang và trang liên hệ."><div className="admin-settings-grid"><Field label="Địa chỉ cửa hàng" value={settings.address} onChange={value => update("address", value)} /><Field label="Hotline" type="tel" value={settings.hotline} onChange={value => update("hotline", value)} /><Field label="Email" type="email" value={settings.email} onChange={value => update("email", value)} /></div></Section>
    <Section number="04" title="Chính sách" description="Nội dung hiển thị trong khu vực chính sách của website."><div className="admin-settings-grid admin-settings-grid-single"><Field label="Chính sách vận chuyển" area value={settings.shippingPolicy} onChange={value => update("shippingPolicy", value)} /><Field label="Chính sách đổi trả" area value={settings.returnPolicy} onChange={value => update("returnPolicy", value)} /><Field label="Chính sách bảo mật" area value={settings.privacyPolicy} onChange={value => update("privacyPolicy", value)} /></div></Section>
    <Section number="05" title="SEO" description="Tối ưu tiêu đề và mô tả khi chia sẻ website trên công cụ tìm kiếm."><div className="admin-settings-grid admin-settings-grid-single"><Field label="Tiêu đề SEO" value={settings.seoTitle} onChange={value => update("seoTitle", value)} /><Field label="Mô tả SEO" area value={settings.seoDescription} onChange={value => update("seoDescription", value)} /><Field label="Từ khóa SEO" value={settings.seoKeywords} onChange={value => update("seoKeywords", value)} /></div></Section>
    <Section number="06" title="Phương thức thanh toán" description="Bật hoặc tắt các lựa chọn thanh toán trên trang thanh toán."><div className="admin-settings-options"><Check label="Thanh toán khi nhận hàng (COD)" checked={settings.codEnabled} onChange={value => update("codEnabled", value)} /><Check label="Chuyển khoản ngân hàng" checked={settings.bankTransferEnabled} onChange={value => update("bankTransferEnabled", value)} /><Check label="Ví MoMo" checked={settings.momoEnabled} onChange={value => update("momoEnabled", value)} /><Check label="VNPAY" checked={settings.vnpayEnabled} onChange={value => update("vnpayEnabled", value)} /></div></Section>
    <Section number="07" title="Cấu hình website" description="Kiểm soát trạng thái hoạt động và trải nghiệm mua hàng."><div className="admin-settings-options"><Check label="Bật chế độ bảo trì" checked={settings.maintenanceMode} onChange={value => update("maintenanceMode", value)} /><Check label="Hiển thị sản phẩm hết hàng" checked={settings.showOutOfStock} onChange={value => update("showOutOfStock", value)} /><Check label="Cho phép đặt hàng không cần đăng nhập" checked={settings.allowGuestCheckout} onChange={value => update("allowGuestCheckout", value)} /></div></Section>
  </form>;
}
