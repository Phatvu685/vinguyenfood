"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "./components/AuthModal";
import { USER_STORAGE_KEY } from "./components/AuthModal";
import CartPopover from "./components/CartPopover";
import SiteFooter from "./components/SiteFooter";
import BrandLogo from "./components/BrandLogo";
import SiteHeader from "./components/SiteHeader";
import { CART_STORAGE_KEY, getCartItems, getCatalogProducts, products as defaultProducts, saveCartItems, type Product } from "./san-pham/data";
import ProductCard from "./components/ProductCard";
import styles from "./page.module.css";


const Icon = ({ children }: { children: React.ReactNode }) => (
  <span className="icon">{children}</span>
);

type AuthUser = { name: string; phone: string };

type QuickProduct = {
  id: number;
  name: string;
  image: string;
  price: number;
  weight: string;
};

const defaultHeroSlides = [
  { background: "/images/rice-landscape.png", product: "/images/st25.png.jpg", eyebrow: "TINH HOA HẠT GẠO", title: "VỊ NGUYÊN FOOD", script: "Từ thiên nhiên - Trọn vị yêu thương", description: "Chọn lọc từ những hạt gạo chất lượng nhất,\nmang đến bữa cơm dẻo thơm, trọn vị cho gia đình bạn." },
  { background: "/images/product-field.jpg", product: "/images/st.png", eyebrow: "HẠT GẠO TỪ ĐỒNG XANH", title: "MÙA VÀNG\nVIỆT NAM", script: "Gom nắng vào từng hạt cơm", description: "Nguồn gạo chọn lọc từ vùng nguyên liệu sạch,\ngiữ trọn vị thơm ngon trong mỗi bữa ăn." },
  { background: "/images/banner1.jpg", product: "/images/hinh gao2t25.jpg", eyebrow: "BỮA CƠM TRỌN VỊ", title: "GẠO NGON\nCHO NHÀ MÌNH", script: "Dẻo thơm mỗi ngày", description: "Những lựa chọn chất lượng cho gia đình hiện đại,\ntiện lợi, an tâm và đậm đà hương vị Việt." },
];
const heroContentKey = "gao-ngon-hero-slides";
const memberOfferKey = "gao-ngon-member-offer";
const defaultMemberOffer = {
  title: "ƯU ĐÃI HỘI VIÊN",
  label: "GIẢM NGAY",
  discount: "100K - 500K",
  condition: "Đơn hàng từ 1.000.000đ",
  button: "XEM NGAY",
  href: "/user",
};
type HeroSlide = (typeof defaultHeroSlides)[number];
type MemberOffer = typeof defaultMemberOffer;

function QuickAddModal({
  product,
  onClose,
  onAdded,
}: {
  product: QuickProduct;
  onClose: () => void;
  onAdded: (product: QuickProduct, quantity: number, weight: string) => void;
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
          <img src={product.image} alt={product.name} />
          <div>
            <span className="section-kicker">THÊM NHANH</span>
            <h2>{product.name}</h2>
            <strong>{product.price.toLocaleString("vi-VN")}đ</strong>
          </div>
        </div>
        <label>
          Khối lượng
          <select value={weight} onChange={(event) => setWeight(event.target.value)}>
            <option>{product.weight}</option>
            <option>10kg</option>
          </select>
        </label>
        <label>
          Số lượng
          <div className="quantity">
            <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button>
            <span>{quantity}</span>
            <button type="button" onClick={() => setQuantity((value) => value + 1)}>+</button>
          </div>
        </label>
        <button className="detail-add" onClick={() => onAdded(product, quantity, weight)}>
          Thêm vào giỏ · {(product.price * quantity).toLocaleString("vi-VN")}đ
        </button>
      </section>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [wished, setWished] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quickProduct, setQuickProduct] = useState<QuickProduct | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(defaultProducts);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(defaultHeroSlides);
  const [memberOffer, setMemberOffer] = useState<MemberOffer>(defaultMemberOffer);

  useEffect(() => {
    const syncCartCount = () => {
      const cart = getCartItems();
      setCartCount(cart.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0));
    };

    // Đọc user từ localStorage khi trang load
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    if (saved) setUser(JSON.parse(saved));
    syncCartCount();

    const syncCatalog = () => {
      setCatalogProducts(getCatalogProducts());
    };
    const syncHero = () => {
      const saved = window.localStorage.getItem(heroContentKey);
      if (saved) {
        try { setHeroSlides(JSON.parse(saved) as HeroSlide[]); } catch { /* Keep defaults when stored content is invalid. */ }
      }
    };
    const syncMemberOffer = () => {
      const saved = window.localStorage.getItem(memberOfferKey);
      if (saved) {
        try { setMemberOffer({ ...defaultMemberOffer, ...JSON.parse(saved) }); } catch { /* Keep defaults when stored content is invalid. */ }
      }
    };

    syncCatalog();
    syncHero();
    syncMemberOffer();

    window.addEventListener("gao-ngon-cart-updated", syncCartCount);
    window.addEventListener("gao-ngon-products-updated", syncCatalog);
    window.addEventListener("gao-ngon-content-updated", syncHero);
    window.addEventListener("gao-ngon-member-offer-updated", syncMemberOffer);
    window.addEventListener("storage", syncCartCount);

    const sections = document.querySelectorAll<HTMLElement>(".scroll-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      { threshold: 0.12 },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
      window.removeEventListener("gao-ngon-cart-updated", syncCartCount);
      window.removeEventListener("gao-ngon-products-updated", syncCatalog);
      window.removeEventListener("gao-ngon-content-updated", syncHero);
      window.removeEventListener("gao-ngon-member-offer-updated", syncMemberOffer);
      window.removeEventListener("storage", syncCartCount);
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((slide) => (slide + 1) % heroSlides.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  function addProductToCart(product: QuickProduct, quantity = 1, weight = product.weight) {
    if (!localStorage.getItem(USER_STORAGE_KEY)) {
      setAuthOpen(true);
      return;
    }

    const stored = getCartItems();
    const itemWeight = weight || product.weight;
    const normalizedProduct: Product = {
      id: product.id,
      name: product.name,
      category: "Gạo",
      price: product.price,
      image: product.image,
      note: "",
      reviews: 0,
      rating: 5,
      weight: itemWeight,
      badge: "",
      originalPrice: product.price,
      discount: 0,
      origin: "",
      storage: "",
      standard: "",
      tags: "",
      stock: 99,
      sold: 0,
    };

    const existing = stored.find((item) => item.product.id === product.id && item.weight === itemWeight);
    const nextCart = existing
      ? stored.map((item) => item.product.id === product.id && item.weight === itemWeight ? { ...item, quantity: item.quantity + quantity } : item)
      : [...stored, { product: normalizedProduct, quantity, weight: itemWeight }];

    saveCartItems(nextCart);
    setCartCount(nextCart.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0));
    setQuickProduct(null);
  }


  return (
    <main className={`site ${styles.pageRoot}`}>
      <div className="topbar">
        <div className="topbar-track">
          <div><Icon>🚚</Icon> Giao hàng toàn quốc</div>
          <div><Icon>🛡</Icon> Kiểm tra hàng trước khi thanh toán</div>
          <div><Icon>♧</Icon> Tư vấn 24/7: 1900 1234</div>
          <div><Icon>🚚</Icon> Giao hàng toàn quốc</div>
          <div><Icon>🛡</Icon> Kiểm tra hàng trước khi thanh toán</div>
          <div><Icon>♧</Icon> Tư vấn 24/7: 1900 1234</div>
        </div>
      </div>

      <SiteHeader active="home" />

      <section className="hero">
        <div key={`hero-bg-${activeSlide}`} className="hero-bg" style={{ backgroundImage: `linear-gradient(90deg, rgba(5, 17, 11, .52), rgba(5, 17, 11, .12) 55%, rgba(5, 17, 11, .32)), url("${heroSlides[activeSlide].background}")` }} />
        <button className="slider-arrow left" type="button" onClick={() => setActiveSlide((activeSlide - 1 + heroSlides.length) % heroSlides.length)} aria-label="Ảnh trước">‹</button>
        <button className="slider-arrow right" type="button" onClick={() => setActiveSlide((activeSlide + 1) % heroSlides.length)} aria-label="Ảnh tiếp theo">›</button>

        <div key={`hero-content-${activeSlide}`} className="hero-content">
          <div className="hero-copy">
            <div className="eyebrow">{heroSlides[activeSlide].eyebrow}</div>
            <h1>{heroSlides[activeSlide].title.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h1>
            <div className="hero-script">{heroSlides[activeSlide].script}</div>
            <p>{heroSlides[activeSlide].description.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</p>

            <div className="quality">
              <div><b>♧</b><strong>100%</strong><small>Gạo mới</small></div>
              <div><b>✓</b><strong>Không chất</strong><small>bảo quản</small></div>
              <div><b>♡</b><strong>An toàn cho</strong><small>sức khỏe</small></div>
            </div>

            <button className="gold-button">KHÁM PHÁ NGAY　→</button>
          </div>

          <div className="hero-product">
            {heroSlides[activeSlide].product && <img src={heroSlides[activeSlide].product} alt="Gạo ngon" />}
          </div>

          <div className="member-box">
            <strong>♛ {memberOffer.title}</strong>
            <hr />
            <span>{memberOffer.label}</span>
            <b>{memberOffer.discount}</b>
            <small>{memberOffer.condition}</small>
            <button type="button" onClick={() => router.push(memberOffer.href)}>{memberOffer.button}　→</button>
          </div>
        </div>

        <div className="slider-dots" aria-label="Chọn ảnh hero">{heroSlides.map((slide, index) => <button key={slide.title} type="button" className={index === activeSlide ? "active" : ""} onClick={() => setActiveSlide(index)} aria-label={`Chọn ảnh ${index + 1}`} />)}</div>
      </section>

      <section className="services scroll-reveal">
        <div><span className="service-icon">🚚</span><p><b>GIAO HÀNG TOÀN QUỐC</b><small>Giao nhanh chóng,<br />an toàn, tận nơi</small></p></div>
        <div><span className="service-icon">▣</span><p><b>THANH TOÁN AN TOÀN</b><small>Nhiều hình thức thanh toán<br />tiện lợi</small></p></div>
        <div><span className="service-icon">✥</span><p><b>CAM KẾT CHẤT LƯỢNG</b><small>Hạt gạo ngon, nguyên chất,<br />nguồn gốc rõ ràng</small></p></div>
        <div><span className="service-icon">♧</span><p><b>TƯ VẤN NHIỆT TÌNH</b><small>Hỗ trợ 24/7, giải đáp<br />mọi thắc mắc</small></p></div>
      </section>

      <section className="products-section scroll-reveal">
        <div className="section-heading">
          <div>
            <h2>⌁ SẢN PHẨM NỔI BẬT ⌁</h2>
            <p>Khám phá những hạt gạo được yêu thích nhất</p>
          </div>
          <a href="/san-pham">Xem tất cả　→</a>
        </div>

        <div className="products">
          {catalogProducts.slice(0, 4).map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              wished={false}
              onWish={() => {}}
              onDetails={() => window.location.assign(`/san-pham/${product.id}`)}
              onAddToCart={(p, qty) => addProductToCart(p as any, qty, p.weight)}
            />
          ))}
        </div>
      </section>

      <section className="promotions scroll-reveal">
        <div className="promo-card seasonal">
          <h3>GẠO MỚI<br />VỤ MÙA</h3>
          <p>Dẻo thơm tự nhiên<br />Ngọt cơm, đậm đà</p>
          <button>KHÁM PHÁ NGAY　→</button>
        </div>
        <div className="promo-card combo">
          <h3>COMBO TIẾT KIỆM</h3>
          <em>Cho gia đình</em>
          <p>Tiết kiệm hơn<br />khi mua combo</p>
          <button>XEM COMBO　→</button>
          <div className="discount">TIẾT<br />KIỆM<br />15%</div>
        </div>
        <div className="promo-card food">
          <h3>MÓN NGON<br />TỪ GẠO</h3>
          <p>Gợi ý nhiều món ngon<br />dễ làm mỗi ngày</p>
          <button>KHÁM PHÁ NGAY　→</button>
        </div>
      </section>

      <section className="new-season scroll-reveal">
        <div className="season-copy">
          <span className="section-kicker">HƯƠNG VỊ VỪA VỀ</span>
          <h2>GẠO MỚI<br /><em>VỤ MÙA</em></h2>
          <p>Những hạt gạo đầu mùa được tuyển chọn từ vùng đất màu mỡ, giữ trọn độ dẻo thơm và vị ngọt tự nhiên trong từng bữa cơm.</p>
          <button className="gold-button">THỬ VỊ GẠO MỚI　→</button>
        </div>
        <div className="season-stats">
          <div><strong>01</strong><span>Thu hoạch<br />đúng vụ</span></div>
          <div><strong>03</strong><span>Vùng nguyên<br />liệu chọn lọc</span></div>
          <div><strong>100%</strong><span>Hương thơm<br />tự nhiên</span></div>
        </div>
      </section>

      <section className="why-section scroll-reveal">
        <div className="section-title-centered">
          <span className="section-kicker">ĐIỀU LÀM NÊN SỰ KHÁC BIỆT</span>
          <h2>VÌ SAO CHỌN GẠO NGON?</h2>
          <p>Từ cánh đồng đến căn bếp, mỗi bước đều được chăm chút để hạt gạo đến tay bạn ở trạng thái tốt nhất.</p>
        </div>
        <div className="why-grid">
          <article><span>✦</span><h3>Chọn từ vùng đất lành</h3><p>Liên kết cùng những vùng trồng có thổ nhưỡng phù hợp và nguồn nước sạch.</p></article>
          <article><span>◌</span><h3>Đóng gói trong ngày</h3><p>Gạo được kiểm tra, xay xát và đóng gói cẩn thận để giữ vị tươi mới.</p></article>
          <article><span>✓</span><h3>Minh bạch nguồn gốc</h3><p>Thông tin sản phẩm rõ ràng, quy trình kiểm soát nghiêm ngặt qua từng lô hàng.</p></article>
          <article><span>♡</span><h3>Chọn điều tốt cho nhà</h3><p>Một lựa chọn an tâm cho những bữa cơm quây quần mỗi ngày.</p></article>
        </div>
      </section>

      <section className="story-section scroll-reveal">
        <div className="story-image" aria-hidden="true" />
        <div className="story-copy">
          <span className="section-kicker">TỪ CÁNH ĐỒNG ĐẾN MÂM CƠM</span>
          <h2>CÂU CHUYỆN<br /><em>HẠT GẠO</em></h2>
          <p>Mỗi hạt gạo ngon bắt đầu từ sự kiên nhẫn. Đó là những ngày người nông dân dõi theo con nước, chăm từng thửa ruộng và chờ đúng khoảnh khắc lúa chín vàng.</p>
          <p>Gạo Ngon trân trọng câu chuyện ấy bằng cách làm việc trực tiếp với vùng nguyên liệu, để giá trị của hạt gạo Việt được nâng niu trọn vẹn.</p>
          <a className="text-link" href="#">TÌM HIỂU VỀ CHÚNG TÔI　→</a>
        </div>
      </section>

      <section className="reviews-section scroll-reveal">
        <div className="section-title-centered">
          <span className="section-kicker">BỮA CƠM NHÀ MÌNH</span>
          <h2>KHÁCH HÀNG ĐÁNH GIÁ</h2>
        </div>
        <div className="reviews-grid">
          <blockquote><div className="rating">★★★★★</div><p>“Cơm nấu lên dẻo vừa, thơm nhẹ và để nguội vẫn ngon. Cả nhà mình đều thích.”</p><footer>— Chị Minh Anh <span>Khách hàng thân thiết</span></footer></blockquote>
          <blockquote><div className="rating">★★★★★</div><p>“Đóng gói chắc chắn, giao nhanh. Mình đã mua lại ST25 lần thứ ba rồi.”</p><footer>— Anh Hoàng Nam <span>Khách hàng online</span></footer></blockquote>
          <blockquote><div className="rating">★★★★★</div><p>“Tư vấn rất nhiệt tình, chọn được loại gạo hợp khẩu vị cho gia đình bốn người.”</p><footer>— Cô Thu Hà <span>Khách hàng tại Hà Nội</span></footer></blockquote>
        </div>
      </section>

      <section className="final-cta scroll-reveal">
        <div>
          <span className="section-kicker">BẮT ĐẦU TỪ BỮA CƠM HÔM NAY</span>
          <h2>Chọn vị ngon<br /><em>cho người thương.</em></h2>
          <p>Gạo mới, giao tận nhà và luôn sẵn sàng cho căn bếp của bạn.</p>
        </div>
        <a className="gold-button" href="/san-pham">XEM TẤT CẢ SẢN PHẨM　→</a>
      </section>

      <SiteFooter />
      {quickProduct && (
        <QuickAddModal
          product={quickProduct}
          onClose={() => setQuickProduct(null)}
          onAdded={(p, quantity, weight) => addProductToCart(p, quantity, weight)}
        />
      )}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSuccess={(u) => { setUser(u); setAuthOpen(false); }} />
    </main>
  );
}
