"use client";

import { useEffect, useState } from "react";

type Volunteer = {
  id: string;
  name: string;
  email: string;
  message: string;
};

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [reply, setReply] = useState("");

  const fetchVolunteers = async () => {
    const res = await fetch("/api/admin/volunteers");
    const data = await res.json();
    setVolunteers(data);
  };

  const sendReply = async (id: string) => {
    await fetch(`/api/admin/volunteers/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, reply }),
    });
    setReply("");
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Volunteers</h1>
      {volunteers.map((v) => (
        <div key={v.id} className="p-2 border-b">
          <h3 className="font-bold">{v.name} - {v.email}</h3>
          <p>{v.message}</p>
          <input
            placeholder="Reply"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="p-1 border rounded w-full my-1"
          />
          <button onClick={() => sendReply(v.id)} className="bg-green-600 text-white p-1 rounded">
            Send Reply
          </button>
        </div>
      ))}
    </div>
  );
}
