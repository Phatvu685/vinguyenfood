"use client";

import { FormEvent, useEffect, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import BrandLogo from "../components/BrandLogo";
import SiteFooter from "../components/SiteFooter";
import AuthModal from "../components/AuthModal";
import CartPopover from "../components/CartPopover";
import SiteHeader from "../components/SiteHeader";
import { CART_STORAGE_KEY, CartItem } from "../san-pham/data";
import { addAdminNotification } from "../lib/notifications";
import styles from "./page.module.css";

const formatPrice = (value: number) => `${value.toLocaleString("vi-VN")}đ`;

function readStoredOrders() {
  if (typeof window === "undefined") return [] as Array<Record<string, unknown>>;
  try {
    const raw = window.localStorage.getItem("gao-ngon-orders");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistOrders(next: unknown[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem("gao-ngon-orders", JSON.stringify(next));
    window.dispatchEvent(new Event("gao-ngon-orders-updated"));
  } catch {
    // Ignore storage quota / browser privacy errors and keep state in memory.
  }
}

function reserveCheckoutStock(order: { id: string; customer: string; total: number; items: number; products?: { productId: number; quantity: number; purchasePrice?: number }[] }) {
  try {
    const productsKey = "gao-ngon-admin-products";
    const inventoryKey = "gao-ngon-inventory";
    const products = JSON.parse(window.localStorage.getItem(productsKey) || "[]") as Array<{ id: number; stock?: number }>;
    const records = JSON.parse(window.localStorage.getItem(inventoryKey) || "[]") as Array<{ reference?: string }>;
    if (!order.products?.length || records.some(record => record.reference === `ORDER:${order.id}`)) return;
    const exportRecords = order.products.map(item => ({ id: `EXP-${order.id.replace(/[^a-zA-Z0-9]/g, "")}-${item.productId}`, type: "export", productId: item.productId, quantity: item.quantity, purchasePrice: item.purchasePrice || 0, salePrice: order.total / Math.max(1, order.items), date: new Date().toISOString().slice(0, 10), partner: order.customer, warehouse: "Kho chính", batch: "", status: "completed", note: `Xuất kho tự động từ đơn ${order.id}`, reference: `ORDER:${order.id}` }));
    const updatedProducts = products.map(product => {
      const quantity = order.products?.filter(item => item.productId === product.id).reduce((sum, item) => sum + item.quantity, 0) || 0;
      return quantity ? { ...product, stock: Math.max(0, (product.stock || 0) - quantity) } : product;
    });
    window.localStorage.setItem(productsKey, JSON.stringify(updatedProducts));
    window.localStorage.setItem(inventoryKey, JSON.stringify([...records, ...exportRecords]));
  } catch {
    // Keep order creation working when browser storage is unavailable.
  }
}

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [shippingFree, setShippingFree] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");
  const [appliedVoucherCode, setAppliedVoucherCode] = useState("");
  const [appliedPromotion, setAppliedPromotion] = useState<{ code: string; name: string; benefitType: string; giftProductId?: number } | null>(null);
  const [purchaseMode, setPurchaseMode] = useState<"retail" | "combo">("retail");
  const [completedOrder, setCompletedOrder] = useState<{ id: string; customer: string; phone: string; email: string; address: string; province: string; district: string; ward: string; paymentMethod: string; createdAt: string } | null>(null);
  const [newlyUnlockedVouchers, setNewlyUnlockedVouchers] = useState<{ code: string; desc: string; discountType?: string; discountValue?: number }[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    setItems(stored ? JSON.parse(stored) : []);
  }, []);

  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const totalWeight = items.reduce((total, item) => total + (Number.parseFloat(item.weight || item.product.weight || "1") || 1) * item.quantity, 0);
  const shipping = shippingFree || totalWeight >= 15 || subtotal === 0 ? 0 : 28000;
  const total = Math.max(0, subtotal - discount + shipping);

  function applyPromotion() {
    if (purchaseMode === "retail") {
      setCouponMessage("Đang chọn mua lẻ. Hãy chọn Combo ưu đãi để áp dụng chương trình.");
      return;
    }
    const code = voucherCode.trim().toUpperCase();
    const vouchers = JSON.parse(window.localStorage.getItem("gao-ngon-vouchers") || "[]");
    const promotions = JSON.parse(window.localStorage.getItem("gao-ngon-promotions") || "[]");
    const today = new Date().toISOString().slice(0, 10);
    const voucher = vouchers.find((item: { code: string; active: boolean; exp: string }) => item.code === code && item.active);
    const promotion = promotions.find((item: { code?: string; requireCode?: boolean; name: string; status: string; startDate: string; endDate: string; minQuantity: number; productId: number; benefitType: string; benefitValue: number; giftProductId?: number }) => {
      const quantity = items.filter(cartItem => cartItem.product.id === item.productId).reduce((sum, cartItem) => sum + cartItem.quantity * Number.parseFloat(cartItem.weight || cartItem.product.weight), 0);
      const codeMatches = item.requireCode ? Boolean(item.code && item.code.toUpperCase() === code) : true;
      return codeMatches && item.status === "active" && today >= item.startDate && today <= item.endDate && quantity >= item.minQuantity;
    });
    if (voucher) {
      if (appliedPromotion) {
        setCouponMessage("Không thể áp mã giảm giá khi chương trình ưu đãi đang được sử dụng. Hãy bỏ chương trình trước.");
        return;
      }
      const exp = voucher.exp.includes("/") ? voucher.exp.split("/").reverse().join("-") : voucher.exp;
      if (today > exp) { setCouponMessage("Mã giảm giá đã hết hạn."); return; }
      const typedVoucher = voucher as { discountType?: "amount" | "percent" | "shipping"; discountValue?: number };
      const value = typedVoucher.discountType === "percent" ? Math.round(subtotal * (typedVoucher.discountValue || 0) / 100) : typedVoucher.discountType === "amount" ? typedVoucher.discountValue || 0 : code === "GAODON10" ? Math.round(subtotal * 0.1) : code === "MEMBER15" ? 15000 : 0;
      setDiscount(Math.min(subtotal, value));
      setShippingFree(typedVoucher.discountType === "shipping" || code === "FREESHIP");
      setAppliedVoucherCode(code);
      setAppliedPromotion(null);
      setCouponMessage(`Đã áp dụng mã ${code}.`);
      return;
    }
    if (promotion) {
      if (appliedVoucherCode) {
        setCouponMessage("Không thể áp dụng chương trình ưu đãi khi mã giảm giá đang được sử dụng. Hãy bỏ mã giảm giá trước.");
        return;
      }
      const value = promotion.benefitType === "percent" ? Math.round(subtotal * promotion.benefitValue / 100) : promotion.benefitType === "amount" ? promotion.benefitValue : 0;
      setDiscount(Math.min(subtotal, value));
      setShippingFree(promotion.benefitType === "shipping");
      setAppliedVoucherCode("");
      setAppliedPromotion({ code, name: promotion.name, benefitType: promotion.benefitType, giftProductId: promotion.giftProductId });
      setCouponMessage(`Đã áp dụng chương trình ${promotion.name}.`);
      return;
    }
    setDiscount(0);
    setShippingFree(false);
    setAppliedVoucherCode("");
    setAppliedPromotion(null);
    setCouponMessage("Mã hoặc điều kiện ưu đãi chưa phù hợp.");
  }

  function continueFromShipping(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStep(3);
  }

  function choosePurchaseMode(mode: "retail" | "combo") {
    setPurchaseMode(mode);
    if (mode === "retail") {
      setDiscount(0);
      setShippingFree(false);
      setAppliedVoucherCode("");
      setAppliedPromotion(null);
      setCouponMessage("");
    }
  }

  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const orderProducts: { productId: number; quantity: number; purchasePrice: number; isGift?: boolean }[] = items.map(item => ({ productId: item.product.id, quantity: item.quantity, purchasePrice: item.product.price }));
    if (appliedPromotion?.benefitType === "gift" && appliedPromotion.giftProductId) orderProducts.push({ productId: appliedPromotion.giftProductId, quantity: 1, purchasePrice: 0, isGift: true });
    const order = {
      id: `#VG${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      status: "Thành công",
      customer: String(formData.get("name") || "Khách hàng"),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      address: String(formData.get("address") || ""),
      province: String(formData.get("province") || ""),
      district: String(formData.get("district") || ""),
      ward: String(formData.get("ward") || ""),
      total,
      paymentStatus: paymentMethod === "cod" ? "unpaid" : "paid",
      paidAmount: paymentMethod === "cod" ? 0 : total,
      subtotal,
      discount,
      shipping,
      voucherCode: voucherCode.trim().toUpperCase(),
      orderType: purchaseMode,
      promotionCode: appliedPromotion?.code,
      promotionName: appliedPromotion?.name,
      giftProductId: appliedPromotion?.giftProductId,
      paymentMethod,
      items: items.reduce((count, item) => count + item.quantity, 0),
      products: orderProducts,
    };
    reserveCheckoutStock(order);
    const orders = readStoredOrders();
    persistOrders([...orders, order]);

    // Send admin notification for new customer order
    addAdminNotification(
      `Khách hàng ${order.customer} vừa đặt đơn hàng mới ${order.id} (${formatPrice(total)})`,
      "order",
      `SĐT: ${order.phone || "N/A"} - Địa chỉ: ${order.address || ""}`,
      "orders"
    );

    // Check if this order unlocks any reward vouchers (min_orders, next_order, min_spend, top_customer)
    try {
      const phone = String(formData.get("phone") || "");
      const allOrders = [...orders, order];
      const userOrders = allOrders.filter(o => (o as { phone?: string }).phone === phone);
      const userOrderCount = userOrders.length;
      const prevOrderCount = userOrderCount - 1;
      const userTotalSpend = userOrders.reduce((sum, o) => sum + ((o as { total?: number }).total || 0), 0);
      const prevTotalSpend = userTotalSpend - (order.total || 0);

      const vouchers = JSON.parse(window.localStorage.getItem("gao-ngon-vouchers") || "[]") as Array<{
        code: string; desc: string; active: boolean; conditionType?: string; minOrders?: number; minSpend?: number; discountType?: string; discountValue?: number;
      }>;

      const justUnlocked = vouchers.filter(v => {
        if (!v.active) return false;
        if (v.conditionType === "next_order") return true; // Always unlocked for next order!
        if (v.conditionType === "min_orders" && v.minOrders !== undefined && prevOrderCount < v.minOrders && userOrderCount >= v.minOrders) return true;
        if (v.conditionType === "min_spend" && v.minSpend !== undefined && prevTotalSpend < v.minSpend && userTotalSpend >= v.minSpend) return true;
        return false;
      });
      if (justUnlocked.length) setNewlyUnlockedVouchers(justUnlocked);
    } catch { /* silent */ }

    setCompletedOrder({ id: order.id, customer: order.customer, phone: order.phone, email: order.email, address: order.address, province: order.province, district: order.district, ward: order.ward, paymentMethod, createdAt: order.createdAt });
    setStep(4);
    window.localStorage.removeItem(CART_STORAGE_KEY);
  }

  async function printInvoice() {
    if (!completedOrder || !items.length) return;
    const invoice = document.querySelector<HTMLElement>(".print-invoice");
    if (!invoice) return;

    const previousStyle = invoice.getAttribute("style");
    invoice.style.display = "block";
    invoice.style.position = "fixed";
    invoice.style.left = "-10000px";
    invoice.style.top = "0";
    invoice.style.width = "760px";
    invoice.style.padding = "40px";
    invoice.style.background = "#ffffff";

    try {
      const canvas = await html2canvas(invoice, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imageHeight = (canvas.height * pageWidth) / canvas.width;
      let remainingHeight = imageHeight;
      let imagePosition = 0;
      const image = canvas.toDataURL("image/jpeg", 0.95);

      pdf.addImage(image, "JPEG", 0, imagePosition, pageWidth, imageHeight);
      remainingHeight -= pageHeight;
      while (remainingHeight > 0) {
        imagePosition = remainingHeight - imageHeight;
        pdf.addPage();
        pdf.addImage(image, "JPEG", 0, imagePosition, pageWidth, imageHeight);
        remainingHeight -= pageHeight;
      }

      pdf.save(`hoa-don-${completedOrder.id.replace(/[^a-zA-Z0-9]/g, "")}.pdf`);
    } finally {
      if (previousStyle === null) invoice.removeAttribute("style");
      else invoice.setAttribute("style", previousStyle);
    }
  }

  return (
    <main className={`checkout-page ${styles.pageRoot}`}>
      <div className="topbar">
        <div className="topbar-track">
          <div>🛡 Kiểm tra hàng trước khi thanh toán</div>
          <div>♧ Tư vấn 24/7: <b>1900 1234</b></div>
          <div>🚚 Giao hàng toàn quốc</div>
          <div>🛡 Kiểm tra hàng trước khi thanh toán</div>
          <div>♧ Tư vấn 24/7: <b>1900 1234</b></div>
        </div>
      </div>
      <SiteHeader active="checkout" />

      <section className="checkout-shell">
        <div className="checkout-heading">
          <span className="section-kicker">GIAO HÀNG AN TOÀN</span>
          <h1>Thanh toán</h1>
          <div className="checkout-steps" aria-label="Tiến trình thanh toán">
            <span className={step >= 1 ? "active" : ""}><b>1</b>Giỏ hàng</span>
            <i />
            <span className={step >= 2 ? "active" : ""}><b>2</b>Thông tin giao hàng</span>
            <i />
            <span className={step >= 3 ? "active" : ""}><b>3</b>Thanh toán</span>
            <i />
            <span className={step >= 4 ? "active" : ""}><b>4</b>Hoàn tất</span>
          </div>
        </div>

        <div className="checkout-layout">
          <form id="checkout-form" className="checkout-form" onSubmit={step === 1 ? (event) => { event.preventDefault(); if (!items.length) return; if (purchaseMode === "combo" && !appliedPromotion) { setCouponMessage("Hãy áp dụng một combo hợp lệ trước khi tiếp tục."); return; } setStep(2); } : step === 2 ? continueFromShipping : submitOrder}>
            {step === 1 && <div className="checkout-stage checkout-cart-stage"><div className="checkout-panel-title"><span>01</span><div><h2>Kiểm tra giỏ hàng</h2><p>Xác nhận sản phẩm trước khi nhập thông tin giao hàng.</p></div></div>{items.length ? <div className="checkout-cart-list">{items.map((item) => <div className="checkout-cart-product" key={`${item.product.id}-${item.weight}`}><div className="checkout-cart-product-image"><img src={item.product.image} alt={item.product.name} /></div><div><strong>{item.product.name}</strong><small>{item.weight} · Số lượng: {item.quantity}</small></div><b>{formatPrice(item.product.price * item.quantity)}</b></div>)}</div> : <div className="checkout-stage-note">Giỏ hàng của bạn đang trống.</div>}<button className="checkout-next" type="button" disabled={!items.length} onClick={() => setStep(2)}>Đến thông tin giao hàng <span>→</span></button></div>}
            {step === 2 && <><div className="checkout-purchase-mode"><span>Chọn hình thức mua</span><div><button type="button" className={purchaseMode === "retail" ? "selected" : ""} onClick={() => choosePurchaseMode("retail")}>Mua lẻ</button><button type="button" className={purchaseMode === "combo" ? "selected" : ""} onClick={() => choosePurchaseMode("combo")}>Combo ưu đãi</button></div></div><div className="checkout-panel-title"><span>02</span><div><h2>Thông tin giao hàng</h2><p>Nhập thông tin để chúng tôi giao hàng đến bạn.</p></div></div><div className="checkout-fields">
              <label>Họ và tên <em>*</em><input name="name" placeholder="Nhập họ và tên" required /></label>
              <label>Số điện thoại <em>*</em><input name="phone" type="tel" placeholder="Nhập số điện thoại" required /></label>
              <label>Email<input name="email" type="email" placeholder="Nhập email" /></label>
              <label>Tỉnh / Thành phố <em>*</em><select required defaultValue=""><option value="" disabled>Chọn tỉnh / thành phố</option><option>Hồ Chí Minh</option><option>Cần Thơ</option><option>Hà Nội</option><option>Đà Nẵng</option></select></label>
              <label>Quận / Huyện <em>*</em><select required defaultValue=""><option value="" disabled>Chọn quận / huyện</option><option>Ninh Kiều</option><option>Bình Thủy</option><option>Thốt Nốt</option></select></label>
              <label>Phường / Xã <em>*</em><select required defaultValue=""><option value="" disabled>Chọn phường / xã</option><option>Phường Tân An</option><option>Phường An Khánh</option><option>Phường Cái Khế</option></select></label>
              <label className="checkout-full">Địa chỉ chi tiết <em>*</em><textarea name="address" placeholder="Số nhà, tên đường, tòa nhà, thôn xóm..." required /></label>
            </div><div className="checkout-subsection"><h3>Phương thức giao hàng</h3><div className="shipping-options"><label><input type="radio" name="shipping" defaultChecked /><span><b>◉&nbsp; Giao hàng tiêu chuẩn</b><small>2 - 3 ngày</small></span><strong>Miễn phí</strong></label><label><input type="radio" name="shipping" /><span><b>◯&nbsp; Giao hàng nhanh</b><small>1 - 2 ngày</small></span><strong>30.000đ</strong></label></div></div><label className="checkout-note">Ghi chú đơn hàng (tùy chọn)<textarea placeholder="Ghi chú về đơn hàng, thời gian giao hàng mong muốn..." /></label><div className="checkout-navigation"><button type="button" onClick={() => setStep(1)}>← Quay lại</button><button className="checkout-next" type="submit">Tiếp tục thanh toán <span>→</span></button></div></>}
            {step === 3 && <div className="checkout-stage"><div className="checkout-panel-title"><span>03</span><div><h2>Phương thức thanh toán</h2><p>Chọn cách thanh toán thuận tiện cho bạn.</p></div></div><div className="payment-options"><label className={paymentMethod === "cod" ? "selected" : ""}><input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} /><span><b>Thanh toán khi nhận hàng</b><small>Kiểm tra hàng trước khi thanh toán</small></span><strong>COD</strong></label><label className={paymentMethod === "bank" ? "selected" : ""}><input type="radio" name="payment" value="bank" checked={paymentMethod === "bank"} onChange={() => setPaymentMethod("bank")} /><span><b>Chuyển khoản ngân hàng</b><small>Thông tin tài khoản hiển thị sau khi đặt hàng</small></span><strong>ATM</strong></label><label className={paymentMethod === "vnpay" ? "selected" : ""}><input type="radio" name="payment" value="vnpay" checked={paymentMethod === "vnpay"} onChange={() => setPaymentMethod("vnpay")} /><span><b>Ví điện tử / VNPay</b><small>Thanh toán nhanh và bảo mật</small></span><strong>ONLINE</strong></label></div><div className="checkout-navigation"><button type="button" onClick={() => setStep(2)}>← Quay lại</button><button className="checkout-next" type="submit">Xác nhận đặt hàng <span>✓</span></button></div></div>}
            {step === 4 && <div className="checkout-stage checkout-complete"><div className="checkout-complete-icon">✓</div><span className="section-kicker">ĐẶT HÀNG THÀNH CÔNG</span><h2>Cảm ơn bạn đã mua hàng</h2><p>Đơn hàng của bạn đã được tiếp nhận. Chúng tôi sẽ liên hệ để xác nhận thông tin giao hàng.</p>{completedOrder && <p className="checkout-order-code">Mã đơn: <b>{completedOrder.id}</b></p>}
              {newlyUnlockedVouchers.length > 0 && (
                <div className="checkout-voucher-unlocked">
                  <div className="checkout-voucher-unlocked-icon">🎁</div>
                  <div>
                    <strong>Chúc mừng! Bạn vừa mở khóa {newlyUnlockedVouchers.length > 1 ? `${newlyUnlockedVouchers.length} mã` : "mã"} giảm giá mới!</strong>
                    {newlyUnlockedVouchers.map(v => (
                      <div key={v.code} className="checkout-voucher-unlocked-item">
                        <span className="checkout-voucher-code">{v.code}</span>
                        <span>{v.desc}</span>
                      </div>
                    ))}
                    <small>Mã đã được chuyển vào mục <b>Ưu đãi hội viên</b> trong trang cá nhân của bạn.</small>
                  </div>
                </div>
              )}
              <div className="checkout-complete-actions"><button className="checkout-next checkout-invoice-button" type="button" onClick={printInvoice}>Xuất hóa đơn <span>▣</span></button><a className="checkout-next" href="/san-pham">Tiếp tục mua sắm <span>→</span></a></div></div>}
          </form>

          <aside className="checkout-summary">
            <h2>Đơn hàng của bạn <span>({items.reduce((count, item) => count + item.quantity, 0)} sản phẩm)</span></h2>
            <div className="checkout-items">{items.length ? items.map((item) => <div className="checkout-item" key={`${item.product.id}-${item.weight}`}><div className="checkout-item-image"><img src={item.product.image} alt="" /></div><div><strong>{item.product.name}</strong><small>{item.weight} <b>×{item.quantity}</b></small></div><span>{formatPrice(item.product.price * item.quantity)}</span></div>) : <p className="checkout-empty">Giỏ hàng của bạn đang trống.</p>}</div>
            <div className="checkout-totals"><div><span>Tạm tính</span><b>{formatPrice(subtotal)}</b></div><div><span>Khối lượng</span><b>{totalWeight}kg</b></div><div><span>Phí giao hàng</span><b>{shipping ? formatPrice(shipping) : "Miễn phí"}</b></div><div className="checkout-total"><strong>Tổng cộng</strong><b>{formatPrice(total)}</b></div></div>
            <div className="checkout-coupon"><label>Nhập mã giảm giá hoặc mã chương trình</label><div><input value={voucherCode} onChange={event => setVoucherCode(event.target.value)} placeholder="Nhập mã giảm giá" /><button type="button" onClick={applyPromotion}>Áp dụng</button>{(appliedVoucherCode || appliedPromotion) && <button type="button" className="checkout-coupon-remove" onClick={() => { setDiscount(0); setShippingFree(false); setAppliedVoucherCode(""); setAppliedPromotion(null); setCouponMessage("Đã bỏ ưu đãi."); }}>Bỏ ưu đãi</button>}</div>{couponMessage && <small>{couponMessage}</small>}</div>
            {step < 4 && <button className="checkout-submit" type="submit" form="checkout-form">{step === 1 ? "Đến thông tin giao hàng" : step === 2 ? "Tiếp tục thanh toán" : "Tiến hành thanh toán"} <span>♧</span></button>}
            <p className="checkout-secure">♙ &nbsp;Thông tin của bạn được bảo mật tuyệt đối</p>
          </aside>
        </div>
      </section>
      {completedOrder && <section className="print-invoice"><h1>VỊ NGUYÊN FOOD</h1><p style={{ textAlign: "center", margin: "4px 0 18px", color: "#555" }}>Cần Thơ, Việt Nam · Hotline: 1900 1234</p><h2>HÓA ĐƠN BÁN HÀNG</h2><p>Mã đơn: <b>{completedOrder.id}</b></p><p>Ngày lập: <b>{new Date(completedOrder.createdAt).toLocaleString("vi-VN")}</b></p><p>Khách hàng: <b>{completedOrder.customer}</b></p><p>Số điện thoại: <b>{completedOrder.phone}</b></p><p>Email: <b>{completedOrder.email || "Chưa cập nhật"}</b></p><p>Địa chỉ giao hàng: <b>{[completedOrder.address, completedOrder.ward, completedOrder.district, completedOrder.province].filter(Boolean).join(", ") || "Chưa cập nhật"}</b></p><p>Thanh toán: <b>{completedOrder.paymentMethod === "cod" ? "Thanh toán khi nhận hàng" : completedOrder.paymentMethod === "bank" ? "Chuyển khoản ngân hàng" : "Ví điện tử / VNPay"}</b></p><hr />{items.map(item => <div className="print-invoice-row" key={`${item.product.id}-${item.weight}`}><span>{item.product.name} ({item.weight}) × {item.quantity}</span><b>{formatPrice(item.product.price * item.quantity)}</b></div>)}<hr /><div className="print-invoice-row"><span>Tạm tính</span><b>{formatPrice(subtotal)}</b></div><div className="print-invoice-row"><span>Giảm giá</span><b>-{formatPrice(discount)}</b></div><div className="print-invoice-row"><span>Phí vận chuyển</span><b>{shipping ? formatPrice(shipping) : "Miễn phí"}</b></div><div className="print-invoice-total"><span>TỔNG THANH TOÁN</span><b>{formatPrice(total)}</b></div><p className="print-invoice-thanks">Cảm ơn quý khách đã mua hàng.</p></section>}
      <SiteFooter />
    </main>
  );
}
