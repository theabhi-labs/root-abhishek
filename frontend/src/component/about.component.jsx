import React from "react";
import { motion } from "framer-motion";

export default function About() {
  const skills = [
    { name: "HTML", icon: "./html-5.png" },
    { name: "CSS", icon: "./css-3.png" },
    { name: "JavaScript", icon: "./java-script.png" },
    { name: "React", icon: "./physics.png" },
    { name: "Node.js", icon: "./node-js.png" },
    { name: "Express", icon: "./icons8-express-js-50.png" },
    { name: "MongoDB", icon: "./database.png" },
    { name: "Tailwind", icon: "./icons8-tailwind-css-48.png" },
    { name: "GitHub", icon: "./github.png" },
    { name: "Docker", icon: "./social.png" },
  ];

  return (
    <section className="bg-[#0d0d0d] text-white py-24 px-6 md:px-16 lg:px-24 relative overflow-hidden">
      {/* Background Subtle Detail */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6700]/5 blur-[100px] rounded-full" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-16">
        
        {/* Left: Content Section */}
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black uppercase tracking-tighter"
            >
              About <span className="text-[#FF6700]">Me</span>
            </motion.h2>
            <div className="h-1.5 w-20 bg-[#FF6700] rounded-full" />
          </div>

          <div className="space-y-6">
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light">
              I'm <span className="text-white font-semibold">Abhishek Yadav</span>, a dedicated developer 
              crafting digital experiences that merge functionality with aesthetics. 
              My approach focuses on writing <span className="text-[#FF6700]">clean code</span> that powers 
              seamless user interactions.
            </p>

            <p className="text-gray-400 leading-relaxed">
              Based in India, I specialize in the MERN stack and modern DevOps tools. 
              Whether it's architecting a scalable backend or fine-tuning a responsive UI, 
              I am driven by the challenge of solving complex problems through elegant code.
            </p>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-3 bg-[#FF6700] rounded-full text-black font-bold overflow-hidden transition-all"
          >
            <span className="relative z-10">Download Resume</span>
            <div className="absolute inset-0 bg-white translate-y-10 group-hover:translate-y-0 transition-transform duration-300" />
          </motion.button>
        </div>

        {/* Right: Skills Section */}
        <div className="flex-1 w-full">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#FF6700]"></span>
              Technical Arsenal
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, backgroundColor: "rgba(255, 103, 0, 0.1)" }}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl border border-white/5 bg-[#141414] transition-colors group"
                >
                  <img 
                    src={skill.icon} 
                    alt={skill.name} 
                    className="w-10 h-10 object-contain mb-3 group-hover:drop-shadow-[0_0_8px_#FF6700]"
                  />
                  <span className="text-xs md:text-sm text-gray-400 font-medium tracking-wide">
                    {skill.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
