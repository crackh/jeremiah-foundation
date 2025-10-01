"use client";

import { useEffect, useState } from "react";

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
};

export default function ContactMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");

  const fetchMessages = async () => {
    const res = await fetch("/api/admin/contact_messages");
    const data = await res.json();
    setMessages(data);
  };

  const sendReply = async (id: string) => {
    await fetch("/api/admin/contact_messages/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, reply }),
    });
    setReply("");
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Contact Messages</h1>
      {messages.map((m) => (
        <div key={m.id} className="p-2 border-b">
          <h3 className="font-bold">{m.name} - {m.email}</h3>
          <p>{m.message}</p>
          <input
            placeholder="Reply"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="p-1 border rounded w-full my-1"
          />
          <button onClick={() => sendReply(m.id)} className="bg-green-600 text-white p-1 rounded">
            Send Reply
          </button>
        </div>
      ))}
    </div>
  );
}
