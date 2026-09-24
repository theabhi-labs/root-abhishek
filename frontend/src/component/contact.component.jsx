import { useState } from "react";
import { FaLinkedin, FaGithub, FaDiscord, FaEnvelope, FaCode, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "../config/api";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successInfo, setSuccessInfo] = useState({ title: "", desc: "", isDev: false });
  const [errorMessage, setErrorMessage] = useState("");
  const [devData, setDevData] = useState({ linkedin: "", github: "", discord: "" });
  const [isDeveloper, setIsDeveloper] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleDevChange = (e) => setDevData({ ...devData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        isDeveloper,
        devData: isDeveloper ? devData : null
      };

      const res = await api.sendContactMessage(payload);

      if (res.success) {
        setSuccessInfo({
          title: isDeveloper ? "Digital Coordinates Linked!" : "Message Dispatched Successfully!",
          desc: isDeveloper
            ? `Peer connection confirmed. A personalized developer welcome email with coordinates has been sent to ${formData.email}.`
            : `Thank you for your project inquiry. A confirmation receipt has been dispatched to ${formData.email}. Abhishek will follow up within 12-24 hours.`,
          isDev: isDeveloper
        });
        setShowSuccessModal(true);
        setFormData({ name: "", email: "", message: "" });
        setDevData({ linkedin: "", github: "", discord: "" });
        setIsDeveloper(false);
      } else {
        setErrorMessage(res.message || "Failed to transmit message. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setErrorMessage("Could not connect to server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleDevModalSubmit = (e) => {
    e.preventDefault();
    setShowModal(false);
  };

  return (
    <section id="contact" className="bg-[#0d0d0d] text-white py-24 px-6 md:px-16 lg:px-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#FF6700]/5 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[350px] h-[350px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 relative z-10">
        
        {/* LEFT: Information & Socials */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex-1 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-[1px] bg-[#FF6700]" />
              <span className="text-[#FF6700] font-mono uppercase text-xs tracking-[0.3em] font-bold">
                Get In Touch // Open For Collaboration
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
              Let's <span className="text-[#FF6700]">Talk.</span>
            </h2>
            
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10 max-w-lg font-light">
              Whether you have a <span className="text-white font-semibold">game-changing client project</span> or want to collaborate on the next big tech stack—my inbox is always responsive.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <FaLinkedin />, label: "LinkedIn", color: "#0077b5", link: "https://www.linkedin.com/in/abhishek-yadav-rootabhi/" },
                { icon: <FaGithub />, label: "GitHub", color: "#ffffff", link: "https://github.com/theabhi-labs/" },
                { icon: <FaDiscord />, label: "Discord", color: "#5865F2", link: "https://discord.com/users/anuragabhi" },
                { icon: <FaEnvelope />, label: "Email", color: "#FF6700", link: "mailto:rootabhishekyadav@gmail.com" },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.link}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.06)" }}
                  className="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-[#141414] transition-all group"
                >
                  <span className="text-2xl transition-colors group-hover:text-[#FF6700]" style={{ color: social.color }}>
                    {social.icon}
                  </span>
                  <span className="font-medium text-gray-300 group-hover:text-white text-sm">{social.label}</span>
                </motion.a>
              ))}
            </div>
          </div>

          <div className="mt-12 p-6 rounded-3xl border border-dashed border-[#FF6700]/30 bg-[#FF6700]/5">
            <p className="text-[#FF6700] font-mono text-xs uppercase tracking-widest mb-2 font-bold">Direct Dispatch Protocol</p>
            <p className="text-white text-base font-medium italic">
              "Every message triggers automated validation and personal follow-up within 24 hours."
            </p>
          </div>
        </motion.div>

        {/* RIGHT: Contact Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex-1 w-full"
        >
          <form
            onSubmit={handleSubmit}
            className="bg-white/[0.03] backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col gap-6"
          >
            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                {errorMessage}
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-400 font-mono ml-1 font-bold">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full p-4 rounded-xl bg-[#0d0d0d] border border-white/10 text-white focus:border-[#FF6700] focus:ring-1 focus:ring-[#FF6700] outline-none transition-all placeholder-gray-600 text-sm"
                  required
                />
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-400 font-mono ml-1 font-bold">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full p-4 rounded-xl bg-[#0d0d0d] border border-white/10 text-white focus:border-[#FF6700] focus:ring-1 focus:ring-[#FF6700] outline-none transition-all placeholder-gray-600 text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-mono ml-1 font-bold">Your Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your project scope, collaboration idea, or inquiry..."
                rows="5"
                className="w-full p-4 rounded-xl bg-[#0d0d0d] border border-white/10 text-white focus:border-[#FF6700] focus:ring-1 focus:ring-[#FF6700] outline-none transition-all resize-none placeholder-gray-600 text-sm leading-relaxed"
                required
              ></textarea>
            </div>

            {/* Developer / Designer Connection Toggle */}
            <div 
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                isDeveloper ? 'bg-[#FF6700]/10 border-[#FF6700] shadow-[0_0_20px_rgba(255,103,0,0.15)]' : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
              onClick={() => {
                const nextState = !isDeveloper;
                setIsDeveloper(nextState);
                if (nextState) setShowModal(true);
              }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                  isDeveloper ? 'bg-[#FF6700] border-[#FF6700]' : 'border-gray-500'
                }`}>
                  {isDeveloper && <FaCode className="text-xs text-black" />}
                </div>
                <span className="text-gray-200 font-medium text-sm">I am a Developer / Designer</span>
              </div>
              
              {isDeveloper && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
                  className="text-xs text-[#FF6700] hover:underline font-mono uppercase font-bold"
                >
                  Edit Handles &rarr;
                </button>
              )}
            </div>

            {isDeveloper && (devData.github || devData.linkedin || devData.discord) && (
              <div className="p-3 rounded-xl bg-black/40 border border-[#FF6700]/20 text-xs font-mono text-gray-400 flex flex-wrap gap-3">
                {devData.github && <span className="text-white">GitHub: <span className="text-[#FF6700]">{devData.github}</span></span>}
                {devData.linkedin && <span className="text-white">LinkedIn: <span className="text-[#FF6700]">{devData.linkedin}</span></span>}
                {devData.discord && <span className="text-white">Discord: <span className="text-[#FF6700]">{devData.discord}</span></span>}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[#FF6700] text-black font-black uppercase tracking-widest hover:shadow-[0_0_30px_#FF6700aa] transition-all disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer text-sm"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin text-base" /> Transmitting Encrypted Packet...
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </motion.div>
      </div>

      {/* 🚀 DEVELOPER DATA MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[130] p-6">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[#141824] p-8 md:p-10 rounded-[2.5rem] w-full max-w-md border border-[#FF6700]/30 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FF6700]/10 text-[#FF6700] mx-auto mb-4">
                <FaCode size={22} />
              </div>
              <h3 className="text-2xl font-black text-white mb-1 uppercase text-center tracking-tight">Developer Coordinates</h3>
              <p className="text-gray-400 text-center mb-6 text-xs font-mono uppercase tracking-wider">Connect your digital channels</p>
              
              <form onSubmit={handleDevModalSubmit} className="space-y-4">
                <div>
                  <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-1">GitHub Profile / Handle</label>
                  <input
                    type="text"
                    name="github"
                    value={devData.github}
                    onChange={handleDevChange}
                    placeholder="https://github.com/username"
                    className="w-full p-3.5 rounded-xl bg-[#0d0d0d] border border-white/10 text-white focus:border-[#FF6700] outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-1">LinkedIn Profile</label>
                  <input
                    type="text"
                    name="linkedin"
                    value={devData.linkedin}
                    onChange={handleDevChange}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full p-3.5 rounded-xl bg-[#0d0d0d] border border-white/10 text-white focus:border-[#FF6700] outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Discord Tag</label>
                  <input
                    type="text"
                    name="discord"
                    value={devData.discord}
                    onChange={handleDevChange}
                    placeholder="username or user#1234"
                    className="w-full p-3.5 rounded-xl bg-[#0d0d0d] border border-white/10 text-white focus:border-[#FF6700] outline-none text-sm"
                  />
                </div>

                <button type="submit" className="w-full bg-[#FF6700] text-black py-3.5 rounded-xl font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all mt-4 cursor-pointer">
                  Save Coordinates
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); if (!devData.github && !devData.linkedin && !devData.discord) setIsDeveloper(false); }}
                  className="w-full text-gray-500 text-xs mt-2 hover:text-white transition-colors uppercase font-bold tracking-widest cursor-pointer py-1"
                >
                  Close
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎉 SUCCESS CONFIRMATION MODAL */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 backdrop-blur-2xl flex items-center justify-center z-[140] p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }} className="bg-[#101524] p-8 md:p-12 rounded-[2.5rem] w-full max-w-lg border border-[#FF6700]/40 shadow-[0_0_60px_rgba(255,103,0,0.2)] text-center">
              <div className="w-16 h-16 rounded-full bg-[#FF6700]/10 text-[#FF6700] flex items-center justify-center mx-auto mb-6 text-3xl">
                <FaCheckCircle />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-3 uppercase tracking-tight">
                {successInfo.title}
              </h3>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8">
                {successInfo.desc}
              </p>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-4 rounded-xl bg-[#FF6700] text-black font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all cursor-pointer"
              >
                Back to Portfolio
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
