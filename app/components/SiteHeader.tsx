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
          <a className={active === "products" ? "active" : ""} href="/san-pham">SẢN PHẨM⌄</a>
          <a className={active === "about" ? "active" : ""} href="/ve-chung-toi">VỀ CHÚNG TÔI</a>
          <a className={active === "news" ? "active" : ""} href="/tin-tuc">TIN TỨC</a>
        </nav>
        <div className="header-actions" aria-label="Thao tác nhanh">
          <button type="button" aria-label="Sản phẩm yêu thích" onClick={() => setWished((activeState) => !activeState)}>{wished ? "♥" : "♡"}<span>{wished ? 1 : 0}</span></button>
          <button type="button" aria-label="Giỏ hàng" onClick={() => setCartOpen((open) => !open)}>🛒<span>{cartCount}</span></button>
          {user ? <a href={user.role === "admin" ? "/admin" : "/user"} aria-label="Tài khoản của tôi" className="user-pill"><span className="avatar">{user.name.charAt(0).toUpperCase()}</span>{user.name.split(" ").pop()}</a> : <button type="button" aria-label="Đăng nhập / Đăng ký" onClick={() => setAuthOpen(true)}>♙</button>}
        </div>
        <CartPopover open={cartOpen} onClose={() => setCartOpen(false)} onChanged={setCartCount} />
      </header>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSuccess={setUser} />
    </>
  );
}
