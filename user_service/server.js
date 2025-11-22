const express = require('express');
const app = express();
const PORT = 4000;

// Middleware untuk membaca JSON body
app.use(express.json());

// Dummy data user
let users = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "customer" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "seller" },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "admin" }
];

// ✅ 1. List User
app.get('/users', (req, res) => {
  res.json(users);
});

// ✅ 2. Detail User berdasarkan ID
app.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

// ✅ 3. Tambah User
app.post('/users', (req, res) => {
  const { name, email, role } = req.body;

  // Validasi sederhana
  if (!name || !email || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    role
  };

  users.push(newUser);

  res.status(201).json(newUser);
});

// ✅ Jalankan server
app.listen(PORT, () => {
  console.log(`✅ User Service running at http://localhost:${PORT}`);
});
