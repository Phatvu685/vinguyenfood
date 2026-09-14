"use client";

import { FormEvent, useState } from "react";

type AuthUser = { name: string; phone: string; password?: string; role?: "user" | "admin" };

export const USER_STORAGE_KEY = "gao-ngon-user";
const ADMIN_EMAIL = "admin@vigenfood.com";
const ADMIN_PASSWORD = "VigenFood@2026";

const PHONE_REGEX = /^(0|\+84)([0-9]{9,10})$/;

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.5 10.5 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function AuthModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess?: (user: AuthUser) => void;
}) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState("");

  if (!open) return null;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const phone = String(form.get("phone") || "").trim();
    const name = String(form.get("name") || "Bạn");
    const password = String(form.get("password") || "");
    const confirmPassword = String(form.get("confirmPassword") || "");

    const isAdminLogin = mode === "login" && phone.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;
    if (mode === "login" && phone.toLowerCase() === ADMIN_EMAIL && !isAdminLogin) {
      setFormError("Mật khẩu admin chưa đúng.");
      return;
    }

    if (!isAdminLogin && !PHONE_REGEX.test(phone)) {
      setFormError("Số điện thoại không hợp lệ.");
      return;
    }

    if (mode === "register" && password !== confirmPassword) {
      setFormError("Mật khẩu xác nhận chưa trùng khớp.");
      return;
    }

    const user = isAdminLogin
      ? { name: "Quản trị viên", phone: ADMIN_EMAIL, password, role: "admin" as const }
      : { name, phone, password, role: "user" as const };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    onSuccess?.(user);
    onClose();
    if (isAdminLogin) window.location.assign("/admin");
  }

  return (
    <div className="auth-overlay" role="presentation" onMouseDown={onClose}>
      <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="auth-close" onClick={onClose} aria-label="Đóng">×</button>
        <aside className="auth-showcase" aria-hidden="true">
          <span className="auth-showcase-grain">✦</span>
          <div className="auth-showcase-copy">
            <span>GẠO NGON MEMBER</span>
            <h2>Mỗi bữa cơm,<br /><em>một niềm vui.</em></h2>
            <p>Đặc quyền dành riêng cho những người yêu hạt gạo Việt.</p>
          </div>
          <div className="auth-showcase-perks">
            <span>01 <b>Ưu đãi thành viên</b></span>
            <span>02 <b>Theo dõi đơn hàng</b></span>
            <span>03 <b>Tích điểm mỗi lần mua</b></span>
          </div>
        </aside>
        <div className="auth-content">
          <div className="auth-heading">
            <span className="section-kicker">GẠO NGON MEMBER</span>
            <h2 id="auth-title">{mode === "login" ? "Chào mừng trở lại" : "Tạo tài khoản mới"}</h2>
            <p>{mode === "login" ? "Đăng nhập để xem ưu đãi và đơn hàng của bạn." : "Tham gia để nhận ưu đãi dành riêng cho hội viên."}</p>
          </div>
          <div className="auth-tabs" role="tablist" aria-label="Chọn hình thức xác thực">
            <button className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setFormError(""); }} role="tab" aria-selected={mode === "login"}>Đăng nhập</button>
            <button className={mode === "register" ? "active" : ""} onClick={() => { setMode("register"); setFormError(""); }} role="tab" aria-selected={mode === "register"}>Đăng ký</button>
          </div>
          <form className="auth-form" autoComplete="off" onSubmit={submit} onInput={() => formError && setFormError("")}>
            {mode === "register" && <label><span>Họ và tên</span><span className="auth-input"><i>♙</i><input name="name" placeholder="Nguyễn Minh Anh" autoComplete="name" required /></span></label>}
            <label><span>{mode === "login" ? "Số điện thoại hoặc email admin" : "Số điện thoại"}</span><span className="auth-input"><i>☏</i><input name="phone" type={mode === "login" ? "text" : "tel"} placeholder={mode === "login" ? "0901 234 567 hoặc admin@vigenfood.com" : "0901 234 567"} autoComplete="off" data-form-type="other" pattern={mode === "login" ? undefined : "^(0|\+84)[0-9]{9,10}$"} required /></span></label>
            <label><span>Mật khẩu</span><span className="auth-input password-field"><i>⌑</i><input name="password" type={showPassword ? "text" : "password"} placeholder="Ít nhất 6 ký tự" autoComplete="new-password" data-form-type="other" minLength={6} required /><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}><EyeIcon open={showPassword} /></button></span></label>
            {mode === "register" && <label><span>Xác nhận mật khẩu</span><span className="auth-input password-field"><i>⌑</i><input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Nhập lại mật khẩu" autoComplete="new-password" minLength={6} required /><button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}><EyeIcon open={showConfirmPassword} /></button></span></label>}
            {mode === "login" && <button className="forgot-password" type="button">Quên mật khẩu?</button>}
            {formError && <p className="auth-error" role="alert">{formError}</p>}
            <button className="auth-submit" type="submit">{mode === "login" ? "Đăng nhập" : "Tạo tài khoản"} <span>→</span></button>
          </form>
          <p className="auth-note">Bằng việc tiếp tục, bạn đồng ý với <button type="button">Điều khoản</button> và <button type="button">Chính sách bảo mật</button> của Gạo Ngon.</p>
        </div>
      </section>
    </div>
  );
}
