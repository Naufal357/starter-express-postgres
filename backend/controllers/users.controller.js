const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");

// Protected CRUD Users
const getAllUsers = async (req, res, next) => {
	try {
		const { rows } = await pool.query("SELECT * FROM users ORDER BY id");
		res.json(rows);
	} catch (err) {
		next(err);
	}
};

const createUser = async (req, res, next) => {
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

		res.status(201).send(`User registered ${username}`);
	} catch (err) {
		next(err);
	}
};

const updateUser = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { name, email } = req.body;
		const { rows } = await pool.query(
			"UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email",
			[name, email, id]
		);
		res.json(rows[0]);
	} catch (err) {
		next(err);
	}
};

const deleteUser = async (req, res, next) => {
	try {
		const { id } = req.params;
		await pool.query("DELETE FROM users WHERE id = $1", [id]);
		res.sendStatus(204);
	} catch (err) {
		next(err);
	}
};

module.exports = {
	getAllUsers,
	createUser,
	updateUser,
	deleteUser,
};