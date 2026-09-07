"use client";

import { useEffect, useState } from "react";
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
      <style dangerouslySetInnerHTML={{ __html: `
        .site {
          color: #f8f6ee;
          background: linear-gradient(180deg, #0b1e18 0%, #112d20 36%, #0b1d16 100%);
          font-family: Inter, sans-serif;
          min-height: 100vh;
        }

        .topbar {
          height: 42px;
          display: block;
          overflow: hidden;
          width: 100%;
          padding: 0;
          border-bottom: 1px solid rgba(255,255,255,.12);
          background: rgba(6, 25, 18, 0.92);
        }

        .topbar-track {
          display: flex;
          width: max-content;
          animation: topbar-marquee 18s linear infinite;
        }

        .topbar-track > div {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-right: 70px;
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,.88);
        }

        .topbar > div:nth-child(2) { justify-self: center; }
        .topbar > div:nth-child(3) { justify-self: end; }

        .icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.08);
          font-size: 12px;
        }

        .header {
          position: sticky;
          top: 0;
          z-index: 30;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: min(96%, 1400px);
          margin: 20px auto 0;
          padding: 16px 28px;
          border: 1px solid rgba(216,180,90,.35);
          border-radius: 30px;
          background: rgba(10, 28, 20, 0.7);
          backdrop-filter: blur(14px);
          box-shadow: 0 12px 32px rgba(0,0,0,.18);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #fff;
          text-decoration: none;
        }

        .logo-mark {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(216,180,90,.3), rgba(17,41,27,.8));
          font-size: 22px;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.08;
        }

        .logo-text strong {
          font-size: 1.1rem;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        .logo-text small {
          color: rgba(255,255,255,.72);
          font-size: 0.64rem;
          letter-spacing: 0.04em;
        }

        .nav {
          display: flex;
          align-items: center;
          gap: 34px;
          margin: 0 auto;
        }

        .nav a {
          color: rgba(255,255,255,.88);
          text-decoration: none;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 10px 0 8px;
          border-bottom: 2px solid transparent;
          transition: color .25s ease, border-color .25s ease;
        }

        .nav a.active,
        .nav a:hover {
          color: #f0ce69;
          border-color: #f0ce69;
        }

        .search {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 260px;
          height: 42px;
          padding: 0 14px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 999px;
          background: rgba(255,255,255,.05);
        }

        .search input {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: #fff;
          font-size: 0.78rem;
        }

        .search input::placeholder {
          color: rgba(255,255,255,.54);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .mini-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border: 1px solid rgba(216,180,90,.28);
          border-radius: 50%;
          background: rgba(216,180,90,.08);
          color: #f5d87d;
          cursor: pointer;
          font-size: 1.1rem;
        }

        .mini-btn span {
          position: absolute;
          right: -5px;
          top: -4px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          border-radius: 999px;
          background: #d7b45d;
          color: #0d1d17;
          font-size: 0.62rem;
          font-weight: 800;
        }

        .user-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 38px;
          padding: 0 12px 0 8px;
          border: 1px solid rgba(216,180,90,.4);
          border-radius: 12px;
          background: rgba(216,180,90,.1);
          color: #f6d783;
          font-size: 0.72rem;
          font-weight: 700;
          text-decoration: none;
        }

        .user-pill .avatar {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d7b45d, #715718);
          color: #101d17;
          font-size: 0.72rem;
          font-weight: 800;
        }

        .news-hero {
          padding: 86px 0 38px;
          background: radial-gradient(circle at 50% 10%, rgba(216,180,90,.18), transparent 34%);
        }

        .news-hero-inner {
          width: min(1200px, calc(100% - 40px));
          margin: 0 auto;
          text-align: center;
        }

        .eyebrow {
          display: inline-block;
          padding-bottom: 8px;
          border-bottom: 2px solid #d7b45d;
          color: #d7b45d;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .news-hero h1 {
          margin-top: 26px;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(3.2rem, 5vw, 6rem);
          line-height: 0.92;
          letter-spacing: 0.04em;
          color: #f8f6ee;
        }

        .news-hero p {
          width: min(620px, 90%);
          margin: 18px auto 0;
          color: rgba(255,255,255,.72);
          font-size: 1rem;
          line-height: 1.7;
        }

        .news-container {
          width: min(1200px, calc(100% - 40px));
          margin: 0 auto;
          padding: 8px 0 90px;
        }

        .featured-story {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 34px;
          padding: 28px;
          border: 1px solid rgba(216,180,90,.25);
          border-radius: 28px;
          background: rgba(8, 25, 18, .72);
          box-shadow: 0 18px 50px rgba(0,0,0,.22);
        }

        .featured-image {
          min-height: 420px;
          border-radius: 22px;
          background: url('/images/rice-landscape.png') center/cover no-repeat;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.08);
        }

        .featured-copy {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .tag {
          display: inline-flex;
          align-items: center;
          width: fit-content;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(216,180,90,.12);
          border: 1px solid rgba(216,180,90,.3);
          color: #f0ce69;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .featured-copy h2 {
          margin-top: 18px;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(2.6rem, 4vw, 3.7rem);
          line-height: 1.04;
          color: #fff;
        }

        .featured-copy p {
          margin-top: 18px;
          color: rgba(255,255,255,.73);
          font-size: 1rem;
          line-height: 1.8;
        }

        .post-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-top: 24px;
          color: rgba(255,255,255,.6);
          font-size: 0.82rem;
        }

        .gold-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 0 24px;
          border: none;
          border-radius: 999px;
          background: linear-gradient(135deg, #d7b45d, #f0ce69);
          color: #10251a;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          box-shadow: 0 12px 26px rgba(215,180,93,.25);
        }

        .news-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 28px;
          margin-top: 48px;
        }

        .news-card {
          overflow: hidden;
          border: 1px solid rgba(216,180,90,.18);
          border-radius: 22px;
          background: rgba(9, 24, 18, .7);
          transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
        }

        .news-card:hover {
          transform: translateY(-8px);
          border-color: rgba(216,180,90,.38);
          box-shadow: 0 20px 32px rgba(0,0,0,.2);
        }

        .news-card-image {
          height: 220px;
          background-size: cover;
          background-position: center;
        }

        .news-card-body {
          padding: 22px 20px 24px;
        }

        .news-card h3 {
          margin-top: 14px;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(1.8rem, 2vw, 2.4rem);
          line-height: 1.09;
          color: #fff;
        }

        .news-card p {
          margin-top: 12px;
          color: rgba(255,255,255,.64);
          font-size: 0.92rem;
          line-height: 1.7;
        }

        .news-card .meta {
          margin-top: 18px;
          color: rgba(255,255,255,.58);
          font-size: 0.77rem;
        }

        .newsletter {
          margin-top: 68px;
          padding: 52px 32px;
          border: 1px solid rgba(216,180,90,.2);
          border-radius: 26px;
          background: linear-gradient(135deg, rgba(216,180,90,.1), rgba(18,36,28,.9));
          text-align: center;
        }

        .newsletter h2 {
          margin-bottom: 14px;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(2.5rem, 4vw, 3.5rem);
          color: #fff;
        }

        .newsletter p {
          width: min(560px, 100%);
          margin: 0 auto;
          color: rgba(255,255,255,.7);
          line-height: 1.7;
        }

        .newsletter-form {
          display: flex;
          align-items: center;
          gap: 12px;
          width: min(520px, 100%);
          margin: 26px auto 0;
        }

        .newsletter-form input {
          flex: 1;
          height: 52px;
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 999px;
          background: rgba(11,18,15,.5);
          color: #fff;
          padding: 0 18px;
          font-size: 0.96rem;
          outline: none;
        }

        .newsletter-form input::placeholder {
          color: rgba(255,255,255,.45);
        }

        .newsletter-form button {
          height: 52px;
          border: none;
          border-radius: 999px;
          padding: 0 26px;
          background: linear-gradient(135deg, #d7b45d, #f0ce69);
          color: #10251a;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
        }

        .footer {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr 1.3fr;
          gap: 28px;
          width: min(1200px, calc(100% - 40px));
          margin: 0 auto;
          padding: 40px 0 80px;
          border-top: 1px solid rgba(255,255,255,.08);
          color: rgba(255,255,255,.7);
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer h3 {
          margin-bottom: 16px;
          color: #fff;
          font-size: 0.8rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .footer a,
        .footer p {
          display: block;
          margin-bottom: 10px;
          color: rgba(255,255,255,.72);
          text-decoration: none;
          font-size: 0.94rem;
          line-height: 1.8;
        }

        @media (max-width: 980px) {
          .header {
            flex-wrap: wrap;
            justify-content: center;
            gap: 14px;
          }

          .nav {
            order: 3;
            width: 100%;
            justify-content: center;
            flex-wrap: wrap;
          }

          .featured-story {
            grid-template-columns: 1fr;
          }

          .news-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .footer {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 680px) {
          .topbar {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .topbar > div:nth-child(2),
          .topbar > div:nth-child(3) {
            justify-self: center;
          }

          .header {
            padding: 14px 16px;
          }

          .search {
            width: 100%;
          }

          .header-actions {
            width: 100%;
            justify-content: space-between;
          }

          .news-grid {
            grid-template-columns: 1fr;
          }

          .newsletter-form {
            flex-direction: column;
          }

          .newsletter-form button {
            width: 100%;
          }

          .footer {
            grid-template-columns: 1fr;
          }
        }

        .site > .header {
          position: relative;
          top: auto;
          width: 93%;
          height: 78px;
          margin: auto;
          padding: 0 24px;
          justify-content: initial;
          border-radius: 25px;
          background: rgba(17, 34, 24, .55);
        }

        .site > .header .logo {
          min-width: 255px;
          gap: 0;
        }

        .site > .header .logo-mark {
          width: 51px;
          height: 51px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(205, 170, 74, .35), rgba(17, 38, 24, .8));
          font-size: 27px;
        }

        .site > .header .logo-text {
          line-height: normal;
          margin-left: 11px;
        }

        .site > .header .logo-text strong {
          font: 600 24px "Cormorant Garamond";
          letter-spacing: .5px;
        }

        .site > .header .logo-text small {
          font: italic 13px "Cormorant Garamond";
          letter-spacing: normal;
        }

        .site > .header .nav {
          gap: 38px;
          margin: 0;
        }

        .site > .header .nav a {
          height: 100%;
          padding: 0;
          border-bottom: 0;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: normal;
        }

        .site > .header .nav a.active {
          border-bottom: 0;
        }

        .site > .header .nav a.active:after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 13px;
          height: 2px;
          background: var(--gold);
        }

        .site > .header .search {
          width: min(390px, 28vw);
          height: 44px;
          margin-left: auto;
          padding: 0 15px;
          border-color: rgba(255, 255, 255, .25);
          background: rgba(255, 255, 255, .04);
        }

        .site > .header .mini-btn {
          width: 34px;
          height: 34px;
          border-color: rgba(221, 211, 163, .3);
          background: transparent;
          font-size: 17px;
        }
      ` }} />

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
              <button type="button" className="gold-button">Đọc bài viết →</button>
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
