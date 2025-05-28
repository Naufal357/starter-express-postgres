const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware Auth
const authenticate = (req, res, next) => {
	try {
		const authHeader = req.headers["authorization"];
		const token = authHeader && authHeader.split(" ")[1];

		if (!token) {
			return res.status(401).send("Authentication token is missing");
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;

		next();
	} catch (err) {
		console.error("Error authenticating token:", err);
		res.status(403).send("Authentication failed");
	}
};

module.exports = authenticate;
