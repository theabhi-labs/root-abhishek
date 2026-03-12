import React from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { FiEdit3, FiTrash2, FiClock } from "react-icons/fi";
import "highlight.js/styles/atom-one-dark.css";

export default function ContentArea({
  article,
  onEditArticle,
  onDeleteArticle,
  placeholder,
}) {
  if (!article)
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-500 italic p-8 bg-[#080b12]">
        <div className="w-16 h-16 border-2 border-dashed border-gray-700 rounded-full flex items-center justify-center mb-4">
            <FiEdit3 className="text-2xl opacity-20" />
        </div>
        <p className="text-sm font-mono tracking-widest">{placeholder}</p>
      </div>
    );

  return (
    <motion.div
      key={article.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex-1 flex flex-col bg-[#080b12] text-gray-100 h-full relative"
    >
      {/* 🚀 TOP ACTION BAR - Responsive & Sticky */}
      <div className="sticky top-0 z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-6 md:px-12 bg-[#080b12]/80 backdrop-blur-md border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#FF6700] mb-2">
            <span className="opacity-50">{article.topic}</span>
            <span className="text-gray-700">/</span>
            <span>{article.subtopic}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none">
            {article.title}
          </h2>
          <div className="flex items-center gap-4 mt-4 text-[11px] font-mono text-gray-500 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><FiClock /> {article.createdAt}</span>
            {article.updatedAt && (
              <span className="hidden sm:inline text-white/20">| Updated: {article.updatedAt}</span>
            )}
          </div>
        </div>

        {/* Buttons - Compact on Mobile */}
        <div className="flex gap-3 self-end md:self-center">
          <button
            onClick={() => onEditArticle(article)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-[#FF6700] text-white hover:text-black rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 border border-white/10"
          >
            <FiEdit3 /> <span className="hidden sm:inline">Edit</span>
          </button>
          <button
            onClick={() => onDeleteArticle(article.id)}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 border border-red-500/20"
          >
            <FiTrash2 /> <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>

      {/* 📖 MARKDOWN CONTENT - Responsive Typography */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto px-6 py-10 md:px-12 md:py-16">
          <div className="prose prose-invert max-w-none 
                        prose-p:text-gray-400 prose-p:leading-loose prose-p:text-lg
                        prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-white
                        prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                        prose-code:bg-[#1A1A1A] prose-code:text-[#FF6700] prose-code:px-2 prose-code:py-0.5 prose-code:rounded-lg prose-code:before:content-none prose-code:after:content-none
                        prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-white/5 prose-pre:rounded-2xl prose-pre:p-6 prose-pre:shadow-2xl
                        prose-a:text-[#FF6700] hover:prose-a:text-white prose-a:no-underline prose-a:border-b prose-a:border-[#FF6700]/30
                        prose-blockquote:border-l-4 prose-blockquote:border-[#FF6700] prose-blockquote:bg-white/[0.02] prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl
                        prose-img:rounded-3xl prose-img:border prose-img:border-white/10"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {article.content}
            </ReactMarkdown>
          </div>
          
          {/* Subtle Bottom Spacer */}
          <div className="h-24" />
        </div>
      </div>
    </motion.div>
  );
}