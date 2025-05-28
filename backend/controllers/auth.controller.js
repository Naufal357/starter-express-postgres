const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async (req, res, next) => {
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
		next(err);
	}
};

const login = async (req, res, next) => {
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
		const validPassword = await bcrypt.compare(password, user.password);

		if (!validPassword) {
			return res.status(401).send("Password is incorrect");
		}

		const accessToken = jwt.sign(
			{ sub: user.id, username: user.username },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		res.json({ accessToken, expiresIn: 3600 });
	} catch (err) {
		next(err);
	}
};

module.exports = { register, login };
