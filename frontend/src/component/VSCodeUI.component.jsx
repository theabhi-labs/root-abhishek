import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaChrome, FaCode, FaSearch, FaChevronRight, FaChevronDown, FaRegFileCode } from 'react-icons/fa';
import { VscClose, VscFiles, VscSourceControl, VscExtensions, VscSettingsGear } from 'react-icons/vsc';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Premium Dark Theme

export default function VSCodePopup({ isOpen, onClose, project }) {
  const [activeTab, setActiveTab] = useState('files');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const fileTree = project?.fileTree || exampleTree;

  useEffect(() => {
    if (selectedFile) Prism.highlightAll();
  }, [selectedFile, activeTab]);

  // Handle Mobile Auto-Collapse Sidebar
  useEffect(() => {
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          {/* Backdrop with High-End Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Main Container */}
          <motion.div
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            className="relative w-full max-w-[1300px] h-[85vh] bg-[#181818] rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden flex flex-col"
          >
            
            {/* 1. TITLE BAR (Window Controls) */}
            <div className="h-10 bg-[#323233] flex items-center justify-between px-4 select-none">
              <div className="flex gap-2">
                <div onClick={onClose} className="w-3 h-3 rounded-full bg-[#ff5f56] cursor-pointer hover:brightness-110" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <div className="text-[11px] text-gray-400 font-medium">
                {project?.title || "Project"} — Visual Studio Code
              </div>
              <div className="w-12" />
            </div>

            <div className="flex-1 flex overflow-hidden">
              
              {/* 2. ACTIVITY BAR (Extreme Left) */}
              <div className="w-12 md:w-14 bg-[#333333] flex flex-col items-center py-4 gap-6 border-r border-white/5">
                <ActivityIcon icon={<VscFiles />} active={activeTab === 'files'} onClick={() => {setActiveTab('files'); setIsSidebarOpen(true)}} />
                <ActivityIcon icon={<FaSearch className="text-sm" />} />
                <ActivityIcon icon={<VscSourceControl />} />
                <ActivityIcon icon={<FaChrome />} active={activeTab === 'preview'} onClick={() => setActiveTab('preview')} />
                <div className="flex-1" />
                <ActivityIcon icon={<VscExtensions />} />
                <ActivityIcon icon={<VscSettingsGear />} />
              </div>

              {/* 3. SIDEBAR (Explorer) */}
              <AnimatePresence>
                {isSidebarOpen && activeTab === 'files' && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 260, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="bg-[#252526] border-r border-white/5 hidden md:flex flex-col"
                  >
                    <div className="p-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex justify-between items-center">
                      Explorer
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                      <div className="p-2">
                        {fileTree.map((item, i) => (
                          <FileItem
                            key={i}
                            item={item}
                            path={item.name}
                            onSelectFile={(file, path) => setSelectedFile({ ...file, path })}
                            selectedFile={selectedFile}
                            depth={0}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 4. EDITOR AREA */}
              <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden">
                
                {/* TABS & BREADCRUMBS */}
                <div className="h-9 bg-[#252526] flex items-center overflow-x-auto no-scrollbar">
                  {selectedFile && (
                    <div className="h-full px-4 flex items-center gap-2 bg-[#1e1e1e] border-t border-[#FF6700] text-xs text-white border-r border-black/20">
                      <FaRegFileCode className="text-blue-400" />
                      {selectedFile.name}
                      <VscClose className="ml-2 hover:bg-white/10 rounded" />
                    </div>
                  )}
                  <div className="flex-1 bg-[#252526]" />
                  <button onClick={() => window.open(project?.githubURL, '_blank')} className="px-4 text-gray-400 hover:text-white flex items-center gap-2 text-xs">
                    <FaGithub /> Repo
                  </button>
                </div>

                {/* BREADCRUMBS */}
                <div className="h-6 bg-[#1e1e1e] flex items-center px-4 text-[11px] text-gray-500 gap-2 border-b border-black/20">
                   {selectedFile?.path.split('/').map((p, i) => (
                     <React.Fragment key={i}>
                       <span className="hover:underline cursor-pointer">{p}</span>
                       {i !== selectedFile.path.split('/').length - 1 && <FaChevronRight className="text-[8px]" />}
                     </React.Fragment>
                   ))}
                </div>

                {/* ACTUAL CONTENT */}
                <div className="flex-1 overflow-hidden relative">
                  {activeTab === 'preview' ? (
                    <iframe src={project?.live || 'about:blank'} className="w-full h-full bg-white" title="Preview" />
                  ) : selectedFile ? (
                    <div className="h-full overflow-auto custom-scrollbar font-mono text-sm leading-relaxed">
                      <pre className="p-6 m-0">
                        <code className={`language-${selectedFile.language || 'javascript'}`}>
                          {selectedFile.content}
                        </code>
                      </pre>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 gap-4">
                      <FaCode className="text-6xl opacity-10" />
                      <p className="text-sm font-light">Select a file to view code or click Chrome icon for preview</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 5. STATUS BAR (Bottom) */}
            <div className="h-6 bg-[#FF6700] flex items-center justify-between px-3 text-[11px] text-black font-medium uppercase tracking-tighter">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 hover:bg-black/10 px-1 cursor-pointer">
                  <VscSourceControl /> main*
                </div>
                <div>0 Errors 0 Warnings</div>
              </div>
              <div className="flex items-center gap-4">
                <div>UTF-8</div>
                <div>{selectedFile?.language?.toUpperCase() || 'PLAINTEXT'}</div>
                <div className="bg-black/20 px-2">Abhishek-OS v1.0</div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Sub-Component: Activity Bar Icons
function ActivityIcon({ icon, active, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`relative cursor-pointer transition-all duration-200 group`}
    >
      {active && <div className="absolute -left-[14px] top-0 bottom-0 w-[2px] bg-white" />}
      <div className={`text-2xl ${active ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
        {icon}
      </div>
    </div>
  );
}

// Sub-Component: Recursive File Tree
function FileItem({ item, path, onSelectFile, selectedFile, depth }) {
  const [isOpen, setIsOpen] = useState(depth === 0);
  const isSelected = selectedFile?.path === path;

  if (item.type === 'folder') {
    return (
      <div className="select-none">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 py-[3px] px-2 hover:bg-[#2a2d2e] cursor-pointer text-gray-300 transition-colors"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {isOpen ? <FaChevronDown className="text-[10px]" /> : <FaChevronRight className="text-[10px]" />}
          <span className={`${isOpen ? 'text-blue-400' : ''} font-medium text-xs`}>{item.name}</span>
        </div>
        {isOpen && item.children?.map((child, i) => (
          <FileItem 
            key={i} 
            item={child} 
            path={`${path}/${child.name}`} 
            onSelectFile={onSelectFile} 
            selectedFile={selectedFile} 
            depth={depth + 1} 
          />
        ))}
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelectFile(item, path)}
      className={`flex items-center gap-2 py-[3px] px-2 cursor-pointer transition-all text-xs ${
        isSelected ? 'bg-[#37373d] text-white shadow-[inset_2px_0_0_#FF6700]' : 'text-gray-400 hover:bg-[#2a2d2e] hover:text-gray-200'
      }`}
      style={{ paddingLeft: `${depth * 12 + 20}px` }}
    >
      <FaRegFileCode className={isSelected ? 'text-blue-400' : 'text-gray-500'} />
      {item.name}
    </div>
  );
}

const exampleTree = [
    {
      name: 'src',
      type: 'folder',
      children: [
        {
          name: 'App.js',
          type: 'file',
          language: 'javascript',
          content: `import React from 'react';\n\nexport default function App(){\n  return (<div>Hi from App</div>);\n}`,
        },
      ],
    },
    {
      name: 'package.json',
      type: 'file',
      language: 'json',
      content: `{\n  "name": "demo",\n  "version": "1.0.0"\n}`,
    },
];
