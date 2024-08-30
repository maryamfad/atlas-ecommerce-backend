import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

const blacklist = new Set();
const addToBlacklist = (token) => {
	blacklist.add(token);
};
const isBlacklisted = (token) => {
	return blacklist.has(token);
};
const JWT_SECRET = process.env.JWT_SECRET;
/**
 *@swagger
 *   /auth/signup:
 *     post:
 *       summary: Create a new user
 *       tags:
 *         - Authentication
 *       requestBody:
 *         description: User object that needs to be added
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: johndoe
 *                 email:
 *                   type: string
 *                   example: johndoe@test.com
 *                 password:
 *                   type: string
 *                   example: password123
 *       responses:
 *         '200':
 *           description: User successfully created
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                     example: testuser100
 *                   password:
 *                     type: string
 *                     example: testpassword100
 *                  
 *         '400':
 *           description: Invalid input
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Error message
 */
router.post("/signup", async (req, res) => {
	const { username, email, password } = req.body;
	try {
		const newUser = new User({
			username,
			email,
			password,
			role: 'customer',
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		await newUser.save();
		res.status(200).json(newUser);
	} catch (err) {
		res.status(400).json({ error: "Invalid Input" });
	}
});

/**
 * @swagger
 *  paths:
 *   /auth/login:
 *     post:
 *       summary: Login a user
 *       tags:
 *        - Authentication
 *       requestBody:
 *         description: User credentials
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: testuser0
 *                 password:
 *                   type: string
 *                   example: testpassword0
 *       responses:
 *         '200':
 *           description: User successfully logged in
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   token:
 *                     type: string
 *                     example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *         '400':
 *           description: Invalid credentials
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Invalid credentials
 */

router.post("/login", async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await User.findOne({ username });
		if (!user) throw new Error("Invalid credentials");
		const isMatch = await user.comparePassword(password);
		if (!isMatch) throw new Error("Invalid credentials");
		const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
			expiresIn: "1h",
		});

		res.json({ token });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

const authMiddleware = (req, res, next) => {
	const token = req.header("Authorization")?.replace("Bearer ", "");
	if (!token) return res.status(401).json({ error: "unauthorized request" });
	if (isBlacklisted(token)) {
		return res.sendStatus(402).json({ error: "already blacklisted token" });
	}
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		res.status(403).json({ error: "invalid token" });
	}
};

/**
 * @swagger
 *  paths:
 *   /auth/logout:
 *     post:
 *       summary: Logout a user
 *       security:
 *         - BearerAuth: []
 *       tags:
 *        - Authentication
 *
 *
 *       responses:
 *         '200':
 *           description: User successfully logged out
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   token:
 *                     type: string
 *                     example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *         '400':
 *           description: Logout wasn't successful
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: logout was not successful
 */

router.post("/logout", authMiddleware, (req, res) => {
	try {
		const token = req.header("Authorization")?.replace("Bearer ", "");
		// blacklist.add(token);
		addToBlacklist(token);
		res.status(200).send("Logged out successfully");
	} catch (error) {
		res.status(400).send(error.message);
	}
});

export {
	router as authRoutes,
	authMiddleware,
	isBlacklisted,
	addToBlacklist,
	blacklist,
};
