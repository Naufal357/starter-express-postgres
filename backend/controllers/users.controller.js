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
			"INSERT INTO users (username, password, name, email, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())",
			[username, hashedPassword, name, email]
		);

		res.status(201).send(`User registered as ${username}`);
	} catch (err) {
		next(err);
	}
};

const updateUser = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { name, username, email, password, newPassword } = req.body;

		if (!name || !username || !email || !password) {
			return res.status(400).send("All fields are required");
		}

		const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
			id,
		]);
		const user = rows[0];

		const validPassword = await bcrypt.compare(password, user.password);

		if (!validPassword) {
			return res.status(401).send("Password is incorrect");
		}

		if (newPassword) {
			const hashedPassword = await bcrypt.hash(newPassword, 10);
			await pool.query("UPDATE users SET password = $1 WHERE username = $2", [
				hashedPassword,
				username,
			]);
		}

		await pool.query(
			"UPDATE users SET name = $1, username = $2, email = $3, updated_at = NOW() WHERE id = $4",
			[name, username, email, id]
		);

		const updatedUser = await pool.query("SELECT * FROM users WHERE id = $1", [
			id,
		]);

		res.json(updatedUser.rows[0]);
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