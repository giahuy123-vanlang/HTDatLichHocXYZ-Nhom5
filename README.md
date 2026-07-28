# Hệ Thống Đặt Lịch Họp — Công ty XYZ

Đồ án môn học **Nhập môn Công nghệ phần mềm** — Trường Đại học Văn Lang, Khoa Công nghệ thông tin.
Module **Administrator** do **Nhóm 05** xây dựng ở Câu 4.

Ứng dụng web quản lý đặt phòng họp: đăng nhập theo vai trò, quản lý tài khoản người dùng, giám sát lịch họp toàn hệ thống và xem trạng thái/đặt phòng theo thời gian thực.

## Thành viên nhóm

| MSSV | Họ tên |
|---|---|
| 2474802016500 | Nguyễn Minh Gia Huy |
| 2474802010139 | Nguyễn Đỗ Minh Huy |
| 2374802010216 | Thạch Minh Khang |

## Chức năng chính (Module Administrator)

- **Đăng nhập hệ thống** — xác thực bằng email/mật khẩu (mã hóa bcrypt), phân quyền theo 3 vai trò: `Employee`, `Meeting Manager`, `Administrator`.
- **Quản lý tài khoản người dùng** (US-13) — tạo, sửa, xóa tài khoản. Chỉ Administrator truy cập.
- **Giám sát lịch họp & xác nhận kết thúc sớm** (US-14) — xem toàn bộ lịch họp trong hệ thống, giải phóng phòng ngay khi họp kết thúc sớm. Administrator và Meeting Manager truy cập.
- **Trạng thái & đặt phòng họp theo thời gian thực** (US-15) — xem tình trạng từng phòng (Trống/Đang sử dụng) và đặt lịch nhanh, có kiểm tra trùng lịch phòng. Dùng chung cho mọi vai trò.

## Công nghệ sử dụng

- **Backend:** Node.js, Express, Mongoose, bcrypt
- **Database:** MongoDB
- **Frontend:** HTML/CSS/JavaScript thuần (không dùng framework)

## Cấu trúc thư mục

```
HTDatLichHocXYZ-Nhom5/
├── server.js         # Express server: kết nối MongoDB, Schema, toàn bộ API
├── package.json       # Khai báo dependency: express, mongoose, bcrypt
└── public/
    └── index.html      # Giao diện + JavaScript gọi API (module Administrator)
```

## Yêu cầu hệ thống

- Node.js (khuyến nghị bản LTS 18 trở lên) và npm
- MongoDB sẵn sàng ở cổng `27017` — dùng **1 trong 2 cách** ở bước bên dưới
- Trình duyệt: Chrome, Edge hoặc Firefox bản mới

## Cách chạy dự án

### Bước 1 — Cài đặt thư viện

```bash
npm install
```

### Bước 2 — Chuẩn bị MongoDB (chọn 1 trong 2 cách)

**Cách 1 — Dùng MongoDB cài trực tiếp trên máy**

Cài [MongoDB Community Server](https://www.mongodb.com/try/download/community), khởi động dịch vụ `mongod` (mặc định lắng nghe cổng `27017`), đảm bảo `mongodb://127.0.0.1:27017` sẵn sàng trước khi chạy server.

**Cách 2 — Dùng Docker (khuyến nghị, không cần cài MongoDB trực tiếp)**

Nhóm đã đóng gói sẵn image MongoDB và đẩy lên Docker Hub. Chỉ cần Docker Desktop đang chạy:

```bash
docker pull giahuy712/mongo:latest
docker run -d --name xyz-mongo -p 27017:27017 giahuy712/mongo:latest
```

Quản lý container sau này:

```bash
docker stop xyz-mongo     # dừng, không mất dữ liệu
docker start xyz-mongo    # chạy lại
```

### Bước 3 — Khởi động server

```bash
node server.js
```

Console sẽ hiển thị:

```
Đã kết nối MongoDB thành công!
🚀 Hệ thống chạy tại http://localhost:5000
```

Ở lần chạy đầu tiên, hệ thống tự động tạo 5 tài khoản mẫu (`seedData`) nếu database đang trống.

### Bước 4 — Truy cập ứng dụng

Mở trình duyệt tại **http://localhost:5000** và đăng nhập bằng tài khoản mẫu bên dưới.

## Tài khoản mẫu

| Email | Mật khẩu | Vai trò |
|---|---|---|
| admin@xyzcorp.vn | admin123 | Administrator |
| manager@xyzcorp.vn | manager123 | Meeting Manager |
| employee1@xyzcorp.vn | employee123 | Employee |
| employee2@xyzcorp.vn | employee123 | Employee |
| employee3@xyzcorp.vn | employee123 | Employee |

## Docker Hub

Image MongoDB kèm cấu hình dùng cho dự án: **https://hub.docker.com/r/giahuy712/mongo**

## Giới hạn hiện tại & hướng phát triển

| Giới hạn hiện tại | Hướng hoàn thiện tiếp theo |
|---|---|
| Chưa hỗ trợ tìm kiếm, lọc, phân trang trên danh sách tài khoản | Bổ sung ô tìm kiếm, bộ lọc và phân trang |
| Chưa có cơ chế Khóa/Mở khóa tài khoản, hiện chỉ hỗ trợ Xóa vĩnh viễn | Bổ sung trạng thái Đang hoạt động/Đã khóa |
| Đăng nhập chưa khóa tạm thời sau nhiều lần sai, chưa dùng JWT/session | Bổ sung khóa tạm thời + xác thực bằng token |
| Đặt phòng chưa hỗ trợ mời người tham gia / xác nhận tham gia | Bổ sung danh sách người tham gia và luồng phản hồi |
| Chưa gửi email/thông báo thật | Tích hợp SMTP/SendGrid |
| Danh mục phòng họp đang khai báo cứng trong `server.js` | Xây dựng CRUD phòng họp, lưu vào MongoDB |

## Giấy phép

Dự án phục vụ mục đích học tập trong khuôn khổ Đồ án môn học Nhập môn Công nghệ phần mềm — Trường Đại học Văn Lang.
