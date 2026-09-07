import BrandLogo from "./BrandLogo";

export default function SiteFooter() {
  return (
    <footer className="site-footer" id="footer">
      <div className="site-footer-main">
        <div className="site-footer-brand">
          <a className="site-footer-logo" href="/"><BrandLogo compact /></a>
          <p>Chúng tôi cam kết mang đến những sản phẩm gạo chất lượng nhất từ thiên nhiên.</p>
          <div className="site-footer-socials" aria-label="Mạng xã hội">
            <a href="#footer" aria-label="Facebook">f</a>
            <a href="#footer" aria-label="Youtube">▶</a>
            <a href="#footer" aria-label="TikTok">♪</a>
            <a href="#footer" aria-label="Zalo">Zalo</a>
          </div>
        </div>

        <div className="site-footer-column">
          <h3>VỀ CHÚNG TÔI</h3>
          <a href="/ve-chung-toi">Giới thiệu</a>
          <a href="/ve-chung-toi">Sứ mệnh</a>
          <a href="/ve-chung-toi">Quy trình sản xuất</a>
          <a href="/tin-tuc">Tin tức</a>
        </div>

        <div className="site-footer-column">
          <h3>HỖ TRỢ KHÁCH HÀNG</h3>
          <a href="#footer">Chính sách đổi trả</a>
          <a href="#footer">Chính sách vận chuyển</a>
          <a href="#footer">Hướng dẫn mua hàng</a>
          <a href="#footer">Câu hỏi thường gặp</a>
        </div>

        <div className="site-footer-column site-footer-contact">
          <h3>LIÊN HỆ</h3>
          <a href="tel:0939732736">♧&nbsp; 093 973 2736</a>
          <a href="mailto:info@vigenfood.com">✉&nbsp; info@vigenfood.com</a>
          <span>⌖&nbsp; Cần Thơ, Việt Nam</span>
        </div>

        <div className="site-footer-newsletter">
          <h3>ĐĂNG KÝ NHẬN TIN</h3>
          <p>Nhận thông tin và ưu đãi mới nhất<br />từ Vigen Food</p>
          <form onSubmit={(event) => event.preventDefault()}>
            <input type="email" placeholder="Nhập email của bạn" aria-label="Email nhận tin" required />
            <button type="submit" aria-label="Đăng ký nhận tin">➤</button>
          </form>
        </div>
      </div>
      <div className="site-footer-bottom">
        <span>© 2026 Vigen Food. All rights reserved.</span>
        <span>Thiết kế với <b>♥</b> bởi Vigen Food</span>
      </div>
    </footer>
  );
}
