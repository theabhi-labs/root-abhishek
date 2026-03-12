import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WebinarsSection from "./webinars.component";
import JourneyTimeline from "./journeyTimeline.component";
import ArticleSection from "./articals/ArticleSection";

// Tab configuration for cleaner code
const TABS = [
  { id: "webinars", label: "Hackathons & Sessions", color: "#0077ff" },
  { id: "timeline", label: "Journey Timeline", color: "#FF6700" },
  { id: "articles", label: "Insights & Articles", color: "#00c853" },
];

export default function BeyondTheCode() {
  const [activeTab, setActiveTab] = useState("webinars");

  return (
    <section className="min-h-screen bg-[#080b14] text-white py-24 px-6 md:px-12 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6">
          Behind <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">The</span> <span className="text-[#FF6700]">Code</span>
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base font-mono uppercase tracking-widest">
          // Exploring the human side of development, 
          <span className="text-white"> stories beyond the IDE.</span>
        </p>
      </motion.div>

      {/* Modern Tab Navigation */}
      <div className="flex justify-center mb-16">
        <div className="inline-flex flex-wrap justify-center gap-2 p-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-3 rounded-xl text-xs md:text-sm font-bold uppercase tracking-widest transition-colors duration-300 z-10 ${
                activeTab === tab.id ? "text-white" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl -z-10 shadow-lg"
                  style={{ backgroundColor: tab.color }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content with AnimatePresence */}
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {activeTab === "webinars" && <WebinarsSection />}
            {activeTab === "timeline" && <JourneyTimeline />}
            {activeTab === "articles" && <ArticleSection />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-center mt-32 border-t border-white/5 pt-12"
      >
        <p className="text-gray-600 italic font-serif text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
          “Every connection, every challenge, every line of code — built the person I’m becoming.”
        </p>
        <div className="mt-6 flex justify-center gap-2">
           <div className="w-2 h-2 rounded-full bg-blue-500/40" />
           <div className="w-2 h-2 rounded-full bg-[#FF6700]/40" />
           <div className="w-2 h-2 rounded-full bg-green-500/40" />
        </div>
      </motion.div>
    </section>
  );
}



