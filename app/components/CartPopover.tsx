"use client";

import { useEffect, useRef, useState } from "react";
import { CART_STORAGE_KEY, CartItem } from "../san-pham/data";

function formatPrice(value: number) {
  return `${value.toLocaleString("vi-VN")}đ`;
}

export default function CartPopover({
  open,
  onClose,
  onChanged,
}: {
  open: boolean;
  onClose: () => void;
  onChanged?: (count: number) => void;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const stored: CartItem[] = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) || "[]");
    setItems(stored);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!popoverRef.current?.contains(event.target as Node)) onClose();
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [open, onClose]);

  if (!open) return null;

  function save(nextItems: CartItem[]) {
    setItems(nextItems);
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextItems));
    window.dispatchEvent(new Event("gao-ngon-cart-updated"));
    onChanged?.(nextItems.reduce((total, item) => total + item.quantity, 0));
  }

  function changeQuantity(productId: number, weight: string, change: number) {
    save(items
      .map((item) => item.product.id === productId && item.weight === weight
        ? { ...item, quantity: Math.max(0, item.quantity + change) }
        : item)
      .filter((item) => item.quantity > 0));
  }

  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <div ref={popoverRef} className="cart-dropdown" role="dialog" aria-label="Giỏ hàng" onClick={(event) => event.stopPropagation()}>
      <div className="cart-dropdown-heading">
        <div className="cart-header-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d8b45a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <h2>Giỏ hàng của bạn</h2>
          {items.length > 0 && <span className="cart-count-badge">({items.reduce((acc, i) => acc + i.quantity, 0)})</span>}
        </div>
        <button type="button" className="cart-close-btn" onClick={onClose} aria-label="Đóng giỏ hàng">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M1 1l12 12M13 1L1 13" />
          </svg>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="cart-empty">
          <div className="cart-empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(216,180,90,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <strong>Giỏ hàng đang trống</strong>
          <p>Hãy chọn một món gạo ngon cho bữa cơm gia đình bạn.</p>
          <a href="/san-pham" className="cart-shop-now-btn" onClick={onClose}>Khám phá sản phẩm →</a>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {items.map(({ product, quantity, weight }) => (
              <div className="cart-item" key={`${product.id}-${weight}`}>
                <div className="cart-item-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="cart-item-content">
                  <strong className="cart-item-name">{product.name}</strong>
                  <span className="cart-item-meta">{weight} · {formatPrice(product.price)}</span>
                  <div className="cart-item-bottom">
                    <div className="cart-quantity">
                      <button type="button" onClick={() => changeQuantity(product.id, weight, -1)} aria-label="Giảm số lượng">−</button>
                      <span>{quantity}</span>
                      <button type="button" onClick={() => changeQuantity(product.id, weight, 1)} aria-label="Tăng số lượng">+</button>
                    </div>
                    <b className="cart-item-price">{formatPrice(product.price * quantity)}</b>
                  </div>
                </div>
                <button type="button" className="cart-remove" onClick={() => changeQuantity(product.id, weight, -quantity)} aria-label={`Xóa ${product.name}`}>
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M1 1l12 12M13 1L1 13" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div><span>Tạm tính</span><b>{formatPrice(subtotal)}</b></div>
            <div><span>Phí vận chuyển</span><b className="free-ship">Miễn phí</b></div>
            <div className="cart-grand-total">
              <span>Tổng cộng</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
          </div>
          <div className="cart-actions">
            <a href="/san-pham" className="btn-continue-shopping" onClick={onClose}>Tiếp tục mua</a>
            <a href="/thanh-toan" className="btn-checkout-now" onClick={onClose}>Thanh toán ngay →</a>
          </div>
        </>
      )}
    </div>
  );

}
