import { useState } from "react";
import { FaLinkedin, FaGithub, FaDiscord, FaEnvelope, FaCode } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [devData, setDevData] = useState({ linkedin: "", github: "", discord: "" });
  const [isDeveloper, setIsDeveloper] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleDevChange = (e) => setDevData({ ...devData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1500));
      alert("Message sent! I'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      alert("Error sending message.");
    } finally {
      setLoading(false);
    }
  };

  const handleDevSubmit = (e) => {
    e.preventDefault();
    setShowModal(false);
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 3500);
    setDevData({ linkedin: "", github: "", discord: "" });
  };

  return (
    <section className="bg-[#0d0d0d] text-white py-24 px-6 md:px-16 lg:px-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#FF6700]/5 blur-[120px] rounded-full -translate-y-1/2" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 relative z-10">
        
        {/* LEFT: Information & Socials */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="flex-1 flex flex-col"
        >
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
            Let's <span className="text-[#FF6700]">Talk.</span>
          </h2>
          
          <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10 max-w-lg">
            Whether you have a <span className="text-white font-medium">game-changing idea</span> or just want to discuss the latest tech stack—my inbox is always open.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <FaLinkedin />, label: "LinkedIn", color: "#0077b5", link: "https://linkedin.com/in/abhishek-yadav-rootabhi" },
              { icon: <FaGithub />, label: "GitHub", color: "#ffffff", link: "https://github.com/theabhi-labs" },
              { icon: <FaDiscord />, label: "Discord", color: "#5865F2", link: "https://discord.com/users/anuragabhi" },
              { icon: <FaEnvelope />, label: "Email", color: "#FF6700", link: "mailto:abhishekyadavcode@gmail.com" },
            ].map((social, i) => (
              <motion.a
                key={i}
                href={social.link}
                target="_blank"
                whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.05)" }}
                className="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-[#141414] transition-all group"
              >
                <span className="text-2xl transition-colors group-hover:text-[#FF6700]" style={{ color: social.color }}>
                  {social.icon}
                </span>
                <span className="font-medium text-gray-300 group-hover:text-white">{social.label}</span>
              </motion.a>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-3xl border border-dashed border-[#FF6700]/30 bg-[#FF6700]/5">
            <p className="text-[#FF6700] font-mono text-sm uppercase tracking-widest mb-2">Current Status</p>
            <p className="text-white text-lg font-medium italic">"Every great project starts with a simple Hello."</p>
          </div>
        </motion.div>

        {/* RIGHT: Contact Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="flex-1 w-full"
        >
          <form
            onSubmit={handleSubmit}
            className="bg-white/5 backdrop-blur-md p-8 md:p-12 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col gap-6"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500 ml-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full p-4 rounded-xl bg-[#0d0d0d] border border-white/10 text-white focus:ring-2 focus:ring-[#FF6700]/50 outline-none transition-all"
                  required
                />
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500 ml-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full p-4 rounded-xl bg-[#0d0d0d] border border-white/10 text-white focus:ring-2 focus:ring-[#FF6700]/50 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-500 ml-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your project..."
                rows="5"
                className="w-full p-4 rounded-xl bg-[#0d0d0d] border border-white/10 text-white focus:ring-2 focus:ring-[#FF6700]/50 outline-none transition-all resize-none"
                required
              ></textarea>
            </div>

            <div 
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${isDeveloper ? 'bg-[#FF6700]/10 border-[#FF6700]' : 'border-white/5 bg-white/5'}`}
              onClick={() => {
                setIsDeveloper(!isDeveloper);
                if (!isDeveloper) setShowModal(true);
              }}
            >
              <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${isDeveloper ? 'bg-[#FF6700] border-[#FF6700]' : 'border-gray-600'}`}>
                {isDeveloper && <FaCode className="text-xs text-black" />}
              </div>
              <span className="text-gray-300 font-medium">I am a Developer / Designer</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[#FF6700] text-black font-black uppercase tracking-widest hover:shadow-[0_0_30px_#FF6700aa] transition-all disabled:opacity-50"
            >
              {loading ? "Transmitting..." : "Send Message"}
            </button>
          </form>
        </motion.div>
      </div>

      {/* MODAL & ANIMATION (Stay same as your logic but with better styling) */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[100] p-6">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-[#141414] p-10 rounded-[2.5rem] w-full max-w-md border border-[#FF6700]/20 shadow-3xl">
              <h3 className="text-3xl font-black text-white mb-2 uppercase italic text-center">Dev Connect</h3>
              <p className="text-gray-500 text-center mb-8 text-sm uppercase tracking-tighter">Enter your digital coordinates</p>
              <form onSubmit={handleDevSubmit} className="space-y-4">
                {['linkedin', 'github', 'discord'].map((field) => (
                  <input key={field} type="text" name={field} value={devData[field]} onChange={handleDevChange} placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)} URL`} className="w-full p-4 rounded-xl bg-[#0d0d0d] border border-white/10 text-white focus:border-[#FF6700] outline-none" required />
                ))}
                <button type="submit" className="w-full bg-white text-black py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-[#FF6700] transition-colors mt-4">Initiate Connection</button>
                <button type="button" onClick={() => { setShowModal(false); setIsDeveloper(false); }} className="w-full text-gray-500 text-sm mt-2 hover:text-white transition-colors uppercase font-bold tracking-widest">Cancel</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connecting Animation */}
      <AnimatePresence>
        {showAnimation && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[#0d0d0d] flex flex-col items-center justify-center z-[200]">
            <div className="flex gap-3 mb-6">
              {[0, 1, 2].map((i) => (
                <motion.div key={i} animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }} className="w-5 h-5 bg-[#FF6700] rounded-full shadow-[0_0_15px_#FF6700]" />
              ))}
            </div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-mono text-[#FF6700]">AUTHENTICATING DEVELOPER...</motion.p>
            <p className="mt-4 text-gray-500 font-mono tracking-widest">ENCRYPTING DATA & BRIDGING PROTOCOLS</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
