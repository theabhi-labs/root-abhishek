import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiExternalLink, FiLayers, FiShield, FiCpu, FiMaximize2, FiX, FiCheckCircle } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

export default function Products() {
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const product = {
    title: "PrimeID Pro",
    tagline: "Next-Gen Professional Identity & Smart ID Card Generation Suite",
    description: "An ultra-fast, cloud-native SaaS platform designed for educational institutions, corporate enterprises, and event coordinators to design, batch-generate, and cryptographically verify smart ID cards at scale.",
    liveUrl: "https://www.primeidpro.online/",
    image: "./primeidpro.png",
    status: "Live in Production",
    features: [
      {
        icon: <FiLayers className="text-[#FF6700]" />,
        title: "Real-Time Canvas Engine",
        desc: "Interactive drag-and-drop designer with dynamic photo masking, typography presets, and customizable layouts."
      },
      {
        icon: <FiCpu className="text-[#FF6700]" />,
        title: "High-DPI Batch Generator",
        desc: "Process thousands of student and employee records simultaneously into print-ready 300+ DPI PDF & PNG packages."
      },
      {
        icon: <FiShield className="text-[#FF6700]" />,
        title: "Encrypted QR & Barcodes",
        desc: "Instant scan-to-verify integration allowing real-time authentication of credentials against secure databases."
      },
      {
        icon: <HiSparkles className="text-[#FF6700]" />,
        title: "Custom Brand Templates",
        desc: "Built-in institutional presets, custom watermarks, holographic security badges, and dynamic custom fields."
      }
    ],
    techStack: ["Next.js / React", "Tailwind CSS", "Canvas API", "Node.js", "Cloud Storage", "Docker"],
    metrics: [
      { label: "Render Speed", value: "< 15ms" },
      { label: "Batch Capacity", value: "10,000+ IDs" },
      { label: "Resolution", value: "300+ DPI" },
      { label: "Export Formats", value: "PDF, PNG, SVG" }
    ]
  };

  return (
    <section id="products" className="bg-[#0a0d14] text-white py-24 px-6 md:px-16 lg:px-24 relative overflow-hidden">
      
      {/* Background Cyber Accents */}
      <div className="absolute top-10 left-1/3 w-[600px] h-[600px] bg-cyan-500/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-[#FF6700]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF6700]/20 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="p-2 bg-[#FF6700]/10 rounded-lg text-[#FF6700]">
              <HiSparkles className="text-xl" />
            </div>
            <span className="text-[#FF6700] font-mono tracking-[0.3em] uppercase text-xs font-bold">
              Digital Products & SaaS // 2026
            </span>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
                Featured <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-[#FF6700]">Product</span>
              </h2>
            </div>
            <p className="text-gray-400 max-w-lg text-sm md:text-base font-light italic leading-relaxed">
              <span className="text-[#FF6700] font-bold">//</span> Architected from zero to deployment—building modern web tools that deliver immediate business value.
            </p>
          </div>
        </div>

        {/* 🌟 MAIN PRODUCT SHOWCASE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-[#101524]/80 border border-white/10 hover:border-[#FF6700]/40 rounded-[2.5rem] overflow-hidden backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] transition-all duration-500"
        >
          {/* Top Banner Ribbon */}
          <div className="px-8 py-4 bg-white/[0.03] border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono text-emerald-400 tracking-wider font-bold uppercase">
                {product.status}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#FF6700]/10 border border-[#FF6700]/30 text-[#FF6700] text-[10px] font-mono uppercase font-bold tracking-widest">
                Official Release
              </span>
              <span className="text-xs font-mono text-gray-500 hidden sm:inline">
                https://www.primeidpro.online
              </span>
            </div>
          </div>

          <div className="p-8 md:p-14 lg:p-16 flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            
            {/* Left Content Side */}
            <div className="flex-1 space-y-8">
              <div>
                <span className="text-[#FF6700] font-mono text-xs font-bold uppercase tracking-[0.25em]">
                  Identity Suite SaaS
                </span>
                <h3 className="text-4xl md:text-6xl font-black text-white mt-2 mb-4 tracking-tight leading-tight">
                  {product.title}
                </h3>
                <p className="text-xl text-gray-300 font-medium leading-snug">
                  {product.tagline}
                </p>
                <p className="text-gray-400 mt-4 text-sm md:text-base font-light leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                {product.metrics.map((m, idx) => (
                  <div key={idx} className="text-center sm:text-left">
                    <div className="text-xl md:text-2xl font-black text-white">{m.value}</div>
                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#FF6700]/20 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-[#FF6700]/10 text-base">
                        {feat.icon}
                      </div>
                      <h4 className="text-sm font-bold text-white">{feat.title}</h4>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed font-light">
                      {feat.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Tech Stack Pills */}
              <div>
                <span className="text-[11px] font-mono text-gray-500 uppercase tracking-widest block mb-2">
                  Underlying Architecture
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.techStack.map((tech, idx) => (
                    <span key={idx} className="text-[10px] font-bold text-white uppercase tracking-wider bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href={product.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-[#FF6700] text-black font-black uppercase text-xs tracking-widest rounded-xl hover:shadow-[0_0_30px_rgba(255,103,0,0.5)] transition-all active:scale-95 text-center"
                >
                  <FiExternalLink size={18} /> Launch PrimeID Pro
                </a>
                <button
                  onClick={() => setShowPreviewModal(true)}
                  className="flex-1 flex items-center justify-center gap-3 px-8 py-4 border border-white/15 text-white font-bold uppercase text-xs tracking-widest rounded-xl hover:bg-white/5 hover:border-[#FF6700]/50 transition-all cursor-pointer"
                >
                  <FiMaximize2 size={16} /> Live Preview
                </button>
              </div>

            </div>

            {/* Right Preview Side with High-End Glass Frame */}
            <div className="flex-1 w-full relative group">
              <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-black/80 shadow-2xl group-hover:border-[#FF6700]/40 transition-all duration-700">
                
                {/* Browser Title Bar */}
                <div className="h-10 bg-white/5 backdrop-blur-md px-4 flex items-center justify-between border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                  </div>
                  <div className="text-[10px] font-mono text-gray-400 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                    primeidpro.online
                  </div>
                  <div className="w-8" />
                </div>

                {/* Mockup Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-black">
                  <img
                    src={product.image}
                    alt="PrimeID Pro SaaS Interface"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101524] via-transparent to-transparent opacity-60" />
                </div>

                {/* Floating Quick Feature Badge */}
                <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <FiCheckCircle /> 100% Production Ready
                  </span>
                  <a
                    href={product.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#FF6700] hover:underline font-mono text-[11px] font-bold"
                  >
                    Explore Platform &rarr;
                  </a>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

      </div>

      {/* 🚀 INTERACTIVE PREVIEW MODAL */}
      <AnimatePresence>
        {showPreviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-2xl flex items-center justify-center z-[120] p-4 md:p-10"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-[#0f1422] border border-white/15 rounded-3xl max-w-6xl w-full h-[85vh] shadow-[0_0_60px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col"
            >
              {/* Modal Bar */}
              <div className="h-12 bg-[#141b2e] flex items-center justify-between px-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white text-sm">PrimeID Pro — Interactive Preview</span>
                  <span className="text-xs text-gray-500 font-mono hidden sm:inline">https://www.primeidpro.online/</span>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href="https://www.primeidpro.online/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-[#FF6700] hover:underline uppercase flex items-center gap-1"
                  >
                    Open New Tab <FiExternalLink size={12} />
                  </a>
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <FiX size={22} />
                  </button>
                </div>
              </div>

              {/* Iframe View */}
              <div className="flex-1 bg-white relative">
                <iframe
                  src="https://www.primeidpro.online/"
                  title="PrimeID Pro Live Site"
                  className="w-full h-full border-none"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
