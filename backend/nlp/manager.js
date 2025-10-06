import { NlpManager, NlpUtil } from "node-nlp";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const MODEL_PATH = process.env.MODEL_PATH || "./model.nlp";

NlpUtil.useDuckling = false;

export async function loadManager() {
  const manager = new NlpManager({ languages: [], forceNER: true });
  manager.addLanguage("en");

  manager.addRegexEntity(
    "email",
    "en",
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,})/g
  );
  manager.addRegexEntity(
    "date",
    "en",
    /\b(?:today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday|(?:\d{1,2}\/\d{1,2}(?:\/\d{2,4})?))\b/gi
  );

  manager.addNamedEntityText("name", "abhishek", ["en"], ["abhishek", "abhi"]);

  manager.addDocument("en", "hello", "greetings.hello");
  manager.addDocument("en", "hi", "greetings.hello");
  manager.addDocument("en", "hey", "greetings.hello");

  manager.addDocument("en", "bye", "greetings.bye");
  manager.addDocument("en", "goodbye", "greetings.bye");
  manager.addDocument("en", "see you later", "greetings.bye");

  manager.addDocument("en", "who are you", "bot.name");
  manager.addDocument("en", "what is your name", "bot.name");

  manager.addDocument("en", "my name is %name%", "user.setName");
  manager.addDocument("en", "I'm %name%", "user.setName");
  manager.addDocument("en", "call me %name%", "user.setName");

  manager.addDocument("en", "schedule a meeting on %date%", "calendar.create");
  manager.addDocument("en", "meet me %date%", "calendar.create");

  manager.addDocument("en", "email me at %email%", "user.setEmail");
  manager.addDocument("en", "my email is %email%", "user.setEmail");

  manager.addDocument("en", "I love this", "sentiment.example");
  manager.addDocument("en", "this is awful", "sentiment.example");

  manager.addAnswer("en", "greetings.hello", "Hello! How can I help you?");
  manager.addAnswer("en", "greetings.bye", "Goodbye! Have a great day!");
  manager.addAnswer(
    "en",
    "bot.name",
    "I am your NLP chatbot built with Node.js!"
  );
  manager.addAnswer("en", "calendar.create", "Got it. I’ll note that date.");
  manager.addAnswer("en", "user.setEmail", "Thanks! I saved your email.");

  if (fs.existsSync(MODEL_PATH)) {
    manager.load(MODEL_PATH);
  } else {
    await manager.train();
    manager.save(MODEL_PATH);
  }
  return manager;
}
