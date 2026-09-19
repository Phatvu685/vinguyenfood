"use client";

import { useEffect, useState } from "react";

type Review = {
  id: number;
  name: string;
  initials: string;
  date: string;
  rating: number;
  comment: string;
  verified: boolean;
  color: string;
  reply?: string;
};

const reviewsKey = "gao-ngon-reviews";

const REVIEWS_DATA: Review[] = [
  {
    id: 1,
    name: "Minh Anh",
    initials: "MA",
    date: "12/08/2025",
    rating: 5,
    comment: "Gạo thơm, hạt đều và cơm dẻo. Gia đình mình ăn rất hợp, sẽ mua lại.",
    verified: true,
    color: "#4f7c5a",
  },
  {
    id: 2,
    name: "Thanh Hương",
    initials: "TH",
    date: "08/08/2025",
    rating: 5,
    comment: "Đóng gói cẩn thận, giao nhanh. Cơm để nguội vẫn mềm và thơm.",
    verified: true,
    color: "#7a5f3a",
  },
  {
    id: 3,
    name: "Hoàng Nam",
    initials: "HN",
    date: "01/08/2025",
    rating: 5,
    comment: "Mình đã mua lại ST25 lần thứ ba rồi. Chất lượng ổn định, không bao giờ thất vọng.",
    verified: true,
    color: "#3a6878",
  },
  {
    id: 4,
    name: "Ngọc Mai",
    initials: "NM",
    date: "28/07/2025",
    rating: 4,
    comment: "Hạt gạo đẹp, nấu lên thơm và không bị khô khi để lâu.",
    verified: true,
    color: "#806044",
  },
  {
    id: 5,
    name: "Đức Thành",
    initials: "ĐT",
    date: "21/07/2025",
    rating: 5,
    comment: "Giao hàng nhanh, bao bì chắc chắn và cơm rất dẻo.",
    verified: true,
    color: "#52736b",
  },
  {
    id: 6,
    name: "Lan Chi",
    initials: "LC",
    date: "15/07/2025",
    rating: 5,
    comment: "Vị ngọt tự nhiên, cả nhà đều thích. Sẽ tiếp tục ủng hộ.",
    verified: true,
    color: "#76634b",
  },
];

const RATING_DIST = [
  { stars: 5, pct: 82 },
  { stars: 4, pct: 14 },
  { stars: 3, pct: 4 },
  { stars: 2, pct: 0 },
  { stars: 1, pct: 0 },
];

const RATING_LABELS: Record<number, string> = {
  1: "★ · Rất tệ",
  2: "★★ · Tệ",
  3: "★★★ · Bình thường",
  4: "★★★★ · Hài lòng",
  5: "★★★★★ · Rất hài lòng",
};

export default function ReviewsSection() {
  const [selectedRating, setSelectedRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(REVIEWS_DATA);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(reviewsKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setReviews(parsed as Review[]);
      }
    } catch {
      // Keep the built-in reviews when stored data is unavailable.
    }
  }, []);

  function handleSubmit() {
    if (!comment.trim()) return;
    const initials = "Bạn";
    const nextReviews = [
      {
        id: Date.now(),
        name: "Khách hàng mới",
        initials,
        date: new Date().toLocaleDateString("vi-VN"),
        rating: selectedRating,
        comment: comment.trim(),
        verified: false,
        color: "#b8903a",
      },
      ...reviews,
    ];
    setReviews(nextReviews);
    window.localStorage.setItem(reviewsKey, JSON.stringify(nextReviews));
    window.dispatchEvent(new Event("gao-ngon-reviews-updated"));
    setSubmitted(true);
    setComment("");
    setTimeout(() => setSubmitted(false), 3500);
  }

  return (
    <section id="reviews" className="prv-section scroll-reveal">
      <div className="prv-header">
        <span className="prv-kicker">⭐ ĐÁNH GIÁ KHÁCH HÀNG</span>
        <h2 className="prv-title">
          Khách hàng nói gì<br /><em>về sản phẩm?</em>
        </h2>
      </div>

      <div className="prv-body">
        <div className="prv-left">
          <div className="prv-score-card">
            <div className="prv-score-main">
              <span className="prv-score-num">4.9</span>
              <span className="prv-score-den">/5</span>
            </div>
            <div className="prv-stars">★★★★★</div>
            <p className="prv-score-sub">98 đánh giá</p>

            <div className="prv-bars">
              {RATING_DIST.map(({ stars, pct }) => (
                <div key={stars} className="prv-bar-row">
                  <span className="prv-bar-lbl">{stars} sao</span>
                  <div className="prv-bar-track">
                    <div className="prv-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="prv-bar-pct">{pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="prv-write-card">
            <p className="prv-write-title">✍️ Viết đánh giá của bạn</p>

            <div className="prv-field">
              <label className="prv-label">Đánh giá của bạn</label>
              <select
                className="prv-select"
                value={selectedRating}
                onChange={(e) => setSelectedRating(Number(e.target.value))}
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{RATING_LABELS[r]}</option>
                ))}
              </select>
            </div>

            <div className="prv-field">
              <label className="prv-label">Chia sẻ cảm nhận</label>
              <textarea
                className="prv-textarea"
                placeholder="Gạo có hợp khẩu vị của bạn không?..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
            </div>

            <div className="prv-form-actions">
              <button className="prv-btn-ghost" type="button" onClick={() => setComment("")}>Hủy</button>
              <button
                className="prv-btn-gold"
                type="button"
                onClick={handleSubmit}
              >
                {submitted ? "✓ Đã gửi!" : "Gửi đánh giá →"}
              </button>
            </div>

            {submitted && (
              <div className="prv-success">
                🎉 Cảm ơn bạn đã chia sẻ! Đánh giá của bạn đang được duyệt.
              </div>
            )}
          </div>
        </div>

        <div className="prv-right">
          <div className="prv-cards">
            {reviews.slice(0, showAllReviews ? reviews.length : 3).map((review) => (
              <article key={review.id} className="prv-card">
                <header className="prv-card-header">
                  <div className="prv-avatar" style={{ background: review.color }}>
                    {review.initials}
                  </div>
                  <div className="prv-card-meta">
                    <strong>{review.name}</strong>
                    <span>{review.date}</span>
                  </div>
                  <div className="prv-card-stars">{"★".repeat(review.rating)}</div>
                </header>
                <p className="prv-card-comment">"{review.comment}"</p>
                {review.verified ? (
                  <span className="prv-verified">✔ Đã mua hàng</span>
                ) : (
                  <span className="prv-verified">✔ Hiển thị ngay</span>
                )}
                {review.reply && (
                  <div className="prv-review-reply">
                    <strong>Phản hồi của cửa hàng</strong>
                    <p>{review.reply}</p>
                  </div>
                )}
              </article>
            ))}
          </div>

          <div className="prv-cta" style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              className="prv-open-btn"
              style={{ width: "auto", minWidth: 180 }}
              onClick={() => setShowAllReviews((current) => !current)}
            >
              {showAllReviews ? "Thu gọn đánh giá ↑" : "Xem tất cả đánh giá →"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
