import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import About from "./component/about.component";
import Projects from "./component/project.component";
import Contact from "./component/contact.component";
import HeroSection from "./component/hero.component";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Projects", href: "#projects", external: false },
    { name: "About", href: "#about", external: false },
    { name: "Contact", href: "#contact", external: false },
    // External ko false rakha hai taaki Same Tab mein khule aur Back Button chale
    { name: "BeyondTheCode", href: "/beyondTheCode", external: false },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0d0d] selection:bg-[#FF6700] selection:text-black">
      
      {/* 🚀 NAVBAR */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 px-6 md:px-12 py-4 ${
        scrolled ? "bg-black/60 backdrop-blur-xl border-b border-white/10 py-3" : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="text-white text-xl md:text-2xl font-black tracking-tighter group cursor-pointer">
            <span className="text-[#FF6700]">root</span>
            <span className="text-gray-500">@</span>abhishek<span className="animate-pulse text-[#FF6700]">_</span>
          </div>

          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a 
                  href={link.href}
                  target={link.external ? "_blank" : "_self"}
                  className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#FF6700] transition-all duration-300"
                >
                  {link.name}
                </a>
              </li>
            ))}
            <li>
              <a href="/track" className="px-5 py-2.5 bg-[#FF6700]/10 border border-[#FF6700]/50 text-[#FF6700] text-xs font-black uppercase tracking-widest rounded-lg hover:bg-[#FF6700] hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(255,103,0,0.15)]">
                Track Project
              </a>
            </li>
          </ul>

          {/* MOBILE TOGGLE */}
          <button className="md:hidden flex flex-col gap-1.5 z-50" onClick={() => setMenuOpen(!menuOpen)}>
            <div className={`w-6 h-0.5 bg-white transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <div className={`w-6 h-0.5 bg-white transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <div className={`w-6 h-0.5 bg-white transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </nav>

      {/* 📱 MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[#0d0d0d] z-[90] flex flex-col justify-center items-center gap-6">
             {navLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setMenuOpen(false)}
                className="text-4xl font-black uppercase tracking-tighter text-white hover:text-[#FF6700] transition-colors"
              >
                {link.name}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-20">
        <HeroSection />
        <section id="about" className="scroll-mt-24"><About /></section>
        <section id="projects" className="scroll-mt-24"><Projects /></section>
        <section id="contact" className="scroll-mt-24"><Contact /></section>
      </main>
    </div>
  );
}

