"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Achievement = {
  title: string;
  description: string;
  image?: string;
};

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Achievement data with Supabase image filenames
  const achievementData: { title: string; description: string; file?: string }[] = [
    { title: "Registered & Permitted", description: "Fully licensed by the Uganda NGO Board." },
    { title: "Clean Water Access", description: "Drilled boreholes in Wakiso and Amuru districts; distributed Bio Sand Water Filters.", file: "water.jpg" },
    { title: "Food Provision", description: "Provided food to the community we visited.", file: "food.jpg" },
    { title: "Healthcare Support", description: "Facilitated successful surgeries and medical treatments.", file: "support.jpg" },
    { title: "Education & Discipleship", description: "Provided scholastic materials, school fees support, and Bible classes.", file: "education.jpg" },
    { title: "Women Skilling", description: "Trained women in reusable pads, poultry, shoemaking, hairdressing, making of bread(mandazi) and more.", file: "skilling.jpg" },
  ];

  const fetchAchievements = async () => {
    const combined: Achievement[] = achievementData.map((a) => {
      let imageUrl = "";
      if (a.file) {
        const { data } = supabase
          .storage
          .from("achievements-images")
          .getPublicUrl(a.file);
        imageUrl = data.publicUrl || "";
      }
      return { ...a, image: imageUrl };
    });
    setAchievements(combined);
  };

  useEffect(() => {
    fetchAchievements();
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
      className="space-y-12 px-4 py-8 max-w-7xl mx-auto text-gray-900"
    >
      <motion.h2
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="text-4xl font-bold text-gray-700 mb-6 text-center"
      >
        Our Achievements
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {achievements.map((item) => (
          <motion.div
            key={item.title}
            className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer hover:scale-105 transform transition duration-300"
            variants={cardVariants}
            whileHover={{ scale: 1.05 }}
          >
            {item.image && (
              <div className="w-full h-64 relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">{item.title}</h3>
              <p className="text-gray-700">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
