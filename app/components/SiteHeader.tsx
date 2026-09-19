"use client";

import { useEffect, useState } from "react";
import AuthModal, { USER_STORAGE_KEY } from "./AuthModal";
import CartPopover from "./CartPopover";
import BrandLogo from "./BrandLogo";
import { CART_STORAGE_KEY } from "../san-pham/data";

type ActivePage = "home" | "products" | "about" | "news" | "checkout";

type User = { name: string; phone: string; role?: "user" | "admin" };

export default function SiteHeader({ active = "home" }: { active?: ActivePage }) {
  const [user, setUser] = useState<User | null>(null);
  const [wished, setWished] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const syncHeader = () => {
      const savedUser = window.localStorage.getItem(USER_STORAGE_KEY);
      const cart = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) || "[]");
      setUser(savedUser ? JSON.parse(savedUser) : null);
      setCartCount(cart.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0));
    };
    syncHeader();
    window.addEventListener("storage", syncHeader);
    window.addEventListener("gao-ngon-cart-updated", syncHeader);
    return () => {
      window.removeEventListener("storage", syncHeader);
      window.removeEventListener("gao-ngon-cart-updated", syncHeader);
    };
  }, []);

  return (
    <>
      <header className="header site-header">
        <a className="logo" href="/" aria-label="Về trang chủ"><BrandLogo /></a>
        <button className="mobile-toggle" type="button" aria-label="Mở menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><span /><span /><span /></button>
        <nav className={`nav ${menuOpen ? "is-open" : ""}`} aria-label="Điều hướng chính">
          <a className={active === "home" ? "active" : ""} href="/">TRANG CHỦ</a>
          <a className={active === "products" ? "active" : ""} href="/san-pham">
            SẢN PHẨM
            <svg width="9" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{ marginLeft: 5, display: "inline-block", verticalAlign: "middle" }}>
              <path d="M1 1l4 4 4-4" />
            </svg>
          </a>
          <a className={active === "about" ? "active" : ""} href="/ve-chung-toi">VỀ CHÚNG TÔI</a>
          <a className={active === "news" ? "active" : ""} href="/tin-tuc">TIN TỨC</a>
        </nav>
        <div className="header-actions" aria-label="Thao tác nhanh">
          <button type="button" aria-label="Sản phẩm yêu thích" onClick={() => setWished((activeState) => !activeState)}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill={wished ? "#d8b45a" : "none"} stroke="#d8b45a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>{wished ? 1 : 0}</span>
          </button>
          <button type="button" aria-label="Giỏ hàng" onClick={() => setCartOpen((open) => !open)}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#d8b45a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}>
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span>{cartCount}</span>
          </button>
          {user ? (
            <a href={user.role === "admin" ? "/admin" : "/user"} aria-label="Tài khoản của tôi" className="user-pill">
              <span className="avatar">{user.name.charAt(0).toUpperCase()}</span>
              {user.name.split(" ").pop()}
            </a>
          ) : (
            <button type="button" aria-label="Đăng nhập / Đăng ký" onClick={() => setAuthOpen(true)}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#d8b45a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          )}
        </div>
        <CartPopover open={cartOpen} onClose={() => setCartOpen(false)} onChanged={setCartCount} />
      </header>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSuccess={setUser} />
    </>
  );
}
