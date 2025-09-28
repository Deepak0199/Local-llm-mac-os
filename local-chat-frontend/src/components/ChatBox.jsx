import React, { useState } from "react";

const ChatBox = ({ messages, onSend }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div className="mt-4 border p-4 rounded-md h-[400px] overflow-y-auto flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {messages.map((m, idx) => (
          <div key={idx} className={m.role === "user" ? "text-right mb-2" : "text-left mb-2"}>
            <div className={m.role === "user" ? "inline-block bg-blue-200 p-2 rounded" : "inline-block bg-gray-200 p-2 rounded"}>
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex">
        <input
          type="text"
          className="border p-2 flex-1 rounded-l"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="bg-blue-500 text-white p-2 rounded-r" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
