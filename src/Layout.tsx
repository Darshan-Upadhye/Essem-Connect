import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, Menu as MenuIcon, Info, Settings, AlertTriangle, 
  LogOut, Linkedin, Github, Mail, Globe, MessageCircle 
} from "lucide-react";
import "./Dashboard.css";

export default function Layout() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<"about" | "settings" | "profile" | "comingSoon" | null>(null);
  const [comingSoonItem, setComingSoonItem] = useState("");

  const handleComingSoon = (itemName: string) => {
    setComingSoonItem(itemName);
    setActiveModal("comingSoon");
  };

  return (
    <div className="dashboard-container">
      {/* HEADER: Logo moved to left side */}
      <header className="glass-header">
        <div className="header-content" style={{ justifyContent: 'flex-start' }}>
          <img src="/Essem_Connect_Logo1.png" alt="Essem Logo" className="header-logo" />
        </div>
      </header>

      {/* DYNAMIC CONTENT: This is where Dashboard, Departments, etc. will load */}
      <main className="dashboard-content">
        <Outlet context={{ handleComingSoon, setActiveModal }} />
      </main>

      {/* GLOBAL FOOTER: Shows on all pages */}
      <footer className="glass-footer">
        <div className="footer-nav">
          {/* Changed Home to Feedback */}
          <button className="nav-item" onClick={() => navigate("/feedback")}>
            <MessageSquare size={24} />
            <span>Feedback</span>
          </button>
          {/* Menu redirects to dashboard */}
          <button className="nav-item" onClick={() => navigate("/dashboard")}>
            <MenuIcon size={24} />
            <span>Menu</span>
          </button>
          <button className="nav-item" onClick={() => setActiveModal("about")}>
            <Info size={24} />
            <span>About</span>
          </button>
          <button className="nav-item" onClick={() => setActiveModal("settings")}>
            <Settings size={24} />
            <span>Setting</span>
          </button>
        </div>
      </footer>

      {/* ALL MODALS */}
      <AnimatePresence>
        {activeModal && (
          <div className="modal-overlay" onClick={() => setActiveModal(null)}>
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()} 
            >
              <button className="close-btn" onClick={() => setActiveModal(null)}>×</button>

              {/* Coming Soon */}
              {activeModal === "comingSoon" && (
                <div className="modal-body text-center">
                  <AlertTriangle size={48} className="modal-icon" style={{ color: '#3b82f6', margin: '0 auto 1rem auto', display: 'block' }} />
                  <h3>{comingSoonItem}</h3>
                  <p>This module is currently under development and will be coming soon!</p>
                </div>
              )}

              {/* About App */}
              {activeModal === "about" && (
                <div className="modal-body">
                  {/* Added Essem Connect Logo Here */}
                  <img src="/Essem_Connect_Logo1.png" alt="Essem Connect Logo" style={{ height: '60px', margin: '0 auto 1.5rem auto', display: 'block', objectFit: 'contain' }} />
                  
                  <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>About Essem Connect</h3>
                  <p>Essem Connect Web App is a comprehensive digital platform developed to streamline and digitalize manufacturing and operational workflows.</p>
                  <p><strong>Why it was developed:</strong> To eliminate manual tracking, reduce errors, and bring all departmental data into one centralized system.</p>
                  <p><strong>Who benefits:</strong> Supervisors, floor managers, quality inspectors, and executive management gain real-time insights.</p>
                  
                  {/* Clickable Developer Credit - Made Text Smaller */}
                  <div 
                    className="developer-credit" 
                    onClick={() => setActiveModal("profile")} 
                    style={{ cursor: 'pointer', padding: '0.75rem', borderRadius: '0.5rem', background: '#f9fafb', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  >
                    <p style={{ fontSize: '0.7rem', color: '#6b7280', margin: '0 0 0.2rem 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Developed by</p>
                    <h4 style={{ fontSize: '0.95rem', color: '#9333ea', margin: 0, fontWeight: '700' }}>Darshan Akshay Upadhye</h4>
                  </div>
                </div>
              )}

              {/* Professional Developer Profile */}
              {activeModal === "profile" && (
                <div className="modal-body profile-modal">
                  {/* Highly Professional Avatar with a blazer and theme-matching background */}
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Darshan&backgroundColor=eff6ff&clothing=blazerAndShirt" 
                    alt="Darshan Akshay Upadhye" 
                    className="profile-avatar" 
                    style={{ border: '4px solid #fdf2f8', boxShadow: '0 4px 15px rgba(147, 51, 234, 0.2)' }} 
                  />
                  
                  <h2 className="profile-name" style={{ fontSize: '1.25rem' }}>Darshan Akshay Upadhye</h2>
                  <p className="profile-title" style={{ color: '#db2777', fontSize: '0.85rem', marginTop: '0.25rem' }}>B.Tech (E&C) • Full Stack Developer</p>
                  
                  <p className="profile-bio" style={{ fontSize: '0.85rem', textAlign: 'justify', marginTop: '1rem' }}>
                    Hi, I'm Darshan Akshay Upadhye, a final-year B.Tech student in Electronics and Computer Engineering. I specialize in Full Stack Web Development, Generative AI, and Graphic Design. I enjoy building innovative and intelligent web applications that solve real-world problems using cutting-edge technologies.
                  </p>
                  
                  <div className="profile-socials" style={{ marginTop: '1.5rem' }}>
                    <a href="https://www.linkedin.com/in/darshan-upadhye-02a9a5287/" className="social-icon" title="LinkedIn"><Linkedin size={18} /></a>
                    <a href="https://github.com/Darshan-Upadhye" className="social-icon" title="GitHub"><Github size={18} /></a>
                    <a href="mailto:darshanupadhye272@gmail.com" className="social-icon" title="Email"><Mail size={18} /></a>
                    {/* WhatsApp Icon Added Back Here! */}
                    <a href="https://wa.me/918412967484?text=Hi%20Darshan,%20I%20would%20like%20to%20connect%20with%20you" className="social-icon" title="WhatsApp"><MessageCircle size={18} /></a>
                    <a href="#" className="social-icon" title="Website"><Globe size={18} /></a>
                  </div>
                </div>
              )}

              {/* Settings */}
              {activeModal === "settings" && (
                <div className="modal-body">
                  <h3>Settings</h3>
                  <ul className="settings-list">
                    <li><span>Dark Mode</span><span className="badge">Coming Soon</span></li>
                    <li onClick={() => setActiveModal("about")} style={{ cursor: 'pointer' }}><span>About</span></li>
                    <li className="exit-btn" onClick={() => navigate("/")}><LogOut size={18} /><span>Exit Application</span></li>
                  </ul>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}