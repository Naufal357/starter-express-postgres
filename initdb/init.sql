-- Buat tabel users jika belum ada
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tambahkan admin default (password di-hash dengan bcryptjs)
INSERT INTO users (username, password, name, email)
VALUES (
  'admin',
  'admin123', -- password: admin123
  'Administrator',
  'admin@example.com'
)
ON CONFLICT (username) DO NOTHING; -- Hindari duplikasi