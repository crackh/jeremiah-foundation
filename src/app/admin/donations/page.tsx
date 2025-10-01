"use client";

import { useEffect, useState } from "react";

type Donation = {
  id: string;
  donor_name: string;
  amount: number;
  date: string;
  volunteer?: string;
};

export default function Donations() {
  const [donations, setDonations] = useState<Donation[]>([]);

  const fetchDonations = async () => {
    const res = await fetch("/api/admin/donations");
    const data = await res.json();
    setDonations(data);
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const total = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Donations</h1>
      <p className="mb-4 font-bold">Total Donations: UGX {total}</p>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="border-b bg-gray-200">
              <th className="p-2">Donor Name</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Date</th>
              <th className="p-2">Volunteer</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((d) => (
              <tr key={d.id} className="border-b">
                <td className="p-2">{d.donor_name}</td>
                <td className="p-2">{d.amount}</td>
                <td className="p-2">{new Date(d.date).toLocaleDateString()}</td>
                <td className="p-2">{d.volunteer || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
