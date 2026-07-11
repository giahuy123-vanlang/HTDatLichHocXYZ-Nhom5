# HTDatLichHocXYZ-Nhom5

Đồ án môn học **Nhập môn Công nghệ Phần mềm** — Đề bài: Xây dựng Hệ thống Đặt lịch họp cho Công ty XYZ

**Nhóm 5**
- Nguyễn Minh Gia Huy — MSSV: 2474802016500
- Nguyễn Đỗ Minh Huy — MSSV: 2474802010139

Module đảm nhiệm: **Administrator (Quản trị viên)**

## Giới thiệu

Hệ thống Đặt lịch họp giúp Công ty XYZ quản lý việc đặt phòng họp trực tuyến, thay cho cách đặt lịch thủ công qua email/chat gây trùng lịch và khó theo dõi. Repository này chứa mã nguồn phần giao diện của **module Administrator**, gồm 2 chức năng chính:

- **Quản lý tài khoản người dùng**: tìm kiếm, lọc theo vai trò/trạng thái, phân trang, tạo tài khoản mới, khóa/mở khóa tài khoản.
- **Dashboard thống kê**: số lượng cuộc họp theo tháng, phòng họp sử dụng nhiều nhất, người tổ chức nhiều cuộc họp nhất.

## Cấu trúc thư mục

```
HTDatLichHocXYZ-Nhom5/
├── Administrator.html   # Cấu trúc giao diện và JavaScript xử lý logic
└── style.css             # Toàn bộ định dạng giao diện (layout, màu sắc, bảng, biểu đồ, modal)
```

## Cách chạy

Không cần cài đặt gì thêm, chỉ cần trình duyệt (Chrome/Edge/Firefox):

1. Tải 2 file `Administrator.html` và `style.css` về cùng một thư mục (hoặc clone cả repo này).
2. Mở file `Administrator.html` bằng trình duyệt.

```bash
git clone https://github.com/giahuy123-vanlang/HTDatLichHocXYZ-Nhom5.git
cd HTDatLichHocXYZ-Nhom5
# mở Administrator.html bằng trình duyệt
```

## Lưu ý

Đây là bản **demo giao diện** (HTML/CSS/JavaScript thuần), dữ liệu tài khoản và số liệu Dashboard là dữ liệu giả lập (mock data) khai báo sẵn trong `Administrator.html`, chưa kết nối cơ sở dữ liệu/backend thật