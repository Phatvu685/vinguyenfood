"use client";

import { useEffect, useMemo, useState } from "react";

export type AdminReview = {
    id: number;
    name: string;
    product: string;
    rating: number;
    comment: string;
    date: string;
    verified: boolean;
    reply?: string;
};

const reviewsKey = "gao-ngon-reviews";

const defaultReviews: AdminReview[] = [
    { id: 1, name: "Minh Anh", product: "Gạo ST25 Thượng Hạng", rating: 5, comment: "Gạo thơm, hạt đều và cơm dẻo. Gia đình mình ăn rất hợp, sẽ mua lại.", date: "12/08/2025", verified: true },
    { id: 2, name: "Thanh Hương", product: "Gạo Nhật Japonica", rating: 5, comment: "Đóng gói cẩn thận, giao nhanh. Cơm để nguội vẫn mềm và thơm.", date: "08/08/2025", verified: true },
    { id: 3, name: "Hoàng Nam", product: "Gạo ST25 Thượng Hạng", rating: 5, comment: "Mình đã mua lại ST25 lần thứ ba rồi. Chất lượng ổn định, không bao giờ thất vọng.", date: "01/08/2025", verified: true },
    { id: 4, name: "Ngọc Mai", product: "Gạo Nàng Thơm Chợ Đào", rating: 4, comment: "Hạt gạo đẹp, nấu lên thơm và không bị khô khi để lâu.", date: "28/07/2025", verified: true },
];

function readReviews(): AdminReview[] {
    try {
        const stored = localStorage.getItem(reviewsKey);
        if (!stored) return defaultReviews;
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : defaultReviews;
    } catch {
        return defaultReviews;
    }
}

export default function ReviewsManager({ showNotice }: { showNotice: (text: string, tone?: "success" | "info" | "warning" | "error") => void }) {
    const [reviews, setReviews] = useState<AdminReview[]>([]);
    const [query, setQuery] = useState("");
    const [ratingFilter, setRatingFilter] = useState("all");
    const [replyingId, setReplyingId] = useState<number | null>(null);
    const [reply, setReply] = useState("");

    useEffect(() => {
        setReviews(readReviews());
    }, []);

    const filteredReviews = useMemo(() => reviews.filter((review) => {
        const matchesQuery = `${review.name} ${review.product} ${review.comment}`.toLowerCase().includes(query.toLowerCase());
        const matchesRating = ratingFilter === "all" || review.rating === Number(ratingFilter);
        return matchesQuery && matchesRating;
    }), [query, ratingFilter, reviews]);

    function saveReviews(nextReviews: AdminReview[]) {
        setReviews(nextReviews);
        localStorage.setItem(reviewsKey, JSON.stringify(nextReviews));
        window.dispatchEvent(new Event("gao-ngon-reviews-updated"));
    }

    function openReply(review: AdminReview) {
        setReplyingId(review.id);
        setReply(review.reply || "");
    }

    function saveReply(reviewId: number) {
        const nextReply = reply.trim();
        if (!nextReply) {
            showNotice("Vui lòng nhập nội dung phản hồi", "warning");
            return;
        }
        saveReviews(reviews.map((review) => review.id === reviewId ? { ...review, reply: nextReply } : review));
        setReplyingId(null);
        setReply("");
        showNotice("Đã đăng phản hồi cho khách hàng");
    }

    function removeReview(reviewId: number) {
        saveReviews(reviews.filter((review) => review.id !== reviewId));
        showNotice("Đã xóa đánh giá");
    }

    return (
        <section className="admin-manager">
            <div className="admin-product-heading">
                <div>
                    <span className="admin-kicker">CHĂM SÓC KHÁCH HÀNG</span>
                    <h2>Quản lý đánh giá</h2>
                    <p>Xem phản hồi của khách hàng và trả lời trực tiếp trên website.</p>
                </div>
                <div className="admin-review-summary"><strong>{reviews.length}</strong><span>đánh giá</span></div>
            </div>

            <div className="admin-review-toolbar">
                <input className="vg-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên, sản phẩm hoặc nội dung..." />
                <select className="vg-select" value={ratingFilter} onChange={(event) => setRatingFilter(event.target.value)}>
                    <option value="all">Tất cả số sao</option>
                    <option value="5">★★★★★ 5 sao</option>
                    <option value="4">★★★★ 4 sao</option>
                    <option value="3">★★★ 3 sao</option>
                    <option value="2">★★ 2 sao</option>
                    <option value="1">★ 1 sao</option>
                </select>
            </div>

            <div className="admin-review-list">
                {filteredReviews.length ? filteredReviews.map((review) => (
                    <article className="admin-review-item" key={review.id}>
                        <div className="admin-review-item-head">
                            <div className="admin-review-avatar">{review.name.slice(0, 2).toUpperCase()}</div>
                            <div className="admin-review-customer"><strong>{review.name}</strong><span>{review.product} · {review.date}</span></div>
                            <span className="admin-review-stars">{"★".repeat(review.rating)}<small>{"☆".repeat(5 - review.rating)}</small></span>
                            {review.verified && <span className="admin-review-badge">Đã mua hàng</span>}
                        </div>
                        <p className="admin-review-comment">“{review.comment}”</p>
                        {review.reply && <div className="admin-review-reply"><strong>Phản hồi của cửa hàng</strong><p>{review.reply}</p></div>}
                        {replyingId === review.id ? (
                            <div className="admin-review-reply-form">
                                <textarea className="vg-textarea" value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Nhập phản hồi cho khách hàng..." rows={3} />
                                <div className="admin-review-actions"><button className="vg-btn" type="button" onClick={() => setReplyingId(null)}>Hủy</button><button className="vg-btn vg-btn-primary" type="button" onClick={() => saveReply(review.id)}>Đăng phản hồi</button></div>
                            </div>
                        ) : (
                            <div className="admin-review-actions"><button className="admin-text-button" type="button" onClick={() => openReply(review)}>{review.reply ? "Sửa phản hồi" : "Phản hồi khách hàng"}</button><button className="admin-danger-button" type="button" onClick={() => removeReview(review.id)}>Xóa</button></div>
                        )}
                    </article>
                )) : <div className="admin-empty">Không tìm thấy đánh giá phù hợp.</div>}
            </div>
        </section>
    );
}
