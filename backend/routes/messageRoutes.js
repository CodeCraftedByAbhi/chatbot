import express from "express";
import Message from "../models/Message.js";
const router = express.Router();

router.get("/", async (_req, res) => {
  const msgs = await Message.find().sort({ createdAt: 1 }).lean();
  res.json(msgs);
});

export default router;
