import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import About from "./component/about.component";
import Projects from "./component/project.component";
import Products from "./component/products.component";
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

  const scrollToSection = (id) => {
    const el = document.getElementById(id.replace("#", ""));
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { name: "Products", href: "#products", isRoute: false },
    { name: "Projects", href: "#projects", isRoute: false },
    { name: "About", href: "#about", isRoute: false },
    { name: "Contact", href: "#contact", isRoute: false },
    { name: "BeyondTheCode", href: "/beyondTheCode", isRoute: true },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0d0d] selection:bg-[#FF6700] selection:text-black">
      
      {/* 🚀 NAVBAR */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 px-6 md:px-12 py-4 ${
        scrolled ? "bg-black/85 backdrop-blur-xl border-b border-white/10 py-3" : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-white text-xl md:text-2xl font-black tracking-tighter group cursor-pointer text-left bg-transparent border-0 p-0"
          >
            <span className="text-[#FF6700]">root</span>
            <span className="text-gray-500">@</span>abhishek<span className="animate-pulse text-[#FF6700]">_</span>
          </button>

          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                {link.isRoute ? (
                  <Link
                    to={link.href}
                    className="text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 text-gray-400 hover:text-[#FF6700]"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a 
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                      link.name === "Products" 
                        ? "text-[#FF6700] hover:text-white" 
                        : "text-gray-400 hover:text-[#FF6700]"
                    }`}
                  >
                    {link.name}
                  </a>
                )}
              </li>
            ))}
            <li>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("#contact");
                }}
                className="px-5 py-2.5 bg-[#FF6700] text-black text-xs font-black uppercase tracking-widest rounded-lg hover:shadow-[0_0_25px_rgba(255,103,0,0.5)] transition-all duration-300 cursor-pointer inline-block"
              >
                Let's Talk
              </a>
            </li>
          </ul>

          {/* MOBILE TOGGLE */}
          <button
            className="md:hidden flex flex-col gap-1.5 z-50 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Navigation"
          >
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
              link.isRoute ? (
                <motion.div
                  key={link.name}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-3xl sm:text-4xl font-black uppercase tracking-tighter transition-colors text-white hover:text-[#FF6700]"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ) : (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={(e) => {
                    e.preventDefault();
                    setMenuOpen(false);
                    scrollToSection(link.href);
                  }}
                  className={`text-3xl sm:text-4xl font-black uppercase tracking-tighter transition-colors ${
                    link.name === "Products" ? "text-[#FF6700]" : "text-white hover:text-[#FF6700]"
                  }`}
                >
                  {link.name}
                </motion.a>
              )
            ))}
            <motion.a
              href="#contact"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={(e) => {
                e.preventDefault();
                setMenuOpen(false);
                scrollToSection("#contact");
              }}
              className="mt-4 px-8 py-3.5 bg-[#FF6700] text-black font-black uppercase text-sm tracking-widest rounded-xl cursor-pointer"
            >
              Let's Talk
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-20">
        <HeroSection />
        <section id="products" className="scroll-mt-24"><Products /></section>
        <section id="projects" className="scroll-mt-24"><Projects /></section>
        <section id="about" className="scroll-mt-24"><About /></section>
        <section id="contact" className="scroll-mt-24"><Contact /></section>
      </main>

      {/* Subtle Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-xs font-mono text-gray-500 bg-[#080b12]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            &copy; {new Date().getFullYear()} <span className="text-white font-bold">Abhishek Yadav</span>. Built for extreme performance.
          </div>
          <div className="flex items-center gap-4">
            <a href="https://www.primeidpro.online/" target="_blank" rel="noreferrer" className="hover:text-[#FF6700] transition-colors">PrimeID Pro</a>
            <a href="https://www.jascomputerinstitute.in/" target="_blank" rel="noreferrer" className="hover:text-[#FF6700] transition-colors">JAS Institute</a>
            <Link to="/beyondTheCode" className="hover:text-[#FF6700] transition-colors">BeyondTheCode</Link>
            <Link to="/admin" className="text-[#FF6700]/70 hover:text-[#FF6700] transition-colors">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
