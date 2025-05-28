const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/auth");
const {
	getAllUsers,
	createUser,
	updateUser,
	deleteUser,
} = require("../controllers/users.controller");

router.get("/", authenticate, getAllUsers);
router.post("/", authenticate, createUser);
router.put("/:id", authenticate, updateUser);
router.delete("/:id", authenticate, deleteUser);

module.exports = router;
