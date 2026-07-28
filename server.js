const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 1. Kết nối cơ sở dữ liệu MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/xyz_scheduler', {
  serverSelectionTimeoutMS: 5000
})
  .then(() => console.log('Đã kết nối MongoDB thành công!'))
  .catch(err => console.error('Lỗi kết nối MongoDB:', err));

// 2. Cấu trúc dữ liệu Người dùng
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String },
  role: { type: String, enum: ['Employee', 'Meeting Manager', 'Administrator'], default: 'Employee' },
  status: { type: String, enum: ['on', 'off'], default: 'on' },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// Khởi tạo tài khoản dữ liệu mẫu nếu chưa tồn tại
async function seedData() {
  const count = await User.countDocuments();

  if (count === 0) {

    const users = [
      {
        name: "Super Admin",
        email: "admin@xyzcorp.vn",
        department: "Ban Giám đốc",
        role: "Administrator",
        password: await bcrypt.hash("admin123",10)
      },

      {
        name: "Nguyễn Văn An",
        email: "manager@xyzcorp.vn",
        department: "Phòng CNTT",
        role: "Meeting Manager",
        password: await bcrypt.hash("manager123",10)
      },

      {
        name: "Trần Thị Bình",
        email: "employee1@xyzcorp.vn",
        department: "Marketing",
        role: "Employee",
        password: await bcrypt.hash("employee123",10)
      },

      {
        name: "Lê Quốc Huy",
        email: "employee2@xyzcorp.vn",
        department: "Kinh doanh",
        role: "Employee",
        password: await bcrypt.hash("employee123",10)
      },

      {
        name: "Phạm Minh Khoa",
        email: "employee3@xyzcorp.vn",
        department: "Nhân sự",
        role: "Employee",
        password: await bcrypt.hash("employee123",10)
      }
    ];

    await User.insertMany(users);

    console.log("Đã tạo dữ liệu mẫu.");
  }
}
seedData();

// Dữ liệu Phòng họp và Lịch đặt phòng động
let mockRooms = [
{
    id:"R1",
    name:"Phòng Họp A (Lớn)",
    capacity:20,
    status:"Đang sử dụng",
    organizer:"Nguyễn Văn An"
},
{
    id:"R2",
    name:"Phòng Họp B (Vừa)",
    capacity:10,
    status:"Trống",
    organizer:"---"
},
{
    id:"R3",
    name:"Phòng Họp C (Nhỏ)",
    capacity:5,
    status:"Trống",
    organizer:"---"
}
];

const now = new Date();

let mockMeetings = [
  // Đã kết thúc (hôm qua)
  {
    id: 1,
    title: "Họp kế hoạch Quý III",
    organizer: "Nguyễn Văn An",
    room: "Phòng Họp A (Lớn)",
    startTime: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(now.getTime() - 23 * 60 * 60 * 1000).toISOString()
  },

  // Đang diễn ra (bắt đầu 30 phút trước, kết thúc sau 1 giờ)
  {
    id: 2,
    title: "Demo sản phẩm mới",
    organizer: "Trần Thị Bình",
    room: "Phòng Họp B (Vừa)",
    startTime: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
    endTime: new Date(now.getTime() + 60 * 60 * 1000).toISOString()
  },

  // Sắp diễn ra (2 giờ nữa)
  {
    id: 3,
    title: "Phỏng vấn ứng viên",
    organizer: "Phạm Minh Khoa",
    room: "Phòng Họp C (Nhỏ)",
    startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString()
  }
];

// 3. API AUTH
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Tài khoản không tồn tại.' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Mật khẩu không chính xác.' });
    res.json({ user: { name: user.name, email: user.email, role: user.role, department: user.department } });
  } catch (error) { res.status(500).json({ error: 'Lỗi hệ thống.' }); }
});

// 4. API TÀI KHOẢN (Chỉ Admin truy cập)
app.get('/api/users', async (req, res) => {
  if (req.headers['x-user-role'] !== 'Administrator') return res.status(403).json({ error: 'Từ chối truy cập!' });
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

app.post('/api/users', async (req, res) => {
  if (req.headers['x-user-role'] !== 'Administrator') return res.status(403).json({ error: 'Từ chối truy cập!' });
  const { name, email, department, role, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, department, role, password: hashedPassword });
    res.status(201).json({ message: 'Tạo tài khoản thành công!' });
  } catch (error) { res.status(400).json({ error: 'Email đã tồn tại.' }); }
});

app.put('/api/users/:id', async (req, res) => {
  if (req.headers['x-user-role'] !== 'Administrator') return res.status(403).json({ error: 'Từ chối truy cập!' });
  const { name, department, role } = req.body;
  await User.findByIdAndUpdate(req.params.id, { name, department, role });
  res.json({ message: 'Cập nhật thành công!' });
});

app.delete('/api/users/:id', async (req, res) => {
  if (req.headers['x-user-role'] !== 'Administrator') return res.status(403).json({ error: 'Từ chối truy cập!' });
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Đã xóa tài khoản!' });
});

// 5. API ĐẶT PHÒNG HỌP & LỊCH HỌP
app.get('/api/rooms', (req, res) => res.json(mockRooms));

app.get('/api/meetings', (req, res) => {
  if (req.headers['x-user-role'] !== 'Administrator' && req.headers['x-user-role'] !== 'Meeting Manager') {
    return res.status(403).json({ error: 'Không có quyền xem lịch họp.' });
  }
  res.json(mockMeetings);
});

app.post('/api/meetings', (req, res) => {
  const { title, roomName, startTime, endTime, organizer } = req.body;
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (start >= end) return res.status(400).json({ error: 'Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc!' });

  const isOverlapped = mockMeetings.some(m => {
    if (m.room !== roomName) return false;
    return (start < new Date(m.endTime) && end > new Date(m.startTime));
  });

  if (isOverlapped) return res.status(400).json({ error: 'Khung giờ này đã có người đăng ký!' });

  const newMeeting = { id: Date.now(), title, organizer, room: roomName, startTime, endTime };
  mockMeetings.push(newMeeting);

  // Kiểm tra nếu thời gian đặt bao gồm cả thời điểm hiện tại thì đổi màu luôn
  const now = new Date();
  if (now >= start && now <= end) {
    const roomIndex = mockRooms.findIndex(r => r.name === roomName);
    if (roomIndex !== -1) {
      mockRooms[roomIndex].status = "Đang sử dụng";
      mockRooms[roomIndex].organizer = organizer;
    }
  }

  res.status(201).json({ message: 'Đặt phòng thành công!' });
});

// API MỚI: XÁC NHẬN KẾT THÚC SỚM (GIẢI PHÓNG PHÒNG LẬP TỨC)
app.post('/api/meetings/:id/finish', (req, res) => {
  const userRole = req.headers['x-user-role'];
  if (userRole !== 'Administrator' && userRole !== 'Meeting Manager') {
    return res.status(403).json({ error: 'Chỉ Admin hoặc Quản lý mới được duyệt kết thúc sớm!' });
  }

  const meetingId = parseInt(req.params.id);
  const meetingIndex = mockMeetings.findIndex(m => m.id === meetingId);

  if (meetingIndex === -1) return res.status(404).json({ error: 'Không tìm thấy cuộc họp này.' });

  const meeting = mockMeetings[meetingIndex];

  // 1. Cập nhật trạng thái phòng họp tương ứng sang Trống ngay lập tức
  const roomIndex = mockRooms.findIndex(r => r.name === meeting.room);
  if (roomIndex !== -1) {
    mockRooms[roomIndex].status = "Trống";
    mockRooms[roomIndex].organizer = "---";
  }

  // 2. Cập nhật mốc thời gian endTime của cuộc họp về thời điểm hiện tại để lưu lịch sử
  mockMeetings[meetingIndex].endTime = new Date().toISOString();

  res.json({ message: 'Đã xác nhận kết thúc sớm. Phòng họp đã được giải phóng sang trạng thái trống!' });
});

// Hàm quét tự động ngầm cập nhật trạng thái theo thời gian thực
setInterval(() => {
  const now = new Date();
  mockRooms.forEach(room => {
    const activeMeeting = mockMeetings.find(m => {
      if (m.room !== room.name) return false;
      return (now >= new Date(m.startTime) && now <= new Date(m.endTime));
    });

    if (activeMeeting) {
      room.status = "Đang sử dụng";
      room.organizer = activeMeeting.organizer;
    } else {
      room.status = "Trống";
      room.organizer = "---";
    }
  });
}, 5000);

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Hệ thống chạy tại http://localhost:${PORT}`));