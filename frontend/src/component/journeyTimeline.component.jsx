import React from "react";
import { motion } from "framer-motion";
import { FaCode, FaRocket, FaLaptopCode, FaTrophy } from "react-icons/fa";

const timelineData = [
  {
    year: "2024",
    title: "Started My B.Tech Journey",
    description: "Began my engineering journey — curious about how technology shapes the world. Started learning the fundamentals of coding and computer science.",
    icon: <FaRocket />,
    side: "left"
  },
  {
    year: "2024",
    title: "Dived into Web Development",
    description: "Discovered the power of full-stack development with MERN. Built my first authentication system, portfolio, and dynamic UI projects.",
    icon: <FaLaptopCode />,
    side: "right"
  },
  {
    year: "2025",
    title: "Hackathons & Real Projects",
    description: "Participated in hackathons and collaborated with creative teams. Worked on solving real-world problems through innovation and tech.",
    icon: <FaCode />,
    side: "left"
  },
  {
    year: "Future",
    title: "Building My Legacy",
    description: "Now focusing on creating projects that leave a mark — from AI-powered apps to meaningful solutions through BehindTheCode.",
    icon: <FaTrophy />,
    side: "right"
  },
];

export default function JourneyTimeline() {
  return (
    <section className="relative bg-[#0d0d0d] py-24 px-6 overflow-hidden min-h-screen">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-[10%] -left-20 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[10%] -right-20 w-[400px] h-[400px] bg-[#FF6700]/10 blur-[120px] rounded-full" />

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-20 text-center md:text-left">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[#FF6700] font-mono tracking-[0.4em] uppercase text-xs mb-4"
          >
            History // Evolution
          </motion.p>
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">
            My <span className="text-[#FF6700]">Journey</span>
          </h2>
        </div>

        {/* Timeline Container */}
        <div className="relative mt-10">
          
          {/* Central Vertical Line (Desktop & Mobile handled) */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-600 via-[#FF6700] to-transparent opacity-30" />

          {timelineData.map((item, index) => (
            <div key={index} className="relative mb-20 md:mb-32">
              
              {/* The Timeline Dot */}
              <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 z-20">
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  className="w-5 h-5 bg-[#0d0d0d] border-2 border-[#FF6700] rounded-full shadow-[0_0_15px_#FF6700]"
                />
              </div>

              {/* Content Wrapper */}
              <div className={`flex flex-col md:flex-row items-start md:items-center justify-between w-full pl-12 md:pl-0 ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}>
                
                {/* Year Label (Desktop) */}
                <div className="hidden md:block w-[40%] text-center px-10">
                   <span className="text-6xl font-black text-white/5 tracking-widest">{item.year}</span>
                </div>

                {/* Card */}
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="w-full md:w-[45%] bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2rem] hover:border-[#FF6700]/40 transition-all group"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 flex items-center justify-center bg-[#FF6700]/10 text-[#FF6700] text-xl rounded-2xl group-hover:bg-[#FF6700] group-hover:text-black transition-all duration-500">
                      {item.icon}
                    </div>
                    <div>
                      <span className="md:hidden block text-[#FF6700] font-mono text-xs font-bold mb-1 tracking-widest">
                        {item.year}
                      </span>
                      <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light">
                    {item.description}
                  </p>
                  
                  {/* Visual Detail - Floating bar */}
                  <div className="mt-6 h-1 w-12 bg-[#FF6700]/30 rounded-full group-hover:w-full transition-all duration-700" />
                </motion.div>

                {/* Empty spacer for zigzag layout on desktop */}
                <div className="hidden md:block w-[45%]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS for custom layout fixes */}
      <style>{`
        @media (max-width: 768px) {
          .journey-card-left { margin-left: 2rem; }
        }
      `}</style>
    </section>
  );
}