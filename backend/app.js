const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

// Konfigurasi koneksi PostgreSQL (sesuaikan dengan environment di compose)
const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
});

// CRUD Endpoints
app.get("/users", async (req, res) => {
    const { rows } = await pool.query("SELECT * FROM users ORDER BY id");
    res.json(rows);
});

app.post("/users", async (req, res) => {
    const { username, name, email, password } = req.body;
    if (!username || !name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    const { rows } = await pool.query(
        "INSERT INTO users (username, name, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
        [username, name, email, password]
    );
    res.status(201).json({ message: "User created", user: rows[0] });
});

app.put("/users/:id", async (req, res) => {
    const { id } = req.params;
    const { username, name, email, password } = req.body;
    if (!username || !name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    const { rows } = await pool.query(
        "UPDATE users SET username = $1, name = $2, email = $3, password = $4 WHERE id = $5 RETURNING *",
        [username, name, email, password, id]
    );
    res.status(200).json({ message: "User updated", user: rows[0] });
});

app.delete("/users/:id", async (req, res) => {
    const { id } = req.params;
    const { rows } = await pool.query(
        "DELETE FROM users WHERE id = $1 RETURNING *",
        [id]
    );
    if (rows.length === 0) {
        return res.status(404).json({ error: "User not found with id: " + id });
    }
    res.status(200).json({ message: "User deleted", user: rows[0] });
});

app.listen(3000, () => {
	console.log("Server running on port 3000");
});
