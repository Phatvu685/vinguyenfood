"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CART_STORAGE_KEY, CartItem, Product, getCatalogProducts, getPricePerKg, products as fallbackProducts, saveCartItems } from "../data";
import AuthModal, { USER_STORAGE_KEY } from "../../components/AuthModal";
import SiteFooter from "../../components/SiteFooter";
import BrandLogo from "../../components/BrandLogo";
import SiteHeader from "../../components/SiteHeader";
import styles from "./page.module.css";

const formatPrice = (price: number) => `${price.toLocaleString("vi-VN")}đ`;

type SubmittedReview = {
  rating: number;
  comment: string;
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="vigen-stars" aria-label={`${rating} trên 5 sao`}>
      ★★★★<i>★</i> <small>{rating.toFixed(1)}/5</small>
    </span>
  );
}

function Policy({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="vigen-policy">
      <span>{icon}</span>
      <div>
        <strong>{title}</strong>
        <small>{text}</small>
      </div>
    </div>
  );
}

export default function ProductLandingPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product>(() => {
    const productId = Number(id);
    return fallbackProducts.find((item) => item.id === productId) ?? fallbackProducts[0];
  });
  const [weight, setWeight] = useState(product.weight);
  const [riceType, setRiceType] = useState(product.category);
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartHydrated, setCartHydrated] = useState(false);
  const [notice, setNotice] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [wished, setWished] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [submittedReview, setSubmittedReview] = useState<SubmittedReview | null>(null);
  const images = [product.image].filter(Boolean);
  const price = getPricePerKg(product);
  const hasRealOriginalPrice = Boolean(product.originalPrice && product.originalPrice > product.price);
  useEffect(() => {
    const loadCart = () => {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY);
      const items: CartItem[] = stored ? JSON.parse(stored) : [];
      setCartItems(items);
      setCartCount(items.reduce((total, item) => total + item.quantity, 0));
      setCartHydrated(true);
    };

    const syncCatalog = () => {
      const storedProducts = getCatalogProducts();
      const productId = Number(id);
      const nextProduct = storedProducts.find((item) => item.id === productId) ?? storedProducts[0] ?? fallbackProducts[0];
      setProduct(nextProduct);
    };

    loadCart();
    syncCatalog();
    window.addEventListener("storage", loadCart);
    window.addEventListener("storage", syncCatalog);
    window.addEventListener("gao-ngon-products-updated", syncCatalog);

    return () => {
      window.removeEventListener("storage", loadCart);
      window.removeEventListener("storage", syncCatalog);
      window.removeEventListener("gao-ngon-products-updated", syncCatalog);
    };
  }, [id]);

  useEffect(() => {
    setWeight(product.weight);
    setRiceType(product.category);
    setSelectedImage(product.image);
  }, [product]);
  useEffect(() => {
    if (cartHydrated) window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems, cartHydrated]);

  const addProductToCart = (buyNow = false) => {
    if (!window.localStorage.getItem(USER_STORAGE_KEY)) {
      setAuthOpen(true);
      return;
    }

    const nextItems = (() => {
      const existing = cartItems.find((item) => item.product.id === product.id && item.weight === weight);
      if (existing) {
        return cartItems.map((item) => item.product.id === product.id && item.weight === weight
          ? { ...item, quantity: item.quantity + quantity }
          : item);
      }
      return [...cartItems, { product, quantity, weight }];
    })();

    setCartItems(nextItems);
    setCartCount(nextItems.reduce((total, item) => total + item.quantity, 0));
    saveCartItems(nextItems);

    if (buyNow) {
      window.location.href = "/thanh-toan";
      return;
    }

    setNotice("Đã thêm sản phẩm vào giỏ");
  };
  const cartSubtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const removeFromCart = (id: number) => {
    setCartItems((items) => items.filter((item) => item.product.id !== id));
    setCartCount((count) => Math.max(0, count - (cartItems.find((item) => item.product.id === id)?.quantity ?? 0)));
  };
  const changeCartQuantity = (id: number, change: number) => {
    setCartItems((items) => items.map((item) => {
      if (item.product.id !== id) return item;
      const nextQuantity = Math.max(1, item.quantity + change);
      setCartCount((count) => Math.max(0, count + nextQuantity - item.quantity));
      return { ...item, quantity: nextQuantity };
    }));
  };

  return (
    <main className={`vigen-page ${styles.pageRoot}`}>
      <div className="topbar">
        <div className="topbar-track">
          <div>🚚 Giao hàng toàn quốc</div>
          <div>🛡 Kiểm tra hàng trước khi thanh toán</div>
          <div>♧ Tư vấn 24/7: 1900 1234</div>
          <div>🚚 Giao hàng toàn quốc</div>
          <div>🛡 Kiểm tra hàng trước khi thanh toán</div>
          <div>♧ Tư vấn 24/7: 1900 1234</div>
        </div>
      </div>
      <SiteHeader active="products" />
      {cartOpen && <div className="cart-dropdown landing-cart-popover" role="dialog" aria-label="Giỏ hàng" onClick={(event) => event.stopPropagation()}><div className="cart-dropdown-heading"><div><span className="section-kicker">GIỎ HÀNG CỦA BẠN</span><h2>Giỏ hàng</h2></div><button onClick={() => setCartOpen(false)} aria-label="Đóng giỏ hàng">×</button></div>{cartItems.length === 0 ? <div className="cart-empty"><span>🛒</span><strong>Giỏ hàng đang trống</strong><p>Hãy chọn một món ngon cho bữa cơm nhà mình.</p></div> : <><div className="cart-items">{cartItems.map(({ product: cartProduct, quantity: cartQuantity, weight: cartWeight }) => <div className="cart-item" key={`${cartProduct.id}-${cartWeight}`}><div className="cart-item-image"><img src={cartProduct.image} alt="" /></div><div className="cart-item-content"><strong>{cartProduct.name}</strong><small>{cartWeight} · {formatPrice(cartProduct.price)}</small><div className="cart-item-bottom"><div className="cart-quantity"><button onClick={() => changeCartQuantity(cartProduct.id, -1)} aria-label="Giảm số lượng">−</button><span>{cartQuantity}</span><button onClick={() => changeCartQuantity(cartProduct.id, 1)} aria-label="Tăng số lượng">+</button></div><b>{formatPrice(cartProduct.price * cartQuantity)}</b></div></div><button className="cart-remove" onClick={() => removeFromCart(cartProduct.id)} aria-label={`Xóa ${cartProduct.name}`}>×</button></div>)}</div><div className="cart-summary"><div><span>Tạm tính</span><b>{formatPrice(cartSubtotal)}</b></div><div><span>Phí vận chuyển</span><b>Miễn phí</b></div><div className="cart-grand-total"><span>Tổng cộng</span><strong>{formatPrice(cartSubtotal)}</strong></div></div></>}<div className="cart-actions"><a href="/san-pham" onClick={() => setCartOpen(false)}>Xem giỏ hàng</a><a href="/thanh-toan" onClick={() => setCartOpen(false)}>Thanh toán <span>→</span></a></div></div>}
      <div className="vigen-breadcrumb">
        <a href="/">Trang chủ</a>
        <span>/</span>
        <a href="/san-pham">Sản phẩm</a>
        <span>/</span>
        <b>{product.name}</b>
      </div>
      <section className="vigen-product-hero">
        <div className="vigen-gallery">
          <div className="vigen-main-image">
            <span className="vigen-gallery-label">GAO NGON</span>
            <img src={selectedImage} alt={product.name} />
          </div>
          <div className="vigen-thumbs">
            {images.map((image) => (
              <button
                key={image}
                className={selectedImage === image ? "selected" : ""}
                onClick={() => setSelectedImage(image)}
              >
                <img src={image} alt="" />
              </button>
            ))}
          </div>
          <div className="vigen-gallery-note">
            <span>Ảnh sản phẩm thực tế</span>
            <span>Thu hoạch đúng vụ · Đóng gói trong ngày</span>
          </div>
          <div className="vigen-policies">
            <Policy icon="🚚" title="Giao hàng nhanh" text="HCM 2h · Toàn quốc 2–3 ngày" />
            <Policy icon="↩" title="Đổi trả miễn phí" text="Trong vòng 7 ngày" />
            <Policy icon="🛡" title="Chứng nhận VSATTP" text="Bộ Y tế Việt Nam" />
            <Policy icon="▣" title="Thanh toán an toàn" text="VNPay · Momo · COD" />
          </div>
        </div>
        <div className="vigen-summary">
          <span className="vigen-kicker">{product.category} · GAO NGON</span>
          <h1>{product.name}</h1>
          <div className="vigen-rating">
            <Stars rating={product.rating} />
            <span>{product.reviews} đánh giá</span>
            <i>·</i>
            <span>Đã bán 1,280+</span>
          </div>
          <div className="vigen-price">
            <strong>{price.toLocaleString("vi-VN")}đ</strong>
            {hasRealOriginalPrice && (
              <del>{product.originalPrice?.toLocaleString("vi-VN")}đ</del>
            )}
          </div>
          <p className="vigen-lead">
            {product.note}. Hạt gạo được tuyển chọn từ vùng nguyên liệu tin cậy,
            xay xát và đóng gói cẩn thận để giữ trọn độ tươi ngon.
          </p>
          <div className="vigen-facts">
            <div>
              <span>Xuất xứ</span>
              <strong>Việt Nam</strong>
            </div>
            <div>
              <span>Trọng lượng</span>
              <strong>{product.weight} / túi</strong>
            </div>
            <div>
              <span>Bảo quản</span>
              <strong>12 tháng</strong>
            </div>
            <div>
              <span>Tiêu chuẩn</span>
              <strong>VietGAP · VSATTP</strong>
            </div>
          </div>
          <div className="vigen-badges">
            <span>✓ Chính hãng</span>
            <span>✦ Hữu cơ</span>
            <span>⌁ Nguồn gốc rõ ràng</span>
          </div>
          <div className="vigen-offer">
            <strong>🎁 ƯU ĐÃI HÔM NAY</strong>
            <span>Miễn phí vận chuyển cho đơn hàng từ 500.000đ</span>
          </div>
          <div className="vigen-choice">
            <label>Khối lượng</label>
            <div>
              {["2kg", "5kg", "10kg", "20kg"].map((item) => (
                <button
                  key={item}
                  className={weight === item ? "selected" : ""}
                  onClick={() => setWeight(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="vigen-choice vigen-rice-type">
            <label>Loại gạo</label>
            <div>
              {[...new Set([product.category, "Nguyên cám", "Gạo lứt"])].map((item) => (
                <button key={item} className={riceType === item ? "selected" : ""} onClick={() => setRiceType(item)}>{item}</button>
              ))}
            </div>
          </div>
          <div className="vigen-buy">
            <label className="vigen-quantity-label">Số lượng</label>
            <div className="vigen-quantity">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                −
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <span className="vigen-stock">☑ Còn 248</span>
            <button className="vigen-cart" onClick={() => addProductToCart()}>🛒 Thêm vào giỏ</button>
            <button className="vigen-buy-now" onClick={() => addProductToCart(true)}>
              Mua ngay <span>→</span>
            </button>
          </div>
        </div>
      </section>
      <div className="vigen-trust-strip">
        <div className="vigen-trust-item"><i>🌿</i><div><b>100%</b><strong>NGUYÊN CHẤT</strong><small>Không pha trộn, không tạp chất</small></div></div>
        <div className="vigen-trust-item"><i>★</i><div><b>{product.rating}/5</b><strong>ĐÁNH GIÁ</strong><small>Hơn 1.280+ khách hàng tin dùng</small></div></div>
        <div className="vigen-trust-item"><i>🛡</i><div><b>01</b><strong>QUY TRÌNH MINH BẠCH</strong><small>Từ đồng ruộng đến bữa cơm</small></div></div>
        <div className="vigen-trust-item"><i>24/7</i><div><b>24/7</b><strong>HỖ TRỢ TẬN TÂM</strong><small>Đồng hành cùng khách hàng</small></div></div>
      </div>
      <section className="vigen-section vigen-story-section">
        <div className="vigen-story-visual" aria-hidden="true" />
        <div className="vigen-story-copy">
          <div className="vigen-section-heading">
            <span>01 · Chi tiết sản phẩm</span>
            <h2>Trọn vị tự nhiên <em>cho bữa cơm nhà</em></h2>
          </div>
          <div className="vigen-story-text">
            <p>{product.note}. Sản phẩm được chọn lọc từ vùng nguyên liệu phù hợp, kiểm tra kỹ trước khi đóng gói.</p>
            <p>Hương thơm tự nhiên, cơm mềm dẻo và phù hợp cho những bữa ăn hàng ngày của gia đình.</p>
          </div>
          <a className="vigen-story-action" href="#process">🌾 XEM QUY TRÌNH SẢN XUẤT <span>→</span></a>
        </div>
        <div className="vigen-story-benefits">
          <div><i>🌿</i><p><b>NGUỒN GỐC RÕ RÀNG</b><span>Gạo được thu hoạch từ những vùng đất màu mỡ, phù hợp.</span></p></div>
          <div><i>◒</i><p><b>CHỌN LỌC KỸ CÀNG</b><span>Hạt gạo được sàng lọc nhiều lần để loại bỏ tạp chất, hạt lép.</span></p></div>
          <div><i>⌕</i><p><b>KIỂM TRA CHẤT LƯỢNG</b><span>Kiểm tra nghiêm ngặt trước khi đóng gói và xuất kho.</span></p></div>
          <div><i>♨</i><p><b>VỊ NGON TỰ NHIÊN</b><span>Cơm thơm, mềm dẻo, vị ngọt hậu đậm đà hương vị tự nhiên.</span></p></div>
        </div>
      </section>
      <div className="vigen-detail-panels">
        <section className="vigen-section vigen-info-panel">
          <div className="vigen-section-heading">
            <span>02 · Thông tin minh bạch</span>
            <h2>Thông số & dinh dưỡng</h2>
          </div>
          <div className="vigen-data-grid">
            <div className="vigen-spec-card">
              <h3>Thông số sản phẩm</h3>
              <dl>
                <dt>Loại gạo</dt>
                <dd>{product.category}</dd>
                <dt>Khối lượng</dt>
                <dd>2kg / 5kg / 10kg / 20kg</dd>
                <dt>Xuất xứ</dt>
                <dd>Việt Nam</dd>
                <dt>Hạn sử dụng</dt>
                <dd>12 tháng từ ngày đóng gói</dd>
              </dl>
            </div>
            <div className="vigen-spec-card">
              <h3>
                Bảng dinh dưỡng <small>trong 100g</small>
              </h3>
              <div className="vigen-nutrition">
                <span>
                  <b>350</b>
                  <small>kcal</small>
                </span>
                <span>
                  <b>7.5g</b>
                  <small>đạm</small>
                </span>
                <span>
                  <b>3.2g</b>
                  <small>chất xơ</small>
                </span>
                <span>
                  <b>0.9g</b>
                  <small>chất béo</small>
                </span>
              </div>
            </div>
          </div>
        </section>
        <section className="vigen-section vigen-guide-panel" id="process">
          <div className="vigen-section-heading">
            <span>03 · Hướng dẫn</span>
            <h2>Nấu ngon và bảo quản đúng cách</h2>
          </div>
          <div className="vigen-guide-grid">
            <div>
              <span>🍚</span>
              <h3>Cách nấu</h3>
              <p>Vo nhẹ 1 lần, ngâm 20 phút, thêm nước theo tỷ lệ 1:1.2.</p>
            </div>
            <div>
              <span>◌</span>
              <h3>Bảo quản</h3>
              <p>Đậy kín miệng túi, đặt nơi khô ráo, thoáng mát.</p>
            </div>
            <div>
              <span>♡</span>
              <h3>An tâm sử dụng</h3>
              <p>Chọn gạo mới, nguyên chất cho bữa cơm mỗi ngày.</p>
            </div>
          </div>
        </section>
      </div>
      <section className="prv-section" id="reviews">
        {/* ── Header ── */}
        <div className="prv-header">
          <span className="prv-kicker">⭐ ĐÁNH GIÁ KHÁCH HÀNG</span>
          <h2 className="prv-title">
            Khách hàng nói gì<br /><em>về sản phẩm?</em>
          </h2>
        </div>

        <div className="prv-body">
          {/* ── LEFT: Score + Bars + Form ── */}
          <div className="prv-left">

            {/* Score Overview */}
            <div className="prv-score-card">
              <div className="prv-score-main">
                <span className="prv-score-num">{product.rating.toFixed(1)}</span>
                <span className="prv-score-den">/5</span>
              </div>
              <div className="prv-stars">★★★★★</div>
              <p className="prv-score-sub">{product.reviews} đánh giá</p>
              <div className="prv-bars">
                {[{ s: 5, p: 82 }, { s: 4, p: 14 }, { s: 3, p: 4 }, { s: 2, p: 0 }, { s: 1, p: 0 }].map(({ s, p }) => (
                  <div key={s} className="prv-bar-row">
                    <span className="prv-bar-lbl">{s} sao</span>
                    <div className="prv-bar-track"><div className="prv-bar-fill" style={{ width: `${p}%` }} /></div>
                    <span className="prv-bar-pct">{p}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Write Review */}
            <div className="prv-write-card">
              <p className="prv-write-title">✍️ Viết đánh giá của bạn</p>
              {reviewOpen ? (
                <form
                  className="prv-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    setSubmittedReview({
                      rating: Number(formData.get("rating") || 5),
                      comment: String(formData.get("comment") || "").trim(),
                    });
                    setReviewOpen(false);
                    setReviewSubmitted(true);
                  }}
                >
                  <div className="prv-field">
                    <label className="prv-label">Đánh giá của bạn</label>
                    <select className="prv-select" name="rating" defaultValue="5">
                      <option value="5">★★★★★ · Rất hài lòng</option>
                      <option value="4">★★★★ · Hài lòng</option>
                      <option value="3">★★★ · Bình thường</option>
                      <option value="2">★★ · Không hài lòng</option>
                      <option value="1">★ · Rất tệ</option>
                    </select>
                  </div>
                  <div className="prv-field">
                    <label className="prv-label">Chia sẻ cảm nhận</label>
                    <textarea className="prv-textarea" name="comment" placeholder="Gạo có hợp khẩu vị của bạn không?..." minLength={10} required rows={3} />
                  </div>
                  <div className="prv-form-actions">
                    <button type="button" className="prv-btn-ghost" onClick={() => setReviewOpen(false)}>Hủy</button>
                    <button type="submit" className="prv-btn-gold">Gửi đánh giá →</button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  className="prv-open-btn"
                  onClick={() => { setReviewOpen(true); setReviewSubmitted(false); }}
                >
                  + Viết đánh giá ngay
                </button>
              )}
              {reviewSubmitted && (
                <div className="prv-success">
                  🎉 Cảm ơn bạn! Bình luận đã được hiển thị ngay.
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Review Cards ── */}
          <div className="prv-right">
            <div className="prv-cards">
              <article className="prv-card">
                <header className="prv-card-header">
                  <div className="prv-avatar" style={{ background: "#4f7c5a" }}>MA</div>
                  <div className="prv-card-meta">
                    <strong>Minh Anh</strong>
                    <span>12/08/2025</span>
                  </div>
                  <div className="prv-card-stars">★★★★★</div>
                </header>
                <p className="prv-card-comment">"Gạo thơm, hạt đều và cơm dẻo. Gia đình mình ăn rất hợp, sẽ mua lại."</p>
                <span className="prv-verified">✔ Đã mua hàng</span>
              </article>
              <article className="prv-card">
                <header className="prv-card-header">
                  <div className="prv-avatar" style={{ background: "#7a5f3a" }}>TH</div>
                  <div className="prv-card-meta">
                    <strong>Thanh Hương</strong>
                    <span>08/08/2025</span>
                  </div>
                  <div className="prv-card-stars">★★★★★</div>
                </header>
                <p className="prv-card-comment">"Đóng gói cẩn thận, giao nhanh. Cơm để nguội vẫn mềm và thơm."</p>
                <span className="prv-verified">✔ Đã mua hàng</span>
              </article>
              <article className="prv-card">
                <header className="prv-card-header">
                  <div className="prv-avatar" style={{ background: "#3a6878" }}>HN</div>
                  <div className="prv-card-meta">
                    <strong>Hoàng Nam</strong>
                    <span>01/08/2025</span>
                  </div>
                  <div className="prv-card-stars">★★★★★</div>
                </header>
                <p className="prv-card-comment">"Mình đã mua lại ST25 lần thứ ba rồi. Chất lượng ổn định, không bao giờ thất vọng."</p>
                <span className="prv-verified">✔ Đã mua hàng</span>
              </article>
              {submittedReview && (
                <article className="prv-card">
                  <header className="prv-card-header">
                    <div className="prv-avatar" style={{ background: "#b8903a" }}>BẠN</div>
                    <div className="prv-card-meta">
                      <strong>Khách hàng mới</strong>
                      <span>Vừa đăng</span>
                    </div>
                    <div className="prv-card-stars">{"★".repeat(submittedReview.rating)}</div>
                  </header>
                  <p className="prv-card-comment">&quot;{submittedReview.comment}&quot;</p>
                  <span className="prv-verified">✔ Hiển thị ngay</span>
                </article>
              )}
            </div>
          </div>
        </div>
      </section>
      {notice && <div className="vigen-toast" role="status">✓ {notice}<button onClick={() => setNotice("")} aria-label="Đóng thông báo">×</button></div>}
      <SiteFooter />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </main>
  );
}
