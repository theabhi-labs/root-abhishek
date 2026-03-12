import React from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiClock, FiCalendar } from "react-icons/fi";

const articles = [
  {
    title: "Understanding React Hooks",
    description: "A deep dive into React Hooks, useState, useEffect, and custom hooks for better performance.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
    date: "Oct 12, 2023",
    readTime: "5 min read",
    link: "#",
    category: "Development"
  },
  {
    title: "Tailwind CSS Tips",
    description: "Learn useful Tailwind CSS tricks for building responsive and ultra-modern user interfaces.",
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&q=80",
    date: "Nov 05, 2023",
    readTime: "3 min read",
    link: "#",
    category: "Design"
  },
  {
    title: "JavaScript ES6 Features",
    description: "Exploring the most important ES6 features every developer should master in 2024.",
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=800&q=80",
    date: "Dec 01, 2023",
    readTime: "8 min read",
    link: "#",
    category: "JS"
  },
];

export default function Articles() {
  return (
    <section className="bg-[#0d0d0d] text-white py-16 px-4 sm:px-8 md:py-24 lg:px-24">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
        <div className="text-left">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none">
            Latest <span className="text-[#FF6700]">Articles</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-md font-mono text-xs sm:text-sm">
            // Thoughts on software, design, and the future of web tech.
          </p>
        </div>
        <button className="w-fit text-[#FF6700] border-b border-[#FF6700] pb-1 hover:text-white hover:border-white transition-all text-xs sm:text-sm font-bold tracking-widest uppercase">
          View All Posts
        </button>
      </div>

      {/* Articles Grid - Responsive columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
        {articles.map((article, index) => (
          <motion.article
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-[#141414] border border-white/5 rounded-[2rem] overflow-hidden hover:border-[#FF6700]/30 transition-all duration-500 flex flex-col h-full"
          >
            {/* Image Section */}
            <div className="relative h-48 sm:h-56 md:h-60 overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-black/60 backdrop-blur-md text-[#FF6700] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">
                  {article.category}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 md:p-8 flex flex-col flex-grow">
              <div className="flex items-center gap-4 text-gray-500 text-[10px] sm:text-[11px] mb-4 font-mono">
                <span className="flex items-center gap-1.5"><FiCalendar className="text-[#FF6700]" /> {article.date}</span>
                <span className="flex items-center gap-1.5"><FiClock className="text-[#FF6700]" /> {article.readTime}</span>
              </div>

              <h3 className="text-xl md:text-2xl font-bold mb-3 leading-tight group-hover:text-[#FF6700] transition-colors">
                {article.title}
              </h3>
              
              <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2">
                {article.description}
              </p>

              <div className="mt-auto">
                <a
                  href={article.link}
                  className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] group/btn transition-all"
                >
                  Read Article 
                  <span className="p-2 rounded-full bg-white/5 group-hover/btn:bg-[#FF6700] group-hover/btn:text-black transition-all">
                    <FiArrowUpRight className="text-base md:text-lg" />
                  </span>
                </a>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Responsive Newsletter Hook */}
      <div className="mt-16 md:mt-24 p-6 sm:p-8 md:p-12 bg-gradient-to-r from-[#141414] to-[#0d0d0d] border border-white/5 rounded-[2rem] md:rounded-[2.5rem] flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
        <div>
          <h4 className="text-xl sm:text-2xl font-bold">Stay in the loop</h4>
          <p className="text-gray-500 text-sm mt-1">Get notified when I publish something new.</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
          <input 
            type="email" 
            placeholder="Email address" 
            className="bg-black border border-white/10 rounded-xl px-6 py-3 text-sm focus:outline-none focus:border-[#FF6700] w-full sm:w-64 transition-all"
          />
          <button className="bg-white text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#FF6700] hover:text-white transition-all whitespace-nowrap">
            Join Now
          </button>
        </div>
      </div>
    </section>
  );
}