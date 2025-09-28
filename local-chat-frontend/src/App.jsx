
// local-chat-frontend/src/App.jsx
import React, { useState } from "react";
import ChatBox from "./components/ChatBox.jsx";
import FileUploader from "./components/FileUploader.jsx";

function App() {
  const [messages, setMessages] = useState([]);

  const sendMessage = async (prompt) => {
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);
    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Error connecting to backend" }]);
    }
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const text = data.text || data.note || "File uploaded successfully";
      setMessages((prev) => [...prev, { role: "assistant", content: text }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Error uploading file" }]);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto border rounded-xl shadow-lg bg-gray-100">
      <header className="bg-blue-600 text-white p-4 text-xl font-semibold rounded-t-xl">
        Local Chat Assistant
      </header>

      <main className="flex flex-col flex-1 p-4 space-y-4 overflow-hidden">
        <FileUploader onUpload={handleFileUpload} />
        <ChatBox messages={messages} onSend={sendMessage} />
      </main>
    </div>
  );
}

export default App;

