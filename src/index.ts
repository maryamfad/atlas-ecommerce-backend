import express, { Application } from "express";
import swaggerUI from "swagger-ui-express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { authRoutes } from "./routes/auth";

const env: string = process.env.NODE_ENV || "development";
const uri_tail: string = env === "test" ? "-test" : "";

const app: Application = express();
app.use(cors());
dotenv.config();
const port: string | number = process.env.PORT || 5000;
app.use(express.json());

mongoose
	.connect(process.env.MONGO_DB_URI + uri_tail, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	} as mongoose.ConnectOptions)
	.then(() => console.log("MongoDB connected"))
	.catch((err: Error) => console.error("Error with MongoDB Connection", err));

app.use("/auth", authRoutes);
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

export default app;
