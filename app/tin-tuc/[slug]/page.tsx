"use client";

import Link from "next/link";
import { useState } from "react";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import styles from "./page.module.css";

export default function NewsArticlePage() {
  const [showDetails, setShowDetails] = useState(false);

  const handleReadMore = () => {
    setShowDetails((visible) => !visible);
  };

  const handleShare = async () => {
    const shareData = {
      title: "Khởi động mùa gặt 2026: Nâng tầm hạt gạo Việt Nam lên chuẩn quốc tế",
      text: "Khám phá câu chuyện mùa gặt 2026 của Gạo Ngon.",
      url: window.location.href,
    };

    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    await navigator.clipboard.writeText(window.location.href);
    window.alert("Đã sao chép liên kết bài viết.");
  };

  return (
    <main className={styles.page}>
      <SiteHeader active="news" />
      <div className={styles.content}>
        <article className={styles.article}>
          <Link href="/tin-tuc" className={styles.backLink}>← Quay lại tin tức</Link>
          <span className={styles.tag}>Mùa vụ mới</span>
          <h1>Khởi động mùa gặt 2026: Nâng tầm hạt gạo Việt Nam lên chuẩn quốc tế</h1>
          <div className={styles.meta}><span>▣　26 Tháng 8, 2026</span><i /> <span>◷　5 phút đọc</span></div>
          <div className={styles.heroImage} />
          <p>
            Với quy trình chọn lọc, sấy khô và bảo quản hiện đại, Gạo Ngon tiếp tục
            mang tới hạt gạo dẻo thơm, ngọt tự nhiên, giữ trọn hương vị cho từng
            bữa ăn gia đình.
          </p>
          <div className={styles.actions}>
            <button type="button" onClick={handleReadMore}>
              {showDetails ? "Thu gọn　‹" : "Xem thêm　›"}
            </button>
            <button type="button" className={styles.share} onClick={handleShare}>♧　Chia sẻ bài viết</button>
          </div>
          {showDetails && (
            <div className={styles.details} id="article-content">
              <h2>Giữ trọn chất lượng từ cánh đồng đến bàn ăn</h2>
              <p>Mỗi mùa gặt là một hành trình được chuẩn bị kỹ lưỡng. Gạo được kiểm tra nguyên liệu, sấy đúng độ và đóng gói cẩn thận để giữ hương vị tự nhiên khi đến tay khách hàng.</p>
              <p>Đây cũng là cam kết của Gạo Ngon trong việc đồng hành cùng những vùng nguyên liệu uy tín và mang giá trị hạt gạo Việt đến nhiều gia đình hơn.</p>
            </div>
          )}
        </article>
        <aside className={styles.related}>
          <div className={styles.relatedHeading}><h2>TIN TỨC LIÊN QUAN</h2><Link href="/tin-tuc">Xem tất cả　›</Link></div>
          {[
            ["Gạo Việt và hành trình chinh phục thị trường quốc tế", "20 Tháng 8, 2026", "/images/rice-landscape.png"],
            ["Bí quyết giữ hạt gạo thơm ngon trọn vị", "18 Tháng 8, 2026", "/images/st.png"],
            ["Mùa vụ bội thu – Niềm vui của người nông dân", "15 Tháng 8, 2026", "/images/product-field.jpg"],
            ["Quy trình chọn lọc gạo sạch tại Vi Nguyên", "12 Tháng 8, 2026", "/images/hinh gao2t25.jpg"],
          ].map(([title, date, image]) => <Link className={styles.relatedItem} href="/tin-tuc" key={title}><span style={{ backgroundImage: `url("${image}")` }} /><div><b>{title}</b><small>▣　{date}</small></div><em>›</em></Link>)}
          <div className={styles.relatedCta}>
            <span>BỮA CƠM NHÀ MÌNH</span>
            <b>Chọn hạt gạo ngon cho gia đình hôm nay.</b>
            <Link href="/san-pham">Xem sản phẩm　→</Link>
          </div>
        </aside>
      </div>
      <SiteFooter />
    </main>
  );
}
