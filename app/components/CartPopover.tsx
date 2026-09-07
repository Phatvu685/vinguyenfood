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
        <div><span className="section-kicker">GIỎ HÀNG CỦA BẠN</span><h2>Giỏ hàng</h2></div>
        <button type="button" onClick={onClose} aria-label="Đóng giỏ hàng">×</button>
      </div>
      {items.length === 0 ? (
        <div className="cart-empty"><span>🛒</span><strong>Giỏ hàng đang trống</strong><p>Hãy chọn một món ngon cho bữa cơm nhà mình.</p><a href="/san-pham" onClick={onClose}>Khám phá sản phẩm <b>→</b></a></div>
      ) : (
        <>
          <div className="cart-items">
            {items.map(({ product, quantity, weight }) => (
              <div className="cart-item" key={`${product.id}-${weight}`}>
                <div className="cart-item-image"><img src={product.image} alt="" /></div>
                <div className="cart-item-content"><strong>{product.name}</strong><small>{weight} · {formatPrice(product.price)}</small><div className="cart-item-bottom"><div className="cart-quantity"><button type="button" onClick={() => changeQuantity(product.id, weight, -1)} aria-label="Giảm số lượng">−</button><span>{quantity}</span><button type="button" onClick={() => changeQuantity(product.id, weight, 1)} aria-label="Tăng số lượng">+</button></div><b>{formatPrice(product.price * quantity)}</b></div></div>
                <button type="button" className="cart-remove" onClick={() => changeQuantity(product.id, weight, -quantity)} aria-label={`Xóa ${product.name}`}>×</button>
              </div>
            ))}
          </div>
          <div className="cart-summary"><div><span>Tạm tính</span><b>{formatPrice(subtotal)}</b></div><div><span>Phí vận chuyển</span><b>Miễn phí</b></div><div className="cart-grand-total"><span>Tổng cộng</span><strong>{formatPrice(subtotal)}</strong></div></div>
          <div className="cart-actions"><a href="/san-pham" onClick={onClose}>Xem giỏ hàng</a><a href="/thanh-toan" onClick={onClose}>Thanh toán <span>→</span></a></div>
        </>
      )}
    </div>
  );
}
