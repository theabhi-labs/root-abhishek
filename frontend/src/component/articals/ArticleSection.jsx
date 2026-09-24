import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiPlus, FiBookOpen } from "react-icons/fi";

import Sidebar from "./Sidebar";
import SubtopicList from "./SubtopicList";
import ContentArea from "./ContentArea";
import ArticleEditorModal from "./ArticleEditorModal";
import { SAMPLE_ARTICLES } from "./sampleData";
import api from "../../config/api";

const STORAGE_KEY = "my_portfolio_articles_v2";

export default function ArticleSection() {
  const [articles, setArticles] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return SAMPLE_ARTICLES;
  });

  const [activeTopic, setActiveTopic] = useState(articles[0]?.topic || "javascript");
  const [activeSubtopic, setActiveSubtopic] = useState(articles[0]?.subtopic || "strings");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For Mobile
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorInitial, setEditorInitial] = useState(null);

  // Sync with backend on mount
  useEffect(() => {
    const fetchArticles = async () => {
      const data = await api.getArticles();
      if (data && data.length > 0) {
        setArticles(data);
        if (!activeTopic && data[0]?.topic) setActiveTopic(data[0].topic);
        if (!activeSubtopic && data[0]?.subtopic) setActiveSubtopic(data[0].subtopic);
      }
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  }, [articles]);

  const topics = useMemo(() => Array.from(new Set(articles.map((a) => a.topic))), [articles]);
  
  const subtopics = useMemo(() => {
    if (!activeTopic) return [];
    const set = new Set(articles.filter((a) => a.topic === activeTopic).map((a) => a.subtopic));
    return Array.from(set);
  }, [articles, activeTopic]);

  const selectedArticle = useMemo(() => {
    return articles.find((a) => a.topic === activeTopic && a.subtopic === activeSubtopic) || null;
  }, [articles, activeTopic, activeSubtopic]);

  // Actions
  const handleSave = async (payload) => {
    if (editorInitial?.id) {
      // Update article
      try {
        await api.updateArticle(editorInitial.id, payload);
      } catch (e) {
        console.warn('Backend update skipped:', e);
      }
      setArticles(prev => prev.map(a => a.id === editorInitial.id ? { ...a, ...payload, updatedAt: new Date().toLocaleString() } : a));
    } else {
      // Create article
      let newArt = { ...payload, createdAt: new Date().toLocaleString(), updatedAt: new Date().toLocaleString() };
      try {
        const res = await api.createArticle(payload);
        if (res?.data?.id) newArt.id = res.data.id;
      } catch (e) {
        console.warn('Backend create skipped:', e);
      }
      setArticles(prev => [newArt, ...prev]);
      setActiveTopic(newArt.topic);
      setActiveSubtopic(newArt.subtopic);
    }
    setEditorOpen(false);
    setEditorInitial(null);
  };

  const handleDelete = async (id, name) => {
    if (confirm(`Delete ${name || 'this article'}?`)) {
      try {
        if (id) await api.deleteArticle(id);
      } catch (e) {
        console.warn('Backend delete skipped:', e);
      }
      setArticles(prev => prev.filter(a => a.id !== id && !(a.topic === activeTopic && a.subtopic === name)));
      setActiveSubtopic(null);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] md:h-[750px] bg-[#080b12] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative text-gray-200">
      
      {/* 📱 MOBILE HEADER */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 bg-white/[0.02] border-b border-white/5">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-white/5 rounded-lg text-[#FF6700] cursor-pointer">
          <FiMenu size={20} />
        </button>
        <span className="font-bold tracking-tighter text-sm uppercase text-gray-400">Documentation & Articles</span>
        <button onClick={() => setEditorOpen(true)} className="p-2 bg-[#FF6700] text-black rounded-lg cursor-pointer">
          <FiPlus size={20} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* 1. TOPICS SIDEBAR (Responsive) */}
        <div className={`
          absolute inset-y-0 left-0 z-50 w-64 bg-[#0b0f1a] transform transition-transform duration-300 md:relative md:translate-x-0 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <Sidebar
            topics={topics}
            activeTopic={activeTopic}
            setActiveTopic={(t) => {
              setActiveTopic(t);
              setIsSidebarOpen(false); // Close drawer on mobile
            }}
            onNewClick={() => setEditorOpen(true)}
          />
          
          {/* Close overlay for mobile */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/60 md:hidden -z-10 left-64 w-screen" 
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </div>

        {/* 2. SUBTOPICS LIST (Secondary Navigation) */}
        <div className="hidden lg:block w-72 border-r border-white/5 bg-[#0d111d]/50">
          <SubtopicList
            subtopics={subtopics}
            activeSubtopic={activeSubtopic}
            setActiveSubtopic={setActiveSubtopic}
            onEdit={(name) => {
              const art = articles.find(a => a.topic === activeTopic && a.subtopic === name);
              if (art) { setEditorInitial(art); setEditorOpen(true); }
            }}
            onDelete={(name) => {
              const art = articles.find(a => a.topic === activeTopic && a.subtopic === name);
              handleDelete(art?.id, name);
            }}
            onNewSubtopic={() => {
              setEditorInitial({ topic: activeTopic, subtopic: "", title: "", summary: "", content: "" });
              setEditorOpen(true);
            }}
          />
        </div>

        {/* 3. CONTENT AREA */}
        <main className="flex-1 overflow-y-auto bg-[#080b12] custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTopic}-${activeSubtopic}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="p-6 md:p-12 min-h-full"
            >
              {/* Breadcrumbs for Mobile UX */}
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-8">
                <FiBookOpen className="text-[#FF6700]" />
                <span>{activeTopic || "No Topic"}</span>
                <span className="text-gray-700">/</span>
                <span className="text-white">{activeSubtopic || "Select Article"}</span>
              </div>

              <ContentArea
                article={selectedArticle}
                onEditArticle={(art) => { setEditorInitial(art); setEditorOpen(true); }}
                onDeleteArticle={(id) => {
                  handleDelete(id, selectedArticle?.title);
                }}
                placeholder={activeTopic ? "Explore the subtopics in the sidebar." : "Your knowledge base is empty."}
              />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* EDITOR MODAL */}
      <ArticleEditorModal
        open={editorOpen}
        topics={topics}
        initial={editorInitial}
        onClose={() => { setEditorOpen(false); setEditorInitial(null); }}
        onSave={handleSave}
      />
    </div>
  );
}