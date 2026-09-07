"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CART_STORAGE_KEY, CartItem, Product, getCatalogProducts, getCatalogCategories, getPricePerKg, saveCartItems } from "./data";
import AuthModal, { USER_STORAGE_KEY } from "../components/AuthModal";
import SiteFooter from "../components/SiteFooter";
import BrandLogo from "../components/BrandLogo";
import SiteHeader from "../components/SiteHeader";
import styles from "./page.module.css";
import ProductCard from "../components/ProductCard";

const categories = ["Tất cả", "Gạo thơm", "Gạo trắng", "Gạo nếp", "Gạo lứt", "Gạo dinh dưỡng", "Combo"];
const sortOptions = [
  ["featured", "Nổi bật"],
  ["price-low", "Giá thấp → cao"],
  ["price-high", "Giá cao → thấp"],
  ["name", "Tên A-Z"],
  ["rating", "Đánh giá cao"],
  ["newest", "Mới nhất"],
];
const formatPrice = (price: number) => `${price.toLocaleString("vi-VN")}đ`;

function Stars({ rating }: { rating: number }) {
  return (
    <span className="catalog-stars" aria-label={`${rating} trên 5 sao`}>
      ★★★★★ <small>{rating.toFixed(1)}</small>
    </span>
  );
}



function ProductDetail({
  product,
  onClose,
  onQuickAdd,
}: {
  product: Product;
  onClose: () => void;
  onQuickAdd: () => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const gallery = [
    product.image,
    "/images/hinh gao2t25.jpg",
    "/images/st.png",
    "/images/rice-landscape.png",
  ];
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [weight, setWeight] = useState(product.weight);
  const [riceType, setRiceType] = useState("Gạo trắng");
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className="product-detail"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Đóng">
          ×
        </button>
        <div className="detail-gallery">
          <div className="detail-image">
            <img src={selectedImage} alt={product.name} />
          </div>
          <div className="detail-thumbnails">
            {gallery.map((image, index) => (
              <button
                className={selectedImage === image ? "is-selected" : ""}
                key={image}
                onClick={() => setSelectedImage(image)}
                aria-label={`Xem ảnh ${index + 1}`}
              >
                <img src={image} alt="" />
              </button>
            ))}
          </div>
          <div className="gallery-caption">
            <span>GAO NGON</span>
            <span>Thu hoạch đúng vụ · Đóng gói trong ngày</span>
          </div>
        </div>
        <div className="detail-copy">
          <span className="section-kicker">
            {product.category.toUpperCase()}
          </span>
          <h2>{product.name}</h2>
          <div className="detail-rating">
            <Stars rating={product.rating} />{" "}
            <span>{product.reviews} đánh giá</span>
          </div>
          <strong className="detail-price">
            {formatPrice(getPricePerKg(product))} <small>/ kg</small>
          </strong>
          <p className="detail-description">
            {product.note}. Hạt gạo được tuyển chọn từ vùng nguyên liệu tin cậy,
            xay xát và đóng gói cẩn thận để giữ trọn độ tươi ngon.
          </p>
          <div className="detail-badges">
            <span>✓ 100% hữu cơ</span>
            <span>✓ Chính hãng</span>
          </div>
          <div className="detail-meta">
            <span>
              <b>Xuất xứ</b>Hậu Giang, Việt Nam
            </span>
            <span>
              <b>Trọng lượng</b>5kg / túi
            </span>
            <span>
              <b>Bảo quản</b>12 tháng (chân không)
            </span>
            <span>
              <b>Tiêu chuẩn</b>VietGAP · VSATTP
            </span>
          </div>
          <div className="detail-promo">
            <strong>🎁 ƯU ĐÃI HÔM NAY</strong>
            <span>Miễn phí vận chuyển cho đơn hàng từ 500.000đ</span>
          </div>
          <div className="detail-option">
            <b>Khối lượng</b>
            {["2kg", "5kg", "10kg", "20kg"].map((item) => (
              <button key={item} className={weight === item ? "option-selected" : ""} onClick={() => setWeight(item)}>{item}</button>
            ))}
          </div>
          <div className="detail-option detail-rice-type">
            <b>Loại gạo</b>
            {["Gạo trắng", "Nguyên cám", "Gạo lứt"].map((item) => (
              <button key={item} className={riceType === item ? "option-selected" : ""} onClick={() => setRiceType(item)}>{item}</button>
            ))}
          </div>
          <div className="detail-buy">
            <b className="detail-quantity-label">Số lượng</b>
            <div className="quantity">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                −
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <button className="detail-add" onClick={onQuickAdd}>
              🛒 Thêm vào giỏ
            </button>
            <button className="buy-now" onClick={onQuickAdd}>
              Mua ngay
            </button>
            <span className="detail-stock">☑ Còn 248</span>
          </div>
          <div className="detail-trust">
            <span>
              🚚 <b>Giao hàng nhanh</b>
            </span>
            <span>
              🛡 <b>Chính hãng</b>
            </span>
            <span>
              ↩ <b>Đổi trả</b>
            </span>
            <span>🛡 <b>Chứng nhận VSATTP</b></span>
            <span>▣ <b>Thanh toán an toàn</b></span>
          </div>
          <div className="detail-accordions">
            <details>
              <summary>Thông tin sản phẩm</summary>
              <p>
                Gạo mới, nguyên chất, không chất bảo quản. Phù hợp cho cơm gia
                đình hàng ngày.
              </p>
            </details>
            <details>
              <summary>Cách nấu & bảo quản</summary>
              <p>
                Vo nhẹ 1 lần, tỷ lệ nước 1:1.1. Đậy kín sau khi mở và dùng trong
                30 ngày.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}

function QuickAdd({
  product,
  onClose,
  onAdded,
}: {
  product: Product;
  onClose: () => void;
  onAdded: (product: Product, quantity: number, weight: string) => void;
}) {
  const [weight, setWeight] = useState(product.weight);
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className="quick-add"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Đóng">
          ×
        </button>
        <div className="quick-product">
          <img src={product.image} alt="" />
          <div>
            <span className="section-kicker">THÊM NHANH</span>
            <h2>{product.name}</h2>
            <strong>{formatPrice(product.price)}</strong>
          </div>
        </div>
        <label>
          Khối lượng
          <select
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
          >
            <option>{product.weight}</option>
            <option>10kg</option>
          </select>
        </label>
        <label>
          Số lượng
          <div className="quantity">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              −
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
        </label>
        <button className="detail-add" onClick={() => onAdded(product, quantity, weight)}>
          Thêm vào giỏ · {formatPrice(product.price * quantity)}
        </button>
      </section>
    </div>
  );
}

function CartDropdown({ items, onClose, onRemove, onQuantityChange }: { items: { product: Product; quantity: number; weight: string }[]; onClose: () => void; onRemove: (id: number) => void; onQuantityChange: (id: number, change: number) => void }) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) onClose();
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [onClose]);
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  return <div ref={dropdownRef} className="cart-dropdown" role="dialog" aria-label="Giỏ hàng" onClick={(event) => event.stopPropagation()}>
    <div className="cart-dropdown-heading"><div><span className="section-kicker">GIỎ HÀNG CỦA BẠN</span><h2>Giỏ hàng</h2></div><button onClick={onClose} aria-label="Đóng giỏ hàng">×</button></div>
    {items.length === 0 ? <div className="cart-empty"><span>🛒</span><strong>Giỏ hàng đang trống</strong><p>Hãy chọn một món ngon cho bữa cơm nhà mình.</p><a href="#collection" onClick={onClose}>Khám phá sản phẩm <b>→</b></a></div> : <><div className="cart-items">{items.map(({ product, quantity, weight }) => <div className="cart-item" key={`${product.id}-${weight}`}><div className="cart-item-image"><img src={product.image} alt="" /></div><div className="cart-item-content"><strong>{product.name}</strong><small>{weight} · {formatPrice(product.price)}</small><div className="cart-item-bottom"><div className="cart-quantity"><button onClick={() => onQuantityChange(product.id, -1)} aria-label="Giảm số lượng">−</button><span>{quantity}</span><button onClick={() => onQuantityChange(product.id, 1)} aria-label="Tăng số lượng">+</button></div><b>{formatPrice(product.price * quantity)}</b></div></div><button className="cart-remove" onClick={() => onRemove(product.id)} aria-label={`Xóa ${product.name}`}>×</button></div>)}</div><div className="cart-summary"><div><span>Tạm tính</span><b>{formatPrice(subtotal)}</b></div><div><span>Phí vận chuyển</span><b>Miễn phí</b></div><div className="cart-grand-total"><span>Tổng cộng</span><strong>{formatPrice(subtotal)}</strong></div></div><div className="cart-actions"><a href="#collection" onClick={onClose}>Xem giỏ hàng</a><a href="/thanh-toan" onClick={onClose}>Thanh toán <span>→</span></a></div></>}
  </div>;
}

export default function ProductsPage() {
  const [category, setCategory] = useState("Tất cả");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [price, setPrice] = useState("all");
  const [weight, setWeight] = useState("all");
  const [visibleCount, setVisibleCount] = useState(8);
  const [wishes, setWishes] = useState<number[]>([]);
  const [detail, setDetail] = useState<Product | null>(null);
  const [quickProduct, setQuickProduct] = useState<Product | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartHydrated, setCartHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [catalogVersion, setCatalogVersion] = useState(0);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), 1000);
    return () => window.clearTimeout(timer);
  }, [query]);
  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 1000);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    setVisibleCount(8);
  }, [category, debouncedQuery, sort, price, weight]);
  useEffect(() => {
    const loadCart = () => {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY);
      const items: CartItem[] = stored ? JSON.parse(stored) : [];
      setCartItems(items);
      setCartCount(items.reduce((total, item) => total + item.quantity, 0));
      setCartHydrated(true);
    };
    const syncCatalog = () => setCatalogVersion((value) => value + 1);
    loadCart();
    window.addEventListener("storage", loadCart);
    window.addEventListener("gao-ngon-products-updated", syncCatalog);
    return () => {
      window.removeEventListener("storage", loadCart);
      window.removeEventListener("gao-ngon-products-updated", syncCatalog);
    };
  }, []);
  useEffect(() => {
    if (cartHydrated) saveCartItems(cartItems);
  }, [cartItems, cartHydrated]);
  const filteredProducts = useMemo(
    () =>
      getCatalogProducts()
        .filter((product) => {
          const text = `${product.name} ${product.category}`.toLowerCase();
          const categoryMatch =
            category === "Tất cả" || product.category === category;
          const priceMatch =
            price === "all" ||
            (price === "under100" && product.price < 100000) ||
            (price === "100to130" &&
              product.price >= 100000 &&
              product.price <= 130000) ||
            (price === "over130" && product.price > 130000);
          const weightMatch = weight === "all" || product.weight === weight;
          return (
            categoryMatch &&
            priceMatch &&
            weightMatch &&
            text.includes(debouncedQuery.toLowerCase())
          );
        })
        .sort((first, second) =>
          sort === "price-low"
            ? first.price - second.price
            : sort === "price-high"
              ? second.price - first.price
              : sort === "name"
                ? first.name.localeCompare(second.name)
                : sort === "rating"
                  ? second.rating - first.rating
                  : sort === "newest"
                    ? second.id - first.id
                    : first.id - second.id,
        ),
    [category, debouncedQuery, price, sort, weight, catalogVersion],
  );
  const shownProducts = filteredProducts.slice(0, visibleCount);
  const toggleWish = (id: number) =>
    setWishes((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  const addToCart = (product: Product, quantity: number, weight: string) => {
    if (!window.localStorage.getItem(USER_STORAGE_KEY)) {
      setAuthOpen(true);
      return;
    }

    setCartItems((items) => {
      const existing = items.find((item) => item.product.id === product.id && item.weight === weight);
      const nextItems = existing
        ? items.map((item) => item === existing ? { ...item, quantity: item.quantity + quantity } : item)
        : [...items, { product, quantity, weight }];

      setCartCount(nextItems.reduce((total, item) => total + item.quantity, 0));
      saveCartItems(nextItems);
      return nextItems;
    });
    setQuickProduct(null);
    setDetail(null);
  };
  const removeFromCart = (id: number) => {
    setCartItems((items) => {
      const removed = items.find((item) => item.product.id === id);
      const nextItems = items.filter((item) => item.product.id !== id);
      setCartCount(nextItems.reduce((total, item) => total + item.quantity, 0));
      saveCartItems(nextItems);
      return nextItems;
    });
  };
  const changeCartQuantity = (id: number, change: number) => {
    setCartItems((items) => {
      const nextItems = items.map((item) => {
        if (item.product.id !== id) return item;
        const nextQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: nextQuantity };
      });
      setCartCount(nextItems.reduce((total, item) => total + item.quantity, 0));
      saveCartItems(nextItems);
      return nextItems;
    });
  };
  return (
    <main className={`catalog-page ${styles.pageRoot}`}>
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
      <section className="catalog-hero">
        <div>
          <span className="section-kicker">TỪ CÁNH ĐỒNG ĐẾN MÂM CƠM</span>
          <h1>
            Bộ sưu tập
            <br />
            <em>gạo Việt.</em>
          </h1>
          <p>
            Tuyển chọn từ những vùng đất lành, đóng gói trong ngày để giữ trọn
            hương vị tự nhiên cho bữa cơm gia đình.
          </p>
        </div>
        <div className="catalog-hero-mark">
          <b>01</b>
          <span>
            GẠO NGON
            <br />
            MỖI NGÀY
          </span>
        </div>
      </section>
      <section className="catalog-content" id="collection">
        <div className="catalog-heading">
          <div>
            <span className="section-kicker">BỘ SƯU TẬP GẠO VIỆT</span>
            <h2>Chọn vị ngon cho nhà mình</h2>
          </div>
          <p>{filteredProducts.length} sản phẩm</p>
        </div>
        <div className="category-tabs" role="tablist">
          {categories.map((item) => (
            <button
              className={category === item ? "selected" : ""}
              key={item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="catalog-tools">
          <button
            className="mobile-filter-button"
            onClick={() => setMobileFilters(true)}
          >
            ☷ Bộ lọc
          </button>
          <div className="catalog-actions">
            <label className="catalog-search">
              <span>⌕</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm theo tên hoặc danh mục..."
                aria-label="Tìm sản phẩm"
              />
            </label>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sắp xếp"
            >
              {sortOptions.map(([value, label]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div
          className={`catalog-layout ${mobileFilters ? "filters-open" : ""}`}
        >
          <aside className="catalog-filters">
            <div className="filter-heading">
              <b>Bộ lọc</b>
              <button
                onClick={() => {
                  setPrice("all");
                  setWeight("all");
                  setCategory("Tất cả");
                }}
              >
                Xóa lọc
              </button>
            </div>
            <div className="filter-group">
              <div className="filter-group-title">Loại gạo</div>
              {categories.slice(1).map((item) => (
                <label key={item}>
                  <input
                    type="radio"
                    name="catalog-category"
                    checked={category === item}
                    onChange={() => setCategory(item)}
                  />
                  {item}
                </label>
              ))}
            </div>
            <div className="filter-group">
              <div className="filter-group-title">Khoảng giá</div>
              {[
                ["all", "Tất cả mức giá"],
                ["under100", "Dưới 100.000đ"],
                ["100to130", "100.000đ – 130.000đ"],
                ["over130", "Trên 130.000đ"],
              ].map(([value, label]) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="catalog-price"
                    checked={price === value}
                    onChange={() => setPrice(value)}
                  />
                  {label}
                </label>
              ))}
            </div>
            <div className="filter-group">
              <div className="filter-group-title">Khối lượng</div>
              {["all", "1kg", "2kg", "5kg", "10kg"].map((item) => (
                <label key={item}>
                  <input
                    type="radio"
                    name="catalog-weight"
                    checked={weight === item}
                    onChange={() => setWeight(item)}
                  />
                  {item === "all" ? "Tất cả" : item}
                </label>
              ))}
            </div>
            <button
              className="apply-filters"
              onClick={() => setMobileFilters(false)}
            >
              Xem kết quả
            </button>
          </aside>
          <div className="catalog-results">
            {isLoading ? (
              <div className="catalog-grid">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div className="catalog-skeleton" key={index} />
                ))}
              </div>
            ) : shownProducts.length ? (
              <div className="catalog-grid">
                {shownProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    wished={wishes.includes(product.id)}
                    onWish={() => toggleWish(product.id)}
                    onQuickAdd={() => setQuickProduct(product)}
                    onDetails={() => setDetail(product)}
                    onAddToCart={(p, qty) => addToCart(p, qty, p.weight)}
                  />
                ))}
              </div>
            ) : (
              <div className="catalog-empty">
                <span>⌕</span>
                <h3>Chưa tìm thấy hạt gạo phù hợp</h3>
                <p>Thử tìm kiếm với từ khóa khác hoặc xóa bớt bộ lọc nhé.</p>
                <button
                  onClick={() => {
                    setQuery("");
                    setCategory("Tất cả");
                    setPrice("all");
                    setWeight("all");
                  }}
                >
                  Xem tất cả sản phẩm
                </button>
              </div>
            )}
            {shownProducts.length < filteredProducts.length && (
              <button
                className="load-more"
                onClick={() => setVisibleCount((count) => count + 4)}
              >
                Xem thêm sản phẩm <span>↓</span>
              </button>
            )}
          </div>
        </div>
      </section>
      <section className="catalog-promise" id="story">
        <span className="promise-icon">✦</span>
        <div>
          <span className="section-kicker">LỜI HỨA TỪ GAO NGON</span>
          <h2>
            Để mỗi bữa cơm
            <br />
            <em>thêm trọn vị.</em>
          </h2>
        </div>
        <p>
          Gạo mới được chọn từ vùng nguyên liệu tin cậy, kiểm tra cẩn thận trước
          khi đến tay gia đình bạn.
        </p>
      </section>
      <SiteFooter />
      {mobileFilters && (
        <button
          className="sheet-dismiss"
          onClick={() => setMobileFilters(false)}
          aria-label="Đóng bộ lọc"
        />
      )}
      {detail && (
        <ProductDetail
          product={detail}
          onClose={() => setDetail(null)}
          onQuickAdd={() => setQuickProduct(detail)}
        />
      )}
      {quickProduct && (
        <QuickAdd
          product={quickProduct}
          onClose={() => setQuickProduct(null)}
          onAdded={addToCart}
        />
      )}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </main>
  );
}
