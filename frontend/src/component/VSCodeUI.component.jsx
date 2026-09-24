import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaGithub, FaChrome, FaCode, FaSearch, FaChevronRight, FaChevronDown,
  FaRegFileCode, FaFolder, FaFolderOpen, FaSpinner, FaCheck, FaLock, FaExpand, FaCompress
} from 'react-icons/fa';
import { VscClose, VscFiles, VscSourceControl, VscExtensions, VscSettingsGear, VscRefresh } from 'react-icons/vsc';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import api from '../config/api';

export default function VSCodePopup({ isOpen, onClose, project }) {
  const [activeTab, setActiveTab] = useState('files');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [fileTree, setFileTree] = useState([]);
  const [loadingTree, setLoadingTree] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  const [githubUser, setGithubUser] = useState(() => {
    try {
      const u = localStorage.getItem('github_user_profile');
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [personalTokenInput, setPersonalTokenInput] = useState('');
  const [repoBranch, setRepoBranch] = useState('main');

  const repoName = project?.githubRepo || project?.title?.toLowerCase().replace(/\s+/g, '-') || 'theabhi-labs/portfolio';

  // Fetch live repo tree on open or project change
  useEffect(() => {
    if (!isOpen || !project) return;

    const loadTree = async () => {
      setLoadingTree(true);
      try {
        const res = await api.getRepoTree(repoName);
        if (res && res.tree && res.tree.length > 0) {
          setFileTree(res.tree);
          if (res.branch) setRepoBranch(res.branch);

          // Find first source file to auto-select
          const findFirstFile = (nodes) => {
            for (const node of nodes) {
              if (node.type === 'file') return node;
              if (node.children) {
                const f = findFirstFile(node.children);
                if (f) return f;
              }
            }
            return null;
          };

          const first = findFirstFile(res.tree);
          if (first) {
            loadFileContent(first, first.path);
          }
        } else if (project?.fileTree) {
          setFileTree(project.fileTree);
          if (project.fileTree[0]?.children?.[0]) {
            setSelectedFile(project.fileTree[0].children[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching repo tree:', err);
        if (project?.fileTree) setFileTree(project.fileTree);
      } finally {
        setLoadingTree(false);
      }
    };

    loadTree();
  }, [isOpen, project, repoName]);

  // Highlight code on file change
  useEffect(() => {
    if (selectedFile?.content) {
      setTimeout(() => {
        Prism.highlightAll();
      }, 50);
    }
  }, [selectedFile, activeTab]);

  // Load File Content dynamically
  const loadFileContent = async (file, path) => {
    if (file.content) {
      setSelectedFile({ ...file, path });
      return;
    }

    setLoadingFile(true);
    setSelectedFile({ ...file, path, content: '// Fetching live file from GitHub...' });

    try {
      const res = await api.getFileContent(repoName, path, repoBranch);
      if (res && res.content !== undefined) {
        setSelectedFile({
          ...file,
          path,
          language: res.language || file.language || 'javascript',
          content: res.content
        });
      }
    } catch (err) {
      console.error('Error loading file content:', err);
      setSelectedFile({
        ...file,
        path,
        content: `// Error loading file: ${err.message}\n// Please check GitHub API access.`
      });
    } finally {
      setLoadingFile(false);
    }
  };

  const handleSaveToken = (e) => {
    e.preventDefault();
    if (personalTokenInput.trim()) {
      localStorage.setItem('github_user_token', personalTokenInput.trim());
      setGithubUser({ login: 'Authenticated User' });
      setShowAuthModal(false);
      // Reload tree
      api.getRepoTree(repoName).then(res => {
        if (res?.tree) setFileTree(res.tree);
      });
    }
  };

  const handleOAuthConnect = async () => {
    try {
      const res = await api.getGitHubAuthUrl();
      if (res.success && res.url) {
        window.open(res.url, '_blank', 'width=600,height=700');
      } else {
        alert('GitHub OAuth client credentials can be configured in Admin Settings.');
      }
    } catch (err) {
      console.error('OAuth error:', err);
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (showAuthModal) setShowAuthModal(false);
        else onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showAuthModal, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-xl cursor-default"
        >
          
          {/* Main Container - Full Screen by Default */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`relative bg-[#181818] shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden flex flex-col transition-all duration-300 ${
              isFullscreen
                ? 'w-screen h-screen rounded-none'
                : 'w-[95vw] max-w-[1400px] h-[90vh] rounded-2xl'
            }`}
          >
            
            {/* 1. TITLE BAR (Window Controls + Repo Info + Fullscreen Toggle + Close Button) */}
            <div className="h-10 bg-[#323233] flex items-center justify-between px-4 select-none border-b border-black/40">
              <div className="flex items-center gap-2">
                <div onClick={onClose} className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] cursor-pointer hover:brightness-125 transition-all flex items-center justify-center group" title="Close">
                  <span className="text-[9px] text-black font-bold opacity-0 group-hover:opacity-100">✕</span>
                </div>
                <div onClick={() => setIsFullscreen(!isFullscreen)} className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] cursor-pointer hover:brightness-125 transition-all" title="Minimize / Restore" />
                <div onClick={() => setIsFullscreen(!isFullscreen)} className="w-3.5 h-3.5 rounded-full bg-[#27c93f] cursor-pointer hover:brightness-125 transition-all" title="Toggle Fullscreen" />
              </div>

              {/* Title & Repo coordinates */}
              <div className="flex items-center gap-2 text-[11px] text-gray-300 font-mono truncate max-w-md">
                <FaGithub className="text-white" />
                <span className="text-[#FF6700] font-bold">{repoName}</span>
                <span className="text-gray-500">({repoBranch})</span>
                <span className="text-gray-400 hidden sm:inline">&mdash; Visual Studio Code</span>
              </div>

              {/* Right Title Controls */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 hover:bg-[#FF6700] hover:text-black text-[10px] font-mono text-gray-300 transition-all cursor-pointer"
                >
                  <FaGithub size={12} />
                  <span>{githubUser ? `@${githubUser.login}` : 'GitHub Auth'}</span>
                </button>

                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="text-gray-400 hover:text-white p-1 transition-colors cursor-pointer hidden sm:block"
                  title={isFullscreen ? "Restore Window" : "Full Screen"}
                >
                  {isFullscreen ? <FaCompress size={12} /> : <FaExpand size={12} />}
                </button>

                {/* 🔴 PROMINENT CLOSE BUTTON */}
                <button
                  onClick={onClose}
                  className="flex items-center gap-1 px-2.5 py-1 bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white rounded-md text-[11px] font-mono font-bold transition-all border border-red-500/40 cursor-pointer shadow-sm ml-1"
                  title="Close Inspector (Esc)"
                >
                  <VscClose size={16} />
                  <span>Close</span>
                </button>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              
              {/* 2. ACTIVITY BAR (Extreme Left) */}
              <div className="w-12 md:w-14 bg-[#333333] flex flex-col items-center py-4 gap-6 border-r border-white/5 flex-shrink-0">
                <ActivityIcon
                  icon={<VscFiles size={22} />}
                  active={activeTab === 'files'}
                  onClick={() => { setActiveTab('files'); setIsSidebarOpen(true); }}
                  title="Explorer"
                />
                <ActivityIcon
                  icon={<FaSearch size={16} />}
                  active={activeTab === 'search'}
                  onClick={() => setActiveTab('search')}
                  title="Search"
                />
                <ActivityIcon
                  icon={<VscSourceControl size={22} />}
                  active={activeTab === 'git'}
                  onClick={() => setActiveTab('git')}
                  title="Source Control"
                />
                {project?.live && (
                  <ActivityIcon
                    icon={<FaChrome size={18} className="text-cyan-400" />}
                    active={activeTab === 'preview'}
                    onClick={() => setActiveTab('preview')}
                    title="Live Web Preview"
                  />
                )}
                <div className="flex-1" />
                <ActivityIcon
                  icon={<FaGithub size={18} />}
                  active={showAuthModal}
                  onClick={() => setShowAuthModal(true)}
                  title="GitHub Authorization"
                />
                <ActivityIcon
                  icon={<VscSettingsGear size={20} />}
                  title="Settings"
                />
              </div>

              {/* 3. SIDEBAR (Explorer File Tree) */}
              <AnimatePresence>
                {isSidebarOpen && activeTab === 'files' && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 280, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="bg-[#252526] border-r border-white/5 flex flex-col flex-shrink-0 select-none overflow-hidden"
                  >
                    <div className="p-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex justify-between items-center border-b border-white/5">
                      <span className="truncate">Explorer: {project?.title || "Workspace"}</span>
                      {loadingTree && <FaSpinner className="animate-spin text-[#FF6700]" size={12} />}
                    </div>

                    {/* Repository Root Node */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                      <div className="text-[11px] font-bold font-mono text-gray-400 px-2 py-1 flex items-center justify-between">
                        <span className="uppercase text-[10px] tracking-wider text-gray-500">Files & Structure</span>
                        <span className="text-[9px] bg-black/40 px-2 py-0.5 rounded text-[#FF6700]">LIVE GITHUB</span>
                      </div>

                      {loadingTree ? (
                        <div className="p-6 text-center space-y-2 text-gray-500 font-mono text-xs">
                          <FaSpinner className="animate-spin text-[#FF6700] mx-auto text-lg" />
                          <p>Cloning File Tree...</p>
                        </div>
                      ) : (
                        <div className="mt-1">
                          {fileTree.map((item, i) => (
                            <FileItem
                              key={i}
                              item={item}
                              path={item.path || item.name}
                              onSelectFile={loadFileContent}
                              selectedFile={selectedFile}
                              depth={0}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Sidebar Footer Link */}
                    <div className="p-2 border-t border-white/5 bg-[#1e1e1e] text-[10px] font-mono text-gray-400 flex items-center justify-between">
                      <span className="truncate">Repo: {repoName}</span>
                      <a
                        href={project?.githubURL || `https://github.com/${repoName}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#FF6700] hover:underline flex items-center gap-1"
                      >
                        GitHub &rarr;
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 4. MAIN EDITOR AREA */}
              <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden">
                
                {/* TABS HEADER */}
                <div className="h-9 bg-[#252526] flex items-center overflow-x-auto no-scrollbar border-b border-black/40">
                  {selectedFile && (
                    <div className="h-full px-4 flex items-center gap-2 bg-[#1e1e1e] border-t-2 border-[#FF6700] text-xs text-white border-r border-black/20 font-mono">
                      <FaRegFileCode className="text-blue-400" />
                      <span>{selectedFile.name}</span>
                      {loadingFile && <FaSpinner className="animate-spin text-[#FF6700]" size={10} />}
                    </div>
                  )}

                  {activeTab === 'preview' && (
                    <div className="h-full px-4 flex items-center gap-2 bg-[#1e1e1e] border-t-2 border-cyan-400 text-xs text-white border-r border-black/20 font-mono">
                      <FaChrome className="text-cyan-400" />
                      <span>Live App Preview</span>
                    </div>
                  )}

                  <div className="flex-1 bg-[#252526]" />

                  {project?.githubURL && (
                    <a
                      href={project.githubURL}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 text-gray-400 hover:text-white flex items-center gap-1.5 text-xs font-mono"
                    >
                      <FaGithub /> Open on GitHub
                    </a>
                  )}
                </div>

                {/* BREADCRUMBS BAR */}
                <div className="h-6 bg-[#1e1e1e] flex items-center px-4 text-[11px] text-gray-500 gap-2 border-b border-black/20 font-mono">
                  <span>{repoName}</span>
                  <FaChevronRight className="text-[8px]" />
                  {selectedFile?.path ? (
                    selectedFile.path.split('/').map((p, i, arr) => (
                      <React.Fragment key={i}>
                        <span className={i === arr.length - 1 ? 'text-white' : 'hover:underline cursor-pointer'}>
                          {p}
                        </span>
                        {i !== arr.length - 1 && <FaChevronRight className="text-[8px]" />}
                      </React.Fragment>
                    ))
                  ) : (
                    <span>Select a file from Explorer</span>
                  )}
                </div>

                {/* CODE EDITOR CONTENT / LIVE PREVIEW */}
                <div className="flex-1 overflow-hidden relative bg-[#1e1e1e]">
                  {activeTab === 'preview' ? (
                    <iframe
                      src={project?.live || 'about:blank'}
                      className="w-full h-full bg-white"
                      title="Live Project Preview"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    />
                  ) : selectedFile ? (
                    <div className="h-full overflow-auto custom-scrollbar font-mono text-sm leading-relaxed p-6">
                      <pre className="m-0">
                        <code className={`language-${selectedFile.language || 'javascript'}`}>
                          {selectedFile.content || '// Loading content...'}
                        </code>
                      </pre>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 gap-4">
                      <FaCode className="text-6xl opacity-10" />
                      <p className="text-sm font-mono font-light text-gray-500">
                        Select any file from the GitHub repository tree to inspect live source code.
                      </p>
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* 5. STATUS BAR (Bottom) */}
            <div className="h-6 bg-[#FF6700] flex items-center justify-between px-3 text-[11px] text-black font-mono font-semibold uppercase tracking-tight select-none">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 hover:bg-black/10 px-1 cursor-pointer">
                  <VscSourceControl /> {repoBranch}*
                </div>
                <div className="hidden sm:block">0 Errors 0 Warnings</div>
                <div className="text-[10px] hidden md:block">GitHub REST API &bull; Live Tree Sync</div>
              </div>
              <div className="flex items-center gap-4">
                <div>UTF-8</div>
                <div>{selectedFile?.language?.toUpperCase() || 'JAVASCRIPT'}</div>
                <div className="bg-black/20 px-2 rounded">root@abhishek-OS</div>
              </div>
            </div>

          </motion.div>

          {/* 🚀 GITHUB AUTH & TOKEN MODAL */}
          <AnimatePresence>
            {showAuthModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[130] p-6"
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  className="bg-[#141824] p-8 rounded-3xl max-w-md w-full border border-[#FF6700]/30 shadow-2xl space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FF6700]/10 text-[#FF6700] flex items-center justify-center text-xl">
                        <FaGithub />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">GitHub Authorization</h3>
                        <p className="text-xs text-gray-400 font-mono">Unlock 5,000 req/hr GitHub rate limit</p>
                      </div>
                    </div>
                    <button onClick={() => setShowAuthModal(false)} className="text-gray-400 hover:text-white">
                      <VscClose size={20} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={handleOAuthConnect}
                      className="w-full py-3.5 bg-[#24292e] hover:bg-[#2f363d] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 border border-white/10 cursor-pointer"
                    >
                      <FaGithub size={16} /> Sign in with GitHub OAuth
                    </button>

                    <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                      <div className="flex-1 h-[1px] bg-white/10" />
                      <span>OR USE PERSONAL TOKEN</span>
                      <div className="flex-1 h-[1px] bg-white/10" />
                    </div>

                    <form onSubmit={handleSaveToken} className="space-y-3">
                      <div>
                        <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                          Personal Access Token (classic or fine-grained)
                        </label>
                        <input
                          type="password"
                          value={personalTokenInput}
                          onChange={(e) => setPersonalTokenInput(e.target.value)}
                          placeholder="ghp_xxxxxxxxxxxxxx"
                          className="w-full p-3 rounded-xl bg-[#080b12] border border-white/10 text-white font-mono text-xs focus:border-[#FF6700] outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3 bg-[#FF6700] text-black font-black uppercase text-xs tracking-wider rounded-xl hover:brightness-110 transition-all cursor-pointer"
                      >
                        Save & Apply Token
                      </button>
                    </form>
                  </div>

                  <div className="text-[11px] text-gray-500 font-mono text-center">
                    Credentials are stored securely in local browser session.
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}
    </AnimatePresence>
  );
}

// Sub-Component: Activity Bar Icons
function ActivityIcon({ icon, active, onClick, title }) {
  return (
    <div 
      onClick={onClick}
      title={title}
      className={`relative cursor-pointer transition-all duration-200 group p-1`}
    >
      {active && <div className="absolute -left-[14px] top-0 bottom-0 w-[2px] bg-white" />}
      <div className={`${active ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
        {icon}
      </div>
    </div>
  );
}

// Sub-Component: Recursive File Tree Item
function FileItem({ item, path, onSelectFile, selectedFile, depth }) {
  const [isOpen, setIsOpen] = useState(depth === 0 || depth === 1);
  const isSelected = selectedFile?.path === path;

  if (item.type === 'folder' || item.children) {
    return (
      <div className="select-none font-mono">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 py-[3px] px-2 hover:bg-[#2a2d2e] cursor-pointer text-gray-300 transition-colors text-xs"
          style={{ paddingLeft: `${depth * 14 + 8}px` }}
        >
          {isOpen ? <FaChevronDown className="text-[9px] text-gray-500" /> : <FaChevronRight className="text-[9px] text-gray-500" />}
          {isOpen ? <FaFolderOpen className="text-yellow-500 text-xs" /> : <FaFolder className="text-yellow-600 text-xs" />}
          <span className={`truncate ${isOpen ? 'text-white font-medium' : 'text-gray-400'}`}>{item.name}</span>
        </div>
        {isOpen && item.children?.map((child, i) => (
          <FileItem 
            key={i} 
            item={child} 
            path={child.path || `${path}/${child.name}`} 
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
      className={`flex items-center gap-2 py-[3px] px-2 cursor-pointer transition-all text-xs font-mono select-none ${
        isSelected
          ? 'bg-[#37373d] text-white shadow-[inset_2px_0_0_#FF6700]'
          : 'text-gray-400 hover:bg-[#2a2d2e] hover:text-gray-200'
      }`}
      style={{ paddingLeft: `${depth * 14 + 20}px` }}
    >
      <FaRegFileCode className={isSelected ? 'text-[#FF6700]' : 'text-blue-400'} size={12} />
      <span className="truncate">{item.name}</span>
    </div>
  );
}
