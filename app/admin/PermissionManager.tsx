"use client";

import { FormEvent, useMemo, useState } from "react";
const Target = () => <span>👁️</span>;
const Pencil = () => <span>✏️</span>;
const Trash2 = () => <span>🗑️</span>;
const Shield = () => <span>🛡️</span>;
const Key = () => <span>🔑</span>;
import AdminModal from "./components/AdminModal";
import ConfirmModal from "./components/ConfirmModal";
import { addAdminNotification } from "../lib/notifications";

export type PermissionModule =
  | "overview"
  | "products"
  | "categories"
  | "orders"
  | "customers"
  | "vouchers"
  | "finance"
  | "inventory"
  | "promotions"
  | "content"
  | "permissions";

export type PermissionAction = "view" | "edit" | "delete";

export type RolePermission = {
  module: PermissionModule;
  actions: PermissionAction[];
};

export type AdminRole = {
  id: string;
  name: string;
  description: string;
  color: string;
  isSystem?: boolean;
  permissions: RolePermission[];
};

export type StaffAccount = {
  id: string;
  name: string;
  email: string;
  phone: string;
  roleId: string;
  status: "active" | "inactive";
  createdAt: string;
  lastLogin?: string;
};

export const MODULE_NAMES: Record<PermissionModule, { label: string; icon: string; description: string }> = {
  overview: { label: "Tổng quan kinh doanh", icon: "📊", description: "Theo dõi doanh thu, đơn hàng và các chỉ số chính." },
  products: { label: "Quản lý sản phẩm", icon: "📦", description: "Tạo, chỉnh sửa giá bán, tồn kho và thông tin sản phẩm." },
  categories: { label: "Danh mục sản phẩm", icon: "🏷️", description: "Phân nhóm sản phẩm và kiểm soát trạng thái hiển thị." },
  orders: { label: "Quản lý đơn hàng", icon: "🛒", description: "Xem, cập nhật trạng thái và xử lý thông tin giao hàng." },
  customers: { label: "Quản lý khách hàng", icon: "👤", description: "Quản lý hồ sơ, lịch sử mua hàng và chăm sóc khách." },
  vouchers: { label: "Mã giảm giá", icon: "🎟️", description: "Tạo và quản lý mã giảm giá dành cho khách hàng." },
  finance: { label: "Dòng tiền & Tài chính", icon: "💰", description: "Theo dõi thu chi, công nợ và hiệu quả kinh doanh." },
  inventory: { label: "Quản lý kho hàng", icon: "🏭", description: "Quản lý nhập xuất, tồn kho và cảnh báo hàng sắp hết." },
  promotions: { label: "Combo & Ưu đãi", icon: "🎁", description: "Thiết lập chương trình khuyến mãi và combo sản phẩm." },
  content: { label: "Nội dung Website", icon: "📰", description: "Cập nhật banner, slide, tin tức và ưu đãi trên website." },
  permissions: { label: "Phân quyền hệ thống", icon: "🔐", description: "Quản lý tài khoản nhân viên, vai trò và quyền truy cập." },
};

const ALL_MODULES: PermissionModule[] = [
  "overview",
  "products",
  "categories",
  "orders",
  "customers",
  "vouchers",
  "finance",
  "inventory",
  "promotions",
  "content",
  "permissions",
];

const DEFAULT_ROLES: AdminRole[] = [
  {
    id: "role_superadmin",
    name: "Quản trị viên cao cấp",
    description: "Toàn quyền quản trị hệ thống, tài chính và phân quyền tài khoản",
    color: "#e5c666",
    isSystem: true,
    permissions: ALL_MODULES.map((m) => ({ module: m, actions: ["view", "edit", "delete"] })),
  },
  {
    id: "role_manager",
    name: "Quản lý cửa hàng",
    description: "Quản lý sản phẩm, đơn hàng, khách hàng, ưu đãi và nội dung",
    color: "#8bd3a5",
    isSystem: true,
    permissions: [
      "overview",
      "products",
      "categories",
      "orders",
      "customers",
      "vouchers",
      "inventory",
      "promotions",
      "content",
    ].map((m) => ({ module: m as PermissionModule, actions: ["view", "edit"] })),
  },
  {
    id: "role_sales",
    name: "Nhân viên bán hàng",
    description: "Xử lý đơn hàng, theo dõi thông tin khách hàng và xem sản phẩm",
    color: "#6bb5ff",
    isSystem: true,
    permissions: [
      { module: "overview", actions: ["view"] },
      { module: "products", actions: ["view"] },
      { module: "orders", actions: ["view", "edit"] },
      { module: "customers", actions: ["view", "edit"] },
    ],
  },
  {
    id: "role_accountant",
    name: "Kế toán & Thủ kho",
    description: "Quản lý dòng tiền thu chi, lập phiếu nhập xuất và tồn kho",
    color: "#f09a82",
    isSystem: true,
    permissions: [
      { module: "overview", actions: ["view"] },
      { module: "products", actions: ["view"] },
      { module: "finance", actions: ["view", "edit"] },
      { module: "inventory", actions: ["view", "edit"] },
    ],
  },
  {
    id: "role_content",
    name: "Biên tập viên nội dung",
    description: "Quản lý banner, slide trang chủ, tin tức và ưu đãi hội viên",
    color: "#d08bff",
    isSystem: true,
    permissions: [
      { module: "content", actions: ["view", "edit"] },
      { module: "promotions", actions: ["view", "edit"] },
      { module: "vouchers", actions: ["view", "edit"] },
    ],
  },
];

const DEFAULT_STAFF: StaffAccount[] = [
  {
    id: "STF-001",
    name: "Quản trị viên",
    email: "admin@vigenfood.com",
    phone: "0900000000",
    roleId: "role_superadmin",
    status: "active",
    createdAt: "2026-01-01",
    lastLogin: "Vừa xong",
  },
  {
    id: "STF-002",
    name: "Nguyễn Minh Quan",
    email: "quanly@vigenfood.com",
    phone: "0901111222",
    roleId: "role_manager",
    status: "active",
    createdAt: "2026-02-10",
    lastLogin: "2 giờ trước",
  },
  {
    id: "STF-003",
    name: "Trần Thị Thu",
    email: "ketoan@vigenfood.com",
    phone: "0903333444",
    roleId: "role_accountant",
    status: "active",
    createdAt: "2026-03-01",
    lastLogin: "Hôm qua",
  },
];

export default function PermissionManager({
  showNotice,
}: {
  showNotice: (text: string, tone?: "success" | "info" | "warning" | "error") => void;
}) {
  const [subTab, setSubTab] = useState<"staff" | "roles">("staff");
  const [roles, setRoles] = useState<AdminRole[]>(() => {
    if (typeof window === "undefined") return DEFAULT_ROLES;
    try {
      const saved = localStorage.getItem("gao-ngon-admin-roles");
      return saved ? JSON.parse(saved) : DEFAULT_ROLES;
    } catch {
      return DEFAULT_ROLES;
    }
  });

  const [staff, setStaff] = useState<StaffAccount[]>(() => {
    if (typeof window === "undefined") return DEFAULT_STAFF;
    try {
      const saved = localStorage.getItem("gao-ngon-admin-staff");
      return saved ? JSON.parse(saved) : DEFAULT_STAFF;
    } catch {
      return DEFAULT_STAFF;
    }
  });

  const [editingStaff, setEditingStaff] = useState<StaffAccount | null>(null);
  const [detailStaff, setDetailStaff] = useState<StaffAccount | null>(null);
  const [confirmDeleteStaff, setConfirmDeleteStaff] = useState<StaffAccount | null>(null);

  const [editingRole, setEditingRole] = useState<AdminRole | null>(null);
  const [detailRole, setDetailRole] = useState<AdminRole | null>(null);
  const [confirmDeleteRole, setConfirmDeleteRole] = useState<AdminRole | null>(null);
  const [roleColor, setRoleColor] = useState("#e5c666");
  const [expandedModules, setExpandedModules] = useState<Record<PermissionModule, boolean>>(() =>
    ALL_MODULES.reduce((result, module) => ({ ...result, [module]: false }), {} as Record<PermissionModule, boolean>)
  );

  const PRESET_COLORS = ["#e5c666", "#8bd3a5", "#6bb5ff", "#f09a82", "#d08bff", "#e67e22"];

  const [rolePermsMap, setRolePermsMap] = useState<Record<PermissionModule, { view: boolean; edit: boolean; delete: boolean }>>({
    overview: { view: true, edit: false, delete: false },
    products: { view: false, edit: false, delete: false },
    categories: { view: false, edit: false, delete: false },
    orders: { view: false, edit: false, delete: false },
    customers: { view: false, edit: false, delete: false },
    vouchers: { view: false, edit: false, delete: false },
    finance: { view: false, edit: false, delete: false },
    inventory: { view: false, edit: false, delete: false },
    promotions: { view: false, edit: false, delete: false },
    content: { view: false, edit: false, delete: false },
    permissions: { view: false, edit: false, delete: false },
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  function handleSelectAllPerms() {
    setRolePermsMap((prev) => {
      const next = { ...prev };
      ALL_MODULES.forEach((m) => {
        next[m] = { view: true, edit: true, delete: true };
      });
      return next;
    });
  }

  function handleSelectViewOnlyPerms() {
    setRolePermsMap((prev) => {
      const next = { ...prev };
      ALL_MODULES.forEach((m) => {
        next[m] = { view: true, edit: false, delete: false };
      });
      return next;
    });
  }

  function handleClearAllPerms() {
    setRolePermsMap((prev) => {
      const next = { ...prev };
      ALL_MODULES.forEach((m) => {
        next[m] = { view: false, edit: false, delete: false };
      });
      return next;
    });
  }

  function saveRoles(next: AdminRole[]) {
    setRoles(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("gao-ngon-admin-roles", JSON.stringify(next));
    }
  }

  function saveStaff(next: StaffAccount[]) {
    setStaff(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("gao-ngon-admin-staff", JSON.stringify(next));
    }
  }

  // --- Staff Submit ---
  function submitStaff(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim().toLowerCase();
    const phone = String(data.get("phone") || "").trim();
    const roleId = String(data.get("roleId") || "");
    const status = String(data.get("status")) as "active" | "inactive";

    if (!name || !email || !roleId) {
      showNotice("Vui lòng nhập đầy đủ tên, email và vai trò nhân viên.", "error");
      return;
    }

    if (staff.some((s) => s.email === email && s.id !== editingStaff?.id)) {
      showNotice("Email này đã tồn tại trong danh sách tài khoản.", "error");
      return;
    }

    const nextItem: StaffAccount = {
      id: editingStaff?.id || `STF-${Date.now().toString().slice(-4)}`,
      name,
      email,
      phone,
      roleId,
      status,
      createdAt: editingStaff?.createdAt || new Date().toISOString().slice(0, 10),
      lastLogin: editingStaff?.lastLogin || "Chưa đăng nhập",
    };

    const nextStaffList = editingStaff?.id
      ? staff.map((s) => (s.id === editingStaff.id ? nextItem : s))
      : [nextItem, ...staff];

    saveStaff(nextStaffList);
    addAdminNotification(
      editingStaff?.id
        ? `Cập nhật tài khoản nhân viên "${name}"`
        : `Tạo tài khoản nhân viên mới "${name}"`,
      "permissions",
      `Vai trò: ${roles.find((r) => r.id === roleId)?.name || "Chưa phân vai trò"}`,
      "permissions"
    );

    showNotice(editingStaff?.id ? "Đã cập nhật nhân viên thành công." : "Đã thêm tài khoản nhân viên mới.", "success");
    setEditingStaff(null);
  }

  function openEditRole(role: AdminRole) {
    const permMap: Record<PermissionModule, { view: boolean; edit: boolean; delete: boolean }> = {
      overview: { view: false, edit: false, delete: false },
      products: { view: false, edit: false, delete: false },
      categories: { view: false, edit: false, delete: false },
      orders: { view: false, edit: false, delete: false },
      customers: { view: false, edit: false, delete: false },
      vouchers: { view: false, edit: false, delete: false },
      finance: { view: false, edit: false, delete: false },
      inventory: { view: false, edit: false, delete: false },
      promotions: { view: false, edit: false, delete: false },
      content: { view: false, edit: false, delete: false },
      permissions: { view: false, edit: false, delete: false },
    };

    role.permissions.forEach((p) => {
      permMap[p.module] = {
        view: p.actions.includes("view"),
        edit: p.actions.includes("edit"),
        delete: p.actions.includes("delete"),
      };
    });

    setRolePermsMap(permMap);
    setRoleColor(role.color || "#e5c666");
    setEditingRole(role);
  }

  function openNewRole() {
    const blankMap: Record<PermissionModule, { view: boolean; edit: boolean; delete: boolean }> = {
      overview: { view: true, edit: false, delete: false },
      products: { view: false, edit: false, delete: false },
      categories: { view: false, edit: false, delete: false },
      orders: { view: false, edit: false, delete: false },
      customers: { view: false, edit: false, delete: false },
      vouchers: { view: false, edit: false, delete: false },
      finance: { view: false, edit: false, delete: false },
      inventory: { view: false, edit: false, delete: false },
      promotions: { view: false, edit: false, delete: false },
      content: { view: false, edit: false, delete: false },
      permissions: { view: false, edit: false, delete: false },
    };

    setRolePermsMap(blankMap);
    setRoleColor("#e5c666");
    setEditingRole({
      id: "",
      name: "",
      description: "",
      color: "#e5c666",
      permissions: [],
    });
  }

  function submitRole(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const description = String(data.get("description") || "").trim();
    const color = String(data.get("color") || "#e5c666");

    if (!name) {
      showNotice("Vui lòng nhập tên vai trò.", "error");
      return;
    }

    const compiledPermissions: RolePermission[] = ALL_MODULES.map((moduleKey) => {
      const actions: PermissionAction[] = [];
      if (rolePermsMap[moduleKey]?.view) actions.push("view");
      if (rolePermsMap[moduleKey]?.edit) actions.push("edit");
      if (rolePermsMap[moduleKey]?.delete) actions.push("delete");
      return { module: moduleKey, actions };
    }).filter((p) => p.actions.length > 0);

    const nextRole: AdminRole = {
      id: editingRole?.id || `role_${Date.now()}`,
      name,
      description,
      color,
      isSystem: editingRole?.isSystem || false,
      permissions: compiledPermissions,
    };

    const nextRoleList = editingRole?.id
      ? roles.map((r) => (r.id === editingRole.id ? nextRole : r))
      : [...roles, nextRole];

    saveRoles(nextRoleList);
    addAdminNotification(
      editingRole?.id ? `Cập nhật vai trò "${name}"` : `Tạo vai trò mới "${name}"`,
      "permissions",
      description,
      "permissions"
    );

    showNotice(editingRole?.id ? "Đã cập nhật vai trò." : "Đã tạo vai trò mới thành công.", "success");
    setEditingRole(null);
  }

  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      const matchesSearch = `${s.name} ${s.email} ${s.phone}`.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "all" || s.roleId === roleFilter;
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [staff, searchQuery, roleFilter, statusFilter]);

  return (
    <div className="admin-permissions-manager">
      <div className="admin-hero-card">
        <div>
          <span className="admin-kicker">QUẢN TRỊ HỆ THỐNG</span>
          <h2>Phân quyền & Tài khoản Nhân viên</h2>
          <p>Quản lý tài khoản quản trị viên, vai trò công việc và ma trận quyền hạn chi tiết.</p>
        </div>
        <div className="admin-hero-actions">
          <button
            className="admin-primary"
            onClick={() =>
              setEditingStaff({
                id: "",
                name: "",
                email: "",
                phone: "",
                roleId: roles[1]?.id || roles[0]?.id || "",
                status: "active",
                createdAt: new Date().toISOString().slice(0, 10),
              })
            }
          >
            ＋ Thêm nhân viên
          </button>
          <button className="admin-secondary-btn" onClick={openNewRole}>
            🛡️ Tạo vai trò mới
          </button>
        </div>
      </div>

      <div className="admin-permissions-subtabs">
        <button
          className={subTab === "staff" ? "active" : ""}
          onClick={() => setSubTab("staff")}
        >
          👤 Tài khoản nhân viên ({staff.length})
        </button>
        <button
          className={subTab === "roles" ? "active" : ""}
          onClick={() => setSubTab("roles")}
        >
          🛡️ Vai trò & Ma trận phân quyền ({roles.length})
        </button>
      </div>

      {/* ── SUBTAB 1: TÀI KHOẢN NHÂN VIÊN ── */}
      {subTab === "staff" && (
        <section className="admin-panel admin-staff-panel">
          <div className="admin-table-head">
            <div>
              <strong>Danh sách nhân viên ({filteredStaff.length}/{staff.length})</strong>
              <span>Tài khoản có quyền đăng nhập hệ thống quản trị Vigen Food</span>
            </div>
            <div className="admin-staff-filters">
              <label className="admin-search">
                ⌕
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên, email, SĐT..."
                />
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                aria-label="Lọc theo vai trò"
              >
                <option value="all">Tất cả vai trò</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Lọc trạng thái"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Đã khóa</option>
              </select>
            </div>
          </div>

          <div className="admin-staff-table">
            <div className="admin-staff-table-head">
              <span>NHÂN VIÊN</span>
              <span>LIÊN HỆ</span>
              <span>VAI TRÒ</span>
              <span>NGÀY TẠO</span>
              <span>ĐĂNG NHẬP CUỐI</span>
              <span>TRẠNG THÁI</span>
              <span>THAO TÁC</span>
            </div>

            {filteredStaff.length ? (
              filteredStaff.map((item) => {
                const roleObj = roles.find((r) => r.id === item.roleId);
                return (
                  <div className="admin-staff-row" key={item.id}>
                    <div className="staff-identity">
                      <span className="admin-avatar" style={{ background: roleObj?.color || "#e5c666" }}>
                        {item.name.charAt(0)}
                      </span>
                      <div>
                        <strong>{item.name}</strong>
                        <small>{item.id}</small>
                      </div>
                    </div>

                    <div>
                      <span>{item.email}</span>
                      <small>{item.phone || "Chưa có SĐT"}</small>
                    </div>

                    <div>
                      <span
                        className="role-badge-pill"
                        style={{
                          color: roleObj?.color || "#e5c666",
                          borderColor: `${roleObj?.color || "#e5c666"}44`,
                          background: `${roleObj?.color || "#e5c666"}15`,
                        }}
                      >
                        {roleObj?.name || "Chưa phân vai trò"}
                      </span>
                    </div>

                    <span>{item.createdAt}</span>
                    <small className="last-login-text">{item.lastLogin || "Chưa đăng nhập"}</small>

                    <button
                      type="button"
                      className={`staff-status-pill ${item.status}`}
                      onClick={() => {
                        const nextStatus: "active" | "inactive" = item.status === "active" ? "inactive" : "active";
                        const updated = staff.map((s) => (s.id === item.id ? { ...s, status: nextStatus } : s));
                        saveStaff(updated);
                        addAdminNotification(
                          `Đổi trạng thái tài khoản "${item.name}" sang ${nextStatus === "active" ? "Hoạt động" : "Tạm khóa"}`,
                          "permissions",
                          undefined,
                          "permissions"
                        );
                      }}
                      title="Click để bật/tắt hoạt động"
                    >
                      {item.status === "active" ? "Đang hoạt động" : "Đã khóa"}
                    </button>

                    <div className="admin-row-actions">
                      <button title="Xem chi tiết" onClick={() => setDetailStaff(item)}>
                        <Target />
                      </button>
                      <button title="Sửa nhân viên" onClick={() => setEditingStaff(item)}>
                        <Pencil />
                      </button>
                      <button
                        className="danger"
                        title="Xóa nhân viên"
                        disabled={item.roleId === "role_superadmin" && staff.filter((s) => s.roleId === "role_superadmin").length <= 1}
                        onClick={() => setConfirmDeleteStaff(item)}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="admin-empty">Không tìm thấy tài khoản nhân viên phù hợp.</div>
            )}
          </div>
        </section>
      )}

      {/* ── SUBTAB 2: VAI TRÒ & MA TRẬN PHÂN QUYỀN ── */}
      {subTab === "roles" && (
        <section className="admin-panel admin-roles-panel">
          <div className="admin-table-head">
            <div>
              <strong>Danh sách Vai trò ({roles.length})</strong>
              <span>Định nghĩa các vị trí công việc và các quyền được phép thao tác</span>
            </div>
            <button className="admin-primary" onClick={openNewRole}>
              ＋ Tạo vai trò mới
            </button>
          </div>

          <div className="admin-roles-grid">
            {roles.map((role) => {
              const assignedCount = staff.filter((s) => s.roleId === role.id).length;
              return (
                <div className="admin-role-card" key={role.id}>
                  <div className="role-card-header">
                    <div className="role-title-wrap">
                      <span className="role-color-dot" style={{ background: role.color }} />
                      <h3>{role.name}</h3>
                      {role.isSystem && <span className="system-role-tag">Hệ thống</span>}
                    </div>
                    <span className="role-staff-count">👥 {assignedCount} nhân viên</span>
                  </div>

                  <p className="role-desc">{role.description}</p>

                  <div className="role-perms-summary">
                    <span className="perm-kicker">QUYỀN ĐƯỢC PHÉP TRUY CẬP:</span>
                    <div className="perm-tags-list">
                      {role.permissions.map((p) => (
                        <span key={p.module} className="perm-tag-item">
                          {MODULE_NAMES[p.module]?.icon} {MODULE_NAMES[p.module]?.label}
                          <small>
                            ({p.actions.map((a) => (a === "view" ? "Xem" : a === "edit" ? "Sửa" : "Xóa")).join(", ")})
                          </small>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="role-card-footer">
                    <button type="button" className="role-action-btn" onClick={() => setDetailRole(role)}>
                      👁️ Xem chi tiết ma trận
                    </button>
                    <button type="button" className="role-action-btn" onClick={() => openEditRole(role)}>
                      ✏️ Chỉnh sửa quyền
                    </button>
                    {!role.isSystem && (
                      <button
                        type="button"
                        className="role-action-btn danger"
                        onClick={() => setConfirmDeleteRole(role)}
                      >
                        🗑️ Xóa vai trò
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── MODAL: CHI TIẾT NHÂN VIÊN ── */}
      <AdminModal
        open={!!detailStaff}
        onClose={() => setDetailStaff(null)}
        title={detailStaff ? `Tài khoản: ${detailStaff.name}` : "Chi tiết tài khoản"}
        subtitle="Thông tin tài khoản và quyền truy cập"
        size="md"
        footer={<button className="vg-btn" type="button" onClick={() => setDetailStaff(null)}>Đóng</button>}
      >
        {detailStaff && (
          <div className="vg-form-grid">
            <div className="vg-field">
              <span className="vg-field-label">Mã tài khoản</span>
              <input className="vg-input" value={detailStaff.id} readOnly />
            </div>
            <div className="vg-field">
              <span className="vg-field-label">Họ và tên</span>
              <input className="vg-input" value={detailStaff.name} readOnly />
            </div>
            <div className="vg-field">
              <span className="vg-field-label">Email đăng nhập</span>
              <input className="vg-input" value={detailStaff.email} readOnly />
            </div>
            <div className="vg-field">
              <span className="vg-field-label">Số điện thoại</span>
              <input className="vg-input" value={detailStaff.phone || "Chưa có"} readOnly />
            </div>
            <div className="vg-field">
              <span className="vg-field-label">Vai trò công việc</span>
              <input className="vg-input" value={roles.find((r) => r.id === detailStaff.roleId)?.name || "N/A"} readOnly />
            </div>
            <div className="vg-field">
              <span className="vg-field-label">Trạng thái</span>
              <input className="vg-input" value={detailStaff.status === "active" ? "Đang hoạt động" : "Đã khóa"} readOnly />
            </div>
            <div className="vg-field">
              <span className="vg-field-label">Ngày tạo tài khoản</span>
              <input className="vg-input" value={detailStaff.createdAt} readOnly />
            </div>
            <div className="vg-field">
              <span className="vg-field-label">Đăng nhập gần nhất</span>
              <input className="vg-input" value={detailStaff.lastLogin || "Chưa có"} readOnly />
            </div>
          </div>
        )}
      </AdminModal>

      {/* ── MODAL: THÊM / SỬA NHÂN VIÊN ── */}
      <AdminModal
        open={!!editingStaff}
        onClose={() => setEditingStaff(null)}
        title={editingStaff?.id ? "Chỉnh sửa tài khoản nhân viên" : "Thêm tài khoản nhân viên mới"}
        subtitle="Cấp quyền truy cập hệ thống quản trị"
        size="md"
        footer={
          <>
            <button className="vg-btn" type="button" onClick={() => setEditingStaff(null)}>
              Hủy
            </button>
            <button className="vg-btn vg-btn-primary" type="submit" form="staff-form">
              Lưu tài khoản
            </button>
          </>
        }
      >
        <form id="staff-form" onSubmit={submitStaff}>
          <div className="vg-form-grid">
            <div className="vg-field vg-full">
              <span className="vg-field-label">
                Họ và tên nhân viên <span className="vg-required">*</span>
              </span>
              <input className="vg-input" name="name" defaultValue={editingStaff?.name} placeholder="Nguyễn Văn A" required />
            </div>
            <div className="vg-field">
              <span className="vg-field-label">
                Email quản trị <span className="vg-required">*</span>
              </span>
              <input
                className="vg-input"
                name="email"
                type="email"
                defaultValue={editingStaff?.email}
                placeholder="nhanvien@vigenfood.com"
                required
              />
            </div>
            <div className="vg-field">
              <span className="vg-field-label">Số điện thoại</span>
              <input className="vg-input" name="phone" defaultValue={editingStaff?.phone} placeholder="0901234567" />
            </div>
            <div className="vg-field">
              <span className="vg-field-label">
                Vai trò chức danh <span className="vg-required">*</span>
              </span>
              <select className="vg-select" name="roleId" defaultValue={editingStaff?.roleId || roles[0]?.id} required>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="vg-field">
              <span className="vg-field-label">Trạng thái tài khoản</span>
              <select className="vg-select" name="status" defaultValue={editingStaff?.status || "active"}>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Khóa tài khoản</option>
              </select>
            </div>
          </div>
        </form>
      </AdminModal>

      {/* ── MODAL: CHI TIẾT MA TRẬN VAI TRÒ ── */}
      <AdminModal
        open={!!detailRole}
        onClose={() => setDetailRole(null)}
        title={detailRole ? `Ma trận phân quyền: ${detailRole.name}` : "Chi tiết vai trò"}
        subtitle="Chi tiết các chức năng được phép xem, sửa hoặc xóa"
        size="lg"
        footer={<button className="vg-btn" type="button" onClick={() => setDetailRole(null)}>Đóng</button>}
      >
        {detailRole && (
          <div className="role-matrix-detail-view">
            <div className="role-matrix-header">
              <strong style={{ color: detailRole.color }}>{detailRole.name}</strong>
              <p>{detailRole.description}</p>
            </div>

            <div className="role-matrix-table">
              <div className="role-matrix-head">
                <span>CHỨC NĂNG HỆ THỐNG</span>
                <span className="col-center">XEM TRUY CẬP</span>
                <span className="col-center">THÊM / SỬA</span>
                <span className="col-center">XÓA DỮ LIỆU</span>
              </div>

              {ALL_MODULES.map((modKey) => {
                const perm = detailRole.permissions.find((p) => p.module === modKey);
                const hasView = perm?.actions.includes("view");
                const hasEdit = perm?.actions.includes("edit");
                const hasDelete = perm?.actions.includes("delete");

                return (
                  <div className="role-matrix-row" key={modKey}>
                    <div className="module-info">
                      <span className="module-icon">{MODULE_NAMES[modKey]?.icon}</span>
                      <span className="module-name">{MODULE_NAMES[modKey]?.label}</span>
                    </div>
                    <div className="col-center">
                      <em className={hasView ? "checked view" : "none"}>{hasView ? "✓ Có quyền" : "—"}</em>
                    </div>
                    <div className="col-center">
                      <em className={hasEdit ? "checked edit" : "none"}>{hasEdit ? "✓ Có quyền" : "—"}</em>
                    </div>
                    <div className="col-center">
                      <em className={hasDelete ? "checked delete" : "none"}>{hasDelete ? "✓ Có quyền" : "—"}</em>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </AdminModal>

      {/* ── MODAL: THÊM / SỬA VAI TRÒ & MA TRẬN ── */}
      <AdminModal
        open={!!editingRole}
        onClose={() => setEditingRole(null)}
        title={editingRole?.id ? `Chỉnh sửa vai trò: ${editingRole.name}` : "Tạo vai trò mới"}
        subtitle="Tùy chỉnh ma trận phân quyền chi tiết cho vai trò công việc"
        size="lg"
        footer={
          <>
            <button className="vg-btn" type="button" onClick={() => setEditingRole(null)}>
              Hủy
            </button>
            <button className="vg-btn vg-btn-primary" type="submit" form="role-form">
              Lưu vai trò & phân quyền
            </button>
          </>
        }
      >
        <form id="role-form" className="role-form-shell" onSubmit={submitRole}>
          <section className="role-info-section">
            <div className="role-section-heading">
              <span className="role-section-icon">☷</span>
              <div>
                <strong>THÔNG TIN VAI TRÒ</strong>
                <small>Đặt tên, nhận diện và mô tả cho vai trò nhân viên</small>
              </div>
            </div>
            <div className="vg-form-grid">
            <div className="vg-field">
              <span className="vg-field-label">
                Tên vai trò <span className="vg-required">*</span>
              </span>
              <input className="vg-input" name="name" defaultValue={editingRole?.name} placeholder="Nhân viên tư vấn..." required />
            </div>
            <div className="vg-field">
              <span className="vg-field-label">Màu nhận diện vai trò</span>
              <div className="role-color-selector">
                <input type="hidden" name="color" value={roleColor} />
                <div className="role-color-presets">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`role-color-chip ${roleColor === c ? "active" : ""}`}
                      style={{ background: c }}
                      onClick={() => setRoleColor(c)}
                      title={c}
                    />
                  ))}
                  <label className="role-color-picker-btn" title="Chọn màu tùy chỉnh">
                    🎨
                    <input
                      type="color"
                      value={roleColor}
                      onChange={(e) => setRoleColor(e.target.value)}
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="vg-field vg-full">
              <span className="vg-field-label">Mô tả chức năng công việc</span>
              <input className="vg-input" name="description" defaultValue={editingRole?.description} placeholder="Chịu trách nhiệm tư vấn khách hàng..." />
            </div>
            </div>
          </section>

          <section className="role-matrix-section">
            <div className="role-matrix-bar">
              <div>
                <span className="role-matrix-title"><span className="role-section-icon">♢</span> PHÂN QUYỀN HỆ THỐNG</span>
                <span className="role-matrix-subtext">Tích chọn các chức năng và hành động được phép thao tác</span>
              </div>
              <div className="role-matrix-presets">
                <button type="button" className="matrix-preset-btn" onClick={handleSelectAllPerms}>
                  ✅ Chọn tất cả
                </button>
                <button type="button" className="matrix-preset-btn" onClick={handleSelectViewOnlyPerms}>
                  👁️ Chỉ xem
                </button>
                <button type="button" className="matrix-preset-btn danger" onClick={handleClearAllPerms}>
                  ❌ Bỏ chọn
                </button>
              </div>
            </div>

            <div className="role-permission-cards">
              {ALL_MODULES.map((modKey) => {
                const state = rolePermsMap[modKey] || { view: false, edit: false, delete: false };
                const permissionCount = [state.view, state.edit, state.delete].filter(Boolean).length;
                const moduleInfo = MODULE_NAMES[modKey];
                const setPermission = (action: PermissionAction, value: boolean) => {
                  setRolePermsMap((prev) => ({
                    ...prev,
                    [modKey]: {
                      ...prev[modKey],
                      [action]: value,
                      view: action === "view" ? value : value ? true : prev[modKey]?.view,
                      edit: action === "view" && !value ? false : action === "edit" ? value : prev[modKey]?.edit,
                      delete: action === "view" && !value ? false : action === "delete" ? value : prev[modKey]?.delete,
                    },
                  }));
                };

                return (
                  <article className={`permission-card ${expandedModules[modKey] ? "expanded" : ""}`} key={modKey}>
                    <button
                      type="button"
                      className="permission-card-header"
                      aria-expanded={expandedModules[modKey]}
                      onClick={() => setExpandedModules((current) => ({ ...current, [modKey]: !current[modKey] }))}
                    >
                      <span className="permission-card-icon">{moduleInfo.icon}</span>
                      <span className="permission-card-copy">
                        <strong>{moduleInfo.label}</strong>
                        <small>{moduleInfo.description}</small>
                      </span>
                      <span className={`permission-count ${permissionCount > 0 ? "has-permissions" : ""}`}>{permissionCount}/3 quyền</span>
                      <span className="permission-card-chevron" aria-hidden="true">⌄</span>
                    </button>
                    {expandedModules[modKey] && (
                      <div className="permission-card-body">
                        {([
                          ["view", "Xem dữ liệu", "Cho phép truy cập và xem thông tin"],
                          ["edit", "Thêm / sửa", "Cho phép tạo mới và cập nhật thông tin"],
                          ["delete", "Xóa dữ liệu", "Cho phép xóa dữ liệu khỏi hệ thống"],
                        ] as [PermissionAction, string, string][]).map(([action, label, description]) => (
                          <label className={`permission-checkbox ${state[action] ? "checked" : ""}`} key={action}>
                            <input type="checkbox" checked={state[action]} onChange={(event) => setPermission(action, event.target.checked)} />
                            <span className="permission-checkbox-mark" aria-hidden="true">{state[action] ? "✓" : ""}</span>
                            <span className="permission-checkbox-copy">
                              <strong>{label}</strong>
                              <small>{description}</small>
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        </form>
      </AdminModal>

      {/* ── CONFIRM MODALS ── */}
      <ConfirmModal
        open={!!confirmDeleteStaff}
        onClose={() => setConfirmDeleteStaff(null)}
        onConfirm={() => {
          if (confirmDeleteStaff) {
            const nextList = staff.filter((s) => s.id !== confirmDeleteStaff.id);
            saveStaff(nextList);
            addAdminNotification(`Đã xóa tài khoản nhân viên "${confirmDeleteStaff.name}"`, "permissions", undefined, "permissions");
            showNotice("Đã xóa tài khoản nhân viên.", "success");
          }
          setConfirmDeleteStaff(null);
        }}
        title={`Xóa tài khoản ${confirmDeleteStaff?.name}?`}
        message="Tài khoản này sẽ bị xóa vĩnh viễn khỏi hệ thống và không thể khôi phục."
      />

      <ConfirmModal
        open={!!confirmDeleteRole}
        onClose={() => setConfirmDeleteRole(null)}
        onConfirm={() => {
          if (confirmDeleteRole) {
            const nextList = roles.filter((r) => r.id !== confirmDeleteRole.id);
            saveRoles(nextList);
            addAdminNotification(`Đã xóa vai trò "${confirmDeleteRole.name}"`, "permissions", undefined, "permissions");
            showNotice("Đã xóa vai trò.", "success");
          }
          setConfirmDeleteRole(null);
        }}
        title={`Xóa vai trò ${confirmDeleteRole?.name}?`}
        message="Vai trò sẽ bị xóa khỏi danh sách vai trò công việc."
      />
    </div>
  );
}
