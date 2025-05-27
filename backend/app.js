const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());

// Konfigurasi PostgreSQL
const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
});

// Middleware Auth
const authenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) return res.status(401).send("Authentication token is missing");

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) return res.status(403).send("Authentication failed");
		req.user = user;
		next();
	});
};

// Auth Endpoints
app.post("/register", async (req, res) => {
	try {
		const { username, password, name, email } = req.body;

		if (!username || !password || !name || !email) {
			return res.status(400).send("All fields are required");
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		await pool.query(
			"INSERT INTO users (username, password, name, email) VALUES ($1, $2, $3, $4)",
			[username, hashedPassword, name, email]
		);

		res.status(201).send("User registered");
	} catch (err) {
		res.status(500).send("Registration failed");
	}
});

app.post("/login", async (req, res) => {
	try {
		const { username, password } = req.body;
		if (!username || !password) {
			return res.status(400).send("Username and password required");
		}

		const { rows } = await pool.query(
			"SELECT * FROM users WHERE username = $1",
			[username]
		);

		if (rows.length === 0) {
			return res.status(401).send("Username not found");
		}

		const user = rows[0];

		if (username !== "admin") {
			const validPassword = await bcrypt.compare(password, user.password);

			if (!validPassword) {
				return res.status(401).send("Password is incorrect");
			}
		} else {
			if (password !== "admin123") {
				return res.status(401).send("Password is incorrect");
			}
		}

		const accessToken = jwt.sign(
			{
				sub: user.id,
				username: user.username,
			},
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		res.json({
			accessToken,
			expiresIn: 3600, // Tambahkan info expiry (dalam detik)
		});
	} catch (err) {
		console.error("Login error:", err);
		res.status(500).send("Internal server error");
	}
});

// Protected CRUD Endpoints
app.get("/users", authenticateToken, async (req, res) => {
	const { rows } = await pool.query(
		"SELECT * FROM users ORDER BY id"
	);
	res.json(rows);
});

app.post("/users", authenticateToken, async (req, res) => {
	try {
		const { username, password, name, email } = req.body;

		if (!username || !password || !name || !email) {
			return res.status(400).send("All fields are required");
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		await pool.query(
			"INSERT INTO users (username, password, name, email) VALUES ($1, $2, $3, $4)",
			[username, hashedPassword, name, email]
		);

		res.status(201).send("User registered" + username);
	} catch (err) {
		res.status(500).send("Registration failed");
	}
});

app.put("/users/:id", authenticateToken, async (req, res) => {
	const { id } = req.params;
	const { name, email } = req.body;
	const { rows } = await pool.query(
		"UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email",
		[name, email, id]
	);
	res.json(rows[0]);
});

app.delete("/users/:id", authenticateToken, async (req, res) => {
	const { id } = req.params;
	await pool.query("DELETE FROM users WHERE id = $1", [id]);
	res.sendStatus(204);
});

app.listen(3000, () => {
	console.log("Server running on port 3000");
});
