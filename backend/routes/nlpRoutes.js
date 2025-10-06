import express from "express";
import Message from "../models/Message.js";

export default function nlpRoutes(manager) {
  const router = express.Router();

  router.post("/process", async (req, res) => {
    try {
      const { text } = req.body;

      if (!text) return res.status(400).json({ error: "text is required" });

      const nlp = await manager.process("en", text);

      const getEntity = (name) =>
        nlp.entities?.find((e) => e.entity === name)?.sourceText || null;

      let followup = null;
      if (nlp.intent === "user.setName" && !getEntity("name")) {
        followup = "What's your name?";
      } else if (nlp.intent === "user.setEmail" && !getEntity("email")) {
        followup = "Please share your email (like name@example.com).";
      } else if (nlp.intent === "calendar.create" && !getEntity("date")) {
        followup = "On which date should I schedule it?";
      }

      const THRESHOLD = 0.6;
      const answer =
        nlp.score >= THRESHOLD && nlp.answer
          ? nlp.answer
          : "Hmm, not sure I got that. Could you rephrase?";

      await Message.create({
        role: "user",
        text,
        intent: nlp.intent,
        score: nlp.score,
        entities: nlp.entities,
        sentiment: nlp.sentiment,
      });

      await Message.create({
        role: "assistant",
        text: followup || answer,
      });

      res.json({
        answer: followup || answer,
        intent: nlp.intent,
        score: nlp.score,
        entities: nlp.entities,
        sentiment: nlp.sentiment,
      });
    } catch (error) {
      res.status(500).json({ error: "processing_failed" });
    }
  });

  router.get("/history", async (_req, res) => {
    const last50 = (await Message.find())
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json(last50.reverse());
  });

  return router;
}
