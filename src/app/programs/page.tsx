"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ProgramsPage() {
  const [empowermentImage, setEmpowermentImage] = useState<string>("");
  const [planImage, setPlanImage] = useState<string>("");

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Fetch images from Supabase
  useEffect(() => {
    const fetchImages = () => {
      const { data: empowerment } = supabase
        .storage
        .from("programs-images")
        .getPublicUrl("skill.jpg");
      setEmpowermentImage(empowerment.publicUrl);

      const { data: plan } = supabase
        .storage
        .from("programs-images")
        .getPublicUrl("plan.png");
      setPlanImage(plan.publicUrl);
    };

    fetchImages();
  }, []);

  return (
    <motion.div
      className="space-y-16 max-w-5xl mx-auto text-gray-900 px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      {/* Page Title */}
      <motion.h2
        className="text-4xl font-bold text-gray-700 text-center"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        Our Programs
      </motion.h2>

      {/* Economic Empowerment */}
      <motion.section
        className="flex flex-col md:flex-row items-center gap-6 bg-green-50 p-6 rounded-lg shadow-md"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        {empowermentImage && (
          <motion.img
            src={empowermentImage}
            alt="Economic Empowerment"
            className="w-full md:w-1/2 h-64 object-cover rounded-lg shadow"
            whileHover={{ scale: 1.05 }}
          />
        )}
        <div className="md:w-1/2">
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            Economic Empowerment
          </h3>
          <p className="mb-4">
            Objective: Enable women to start sustainable small businesses and
            achieve financial independence.
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Skills Training: Tailoring, weaving, jewelry, soap making.</li>
            <li>
              Financial Inclusion: Savings & Loan Fund (VSLAs) for seed capital.
            </li>
            <li>
              Enterprise Hub: On-site coffee shop for practical business
              experience.
            </li>
          </ul>
        </div>
      </motion.section>

      {/* Holistic Care & Infrastructure */}
      <motion.section
        className="flex flex-col md:flex-row items-center gap-6 md:flex-row-reverse bg-white p-6 rounded-lg shadow-md"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        {planImage && (
          <motion.img
            src={planImage}
            alt="Holistic Care & Infrastructure"
            className="w-full md:w-1/2 h-64 object-cover rounded-lg shadow"
            whileHover={{ scale: 1.05 }}
          />
        )}
        <div className="md:w-1/2">
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            Holistic Care & Infrastructure
          </h3>
          <p className="mb-4">
            Objective: Provide a safe, healthy, and nurturing environment for
            orphaned and vulnerable children and women.
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Shelter: Safe homes on our 17-acre land.</li>
            <li>Education: Constructing schools for access to quality education.</li>
            <li>Healthcare: Medical centers to provide essential care.</li>
            <li>Sanitation: Toilets and hygiene promotion.</li>
            <li>Essential Supplies: Food, clothing, bedding.</li>
            <li>Clean Water: Boreholes and water filters.</li>
          </ul>
        </div>
      </motion.section>
    </motion.div>
  );
}
