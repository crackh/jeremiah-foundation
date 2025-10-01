"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [homeImage, setHomeImage] = useState<string>("");
  const [logoImage, setLogoImage] = useState<string>("");
  const [educationImage, setEducationImage] = useState<string>("");

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const homeData = supabase.storage.from("home-images").getPublicUrl("home.jpg");
        if (homeData?.data?.publicUrl) setHomeImage(homeData.data.publicUrl);

        const logoData = supabase.storage.from("logo").getPublicUrl("logo.png");
        if (logoData?.data?.publicUrl) setLogoImage(logoData.data.publicUrl);

        const eduData = supabase.storage.from("achievements-images").getPublicUrl("education.jpg");
        if (eduData?.data?.publicUrl) setEducationImage(eduData.data.publicUrl);
      } catch (error) {
        console.error("Error fetching images from Supabase:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <motion.div
      className="relative space-y-16 max-w-6xl mx-auto text-gray-900 px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      {/* Logo watermark */}
      {logoImage && (
        <Image
          src={logoImage}
          alt="Logo watermark"
          fill
          unoptimized
          className="absolute inset-0 w-full h-full object-contain opacity-10 pointer-events-none select-none"
        />
      )}

      {/* Hero Section */}
      <motion.section
        className="relative text-center py-16 bg-blue-50 rounded-lg shadow-md px-6 overflow-hidden"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        {educationImage && (
          <Image
            src={educationImage}
            alt="Education background"
            fill
            unoptimized
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30"
          />
        )}

        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-cyan-700">
            JEREMIAH 29:11 KIDS FOUNDATION UGANDA
          </h1>
          <p className="italic text-lg mt-4 max-w-3xl mx-auto">
            &quot;For I know the plans I have for you,&quot; declares the Lord, &quot;plans to prosper you
            and not to harm you, plans to give you hope and a future.&quot; – Jeremiah 29:11
          </p>
          <div className="mt-8">
            <a
              href="/get-involved"
              className="bg-cyan-700 text-white px-6 py-3 rounded-lg shadow-md hover:bg-cyan-900 transition"
            >
              Join Us in Making a Difference
            </a>
          </div>
        </div>
      </motion.section>

      {/* Background Section */}
      <motion.section
        className="grid md:grid-cols-2 gap-8 items-center px-6"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div>
          <h2 className="text-3xl font-bold text-cyan-700 mb-4">Background</h2>
          <p className="mb-4">
            In Uganda, most orphaned children are a result of AIDS/HIV. Moreover, rampant poverty
            prevents these orphans from caring for themselves. Elderly caretakers, often above 70 years,
            struggle to provide for them.
          </p>
          <p className="mb-4">
            Jeremiah 29:11 Kids Foundation Uganda Limited was founded to respond to these challenges,
            offering hope, education, shelter, medical care, and basic needs to orphaned and vulnerable children.
          </p>
          <p className="mb-4">
            The organization supplements government efforts like Universal Primary and Secondary Education
            programs, supporting children in Gudda fish landing site and Okango villages who cannot afford school supplies
            or other necessities.
          </p>
          <p className="mb-4">
            Today, it has registered 328 orphans, with a higher percentage of girls, in Wakiso District and Northern Uganda,
            and continues to work hand-in-hand with other NGOs to improve their lives.
          </p>
        </div>

        <motion.div className="relative w-full h-100 md:h-[28rem] lg:h-[32rem]" whileHover={{ scale: 1.03 }}>
          {homeImage && (
            <Image
              src={homeImage}
              alt="Orphans and Vulnerable Children"
              fill
              unoptimized
              className="rounded-lg shadow-md object-contain object-center"
            />
          )}
        </motion.div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        className="text-center py-12 bg-cyan-100 rounded-lg shadow-md px-6"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h3 className="text-3xl font-semibold text-cyan-700 mb-4">
          Help Us Make a Difference
        </h3>
        <p className="mb-6">
          Your support enables us to provide shelter, education, medical care, and food to children and women in need.
        </p>
        <a
          href="/get-involved"
          className="bg-cyan-700 text-white px-6 py-3 rounded-lg shadow-md hover:bg-cyan-800 transition"
        >
          Get Involved
        </a>
      </motion.section>
    </motion.div>
  );
}
