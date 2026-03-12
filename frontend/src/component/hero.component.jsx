import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineMail, HiOutlineDocumentText } from "react-icons/hi";
import { useEffect, useState } from "react";

function HeroSection() {
  const roles = ["Web Developer", "Creative Thinker", "Tech Explorer", "Lifelong Learner"];
  const [currentRole, setCurrentRole] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex flex-col md:flex-row items-center justify-center relative overflow-hidden px-6 md:px-16 lg:px-24 bg-[#0d0d0d] text-white">
      
      {/* Background Animated Blobs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#FF6700]/10 blur-[120px] rounded-full -top-20 -left-20 animate-pulse" />
        <div className="absolute w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-blue-600/5 blur-[100px] rounded-full -bottom-20 -right-20" />
      </div>

      {/* Text Section */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 flex flex-col items-center md:items-start flex-1 text-center md:text-left pt-20 md:pt-0"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 mb-4"
        >
          <span className="h-[1px] w-8 bg-[#FF6700]"></span>
          <p className="text-[#FF6700] text-sm md:text-base font-mono uppercase tracking-[0.3em]">
            Available for Hire
          </p>
        </motion.div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black leading-none uppercase tracking-tighter">
          Abhishek <br /> 
          <span className="text-transparent border-t-0 bg-clip-text bg-gradient-to-b from-[#FF6700] to-[#b34a00] md:ml-4">
            Yadav
          </span>
        </h1>

        <div className="h-12 md:h-16 flex items-center mt-4">
          <AnimatePresence mode="wait">
            <motion.h2
              key={roles[currentRole]}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xl sm:text-3xl md:text-4xl text-gray-400 font-light italic"
            >
              {roles[currentRole]}
            </motion.h2>
          </AnimatePresence>
        </div>

        <p className="text-gray-500 mt-6 max-w-lg text-sm md:text-lg leading-relaxed font-light">
          I build high-performance, visually stunning web applications with 
          a focus on <span className="text-white font-medium">user experience</span> and <span className="text-white font-medium">clean architecture.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-5 mt-10 w-full sm:w-auto">
          <motion.a
            href="mailto:abhishekyadavcode@gmail.com"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-[#FF6700] text-black font-bold rounded-full hover:shadow-[0_0_20px_#FF6700aa] transition-all duration-300"
          >
            <HiOutlineMail className="text-2xl" />
            Let's Talk
          </motion.a>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-3 px-8 py-4 border border-gray-700 hover:border-[#FF6700] text-white rounded-full transition-all duration-300 backdrop-blur-sm bg-white/5"
          >
            <HiOutlineDocumentText className="text-2xl" />
            View Resume
          </motion.button>
        </div>
      </motion.div>

      {/* Image Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="relative mt-16 md:mt-0 z-10"
      >
        {/* Decorative Frame */}
        <div className="absolute -inset-4 border border-[#FF6700]/30 rounded-full animate-[spin_10s_linear_infinite] hidden lg:block" />
        
        <div 
          className="w-64 h-64 sm:w-80 sm:h-80 lg:w-[450px] lg:h-[450px] 
                     rounded-full overflow-hidden border-2 border-[#FF6700] 
                     shadow-[0_0_50px_rgba(255,103,0,0.2)] grayscale hover:grayscale-0 
                     transition-all duration-700 ease-in-out group relative"
        >
          <div 
            className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" 
            style={{ backgroundImage: "url('/image.png')" }}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent opacity-60" />
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block opacity-30"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#FF6700] to-transparent" />
      </motion.div>
    </section>
  );
}

export default HeroSection;