import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaChevronRight, FaChevronLeft, FaImages } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import api from "../config/api";

const defaultActivities = [
  {
    id: "act-1",
    title: "Health Technology Assessment (HTAIn)",
    tag: "IIT DELHI EVENT",
    author: [
      "Dr. Vivekanandan Perumal (Professor, IIT-D)",
      "Dr. Kavitha Rajsekar (Scientist-F, DHR)",
    ],
    date: "21 April 2025",
    location: "FITT, IIT Delhi",
    images: ["/iitimage.png", "/iitgroup.png", "/certificate.png"],
    shortDesc: "Attended the HTAIn workshop focused on Health Tech innovation and research strategies.",
    fullDesc: `Attending the HTAIn Workshop at IIT Delhi was an incredible opportunity to dive into the world of Health Technology Assessment. Hosted by FITT, the event focused on bridging the gap between clinical research and practical innovation.

Witnessing the **'Pitch the Ideas'** segment was a highlight, showcasing how brilliant minds are shaping the future of global healthcare. It was an amazing platform for networking with senior scientists, professors, and health tech entrepreneurs.

### Key Highlights & Experience:
- **Research Methodology:** Exploring clinical trial evaluation frameworks and software data pipelines.
- **Innovation Pitching:** Articulating complex software solutions for medical device telemetry.
- **Interdisciplinary Collaboration:** Connecting with leading researchers from IIT Delhi and DHR scientists.`,
    highlights: ["Research Methodology", "Innovation Pitching", "Clinical Collaboration", "IIT Delhi FITT"]
  },
];

export default function Activities() {
  const [activities, setActivities] = useState(defaultActivities);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Fetch activities from backend
  useEffect(() => {
    const fetchActivities = async () => {
      const data = await api.getActivities();
      if (data && data.length > 0) {
        setActivities(data);
      }
    };
    fetchActivities();
  }, []);

  // Auto carousel effect for upper photos in modal
  useEffect(() => {
    if (!selectedActivity || !selectedActivity.images || selectedActivity.images.length <= 1 || !isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % selectedActivity.images.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [selectedActivity, isAutoPlay]);

  const handleNextImage = () => {
    if (!selectedActivity?.images?.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % selectedActivity.images.length);
  };

  const handlePrevImage = () => {
    if (!selectedActivity?.images?.length) return;
    setCurrentImageIndex((prev) => (prev - 1 + selectedActivity.images.length) % selectedActivity.images.length);
  };

  // Close on Escape key and lock body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && selectedActivity) {
        setSelectedActivity(null);
      }
    };
    if (selectedActivity) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedActivity]);

  return (
    <section className="min-h-screen py-24 px-6 bg-[#080b14] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-600/5 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-16 text-center md:text-left">
          <motion.span 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }}
            className="text-[#FF6700] font-mono tracking-[0.3em] uppercase text-xs font-bold"
          >
            Academic Engagements & Events // 2025 - 2026
          </motion.span>
          <h2 className="text-5xl md:text-7xl font-black text-white mt-2 tracking-tighter uppercase">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-[#FF6700]">Activities</span>
          </h2>
        </header>

        {/* 🌟 CARDS GRID (Preserving exact aesthetic while connecting dynamically) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="relative group bg-[#111827]/40 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-xl transition-all duration-500 hover:border-[#FF6700]/30 shadow-2xl flex flex-col justify-between"
            >
              <div>
                {/* Image Preview */}
                <div className="relative h-64 overflow-hidden bg-black/50">
                  <img
                    src={activity.images?.[0] || "/iitimage.png"}
                    alt={activity.title}
                    className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
                    <span className="text-[10px] font-bold text-[#FF6700] uppercase tracking-widest">
                      {activity.tag || "ACTIVITY"}
                    </span>
                  </div>
                  {activity.images?.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-white text-[11px] flex items-center gap-1.5">
                      <FaImages className="text-[#FF6700]" /> {activity.images.length} Photos
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
                </div>

                {/* Card Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#FF6700] transition-colors line-clamp-2">
                    {activity.title}
                  </h3>
                  
                  <div className="flex flex-col gap-2 mb-6 text-gray-400 font-mono text-[11px]">
                    <span className="flex items-center gap-2">
                      <FaCalendarAlt className="text-[#FF6700]" /> {activity.date}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-[#FF6700]" /> {activity.location}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 italic">
                    "{activity.shortDesc}"
                  </p>
                </div>
              </div>

              <div className="px-8 pb-8 pt-0">
                <button
                  onClick={() => {
                    setSelectedActivity(activity);
                    setCurrentImageIndex(0);
                    setIsAutoPlay(true);
                  }}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white group-hover:text-[#FF6700] transition-all cursor-pointer"
                >
                  View Case Study <FaChevronRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 🔹 FULL SCREEN ACTIVITY BLOG MODAL */}
      <AnimatePresence>
        {selectedActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 w-screen h-screen z-[130] bg-[#070913] flex flex-col overflow-hidden text-white"
          >
            {/* 1. TOP STICKY BAR */}
            <div className="h-16 bg-black/90 backdrop-blur-xl border-b border-white/10 px-6 md:px-12 flex items-center justify-between flex-shrink-0 z-50">
              <button
                onClick={() => setSelectedActivity(null)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-[#FF6700] hover:text-black text-gray-300 transition-all text-xs font-mono font-bold uppercase tracking-wider cursor-pointer border border-white/10"
              >
                <FaChevronLeft size={12} /> Back to Activities
              </button>

              <div className="hidden md:flex items-center gap-3 text-xs font-mono text-gray-400 truncate max-w-lg">
                <span className="text-[#FF6700] font-bold uppercase">{selectedActivity.tag || "ACTIVITY"}</span>
                <span>&bull;</span>
                <span className="text-white truncate">{selectedActivity.title}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-[11px] font-mono text-gray-400 bg-white/5 px-3 py-1 rounded-lg border border-white/10">
                  Press ESC to close
                </span>
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/40 transition-all cursor-pointer"
                  title="Close (Esc)"
                >
                  <IoCloseCircleSharp size={22} />
                </button>
              </div>
            </div>

            {/* 2. SCROLLABLE CONTENT BODY */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              
              {/* 🌟 UPPER SIDE: FULL-WIDTH ANIMATED HERO CAROUSEL */}
              <div 
                className="relative w-full h-[380px] md:h-[500px] lg:h-[550px] bg-black overflow-hidden group"
                onMouseEnter={() => setIsAutoPlay(false)}
                onMouseLeave={() => setIsAutoPlay(true)}
              >
                {/* Images Layer with Crossfade Animation */}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={selectedActivity.images?.[currentImageIndex] || "/iitimage.png"}
                    alt={`${selectedActivity.title} photo ${currentImageIndex + 1}`}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full h-full object-cover object-center"
                  />
                </AnimatePresence>

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#070913] via-black/40 to-black/20 pointer-events-none" />

                {/* Floating Meta on Top of Image */}
                <div className="absolute top-8 left-6 md:left-12 flex flex-wrap gap-2.5 z-20">
                  <span className="bg-black/80 backdrop-blur-md text-[#FF6700] text-xs font-mono font-bold px-4 py-2 rounded-full border border-white/10 uppercase tracking-widest shadow-lg">
                    {selectedActivity.tag || "ACTIVITY"}
                  </span>
                  <span className="bg-black/80 backdrop-blur-md text-gray-200 text-xs font-mono px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 shadow-lg">
                    <FaMapMarkerAlt className="text-[#FF6700]" /> {selectedActivity.location}
                  </span>
                  <span className="bg-black/80 backdrop-blur-md text-gray-200 text-xs font-mono px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 shadow-lg">
                    <FaCalendarAlt className="text-[#FF6700]" /> {selectedActivity.date}
                  </span>
                </div>

                {/* Next & Previous Arrows */}
                {selectedActivity.images?.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-white flex items-center justify-center hover:bg-[#FF6700] hover:text-black transition-all z-20 cursor-pointer shadow-2xl"
                      title="Previous Photo"
                    >
                      <FaChevronLeft size={16} />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-white flex items-center justify-center hover:bg-[#FF6700] hover:text-black transition-all z-20 cursor-pointer shadow-2xl"
                      title="Next Photo"
                    >
                      <FaChevronRight size={16} />
                    </button>
                  </>
                )}

                {/* Carousel Dots & Counter */}
                {selectedActivity.images?.length > 1 && (
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 shadow-2xl">
                    {selectedActivity.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`h-2.5 rounded-full transition-all cursor-pointer ${
                          idx === currentImageIndex ? "w-8 bg-[#FF6700]" : "w-2.5 bg-white/40 hover:bg-white"
                        }`}
                      />
                    ))}
                    <span className="text-xs font-mono text-gray-300 ml-2 font-bold">
                      {currentImageIndex + 1} / {selectedActivity.images.length}
                    </span>
                  </div>
                )}
              </div>

              {/* 🌟 LOWER SIDE: IMMERSIVE FULL-WIDTH BLOG ARTICLE */}
              <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 md:py-16 space-y-10">
                
                {/* Header Title */}
                <div className="space-y-4">
                  <span className="text-[#FF6700] font-mono text-xs font-bold tracking-[0.3em] uppercase block">
                    Detailed Activity Case Study // Full Documentation
                  </span>
                  <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
                    {selectedActivity.title}
                  </h1>
                </div>

                {/* Authors / Mentors Pill Bar */}
                {selectedActivity.author?.length > 0 && (
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-wrap items-center gap-4">
                    <span className="text-xs font-mono uppercase text-gray-400 font-bold tracking-wider">
                      Key Mentors & Speakers:
                    </span>
                    {selectedActivity.author.map((name, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-sm text-gray-100 bg-blue-500/15 border border-blue-500/30 px-4 py-2 rounded-xl">
                        <FaUser className="text-blue-400 text-xs" />
                        <span className="font-semibold">{name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Short Overview Blockquote */}
                <div className="border-l-4 border-[#FF6700] pl-6 py-4 bg-[#FF6700]/5 rounded-r-2xl">
                  <p className="text-lg md:text-xl text-gray-200 italic font-light leading-relaxed">
                    "{selectedActivity.shortDesc}"
                  </p>
                </div>

                {/* Full Markdown Blog Content */}
                <div className="prose prose-invert max-w-none text-gray-300 text-base md:text-lg leading-relaxed space-y-6">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {selectedActivity.fullDesc || selectedActivity.shortDesc}
                  </ReactMarkdown>
                </div>

                {/* Highlights / Badges */}
                {selectedActivity.highlights?.length > 0 && (
                  <div className="pt-8 border-t border-white/10">
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-widest block mb-4 font-bold">
                      Key Topic Highlights:
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {selectedActivity.highlights.map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs font-bold bg-[#FF6700]/10 border border-[#FF6700]/30 text-[#FF6700] px-4 py-2 rounded-xl uppercase tracking-wider"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Close Button */}
                <div className="pt-12 border-t border-white/10 flex justify-center">
                  <button
                    onClick={() => {
                      setSelectedActivity(null);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="px-8 py-3.5 bg-[#FF6700] hover:bg-[#ff7b1a] text-black text-xs font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(255,103,0,0.4)]"
                  >
                    Back to All Activities
                  </button>
                </div>

              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
