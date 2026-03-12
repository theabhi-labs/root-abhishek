import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSave, FiX, FiEye, FiEdit3 } from "react-icons/fi";
import ReactMarkdown from "react-markdown"; // Optional: For live preview

export default function ArticleEditorModal({
  open,
  onClose,
  onSave,
  initial = null,
  topics = [],
}) {
  const [formData, setFormData] = useState({
    topic: "",
    subtopic: "",
    title: "",
    summary: "",
    content: "",
  });
  const [activeTab, setActiveTab] = useState("write"); // 'write' | 'preview'
  const textareaRef = useRef(null);

  useEffect(() => {
    if (open) {
      setFormData({
        topic: initial?.topic || "",
        subtopic: initial?.subtopic || "",
        title: initial?.title || "",
        summary: initial?.summary || "",
        content: initial?.content || "",
      });
      setActiveTab("write");
    }
  }, [open, initial]);

  // Auto-resize content area
  useEffect(() => {
    if (textareaRef.current && activeTab === "write") {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [formData.content, activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Bhai, Title aur Content zaroori hai!");
      return;
    }
    onSave({
      ...formData,
      topic: formData.topic.trim() || "Uncategorized",
      subtopic: formData.subtopic.trim() || "General",
    });
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Background Overlay */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-5xl h-[90vh] flex flex-col bg-[#0b0f1a] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FF6700]/10 rounded-lg">
                <FiEdit3 className="text-[#FF6700]" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                {initial ? "Edit Masterpiece" : "Draft New Article"}
              </h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-all">
              <FiX size={24} />
            </button>
          </div>

          {/* Editor Body */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {/* Meta Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Topic</label>
                <input
                  name="topic" value={formData.topic} onChange={handleChange}
                  list="topics-list" placeholder="e.g. React"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6700] outline-none transition-all"
                />
                <datalist id="topics-list">
                  {topics.map(t => <option key={t} value={t} />)}
                </datalist>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Subtopic</label>
                <input
                  name="subtopic" value={formData.subtopic} onChange={handleChange}
                  placeholder="e.g. Performance Hooks"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6700] outline-none transition-all"
                />
              </div>
            </div>

            {/* Title & Summary */}
            <div className="space-y-6 mb-8">
              <input
                name="title" value={formData.title} onChange={handleChange}
                placeholder="The Art of Clean Code..."
                className="w-full bg-transparent text-4xl md:text-5xl font-black text-white placeholder:text-white/10 outline-none border-none p-0"
              />
              <textarea
                name="summary" value={formData.summary} onChange={handleChange}
                placeholder="A brief summary to catch the reader's eye..."
                rows={2}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-gray-300 focus:border-[#FF6700] outline-none transition-all resize-none"
              />
            </div>

            {/* Content Control Tabs */}
            <div className="flex gap-4 mb-4 border-b border-white/5 pb-2">
              <button 
                onClick={() => setActiveTab("write")}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest pb-2 transition-all ${activeTab === 'write' ? 'text-[#FF6700] border-b-2 border-[#FF6700]' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <FiEdit3 /> Write
              </button>
              <button 
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest pb-2 transition-all ${activeTab === 'preview' ? 'text-[#FF6700] border-b-2 border-[#FF6700]' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <FiEye /> Preview
              </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[300px]">
              {activeTab === "write" ? (
                <textarea
                  ref={textareaRef} name="content" value={formData.content} onChange={handleChange}
                  placeholder="Start your story... (Markdown supported)"
                  className="w-full bg-transparent text-gray-300 font-mono leading-relaxed outline-none resize-none py-4"
                />
              ) : (
                <div className="prose prose-invert max-w-none py-4">
                  <ReactMarkdown>{formData.content || "*Nothing to preview yet...*"}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-5 border-t border-white/5 bg-white/[0.02] flex justify-end gap-4">
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              Discard
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-8 py-2.5 bg-[#FF6700] text-black font-black uppercase tracking-widest rounded-xl hover:bg-[#e85f00] hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,103,0,0.3)]"
            >
              <FiSave /> Save Article
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
