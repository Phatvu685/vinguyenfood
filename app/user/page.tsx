"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthModal, { USER_STORAGE_KEY } from "../components/AuthModal";
import SiteFooter from "../components/SiteFooter";
import BrandLogo from "../components/BrandLogo";
import SiteHeader from "../components/SiteHeader";
import styles from "./page.module.css";

type User = { name: string; phone: string; avatar?: string; password?: string; role?: "user" | "admin" };
type Tab = "overview" | "orders" | "address" | "vouchers";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview",  label: "Tổng quan" },
  { id: "orders",    label: "Đơn hàng của tôi" },
  { id: "address",   label: "Địa chỉ giao hàng" },
  { id: "vouchers",  label: "Ưu đãi hội viên" },
];

export default function UserPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [profileForm, setProfileForm] = useState({ name: "", phone: "" });
  const [profileModal, setProfileModal] = useState<"profile" | "password" | null>(null);
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    if (saved) {
      const savedUser: User = JSON.parse(saved);
      if (savedUser.role === "admin") {
        router.replace("/admin");
        return;
      }
      setUser(savedUser);
      setProfileForm({ name: savedUser.name, phone: savedUser.phone });
    }
  }, []);

  function startEditingProfile() {
    if (!user) return;
    setProfileForm({ name: user.name, phone: user.phone });
  }

  function saveProfile() {
    if (!user || !profileForm.name.trim() || !profileForm.phone.trim()) return;
    const updatedUser = { ...user, name: profileForm.name.trim(), phone: profileForm.phone.trim() };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
    setProfileModal(null);
  }

  function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !user || !file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => {
      const updatedUser = { ...user, avatar: String(reader.result) };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
    };
    reader.readAsDataURL(file);
  }

  function savePassword() {
    if (!user) return;
    if (user.password && passwordForm.current !== user.password) {
      setPasswordError("Mật khẩu hiện tại chưa đúng.");
      return;
    }
    if (passwordForm.next.length < 6) {
      setPasswordError("Mật khẩu mới cần ít nhất 6 ký tự.");
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError("Mật khẩu xác nhận chưa trùng khớp.");
      return;
    }
    const updatedUser = { ...user, password: passwordForm.next };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
    setPasswordForm({ current: "", next: "", confirm: "" });
    setPasswordError("");
    setProfileModal(null);
  }

  function logout() {
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  }

  return (
    <main className={`user-page ${styles.pageRoot}`}>
      <SiteHeader active="home" />

      <section className="user-shell">
        {!user && (
          <div className="user-intro">
            <span className="section-kicker">KHÔNG GIAN CỦA BẠN</span>
            <h1>Tài khoản của tôi</h1>
            <p>Đăng nhập để lưu địa chỉ, xem đơn hàng và nhận ưu đãi hội viên.</p>
          </div>
        )}

        {!user ? (
          /* ── Guest ── */
          <div className="user-guest">
            <div className="user-guest-icon">♙</div>
            <h2>Bạn chưa đăng nhập</h2>
            <p>Đăng nhập để trải nghiệm đầy đủ quyền lợi từ Gạo Ngon.</p>
            <button className="auth-submit" onClick={() => setAuthOpen(true)}>
              ĐĂNG NHẬP / ĐĂNG KÝ <span>→</span>
            </button>
          </div>
        ) : (
          /* ── Dashboard ── */
          <div className="user-dashboard">
            <aside className="user-menu">
              <div className="user-intro">
                <span className="section-kicker">KHÔNG GIAN CỦA BẠN</span>
                <h1>Xin chào, {user.name}</h1>
                <p>Quản lý thông tin và theo dõi những bữa cơm sắp tới.</p>
              </div>
              <label className="user-avatar-upload" aria-label="Tải ảnh đại diện">
                <div className="user-avatar">
                  {user.avatar ? <img src={user.avatar} alt="Ảnh đại diện" /> : user.name.charAt(0).toUpperCase()}
                </div>
                <span aria-hidden="true">✎</span>
                <input type="file" accept="image/*" onChange={uploadAvatar} />
              </label>
              <strong>{user.name}</strong>
              <span>{user.phone}</span>
              <button className="profile-edit" type="button" onClick={() => { startEditingProfile(); setProfileModal("profile"); }}>Chỉnh sửa thông tin</button>
              <button className="profile-edit" type="button" onClick={() => { setPasswordError(""); setProfileModal("password"); }}>Đổi mật khẩu</button>

              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={activeTab === tab.id ? "menu-active" : ""}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}

              <button className="logout" onClick={logout}>Đăng xuất</button>
            </aside>

            <div className="user-content">
              {activeTab === "overview" && <TabOverview user={user} router={router} />}
              {activeTab === "orders"   && <TabOrders router={router} />}
              {activeTab === "address"  && <TabAddress />}
              {activeTab === "vouchers" && <TabVouchers router={router} userPhone={user.phone} />}
            </div>
          </div>
        )}
      </section>

      {profileModal && (
        <div className="profile-modal-overlay" role="presentation" onMouseDown={() => setProfileModal(null)}>
          <section className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-modal-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="profile-modal-close" type="button" onClick={() => setProfileModal(null)} aria-label="Đóng">×</button>
            {profileModal === "profile" ? (
              <>
                <span className="section-kicker">TÀI KHOẢN CỦA BẠN</span>
                <h2 id="profile-modal-title">Chỉnh sửa thông tin</h2>
                <div className="profile-form">
                  <label><span>Họ và tên</span><input value={profileForm.name} onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })} /></label>
                  <label><span>Số điện thoại</span><input value={profileForm.phone} onChange={(event) => setProfileForm({ ...profileForm, phone: event.target.value })} /></label>
                  <div className="profile-form-actions"><button type="button" onClick={saveProfile}>Lưu thay đổi</button><button type="button" onClick={() => setProfileModal(null)}>Hủy</button></div>
                </div>
              </>
            ) : (
              <>
                <span className="section-kicker">BẢO MẬT</span>
                <h2 id="profile-modal-title">Đổi mật khẩu</h2>
                <div className="profile-form password-form">
                  <label><span>Mật khẩu hiện tại</span><input type="password" value={passwordForm.current} onChange={(event) => setPasswordForm({ ...passwordForm, current: event.target.value })} /></label>
                  <label><span>Mật khẩu mới</span><input type="password" minLength={6} value={passwordForm.next} onChange={(event) => setPasswordForm({ ...passwordForm, next: event.target.value })} /></label>
                  <label><span>Xác nhận mật khẩu mới</span><input type="password" minLength={6} value={passwordForm.confirm} onChange={(event) => setPasswordForm({ ...passwordForm, confirm: event.target.value })} /></label>
                  {passwordError && <small className="password-error">{passwordError}</small>}
                  <div className="profile-form-actions"><button type="button" onClick={savePassword}>Lưu mật khẩu</button><button type="button" onClick={() => setProfileModal(null)}>Hủy</button></div>
                </div>
              </>
            )}
          </section>
        </div>
      )}

      <SiteFooter />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSuccess={setUser} />
    </main>
  );
}

/* ── Tab: Tổng quan ─────────────────────────────────── */
function TabOverview({ user, router }: { user: { name: string; phone: string }; router: ReturnType<typeof useRouter> }) {
  return (
    <>
      <div className="user-content-heading">
        <div>
          <span className="section-kicker">TỔNG QUAN</span>
          <h2>Tài khoản của bạn</h2>
        </div>
        <button className="user-shop" onClick={() => router.push("/san-pham")}>Tiếp tục mua sắm →</button>
      </div>
      <div className="user-stats">
        <div><span>ĐƠN HÀNG</span><strong>0</strong><small>Chưa có đơn hàng</small></div>
        <div><span>ĐIỂM TÍCH LŨY</span><strong>0</strong><small>Hạng thành viên mới</small></div>
        <div><span>MÃ ƯU ĐÃI</span><strong>03</strong><small>Ưu đãi đang chờ bạn</small></div>
      </div>
      <div className="user-empty">
        <span>⌁</span>
        <h3>Bữa cơm đầu tiên đang chờ bạn</h3>
        <p>Khám phá những hạt gạo được tuyển chọn cho gia đình.</p>
        <button className="gold-button" onClick={() => router.push("/san-pham")}>KHÁM PHÁ SẢN PHẨM　→</button>
      </div>
    </>
  );
}

/* ── Tab: Đơn hàng ──────────────────────────────────── */
function TabOrders({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <>
      <div className="user-content-heading">
        <div>
          <span className="section-kicker">LỊCH SỬ MUA HÀNG</span>
          <h2>Đơn hàng của tôi</h2>
        </div>
      </div>
      <div className="user-empty">
        <span>◻</span>
        <h3>Chưa có đơn hàng nào</h3>
        <p>Những đơn hàng bạn đặt sẽ xuất hiện ở đây để bạn dễ dàng theo dõi.</p>
        <button className="gold-button" onClick={() => router.push("/san-pham")}>MUA NGAY →</button>
      </div>
    </>
  );
}

/* ── Tab: Địa chỉ ───────────────────────────────────── */
function TabAddress() {
  return (
    <>
      <div className="user-content-heading">
        <div>
          <span className="section-kicker">THÔNG TIN GIAO HÀNG</span>
          <h2>Địa chỉ giao hàng</h2>
        </div>
        <button className="user-shop">+ Thêm địa chỉ</button>
      </div>
      <div className="user-empty">
        <span>◎</span>
        <h3>Chưa có địa chỉ nào</h3>
        <p>Thêm địa chỉ giao hàng để đặt hàng nhanh hơn trong lần sau.</p>
        <button className="gold-button">THÊM ĐỊA CHỈ MỚI →</button>
      </div>
    </>
  );
}

/* ── Tab: Ưu đãi ────────────────────────────────────── */
function TabVouchers({ router, userPhone }: { router: ReturnType<typeof useRouter>; userPhone?: string }) {
  type VoucherEntry = {
    code: string; desc: string; exp: string; active: boolean; discountType?: string; discountValue?: number;
    conditionType?: "none" | "min_orders" | "min_spend" | "first_order" | "holiday" | "review_reward" | "next_order" | "top_customer";
    minOrders?: number; minSpend?: number; holidayDate?: string; holidayName?: string; requireReviewPhoto?: boolean; topRank?: number;
  };

  const [allVouchers, setAllVouchers] = useState<VoucherEntry[]>([]);
  const [orderCount, setOrderCount] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [hasReview, setHasReview] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    // Load all vouchers from admin storage
    try {
      const stored = localStorage.getItem("gao-ngon-vouchers");
      const parsed: VoucherEntry[] = stored ? JSON.parse(stored) : [];
      const base: VoucherEntry[] = parsed.length ? parsed : [
        { code: "GAODON10", desc: "Giảm 10% đơn hàng đầu tiên", exp: "31/12/2026", active: true, discountType: "percent", discountValue: 10 },
        { code: "FREESHIP", desc: "Miễn phí vận chuyển đơn từ 200k", exp: "30/09/2026", active: true, discountType: "shipping" },
        { code: "MEMBER15", desc: "Ưu đãi hội viên — giảm 15.000đ", exp: "31/10/2026", active: true, discountType: "amount", discountValue: 15000 },
      ];
      setAllVouchers(base.filter(v => v.active));
    } catch { setAllVouchers([]); }

    // Count orders & total spend + rank for this phone number
    try {
      const orders = JSON.parse(localStorage.getItem("gao-ngon-orders") || "[]") as Array<{ phone?: string; total?: number }>;
      const userOrders = orders.filter(o => userPhone ? o.phone === userPhone : true);
      const userTotal = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      setOrderCount(userOrders.length);
      setTotalSpend(userTotal);

      // Compute rank among all phone numbers
      const spendByPhone: Record<string, number> = {};
      orders.forEach(o => { if (o.phone) spendByPhone[o.phone] = (spendByPhone[o.phone] || 0) + (o.total || 0); });
      const sorted = Object.entries(spendByPhone).sort((a, b) => b[1] - a[1]);
      const myRank = userPhone ? sorted.findIndex(entry => entry[0] === userPhone) + 1 : (userOrders.length > 0 ? 1 : null);
      setUserRank(myRank > 0 ? myRank : null);
    } catch { setOrderCount(0); setTotalSpend(0); setUserRank(null); }

    // Check if user has submitted any product reviews
    try {
      const reviews = JSON.parse(localStorage.getItem("gao-ngon-reviews") || "[]") as Array<{ phone?: string }>;
      setHasReview(reviews.some(r => userPhone ? r.phone === userPhone : true));
    } catch { setHasReview(false); }
  }, [userPhone]);

  function copy(code: string) {
    navigator.clipboard?.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1000);
  }

  const isRewardCondition = (v: VoucherEntry) => v.conditionType && v.conditionType !== "none";
  const publicVouchers = allVouchers.filter(v => !isRewardCondition(v));
  const rewardVouchers = allVouchers.filter(v => isRewardCondition(v));

  // Check if current date matches holiday (DD/MM)
  const isHolidayActive = (v: VoucherEntry) => {
    if (!v.holidayDate) return true;
    const now = new Date();
    const currentDDMM = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}`;
    return v.holidayDate === currentDDMM || true; // Active during event month/day or promo period
  };

  // Check if reward voucher is unlocked for this user
  const isUnlocked = (v: VoucherEntry) => {
    if (v.conditionType === "min_orders") return orderCount >= (v.minOrders || 1);
    if (v.conditionType === "min_spend") return totalSpend >= (v.minSpend || 0);
    if (v.conditionType === "first_order") return orderCount === 0;
    if (v.conditionType === "holiday") return isHolidayActive(v);
    if (v.conditionType === "review_reward") return hasReview || orderCount >= 1;
    if (v.conditionType === "next_order") return orderCount >= 1; // Unlocked after completing at least 1 order
    if (v.conditionType === "top_customer") return userRank !== null && userRank <= (v.topRank || 10);
    return true;
  };

  // Progress info per condition type
  const progressInfo = (v: VoucherEntry): { current: number; total: number; label: string } | null => {
    if (v.conditionType === "min_orders") return { current: Math.min(orderCount, v.minOrders || 1), total: v.minOrders || 1, label: `${Math.min(orderCount, v.minOrders || 1)}/${v.minOrders || 1} đơn hàng` };
    if (v.conditionType === "min_spend") return { current: Math.min(totalSpend, v.minSpend || 0), total: v.minSpend || 0, label: `${totalSpend.toLocaleString("vi-VN")}đ / ${(v.minSpend || 0).toLocaleString("vi-VN")}đ` };
    if (v.conditionType === "top_customer" && userRank !== null) return { current: userRank, total: v.topRank || 10, label: `Thứ hạng của bạn: Top ${userRank} (Cần Top ${v.topRank || 10})` };
    return null;
  };

  const conditionHint = (v: VoucherEntry) => {
    if (v.conditionType === "min_orders") return `Mua thêm ${Math.max(0, (v.minOrders || 1) - orderCount)} đơn nữa để nhận`;
    if (v.conditionType === "min_spend") return `Cần mua thêm ${Math.max(0, (v.minSpend || 0) - totalSpend).toLocaleString("vi-VN")}đ nữa`;
    if (v.conditionType === "first_order") return "Dành cho khách hàng mua lần đầu";
    if (v.conditionType === "holiday") return `Dịp lễ: ${v.holidayName || v.holidayDate || "Ngày đặc biệt"}`;
    if (v.conditionType === "review_reward") return v.requireReviewPhoto ? "Đánh giá sản phẩm kèm hình ảnh để nhận mã" : "Viết nhận xét sản phẩm để nhận mã";
    if (v.conditionType === "next_order") return "Tặng sau khi mua 1 đơn hàng để áp dụng cho lượt mua tới";
    if (v.conditionType === "top_customer") return `Dành riêng cho Top ${v.topRank || 10} Khách hàng chi tiêu cao nhất`;
    return "";
  };

  const discountLabel = (v: VoucherEntry) => {
    if (v.discountType === "shipping") return "Miễn phí vận chuyển";
    if (v.discountType === "amount") return `Giảm ${(v.discountValue || 0).toLocaleString("vi-VN")}đ`;
    if (v.discountType === "percent") return `Giảm ${v.discountValue || 0}%`;
    return "";
  };

  return (
    <>
      <div className="user-content-heading">
        <div>
          <span className="section-kicker">PHẦN THƯỞNG</span>
          <h2>Ưu đãi hội viên</h2>
        </div>
        <button className="user-shop" onClick={() => router.push("/san-pham")}>Dùng ngay →</button>
      </div>

      {/* ── Mã công khai ── */}
      {publicVouchers.length > 0 && (
        <>
          <p className="voucher-section-title">🌐 Mã giảm giá công khai</p>
          <div className="user-vouchers">
            {publicVouchers.map((v) => (
              <div className="voucher-card" key={v.code}>
                <div className="voucher-left"><span>✦</span></div>
                <div className="voucher-body">
                  <strong>{v.code}</strong>
                  <p>{v.desc}</p>
                  {discountLabel(v) && <em className="voucher-discount-label">{discountLabel(v)}</em>}
                  <small>HSD: {v.exp}</small>
                </div>
                <button className="voucher-copy" onClick={() => copy(v.code)}>
                  {copied === v.code ? "✓ Đã sao" : "Sao chép"}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Mã thưởng điều kiện ── */}
      {rewardVouchers.length > 0 && (
        <>
          <p className="voucher-section-title">🎁 Mã thưởng điều kiện</p>
          <div className="user-vouchers">
            {rewardVouchers.map((v) => {
              const unlocked = isUnlocked(v);
              const prog = progressInfo(v);
              const pct = prog ? Math.round((prog.current / Math.max(1, prog.total)) * 100) : 0;
              const hint = conditionHint(v);
              return (
                <div className={`voucher-card voucher-card-reward ${unlocked ? "voucher-unlocked" : "voucher-locked"}`} key={v.code}>
                  <div className="voucher-left">
                    <span>{unlocked ? "🎁" : "🔒"}</span>
                  </div>
                  <div className="voucher-body">
                    <strong>{unlocked ? v.code : "••••••••"}</strong>
                    <p>{v.desc}</p>
                    {discountLabel(v) && <em className="voucher-discount-label">{discountLabel(v)}</em>}
                    {unlocked ? (
                      <small className="voucher-unlocked-label">✅ Đã mở khóa · HSD: {v.exp}</small>
                    ) : (
                      <>
                        {prog && (
                          <div className="voucher-progress-wrap">
                            <div className="voucher-progress-bar">
                              <div className="voucher-progress-fill" style={{ width: `${pct}%` }} />
                            </div>
                            <small>Tiến độ: {prog.label}</small>
                          </div>
                        )}
                        {hint && <small className="voucher-locked-hint">{hint}</small>}
                      </>
                    )}
                  </div>
                  {unlocked ? (
                    <button className="voucher-copy" onClick={() => copy(v.code)}>
                      {copied === v.code ? "✓ Đã sao" : "Sao chép"}
                    </button>
                  ) : (
                    <span className="voucher-locked-badge">Chưa đủ</span>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {publicVouchers.length === 0 && rewardVouchers.length === 0 && (
        <div className="user-empty">
          <span>⌁</span>
          <h3>Chưa có ưu đãi nào</h3>
          <p>Admin chưa tạo mã giảm giá nào. Hãy quay lại sau!</p>
        </div>
      )}
    </>
  );
}

