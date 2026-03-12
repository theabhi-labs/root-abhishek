import React from "react";
import { motion } from "framer-motion";
import { FiEdit3, FiTrash2, FiPlus, FiChevronRight } from "react-icons/fi";

export default function SubtopicList({
  subtopics,
  activeSubtopic,
  setActiveSubtopic,
  onEdit,
  onDelete,
  onNewSubtopic,
}) {
  return (
    <div className="flex flex-col w-full h-full bg-[#0d111d]/40 backdrop-blur-md p-6">
      
      {/* 🏷️ Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
            Chapters
          </h5>
          <div className="h-0.5 w-6 bg-[#FF6700] mt-1 rounded-full" />
        </div>
        <button
          onClick={onNewSubtopic}
          className="group flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 border border-white/10 rounded-lg text-gray-400 hover:text-[#FF6700] hover:border-[#FF6700]/30 transition-all"
        >
          <FiPlus size={12} className="group-hover:rotate-90 transition-transform" />
          Add
        </button>
      </div>

      {/* 📂 Subtopic Navigation */}
      <div className="relative space-y-1 pl-2 border-l border-white/5">
        {subtopics.length === 0 && (
          <div className="text-gray-600 text-xs font-mono italic pl-4">
            // no_chapters_found
          </div>
        )}

        {subtopics.map((s, idx) => {
          const isActive = activeSubtopic === s;
          return (
            <motion.div
              key={s}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              className={`group relative flex items-center justify-between py-1.5 pl-4 pr-2 rounded-xl transition-all duration-300 ${
                isActive 
                ? "bg-[#FF6700]/5 text-white" 
                : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {/* Active Indicator Dot */}
              {isActive && (
                <motion.div 
                  layoutId="dot"
                  className="absolute left-[-1.5px] w-[3px] h-4 bg-[#FF6700] rounded-full shadow-[0_0_8px_#FF6700]"
                />
              )}

              {/* Name & Icon */}
              <button
                onClick={() => setActiveSubtopic(s)}
                className="flex items-center gap-2 text-[13px] font-medium w-full text-left outline-none"
              >
                <FiChevronRight className={`transition-transform duration-300 ${isActive ? "text-[#FF6700] rotate-90" : "opacity-0 -rotate-90 group-hover:opacity-100 group-hover:rotate-0"}`} size={14} />
                <span className={isActive ? "text-white" : ""}>{s}</span>
              </button>

              {/* Inline Quick Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(s); }}
                  className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <FiEdit3 size={12} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(s); }}
                  className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-colors"
                >
                  <FiTrash2 size={12} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 💡 Quick Tip (Pro Touch) */}
      <div className="mt-auto pt-6">
        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
          <p className="text-[9px] leading-relaxed text-gray-600 font-medium uppercase tracking-tighter">
            Pro Tip: Subtopics organize your deep-dives. Keep them concise for better navigation.
          </p>
        </div>
      </div>
    </div>
  );
}