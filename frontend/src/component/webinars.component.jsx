import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";

const webinars = [
  {
    id: 1,
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
    fullDesc: "Attending the HTAIn Workshop at IIT Delhi was an incredible opportunity to dive into the world of Health Technology Assessment. Hosted by FITT, the event focused on bridging the gap between clinical research and practical innovation. Witnessing the 'Pitch the Ideas' segment was a highlight, showcasing how brilliant minds are shaping the future of global healthcare. It was an amazing platform for networking with senior scientists and professors.",
    highlights: ["Research Methodology", "Innovation Pitching", "Clinical Collaboration"]
  },
];

export default function Webinars() {
  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!selectedWebinar) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % selectedWebinar.images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedWebinar]);

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
            className="text-[#FF6700] font-mono tracking-[0.3em] uppercase text-xs"
          >
            Academic Engagements // 2025
          </motion.span>
          <h2 className="text-5xl md:text-7xl font-black text-white mt-2 tracking-tighter uppercase">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-[#FF6700]">Webinars</span>
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {webinars.map((webinar) => (
            <motion.div
              key={webinar.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="relative group bg-[#111827]/40 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-xl transition-all duration-500 hover:border-[#FF6700]/30"
            >
              {/* Image Preview */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={webinar.images[0]}
                  alt={webinar.title}
                  className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                   <span className="text-[10px] font-bold text-[#FF6700] uppercase tracking-widest">{webinar.tag}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
              </div>

              {/* Card Content */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#FF6700] transition-colors line-clamp-1">
                  {webinar.title}
                </h3>
                
                <div className="flex flex-col gap-2 mb-6 text-gray-400 font-mono text-[11px]">
                  <span className="flex items-center gap-2"><FaCalendarAlt className="text-[#FF6700]" /> {webinar.date}</span>
                  <span className="flex items-center gap-2"><FaMapMarkerAlt className="text-[#FF6700]" /> {webinar.location}</span>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-2 italic">
                  "{webinar.shortDesc}"
                </p>

                <button
                  onClick={() => { setSelectedWebinar(webinar); setCurrentImageIndex(0); }}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-[#FF6700] transition-all"
                >
                  View Case Study <FaChevronRight className="text-[10px]" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 🔹 Enhanced Modal */}
      <AnimatePresence>
        {selectedWebinar && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#080b14]/95 backdrop-blur-2xl flex items-center justify-center z-[100] p-4 md:p-10"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              className="bg-[#0f172a] border border-white/10 rounded-[2.5rem] max-w-5xl w-full h-full md:h-auto max-h-[90vh] shadow-2xl relative overflow-hidden flex flex-col md:flex-row"
            >
              {/* Left Side: Auto-Carousel */}
              <div className="w-full md:w-1/2 h-64 md:h-auto relative group">
                {selectedWebinar.images.map((img, i) => (
                  <motion.img
                    key={i} src={img}
                    animate={{ opacity: i === currentImageIndex ? 1 : 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ))}
                {/* Image Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                  {selectedWebinar.images.map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentImageIndex ? 'bg-[#FF6700] w-6' : 'bg-white/30'}`} />
                  ))}
                </div>
              </div>

              {/* Right Side: Detailed Info */}
              <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto custom-scrollbar bg-[#0f172a]">
                <button onClick={() => setSelectedWebinar(null)} className="absolute top-6 right-6 text-gray-500 hover:text-[#FF6700] transition-colors">
                  <IoCloseCircleSharp size={32} />
                </button>

                <span className="text-[#FF6700] font-mono text-[10px] font-bold tracking-[0.3em] uppercase">Event Analysis</span>
                <h2 className="text-3xl font-black text-white mt-2 mb-6 leading-tight">{selectedWebinar.title}</h2>
                
                <div className="space-y-4 mb-8">
                   {selectedWebinar.author.map((name, i) => (
                     <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                        <div className="p-2 rounded-lg bg-blue-500/10"><FaUser className="text-blue-500 text-xs" /></div>
                        {name}
                     </div>
                   ))}
                </div>

                <div className="prose prose-invert max-w-none">
                   <p className="text-gray-400 text-sm leading-relaxed mb-6 border-l-2 border-[#FF6700] pl-4">
                     {selectedWebinar.fullDesc}
                   </p>
                </div>

                {/* Highlights/Badges */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {selectedWebinar.highlights.map((tag, i) => (
                    <span key={i} className="text-[10px] font-bold bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-gray-300 uppercase">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

