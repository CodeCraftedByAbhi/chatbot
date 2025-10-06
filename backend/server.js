import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { loadManager } from "./nlp/manager.js";
import nlpRoutes from "./routes/nlpRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

await mongoose.connect(process.env.MONGODB_URI);

const manager = await loadManager();

app.use("/api/nlp", nlpRoutes(manager));
app.use("/api/messages", messageRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
