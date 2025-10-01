"use client";

import { useEffect, useState } from "react";

type Achievement = {
  id: string;
  title: string;
  description: string;
};

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/achievements");
      const data = await res.json();
      setAchievements(data);
    } catch (err) {
      console.error("Error fetching achievements:", err);
    } finally {
      setLoading(false);
    }
  };

  const addAchievement = async () => {
    if (!title || !description) return alert("Title and description are required!");
    setLoading(true);
    try {
      await fetch("/api/admin/achievements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      setTitle("");
      setDescription("");
      fetchAchievements();
    } catch (err) {
      console.error("Error adding achievement:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteAchievement = async (id: string) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/achievements/${id}`, { method: "DELETE" });
      fetchAchievements();
    } catch (err) {
      console.error("Error deleting achievement:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Achievements</h1>

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
          onClick={addAchievement}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Achievement"}
        </button>
      </div>

      <div className="space-y-3">
        {loading && <p>Loading achievements...</p>}
        {achievements.map((ach) => (
          <div key={ach.id} className="p-3 border rounded flex justify-between items-start">
            <div>
              <h3 className="font-bold">{ach.title}</h3>
              <p>{ach.description}</p>
            </div>
            <button
              onClick={() => deleteAchievement(ach.id)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
