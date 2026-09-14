# Hướng dẫn backend cho dự án Gạo Ngon

## 1. Tình trạng hiện tại của frontend

Dự án hiện tại là một frontend Next.js 15 chạy chủ yếu bằng dữ liệu localStorage. Chưa có:
- file API thật (route handlers)
- cấu trúc dữ liệu tách riêng cho domain models
- service layer để gọi backend
- môi trường API base URL
- file schema / validation
- file seed / mock data rõ ràng

## 2. Những file nền tảng đã bổ sung

- `app/lib/types.ts`: định nghĩa các types dùng chung
- `app/lib/api.ts`: client API wrapper chuẩn cho backend
- `app/api/health/route.ts`: health check
- `app/api/products/route.ts`: products endpoint
- `app/api/categories/route.ts`: categories endpoint
- `app/api/orders/route.ts`: orders endpoint
- `app/api/vouchers/route.ts`: vouchers endpoint
- `app/api/content/route.ts`: content endpoint
- `app/api/settings/route.ts`: settings endpoint

## 3. Các file chính đang dùng localStorage hiện nay

Các file dưới đây đang chứa logic dữ liệu thay vì API thật:
- `app/admin/page.tsx`
- `app/admin/CategoryManager.tsx`
- `app/admin/InventoryManager.tsx`
- `app/admin/FinanceManager.tsx`
- `app/admin/PromotionManager.tsx`
- `app/admin/PermissionManager.tsx`
- `app/admin/SettingsManager.tsx`
- `app/components/AuthModal.tsx`
- `app/components/CartPopover.tsx`
- `app/components/ProductCard.tsx`
- `app/components/SiteHeader.tsx`
- `app/lib/notifications.ts`
- `app/san-pham/data.ts`
- `app/thanh-toan/page.tsx`
- `app/user/page.tsx`

## 4. Backend nên xây theo cấu trúc nào

Bạn nên chuẩn hóa thành các module sau:

### Backend modules
- `auth` : đăng nhập, xác thực quyền admin
- `products` : CRUD sản phẩm, tìm kiếm, lọc
- `categories` : CRUD danh mục
- `orders` : tạo đơn, cập nhật trạng thái, lưu giao dịch
- `inventory` : nhập/xuất kho, báo cáo tồn kho
- `finance` : giao dịch, doanh thu, dòng tiền
- `promotions` : mã giảm giá, combo, ưu đãi
- `content` : banner, tin tức, về chúng tôi
- `settings` : cấu hình site

### Database nên dùng
- PostgreSQL hoặc MongoDB tùy dự án
- Với Next.js, bạn có thể dùng:
  - Prisma + PostgreSQL cho dữ liệu quan hệ
  - Mongoose + MongoDB cho dữ liệu linh hoạt

## 5. Gợi ý route backend xuất phát

- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`
- `GET /api/orders`
- `POST /api/orders`
- `PUT /api/orders/:id`
- `GET /api/vouchers`
- `GET /api/content`
- `GET /api/settings`
- `PUT /api/settings`
- `POST /api/auth/login`
- `POST /api/auth/logout`

## 6. Dữ liệu cần chuẩn hóa khi chuyển sang backend

- `Product`
- `Category`
- `Order`
- `Voucher`
- `InventoryRecord`
- `FinanceTransaction`
- `Promotion`
- `ContentItem`
- `User`
- `AdminNotification`

## 7. Dùng file này để lập backend

Bạn có thể dùng `app/lib/types.ts` làm nguồn dữ liệu kiểu cho backend và UI.

## 8. Bước tiếp theo đề xuất

1. Tạo database schema
2. Viết API routes thật bằng Prisma hoặc Mongoose
3. Thay localStorage bằng gọi `app/lib/api.ts`
4. Xử lý auth và role admin
5. Thêm validation và middleware
6. Chạy `npm run build` để kiểm tra dự án

## 9. Lưu ý quan trọng

- Đây là dự án chưa có backend nên mọi dữ liệu hiện tại đang là demo.
- Khi xây backend, không nên để UI trực tiếp dùng localStorage nữa.
- Đầu tiên cần tách dữ liệu thành API contract rõ ràng trước khi viết service layer.
