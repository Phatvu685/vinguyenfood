# Gạo Ngon - Backend Analysis & Feature Map

## 1. Tổng quan dự án

Dự án hiện tại là một ứng dụng Next.js App Router, chủ yếu dùng React + TypeScript và lưu dữ liệu qua `localStorage` trong frontend. Về mặt backend, hệ thống đã có sẵn một số `route handlers` demo ở `app/api/*`, nhưng hầu hết logic nghiệp vụ vẫn đang chạy ở client và chưa có cơ sở dữ liệu / service layer thật.

### Mục tiêu của file này
- Tổng hợp tất cả chức năng hiện có của các trang, component và API.
- Chỉ ra các dữ liệu, workflow và state đang được quản lý bởi frontend.
- Làm tài liệu nền cho việc xây backend thực tế sau này.

---

## 2. Kiến trúc hiện tại

### Frontend
- Framework: Next.js App Router
- Ngôn ngữ: TypeScript
- UI: React
- State management: `useState`, `useEffect`, `localStorage`
- API client wrapper: `app/lib/api.ts`

### Backend hiện có
- `app/api/health/route.ts`
- `app/api/products/route.ts`
- `app/api/categories/route.ts`
- `app/api/orders/route.ts`
- `app/api/vouchers/route.ts`
- `app/api/content/route.ts`
- `app/api/settings/route.ts`

### Lưu ý quan trọng
- Các route ở `app/api/*` hiện mới chỉ là mock/demo data, chưa có DB hoặc validation mạnh.
- Nhiều chức năng đang phụ thuộc hoàn toàn vào `localStorage` trong UI.
- Khi xây backend, cần tách logic từ UI thành API contract rõ ràng.

---

## 3. Cấu trúc file chính

### Trang chính
- `app/page.tsx` – Trang chủ
- `app/san-pham/page.tsx` – Trang danh sách sản phẩm
- `app/san-pham/[id]/page.tsx` – Trang chi tiết sản phẩm
- `app/thanh-toan/page.tsx` – Trang thanh toán / đặt hàng
- `app/user/page.tsx` – Trang tài khoản người dùng
- `app/tin-tuc/page.tsx` – Trang tin tức
- `app/ve-chung-toi/page.tsx` – Trang giới thiệu

### Admin
- `app/admin/page.tsx` – Trang admin chính, chứa dashboard và các tabs
- `app/admin/CategoryManager.tsx` – Quản lý danh mục
- `app/admin/InventoryManager.tsx` – Quản lý kho và nhập/xuất
- `app/admin/FinanceManager.tsx` – Quản lý dòng tiền / giao dịch
- `app/admin/PromotionManager.tsx` – Quản lý combo & ưu đãi
- `app/admin/PermissionManager.tsx` – Quản lý phân quyền nhân viên
- `app/admin/SettingsManager.tsx` – Cài đặt website

### Shared data / utilities
- `app/lib/types.ts` – Type chính của domain models
- `app/lib/api.ts` – Wrapper gọi API
- `app/lib/notifications.ts` – Notification hệ thống
- `app/san-pham/data.ts` – Product catalog, cart helpers, storage keys

### Components
- `app/components/AuthModal.tsx` – Login / Register / Admin login
- `app/components/CartPopover.tsx` – giỏ hàng popup
- `app/components/ProductCard.tsx` – card sản phẩm
- `app/components/SiteHeader.tsx` – header website
- `app/components/SiteFooter.tsx` – footer

---

## 4. Chức năng theo trang

## 4.1. Trang chủ (`app/page.tsx`)

### Chức năng hiện có
- Hiển thị hero slider 3 slide
- Hiển thị member offer / ưu đãi hội viên
- Hiển thị danh sách sản phẩm catalog
- Thêm nhanh sản phẩm vào giỏ
- Hiển thị cart count
- Chức năng auth modal cho người dùng và admin
- Gắn sự kiện cập nhật khi dữ liệu sản phẩm, nội dung, cart thay đổi

### Nguồn dữ liệu
- `heroSlides` từ `gao-ngon-hero-slides`
- `memberOffer` từ `gao-ngon-member-offer`
- `catalogProducts` từ `gao-ngon-admin-products` hoặc `san-pham/data.ts`
- `user` từ `gao-ngon-user`
- `cart` từ `gao-ngon-cart`

### Workflow chính
1. Load dữ liệu từ localStorage khi mount.
2. Lắng nghe các event như:
   - `gao-ngon-cart-updated`
   - `gao-ngon-products-updated`
   - `gao-ngon-content-updated`
   - `gao-ngon-member-offer-updated`
3. Người dùng click "Thêm nhanh" -> nếu chưa login thì mở AuthModal, nếu đã login thì add vào cart.

---

## 4.2. Trang sản phẩm (`app/san-pham/page.tsx`)

### Chức năng hiện có
- Hiển thị danh sách sản phẩm có bộ lọc
- Tìm kiếm sản phẩm theo tên
- Hiển thị thông tin giá, trọng lượng, trạng thái
- Thêm sản phẩm vào giỏ hàng
- Nếu chưa login thì mở modal đăng nhập
- Hiển thị ưu đãi / combo nếu có

### Dữ liệu và state
- Danh sách product lấy từ `getCatalogProducts()`
- Cart lấy từ `CART_STORAGE_KEY`
- User từ `USER_STORAGE_KEY`

### Tích hợp hệ thống
- Dùng ProductCard
- Dùng CartPopover
- Có event cập nhật giỏ hàng sau khi thêm mới

---

## 4.3. Trang chi tiết sản phẩm (`app/san-pham/[id]/page.tsx`)

### Chức năng hiện có
- Hiển thị chi tiết 1 sản phẩm
- Hiển thị ảnh, tên, mô tả, giá, đánh giá, tag
- Thêm vào giỏ hàng
- Chuyển hướng đến trang thanh toán nếu người dùng chọn mua ngay
- Có flow auth check nếu chưa đăng nhập

### Workflow liên quan
- Xác định product theo URL param `id`
- Nếu user chưa login khi click mua ngay, mở auth modal
- Nếu user đã login, thêm sản phẩm vào cart

---

## 4.4. Trang thanh toán (`app/thanh-toan/page.tsx`)

### Chức năng hiện có
- Hiển thị giỏ hàng hiện tại
- Chọn phương thức thanh toán
- Áp dụng voucher hoặc promotion
- Hiển thị shipping fee
- Chọn mua lẻ hoặc combo
- Tạo đơn hàng
- Tự động trừ stock trong kho và tạo inventory export record
- Tạo hóa đơn / in hóa đơn PDF
- Hiển thị voucher mới được mở khóa sau khi đặt hàng

### Điểm nghiệp vụ quan trọng
- `reserveCheckoutStock(order)`
  - Ghi record xuất kho vào `gao-ngon-inventory`
  - Giảm stock của sản phẩm trong `gao-ngon-admin-products`
- `submitOrder()`
  - Tạo `Order`
  - Lưu vào `gao-ngon-orders`
  - Gửi admin notification
  - Hỗ trợ unlocked vouchers dựa trên lịch sử đơn hàng

### Dữ liệu cần backend
- Orders
- Products stock
- InventoryRecords
- Vouchers
- Promotions
- Order payment status
- Customer order history

---

## 4.5. Trang người dùng (`app/user/page.tsx`)

### Chức năng hiện có
- Đăng nhập / đăng ký thông qua AuthModal
- Xem tổng quan tài khoản
- Chỉnh sửa thông tin cá nhân
- Upload avatar
- Đổi mật khẩu
- Xem địa chỉ giao hàng
- Xem ưu đãi hội viên
- Xem đơn hàng của tôi

### Dữ liệu cần backend
- User profile
- Password change flow
- User order history
- User voucher unlock / rewards
- Address book

---

## 4.6. Trang tin tức (`app/tin-tuc/page.tsx`)

### Chức năng hiện có
- Hiển thị danh sách tin tức
- Có header, footer, cart và auth state
- Dùng dữ liệu mẫu trong component

### Backend tương lai
- `GET /api/news`
- `GET /api/articles`
- `POST /api/articles`
- `PUT /api/articles/:id`

---

## 4.7. Trang giới thiệu (`app/ve-chung-toi/page.tsx`)

### Chức năng hiện có
- Trang giới thiệu doanh nghiệp
- Hiển thị timeline, giá trị cốt lõi, thống kê
- Có auth/cart state để đồng bộ UI

### Backend tương lai
- Có thể dùng `content/about` thay vì hardcoded

---

## 5. Trang admin

## 5.1. Admin dashboard (`app/admin/page.tsx`)

### Chức năng chính
- Login admin với email/password cố định
- Tab điều hướng:
  - Tổng quan
  - Sản phẩm
  - Danh mục
  - Đơn hàng
  - Khách hàng
  - Mã giảm giá
  - Dòng tiền
  - Quản lý kho
  - Combo & ưu đãi
  - Nội dung
  - Phân quyền
  - Cài đặt
- Xử lý notice/notification
- Theo dõi số lượng order, revenue, low stock, pending inventory

### Dữ liệu admin quản lý
- Products
- Categories
- Orders
- Vouchers
- Transactions
- InventoryRecords
- Promotions
- Content
- Staff / Roles
- Settings

### Storage keys dùng trong admin
- `gao-ngon-admin-products`
- `gao-ngon-orders`
- `gao-ngon-vouchers`
- `gao-ngon-categories`
- `gao-ngon-content`
- `gao-ngon-hero-slides`
- `gao-ngon-member-offer`
- `gao-ngon-finance`
- `gao-ngon-inventory`
- `gao-ngon-promotions`
- `gao-ngon-admin-roles`
- `gao-ngon-admin-staff`
- `gao-ngon-settings`

---

## 5.2. Quản lý sản phẩm (`app/admin/page.tsx` + `app/admin/InventoryManager.tsx`)

### Chức năng
- Thêm / sửa / xóa sản phẩm
- Hiển thị product table, filters, search
- Quản lý stock, minStock, sold
- Upload ảnh hoặc nhập URL ảnh
- Xóa sản phẩm đồng thời dừng các promotion liên quan
- Quản lý kho hàng và cập nhật stock

### Backend cần hỗ trợ
- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `GET /api/products?search=&category=&status=`

---

## 5.3. Quản lý danh mục (`app/admin/CategoryManager.tsx`)

### Chức năng
- Thêm / sửa / xóa danh mục
- Toggle bật/tắt danh mục
- Tự động rename category trên sản phẩm khi danh mục đổi tên
- Không cho xóa danh mục đang còn sản phẩm

### Backend cần hỗ trợ
- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

---

## 5.4. Quản lý đơn hàng (`app/admin/page.tsx` + `app/admin/FinanceManager.tsx`)

### Chức năng
- Xem danh sách đơn hàng
- Cập nhật trạng thái đơn hàng
- Bảo toàn dữ liệu paymentStatus và paidAmount
- Xem chi tiết đơn hàng
- Tạo export inventory khi có đơn mới
- Hỗ trợ xác nhận / hủy đơn

### Backend cần hỗ trợ
- `GET /api/orders`
- `POST /api/orders`
- `PUT /api/orders/:id`
- `PATCH /api/orders/:id/status`

---

## 5.5. Khách hàng (`app/admin/page.tsx`)

### Chức năng hiện có
- Khách hàng được lưu trong `gao-ngon-customers`
- Có thể tạo / sửa / xóa khách hàng
- Có thể lọc theo trạng thái và chi tiêu

### Backend cần hỗ trợ
- `GET /api/customers`
- `POST /api/customers`
- `PUT /api/customers/:id`
- `DELETE /api/customers/:id`

---

## 5.6. Mã giảm giá (`app/admin/page.tsx`)

### Chức năng hiện có
- Thêm / sửa / xóa voucher
- Hỗ trợ nhiều loại giảm giá:
  - `amount`
  - `percent`
  - `shipping`
- Có điều kiện:
  - `min_orders`
  - `min_spend`
  - `first_order`
  - `holiday`
  - `review_reward`
  - `next_order`
  - `top_customer`

### Backend cần hỗ trợ
- `GET /api/vouchers`
- `POST /api/vouchers`
- `PUT /api/vouchers/:id`
- `DELETE /api/vouchers/:id`

---

## 5.7. Dòng tiền & tài chính (`app/admin/FinanceManager.tsx`)

### Chức năng hiện có
- Quản lý giao dịch thu chi
- Lọc theo ngày / tuần / tháng / năm
- Phân loại theo `income`, `expense`, `capital`, `adjustment`
- Tạo ledger / báo cáo dòng tiền
- Theo dõi công nợ khách hàng
- Cập nhật trạng thái thanh toán đơn hàng

### Backend cần hỗ trợ
- `GET /api/finance`
- `POST /api/finance`
- `PUT /api/finance/:id`
- `GET /api/reports/finance`

---

## 5.8. Quản lý kho (`app/admin/InventoryManager.tsx`)

### Chức năng hiện có
- Thêm phiếu nhập / xuất / điều chỉnh kho
- Mỗi phiếu có:
  - type
  - productId
  - quantity
  - purchasePrice
  - salePrice
  - date
  - partner
  - warehouse
  - batch
  - status
  - note
- Tự động cập nhật stock
- Tự động sinh transaction tài chính liên quan
- Theo dõi tồn kho và giá trị kho

### Backend cần hỗ trợ
- `GET /api/inventory`
- `POST /api/inventory`
- `PUT /api/inventory/:id`
- `DELETE /api/inventory/:id`
- `GET /api/inventory/summary`

---

## 5.9. Combo & ưu đãi (`app/admin/PromotionManager.tsx`)

### Chức năng hiện có
- Tạo combo khuyến mãi
- Có 4 loại ưu đãi:
  - amount
  - percent
  - gift
  - shipping
- Điều kiện mua theo kg
- Có mã khuyến mãi hoặc tự động áp dụng
- Preview giá combo trước khi lưu

### Backend cần hỗ trợ
- `GET /api/promotions`
- `POST /api/promotions`
- `PUT /api/promotions/:id`
- `DELETE /api/promotions/:id`

---

## 5.10. Nội dung website (`app/admin/page.tsx`)

### Chức năng hiện có
- Quản lý hero slide
- Quản lý banner / about / news
- Quản lý member offer / ưu đãi hội viên
- Upload ảnh hoặc nhập URL ảnh
- Chỉnh sửa định dạng nội dung hiển thị luân phiên trên website

### Backend cần hỗ trợ
- `GET /api/content`
- `POST /api/content`
- `PUT /api/content/:id`
- `DELETE /api/content/:id`
- `GET /api/hero`
- `PUT /api/hero`
- `GET /api/member-offer`
- `PUT /api/member-offer`

---

## 5.11. Phân quyền hệ thống (`app/admin/PermissionManager.tsx`)

### Chức năng hiện có
- Quản lý roles / vai trò
- Mỗi role có permissions theo module và action
- Quản lý staff accounts
- Có module danh sách:
  - overview
  - products
  - categories
  - orders
  - customers
  - vouchers
  - finance
  - inventory
  - promotions
  - content
  - permissions
- Hỗ trợ action: `view`, `edit`, `delete`

### Backend cần hỗ trợ
- `GET /api/roles`
- `POST /api/roles`
- `PUT /api/roles/:id`
- `DELETE /api/roles/:id`
- `GET /api/staff`
- `POST /api/staff`
- `PUT /api/staff/:id`
- `DELETE /api/staff/:id`

---

## 5.12. Cài đặt website (`app/admin/SettingsManager.tsx`)

### Chức năng hiện có
- Lưu dữ liệu settings website như:
  - siteName
  - supportPhone
  - supportEmail
  - enableFreeShipping
  - freeShippingThreshold
  - allowGuestCheckout
  - showOutOfStock
  - maintenanceMode
- Hỗ trợ upload URL / upload hình ảnh cho logo/favicon nếu có

### Backend cần hỗ trợ
- `GET /api/settings`
- `PUT /api/settings`

---

## 6. Data models đã có sẵn

### `app/lib/types.ts`
Các model chính gồm:
- `Product`
- `Category`
- `CartItem`
- `Order`
- `Voucher`
- `Promotion`
- `InventoryRecord`
- `FinanceTransaction`
- `ContentItem`
- `HeroSlideContent`
- `MemberOfferContent`
- `AdminNotification`
- `SiteSettings`

### Các field quan trọng của Product
- `id`, `name`, `category`, `price`, `image`, `note`
- `reviews`, `rating`, `weight`, `unit`
- `badge`, `origin`, `storage`, `standard`, `tags`
- `stock`, `minStock`, `sold`

### Các field quan trọng của Order
- `id`, `createdAt`, `status`, `customer`, `phone`, `email`
- `address`, `province`, `district`, `ward`, `note`
- `total`, `paidAmount`, `paymentStatus`
- `items`, `orderType`
- `products[]`, `voucherCode`, `promotionCode`, `discount`, `shipping`, `paymentMethod`

### Các field quan trọng của InventoryRecord
- `id`, `type`, `productId`, `quantity`, `purchasePrice`, `salePrice`
- `date`, `partner`, `warehouse`, `batch`, `status`, `note`, `fundingSource`, `reference`

---

## 7. LocalStorage keys đang dùng

### Người dùng / auth
- `gao-ngon-user`

### Sản phẩm / catalog
- `gao-ngon-admin-products`
- `gao-ngon-categories`
- `gao-ngon-cart`

### Đơn hàng / vouchers / promotions
- `gao-ngon-orders`
- `gao-ngon-vouchers`
- `gao-ngon-promotions`

### Nội dung / settings
- `gao-ngon-content`
- `gao-ngon-hero-slides`
- `gao-ngon-member-offer`
- `gao-ngon-settings`

### Tài chính / kho
- `gao-ngon-finance`
- `gao-ngon-inventory`

### Admin permissions
- `gao-ngon-admin-roles`
- `gao-ngon-admin-staff`

### Notifications
- `gao-ngon-notifications`

---

## 8. API hiện có và trạng thái

### Route handlers hiện có (`app/api/*`)

#### `GET /api/health`
- Trả về health status
- Status: demo ready

#### `GET /api/products`
- Trả về danh sách product mẫu
- Status: mock data

#### `POST /api/products`
- Tạo product mock
- Status: mock only

#### `GET /api/categories`
- Trả về danh mục mẫu
- Status: mock only

#### `POST /api/categories`
- Tạo danh mục mock
- Status: mock only

#### `GET /api/orders`
- Trả về đơn hàng demo
- Status: mock only

#### `POST /api/orders`
- Tạo đơn hàng demo
- Status: mock only

#### `GET /api/vouchers`
- Trả về vouchers demo
- Status: mock only

#### `GET /api/content`
- Trả về content demo
- Status: mock only

#### `GET /api/settings`
- Trả về settings demo
- Status: mock only

#### `PUT /api/settings`
- cập nhật settings demo
- Status: mock only

---

## 9. API client wrapper đã có sẵn

### `app/lib/api.ts`
Dự án đã có wrapper như sau:
- `api.health()`
- `api.getProducts()`
- `api.getCategories()`
- `api.getOrders()`
- `api.getVouchers()`
- `api.getContent()`
- `api.getSettings()`
- `api.createOrder()`
- `api.updateOrder()`

### Điểm mạnh
- Có sẵn client-side API abstraction
- Có thể dùng làm base để thay localStorage bằng backend thật

### Cần bổ sung tiếp
- CRUD cho categories, inventory, finance, promotions, users, staff, roles
- Authentication endpoints
- Validation layer
- Error handling chuẩn
- Pagination / filtering / sorting

---

## 10. Những chức năng cần backend thật khi triển khai

### A. Product domain
- Product CRUD
- Search/filter/sort
- Stock management
- Price and weight calculation
- Image storage management

### B. Order domain
- Tạo đơn hàng
- Cập nhật trạng thái
- Payment tracking
- Inventory deduction
- Shipping calculation
- Invoice history

### C. Inventory domain
- Import/export records
- Supplier and warehouse tracking
- Stock reconciliation
- Low stock alerts
- Inventory value summary

### D. Finance domain
- Ledger
- Revenue/expense tracking
- Capital and adjustment entries
- Customer debt summary
- Report export

### E. Promotion domain
- Promo CRUD
- Apply promo rules
- Combo pricing simulation
- Gift item handling
- Expiration checks

### F. Content domain
- Banner / hero slides
- About page content
- News posts
- Member offer block

### G. Auth / user domain
- Login / register
- Admin login
- Role-based access control
- User profile update
- Avatar upload

### H. Permission domain
- Roles
- Staff accounts
- Module permissions
- Actions (`view`, `edit`, `delete`)

---

## 11. Đề xuất mô hình backend nên dùng

### Nên dùng cấu trúc domain-driven
- `auth`
- `users`
- `products`
- `categories`
- `orders`
- `inventory`
- `finance`
- `promotions`
- `content`
- `settings`
- `permissions`

### Database recommendation
- PostgreSQL + Prisma cho dữ liệu quan hệ mạnh
- MongoDB nếu cần lưu content linh hoạt và nhiều collection

### Cách tiếp cận phù hợp với dự án hiện tại
1. Tách dữ liệu từ localStorage sang DB schema.
2. Xây API thật theo các route đề xuất.
3. Chuyển các màn hình admin client sang gọi API thay vì đọc localStorage trực tiếp.
4. Thêm validation và middleware authentication.
5. Chạy build/test sau khi migrate.

---

## 12. Tổng kết

Hiện tại dự án Gạo Ngon đang là một frontend hoàn chỉnh nhưng phần dữ liệu, nghiệp vụ và quyền truy cập vẫn chủ yếu chạy bằng localStorage và mock APIs. Nếu muốn xây backend, cần ưu tiên những phần sau:

1. `Products`
2. `Orders`
3. `Inventory`
4. `Finance`
5. `Promotions`
6. `Content`
7. `Users & Auth`
8. `Permissions / Roles`
9. `Settings`

Đây là nền tảng để bắt đầu xây backend đúng hướng cho dự án.
