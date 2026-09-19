"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthModal from "../components/AuthModal";
import { USER_STORAGE_KEY } from "../components/AuthModal";
import CartPopover from "../components/CartPopover";
import SiteFooter from "../components/SiteFooter";
import BrandLogo from "../components/BrandLogo";
import SiteHeader from "../components/SiteHeader";
import { CART_STORAGE_KEY } from "../san-pham/data";
import styles from "./page.module.css";

const news = [
  { title: "Bí quyết nấu cơm niêu chuẩn vị cung đình", date: "24 Tháng 8, 2026", category: "Mẹo nhà bếp", image: "/images/banner1.jpg" },
  { title: "Gạo ST25 tiếp tục khẳng định vị thế trên trường quốc tế", date: "15 Tháng 8, 2026", category: "Tin tức", image: "/images/rice-landscape.png" },
  { title: "Cách phân biệt gạo sạch tự nhiên và gạo pha trộn", date: "02 Tháng 8, 2026", category: "Sức khỏe", image: "/images/hero-rice.png" },
  { title: "Chương trình ưu đãi mùa Vu Lan báo hiếu", date: "28 Tháng 7, 2026", category: "Khuyến mãi", image: "/images/banner1.jpg" },
  { title: "Khám phá vùng nguyên liệu lúa tôm độc đáo", date: "10 Tháng 7, 2026", category: "Câu chuyện", image: "/images/rice-landscape.png" },
  { title: "Gạo lứt và những công dụng tuyệt vời cho vóc dáng", date: "05 Tháng 7, 2026", category: "Sức khỏe", image: "/images/hero-rice.png" },
];

const Icon = ({ children }: { children: React.ReactNode }) => (
  <span className="icon">{children}</span>
);

type AuthUser = { name: string; phone: string };

export default function NewsPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [wished, setWished] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    if (saved) setUser(JSON.parse(saved));
    const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    setCartCount(cart.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0));
  }, []);

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

      <SiteHeader active="news" />

      <section className="news-hero">
        <div className="news-hero-inner">
          <span className="eyebrow">Cập nhật mới nhất</span>
          <h1>Tin tức</h1>
          <p>Đón đọc những câu chuyện, bí quyết và thông tin mới nhất từ Gạo Ngon để mỗi bữa cơm của bạn luôn trọn vẹn và đầy ý nghĩa.</p>
        </div>
      </section>

      <section className="news-container">
        <article className="featured-story">
          <div className="featured-image" aria-label="Hình ảnh bài viết nổi bật" />
          <div className="featured-copy">
            <span className="tag">Mùa vụ mới</span>
            <h2>Khởi động mùa gặt 2026: Nâng tầm hạt gạo Việt Nam lên chuẩn quốc tế</h2>
            <p>Với quy trình chọn lọc, sấy khô và bảo quản hiện đại, Gạo Ngon tiếp tục mang tới hạt gạo dẻo thơm, ngọt tự nhiên, giữ trọn hương vị cho từng bữa ăn gia đình.</p>
            <div className="post-meta">
              <span>26 Tháng 8, 2026</span>
              <Link href="/tin-tuc/mua-gat-2026" className="gold-button">Đọc bài viết →</Link>
            </div>
          </div>
        </article>

        <div className="news-grid">
          {news.map((item, index) => (
            <article className="news-card" key={`${item.title}-${index}`}>
              <div className="news-card-image" style={{ backgroundImage: `url('${item.image}')` }} />
              <div className="news-card-body">
                <span className="tag">{item.category}</span>
                <h3>{item.title}</h3>
                <p>Khám phá câu chuyện và lợi ích thực tế để bạn hiểu rõ hơn về loại gạo mà gia đình đang dùng mỗi ngày.</p>
                <div className="meta">{item.date}</div>
              </div>
            </article>
          ))}
        </div>

        <div className="newsletter">
          <h2>Đăng ký nhận bản tin</h2>
          <p>Nhận ưu đãi hấp dẫn, tin tức mới nhất và những góc nhìn thú vị về gạo Việt ngay trong hộp thư của bạn.</p>
          <form className="newsletter-form" onSubmit={(event) => event.preventDefault()}>
            <input type="email" placeholder="Nhập email của bạn..." aria-label="Email" required />
            <button type="submit">Đăng ký</button>
          </form>
        </div>
      </section>

      <SiteFooter />

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSuccess={(userData) => { setUser(userData); setAuthOpen(false); }} />
    </main>
  );
}
