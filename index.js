import express from "express";
import swaggerUI from "swagger-ui-express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { authRoutes } from "./routes/auth.js";

const app = express();
app.use(cors());
dotenv.config();
const port = process.env.PORT || 5000;
app.use(express.json());

mongoose
	.connect(process.env.MONGO_DB_URI)
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.error("Error with MongoDB Connection", err));

app.use("/auth", authRoutes);
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
