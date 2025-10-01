"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Challenge = {
  title: string;
  description: string;
  image: string;
};

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  // Simplified + clear details
  const challengeData = [
    {
      title: "Lack of Decent Housing",
      description: "Children live in mud houses with leaking roofs, no bedding, and little privacy.",
      file: "shelter.jpg",
    },
    {
      title: "Poor Health & Sanitation",
      description: "No mosquito nets, unsafe bathrooms, and frequent outbreaks of malaria, cholera, and dysentery.",
      file: "health.jpg",
    },
    {
      title: "Hunger & Malnutrition",
      description: "Many children eat only once a day, suffer stunted growth, and face severe malnutrition.",
      file: "mulnutrition.jpg",
    },
    {
      title: "Lack of Education",
      description: "Poverty prevents children from accessing school, uniforms, or materials, leaving their future uncertain.",
      file: "education.jpg",
    },
    {
      title: "Abuse & Exploitation",
      description: "Children face sexual abuse, early pregnancies, child marriages, and exposure to immorality.",
      file: "exploitation.jpg",
    },
    {
      title: "Unsafe Water",
      description: "Families rely on contaminated lake water for drinking and washing, leading to waterborne diseases.",
      file: "water.png",
    },
  ];

  const fetchChallenges = async () => {
    const combined: Challenge[] = challengeData.map((c) => {
      const { data } = supabase.storage
        .from("challenges-images")
        .getPublicUrl(c.file);
      return { ...c, image: data.publicUrl };
    });

    setChallenges(combined);
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="space-y-12 max-w-7xl mx-auto text-gray-900 px-4 py-8"
    >
      <motion.h2
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="text-4xl font-bold text-gray-700 text-center mb-8"
      >
        Our Current Challenges
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {challenges.map((c, index) => (
          <motion.div
            key={index}
            className="bg-red-50 rounded-lg shadow-md overflow-hidden cursor-pointer hover:scale-105 transform transition duration-300"
            variants={cardVariants}
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-full h-64 relative">
              <img
                src={c.image}
                alt={c.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-red-600 mb-2">
                {c.title}
              </h3>
              <p className="text-gray-800">{c.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
      >
        <a
          href="/get-involved"
          className="bg-gray-700 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-800 transition"
        >
          Help Us Solve These Challenges
        </a>
      </motion.div>
    </motion.div>
  );
}
