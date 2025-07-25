import { useEffect, useState } from "react";
import IdentitySelector from "./IdentitySelector";
import { db } from "../firebase";
import { ref, onValue, set } from "firebase/database";

interface Message {
  sender: "user" | "bot";
  text: string;
}

interface Identity {
  name: string;
  description: string;
  prompt: string;
}

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const sessionId = "test-user"; // da sostituire con login in futuro

  useEffect(() => {
    const saved = localStorage.getItem("iddi_identity");
    if (saved) {
      const identity = JSON.parse(saved);
      setIdentity(identity);
    }

    const msgRef = ref(db, `sessions/${sessionId}/messages`);
    onValue(msgRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMessages(data as Message[]);
      }
    });
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || !identity) return;

    const newMessages: Message[] = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: newMessages.map(m => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text
          })),
          prompt: identity.prompt
        }),
      });

      const data = await res.json();
      const updatedMessages: Message[] = [...newMessages, { sender: "bot", text: data.reply }];
      setMessages(updatedMessages);
      set(ref(db, `sessions/${sessionId}/messages`), updatedMessages);
    } catch (err) {
      const fallback: Message[] = [...newMessages, { sender: "bot", text: "Errore nella comunicazione." }];
      setMessages(fallback);
    }

    setLoading(false);
  };

  return (
    <>
      <IdentitySelector onSelect={setIdentity} />
      {identity && (
        <div className="w-full max-w-2xl bg-white border rounded-xl p-4 shadow mx-auto mt-6">
          <div className="h-80 overflow-y-auto mb-4 space-y-2">
            {messages.map((msg, i) => (
              <div key={i} className={msg.sender === "user" ? "text-right" : "text-left"}>
                <span
                  className={`inline-block px-4 py-2 rounded-xl ${
                    msg.sender === "user"
                      ? "bg-blue-100 text-blue-900"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            {loading && <div className="text-gray-400">Sto riflettendo…</div>}
          </div>
          <div className="flex">
            <input
              className="flex-1 border rounded-l-xl px-4 py-2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Scrivi qualcosa..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-xl"
              disabled={loading}
            >
              Invia
            </button>
          </div>
        </div>
      )}
    </>
  );
}
