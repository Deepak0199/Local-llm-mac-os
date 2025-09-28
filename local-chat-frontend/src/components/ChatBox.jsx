
// local-chat-frontend/src/components/ChatBox.jsx
import React, { useState, useEffect, useRef } from "react";

const ChatBox = ({ messages, onSend }) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (input.trim() === "") return;
    onSend(input.trim());
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col flex-1 border rounded-lg overflow-hidden shadow-sm bg-gray-50">
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[70%] p-3 rounded-2xl shadow-md break-words
                ${m.role === "user" ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" : "bg-white text-gray-900 border border-gray-200"}`}
            >
              {m.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex border-t border-gray-300 p-2 bg-white">
        <input
          type="text"
          className="flex-1 border rounded-l-2xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 rounded-r-2xl font-semibold"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;

