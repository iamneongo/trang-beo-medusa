# Trang beo + Medusa

Repo này đã được scaffold từ Medusa `2.15.2` theo chế độ `--skip-db` để chuẩn bị cho mobile app hiện tại.

## Mô hình áp dụng

- `Sales Channel`: mobile app
- `Stock Location`: 1 chi nhánh mẫu
- `Products / Variants / Inventory`: menu phở, combo, đồ uống
- `Store API`: mobile Expo gọi endpoint bootstrap riêng cho app

## Endpoint đã chuẩn bị

- `GET /store/mobile/bootstrap`

Endpoint này trả về một snapshot demo gồm:

- `stores`: 1 chi nhánh mẫu
- `categories`: danh mục món
- `products`: món ăn theo danh mục

Mobile app hiện tại đã được chuẩn bị để đọc endpoint này khi set:

```env
EXPO_PUBLIC_MEDUSA_URL=http://localhost:9000
```

Nếu biến môi trường không tồn tại hoặc backend chưa chạy, mobile sẽ tự fallback về dữ liệu local.

## Điều còn thiếu để chạy backend thật

Máy hiện tại chưa có PostgreSQL hoặc Docker, nên Medusa chưa thể boot hoàn chỉnh.

Bạn cần một trong hai:

1. Cài PostgreSQL local rồi điền `DATABASE_URL` trong `apps/backend/.env`
2. Hoặc dùng database remote PostgreSQL rồi điền `DATABASE_URL`

Ví dụ:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/medusa_trang_beo
JWT_SECRET=supersecret
COOKIE_SECRET=supersecret
STORE_CORS=http://localhost:8081,http://localhost:19006,exp://192.168.110.202:8081
ADMIN_CORS=http://localhost:7001,http://localhost:9000
AUTH_CORS=http://localhost:7001,http://localhost:9000
```

Sau đó:

```powershell
cd D:\Coding\Server\trang-beo-medusa
npm run backend:dev
```

## Bước tiếp theo mình đề xuất

1. Cài PostgreSQL local.
2. Chạy backend Medusa.
3. Tạo `sales channel`, `stock location`, `publishable API key`.
4. Thay snapshot demo bằng dữ liệu thật đọc từ Medusa modules.
