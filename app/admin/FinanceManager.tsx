"use client";

import { FormEvent, useState } from "react";

type IconProps = React.ComponentPropsWithoutRef<"span">;
const Target = (props: IconProps) => <span {...props}>👁️</span>;
const Pencil = (props: IconProps) => <span {...props}>✏️</span>;
const Trash2 = (props: IconProps) => <span {...props}>🗑️</span>;
import AdminModal from "./components/AdminModal";
import ConfirmModal from "./components/ConfirmModal";
import { addAdminNotification } from "../lib/notifications";

export type FinanceType = "income" | "expense" | "capital" | "adjustment";
export type FinanceTransaction = {
  id: string;
  type: FinanceType;
  amount: number;
  date: string;
  category: string;
  method: string;
  source?: string;
  status: "completed" | "pending";
  contact: string;
  reference: string;
  note: string;
  attachment?: string;
  paymentStatus?: "paid" | "unpaid";
};

type OrderSummary = {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  paidAmount?: number;
  paymentStatus?: "paid" | "unpaid";
  customer?: string;
  phone?: string;
  email?: string;
  address?: string;
  province?: string;
  district?: string;
  ward?: string;
  note?: string;
  items?: number;
  subtotal?: number;
  shipping?: number;
  discount?: number;
  paymentMethod?: string;
  orderType?: "retail" | "combo";
  products?: { productId: number; quantity: number; purchasePrice?: number; isGift?: boolean }[];
  voucherCode?: string;
  promotionCode?: string;
  promotionName?: string;
};
type Period =
  "all" | "today" | "week" | "month" | "previousMonth" | "year" | "custom";
type LedgerRow = {
  id: string;
  date: string;
  type: FinanceType;
  category: string;
  source: string;
  income: number;
  expense: number;
  cashIncome?: number;
  balance: number;
  status: string;
  transaction?: FinanceTransaction;
};

const money = (value: number) => `${value.toLocaleString("vi-VN")}đ`;
const inputMoney = (value: string | number) => Number(value || 0) * 1000;
const dateValue = (value: string) =>
  new Date(`${value.slice(0, 10)}T12:00:00`).getTime();
const today = () => new Date().toISOString().slice(0, 10);
const methods = ["Tiền mặt", "Chuyển khoản", "Ví điện tử", "COD", "Khác"];
const sources = ["Tiền mặt", "Tài khoản ngân hàng", "Ví điện tử", "Công nợ", "Doanh thu", "Vốn tự bỏ ra"];
const groups: Record<FinanceType, string[]> = {
  income: ["Bán hàng", "Tiền khách thanh toán", "Thu hồi công nợ", "Thu khác"],
  expense: [
    "Nhập hàng",
    "Quảng cáo",
    "Vận chuyển",
    "Bao bì / vật phẩm",
    "Phí nền tảng",
    "Chi phí khác",
  ],
  capital: ["Góp vốn", "Bổ sung vốn", "Hoàn vốn"],
  adjustment: ["Thu khác", "Chi khác"],
};
const typeLabels: Record<FinanceType, string> = {
  income: "Doanh thu",
  expense: "Chi phí",
  capital: "Vốn",
  adjustment: "Điều chỉnh",
};

function periodRange(period: Period, from: string, to: string) {
  const now = new Date();
  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
  ).getTime();
  if (period === "all") return [-Infinity, Infinity];
  if (period === "custom") return [dateValue(from), dateValue(to) + 86399999];
  if (period === "today")
    return [
      new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime(),
      end,
    ];
  if (period === "week")
    return [
      new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6).getTime(),
      end,
    ];
  if (period === "month")
    return [new Date(now.getFullYear(), now.getMonth(), 1).getTime(), end];
  if (period === "previousMonth")
    return [
      new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime(),
      new Date(now.getFullYear(), now.getMonth(), 1).getTime() - 1,
    ];
  return [new Date(now.getFullYear(), 0, 1).getTime(), end];
}

export default function FinanceManager({
  transactions,
  orders,
  saveTransactions,
  saveOrders,
  updateOrder,
  products,
  showNotice,
}: {
  transactions: FinanceTransaction[];
  orders: OrderSummary[];
  saveTransactions: (next: FinanceTransaction[]) => void;
  saveOrders?: (next: OrderSummary[]) => void;
  updateOrder?: (id: string, status: string) => void;
  products?: { id: number; name: string; price: number; weight?: string; image?: string }[];
  showNotice?: (text: string, tone?: "success" | "info" | "warning" | "error") => void;
}) {
  const [editing, setEditing] = useState<FinanceTransaction | null>(null);
  const [editingOrder, setEditingOrder] = useState<OrderSummary | null>(null);
  const [detail, setDetail] = useState<FinanceTransaction | null>(null);
  const [orderDetail, setOrderDetail] = useState<OrderSummary | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<FinanceTransaction | null>(
    null,
  );
  const [confirmDeleteOrder, setConfirmDeleteOrder] = useState<OrderSummary | null>(
    null,
  );
  const [transactionType, setTransactionType] =
    useState<FinanceType>("expense");
  const [transactionCategory, setTransactionCategory] = useState(
    groups.expense[0],
  );

  function submitOrderEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingOrder) return;
    const data = new FormData(event.currentTarget);
    const customer = String(data.get("customer") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const address = String(data.get("address") || "").trim();
    const status = String(data.get("status") || "Thành công");
    const total = Number(data.get("total") || editingOrder.total);
    const note = String(data.get("note") || "").trim();

    if (updateOrder && editingOrder.status !== status) {
      updateOrder(editingOrder.id, status);
    }

    if (saveOrders) {
      const updatedOrders = orders.map((o) =>
        o.id === editingOrder.id
          ? { ...o, customer, phone, address, status, total, note }
          : o,
      );
      saveOrders(updatedOrders);
    }
    if (showNotice) showNotice("Đã cập nhật thông tin đơn hàng", "success");
    setEditingOrder(null);
  }
  const [transactionMethod, setTransactionMethod] = useState(methods[1]);
  const [period, setPeriod] = useState<Period>("month");
  const [fromDate, setFromDate] = useState(today());
  const [toDate, setToDate] = useState(today());
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formError, setFormError] = useState("");
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  const [amountInput, setAmountInput] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<
    "paid" | "unpaid"
  >("paid");
  const [capitalDue, setCapitalDue] = useState(0);
  const [summaryExpanded, setSummaryExpanded] = useState(true);

  const isCapitalSource = (source?: string, method?: string) =>
    source === "Vốn tự bỏ ra" || source === "Vốn" || method === "Vốn tự bỏ ra";

  const range = periodRange(period, fromDate, toDate);
  const inPeriod = (date: string) =>
    dateValue(date) >= range[0] && dateValue(date) <= range[1];
  const validOrders = orders.filter((order) => order.status !== "Đã hủy");
  const orderPaidAmount = (order: OrderSummary) => Math.min(order.total, Math.max(0, order.paidAmount || 0));
  const customerDebt = validOrders.reduce((sum, order) => sum + order.total - orderPaidAmount(order), 0);
  const changeOrderPayment = (order: OrderSummary, status: "unpaid" | "paid") => {
    if (!saveOrders) return;
    const paidAmount = status === "paid" ? order.total : status === "unpaid" ? 0 : order.paidAmount || 0;
    saveOrders(orders.map((item) => item.id === order.id ? { ...item, paymentStatus: status, paidAmount } : item));
    if (showNotice) showNotice("Đã cập nhật trạng thái thanh toán", "success");
  };
  const paymentStatusLabel = (status: "unpaid" | "paid") => status === "paid" ? "Đã thanh toán" : "Chưa thanh toán";
  const nextPaymentStatus = (status: "unpaid" | "paid") => status === "unpaid" ? "paid" : "unpaid";
  const completed = transactions.filter((item) => item.status === "completed");
  const completedInPeriod = completed.filter((item) => inPeriod(item.date));
  const orderRows: LedgerRow[] = validOrders
    .filter((order) => inPeriod(order.createdAt))
    .map((order) => ({
      id: order.id,
      date: order.createdAt.slice(0, 10),
      type: "income",
      category: "Bán hàng",
      source: "Đơn hàng",
      income: order.total,
      expense: 0,
      cashIncome: orderPaidAmount(order),
      balance: 0,
      status: orderPaidAmount(order) >= order.total ? "Đã thanh toán" : "Chưa thanh toán",
    }));
  const transactionRows: LedgerRow[] = completed
    .filter((item) => inPeriod(item.date))
    .map((item) => ({
      id: item.id,
      date: item.date,
      type: item.type,
      category: item.category,
      source: item.source || item.method,
      income:
        item.type === "income" ||
        (item.type === "adjustment" && item.category === "Thu khác") ||
        (item.type === "capital" && item.category !== "Hoàn vốn") ||
        (item.type === "expense" && isCapitalSource(item.source, item.method))
          ? item.amount
          : 0,
      expense:
        item.type === "expense" ||
        (item.type === "adjustment" && item.category === "Chi khác") ||
        (item.type === "capital" && item.category === "Hoàn vốn")
          ? item.amount
          : 0,
      balance: 0,
      status: "Đã nhận",
      transaction: item,
    }));
  const allPeriodRows = [...orderRows, ...transactionRows].sort(
    (a, b) => dateValue(a.date) - dateValue(b.date),
  );
  allPeriodRows.forEach((row) => {
    row.balance = (row.cashIncome ?? row.income) - row.expense;
  });
  const income = allPeriodRows.reduce((sum, row) => sum + row.income, 0);
  const expense = allPeriodRows.reduce((sum, row) => sum + row.expense, 0);
  const revenue = validOrders
    .filter((order) => inPeriod(order.createdAt))
    .reduce((sum, order) => sum + order.total, 0) +
    transactionRows
      .filter((row) => row.category !== "Bán hàng")
      .reduce((sum, row) => sum + row.income, 0);
  const costs = allPeriodRows
    .filter((row) => row.type === "expense" && row.category === "Nhập hàng")
    .reduce((sum, row) => sum + row.expense, 0);
  const operatingExpense = allPeriodRows
    .filter((row) => row.type === "expense" && row.category !== "Nhập hàng")
    .reduce((sum, row) => sum + row.expense, 0);
  const capitalContributed = completedInPeriod
    .filter(
      (item) =>
        (item.type === "capital" && item.category !== "Hoàn vốn") ||
        (item.type === "expense" && isCapitalSource(item.source, item.method)),
    )
    .reduce((sum, item) => sum + item.amount, 0);
  const capitalReturned = completedInPeriod
    .filter((item) => item.type === "capital" && item.category === "Hoàn vốn")
    .reduce((sum, item) => sum + item.amount, 0);
  const allRows: LedgerRow[] = [
    ...validOrders.map((order) => ({
      id: order.id,
      date: order.createdAt.slice(0, 10),
      type: "income" as FinanceType,
      category: "Bán hàng",
      source: "Đơn hàng",
      income: order.total,
      expense: 0,
      cashIncome: orderPaidAmount(order),
      balance: 0,
      status: orderPaidAmount(order) >= order.total ? "Đã thanh toán" : "Chưa thanh toán",
    })),
    ...completed.map((item) => ({
      id: item.id,
      date: item.date,
      type: item.type,
      category: item.category,
      source: item.source || item.method,
      income:
        item.type === "income" ||
        (item.type === "adjustment" && item.category === "Thu khác") ||
        (item.type === "capital" && item.category !== "Hoàn vốn") ||
        (item.type === "expense" && isCapitalSource(item.source, item.method))
          ? item.amount
          : 0,
      expense:
        item.type === "expense" ||
        (item.type === "adjustment" && item.category === "Chi khác") ||
        (item.type === "capital" && item.category === "Hoàn vốn")
          ? item.amount
          : 0,
      balance: 0,
      status: "Đã nhận",
    })),
  ];
  const cashBalance = allRows.reduce(
    (sum, row) => sum + (row.cashIncome ?? row.income) - row.expense,
    0,
  );
  const filtered = allPeriodRows
    .filter((row) => {
      if (categoryFilter !== "all") {
        if (categoryFilter.startsWith("type:")) {
          const targetType = categoryFilter.replace("type:", "");
          if (targetType === "capital") {
            if (row.type !== "capital" && row.type !== "adjustment") return false;
          } else if (row.type !== targetType) {
            return false;
          }
        } else if (row.category !== categoryFilter) {
          return false;
        }
      }
      if (sourceFilter !== "all" && row.source !== sourceFilter) return false;
      return (
        !query.trim() ||
        `${row.id} ${row.category} ${row.source} ${row.transaction?.contact || ""} ${row.transaction?.note || ""}`
          .toLowerCase()
          .includes(query.toLowerCase())
      );
    })
    .reverse();
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  function openEditor(item: FinanceTransaction) {
    setTransactionType(item.type);
    setTransactionCategory(item.category);
    setTransactionMethod(item.method);
    setAmountInput(item.amount ? String(item.amount / 1000) : "");
    setPaymentStatus(item.paymentStatus || "paid");
    setCapitalDue(Math.max(0, capitalContributed - capitalReturned));
    setFormError("");
    setSaveState("idle");
    setEditing(item);
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const type = String(data.get("type")) as FinanceType;
    const enteredAmount = inputMoney(String(data.get("amount") || 0));
    const actualAmount = type === "income" && paymentStatus === "unpaid" ? 0 : enteredAmount;
    const category = String(data.get("category") || "");
    setFormError("");
    if (!type || !category || !String(data.get("note") || "").trim()) {
      setFormError("Vui lòng chọn loại, nhóm và nhập nội dung giao dịch.");
      setSaveState("error");
      return;
    }
    if (enteredAmount <= 0 || Number.isNaN(enteredAmount)) {
      setFormError("Số tiền phải lớn hơn 0.");
      setSaveState("error");
      return;
    }
    if (
      type === "capital" &&
      category === "Hoàn vốn" &&
      enteredAmount > capitalDue
    ) {
      setFormError(
        `Số tiền hoàn không được vượt quá ${money(capitalDue)} vốn còn phải hoàn.`,
      );
      setSaveState("error");
      return;
    }
    const next: FinanceTransaction = {
      id: editing?.id || `FT-${Date.now().toString().slice(-6)}`,
      type,
      amount: actualAmount,
      date: String(data.get("date")),
      category,
      method: String(data.get("method")),
      source: String(data.get("source") || ""),
      status: String(data.get("status")) as FinanceTransaction["status"],
      contact: String(data.get("contact") || ""),
      reference: String(data.get("reference") || ""),
      note: String(data.get("note") || "").trim(),
      attachment: String(data.get("attachment") || ""),
      paymentStatus,
    };
    if (!next.date || !next.method) {
      setFormError("Vui lòng bổ sung ngày và hình thức giao dịch.");
      setSaveState("error");
      return;
    }
    setSaveState("saving");
    saveTransactions(
      editing?.id
        ? transactions.map((item) => (item.id === editing.id ? next : item))
        : [next, ...transactions],
    );
    addAdminNotification(
      editing?.id
        ? `Cập nhật giao dịch tài chính #${next.id}`
        : `Tạo giao dịch tài chính mới #${next.id} (${next.type === "income" ? "Thu" : "Chi"} ${next.amount.toLocaleString("vi-VN")}đ)`,
      "finance",
      undefined,
      "finance"
    );
    setSaveState("success");
    setEditing(null);
  }
  function exportExcel() {
    const csv = [
      [
        "Ngày",
        "Loại",
        "Nội dung",
        "Nhóm",
        "Nguồn tiền",
        "Thu",
        "Chi",
        "Số dư",
        "Trạng thái",
      ],
      ...filtered.map((row) => [
        row.date,
        typeLabels[row.type],
        row.id,
        row.category,
        row.source,
        row.income,
        row.expense,
        row.balance,
        row.status,
      ]),
    ]
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `so-giao-dich-${today()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
  const blank: FinanceTransaction = {
    id: "",
    type: "expense",
    amount: 0,
    date: today(),
    category: groups.expense[0],
    method: methods[1],
    source: sources[1],
    status: "completed",
    contact: "",
    reference: "",
    note: "",
  };

  return (
    <>
      <div className="admin-finance-heading">
        <div className="finance-title-block"><span className="admin-kicker">QUẢN LÝ DÒNG TIỀN</span><h2>Quản lý giao dịch</h2><p>Theo dõi thu, chi, vốn và hiệu quả kinh doanh.</p></div>
        <div className="finance-period-controls">
          <button
            type="button"
            className={period === "today" ? "active" : ""}
            onClick={() => {
              setPeriod("today");
              setPage(1);
            }}
          >
            Hôm nay
          </button>
          <button
            type="button"
            className={period === "week" ? "active" : ""}
            onClick={() => {
              setPeriod("week");
              setPage(1);
            }}
          >
            7 ngày
          </button>
          <button
            type="button"
            className={period === "month" ? "active" : ""}
            onClick={() => {
              setPeriod("month");
              setPage(1);
            }}
          >
            Tháng này
          </button>
          <button
            type="button"
            className={period === "previousMonth" ? "active" : ""}
            onClick={() => {
              setPeriod("previousMonth");
              setPage(1);
            }}
          >
            Tháng trước
          </button>
          <button
            type="button"
            className={period === "year" ? "active" : ""}
            onClick={() => {
              setPeriod("year");
              setPage(1);
            }}
          >
            Năm nay
          </button>
          <button
            type="button"
            className={period === "custom" ? "active" : ""}
            onClick={() => {
              setPeriod("custom");
              setPage(1);
            }}
          >
            Tùy chỉnh
          </button>
        </div>
        <button className="admin-primary" onClick={() => openEditor(blank)}>
          ＋ Thêm giao dịch
        </button>
        <button
          type="button"
          className="finance-summary-toggle"
          onClick={() => setSummaryExpanded((expanded) => !expanded)}
          aria-expanded={summaryExpanded}
        >
          {summaryExpanded ? "Thu gọn tổng quan" : "Mở rộng tổng quan"}
        </button>
        {period === "custom" && (
          <div className="finance-custom-dates">
            <input
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
            />
            <input
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
            />
          </div>
        )}
      </div>
      {summaryExpanded && (
        <>
          {/* Row 1: Dòng tiền & Lợi nhuận */}
          <div className="admin-stats admin-finance-stats">
            <div className="admin-stat">
              <span className="admin-stat-icon">K</span>
              <div>
                <span>TIỀN TRONG KÉT</span>
                <strong
                  className={
                    cashBalance < 0 ? "finance-negative" : "finance-profit"
                  }
                >
                  {money(cashBalance)}
                </strong>
                <small>Quỹ tiền hiện có tại cửa hàng</small>
              </div>
            </div>
            <div className="admin-stat">
              <span className="admin-stat-icon">T</span>
              <div>
                <span>DOANH THU BÁN HÀNG</span>
                <strong className="finance-income">{money(revenue)}</strong>
                <small>Tổng tiền bán hàng thu về</small>
              </div>
            </div>
            <div className="admin-stat">
              <span className="admin-stat-icon">C</span>
              <div>
                <span>TỔNG CHI PHÍ</span>
                <strong className="finance-expense">{money(expense)}</strong>
                <small>Chi nhập hàng & vận hành</small>
              </div>
            </div>
            <div className="admin-stat">
              <span className="admin-stat-icon">L</span>
              <div>
                <span>LỢI NHUẬN (LỜI / LỖ)</span>
                <strong
                  className={
                    revenue - costs - operatingExpense < 0
                      ? "finance-negative"
                      : "finance-profit"
                  }
                >
                  {money(revenue - costs - operatingExpense)}
                </strong>
                <small>
                  {revenue - costs - operatingExpense < 0
                    ? `Đang lỗ ${money(Math.abs(revenue - costs - operatingExpense))}`
                    : `Đang lời ${money(revenue - costs - operatingExpense)}`}
                </small>
              </div>
            </div>
          </div>

          {/* Row 2: Vốn & Công nợ */}
          <section className="admin-panel admin-finance-summary">
            <div>
              <span className="admin-kicker">QUẢN LÝ VỐN & NỢ</span>
              <h3>Vốn và công nợ</h3>
            </div>
            <div className="admin-finance-summary-value">
              <div>
                <small>VỐN ĐÃ GÓP</small>
                <strong>{money(capitalContributed)}</strong>
                <small>Tổng tiền vốn đã nạp vào</small>
              </div>
              <div>
                <small>ĐÃ HOÀN VỐN</small>
                <strong>{money(capitalReturned)}</strong>
                <small>Tiền vốn đã rút / trả lại</small>
              </div>
              <div>
                <small>VỐN CẦN HOÀN LẠI</small>
                <strong>
                  {money(Math.max(0, capitalContributed - capitalReturned))}
                </strong>
                <small>Số vốn còn chưa thu hồi</small>
              </div>
              <div>
                <small>CÔNG NỢ KHÁCH NỢ</small>
                <strong>{money(customerDebt)}</strong>
                <small>Tiền khách hàng chưa trả</small>
              </div>
            </div>
          </section>
        </>
      )}
      <section className="admin-panel admin-finance-table-panel">
        <div className="admin-table-head">
          <div>
            <strong>DANH SÁCH GIAO DỊCH ({filtered.length})</strong>
            <span>Thu, chi, vốn và điều chỉnh trong kỳ</span>
          </div>
          <button className="admin-primary" type="button" onClick={exportExcel}>
            ⇩ Xuất Excel
          </button>
        </div>
        <div className="admin-product-filters finance-filters">
          <div className="admin-search">
            ⌕
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Tìm kiếm nội dung..."
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(event) => {
              setCategoryFilter(event.target.value);
              setPage(1);
            }}
            aria-label="Lọc nhóm giao dịch"
          >
            <option value="all">Tất cả nhóm giao dịch</option>
            <option value="type:income">↗ Tất cả Doanh thu</option>
            <option value="type:expense">↘ Tất cả Chi phí</option>
            <option value="type:capital">₫ Tất cả Vốn & Điều chỉnh</option>
            <option disabled>────── DOANH THU ──────</option>
            {groups.income.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
            <option disabled>────── CHI PHÍ ──────</option>
            {groups.expense.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
            <option disabled>────── VỐN & ĐIỀU CHỈNH ──────</option>
            {groups.capital.concat(groups.adjustment).map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <select
            value={sourceFilter}
            onChange={(event) => {
              setSourceFilter(event.target.value);
              setPage(1);
            }}
            aria-label="Lọc nguồn tiền"
          >
            <option value="all">Tất cả nguồn tiền</option>
            {Array.from(
              new Set([
                "Đơn hàng",
                "Tiền kinh doanh",
                "Vốn tự bỏ ra",
                ...sources,
                ...allPeriodRows.map((r) => r.source).filter(Boolean),
              ]),
            ).map((source) => (
              <option key={source}>{source}</option>
            ))}
          </select>
        </div>
        {visibleRows.length ? (
          <div className="finance-table">
            <div className="finance-table-head">
              <span>NGÀY</span>
              <span>LOẠI / NỘI DUNG</span>
              <span>NHÓM</span>
              <span>NGUỒN TIỀN</span>
              <span>THU</span>
              <span>CHI</span>
              <span>THỰC THU / CHÊNH LỆCH</span>
              <span>TRẠNG THÁI</span>
              <span>THAO TÁC</span>
            </div>
            {visibleRows.map((row) => (
              <div className="finance-row" key={row.id}>
                <span>
                  {new Date(`${row.date}T12:00:00`).toLocaleDateString("vi-VN")}
                </span>
                <div>
                  <strong
                    className={
                      row.income ? "finance-income" : "finance-expense"
                    }
                  >
                    {typeLabels[row.type]}
                  </strong>
                  <small>{row.id}</small>
                </div>
                <span>{row.category}</span>
                <span>{row.source}</span>
                <b className="finance-income">
                  {row.income ? money(row.income) : "-"}
                </b>
                <b className="finance-expense">
                  {row.expense ? money(row.expense) : "-"}
                </b>
                <span>{money(row.balance)}</span>
                <span>
                  {!row.transaction ? (() => {
                    const currentStatus: "unpaid" | "paid" = row.status === "Đã thanh toán" ? "paid" : "unpaid";
                    const order = orders.find((item) => item.id === row.id);
                    return <button
                      type="button"
                      className={`finance-payment-button ${currentStatus}`}
                      onClick={() => order && changeOrderPayment(order, nextPaymentStatus(currentStatus))}
                      title="Bấm để đổi trạng thái thanh toán"
                      aria-label={`Đổi trạng thái thanh toán ${row.id}`}
                    >
                      {paymentStatusLabel(currentStatus)}
                    </button>;
                  })() : (
                    <span className="finance-status-badge">{row.status}</span>
                  )}
                </span>
                <div className="admin-row-actions">
                  {row.transaction && (
                    <>
                      <button
                        title="Xem chi tiết"
                        onClick={() => setDetail(row.transaction)}
                      >
                        <Target aria-hidden="true" />
                      </button>
                      <button
                        title="Sửa giao dịch"
                        onClick={() => openEditor(row.transaction)}
                      >
                        <Pencil aria-hidden="true" />
                      </button>
                      <button
                        className="danger"
                        title="Xóa giao dịch"
                        onClick={() =>
                          setConfirmDelete(row.transaction || null)
                        }
                      >
                        <Trash2 aria-hidden="true" />
                      </button>
                    </>
                  )}
                  {!row.transaction && (
                    <>
                      <button
                        title="Xem chi tiết đơn hàng"
                        onClick={() => setOrderDetail(orders.find((order) => order.id === row.id) || null)}
                      >
                        <Target aria-hidden="true" />
                      </button>
                      <button
                        title="Sửa đơn hàng"
                        onClick={() => setEditingOrder(orders.find((order) => order.id === row.id) || null)}
                      >
                        <Pencil aria-hidden="true" />
                      </button>
                      <button
                        className="danger"
                        title="Xóa đơn hàng"
                        onClick={() => setConfirmDeleteOrder(orders.find((order) => order.id === row.id) || null)}
                      >
                        <Trash2 aria-hidden="true" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="admin-empty">
            Chưa có giao dịch phù hợp trong kỳ này.
          </div>
        )}
        <div className="finance-pagination">
          <span>
            Hiển thị {visibleRows.length} / {filtered.length} giao dịch
          </span>
          <div>
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              ←
            </button>
            <b>
              {page} / {pageCount}
            </b>
            <button
              type="button"
              disabled={page >= pageCount}
              onClick={() => setPage(page + 1)}
            >
              →
            </button>
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
              aria-label="Số giao dịch mỗi trang"
            >
              <option value="10">10 / trang</option>
              <option value="20">20 / trang</option>
              <option value="50">50 / trang</option>
            </select>
          </div>
        </div>
      </section>
      <AdminModal
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail ? `Chi tiết ${detail.id}` : "Chi tiết giao dịch"}
        subtitle="Thông tin chi tiết giao dịch" 
        size="md"
        footer={<><button className="vg-btn" type="button" onClick={() => setDetail(null)}>Đóng</button></>}
      >
        {detail && (
          <div className="vg-form-grid">
            <div className="vg-field"><span className="vg-field-label">Mã giao dịch</span><input className="vg-input" value={detail.id} readOnly /></div>
            <div className="vg-field"><span className="vg-field-label">Loại</span><input className="vg-input" value={typeLabels[detail.type]} readOnly /></div>
            <div className="vg-field"><span className="vg-field-label">Nhóm</span><input className="vg-input" value={detail.category} readOnly /></div>
            <div className="vg-field"><span className="vg-field-label">Ngày</span><input className="vg-input" value={detail.date} readOnly /></div>
            <div className="vg-field"><span className="vg-field-label">Số tiền</span><input className="vg-input" value={money(detail.amount)} readOnly /></div>
            <div className="vg-field"><span className="vg-field-label">Phương thức</span><input className="vg-input" value={detail.method} readOnly /></div>
            <div className="vg-field"><span className="vg-field-label">Nguồn</span><input className="vg-input" value={detail.source || "Không có"} readOnly /></div>
            <div className="vg-field"><span className="vg-field-label">Liên hệ</span><input className="vg-input" value={detail.contact || "Không có"} readOnly /></div>
            <div className="vg-field"><span className="vg-field-label">Trạng thái</span><input className="vg-input" value={detail.status === "completed" ? "Hoàn tất" : "Chờ xử lý"} readOnly /></div>
            <div className="vg-field"><span className="vg-field-label">Mã tham chiếu</span><input className="vg-input" value={detail.reference || "Không có"} readOnly /></div>
            <div className="vg-field vg-full"><span className="vg-field-label">Nội dung</span><textarea className="vg-textarea" value={detail.note} readOnly /></div>
          </div>
        )}
      </AdminModal>
      <AdminModal
        open={!!orderDetail}
        onClose={() => setOrderDetail(null)}
        title={orderDetail ? `Chi tiết đơn hàng ${orderDetail.id}` : "Chi tiết đơn hàng"}
        subtitle="Thông tin chi tiết giao dịch và sản phẩm đơn hàng"
        size="md"
        footer={
          <button className="vg-btn" type="button" onClick={() => setOrderDetail(null)}>
            Đóng
          </button>
        }
      >
        {orderDetail && (
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, background: "rgba(255,255,255,0.03)", padding: 14, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }}>
              <div><small style={{ color: "#8a99ad", display: "block", fontSize: 11, marginBottom: 2 }}>MÃ ĐƠN HÀNG</small><strong style={{ fontSize: 14, color: "#e5c666" }}>{orderDetail.id}</strong></div>
              <div><small style={{ color: "#8a99ad", display: "block", fontSize: 11, marginBottom: 2 }}>NGÀY TẠO</small><span style={{ fontSize: 13 }}>{new Date(orderDetail.createdAt).toLocaleString("vi-VN")}</span></div>
              <div><small style={{ color: "#8a99ad", display: "block", fontSize: 11, marginBottom: 2 }}>KHÁCH HÀNG</small><strong style={{ fontSize: 13 }}>{orderDetail.customer || "Khách lẻ"}</strong></div>
              <div><small style={{ color: "#8a99ad", display: "block", fontSize: 11, marginBottom: 2 }}>SỐ ĐIỆN THOẠI</small><span style={{ fontSize: 13 }}>{orderDetail.phone || "Chưa cập nhật"}</span></div>
              <div style={{ gridColumn: "span 2" }}><small style={{ color: "#8a99ad", display: "block", fontSize: 11, marginBottom: 2 }}>ĐỊA CHỈ GIAO HÀNG</small><span style={{ fontSize: 13, lineHeight: 1.4 }}>{[orderDetail.address, orderDetail.ward, orderDetail.district, orderDetail.province].filter(Boolean).join(", ") || "Chưa cập nhật"}</span></div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, background: "rgba(255,255,255,0.03)", padding: 14, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }}>
              <div><small style={{ color: "#8a99ad", display: "block", fontSize: 11, marginBottom: 2 }}>THANH TOÁN</small><span style={{ fontSize: 12 }}>{({ cod: "COD (Tiền mặt)", bank: "Chuyển khoản", wallet: "Ví điện tử", vnpay: "VNPay" }[orderDetail.paymentMethod || "cod"] || orderDetail.paymentMethod || "COD")}</span></div>
              <div><small style={{ color: "#8a99ad", display: "block", fontSize: 11, marginBottom: 2 }}>TRẠNG THÁI</small><span className={`admin-badge badge-${orderDetail.status === "Đã hủy" ? "danger" : "success"}`}>{orderDetail.status}</span></div>
              <div><small style={{ color: "#8a99ad", display: "block", fontSize: 11, marginBottom: 2 }}>TỔNG THANH TOÁN</small><strong style={{ fontSize: 15, color: "#2ecc71" }}>{money(orderDetail.total)}</strong></div>
            </div>

            {orderDetail.products && orderDetail.products.length > 0 && (
              <div style={{ border: "1px solid rgba(229,198,102,.25)", borderRadius: 8, padding: "12px 14px", background: "rgba(2,25,15,.5)" }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#e5c666", display: "block", marginBottom: 8, letterSpacing: "0.5px" }}>DANH SÁCH SẢN PHẨM ({orderDetail.items || orderDetail.products.length})</span>
                <div style={{ display: "grid", gap: 6 }}>
                  {orderDetail.products.map((item, idx) => {
                    const prod = products?.find((p) => p.id === item.productId);
                    const price = item.purchasePrice || prod?.price || 0;
                    return (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: idx < (orderDetail.products?.length || 0) - 1 ? "1px solid rgba(255,255,255,.08)" : "none", fontSize: 13 }}>
                        <div><b>{prod?.name || `Sản phẩm #${item.productId}`}</b> <span style={{ color: "#8a99ad", marginLeft: 6 }}>x{item.quantity}</span></div>
                        <strong style={{ color: "#f5d978" }}>{money(price * item.quantity)}</strong>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {orderDetail.note && (
              <div style={{ background: "rgba(255,255,255,0.02)", padding: 10, borderRadius: 6, border: "1px dashed rgba(255,255,255,0.1)" }}>
                <small style={{ color: "#8a99ad", display: "block", fontSize: 11, marginBottom: 4 }}>GHI CHÚ</small>
                <span style={{ fontSize: 13 }}>{orderDetail.note}</span>
              </div>
            )}
          </div>
        )}
      </AdminModal>
      <AdminModal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Chỉnh sửa giao dịch" : "Thêm giao dịch"}
        subtitle="Chọn đúng loại để hệ thống tự cập nhật tiền, vốn và lợi nhuận."
        size="md"
        footer={
          <>
            <button className="vg-btn" type="button" onClick={() => setEditing(null)}>Hủy bỏ</button>
            <button className="vg-btn vg-btn-primary" type="submit" form="finance-form" disabled={saveState === "saving"}>
              {saveState === "saving" ? "Đang lưu..." : saveState === "success" ? "Đã lưu" : "Lưu giao dịch"}
            </button>
          </>
        }
      >
        <form id="finance-form" className="finance-transaction-form" onSubmit={submit}>
          <input type="hidden" name="type" value={transactionType} />
          <div className="finance-form-section">
            <span className="finance-form-section-title">1. LOẠI GIAO DỊCH</span>
            <div className="finance-type-options">
              {Object.entries(typeLabels).map(([value, label]) => <button type="button" key={value} className={transactionType === value ? "active" : ""} onClick={() => { const next = value as FinanceType; setTransactionType(next); setTransactionCategory(groups[next][0]); setFormError(""); }}><b>{value === "income" ? "↗" : value === "expense" ? "↘" : value === "capital" ? "₫" : "±"}</b><strong>{label}</strong><small>{value === "income" ? "Tiền bán hàng, thu tiền..." : value === "expense" ? "Nhập hàng, quảng cáo..." : value === "capital" ? "Góp vốn, hoàn vốn..." : "Thu khác, chi khác..."}</small></button>)}
            </div>
          </div>
          {formError && <div className="finance-form-error" role="alert">{formError}</div>}
          <div className="finance-form-section">
            <span className="finance-form-section-title">2. THÔNG TIN GIAO DỊCH</span>
            <div className="vg-form-grid">
              <div className="vg-field"><span className="vg-field-label">Nhóm {transactionType === "expense" ? "chi phí" : "giao dịch"} *</span><select className="vg-select" name="category" value={transactionCategory} onChange={event => setTransactionCategory(event.target.value)}>{groups[transactionType].map(group => <option key={group}>{group}</option>)}</select></div>
              <div className="vg-field"><span className="vg-field-label">Ngày giao dịch *</span><input className="vg-input" name="date" type="date" defaultValue={editing?.date || blank.date} required /></div>
              <div className="vg-field"><span className="vg-field-label">Số tiền (nghìn VND) *</span><div className="vg-money-input"><input name="amount" type="number" min="1" step="1" value={amountInput} onChange={event => setAmountInput(event.target.value)} placeholder="5000" required /><span>.000 VND</span></div></div>
              <div className="vg-field"><span className="vg-field-label">Hình thức {transactionType === "capital" && transactionCategory !== "Hoàn vốn" ? "nhận tiền" : "thanh toán"} *</span><select className="vg-select" name="method" value={transactionMethod} onChange={event => setTransactionMethod(event.target.value)}>{methods.map(method => <option key={method}>{method}</option>)}</select></div>
              {transactionType === "expense" && <div className="vg-field"><span className="vg-field-label">Nguồn tiền *</span><select className="vg-select" name="source" defaultValue={editing?.source || "Tiền kinh doanh"}><option>Tiền kinh doanh</option><option>Vốn</option><option>Khác</option></select></div>}
              {(transactionType === "income" || transactionType === "expense" || transactionType === "capital") && <div className="vg-field"><span className="vg-field-label">{transactionType === "capital" && transactionCategory === "Hoàn vốn" ? "Người nhận" : transactionType === "expense" ? "Nhà cung cấp" : "Khách hàng / đơn hàng"}</span><input className="vg-input" name="contact" defaultValue={editing?.contact} placeholder="Nhập thông tin liên quan" /></div>}
              {transactionType === "income" && <div className="vg-field"><span className="vg-field-label">Trạng thái thanh toán</span><select className="vg-select" name="paymentStatus" value={paymentStatus} onChange={event => setPaymentStatus(event.target.value as typeof paymentStatus)}><option value="paid">Đã thanh toán</option><option value="unpaid">Chưa thanh toán</option></select></div>}
              <div className="vg-field"><span className="vg-field-label">Mã tham chiếu</span><input className="vg-input" name="reference" defaultValue={editing?.reference} placeholder="HD-001, UNC-002..." /></div>
              <div className="vg-field vg-full"><span className="vg-field-label">Nội dung giao dịch *</span><textarea className="vg-textarea" name="note" defaultValue={editing?.note} placeholder={transactionType === "capital" ? "Ví dụ: Góp vốn đợt 1" : "Ví dụ: Thanh toán tiền nhập gạo"} required /></div>
            </div>
          </div>
          <div className="finance-form-section finance-attachment-section">
            <span className="finance-form-section-title">3. HÓA ĐƠN / CHỨNG TỪ <small>(không bắt buộc)</small></span>
            <label className="finance-upload-box"><input name="attachment" type="file" accept=".jpg,.jpeg,.png,.pdf" /><span>⇧</span><strong>Kéo thả file vào đây hoặc <em>chọn file</em></strong><small>Hỗ trợ: JPG, PNG, PDF (tối đa 5MB)</small></label>
          </div>
              <div className="finance-impact-preview"><strong>Sau khi lưu giao dịch</strong><span>{transactionType === "capital" && transactionCategory === "Hoàn vốn" ? `Vốn còn phải hoàn: ${money(capitalDue)} → ${money(Math.max(0, capitalDue - inputMoney(amountInput)))}` : transactionType === "capital" ? `Tiền hiện có: ${money(cashBalance)} → ${money(cashBalance + inputMoney(amountInput))}` : transactionType === "expense" ? `Tiền hiện có: ${money(cashBalance)} → ${money(cashBalance - inputMoney(amountInput))}` : `Tiền hiện có: ${money(cashBalance)} → ${money(cashBalance + inputMoney(paymentStatus === "unpaid" ? 0 : amountInput || 0))}`}</span></div>
        </form>
      </AdminModal>
      <ConfirmModal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => {
          if (confirmDelete) {
            saveTransactions(
              transactions.filter((item) => item.id !== confirmDelete.id),
            );
            addAdminNotification(
              `Đã xóa giao dịch tài chính #${confirmDelete.id}`,
              "finance",
              undefined,
              "finance"
            );
          }
          setConfirmDelete(null);
        }}
        title={`Xóa giao dịch ${confirmDelete?.id}?`}
        message="Giao dịch sẽ bị xóa khỏi sổ dòng tiền và không thể hoàn tác."
      />
      <AdminModal
        open={!!editingOrder}
        onClose={() => setEditingOrder(null)}
        title={editingOrder ? `Chỉnh sửa đơn hàng ${editingOrder.id}` : "Chỉnh sửa đơn hàng"}
        subtitle="Cập nhật thông tin và trạng thái đơn hàng"
        size="md"
        footer={
          <>
            <button className="vg-btn" type="button" onClick={() => setEditingOrder(null)}>Hủy bỏ</button>
            <button className="vg-btn vg-btn-primary" type="submit" form="order-edit-form">Lưu đơn hàng</button>
          </>
        }
      >
        {editingOrder && (
          <form id="order-edit-form" onSubmit={submitOrderEdit}>
            <div className="vg-form-grid">
              <div className="vg-field"><span className="vg-field-label">Mã đơn hàng</span><input className="vg-input" value={editingOrder.id} readOnly /></div>
              <div className="vg-field"><span className="vg-field-label">Trạng thái *</span>
                <select className="vg-select" name="status" defaultValue={editingOrder.status}>
                  <option value="Thành công">Thành công</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
              </div>
              <div className="vg-field"><span className="vg-field-label">Tên khách hàng *</span><input className="vg-input" name="customer" defaultValue={editingOrder.customer || ""} required /></div>
              <div className="vg-field"><span className="vg-field-label">Số điện thoại *</span><input className="vg-input" name="phone" defaultValue={editingOrder.phone || ""} required /></div>
              <div className="vg-field vg-full"><span className="vg-field-label">Địa chỉ giao hàng</span><input className="vg-input" name="address" defaultValue={editingOrder.address || ""} /></div>
              <div className="vg-field"><span className="vg-field-label">Tổng tiền đơn hàng (VND) *</span><input className="vg-input" name="total" type="number" defaultValue={editingOrder.total} required /></div>
              <div className="vg-field vg-full"><span className="vg-field-label">Ghi chú</span><textarea className="vg-textarea" name="note" defaultValue={editingOrder.note || ""} /></div>
            </div>
          </form>
        )}
      </AdminModal>
      <ConfirmModal
        open={!!confirmDeleteOrder}
        onClose={() => setConfirmDeleteOrder(null)}
        onConfirm={() => {
          if (confirmDeleteOrder && saveOrders) {
            saveOrders(orders.filter((item) => item.id !== confirmDeleteOrder.id));
            if (showNotice) showNotice("Đã xóa đơn hàng khỏi sổ dòng tiền");
          }
          setConfirmDeleteOrder(null);
        }}
        title={`Xóa đơn hàng ${confirmDeleteOrder?.id}?`}
        message="Đơn hàng này sẽ bị xóa khỏi hệ thống và gạch tên khỏi sổ dòng tiền."
      />
    </>
  );
}
