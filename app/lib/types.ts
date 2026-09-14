export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  note: string;
  reviews: number;
  rating: number;
  weight: string;
  unit?: "kg" | "bao" | "thùng" | "chai";
  badge?: string;
  originalPrice?: number;
  discount?: number;
  origin?: string;
  storage?: string;
  standard?: string;
  tags?: string;
  stock?: number;
  minStock?: number;
  sold?: number;
};

export type Category = {
  id: number;
  name: string;
  description: string;
  active: boolean;
};

export type CartItem = {
  product: Product;
  quantity: number;
  weight: string;
};

export type Order = {
  id: string;
  createdAt: string;
  status: string;
  customer: string;
  phone: string;
  email?: string;
  address?: string;
  province?: string;
  district?: string;
  ward?: string;
  note?: string;
  total: number;
  paidAmount?: number;
  paymentStatus?: "paid" | "unpaid";
  subtotal?: number;
  items: number;
  orderType?: "retail" | "combo";
  products?: Array<{
    productId: number;
    quantity: number;
    purchasePrice?: number;
    isGift?: boolean;
  }>;
  voucherCode?: string;
  promotionCode?: string;
  promotionName?: string;
  giftProductId?: number;
  discount?: number;
  shipping?: number;
  paymentMethod?: string;
};

export type Voucher = {
  code: string;
  desc: string;
  exp: string;
  active: boolean;
  discountType?: "amount" | "percent" | "shipping";
  discountValue?: number;
  conditionType?: "none" | "min_orders" | "min_spend" | "first_order" | "holiday" | "review_reward" | "next_order" | "top_customer";
  minOrders?: number;
  minSpend?: number;
  holidayDate?: string;
  holidayName?: string;
  requireReviewPhoto?: boolean;
  topRank?: number;
};

export type Promotion = {
  id: string;
  code?: string;
  requireCode?: boolean;
  name: string;
  productId: number;
  minQuantity?: number;
  benefitType?: "percent" | "amount" | "gift";
  benefitValue?: number;
  giftProductId?: number;
  startDate: string;
  endDate: string;
  status: "active" | "paused" | "expired";
  note?: string;
};

export type InventoryRecord = {
  id: string;
  type: "import" | "export" | "adjustment";
  productId: number;
  quantity: number;
  purchasePrice: number;
  salePrice: number;
  date: string;
  partner: string;
  warehouse: string;
  batch: string;
  status: "completed" | "pending";
  note?: string;
  fundingSource?: string;
  reference?: string;
};

export type FinanceTransaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  date: string;
  category: string;
  method: string;
  source: string;
  status: "completed" | "pending";
  contact: string;
  reference: string;
  note?: string;
};

export type ContentItem = {
  id: number;
  type: "banner" | "about" | "news";
  title: string;
  description: string;
  image: string;
  category?: string;
  date?: string;
};

export type HeroSlideContent = {
  background: string;
  product: string;
  eyebrow: string;
  title: string;
  script: string;
  description: string;
};

export type MemberOfferContent = {
  title: string;
  label: string;
  discount: string;
  condition: string;
  button: string;
  href: string;
};

export type AdminNotification = {
  id: number;
  title: string;
  type: "product" | "category" | "order" | "system";
  message?: string;
  scope?: string;
  read: boolean;
  createdAt: string;
};

export type SiteSettings = {
  siteName: string;
  supportPhone: string;
  supportEmail: string;
  enableFreeShipping: boolean;
  freeShippingThreshold: number;
  allowGuestCheckout: boolean;
  showOutOfStock: boolean;
  maintenanceMode: boolean;
};
