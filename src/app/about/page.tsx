"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AboutPage() {
  const [visionImage, setVisionImage] = useState<string>("");

  // Animation variants for sections
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  // Fetch vision image from Supabase
  useEffect(() => {
    const fetchVisionImage = () => {
      const { data } = supabase.storage
        .from("about-images")
        .getPublicUrl("about.jpg");
      if (data?.publicUrl) setVisionImage(data.publicUrl);
    };
    fetchVisionImage();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="space-y-12 max-w-4xl mx-auto text-gray-900 px-4 py-8"
    >
      {/* Page Title */}
      <motion.h2
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="text-4xl font-bold text-gray-700 text-center mb-8"
      >
        About Us
      </motion.h2>

      {/* Vision Section */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-col md:flex-row items-center gap-6 bg-green-50 p-6 rounded-lg shadow-md"
      >
        {visionImage && (
          <motion.img
            src={visionImage}
            alt="Our Vision"
            className="w-full md:w-1/2 h-64 md:h-72 object-cover rounded-lg shadow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1 } }}
          />
        )}
        <div className="md:w-1/2">
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">Our Vision</h3>
          <p>
            To improve the quality of livelihoods of Orphaned & Vulnerable Children in Uganda
            by impacting Godly values and ensuring their holistic welfare.
          </p>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Our Mission</h3>
        <ul className="list-disc ml-6 space-y-2">
          <li>To bring glory to God through our service.</li>
          <li>To provide basic necessities, ensuring orphans enjoy equal rights and opportunities.</li>
          <li>To extend opportunities to less-advantaged children, offering them an improved quality of life.</li>
          <li>To cooperate with global partners to end the plight of disadvantaged children.</li>
        </ul>
      </motion.section>

      {/* Core Values Section */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-green-50 p-6 rounded-lg shadow-md text-center"
      >
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Core Values</h3>
        <p className="text-lg font-medium">
          Love | Hope | Patience | Endurance | Faith
        </p>
      </motion.section>
    </motion.div>
  );
}
