"use client";

import { useEffect, useState } from "react";

type Challenge = {
  id: string;
  title: string;
  description: string;
};

export default function Challenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/challenges");
      const data = await res.json();
      setChallenges(data);
    } catch (err) {
      console.error("Error fetching challenges:", err);
    } finally {
      setLoading(false);
    }
  };

  const addChallenge = async () => {
    if (!title || !description) return alert("Title and description are required!");
    setLoading(true);
    try {
      if (editingId) {
        // Update existing challenge
        await fetch(`/api/admin/challenges/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description }),
        });
        setEditingId(null);
      } else {
        // Add new challenge
        await fetch("/api/admin/challenges", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description }),
        });
      }
      setTitle("");
      setDescription("");
      fetchChallenges();
    } catch (err) {
      console.error("Error adding/updating challenge:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteChallenge = async (id: string) => {
    if (!confirm("Are you sure you want to delete this challenge?")) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/challenges/${id}`, { method: "DELETE" });
      fetchChallenges();
    } catch (err) {
      console.error("Error deleting challenge:", err);
    } finally {
      setLoading(false);
    }
  };

  const editChallenge = (challenge: Challenge) => {
    setEditingId(challenge.id);
    setTitle(challenge.title);
    setDescription(challenge.description);
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Challenges</h1>

      <div className="mb-6 space-y-2">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <button
          onClick={addChallenge}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? (editingId ? "Updating..." : "Adding...") : editingId ? "Update Challenge" : "Add Challenge"}
        </button>
      </div>

      <div className="space-y-3">
        {loading && <p>Loading challenges...</p>}
        {challenges.map((ch) => (
          <div key={ch.id} className="p-3 border rounded flex justify-between items-start">
            <div>
              <h3 className="font-bold">{ch.title}</h3>
              <p>{ch.description}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => editChallenge(ch)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => deleteChallenge(ch.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
