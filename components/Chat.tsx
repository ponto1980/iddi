import { useState, useEffect, useRef } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Ciao! Sono iddi. Inizia a parlare con me." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      const botMessage = { sender: "bot", text: data.reply };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: "bot", text: "Errore nel recupero risposta." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") sendMessage();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
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
          {loading && (
            <div className="text-left">
              <span className="inline-block px-4 py-2 rounded-xl bg-gray-100 text-gray-500">Sto pensando...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border rounded-l-xl px-4 py-2"
            placeholder="Scrivi qui..."
          />
          <button onClick={sendMessage} className="bg-black text-white px-4 py-2 rounded-r-xl">
            Invia
          </button>
        </div>
      </div>
    </>
  );
}
