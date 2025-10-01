"use client";

import { motion } from "framer-motion";

export default function Footer() {
  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.footer
      className="bg-gray-900 text-gray-200 py-6 mt-10"
      variants={footerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
        <p>
          © {new Date().getFullYear()} Jeremiah 29:11 Kids Foundation Uganda
        </p>
        <p className="text-sm">Building Hope, Transforming Communities</p>

        {/* Optional social links */}
        <div className="flex justify-center space-x-4 mt-2">
          <a
            color="blue"
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue transition"
          >
            Facebook
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            Twitter
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            Instagram
          </a>
        </div>
      </div>
    </motion.footer>
  );
}
