

import { motion } from "framer-motion";
import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <motion.div
        className="w-16 h-16 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full shadow-lg"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
};

export default Loader;
