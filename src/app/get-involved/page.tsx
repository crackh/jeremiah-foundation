"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GetInvolvedPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [showBankDetails, setShowBankDetails] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Volunteer form error:", err);
      setStatus("error");
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      className="space-y-12 max-w-3xl mx-auto text-gray-900 px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <motion.h2
        className="text-3xl font-bold text-gray-700 mb-4 text-center"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        Join Us in Making a Difference
      </motion.h2>

      {/* Donation Section */}
      <motion.section
        className="bg-green-50 p-6 rounded-lg shadow-md text-gray-900"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h3 className="text-2xl font-semibold mb-2 text-gray-700">Donate</h3>
        <p className="mb-4">
          Your support helps us provide shelter, education, healthcare, and food
          to children and women in need.
        </p>

        <button
          onClick={() => setShowBankDetails(!showBankDetails)}
          className="w-full bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition font-semibold"
        >
          {showBankDetails ? "Hide Bank Details" : "Donate"}
        </button>

        <AnimatePresence>
          {showBankDetails && (
            <motion.div
              className="mt-6 p-6 rounded-xl shadow-lg bg-white border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
            >
              <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Bank Transfer Details
              </h4>
              <div className="space-y-3 text-gray-700">
                <p>
                  <span className="font-semibold">Bank Account Name:</span>{" "}
                  Jeremiah 29:11 Kids Foundation (STANBIC BANK)
                </p>
                <p>
                  <span className="font-semibold">Account Number:</span>{" "}
                  9030025436260
                </p>
                <p>
                  <span className="font-semibold">SWIFT Code:</span> SBICUGKX
                </p>
              </div>
              <p className="mt-4 text-sm text-gray-500 text-center">
                Kindly include your full name as the reference when donating.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Volunteer Section */}
      <motion.section
        className="bg-green-50 p-6 rounded-lg shadow-md text-gray-900"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h3 className="text-2xl font-semibold mb-2 text-gray-700">Volunteer</h3>
        <p className="mb-4">
          Join our programs and help us empower communities. Fill out the form
          below to become a volunteer.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-lg text-gray-900 placeholder-gray-500"
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg text-gray-900 placeholder-gray-500"
          />
          <textarea
            placeholder="How would you like to help?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 border rounded-lg text-gray-900 placeholder-gray-500"
            rows={4}
          ></textarea>
          <motion.button
            type="submit"
            disabled={status === "loading"}
            className="bg-gray-700 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-800 disabled:opacity-50"
            whileHover={{ scale: status === "loading" ? 1 : 1.05 }}
          >
            {status === "loading" ? "Submitting..." : "Submit"}
          </motion.button>
        </form>

        {status === "success" && (
          <p className="text-green-700 mt-3">
            ✅ Thank you for applying! We’ll be in touch soon.
          </p>
        )}
        {status === "error" && (
          <p className="text-red-600 mt-3">
            ❌ Failed to submit. Please try again later.
          </p>
        )}
      </motion.section>
    </motion.div>
  );
}
