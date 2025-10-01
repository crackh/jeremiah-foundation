"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Volunteer = { id: string; name: string; email: string; message: string };
type Message = { id: string; name: string; email: string; message: string };

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    achievements: 0,
    programs: 0,
    challenges: 0,
    messages: 0,
    volunteers: 0,
    donations: 0,
    users: 0,
    totalDonationsAmount: 0,
  });

  const [latestVolunteers, setLatestVolunteers] = useState<Volunteer[]>([]);
  const [latestMessages, setLatestMessages] = useState<Message[]>([]);

  const fetchStats = async () => {
    const [
      achievements,
      programs,
      challenges,
      messages,
      volunteers,
      donations,
      users,
    ] = await Promise.all([
      supabase.from("achievements").select("*", { count: "exact" }),
      supabase.from("programs").select("*", { count: "exact" }),
      supabase.from("challenges").select("*", { count: "exact" }),
      supabase.from("contact_messages").select("*", { count: "exact" }),
      supabase.from("volunteers").select("*", { count: "exact" }),
      supabase.from("donations").select("amount", { count: "exact" }),
      supabase.from("users").select("*", { count: "exact" }),
    ]);

    const totalAmount = donations.data?.reduce((sum, d) => sum + (d.amount ?? 0), 0) ?? 0;

    setStats({
      achievements: achievements.count ?? 0,
      programs: programs.count ?? 0,
      challenges: challenges.count ?? 0,
      messages: messages.count ?? 0,
      volunteers: volunteers.count ?? 0,
      donations: donations.count ?? 0,
      users: users.count ?? 0,
      totalDonationsAmount: totalAmount,
    });
  };

  const fetchLatestData = async () => {
    const { data: latestVols } = await supabase
      .from("volunteers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3);
    setLatestVolunteers(latestVols ?? []);

    const { data: latestMsgs } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3);
    setLatestMessages(latestMsgs ?? []);
  };

  useEffect(() => {
    fetchStats();
    fetchLatestData();

    // Optionally, add real-time subscriptions here
  }, []);

  const cards = [
    {
      name: "Achievements",
      count: stats.achievements,
      href: "/admin/achievements",
      action: "Add New",
      actionHref: "/admin/achievements",
    },
    {
      name: "Programs",
      count: stats.programs,
      href: "/admin/programs",
      action: "Add New",
      actionHref: "/admin/programs",
    },
    {
      name: "Challenges",
      count: stats.challenges,
      href: "/admin/challenges",
      action: "Add New",
      actionHref: "/admin/challenges",
    },
    {
      name: "Messages",
      count: stats.messages,
      href: "/admin/contact_messages",
      action: "View All",
      actionHref: "/admin/contact_messages",
    },
    {
      name: "Volunteers",
      count: stats.volunteers,
      href: "/admin/volunteers",
      action: "View All",
      actionHref: "/admin/volunteers",
    },
    {
      name: "Donations",
      count: stats.donations,
      href: "/admin/donations",
      action: "View All",
      actionHref: "/admin/donations",
      extra: `Total UGX ${stats.totalDonationsAmount.toLocaleString()}`,
    },
    {
      name: "Users",
      count: stats.users,
      href: "/admin/users",
      action: "View All",
      actionHref: "/admin/users",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.name}
            className="card p-4 bg-white rounded shadow hover:bg-gray-100 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold">{card.name}</h2>
              <p className="text-gray-600 mt-1">{card.count} total</p>
              {card.extra && <p className="text-green-600 mt-1">{card.extra}</p>}
            </div>
            <Link
              href={card.actionHref}
              className="mt-3 inline-block bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-center"
            >
              {card.action}
            </Link>
          </div>
        ))}
      </div>

      {/* Latest Volunteers */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-2xl font-bold mb-2">Latest Volunteers</h2>
        {latestVolunteers.length === 0 ? (
          <p>No volunteers yet</p>
        ) : (
          <ul className="space-y-2">
            {latestVolunteers.map((v) => (
              <li key={v.id} className="border-b pb-1">
                <p className="font-semibold">{v.name} ({v.email})</p>
                <p className="text-gray-600">{v.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Latest Messages */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-2xl font-bold mb-2">Latest Contact Messages</h2>
        {latestMessages.length === 0 ? (
          <p>No messages yet</p>
        ) : (
          <ul className="space-y-2">
            {latestMessages.map((m) => (
              <li key={m.id} className="border-b pb-1">
                <p className="font-semibold">{m.name} ({m.email})</p>
                <p className="text-gray-600">{m.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
