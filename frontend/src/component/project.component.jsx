import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FiExternalLink, FiCode, FiTerminal, FiChevronRight } from "react-icons/fi";
import VSCodePopup from "./VSCodeUI.component";
import api from "../config/api";

const defaultProjects = [
  {
    id: "proj-1",
    title: "Smartbin",
    description: "IoT-based waste management system that senses levels and sends real-time alerts via MERN stack.",
    image: "./smartbin.png",
    live: "https://smartbin-theta.vercel.app/",
    githubRepo: "theabhi-labs/smartbin",
    githubURL: "https://github.com/theabhi-labs/smartbin",
    tech: ["React", "Node.js", "IoT", "MongoDB"]
  },
  {
    id: "proj-2",
    title: "LeetCode Clone",
    description: "A full-stack playground for Data Structures & Algorithms with real-time code execution and test cases.",
    image: "./leetcode.png",
    live: "https://leetcode.com",
    githubRepo: "theabhi-labs/leetcode-clone",
    githubURL: "https://github.com/theabhi-labs/leetcode-clone",
    tech: ["Next.js", "Firebase", "Monaco Editor"]
  },
  {
    id: "proj-3",
    title: "JAS Computer Institute",
    description: "Full-stack institutional web portal & student management platform featuring automated admissions, dynamic course curricula, inquiry engine, and fee tracking.",
    image: "./jas_institute.png",
    live: "https://www.jascomputerinstitute.in/",
    githubRepo: "theabhi-labs/jas-computer-institute",
    githubURL: "https://github.com/theabhi-labs/jas-computer-institute",
    tech: ["React.js", "Node.js", "Express", "Tailwind CSS", "MongoDB"]
  },
];

export default function Projects() {
  const [projects, setProjects] = useState(defaultProjects);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const scrollRef = useRef(null);

  // Fetch dynamic projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      const data = await api.getProjects();
      if (data && data.length > 0) {
        setProjects(data);
      }
    };
    fetchProjects();
  }, []);

  const handleOpenInspect = (project) => {
    setSelectedProject(project);
    setIsPopupOpen(true);
    api.trackEvent('inspect_code', '#projects', { projectTitle: project.title, repo: project.githubRepo });
  };

  // 🖱️ Wheel Scroll to Horizontal Scroll
  const handleWheel = (e) => {
    if (e.deltaY === 0) return;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <section id="projects" className="bg-[#0d0d0d] text-white py-24 px-6 md:px-16 lg:px-24 relative overflow-hidden">
      
      {/* Glow Decor */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#FF6700]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Section Header */}
      <div className="mb-16 relative z-10">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#FF6700]/10 rounded-lg text-[#FF6700]">
            <FiTerminal className="text-xl" />
          </div>
          <span className="text-[#FF6700] font-mono tracking-[0.3em] uppercase text-xs font-bold">Portfolio / Works</span>
        </motion.div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
            Selected <br /> <span className="text-[#FF6700]">Works</span>
          </h2>
          <p className="text-gray-500 max-w-md text-sm font-light italic opacity-80 leading-relaxed">
            <span className="text-[#FF6700] font-bold">//</span> From institutional portals to scalable cloud apps—crafting digital solutions that scale.
          </p>
        </div>
      </div>

      {/* 🚀 HORIZONTAL SCROLL CONTAINER */}
      <div 
        ref={scrollRef}
        onWheel={handleWheel}
        className="relative z-10 flex flex-col md:flex-row gap-8 pb-12 overflow-x-hidden md:overflow-x-auto snap-y md:snap-x snap-mandatory professional-scrollbar"
      >
        {projects.map((project, index) => (
          <motion.div
            key={project.id || index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="w-full flex-shrink-0 md:w-[450px] lg:w-[550px] bg-[#121212] border border-white/5 rounded-[2.5rem] overflow-hidden snap-center group hover:border-[#FF6700]/30 transition-all duration-500 shadow-2xl flex flex-col justify-between"
          >
            {/* Browser Mockup Header */}
            <div>
              <div className="relative h-64 md:h-72 overflow-hidden bg-black">
                <div className="absolute top-0 left-0 right-0 h-10 bg-white/5 backdrop-blur-md flex items-center px-4 gap-1.5 z-20 border-b border-white/10">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF605C]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD44]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00CA4E]" />
                  <span className="ml-3 text-[10px] font-mono text-gray-400 truncate opacity-70">
                    {project.live || project.title?.toLowerCase().replace(/\s+/g, '') + '.dev'}
                  </span>
                </div>

                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover pt-10 transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
              </div>

              {/* Content Details */}
              <div className="p-8 md:p-10">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech?.map((t, i) => (
                    <span key={i} className="text-[10px] font-bold text-[#FF6700] uppercase tracking-widest bg-[#FF6700]/5 px-2.5 py-1 rounded-md border border-[#FF6700]/10">
                      {t}
                    </span>
                  ))}
                </div>

                <h3 className="text-3xl font-bold mb-4 group-hover:text-[#FF6700] transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                  {project.description}
                </p>
              </div>
            </div>

            <div className="px-8 pb-8 md:px-10 md:pb-10 pt-0">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleOpenInspect(project)}
                  className="flex-1 flex items-center justify-center gap-3 py-4 bg-[#FF6700] text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:shadow-[0_10px_20px_rgba(255,103,0,0.3)] transition-all active:scale-95 cursor-pointer"
                >
                  <FiCode size={16} /> Inspect Code (Full Screen)
                </button>
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-3 py-4 border border-white/10 text-white font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-white/5 hover:border-[#FF6700]/50 transition-all text-center"
                  >
                    <FiExternalLink size={16} /> Live Project
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {/* More on GitHub Card */}
        <a
          href="https://github.com/theabhi-labs/"
          target="_blank"
          rel="noreferrer"
          className="w-full flex-shrink-0 md:w-[300px] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[2.5rem] hover:bg-[#FF6700]/5 hover:border-[#FF6700]/30 transition-all group cursor-pointer p-8"
        >
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#FF6700] transition-all">
            <FiChevronRight className="text-2xl text-[#FF6700] group-hover:text-black" />
          </div>
          <p className="text-gray-400 font-mono text-xs uppercase tracking-widest group-hover:text-white transition-colors">
            Explore More on GitHub
          </p>
          <span className="text-[10px] text-[#FF6700] font-mono mt-2">@theabhi-labs</span>
        </a>
      </div>

      <style>{`
        /* Professional Thin Scrollbar */
        .professional-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .professional-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          margin-inline: 40px;
          border-radius: 10px;
        }
        .professional-scrollbar::-webkit-scrollbar-thumb {
          background: #FF6700;
          border-radius: 10px;
        }
        .professional-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ff8533;
        }
        @media (max-width: 768px) {
          .professional-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .professional-scrollbar::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>

      <VSCodePopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        project={selectedProject}
      />
    </section>
  );
}