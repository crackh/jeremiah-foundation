"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface Status {
  message: string;
  isError?: boolean;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>({ message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ message: "Sending..." });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data: { message?: string; error?: string; emailFailed?: boolean } = await res.json();

      if (res.ok) {
        setFormData({ name: "", email: "", message: "" });
        const msg = data.emailFailed
          ? `${data.message} (Email failed to send, but your message was saved.)`
          : data.message!;
        setStatus({ message: msg });
      } else {
        setStatus({ message: data.error || "Failed to send message", isError: true });
      }
    } catch (err) {
      console.error(err);
      setStatus({ message: "An unexpected error occurred.", isError: true });
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      className="space-y-8 max-w-3xl mx-auto text-gray-900 px-4 py-8"
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
        Contact Us
      </motion.h2>

      {/* Reach Out */}
      <motion.section
        className="bg-white p-6 rounded-lg shadow-md text-gray-900"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Reach Out</h3>
        <p className="mb-2">
          Email: <span className="font-medium">jeremiahkidsfoundation@gmail.com / dianamwine@gmail.com</span>
        </p>
        <p className="mb-2">
          Phone/WhatsApp: <span className="font-medium">+256 - 702 - 774 - 093</span>
        </p>
      </motion.section>

      {/* Contact Form */}
      <motion.section
        className="bg-green-50 p-6 rounded-lg shadow-md text-gray-900"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Send Us a Message</h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
            placeholder="Your Name"
            className="w-full p-3 border rounded-lg text-gray-900 placeholder-gray-500"
            required
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Your Email"
            className="w-full p-3 border rounded-lg text-gray-900 placeholder-gray-500"
            required
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            className="w-full p-3 border rounded-lg text-gray-900 placeholder-gray-500"
            rows={5}
            required
          ></textarea>
          <motion.button
            type="submit"
            className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800"
            whileHover={{ scale: 1.05 }}
          >
            Send Message
          </motion.button>
        </form>
        {status.message && (
          <p
            className={`mt-4 text-center font-medium ${status.isError ? "text-red-600" : "text-green-700"}`}
          >
            {status.message}
          </p>
        )}
      </motion.section>
    </motion.div>
  );
}
