import React from "react";
import { motion } from "framer-motion";
import { FiPlus, FiHash, FiFolder } from "react-icons/fi";

export default function Sidebar({
  topics,
  activeTopic,
  setActiveTopic,
  onNewClick,
  compact,
}) {
  return (
    <aside
      className={`${
        compact ? "hidden md:flex" : "flex"
      } flex-col h-full w-full md:w-64 border-r border-white/5 bg-[#0b0f1a] p-5 overflow-y-auto custom-scrollbar transition-all duration-300`}
    >
      {/* 🚀 Sidebar Header */}
      <div className="flex items-center justify-between mb-8 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#FF6700] animate-pulse" />
          <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
            Catalog
          </h4>
        </div>
        <button
          onClick={onNewClick}
          className="p-1.5 bg-white/5 hover:bg-[#FF6700] text-[#FF6700] hover:text-black rounded-lg transition-all duration-300 border border-white/10"
          title="Create New Topic"
        >
          <FiPlus size={16} />
        </button>
      </div>

      {/* 📚 Topic List */}
      <nav className="flex-1 space-y-1.5">
        {topics.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 text-center">
            <FiFolder className="text-gray-700 mb-2" size={24} />
            <p className="text-gray-600 text-xs font-mono">// empty_catalog</p>
          </div>
        )}

        {topics.map((t) => {
          const isActive = activeTopic === t;
          return (
            <motion.button
              key={t}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTopic(t)}
              className={`group relative flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-white/[0.03] text-white shadow-[inset_0_0_20px_rgba(255,103,0,0.05)]"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]"
              }`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 w-1 h-6 bg-[#FF6700] rounded-r-full shadow-[0_0_10px_#FF6700]"
                />
              )}

              {/* Topic Icon/Avatar */}
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold border transition-colors
                ${isActive ? "bg-[#FF6700]/10 border-[#FF6700]/30 text-[#FF6700]" : "bg-white/5 border-white/5 group-hover:border-white/10"}
              `}>
                {t.charAt(0).toUpperCase()}
              </div>

              <span className={`text-sm font-medium capitalize tracking-tight ${isActive ? "font-bold" : ""}`}>
                {t}
              </span>

              {/* Hover Hash Icon */}
              {!isActive && (
                <FiHash className="ml-auto opacity-0 group-hover:opacity-20 transition-opacity" size={14} />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* 🛠 Footer Status */}
      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="bg-[#141a29] rounded-2xl p-4 border border-white/5">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Articles</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-white">{topics.length}</span>
            <span className="text-[10px] text-[#FF6700] font-mono">Topics Loaded</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

