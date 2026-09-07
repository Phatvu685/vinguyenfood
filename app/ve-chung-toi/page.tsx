"use client";

import { useEffect, useState } from "react";
import AuthModal, { USER_STORAGE_KEY } from "../components/AuthModal";
import CartPopover from "../components/CartPopover";
import SiteFooter from "../components/SiteFooter";
import BrandLogo from "../components/BrandLogo";
import SiteHeader from "../components/SiteHeader";
import { CART_STORAGE_KEY } from "../san-pham/data";
import styles from "./page.module.css";

const Icon = ({ children }: { children: React.ReactNode }) => (
  <span className="icon">{children}</span>
);

type AuthUser = { name: string; phone: string };

const storyPoints = [
  "Mỗi hạt gạo đến tay khách hàng đều đi qua quy trình chọn lọc, kiểm định và bảo quản nghiêm ngặt.",
  "Vigen Food hoạt động với tinh thần gắn kết giữa nông dân, nhà sản xuất và người tiêu dùng Việt.",
  "Chúng tôi tập trung xây dựng giá trị bền vững, từ vùng nguyên liệu đến bữa ăn hàng ngày."
];

const timeline = [
  { year: "2016", title: "Khởi đầu", desc: "Bắt đầu hành trình chăm chút cho hạt gạo Việt bằng sự tin tưởng từ người tiêu dùng." },
  { year: "2018", title: "Phát triển", desc: "Mở rộng chuỗi cung ứng và nâng cao tiêu chuẩn chọn lọc, đóng gói sản phẩm." },
  { year: "2021", title: "Mở rộng", desc: "Kết nối với các vùng nguyên liệu ưu việt, tăng cường kinh nghiệm phục vụ thị trường." },
  { year: "2024", title: "Hiện tại", desc: "Tự tin mang hương vị gạo Việt tới nhiều gia đình với quy trình kiểm soát chặt chẽ." },
  { year: "2026", title: "Tương lai", desc: "Tiếp tục phát triển bền vững, tạo ra giá trị lâu dài cho cộng đồng và khách hàng." }
];

const values = [
  { icon: "✦", title: "Tầm nhìn", desc: "Trở thành thương hiệu gạo Việt đáng tin cậy, hiện đại và được khách hàng tin chọn trong từng bữa ăn." },
  { icon: "◎", title: "Sứ mệnh", desc: "Mang đến sản phẩm gạo chất lượng cao từ vùng nguyên liệu rõ nguồn gốc, an toàn và bền vững." },
  { icon: "✧", title: "Giá trị cốt lõi", desc: "Chất lượng, minh bạch và sự đồng hành lâu dài cùng khách hàng, đối tác và cộng đồng." }
];

const stats = [
  { value: 8, suffix: "+", label: "Năm kinh nghiệm" },
  { value: 40, suffix: "+", label: "Sản phẩm" },
  { value: 120, suffix: "+", label: "Đối tác" },
  { value: 25, suffix: "k+", label: "Khách hàng" }
];

const commitments = [
  { icon: "✓", title: "Chất lượng", desc: "Từng lô hàng đều được kiểm tra chặt chẽ trước khi đến tay người tiêu dùng." },
  { icon: "◌", title: "Minh bạch", desc: "Thông tin nguồn gốc, quy trình và tiêu chuẩn sản phẩm được mô tả rõ ràng và dễ hiểu." },
  { icon: "♡", title: "Đồng hành", desc: "Luôn lắng nghe phản hồi, phục vụ khách hàng bằng sự nhiệt tình và chuyên nghiệp." },
  { icon: "🌿", title: "Bền vững", desc: "Hướng tới phát triển bền vững, giữ gìn môi trường và hỗ trợ cộng đồng nông nghiệp." }
];

export default function AboutPage() {
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

    const revealItems = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => observer.observe(item));

    const counters = document.querySelectorAll("[data-target]");
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const target = Number(el.dataset.target || 0);
          const suffix = el.dataset.suffix || "";
          const duration = 1500;
          const start = performance.now();

          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const value = Math.floor(progress * target);
            el.textContent = `${value}${suffix}`;
            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
          counterObserver.unobserve(el);
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));

    return () => {
      observer.disconnect();
      counterObserver.disconnect();
    };
  }, []);

  return (
    <main className={`about-page ${styles.pageRoot}`}>
      <style dangerouslySetInnerHTML={{ __html: `
        .about-page {
          min-height: 100vh;
          background:
            linear-gradient(180deg, rgba(13, 35, 25, 0.78), rgba(13, 35, 25, 0.78)),
            radial-gradient(circle at top, rgba(216,180,90,0.16), transparent 24%),
            linear-gradient(180deg, #0f2c1e 0%, #163c2a 22%, #174530 38%, #1d4d35 54%, #0f2d20 100%);
          color: #173524;
          font-family: Inter, sans-serif;
        }

        .about-page * { box-sizing: border-box; }

        .about-page > .topbar,
        .about-page > .header {
          color: var(--white);
        }

        .about-page > .header .nav a {
          color: rgba(255, 255, 255, .88);
        }

        .about-page > .header .search input {
          width: 100%;
          border: 0;
          outline: 0;
          color: var(--white);
          background: transparent;
          font-size: 12px;
        }

        .about-page > .header .search input::placeholder {
          color: rgba(255, 255, 255, .5);
        }

        .about-page > .header .search-icon {
          color: rgba(255, 255, 255, .72);
        }

        .about-page > .header .logo {
          min-width: 255px;
          gap: 0;
        }

        .about-page > .header .logo-mark {
          width: 51px;
          height: 51px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(205, 170, 74, .35), rgba(17, 38, 24, .8));
          font-size: 27px;
        }

        .about-page > .header .logo-text {
          line-height: normal;
          margin-left: 11px;
        }

        .about-page > .header .logo-text strong {
          font: 600 24px "Cormorant Garamond";
          letter-spacing: .5px;
        }

        .about-page > .header .logo-text small {
          color: inherit;
          font: italic 13px "Cormorant Garamond";
          letter-spacing: normal;
        }

        .reveal {
          opacity: 0;
          transform: translateY(26px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .user-header {
          position: relative;
          z-index: 30;
          width: min(1200px, calc(100% - 32px));
          margin: 18px auto 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 26px;
          border: 1px solid rgba(221, 211, 163, 0.3);
          border-radius: 28px;
          background: rgba(9, 24, 17, 0.66);
          backdrop-filter: blur(12px);
          box-shadow: 0 18px 40px rgba(12, 19, 14, 0.18);
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
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(216,180,90,0.42), rgba(17,41,27,0.8));
          border: 1px solid rgba(216,180,90,0.45);
          font-size: 24px;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.05;
        }

        .logo-text strong {
          font-family: "Cormorant Garamond", serif;
          font-size: 1.15rem;
          letter-spacing: 0.08em;
          font-weight: 700;
        }

        .logo-text small {
          color: rgba(255,255,255,0.7);
          font-size: 0.72rem;
          letter-spacing: 0.04em;
        }

        .catalog-nav {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .catalog-nav a {
          color: rgba(255,255,255,0.9);
          font-size: 0.74rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 10px 0 8px;
          border-bottom: 2px solid transparent;
          transition: color 0.25s ease, border-color 0.25s ease;
        }

        .catalog-nav a.active,
        .catalog-nav a:hover {
          color: #f1d57d;
          border-color: #f1d57d;
        }

        .header-cta {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.08);
          color: #fff;
          font-size: 1.1rem;
          cursor: pointer;
        }

        .about-hero {
          position: relative;
          width: 100%;
          max-width: none;
          margin: 0;
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          align-items: center;
          gap: 14px;
          min-height: 760px;
          padding: 48px 72px 52px;
          background:
            linear-gradient(90deg, rgba(8, 25, 17, 0.78) 0%, rgba(9, 30, 21, 0.72) 30%, rgba(9, 30, 21, 0.58) 52%, rgba(9, 30, 21, 0.12) 100%),
            url('/images/rice-landscape.png') center center / cover no-repeat;
          border-bottom: 1px solid rgba(218, 184, 91, 0.18);
        }

        .about-hero-content {
          max-width: 520px;
          color: #f9f4eb;
          padding-left: 8px;
          padding-right: 10px;
        }

        .mini-badge,
        .section-kicker {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px 16px;
          border-radius: 999px;
          border: 1px solid rgba(236, 194, 92, 0.8);
          background: rgba(236, 194, 92, 0.12);
          color: #f0cf77;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .about-hero h1 {
          margin-top: 26px;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(3.5rem, 6vw, 6.5rem);
          line-height: 0.86;
          color: #f5f1e8;
          letter-spacing: -0.03em;
        }

        .about-hero p {
          margin-top: 22px;
          max-width: 560px;
          font-size: 1.06rem;
          line-height: 1.8;
          color: rgba(255,255,255,0.82);
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 18px;
          margin-top: 28px;
        }

        .primary-btn,
        .secondary-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 52px;
          padding: 0 26px;
          border-radius: 999px;
          border: 1px solid transparent;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .primary-btn {
          background: linear-gradient(135deg, #d7b45d, #f0ce69);
          color: #10251a;
          box-shadow: 0 14px 28px rgba(215,180,93,0.28);
        }

        .secondary-btn {
          background: rgba(7, 24, 17, 0.46);
          border-color: rgba(216,180,90,0.34);
          color: #f3e7c8;
        }

        .primary-btn:hover,
        .secondary-btn:hover {
          transform: translateY(-2px);
        }

        .hero-trust {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 32px;
        }

        .hero-trust span {
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.82);
          font-size: 0.76rem;
          font-weight: 600;
        }

        .hero-visual {
          position: relative;
          display: flex;
          justify-content: flex-end;
          align-items: flex-end;
          width: 100%;
          min-height: 620px;
          padding-right: 12px;
        }

        .hero-visual::before {
          content: "";
          position: absolute;
          right: 36px;
          bottom: 8px;
          width: min(78%, 620px);
          height: 78%;
          border-radius: 32px;
          background:
            linear-gradient(180deg, rgba(16, 41, 28, 0.12), rgba(16, 41, 28, 0.22)),
            url('/images/rice-landscape.png') center 62% / cover no-repeat;
          opacity: 0.7;
          filter: saturate(1.1);
          box-shadow: inset 0 0 0 1px rgba(216,180,90,0.15);
        }

        .hero-frame {
          position: relative;
          z-index: 1;
          width: min(100%, 680px);
          min-height: 540px;
          padding: 0;
          border-radius: 28px;
          overflow: hidden;
          background: rgba(17, 42, 30, 0.12);
          border: 1px solid rgba(216,180,90,0.18);
          box-shadow: 0 26px 60px rgba(9, 18, 14, 0.22);
        }

        .hero-frame::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(12,26,20,0.02), rgba(12,26,20,0.06));
          pointer-events: none;
        }

        .hero-frame img {
          display: block;
          width: 100%;
          height: 540px;
          object-fit: contain;
          object-position: center center;
          border-radius: 28px;
          transform: none;
          margin: 0 auto;
          background: rgba(255,255,255,0.02);
        }

        .floating-card {
          position: absolute;
          right: 18px;
          bottom: 20px;
          z-index: 2;
          width: min(100%, 220px);
          margin: 0;
          padding: 18px 18px 16px;
          border-radius: 20px;
          background: rgba(10, 24, 17, 0.84);
          border: 1px solid rgba(216,180,90,0.28);
          color: #f6f0e7;
          backdrop-filter: blur(2px);
          box-shadow: 0 18px 38px rgba(0,0,0,0.22);
        }

        .floating-card strong {
          display: block;
          font-size: 1.4rem;
          color: #f0ce69;
        }

        .floating-card span {
          display: block;
          margin-top: 8px;
          color: rgba(255,255,255,0.7);
          font-size: 0.8rem;
          line-height: 1.7;
        }

        .content-section {
          width: min(1900px, calc(100% - 40px));
          margin: 10px;
          padding: 110px 0 0;
        }

        #story {
          width: min(1900px, calc(100% - 40px));
          padding: 58px 48px 56px;
          border: 1px solid rgba(218, 184, 91, 0.18);
          border-radius: 28px;
          background: rgba(10, 29, 20, 0.34);
        }

        .section-heading {
          max-width: 720px;
          margin-bottom: 44px;
        }

        #story .section-heading {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          width: 100%;
          max-width: none;
          margin: 0 auto 48px;
          overflow: visible;
        }

        #story .section-heading h2 {
          width: 100%;
          max-width: none;
          min-width: 0;
          font-size: clamp(2.4rem, 4vw, 4.4rem);
          line-height: 1.08;
          letter-spacing: -0.04em;
          margin: 0;
          word-break: normal;
          white-space: nowrap;
        }

        .mission-section .section-heading,
        .timeline-section .section-heading {
          display: flex;
          align-items: center;
          gap: 18px;
          width: min(1800px, 100%);
          max-width: none;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }

        .section-description {
          max-width: 100%;
          margin-top: 0;
          margin-bottom: 32px;
          color: rgba(241, 234, 214, 0.8);
          font-size: 1.02rem;
          line-height: 1.8;
        }

        .mission-section .section-description {
          max-width: 1180px;
          margin-bottom: 32px;
        }

        .section-heading h2 {
          margin-top: 18px;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(2.8rem, 3.8vw, 4.5rem);
          line-height: 0.98;
          letter-spacing: -0.04em;
          font-weight: 600;
          color: #f3e8d1;
        }

        #story .section-heading h2 {
          margin-top: -10px;
          font-style: normal;
        }

        .mission-section .section-heading h2,
        .timeline-section .section-heading h2 {
          margin-top: -20px;
          flex: 1 1 620px;
          min-width: 0;
          font-size: clamp(3rem, 4vw, 5rem);
          line-height: 0.92;
          letter-spacing: -0.045em;
          font-style: normal;
        }

        .story-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 40px 48px;
          align-items: stretch;
        }

        .story-visual {
          position: relative;
          min-height: 0;
        }

        .story-image-wrap .section-kicker {
          position: absolute;
          top: 18px;
          left: 18px;
          z-index: 2;
          width: fit-content;
          padding: 8px 14px;
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          background: rgba(9, 24, 17, 0.72);
          backdrop-filter: blur(8px);
        }

        .story-image-wrap {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: 28px;
          box-shadow: 0 24px 58px rgba(8, 17, 14, 0.24);
          border: 1px solid rgba(218, 184, 91, 0.22);
        }

        .story-image-wrap img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 45%;
        }

        .story-badges {
          position: absolute;
          left: 18px;
          right: 18px;
          bottom: 18px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .story-badges span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(9, 24, 17, 0.7);
          border: 1px solid rgba(216,180,90,0.2);
          color: #f1db9d;
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .story-copy {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 20px;
          min-height: 100%;
          padding: 4px 0 2px;
        }

        .story-copy-body {
          display: grid;
          gap: 16px;
        }

        .story-copy p {
          color: rgba(245, 239, 219, 0.82);
          line-height: 1.8;
          font-size: 1.02rem;
        }

        .story-copy ul {
          list-style: none;
          display: grid;
          gap: 12px;
          padding: 0;
          margin: 0;
        }

        .story-copy li {
          position: relative;
          padding-left: 28px;
          color: rgba(245, 239, 219, 0.9);
          line-height: 1.75;
          font-size: 1rem;
        }

        .story-copy li::before {
          content: "✓";
          position: absolute;
          left: 0;
          top: 0;
          width: 20px;
          height: 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(212, 188, 96, 0.14);
          color: #f0ce69;
          font-weight: 800;
        }

        .highlight-box {
          margin-top: 8px;
          padding: 16px 20px;
          border-radius: 16px;
          border: 1px solid rgba(218, 184, 91, 0.22);
          background: rgba(250, 244, 230, 0.05);
          color: #f0ce69;
          font-family: Inter, sans-serif;
          font-size: 0.92rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          line-height: 1.55;
        }

        .timeline {
          position: relative;
          width: min(1220px, calc(100% - 30px));
          display: grid;
          gap: 18px;
          margin: 40px auto 0;
          padding: 24px 18px 8px;
          border-radius: 28px;
          background: rgba(18, 42, 31, 0.16);
          border: 1px solid rgba(218, 184, 91, 0.14);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.02);
        }

        .timeline:before {
          content: "";
          position: absolute;
          left: 77px;
          top: 18px;
          bottom: 18px;
          width: 2px;
          background: linear-gradient(180deg, rgba(52,83,62,0.18), rgba(215,180,93,0.7), rgba(52,83,62,0.18));
        }

        .timeline-item {
          display: grid;
          grid-template-columns: 110px 1fr;
          gap: 26px;
          align-items: center;
          min-height: 116px;
        }

        .timeline-year {
          position: relative;
          z-index: 1;
          width: 76px;
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0e2a1d, #1c4a32);
          color: #f0ce69;
          font-weight: 800;
          border: 2px solid rgba(216,180,90,0.45);
          box-shadow: 0 12px 24px rgba(16, 37, 26, 0.12);
        }

        .timeline-card {
          padding: 18px 26px;
          border-radius: 20px;
          background: rgba(223, 229, 212, 0.12);
          border: 1px solid rgba(209, 177, 90, 0.10);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
        }

        .timeline-card h3 {
          margin-bottom: 8px;
          color: #f5efdf;
          font-size: 1.8rem;
          font-family: "Cormorant Garamond", serif;
          font-weight: 600;
          letter-spacing: -0.02em;
        }

        .timeline-card p {
          color: rgba(245, 239, 219, 0.82);
          line-height: 1.8;
          font-size: 1.04rem;
        }

        .mission-section {
          position: relative;
          overflow: hidden;
          width: min(1900px, calc(100% - 40px));
          margin-top: 48px;
          padding: 58px 48px 56px;
          border: 1px solid rgba(218, 184, 91, 0.18);
          border-radius: 28px;
          background: linear-gradient(rgba(7, 30, 21, 0.84), rgba(7, 30, 21, 0.9)), url('/images/rice-landscape.png') center / cover no-repeat;
          background-attachment: fixed;
        }

        .timeline-section {
          position: relative;
          overflow: hidden;
          width: min(1900px, calc(100% - 40px));
          margin-top: 48px;
          padding: 58px 48px 56px;
          border: 1px solid rgba(218, 184, 91, 0.18);
          border-radius: 28px;
          background:
            linear-gradient(90deg, rgba(7, 30, 21, 0.9), rgba(7, 30, 21, 0.72)),
            url('/images/rice-landscape.png') center / cover no-repeat;
        }

        .value-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
          margin-top: 18px;
        }

        .value-card {
          padding: 36px 28px 32px;
          border-radius: 24px;
          border: 1px solid rgba(209, 177, 90, 0.14);
          background: linear-gradient(180deg, rgba(218, 208, 170, 0.14), rgba(194, 188, 143, 0.22));
          box-shadow: 0 16px 30px rgba(17, 34, 24, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .value-card:hover {
          transform: translateY(-8px);
          border-color: rgba(216,180,90,0.9);
          box-shadow: 0 26px 40px rgba(17, 34, 24, 0.12);
        }

        .value-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 68px;
          height: 68px;
          border-radius: 18px;
          background: linear-gradient(135deg, rgba(216,180,90,0.16), rgba(20,56,38,0.10));
          color: #f0d47d;
          font-size: 1.8rem;
          font-weight: 800;
          margin-bottom: 20px;
        }

        .value-card h3 {
          margin-bottom: 12px;
          color: #f4e9cc;
          font-family: "Cormorant Garamond", serif;
          font-size: 2.2rem;
        }

        .value-card p {
          color: rgba(245, 239, 219, 0.82);
          line-height: 1.8;
        }

        .stats-section {
          margin-top: 110px;
          padding: 86px 5%;
          background: linear-gradient(135deg, #112d1e 0%, #1a3d2d 100%);
          color: #f7f3ea;
        }

        .stats-grid {
          width: min(1200px, 100%);
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 24px;
        }

        .stat-card {
          padding: 30px 16px;
          text-align: center;
          border-radius: 24px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(216,180,90,0.18);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
        }

        .stat-card strong {
          display: block;
          font-size: clamp(2rem, 4vw, 3rem);
          color: #f0ce69;
          font-weight: 800;
          line-height: 1;
        }

        .stat-card span {
          display: block;
          margin-top: 12px;
          color: rgba(255,255,255,0.8);
          font-size: 0.9rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .commitment-section {
          width: min(1200px, calc(100% - 40px));
          margin: 0 auto;
          padding: 110px 0 120px;
        }

        .commitment-header {
          max-width: 900px;
          margin: 0 auto 42px;
          text-align: center;
        }

        .commitment-header h2 {
          margin-top: 18px;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(2.8rem, 4vw, 4.1rem);
          color: #f3e8d1;
          line-height: 1.02;
        }

        .commitment-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 22px;
        }

        .commitment-card {
          padding: 30px 22px;
          border-radius: 22px;
          background: rgba(218, 208, 170, 0.12);
          border: 1px solid rgba(209, 177, 90, 0.14);
          box-shadow: 0 14px 30px rgba(17, 34, 24, 0.05);
        }

        .commitment-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 54px;
          height: 54px;
          border-radius: 16px;
          background: rgba(216,180,90,0.12);
          color: #9d7a29;
          font-size: 1.5rem;
          font-weight: 800;
        }

        .commitment-card h3 {
          margin-top: 18px;
          font-size: 1.5rem;
          color: #f4e9cc;
        }

        .commitment-card p {
          margin-top: 12px;
          color: rgba(245, 239, 219, 0.82);
          line-height: 1.8;
        }

        .footer {
          width: min(1200px, calc(100% - 40px));
          margin: 0 auto;
          padding: 30px 0 80px;
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr 1.3fr;
          gap: 28px;
          border-top: 1px solid rgba(221, 211, 163, 0.18);
          color: rgba(245, 239, 219, 0.88);
          background: rgba(11, 25, 17, 0.38);
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #f5f0df;
        }

        .footer h3 {
          margin-bottom: 16px;
          color: #f0d882;
          font-size: 0.8rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .footer a,
        .footer p {
          display: block;
          margin-bottom: 10px;
          color: rgba(239, 234, 214, 0.8);
          text-decoration: none;
          line-height: 1.8;
        }

        @media (max-width: 1000px) {
          .about-hero {
            grid-template-columns: 1fr;
            padding-top: 160px;
            padding-left: 28px;
            padding-right: 28px;
          }

          #story {
            padding: 42px 28px 40px;
          }

          .mission-section {
            padding: 42px 28px 40px;
          }

          .timeline-section {
            padding: 42px 28px 40px;
          }

          .about-hero-content {
            max-width: 100%;
            padding-left: 0;
            padding-right: 0;
          }

          .hero-visual {
            justify-content: flex-start;
            padding-right: 0;
          }

          .hero-visual::before {
            right: 12px;
            width: 78%;
            height: 74%;
          }

          #story .section-heading {
            margin-bottom: 32px;
          }

          .story-layout {
            gap: 28px;
          }

          .mission-section .section-heading,
          .timeline-section .section-heading {
            display: block;
          }

          .mission-section .section-heading h2,
          .timeline-section .section-heading h2 {
            margin-top: 18px;
            font-size: clamp(2.6rem, 6vw, 4rem);
          }

          .story-layout,
          .value-grid,
          .commitment-grid,
          .stats-grid,
          .footer {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 700px) {
          .user-header {
            width: calc(100% - 18px);
            padding: 14px 18px;
            gap: 12px;
            flex-wrap: wrap;
            justify-content: center;
          }

          .catalog-nav {
            width: 100%;
            justify-content: center;
            flex-wrap: wrap;
            gap: 12px 18px;
          }

          .about-hero {
            min-height: 680px;
            padding: 140px 20px 28px;
          }

          #story {
            width: calc(100% - 20px);
            padding: 32px 20px 28px;
          }

          .mission-section {
            width: calc(100% - 20px);
            padding: 32px 20px 28px;
          }

          .timeline-section {
            width: calc(100% - 20px);
            padding: 32px 20px 28px;
          }

          .about-hero h1 {
            font-size: clamp(2.8rem, 11vw, 4.4rem);
          }

          .story-layout,
          .value-grid,
          .commitment-grid,
          .stats-grid,
          .footer {
            grid-template-columns: 1fr;
          }

          .timeline {
            width: calc(100% - 18px);
          }

          .timeline-item {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .timeline:before {
            left: 30px;
          }

          .timeline-year {
            margin-left: 0;
          }

          .story-visual {
            min-height: 280px;
          }

          .story-image-wrap {
            position: relative;
            inset: auto;
            min-height: 280px;
            height: 320px;
          }

          .story-image-wrap img {
            min-height: 280px;
            height: 320px;
          }

          #story .section-heading h2 {
            white-space: normal;
          }
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

      <SiteHeader active="about" />

      <section className="about-hero">
        <div className="about-hero-content reveal">
          <span className="mini-badge">Về chúng tôi</span>
          <h1>Kiến tạo giá trị từ hạt gạo Việt</h1>
          <p>
            Vigen Food là thương hiệu gạo Việt hướng tới việc mang đến những sản phẩm chất lượng cao,
            giàu dinh dưỡng và đáng tin cậy cho từng bữa ăn của gia đình Việt Nam.
          </p>

          <div className="hero-actions">
            <button type="button" className="primary-btn" onClick={() => setAuthOpen(true)}>Khám phá câu chuyện</button>
            <button type="button" className="secondary-btn">Liên hệ chúng tôi</button>
          </div>

          <div className="hero-trust">
            <span>Nguyên liệu rõ nguồn gốc</span>
            <span>Chất lượng kiểm soát</span>
            <span>Đồng hành bền vững</span>
          </div>
        </div>

        <div className="hero-visual reveal">
          <div className="hero-frame">
            <img src="/images/vigenfood.png" alt="Gạo Vigen Food" />
          </div>
          <div className="floating-card">
            <strong>100%</strong>
            <span>Tiêu chuẩn chất lượng từ nguyên liệu đến sản phẩm cuối cùng.</span>
          </div>
        </div>
      </section>

      <section id="story" className="content-section">
        <div className="section-heading reveal">
          <h2>Chất lượng là nền tảng – Uy tín là cam kết.</h2>
        </div>

        <div className="story-layout reveal">
          <div className="story-visual">
            <div className="story-image-wrap">
              <span className="section-kicker">Câu chuyện</span>
              <img src="/images/rice-landscape.png" alt="Ruộng gạo Việt" />
              <div className="story-badges">
                <span>Nguyên liệu rõ ràng</span>
                <span>Chất lượng kiểm soát</span>
                <span>Đồng hành bền vững</span>
              </div>
            </div>
          </div>

          <div className="story-copy">
            <div className="story-copy-body">
              <p>
                Vigen Food hướng tới việc mang đến những sản phẩm gạo Việt có chất lượng tốt nhất,
                đáp ứng tiêu chuẩn an toàn và cam kết với từng bữa ăn gia đình.
              </p>
              <p>
                Chúng tôi gắn kết các nguồn nguyên liệu, quy trình kiểm soát và đội ngũ chuyên môn
                để tạo ra những sản phẩm gạo an toàn, giàu dinh dưỡng và phù hợp với nhu cầu tiêu dùng
                hiện đại của người Việt.
              </p>
              <ul>
                {storyPoints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="highlight-box">Từ vùng nguyên liệu đến bữa cơm gia đình — kiểm soát chặt chẽ từng bước.</div>
          </div>
        </div>
      </section>

      <section className="mission-section content-section">
        <div className="section-heading reveal">
          <span className="section-kicker">Sứ mệnh</span>
          <h2>Đặt chất lượng lên hàng đầu</h2>
        </div>
        <p className="section-description reveal">
          Chúng tôi tin rằng một bữa cơm ngon không chỉ là hạt gạo đẹp, mà còn là sự tin tưởng từ
          nguồn nguyên liệu, quy trình sản xuất tới niềm vui của mỗi gia đình khi thưởng thức.
        </p>

        <div className="value-grid reveal">
          {values.map((value) => (
            <article key={value.title} className="value-card">
              <div className="value-icon" aria-hidden="true">{value.icon}</div>
              <h3>{value.title}</h3>
              <p>{value.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="timeline-section content-section">
        <div className="section-heading reveal">
          <span className="section-kicker">Lộ trình</span>
          <h2>Hành trình phát triển</h2>
        </div>

        <div className="timeline reveal">
          {timeline.map((item) => (
            <div key={item.year} className="timeline-item">
              <div className="timeline-year">{item.year}</div>
              <div className="timeline-card">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="stats-section reveal">
        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <strong data-target={stat.value} data-suffix={stat.suffix}>{0}{stat.suffix}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="commitment-section">
        <div className="commitment-header reveal">
          <span className="section-kicker">Cam kết</span>
          <h2>Giá trị mà chúng tôi mang đến</h2>
        </div>
        <div className="commitment-grid reveal">
          {commitments.map((item) => (
            <article key={item.title} className="commitment-card">
              <div className="commitment-icon" aria-hidden="true">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </main>
  );
}
