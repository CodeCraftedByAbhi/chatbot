import { useEffect, useRef, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(`${API_BASE}/api/nlp/history`);
      setMessages(data);
    })();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const userMsg = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_BASE}/api/nlp/process`, { text });
      const botMsg = { role: "assistant", text: data.answer };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Server error. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="mx-auto" style={{ maxWidth: 720 }}>
        <h3 className="mb-3">MERN + Node NLP Chatbot</h3>

        <div className="border rounded p-3 mb-3" style={{ height: 480, overflowY: "auto", background: "#fafafa" }}>
          {messages.map((m, i) => (
            <div key={i} className={`d-flex mb-2 ${m.role === "user" ? "justify-content-end" : ""}`}>
              <div className={`p-2 rounded ${m.role === "user" ? "bg-primary text-white" : "bg-light border"}`} style={{ maxWidth: "75%" }}>
                <div style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>
              </div>
            </div>
          ))}
          {loading && <div className="text-muted">Thinking…</div>}
          <div ref={endRef} />
        </div>

        <form onSubmit={sendMessage} className="d-flex gap-2">
          <input
            className="form-control"
            placeholder="Type a message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="btn btn-primary" disabled={loading || !input.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
