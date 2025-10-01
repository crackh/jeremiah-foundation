"use client";

import { useEffect, useState } from "react";

type Program = {
  id: string;
  name: string;
  description: string;
};

export default function Programs() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchPrograms = async () => {
    const res = await fetch("/api/admin/programs");
    const data = await res.json();
    setPrograms(data);
  };

  const addProgram = async () => {
    await fetch("/api/admin/programs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    setName("");
    setDescription("");
    fetchPrograms();
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Programs</h1>
      <div className="mb-4 space-y-2">
        <input
          placeholder="Program Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <button onClick={addProgram} className="bg-blue-600 text-white p-2 rounded">
          Add Program
        </button>
      </div>
      <div>
        {programs.map((p) => (
          <div key={p.id} className="p-2 border-b">
            <h3 className="font-bold">{p.name}</h3>
            <p>{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
