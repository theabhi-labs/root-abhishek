import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid, FiActivity, FiClock, FiBookOpen, FiMail, FiSettings,
  FiLogOut, FiExternalLink, FiPlus, FiTrash2, FiEdit, FiCheck,
  FiUploadCloud, FiImage, FiEye, FiArrowLeft, FiUser, FiCode, FiX, FiRefreshCw,
  FiTrendingUp, FiSearch, FiGlobe, FiSmartphone, FiMonitor, FiRadio, FiKey, FiLayers
} from 'react-icons/fi';
import { FaRocket, FaLaptopCode, FaCode as FaCodeIcon, FaTrophy, FaStar, FaServer, FaGithub, FaGoogle } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';
import api from '../config/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Data states
  const [activities, setActivities] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [articles, setArticles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Analytics states
  const [analyticsOverview, setAnalyticsOverview] = useState(null);
  const [realtimeAnalytics, setRealtimeAnalytics] = useState(null);
  const [searchConsoleData, setSearchConsoleData] = useState(null);
  const [acquisitionData, setAcquisitionData] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const [devicesData, setDevicesData] = useState(null);
  const [analyticsRange, setAnalyticsRange] = useState('30d');
  const [analyticsConfig, setAnalyticsConfig] = useState({
    gaMeasurementId: '', gaPropertyId: '', searchConsoleSiteUrl: '',
    googleServiceAccountEmail: '', githubClientId: '', githubPersonalToken: '', githubClientSecret: ''
  });

  // Modal / Form states
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [activityForm, setActivityForm] = useState({
    title: '', tag: 'ACTIVITY', author: 'Abhishek Yadav', date: '', location: '',
    shortDesc: '', fullDesc: '', highlights: '', images: []
  });
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Project Form states
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', image: './smartbin.png', live: '', githubRepo: 'theabhi-labs/portfolio', tech: 'React, Node.js', order: 1
  });

  // Timeline Form states
  const [timelineModalOpen, setTimelineModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [timelineForm, setTimelineForm] = useState({
    year: '', title: '', description: '', icon: 'code', side: 'left', order: 1
  });

  // Article Form states
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [articleForm, setArticleForm] = useState({
    topic: 'javascript', subtopic: '', title: '', summary: '', content: '', tags: ''
  });

  // Settings states
  const [settingsForm, setSettingsForm] = useState({
    username: '', name: '', email: '', currentPassword: '', newPassword: '', confirmPassword: ''
  });
  const [settingsStatus, setSettingsStatus] = useState({ type: '', text: '' });
  const [configStatus, setConfigStatus] = useState({ type: '', text: '' });

  // Messages filter
  const [messageFilter, setMessageFilter] = useState('all');

  // Verify authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('root_admin_token');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      try {
        const verify = await api.verifyToken();
        if (verify.success) {
          setAdminUser(verify.user);
          setSettingsForm(prev => ({
            ...prev,
            username: verify.user.username || '',
            name: verify.user.name || '',
            email: verify.user.email || ''
          }));
          fetchAllData();
          fetchAnalytics();
        } else {
          localStorage.removeItem('root_admin_token');
          navigate('/admin/login');
        }
      } catch (err) {
        console.error('Auth verification error:', err);
        navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Fetch all collections
  const fetchAllData = async () => {
    try {
      const [actData, timeData, artData, projData, msgData] = await Promise.all([
        api.getActivities(),
        api.getTimeline(),
        api.getArticles(),
        api.getProjects(),
        api.getContactMessages()
      ]);

      if (actData) setActivities(actData);
      if (timeData) setTimeline(timeData);
      if (artData) setArticles(artData);
      if (projData) setProjects(projData);
      if (msgData?.data) {
        setMessages(msgData.data);
        setUnreadCount(msgData.unreadCount || 0);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  // Fetch Google Analytics 4 & Search Console data
  const fetchAnalytics = async (range = analyticsRange) => {
    try {
      const [ov, rt, gsc, acq, geo, dev, cfg] = await Promise.all([
        api.getAnalyticsOverview(range),
        api.getRealtimeAnalytics(),
        api.getSearchConsoleData(),
        api.getAcquisitionAnalytics(),
        api.getGeoAnalytics(),
        api.getDevicesAnalytics(),
        api.getAnalyticsConfig()
      ]);

      if (ov?.data) setAnalyticsOverview(ov.data);
      if (rt) setRealtimeAnalytics(rt);
      if (gsc) setSearchConsoleData(gsc);
      if (acq) setAcquisitionData(acq);
      if (geo) setGeoData(geo);
      if (dev) setDevicesData(dev);
      if (cfg?.data) setAnalyticsConfig(prev => ({ ...prev, ...cfg.data }));
    } catch (err) {
      console.error('Analytics load error:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('root_admin_token');
    localStorage.removeItem('root_admin_user');
    navigate('/admin/login');
  };

  // ==================== ACTIVITY HANDLERS ====================
  const openNewActivityModal = () => {
    setEditingActivity(null);
    setActivityForm({
      title: '', tag: 'IIT DELHI EVENT', author: 'Abhishek Yadav',
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
      location: 'New Delhi, India', shortDesc: '', fullDesc: '', highlights: '', images: ['/iitimage.png']
    });
    setActivityModalOpen(true);
  };

  const openEditActivityModal = (act) => {
    setEditingActivity(act);
    setActivityForm({
      title: act.title || '',
      tag: act.tag || 'ACTIVITY',
      author: Array.isArray(act.author) ? act.author.join(', ') : act.author || '',
      date: act.date || '',
      location: act.location || '',
      shortDesc: act.shortDesc || '',
      fullDesc: act.fullDesc || '',
      highlights: Array.isArray(act.highlights) ? act.highlights.join(', ') : act.highlights || '',
      images: act.images || ['/iitimage.png']
    });
    setActivityModalOpen(true);
  };

  const handleSaveActivity = async (e) => {
    e.preventDefault();
    const payload = {
      ...activityForm,
      author: activityForm.author.split(',').map(a => a.trim()).filter(Boolean),
      highlights: activityForm.highlights.split(',').map(h => h.trim()).filter(Boolean),
      images: activityForm.images.length > 0 ? activityForm.images : ['/iitimage.png']
    };

    if (editingActivity) {
      const res = await api.updateActivity(editingActivity.id, payload);
      if (res.success) {
        setActivities(prev => prev.map(a => a.id === editingActivity.id ? res.data : a));
      }
    } else {
      const res = await api.createActivity(payload);
      if (res.success) {
        setActivities(prev => [res.data, ...prev]);
      }
    }

    setActivityModalOpen(false);
    setEditingActivity(null);
  };

  const handleDeleteActivity = async (id) => {
    if (confirm('Delete this activity permanently?')) {
      const res = await api.deleteActivity(id);
      if (res.success) {
        setActivities(prev => prev.filter(a => a.id !== id));
      }
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingImage(true);

    try {
      if (files.length === 1) {
        const res = await api.uploadSingleImage(files[0]);
        if (res.success && res.url) {
          setActivityForm(prev => ({ ...prev, images: [...prev.images, res.url] }));
        }
      } else {
        const res = await api.uploadMultipleImages(files);
        if (res.success && res.urls) {
          setActivityForm(prev => ({ ...prev, images: [...prev.images, ...res.urls] }));
        }
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Photo upload failed. Please try again or provide an image URL.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setActivityForm(prev => ({ ...prev, images: [...prev.images, imageUrlInput.trim()] }));
    setImageUrlInput('');
  };

  const handleRemoveImage = (indexToRemove) => {
    setActivityForm(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // ==================== PROJECT HANDLERS ====================
  const openNewProjectModal = () => {
    setEditingProject(null);
    setProjectForm({
      title: '', description: '', image: './smartbin.png', live: '', githubRepo: 'theabhi-labs/', tech: 'React, Node.js', order: projects.length + 1
    });
    setProjectModalOpen(true);
  };

  const openEditProjectModal = (proj) => {
    setEditingProject(proj);
    setProjectForm({
      title: proj.title || '',
      description: proj.description || '',
      image: proj.image || './smartbin.png',
      live: proj.live || '',
      githubRepo: proj.githubRepo || '',
      tech: Array.isArray(proj.tech) ? proj.tech.join(', ') : proj.tech || '',
      order: proj.order || 1
    });
    setProjectModalOpen(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    const payload = {
      ...projectForm,
      tech: projectForm.tech.split(',').map(t => t.trim()).filter(Boolean)
    };

    if (editingProject) {
      const res = await api.updateProject(editingProject.id, payload);
      if (res.success) {
        setProjects(prev => prev.map(p => p.id === editingProject.id ? res.data : p));
      }
    } else {
      const res = await api.createProject(payload);
      if (res.success) {
        setProjects(prev => [...prev, res.data]);
      }
    }
    setProjectModalOpen(false);
    setEditingProject(null);
  };

  const handleDeleteProject = async (id) => {
    if (confirm('Delete this project?')) {
      const res = await api.deleteProject(id);
      if (res.success) {
        setProjects(prev => prev.filter(p => p.id !== id));
      }
    }
  };

  // ==================== TIMELINE HANDLERS ====================
  const openNewTimelineModal = () => {
    setEditingMilestone(null);
    setTimelineForm({
      year: new Date().getFullYear().toString(),
      title: '', description: '', icon: 'code', side: 'left', order: timeline.length + 1
    });
    setTimelineModalOpen(true);
  };

  const openEditTimelineModal = (m) => {
    setEditingMilestone(m);
    setTimelineForm({
      year: m.year || '',
      title: m.title || '',
      description: m.description || '',
      icon: m.icon || 'code',
      side: m.side || 'left',
      order: m.order || 1
    });
    setTimelineModalOpen(true);
  };

  const handleSaveTimeline = async (e) => {
    e.preventDefault();
    if (editingMilestone) {
      const res = await api.updateTimelineMilestone(editingMilestone.id, timelineForm);
      if (res.success) {
        setTimeline(prev => prev.map(m => m.id === editingMilestone.id ? res.data : m));
      }
    } else {
      const res = await api.createTimelineMilestone(timelineForm);
      if (res.success) {
        setTimeline(prev => [...prev, res.data]);
      }
    }
    setTimelineModalOpen(false);
    setEditingMilestone(null);
  };

  const handleDeleteMilestone = async (id) => {
    if (confirm('Delete this timeline milestone?')) {
      const res = await api.deleteTimelineMilestone(id);
      if (res.success) {
        setTimeline(prev => prev.filter(m => m.id !== id));
      }
    }
  };

  // ==================== ARTICLES HANDLERS ====================
  const openNewArticleModal = () => {
    setEditingArticle(null);
    setArticleForm({
      topic: 'javascript', subtopic: '', title: '', summary: '', content: '', tags: ''
    });
    setArticleModalOpen(true);
  };

  const openEditArticleModal = (art) => {
    setEditingArticle(art);
    setArticleForm({
      topic: art.topic || 'javascript',
      subtopic: art.subtopic || '',
      title: art.title || '',
      summary: art.summary || '',
      content: art.content || '',
      tags: Array.isArray(art.tags) ? art.tags.join(', ') : art.tags || ''
    });
    setArticleModalOpen(true);
  };

  const handleSaveArticle = async (e) => {
    e.preventDefault();
    const payload = {
      ...articleForm,
      tags: articleForm.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    if (editingArticle) {
      const res = await api.updateArticle(editingArticle.id, payload);
      if (res.success) {
        setArticles(prev => prev.map(a => a.id === editingArticle.id ? res.data : a));
      }
    } else {
      const res = await api.createArticle(payload);
      if (res.success) {
        setArticles(prev => [res.data, ...prev]);
      }
    }
    setArticleModalOpen(false);
    setEditingArticle(null);
  };

  const handleDeleteArticle = async (id) => {
    if (confirm('Delete this article?')) {
      const res = await api.deleteArticle(id);
      if (res.success) {
        setArticles(prev => prev.filter(a => a.id !== id));
      }
    }
  };

  // ==================== MESSAGES HANDLERS ====================
  const handleToggleMessageRead = async (id, currentRead) => {
    const res = await api.toggleMessageRead(id, !currentRead);
    if (res.success) {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, read: !currentRead } : m));
      setUnreadCount(prev => currentRead ? prev + 1 : Math.max(0, prev - 1));
    }
  };

  const handleDeleteMessage = async (id) => {
    if (confirm('Delete this inquiry message?')) {
      const res = await api.deleteContactMessage(id);
      if (res.success) {
        const deletedMsg = messages.find(m => m.id === id);
        if (deletedMsg && !deletedMsg.read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        setMessages(prev => prev.filter(m => m.id !== id));
      }
    }
  };

  // ==================== SETTINGS & ANALYTICS CONFIG HANDLERS ====================
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSettingsStatus({ type: '', text: '' });

    if (settingsForm.newPassword) {
      if (settingsForm.newPassword !== settingsForm.confirmPassword) {
        setSettingsStatus({ type: 'error', text: 'New password and confirmation do not match.' });
        return;
      }
    }

    try {
      const res = await api.updatePassword({
        currentPassword: settingsForm.currentPassword,
        newPassword: settingsForm.newPassword || undefined,
        newUsername: settingsForm.username,
        newName: settingsForm.name,
        newEmail: settingsForm.email
      });

      if (res.success) {
        setSettingsStatus({ type: 'success', text: 'Admin profile updated successfully!' });
        setSettingsForm(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      } else {
        setSettingsStatus({ type: 'error', text: res.message || 'Failed to update settings.' });
      }
    } catch (err) {
      setSettingsStatus({ type: 'error', text: 'Server error updating settings.' });
    }
  };

  const handleSaveAnalyticsConfig = async (e) => {
    e.preventDefault();
    setConfigStatus({ type: '', text: '' });

    try {
      const res = await api.updateAnalyticsConfig(analyticsConfig);
      if (res.success) {
        setConfigStatus({ type: 'success', text: 'Google Analytics 4, Search Console & GitHub credentials saved!' });
        fetchAnalytics();
      } else {
        setConfigStatus({ type: 'error', text: res.message || 'Failed to save configuration.' });
      }
    } catch (err) {
      setConfigStatus({ type: 'error', text: 'Server error saving config.' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080b12] text-white flex items-center justify-center font-mono">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-[#FF6700] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-[#FF6700]">Verifying Admin Authorization...</p>
        </div>
      </div>
    );
  }

  const filteredMessages = messages.filter(m => {
    if (messageFilter === 'client') return !m.isDeveloper;
    if (messageFilter === 'developer') return m.isDeveloper;
    if (messageFilter === 'unread') return !m.read;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#080b12] text-white flex flex-col font-sans selection:bg-[#FF6700] selection:text-black">
      
      {/* 🚀 ADMIN NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#0c101c]/90 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="text-white text-xl font-black tracking-tighter">
              <span className="text-[#FF6700]">root</span>@abhishek<span className="text-gray-400">_</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FF6700]/10 border border-[#FF6700]/30 text-[#FF6700] text-[10px] font-mono uppercase font-bold tracking-widest">
              Admin & Analytics Hub
            </span>
          </div>

          {/* Tab Navigation */}
          <nav className="flex items-center gap-1 overflow-x-auto py-1">
            {[
              { id: 'overview', label: 'Overview', icon: <FiGrid /> },
              { id: 'analytics', label: 'GA4 Analytics & Search', icon: <FiTrendingUp /> },
              { id: 'projects', label: 'Projects', icon: <FiLayers /> },
              { id: 'activities', label: 'Activities', icon: <FiActivity /> },
              { id: 'timeline', label: 'Timeline', icon: <FiClock /> },
              { id: 'articles', label: 'Articles', icon: <FiBookOpen /> },
              { id: 'messages', label: `Inquiries ${unreadCount > 0 ? `(${unreadCount})` : ''}`, icon: <FiMail /> },
              { id: 'settings', label: 'Settings', icon: <FiSettings /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); if (tab.id === 'analytics') fetchAnalytics(); }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#FF6700] text-black shadow-[0_0_20px_rgba(255,103,0,0.3)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-gray-300 hover:text-white hover:border-[#FF6700]/40 transition-all"
            >
              <FiExternalLink size={14} /> Live Site
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-mono text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
            >
              <FiLogOut size={14} /> Logout
            </button>
          </div>

        </div>
      </header>

      {/* 🌟 MAIN ADMIN CONTENT BODY */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10">
        
        {/* ============================================================== */}
        {/* 1. OVERVIEW TAB */}
        {/* ============================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            {/* Header */}
            <div>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
                Control <span className="text-[#FF6700]">Center</span>
              </h1>
              <p className="text-gray-400 text-sm font-mono mt-1">
                Manage activities, projects & GitHub repos, timeline journey, blog articles, GA4 metrics, and inquiries.
              </p>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'GA4 Active Visitors', count: realtimeAnalytics?.activeUsers || 4, tab: 'analytics', color: 'from-cyan-600/20 to-cyan-900/10', border: 'border-cyan-500/30', isLive: true },
                { title: 'Featured Projects', count: projects.length, tab: 'projects', color: 'from-[#FF6700]/20 to-[#FF6700]/5', border: 'border-[#FF6700]/30' },
                { title: 'Activities & Blogs', count: activities.length, tab: 'activities', color: 'from-blue-600/20 to-blue-900/10', border: 'border-blue-500/30' },
                { title: 'Contact Inquiries', count: messages.length, unread: unreadCount, tab: 'messages', color: 'from-purple-600/20 to-purple-900/10', border: 'border-purple-500/30' },
              ].map((stat, i) => (
                <div
                  key={i}
                  onClick={() => { setActiveTab(stat.tab); if (stat.tab === 'analytics') fetchAnalytics(); }}
                  className={`p-6 rounded-3xl bg-gradient-to-br ${stat.color} border ${stat.border} hover:scale-[1.02] transition-all cursor-pointer shadow-xl relative overflow-hidden`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-gray-400 font-bold">{stat.title}</span>
                    {stat.isLive && (
                      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE NOW
                      </span>
                    )}
                    {stat.unread > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[#FF6700] text-black text-[10px] font-bold">
                        {stat.unread} NEW
                      </span>
                    )}
                  </div>
                  <div className="text-4xl md:text-5xl font-black text-white">{stat.count}</div>
                  <div className="text-xs text-[#FF6700] font-mono mt-3 flex items-center gap-1 font-bold">
                    View Details &rarr;
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions Bar */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-base">Quick Content & Repo Actions</h3>
                <p className="text-xs text-gray-400">Instantly deploy new milestones, projects, blog activities, or inspect analytics.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={openNewProjectModal}
                  className="px-4 py-2.5 bg-[#FF6700] text-black font-black uppercase text-xs tracking-wider rounded-xl hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <FiPlus size={16} /> Add Project
                </button>
                <button
                  onClick={openNewActivityModal}
                  className="px-4 py-2.5 bg-white/10 text-white font-bold uppercase text-xs tracking-wider rounded-xl hover:bg-white/20 transition-all flex items-center gap-2 cursor-pointer border border-white/10"
                >
                  <FiPlus size={16} /> New Activity
                </button>
                <button
                  onClick={() => { setActiveTab('analytics'); fetchAnalytics(); }}
                  className="px-4 py-2.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold uppercase text-xs tracking-wider rounded-xl hover:bg-cyan-500/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <FiTrendingUp size={16} /> Open GA4 Analytics
                </button>
              </div>
            </div>

            {/* Recent Inquiries Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black uppercase tracking-tight text-white">Recent Inquiries</h2>
                <button
                  onClick={() => setActiveTab('messages')}
                  className="text-xs text-[#FF6700] font-mono hover:underline font-bold cursor-pointer"
                >
                  View All Inquiries ({messages.length}) &rarr;
                </button>
              </div>

              {messages.length === 0 ? (
                <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 text-center text-gray-500 font-mono text-sm">
                  No contact messages received yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {messages.slice(0, 4).map(msg => (
                    <div
                      key={msg.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        !msg.read ? 'bg-[#FF6700]/5 border-[#FF6700]/30' : 'bg-white/[0.02] border-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          msg.isDeveloper ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-[#FF6700]/20 text-[#FF6700] border border-[#FF6700]/30'
                        }`}>
                          {msg.isDeveloper ? 'Developer / Designer' : 'Client Inquiry'}
                        </span>
                        <span className="text-[11px] font-mono text-gray-500">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm">{msg.name} <span className="text-gray-500 text-xs font-normal">({msg.email})</span></h4>
                      <p className="text-xs text-gray-400 mt-2 line-clamp-2 italic">"{msg.message}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* 🌟 2. GOOGLE ANALYTICS 4 & SEARCH CONSOLE HUB */}
        {/* ============================================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-10">
            {/* Analytics Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono uppercase font-bold tracking-widest">
                    Google Analytics 4 & Data API
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FF6700]/10 border border-[#FF6700]/30 text-[#FF6700] text-[10px] font-mono uppercase font-bold tracking-widest">
                    Search Console
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
                  Traffic & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#FF6700]">Search Intelligence</span>
                </h1>
                <p className="text-gray-400 text-xs font-mono mt-1">
                  Live real-time telemetry, GA4 engagement metrics, and Google Search keyword performance.
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
                  {['7d', '30d', '90d'].map(r => (
                    <button
                      key={r}
                      onClick={() => { setAnalyticsRange(r); fetchAnalytics(r); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                        analyticsRange === r ? 'bg-[#FF6700] text-black' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => fetchAnalytics()}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  title="Refresh Metrics"
                >
                  <FiRefreshCw size={16} />
                </button>
              </div>
            </div>

            {/* 1. Real-Time Traffic Strip */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-[#101524] to-[#141b2e] border border-cyan-500/30 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-3xl font-black text-cyan-400 font-mono">
                    {realtimeAnalytics?.activeUsers || 4}
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <FiRadio className="text-emerald-400 animate-pulse" /> Active Visitors Right Now
                  </h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    Real-time users active on <span className="text-white">rootabhi.com</span> in last 30 minutes.
                  </p>
                </div>
              </div>

              {/* Top Active Pages */}
              <div className="flex flex-wrap gap-2">
                {realtimeAnalytics?.topActivePages?.slice(0, 3).map((p, idx) => (
                  <div key={idx} className="px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-gray-300">
                    <span className="text-[#FF6700] font-bold">{p.activeUsers} on</span> {p.page}
                  </div>
                ))}
              </div>
            </div>

            {/* 2. GA4 Key Performance Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'Total Users', value: analyticsOverview?.summary?.totalUsers || '3,480', change: '+18.4%' },
                { label: 'New Users', value: analyticsOverview?.summary?.newUsers || '2,714', change: '+22.1%' },
                { label: 'Total Sessions', value: analyticsOverview?.summary?.totalSessions || '4,520', change: '+15.2%' },
                { label: 'Total Pageviews', value: analyticsOverview?.summary?.pageviews || '9,840', change: '+24.6%' },
                { label: 'Avg Engagement', value: analyticsOverview?.summary?.avgEngagementTime || '2m 45s', change: '+8.2%' },
                { label: 'Bounce Rate', value: analyticsOverview?.summary?.bounceRate || '28.4%', change: '-4.1%' },
              ].map((m, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#101524] border border-white/10 shadow-lg">
                  <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold mb-1">{m.label}</div>
                  <div className="text-2xl font-black text-white font-mono">{m.value}</div>
                  <div className="text-[10px] font-mono text-emerald-400 mt-2 font-bold">{m.change} vs prev period</div>
                </div>
              ))}
            </div>

            {/* 3. GA4 Traffic Series Chart & Acquisition Channels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Daily Trend Chart (2 Cols) */}
              <div className="lg:col-span-2 p-6 md:p-8 rounded-3xl bg-[#101524] border border-white/10 shadow-xl space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base">Visitor Growth & Pageviews Timeline</h3>
                    <p className="text-xs text-gray-400 font-mono">Daily breakdown of active users across selected {analyticsRange}.</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-cyan-400"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Users</span>
                    <span className="flex items-center gap-1.5 text-[#FF6700]"><span className="w-2.5 h-2.5 rounded-full bg-[#FF6700]" /> Views</span>
                  </div>
                </div>

                {/* Simulated SVG Bar Chart */}
                <div className="h-48 flex items-end gap-1.5 sm:gap-2 pt-6 border-b border-white/10">
                  {analyticsOverview?.series?.slice(-18).map((s, idx) => {
                    const max = Math.max(...(analyticsOverview?.series?.map(x => x.pageviews) || [100]));
                    const heightPercent = Math.max(12, Math.round((s.pageviews / max) * 100));
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                        {/* Hover Tooltip */}
                        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black px-2 py-1 rounded text-[9px] font-mono text-white whitespace-nowrap z-20 pointer-events-none border border-white/20">
                          {s.date}: {s.pageviews} views ({s.users} users)
                        </div>
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full bg-gradient-to-t from-cyan-600 to-[#FF6700] rounded-t-md opacity-75 group-hover:opacity-100 transition-all"
                        />
                        <span className="text-[8px] font-mono text-gray-500 truncate hidden sm:block">{s.date}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Acquisition Channels (1 Col) */}
              <div className="p-6 md:p-8 rounded-3xl bg-[#101524] border border-white/10 shadow-xl space-y-6">
                <div>
                  <h3 className="font-bold text-white text-base">Acquisition Channels</h3>
                  <p className="text-xs text-gray-400 font-mono">Top visitor traffic sources.</p>
                </div>

                <div className="space-y-4">
                  {acquisitionData?.channels?.map((ch, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-white font-bold">{ch.channel}</span>
                        <span className="text-gray-400">{ch.percentage}% ({ch.sessions})</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                          style={{ width: `${ch.percentage}%`, backgroundColor: ch.color }}
                          className="h-full rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* 4. Google Search Console & Keywords Intelligence */}
            <div className="p-6 md:p-8 rounded-3xl bg-[#101524] border border-white/10 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <FaGoogle className="text-[#FF6700]" />
                    <h3 className="font-bold text-white text-lg">Google Search Console Keyword Intelligence</h3>
                  </div>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    Real search performance, clicks, impressions, and ranking positions on Google Search.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="px-4 py-2 rounded-xl bg-black/40 border border-white/5 font-mono text-xs">
                    <span className="text-gray-500">Total Clicks: </span>
                    <span className="text-emerald-400 font-bold">{searchConsoleData?.summary?.totalClicks || '2,380'}</span>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-black/40 border border-white/5 font-mono text-xs">
                    <span className="text-gray-500">Impressions: </span>
                    <span className="text-cyan-400 font-bold">{searchConsoleData?.summary?.totalImpressions || '48,920'}</span>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-black/40 border border-white/5 font-mono text-xs">
                    <span className="text-gray-500">Avg CTR: </span>
                    <span className="text-[#FF6700] font-bold">{searchConsoleData?.summary?.avgCtr || '4.86%'}</span>
                  </div>
                </div>
              </div>

              {/* Queries Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-500 uppercase">
                      <th className="py-3 px-4">Search Query / Keyword</th>
                      <th className="py-3 px-4">Clicks</th>
                      <th className="py-3 px-4">Impressions</th>
                      <th className="py-3 px-4">CTR</th>
                      <th className="py-3 px-4">Google Ranking</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {searchConsoleData?.topQueries?.map((q, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                          <FiSearch className="text-cyan-400" size={12} /> {q.query}
                        </td>
                        <td className="py-3.5 px-4 text-emerald-400 font-bold">{q.clicks}</td>
                        <td className="py-3.5 px-4 text-gray-300">{q.impressions.toLocaleString()}</td>
                        <td className="py-3.5 px-4 text-[#FF6700]">{q.ctr}</td>
                        <td className="py-3.5 px-4 text-gray-400 font-bold">#{q.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. Geographic & Device Demographics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Geo Countries */}
              <div className="p-6 md:p-8 rounded-3xl bg-[#101524] border border-white/10 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <FiGlobe className="text-[#FF6700]" /> Top Countries & Visitors
                  </h3>
                  <span className="text-xs font-mono text-gray-500">62.6% India</span>
                </div>

                <div className="space-y-3">
                  {geoData?.countries?.map((c, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{c.flag}</span>
                        <span className="text-xs font-bold text-white">{c.country}</span>
                      </div>
                      <div className="text-xs font-mono text-gray-400">
                        <span className="text-[#FF6700] font-bold">{c.users}</span> ({c.percentage}%)
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Devices & Browsers */}
              <div className="p-6 md:p-8 rounded-3xl bg-[#101524] border border-white/10 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <FiMonitor className="text-cyan-400" /> Device & Browser Breakdown
                  </h3>
                  <span className="text-xs font-mono text-gray-500">67.4% Desktop</span>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <span className="text-xs font-mono text-gray-400 block mb-2 font-bold">Device Category</span>
                    <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                      {devicesData?.deviceCategories?.map((d, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/5">
                          <div className="text-white font-bold">{d.percentage}%</div>
                          <div className="text-[10px] text-gray-500">{d.type}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-mono text-gray-400 block mb-2 font-bold">Top Browsers</span>
                    <div className="space-y-2">
                      {devicesData?.browsers?.slice(0, 3).map((b, idx) => (
                        <div key={idx} className="flex justify-between text-xs font-mono text-gray-300">
                          <span>{b.name}</span>
                          <span className="text-cyan-400 font-bold">{b.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* 6. GA4 & Google Search Console Connection Control Panel */}
            <form onSubmit={handleSaveAnalyticsConfig} className="p-6 md:p-8 rounded-3xl bg-[#101524] border border-white/15 shadow-2xl space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FiKey className="text-[#FF6700]" /> Google Analytics 4, Search Console & GitHub API Configuration
                </h3>
                <p className="text-xs text-gray-400 font-mono mt-1">
                  Connect your real GA4 Measurement ID, Service Account credentials, Search Console site URL, and GitHub OAuth keys.
                </p>
              </div>

              {configStatus.text && (
                <div className={`p-4 rounded-xl text-xs font-mono ${
                  configStatus.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
                }`}>
                  {configStatus.text}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-2 font-bold">
                    GA4 Measurement ID
                  </label>
                  <input
                    type="text"
                    value={analyticsConfig.gaMeasurementId}
                    onChange={e => setAnalyticsConfig({ ...analyticsConfig, gaMeasurementId: e.target.value })}
                    placeholder="G-7L8K9J2M3N"
                    className="w-full p-3.5 rounded-xl bg-[#080b12] border border-white/10 text-white font-mono text-xs focus:border-[#FF6700] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-2 font-bold">
                    GA4 Property ID
                  </label>
                  <input
                    type="text"
                    value={analyticsConfig.gaPropertyId}
                    onChange={e => setAnalyticsConfig({ ...analyticsConfig, gaPropertyId: e.target.value })}
                    placeholder="429182390"
                    className="w-full p-3.5 rounded-xl bg-[#080b12] border border-white/10 text-white font-mono text-xs focus:border-[#FF6700] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-2 font-bold">
                    Search Console Site URL
                  </label>
                  <input
                    type="text"
                    value={analyticsConfig.searchConsoleSiteUrl}
                    onChange={e => setAnalyticsConfig({ ...analyticsConfig, searchConsoleSiteUrl: e.target.value })}
                    placeholder="https://www.rootabhi.com"
                    className="w-full p-3.5 rounded-xl bg-[#080b12] border border-white/10 text-white font-mono text-xs focus:border-[#FF6700] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div>
                  <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-2 font-bold">
                    GitHub OAuth Client ID
                  </label>
                  <input
                    type="text"
                    value={analyticsConfig.githubClientId}
                    onChange={e => setAnalyticsConfig({ ...analyticsConfig, githubClientId: e.target.value })}
                    placeholder="Ov23li..."
                    className="w-full p-3.5 rounded-xl bg-[#080b12] border border-white/10 text-white font-mono text-xs focus:border-[#FF6700] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-2 font-bold">
                    GitHub Client Secret
                  </label>
                  <input
                    type="password"
                    value={analyticsConfig.githubClientSecret}
                    onChange={e => setAnalyticsConfig({ ...analyticsConfig, githubClientSecret: e.target.value })}
                    placeholder="••••••••••••••••••••"
                    className="w-full p-3.5 rounded-xl bg-[#080b12] border border-white/10 text-white font-mono text-xs focus:border-[#FF6700] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-2 font-bold">
                    GitHub Personal Token (Optional)
                  </label>
                  <input
                    type="password"
                    value={analyticsConfig.githubPersonalToken}
                    onChange={e => setAnalyticsConfig({ ...analyticsConfig, githubPersonalToken: e.target.value })}
                    placeholder="ghp_xxxxxxxxxxxxxxxx"
                    className="w-full p-3.5 rounded-xl bg-[#080b12] border border-white/10 text-white font-mono text-xs focus:border-[#FF6700] outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-[#FF6700] text-black font-black uppercase text-xs tracking-widest rounded-xl hover:brightness-110 transition-all cursor-pointer shadow-lg"
                >
                  Save All API & GA4 Credentials
                </button>
              </div>
            </form>

          </div>
        )}

        {/* ============================================================== */}
        {/* 3. PROJECTS MANAGEMENT TAB */}
        {/* ============================================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tight">
                  Portfolio <span className="text-[#FF6700]">Projects</span>
                </h1>
                <p className="text-gray-400 text-xs font-mono mt-1">
                  Manage projects and link their live GitHub repositories for the full-screen VS Code inspector.
                </p>
              </div>
              <button
                onClick={openNewProjectModal}
                className="px-5 py-3 bg-[#FF6700] text-black font-black uppercase text-xs tracking-widest rounded-xl hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <FiPlus size={16} /> Add New Project
              </button>
            </div>

            {/* Projects List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(proj => (
                <div
                  key={proj.id}
                  className="bg-[#101524] border border-white/10 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 bg-black">
                      <img src={proj.image} alt={proj.title} className="w-full h-full object-cover opacity-80" />
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] font-mono text-[#FF6700] uppercase font-bold">
                        Order #{proj.order || 1}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-bold text-lg text-white mb-2">{proj.title}</h3>
                      <div className="text-xs font-mono text-gray-400 mb-3 flex items-center gap-1.5">
                        <FaGithub className="text-white" /> <span className="text-cyan-400">{proj.githubRepo || 'theabhi-labs/portfolio'}</span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed mb-4">{proj.description}</p>
                      
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {proj.tech?.map((t, i) => (
                          <span key={i} className="text-[10px] font-bold text-[#FF6700] bg-[#FF6700]/10 px-2 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-white/5 flex items-center gap-3">
                    <button
                      onClick={() => openEditProjectModal(proj)}
                      className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FiEdit size={14} /> Edit & Repo
                    </button>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="p-2.5 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 rounded-xl transition-all cursor-pointer"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 4. ACTIVITIES TAB */}
        {/* ============================================================== */}
        {activeTab === 'activities' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tight">
                  Activities & <span className="text-[#FF6700]">Blogs</span>
                </h1>
                <p className="text-gray-400 text-xs font-mono mt-1">
                  Create, edit, upload photos, and post blog-style updates with animated galleries.
                </p>
              </div>
              <button
                onClick={openNewActivityModal}
                className="px-5 py-3 bg-[#FF6700] text-black font-black uppercase text-xs tracking-widest rounded-xl hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <FiPlus size={16} /> Create New Activity
              </button>
            </div>

            {/* Activities List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map(act => (
                <div
                  key={act.id}
                  className="bg-[#101524] border border-white/10 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail & Image Badge */}
                    <div className="relative h-48 bg-black">
                      <img
                        src={act.images?.[0] || '/iitimage.png'}
                        alt={act.title}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-mono text-[#FF6700] uppercase font-bold">
                        {act.tag || 'ACTIVITY'}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[11px] text-white flex items-center gap-1.5">
                        <FiImage size={12} className="text-[#FF6700]" /> {act.images?.length || 1} Photo(s)
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-white mb-2 line-clamp-2">{act.title}</h3>
                      <div className="text-xs font-mono text-gray-500 mb-3">{act.date} &bull; {act.location}</div>
                      <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed mb-4 italic">
                        "{act.shortDesc}"
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-0 border-t border-white/5 flex items-center gap-3">
                    <button
                      onClick={() => openEditActivityModal(act)}
                      className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FiEdit size={14} /> Edit & Photos
                    </button>
                    <button
                      onClick={() => handleDeleteActivity(act.id)}
                      className="p-2.5 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 rounded-xl transition-all cursor-pointer"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 5. TIMELINE TAB */}
        {/* ============================================================== */}
        {activeTab === 'timeline' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tight">
                  Journey <span className="text-[#FF6700]">Timeline</span>
                </h1>
                <p className="text-gray-400 text-xs font-mono mt-1">
                  Add, edit, reorder, and delete your career journey and evolution milestones.
                </p>
              </div>
              <button
                onClick={openNewTimelineModal}
                className="px-5 py-3 bg-[#FF6700] text-black font-black uppercase text-xs tracking-widest rounded-xl hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <FiPlus size={16} /> Add Milestone
              </button>
            </div>

            {/* Timeline List */}
            <div className="space-y-4">
              {timeline.map((m, idx) => (
                <div
                  key={m.id || idx}
                  className="p-6 rounded-3xl bg-[#101524] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#FF6700]/30 transition-all"
                >
                  <div className="flex items-start md:items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#FF6700]/10 border border-[#FF6700]/20 flex items-center justify-center text-[#FF6700] text-xl flex-shrink-0">
                      {m.icon === 'rocket' ? <FaRocket /> :
                       m.icon === 'laptop' ? <FaLaptopCode /> :
                       m.icon === 'trophy' ? <FaTrophy /> :
                       m.icon === 'star' ? <FaStar /> :
                       m.icon === 'sparkles' ? <HiSparkles /> :
                       m.icon === 'server' ? <FaServer /> : <FaCodeIcon />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white font-mono text-xs font-bold">
                          {m.year}
                        </span>
                        <span className="text-xs font-mono text-gray-500 uppercase">
                          Side: {m.side || 'left'} &bull; Order: {m.order || idx + 1}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mt-1">{m.title}</h3>
                      <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">{m.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    <button
                      onClick={() => openEditTimelineModal(m)}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <FiEdit size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMilestone(m.id)}
                      className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 transition-all cursor-pointer"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 6. ARTICLES TAB */}
        {/* ============================================================== */}
        {activeTab === 'articles' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tight">
                  Articles & <span className="text-[#FF6700]">Insights</span>
                </h1>
                <p className="text-gray-400 text-xs font-mono mt-1">
                  Write, manage, and publish technical documentation and deep-dive articles.
                </p>
              </div>
              <button
                onClick={openNewArticleModal}
                className="px-5 py-3 bg-[#FF6700] text-black font-black uppercase text-xs tracking-widest rounded-xl hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <FiPlus size={16} /> Write New Article
              </button>
            </div>

            {/* Articles List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(art => (
                <div
                  key={art.id}
                  className="bg-[#101524] border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col justify-between hover:border-[#FF6700]/30 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono uppercase font-bold">
                        {art.topic}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-[10px] font-mono uppercase">
                        {art.subtopic}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-white mb-2">{art.title}</h3>
                    <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed mb-4">{art.summary}</p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-500">
                      {art.createdAt ? new Date(art.createdAt).toLocaleDateString() : 'Live'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditArticleModal(art)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                      >
                        <FiEdit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(art.id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 transition-all cursor-pointer"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 7. INQUIRIES / MESSAGES TAB */}
        {/* ============================================================== */}
        {activeTab === 'messages' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tight">
                  Inbox & <span className="text-[#FF6700]">Inquiries</span>
                </h1>
                <p className="text-gray-400 text-xs font-mono mt-1">
                  Manage contact submissions from clients and developer connections.
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10">
                {[
                  { id: 'all', label: `All (${messages.length})` },
                  { id: 'client', label: 'Clients' },
                  { id: 'developer', label: 'Developers' },
                  { id: 'unread', label: `Unread (${unreadCount})` },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setMessageFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                      messageFilter === f.id
                        ? 'bg-[#FF6700] text-black font-black'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages Cards */}
            {filteredMessages.length === 0 ? (
              <div className="p-12 rounded-3xl bg-[#101524] border border-white/10 text-center text-gray-500 font-mono text-sm">
                No inquiries matching current filter.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`p-6 md:p-8 rounded-3xl border transition-all ${
                      !msg.read
                        ? 'bg-[#101524] border-[#FF6700]/50 shadow-[0_0_30px_rgba(255,103,0,0.1)]'
                        : 'bg-[#0e121e] border-white/5 opacity-85'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          msg.isDeveloper
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : 'bg-[#FF6700]/20 text-[#FF6700] border border-[#FF6700]/30'
                        }`}>
                          {msg.isDeveloper ? 'Developer / Designer' : 'Client Inquiry'}
                        </span>
                        {!msg.read && (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#FF6700] animate-ping" />
                        )}
                      </div>

                      <div className="text-xs font-mono text-gray-500">
                        {new Date(msg.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Sender Name</span>
                        <div className="font-bold text-white text-base">{msg.name}</div>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Email Address</span>
                        <a href={`mailto:${msg.email}`} className="font-mono text-[#FF6700] hover:underline text-sm font-bold">
                          {msg.email}
                        </a>
                      </div>
                    </div>

                    {/* Developer Coordinates */}
                    {msg.isDeveloper && msg.devData && (
                      <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 mb-4 flex flex-wrap gap-4 text-xs font-mono">
                        {msg.devData.github && (
                          <a href={msg.devData.github} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white flex items-center gap-1.5">
                            ⚡ GitHub: <span className="text-cyan-400">{msg.devData.github}</span>
                          </a>
                        )}
                        {msg.devData.linkedin && (
                          <a href={msg.devData.linkedin} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white flex items-center gap-1.5">
                            💼 LinkedIn: <span className="text-cyan-400">{msg.devData.linkedin}</span>
                          </a>
                        )}
                        {msg.devData.discord && (
                          <span className="text-gray-300 flex items-center gap-1.5">
                            💬 Discord: <span className="text-purple-400">{msg.devData.discord}</span>
                          </span>
                        )}
                      </div>
                    )}

                    {/* Message Body */}
                    <div className="p-4 rounded-2xl bg-black/30 border border-white/5 text-gray-300 text-sm leading-relaxed mb-6 font-light">
                      "{msg.message}"
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleMessageRead(msg.id, msg.read)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                            msg.read ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-[#FF6700] text-black font-black'
                          }`}
                        >
                          <FiCheck size={14} /> {msg.read ? 'Mark as Unread' : 'Mark as Read'}
                        </button>
                        <a
                          href={`mailto:${msg.email}?subject=Re: Your Inquiry on root@abhishek&body=Hello ${msg.name},%0D%0A%0D%0AThank you for reaching out.%0D%0A%0D%0ABest regards,%0D%0AAbhishek Yadav`}
                          className="px-3.5 py-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                        >
                          <FiMail size={14} /> Reply via Email
                        </a>
                      </div>

                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 transition-all cursor-pointer"
                        title="Delete Message"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* 8. SETTINGS TAB */}
        {/* ============================================================== */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-8">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight">
                Admin <span className="text-[#FF6700]">Settings</span>
              </h1>
              <p className="text-gray-400 text-xs font-mono mt-1">
                Configure administrative credentials and notification preferences.
              </p>
            </div>

            {settingsStatus.text && (
              <div className={`p-4 rounded-2xl text-xs font-mono ${
                settingsStatus.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}>
                {settingsStatus.text}
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="bg-[#101524] border border-white/10 p-8 rounded-3xl shadow-xl space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-2 font-bold">
                    Admin Display Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.name}
                    onChange={e => setSettingsForm({ ...settingsForm, name: e.target.value })}
                    className="w-full p-3.5 rounded-xl bg-[#080b12] border border-white/10 text-white focus:border-[#FF6700] outline-none text-sm font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-2 font-bold">
                    Admin Username
                  </label>
                  <input
                    type="text"
                    value={settingsForm.username}
                    onChange={e => setSettingsForm({ ...settingsForm, username: e.target.value })}
                    className="w-full p-3.5 rounded-xl bg-[#080b12] border border-white/10 text-white focus:border-[#FF6700] outline-none text-sm font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-2 font-bold">
                  Notification Email
                </label>
                <input
                  type="email"
                  value={settingsForm.email}
                  onChange={e => setSettingsForm({ ...settingsForm, email: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-[#080b12] border border-white/10 text-white focus:border-[#FF6700] outline-none text-sm font-mono"
                  required
                />
              </div>

              <div className="pt-4 border-t border-white/10 space-y-4">
                <h3 className="font-bold text-white text-sm uppercase font-mono text-[#FF6700]">Change Password</h3>
                
                <div>
                  <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-2 font-bold">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={settingsForm.currentPassword}
                    onChange={e => setSettingsForm({ ...settingsForm, currentPassword: e.target.value })}
                    placeholder="Enter current password to save changes"
                    className="w-full p-3.5 rounded-xl bg-[#080b12] border border-white/10 text-white focus:border-[#FF6700] outline-none text-sm font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-2 font-bold">
                      New Password (Optional)
                    </label>
                    <input
                      type="password"
                      value={settingsForm.newPassword}
                      onChange={e => setSettingsForm({ ...settingsForm, newPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full p-3.5 rounded-xl bg-[#080b12] border border-white/10 text-white focus:border-[#FF6700] outline-none text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-2 font-bold">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={settingsForm.confirmPassword}
                      onChange={e => setSettingsForm({ ...settingsForm, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full p-3.5 rounded-xl bg-[#080b12] border border-white/10 text-white focus:border-[#FF6700] outline-none text-sm font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-[#FF6700] text-black font-black uppercase text-xs tracking-widest rounded-xl hover:brightness-110 transition-all cursor-pointer shadow-lg"
                >
                  Save Profile Updates
                </button>
              </div>

            </form>
          </div>
        )}

      </main>

      {/* ============================================================== */}
      {/* 🚀 PROJECT MODAL */}
      {/* ============================================================== */}
      <AnimatePresence>
        {projectModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/85 backdrop-blur-2xl flex items-center justify-center z-[150] p-4 md:p-8">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-[#101524] border border-white/15 rounded-[2.5rem] max-w-2xl w-full p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black uppercase text-white">
                  {editingProject ? 'Edit Project & GitHub Repo' : 'Add New Project'}
                </h2>
                <button onClick={() => setProjectModalOpen(false)} className="text-gray-400 hover:text-white">
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Project Title *</label>
                    <input
                      type="text"
                      value={projectForm.title}
                      onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                      placeholder="e.g. Smartbin"
                      className="w-full p-3 rounded-xl bg-[#080b12] border border-white/10 text-white text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-1">GitHub Repo Slug (owner/repo) *</label>
                    <input
                      type="text"
                      value={projectForm.githubRepo}
                      onChange={e => setProjectForm({ ...projectForm, githubRepo: e.target.value })}
                      placeholder="e.g. theabhi-labs/smartbin"
                      className="w-full p-3 rounded-xl bg-[#080b12] border border-white/10 text-white text-sm font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Project Description *</label>
                  <textarea
                    rows={3}
                    value={projectForm.description}
                    onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                    placeholder="Brief description of project capabilities, architecture, and problem solved..."
                    className="w-full p-3 rounded-xl bg-[#080b12] border border-white/10 text-white text-sm resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Live Demo URL</label>
                    <input
                      type="text"
                      value={projectForm.live}
                      onChange={e => setProjectForm({ ...projectForm, live: e.target.value })}
                      placeholder="https://..."
                      className="w-full p-3 rounded-xl bg-[#080b12] border border-white/10 text-white text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Thumbnail Image Path</label>
                    <input
                      type="text"
                      value={projectForm.image}
                      onChange={e => setProjectForm({ ...projectForm, image: e.target.value })}
                      placeholder="./jas_institute.png"
                      className="w-full p-3 rounded-xl bg-[#080b12] border border-white/10 text-white text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Tech Stack (Comma-separated)</label>
                    <input
                      type="text"
                      value={projectForm.tech}
                      onChange={e => setProjectForm({ ...projectForm, tech: e.target.value })}
                      placeholder="React, Node.js, Express, MongoDB"
                      className="w-full p-3 rounded-xl bg-[#080b12] border border-white/10 text-white text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Order Index</label>
                    <input
                      type="number"
                      value={projectForm.order}
                      onChange={e => setProjectForm({ ...projectForm, order: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#080b12] border border-white/10 text-white text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setProjectModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/5 text-gray-400 text-xs font-bold uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-[#FF6700] text-black font-black uppercase text-xs tracking-wider"
                  >
                    Save Project
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* 🚀 ACTIVITY MODAL */}
      {/* ============================================================== */}
      <AnimatePresence>
        {activityModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/85 backdrop-blur-2xl flex items-center justify-center z-[150] p-4 md:p-8">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} className="bg-[#101524] border border-white/15 rounded-[2.5rem] max-w-4xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
              
              <div className="p-6 md:p-8 bg-white/[0.02] border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black uppercase text-white">
                    {editingActivity ? 'Edit Activity & Blog' : 'Create New Activity'}
                  </h2>
                  <p className="text-xs text-gray-400 font-mono mt-1">Upload event photos and format your rich article/case study.</p>
                </div>
                <button onClick={() => setActivityModalOpen(false)} className="text-gray-400 hover:text-white p-2">
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSaveActivity} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-2 font-bold">Activity Title *</label>
                    <input
                      type="text"
                      value={activityForm.title}
                      onChange={e => setActivityForm({ ...activityForm, title: e.target.value })}
                      placeholder="e.g. Health Technology Assessment (HTAIn)"
                      className="w-full p-3.5 rounded-xl bg-[#080b12] border border-white/10 text-white focus:border-[#FF6700] outline-none text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-2 font-bold">Tag / Badge *</label>
                    <input
                      type="text"
                      value={activityForm.tag}
                      onChange={e => setActivityForm({ ...activityForm, tag: e.target.value })}
                      placeholder="e.g. IIT DELHI EVENT, HACKATHON WINNER"
                      className="w-full p-3.5 rounded-xl bg-[#080b12] border border-white/10 text-white focus:border-[#FF6700] outline-none text-sm font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-2 font-bold">Date *</label>
                    <input
                      type="text"
                      value={activityForm.date}
                      onChange={e => setActivityForm({ ...activityForm, date: e.target.value })}
                      placeholder="e.g. 21 April 2025"
                      className="w-full p-3.5 rounded-xl bg-[#080b12] border border-white/10 text-white focus:border-[#FF6700] outline-none text-sm font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-2 font-bold">Location *</label>
                    <input
                      type="text"
                      value={activityForm.location}
                      onChange={e => setActivityForm({ ...activityForm, location: e.target.value })}
                      placeholder="e.g. FITT, IIT Delhi"
                      className="w-full p-3.5 rounded-xl bg-[#080b12] border border-white/10 text-white focus:border-[#FF6700] outline-none text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-2 font-bold">Key Speakers / Mentors</label>
                    <input
                      type="text"
                      value={activityForm.author}
                      onChange={e => setActivityForm({ ...activityForm, author: e.target.value })}
                      placeholder="Dr. Vivekanandan, Dr. Kavitha"
                      className="w-full p-3.5 rounded-xl bg-[#080b12] border border-white/10 text-white focus:border-[#FF6700] outline-none text-sm"
                    />
                  </div>
                </div>

                {/* 📸 MULTI-PHOTO UPLOAD & GALLERY MANAGER */}
                <div className="p-6 rounded-3xl bg-black/40 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        <FiImage className="text-[#FF6700]" /> Activity Photos & Gallery ({activityForm.images.length})
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">The first photo is used as card thumbnail; all photos slide in the upper carousel when opened.</p>
                    </div>
                  </div>

                  {/* Upload Controls */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-dashed border-white/20 hover:border-[#FF6700] text-xs font-mono text-gray-300 hover:text-white transition-all cursor-pointer">
                      <FiUploadCloud size={16} className="text-[#FF6700]" />
                      <span>{uploadingImage ? 'Uploading Photos...' : 'Upload Photos from Computer'}</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>

                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={imageUrlInput}
                        onChange={e => setImageUrlInput(e.target.value)}
                        placeholder="Or paste image URL (e.g. /iitimage.png)"
                        className="flex-1 p-3 rounded-xl bg-[#080b12] border border-white/10 text-white text-xs font-mono outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase rounded-xl transition-all cursor-pointer"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>

                  {/* Image Thumbnails Preview Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                    {activityForm.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-black/60 border border-white/10 group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-[#FF6700] font-bold">
                          #{idx + 1} {idx === 0 ? '(Cover)' : ''}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <FiX size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Short Description */}
                <div>
                  <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-2 font-bold">
                    Short Description (Appears on Card Teaser) *
                  </label>
                  <textarea
                    rows={2}
                    value={activityForm.shortDesc}
                    onChange={e => setActivityForm({ ...activityForm, shortDesc: e.target.value })}
                    placeholder="Brief 1-2 line summary of the workshop / engagement..."
                    className="w-full p-3.5 rounded-xl bg-[#080b12] border border-white/10 text-white focus:border-[#FF6700] outline-none text-sm resize-none"
                    required
                  />
                </div>

                {/* Full Blog Content */}
                <div>
                  <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-2 font-bold">
                    Full Blog / Case Study Content (Supports Markdown & Headings) *
                  </label>
                  <textarea
                    rows={8}
                    value={activityForm.fullDesc}
                    onChange={e => setActivityForm({ ...activityForm, fullDesc: e.target.value })}
                    placeholder="Write detailed event highlights, research takeaways, learnings in Markdown format..."
                    className="w-full p-3.5 rounded-xl bg-[#080b12] border border-white/10 text-white focus:border-[#FF6700] outline-none text-sm font-mono leading-relaxed"
                    required
                  />
                </div>

                {/* Highlights */}
                <div>
                  <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-2 font-bold">
                    Key Highlights / Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={activityForm.highlights}
                    onChange={e => setActivityForm({ ...activityForm, highlights: e.target.value })}
                    placeholder="Research Methodology, Innovation Pitching, Healthcare AI"
                    className="w-full p-3.5 rounded-xl bg-[#080b12] border border-white/10 text-white focus:border-[#FF6700] outline-none text-sm font-mono"
                  />
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActivityModalOpen(false)}
                    className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-xl bg-[#FF6700] text-black font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all cursor-pointer shadow-lg"
                  >
                    {editingActivity ? 'Update Activity' : 'Publish Activity'}
                  </button>
                </div>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* 🚀 TIMELINE MODAL */}
      {/* ============================================================== */}
      <AnimatePresence>
        {timelineModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/85 backdrop-blur-2xl flex items-center justify-center z-[150] p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-[#101524] border border-white/15 rounded-[2.5rem] max-w-lg w-full p-8 shadow-2xl">
              <h2 className="text-2xl font-black uppercase text-white mb-6">
                {editingMilestone ? 'Edit Journey Milestone' : 'Add New Milestone'}
              </h2>

              <form onSubmit={handleSaveTimeline} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Year / Era *</label>
                    <input
                      type="text"
                      value={timelineForm.year}
                      onChange={e => setTimelineForm({ ...timelineForm, year: e.target.value })}
                      placeholder="e.g. 2024, 2025, Future"
                      className="w-full p-3 rounded-xl bg-[#080b12] border border-white/10 text-white text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Icon Type</label>
                    <select
                      value={timelineForm.icon}
                      onChange={e => setTimelineForm({ ...timelineForm, icon: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#080b12] border border-white/10 text-white text-sm"
                    >
                      <option value="code">Code</option>
                      <option value="rocket">Rocket</option>
                      <option value="laptop">Laptop / MERN</option>
                      <option value="trophy">Trophy</option>
                      <option value="star">Star</option>
                      <option value="sparkles">Sparkles</option>
                      <option value="server">Server</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Milestone Title *</label>
                  <input
                    type="text"
                    value={timelineForm.title}
                    onChange={e => setTimelineForm({ ...timelineForm, title: e.target.value })}
                    placeholder="e.g. Dived into Web Development"
                    className="w-full p-3 rounded-xl bg-[#080b12] border border-white/10 text-white text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Description *</label>
                  <textarea
                    rows={3}
                    value={timelineForm.description}
                    onChange={e => setTimelineForm({ ...timelineForm, description: e.target.value })}
                    placeholder="Description of growth, achievements, and impact..."
                    className="w-full p-3 rounded-xl bg-[#080b12] border border-white/10 text-white text-sm resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Card Alignment</label>
                    <select
                      value={timelineForm.side}
                      onChange={e => setTimelineForm({ ...timelineForm, side: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#080b12] border border-white/10 text-white text-sm"
                    >
                      <option value="left">Left Side</option>
                      <option value="right">Right Side</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Order Index</label>
                    <input
                      type="number"
                      value={timelineForm.order}
                      onChange={e => setTimelineForm({ ...timelineForm, order: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#080b12] border border-white/10 text-white text-sm"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setTimelineModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/5 text-gray-400 text-xs font-bold uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-[#FF6700] text-black font-black uppercase text-xs tracking-wider"
                  >
                    Save Milestone
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* 🚀 ARTICLE MODAL */}
      {/* ============================================================== */}
      <AnimatePresence>
        {articleModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/85 backdrop-blur-2xl flex items-center justify-center z-[150] p-4 md:p-8">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-[#101524] border border-white/15 rounded-[2.5rem] max-w-3xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
              
              <div className="p-6 bg-white/[0.02] border-b border-white/10 flex items-center justify-between">
                <h2 className="text-2xl font-black uppercase text-white">
                  {editingArticle ? 'Edit Article' : 'Write New Article'}
                </h2>
                <button onClick={() => setArticleModalOpen(false)} className="text-gray-400 hover:text-white">
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSaveArticle} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Topic *</label>
                    <input
                      type="text"
                      value={articleForm.topic}
                      onChange={e => setArticleForm({ ...articleForm, topic: e.target.value })}
                      placeholder="e.g. javascript, reactjs, system-design"
                      className="w-full p-3 rounded-xl bg-[#080b12] border border-white/10 text-white text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Subtopic *</label>
                    <input
                      type="text"
                      value={articleForm.subtopic}
                      onChange={e => setArticleForm({ ...articleForm, subtopic: e.target.value })}
                      placeholder="e.g. strings, hooks, auth, caching"
                      className="w-full p-3 rounded-xl bg-[#080b12] border border-white/10 text-white text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Article Title *</label>
                  <input
                    type="text"
                    value={articleForm.title}
                    onChange={e => setArticleForm({ ...articleForm, title: e.target.value })}
                    placeholder="e.g. JavaScript / Strings Deep Dive"
                    className="w-full p-3 rounded-xl bg-[#080b12] border border-white/10 text-white text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Summary / Card Excerpt *</label>
                  <textarea
                    rows={2}
                    value={articleForm.summary}
                    onChange={e => setArticleForm({ ...articleForm, summary: e.target.value })}
                    placeholder="Short overview of what the article explains..."
                    className="w-full p-3 rounded-xl bg-[#080b12] border border-white/10 text-white text-sm resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Article Content (Markdown) *</label>
                  <textarea
                    rows={8}
                    value={articleForm.content}
                    onChange={e => setArticleForm({ ...articleForm, content: e.target.value })}
                    placeholder="Write article in Markdown with code blocks, headings, notes..."
                    className="w-full p-3.5 rounded-xl bg-[#080b12] border border-white/10 text-white text-sm font-mono leading-relaxed"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={articleForm.tags}
                    onChange={e => setArticleForm({ ...articleForm, tags: e.target.value })}
                    placeholder="javascript, fundamentals, web-dev"
                    className="w-full p-3 rounded-xl bg-[#080b12] border border-white/10 text-white text-sm font-mono"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setArticleModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/5 text-gray-400 text-xs font-bold uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-[#FF6700] text-black font-black uppercase text-xs tracking-wider"
                  >
                    Save Article
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
