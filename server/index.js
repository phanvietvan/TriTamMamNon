const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Path to data file
const dataFilePath = path.join(__dirname, 'registrations.json');

// Ensure data file exists
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify([]));
}

// API Routes
app.post('/api/register', (req, res) => {
  try {
    const { parentName, phone, childAge, note } = req.body;

    // Simple validation
    if (!parentName || !phone) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ Tên và Số điện thoại' });
    }

    // Read existing data
    const fileData = fs.readFileSync(dataFilePath, 'utf-8');
    const registrations = JSON.parse(fileData);

    // Create new record
    const newRegistration = {
      id: Date.now().toString(),
      parentName,
      phone,
      childAge: childAge || 'Không rõ',
      note: note || '',
      registeredAt: new Date().toISOString()
    };

    // Save data
    registrations.push(newRegistration);
    fs.writeFileSync(dataFilePath, JSON.stringify(registrations, null, 2));

    // Simulate network delay for frontend animation
    setTimeout(() => {
      res.status(201).json({ message: 'Đăng ký thành công!', data: newRegistration });
    }, 1000);

  } catch (error) {
    console.error('Error saving registration:', error);
    res.status(500).json({ error: 'Lỗi server, vui lòng thử lại sau.' });
  }
});

app.get('/api/registrations', (req, res) => {
  try {
    const fileData = fs.readFileSync(dataFilePath, 'utf-8');
    const registrations = JSON.parse(fileData);
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
