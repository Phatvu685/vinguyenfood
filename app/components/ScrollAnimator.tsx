"use client";

import { useEffect } from "react";

/**
 * ScrollAnimator — gắn vào layout.tsx để chạy toàn bộ trang.
 * Tự động tìm các phần tử và thêm hiệu ứng cuộn.
 */
export default function ScrollAnimator() {
  useEffect(() => {
    // Các selector sẽ được tự động thêm animation khi scroll vào
    const SELECTORS = [
      // Headings
      "h1, h2, h3",
      // Sections
      ".scroll-reveal",
      // Cards và articles
      ".catalog-card",
      ".news-card",
      ".value-card",
      ".commitment-card",
      ".prv-card",
      ".rv-card",
      ".vigen-trust-item",
      ".vigen-spec-card",
      ".vigen-policy",
      // Specific sections
      ".services > div",
      ".why-grid > article",
      ".season-stats > div",
      ".vigen-story-benefits > div",
      ".vigen-guide-grid > div",
      // Products
      ".products > *",
      ".promotions > *",
      // Footer / CTA
      ".final-cta",
      ".prv-score-card",
      ".prv-write-card",
      ".prv-section",
      ".rv-score-card",
      ".rv-write-card",
    ].join(", ");

    const elements = document.querySelectorAll<HTMLElement>(SELECTORS);

    // Gán class và delay theo thứ tự trong nhóm (stagger)
    const groups = new Map<Element, HTMLElement[]>();

    elements.forEach((el) => {
      if (el.hasAttribute("data-sr-init")) return;
      el.setAttribute("data-sr-init", "1");

      // Tìm parent gần nhất để nhóm stagger
      const parent = el.parentElement ?? document.body;
      if (!groups.has(parent)) groups.set(parent, []);
      groups.get(parent)!.push(el);
    });

    // Gán delay stagger và class sr-hidden
    groups.forEach((children) => {
      children.forEach((el, i) => {
        el.classList.add("sr-hidden");
        el.style.setProperty("--sr-delay", `${i * 80}ms`);
      });
    });

    // IntersectionObserver để reveal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.add("sr-visible");
            el.classList.remove("sr-hidden");
            observer.unobserve(el); // chỉ animate 1 lần
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -48px 0px" }
    );

    // Re-query sau khi class đã gán
    document.querySelectorAll<HTMLElement>(".sr-hidden").forEach((el) => {
      observer.observe(el);
    });

    // Khi route thay đổi (Next.js navigation) — re-scan
    const handleNav = () => {
      setTimeout(() => {
        document.querySelectorAll<HTMLElement>(SELECTORS).forEach((el) => {
          if (el.hasAttribute("data-sr-init")) return;
          el.setAttribute("data-sr-init", "1");

          const parent = el.parentElement ?? document.body;
          const siblings = Array.from(parent.querySelectorAll<HTMLElement>("[data-sr-init]"));
          const i = siblings.indexOf(el);

          el.classList.add("sr-hidden");
          el.style.setProperty("--sr-delay", `${Math.max(0, i) * 80}ms`);
          observer.observe(el);
        });
      }, 100);
    };

    window.addEventListener("popstate", handleNav);

    return () => {
      observer.disconnect();
      window.removeEventListener("popstate", handleNav);
    };
  }, []);

  return null; // Không render UI
}
