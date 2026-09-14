"use client";

import { useEffect, useState } from "react";
import AuthModal, { USER_STORAGE_KEY } from "../../components/AuthModal";
import CartPopover from "../../components/CartPopover";
import SiteFooter from "../../components/SiteFooter";
import BrandLogo from "../../components/BrandLogo";
import SiteHeader from "../../components/SiteHeader";
import { CART_STORAGE_KEY, CartItem } from "../data";
import styles from "./page.module.css";
type AuthUser = { name: string; phone: string };

const product = {
  id: 11,
  name: "Gạo ST25 Nguyên Cám Vigen Food",
  category: "Gạo dinh dưỡng",
  price: 145000,
  oldPrice: 165000,
  image: "/images/vigenfood.png",
  sku: "VGF-ST25-05",
  rating: 4.9,
  reviews: 128,
  weight: "5kg",
  note: "Gạo nguyên cám dẻo thơm, giàu dinh dưỡng",
};

const gallery = [
  product.image,
  "/images/st25.png.jpg",
  "/images/hinh gao2t25.jpg",
  "/images/st.png",
];

function Stars() {
  return (
    <span className="vigen-stars" aria-label="4.9 trên 5 sao">
      ★★★★<i>★</i> <small>4.9/5</small>
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

function DetailSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="vigen-section">
      <div className="vigen-section-heading">
        <span>{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function VigenFoodPage() {
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [weight, setWeight] = useState("5kg");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [wished, setWished] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const savedUser = window.localStorage.getItem(USER_STORAGE_KEY);
    if (savedUser) setUser(JSON.parse(savedUser));
    const items: CartItem[] = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) || "[]");
    setCartCount(items.reduce((total, item) => total + item.quantity, 0));
  }, []);

  function addToCart(buyNow = false) {
    if (!window.localStorage.getItem(USER_STORAGE_KEY)) {
      setAuthOpen(true);
      return;
    }
    const items: CartItem[] = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) || "[]");
    const existing = items.find((item) => item.product.id === product.id && item.weight === weight);
    const nextItems = existing
      ? items.map((item) => item === existing ? { ...item, quantity: item.quantity + quantity } : item)
      : [...items, { product, quantity, weight }];
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextItems));
    setCartCount(nextItems.reduce((total, item) => total + item.quantity, 0));

    if (buyNow) {
      window.location.href = "/thanh-toan";
      return;
    }

    setNotice("Đã thêm sản phẩm vào giỏ hàng");
  }

  return (
    <main className={`vigen-page ${styles.pageRoot}`}>
      <SiteHeader active="products" />
      <div className="vigen-breadcrumb">
        <a href="/">Trang chủ</a>
        <span>/</span>
        <a href="/san-pham">Sản phẩm</a>
        <span>/</span>
        <b>Vigen Food</b>
      </div>

      <section className="vigen-product-hero">
        <div className="vigen-gallery">
          <div className="vigen-main-image">
            <span className="vigen-gallery-label">VIGEN FOOD</span>
            <img src={selectedImage} alt={product.name} />
          </div>
          <div className="vigen-thumbs">
            {gallery.map((image, index) => (
              <button
                key={image}
                className={selectedImage === image ? "selected" : ""}
                onClick={() => setSelectedImage(image)}
                aria-label={`Xem ảnh ${index + 1}`}
              >
                <img src={image} alt="" />
              </button>
            ))}
          </div>
          <div className="vigen-gallery-note">
            <span>Ảnh sản phẩm thực tế</span>
            <span>⟲ Vuốt để xem thêm</span>
          </div>
        </div>
        <div className="vigen-summary">
          <span className="vigen-kicker">{product.category} · VIGEN FOOD</span>
          <h1>{product.name}</h1>
          <div className="vigen-rating">
            <Stars />
            <span>248 đánh giá</span>
            <i>·</i>
            <span>Đã bán 1,280+</span>
          </div>
          <div className="vigen-price">
            <strong>{product.price.toLocaleString("vi-VN")}đ</strong>
            <del>{product.oldPrice.toLocaleString("vi-VN")}đ</del>
            <em>-12%</em>
          </div>
          <p className="vigen-lead">
            Hạt gạo nguyên cám giàu dưỡng chất, dẻo thơm tự nhiên và nhẹ bụng
            cho bữa cơm lành mỗi ngày.
          </p>
          <div className="vigen-facts">
            <div>
              <span>Xuất xứ</span>
              <strong>Hậu Giang, Việt Nam</strong>
            </div>
            <div>
              <span>Trọng lượng</span>
              <strong>5kg / túi</strong>
            </div>
            <div>
              <span>Bảo quản</span>
              <strong>12 tháng (chân không)</strong>
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
            <small>
              Mã: <b>GAONGON500</b> · Áp dụng tự động khi thanh toán
            </small>
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
              {["Gạo trắng", "Nguyên cám", "Gạo lứt"].map((item, index) => (
                <button key={item} className={index === 1 ? "selected" : ""}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="vigen-buy">
            <label className="vigen-quantity-label">Số lượng</label>
            <div className="vigen-quantity">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Giảm số lượng"
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Tăng số lượng"
              >
                +
              </button>
            </div>
            <button className="vigen-cart" onClick={() => addToCart()}>🛒 Thêm vào giỏ</button>
            <button className="vigen-buy-now" onClick={() => addToCart(true)}>
              Mua ngay <span>→</span>
            </button>
            <span className="vigen-stock">☑ Còn 248</span>
          </div>
          <div className="vigen-policies">
            <Policy
              icon="🚚"
              title="Giao hàng nhanh"
              text="Nhận hàng 1–3 ngày"
            />
            <Policy icon="↩" title="Đổi trả dễ dàng" text="Trong vòng 7 ngày" />
            <Policy
              icon="🛡"
              title="Chứng nhận VSATTP"
              text="Bộ Y tế Việt Nam"
            />
            <Policy
              icon="▣"
              title="Thanh toán an toàn"
              text="VNPay · Momo · COD"
            />
          </div>
        </div>
      </section>

      <div className="vigen-trust-strip">
        <span>
          <b>100%</b> nguyên cám tự nhiên
        </span>
        <span>
          <b>03</b> vùng nguyên liệu chọn lọc
        </span>
        <span>
          <b>01</b> quy trình minh bạch
        </span>
        <span>
          <b>4.9/5</b> đánh giá khách hàng
        </span>
      </div>

      <section className="vigen-tabs">
        <button
          className={activeTab === "description" ? "active" : ""}
          onClick={() => setActiveTab("description")}
        >
          Mô tả sản phẩm
        </button>
        <button
          className={activeTab === "specs" ? "active" : ""}
          onClick={() => setActiveTab("specs")}
        >
          Thông số
        </button>
        <button
          className={activeTab === "reviews" ? "active" : ""}
          onClick={() => setActiveTab("reviews")}
        >
          Đánh giá <small>(128)</small>
        </button>
      </section>

      {activeTab === "description" && (
        <>
          <DetailSection
            eyebrow="01 · Câu chuyện hạt gạo"
            title="Trọn vị tự nhiên, lành cho mỗi ngày"
          >
            <div className="vigen-story-grid">
              <div>
                <p>
                  ST25 Nguyên Cám Vigen Food giữ lại lớp cám giàu chất xơ cùng
                  hương thơm đặc trưng của hạt gạo Việt. Cơm mềm, vị ngọt thanh
                  và no lâu hơn, phù hợp cho gia đình hiện đại.
                </p>
                <p>
                  Từng mẻ gạo được tuyển chọn, xay xát nhẹ và đóng gói tại nguồn
                  để bảo toàn dưỡng chất tự nhiên.
                </p>
              </div>
              <div className="vigen-highlight">
                <span>Hạt gạo nguyên cám</span>
                <strong>Đẹp từ bên trong</strong>
                <small>Không đánh bóng quá mức · Không chất bảo quản</small>
              </div>
            </div>
          </DetailSection>
          <DetailSection
            eyebrow="02 · Thông tin sản phẩm"
            title="Minh bạch trong từng chi tiết"
          >
            <div className="vigen-data-grid">
              <div className="vigen-spec-card">
                <h3>Thông số</h3>
                <dl>
                  <dt>Loại gạo</dt>
                  <dd>ST25 nguyên cám</dd>
                  <dt>Khối lượng</dt>
                  <dd>1kg / 5kg / 10kg</dd>
                  <dt>Xuất xứ</dt>
                  <dd>Sóc Trăng, Việt Nam</dd>
                  <dt>Hạn sử dụng</dt>
                  <dd>12 tháng từ ngày đóng gói</dd>
                </dl>
              </div>
              <div className="vigen-spec-card">
                <h3>
                  Dinh dưỡng <small>trong 100g</small>
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
                <p>Nguồn năng lượng tự nhiên cho ngày dài khỏe mạnh.</p>
              </div>
            </div>
          </DetailSection>
          <DetailSection
            eyebrow="03 · Từ ruộng đến bàn ăn"
            title="Nguồn gốc có thể truy xuất"
          >
            <div className="vigen-process">
              <div>
                <span>01</span>
                <strong>Vùng đất lành</strong>
                <p>
                  Ruộng lúa tại Sóc Trăng, nguồn nước phù sa và thổ nhưỡng giàu
                  dinh dưỡng.
                </p>
              </div>
              <div>
                <span>02</span>
                <strong>Chọn đúng vụ</strong>
                <p>
                  Thu hoạch khi hạt đạt độ chín tự nhiên, giữ trọn hương thơm và
                  độ dẻo.
                </p>
              </div>
              <div>
                <span>03</span>
                <strong>Xay xát nhẹ</strong>
                <p>
                  Giữ lại lớp cám quý, kiểm soát chặt từng mẻ trước khi đóng
                  gói.
                </p>
              </div>
              <div>
                <span>04</span>
                <strong>Đến tay bạn</strong>
                <p>
                  Đóng gói kín, giao nhanh để gạo luôn tươi mới trong căn bếp.
                </p>
              </div>
            </div>
            <div className="vigen-cert">
              <span>✦</span>
              <div>
                <strong>Cam kết chất lượng Vigen Food</strong>
                <p>
                  Nguyên liệu rõ nguồn gốc · Kiểm soát an toàn · Đóng gói đạt
                  chuẩn
                </p>
              </div>
              <b>
                VIGEN
                <br />
                QUALITY
              </b>
            </div>
          </DetailSection>
          <DetailSection
            eyebrow="04 · Nấu ngon hơn"
            title="Hướng dẫn sử dụng & bảo quản"
          >
            <div className="vigen-guide-grid">
              <div>
                <span>🍚</span>
                <h3>Cách nấu</h3>
                <p>
                  Vo nhẹ 1 lần. Ngâm gạo 20 phút, thêm nước theo tỷ lệ 1 gạo :
                  1.2 nước và nấu như bình thường.
                </p>
              </div>
              <div>
                <span>◌</span>
                <h3>Bảo quản</h3>
                <p>
                  Đậy kín miệng túi, đặt nơi khô ráo, thoáng mát và tránh ánh
                  nắng trực tiếp.
                </p>
              </div>
              <div>
                <span>♡</span>
                <h3>Ngon nhất khi</h3>
                <p>Dùng nóng cùng món mặn, salad hoặc các món hấp thanh nhẹ.</p>
              </div>
            </div>
          </DetailSection>
        </>
      )}
      {activeTab === "specs" && (
        <DetailSection eyebrow="Thông số sản phẩm" title="Thông tin dinh dưỡng">
          <div className="vigen-data-grid">
            <div className="vigen-spec-card">
              <h3>Chi tiết sản phẩm</h3>
              <dl>
                <dt>Thành phần</dt>
                <dd>100% gạo ST25 nguyên cám</dd>
                <dt>Đơn vị sản xuất</dt>
                <dd>Vigen Food Việt Nam</dd>
                <dt>Bảo quản</dt>
                <dd>Nơi khô ráo, thoáng mát</dd>
              </dl>
            </div>
            <div className="vigen-spec-card">
              <h3>
                Bảng dinh dưỡng <small>/ 100g</small>
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
        </DetailSection>
      )}
      {activeTab === "reviews" && <ReviewSection />}
      {activeTab !== "reviews" && <ReviewSection />}
      <section className="vigen-faq" id="faq">
        <div className="vigen-section-heading">
          <span>Giải đáp nhanh</span>
          <h2>Câu hỏi thường gặp</h2>
        </div>
        <div className="vigen-faq-list">
          <details>
            <summary>Gạo ST25 nguyên cám có dễ nấu không?</summary>
            <p>
              Rất dễ nấu. Chỉ cần vo nhẹ, ngâm 20 phút và dùng tỷ lệ nước 1:1.2.
            </p>
          </details>
          <details>
            <summary>Sản phẩm có chứng nhận chất lượng không?</summary>
            <p>
              Sản phẩm được kiểm soát nguồn nguyên liệu và quy trình đóng gói
              theo tiêu chuẩn an toàn của Vigen Food.
            </p>
          </details>
          <details>
            <summary>Tôi có thể đổi trả nếu sản phẩm bị lỗi?</summary>
            <p>
              Gao Ngon hỗ trợ đổi trả trong 7 ngày với sản phẩm nguyên vẹn hoặc
              có lỗi từ nhà sản xuất.
            </p>
          </details>
        </div>
      </section>
      <section className="vigen-related">
        <div className="vigen-section-heading">
          <span>Có thể bạn sẽ thích</span>
          <h2>Sản phẩm liên quan</h2>
        </div>
        <div className="vigen-related-grid">
          {[
            "Gạo ST25 Thượng Hạng",
            "Gạo Lứt Đỏ Hữu Cơ",
            "Combo Gạo Nhà Mình",
          ].map((name, index) => (
            <article key={name}>
              <img
                src={index === 1 ? "/images/st.png" : product.image}
                alt={name}
              />
              <div>
                <span>GAO NGON</span>
                <h3>{name}</h3>
                <strong>
                  {[135000, 110000, 295000][index].toLocaleString("vi-VN")}đ
                </strong>
              </div>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
      {notice && <div className="vigen-toast" role="status">✓ {notice}<button onClick={() => setNotice("")} aria-label="Đóng thông báo">×</button></div>}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSuccess={(userData) => { setUser(userData); setAuthOpen(false); }} />
    </main>
  );
}

function ReviewSection() {
  return (
    <DetailSection eyebrow="05 · Khách hàng nói gì" title="Bữa cơm nhà mình">
      <div className="vigen-review-head">
        <div>
          <strong>4.9</strong>
          <Stars />
          <span>Dựa trên 128 đánh giá</span>
        </div>
        <div className="vigen-review-bars">
          <span>
            5 <i style={{ width: "92%" }} />
          </span>
          <span>
            4 <i style={{ width: "58%" }} />
          </span>
          <span>
            3 <i style={{ width: "16%" }} />
          </span>
        </div>
        <button>Viết đánh giá</button>
      </div>
      <div className="vigen-reviews">
        <blockquote>
          <div>
            <Stars />
            <time>2 ngày trước</time>
          </div>
          <p>
            “Cơm dẻo vừa, thơm nhẹ. Mình thích nhất là cảm giác ăn no lâu mà
            không bị nặng bụng.”
          </p>
          <footer>— Minh Anh · Đã mua hàng</footer>
        </blockquote>
        <blockquote>
          <div>
            <Stars />
            <time>1 tuần trước</time>
          </div>
          <p>“Bao bì đẹp, giao nhanh. Sẽ mua lại cho gia đình.”</p>
          <footer>— Hoàng Nam · Đã mua hàng</footer>
        </blockquote>
      </div>
    </DetailSection>
  );
}
