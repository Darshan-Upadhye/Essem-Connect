import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Star, Send, User, Mail, ShieldCheck, CheckCircle } from "lucide-react";
import "./Dashboard.css";

export default function Feedback() {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [problem, setProblem] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdY7fooo7CnkmCQaC5tvCNelBbjHUdx37jyhqZHPh7D3YWQGQ/formResponse";
    
    const formData = new FormData();
    formData.append("entry.1983598851", isAnonymous ? "Anonymous" : name);
    formData.append("entry.1531339605", isAnonymous ? "N/A" : email);
    formData.append("entry.287793579", rating.toString());
    formData.append("entry.799685197", problem);

    try {
      await fetch(formUrl, {
        method: "POST",
        mode: "no-cors",
        body: formData
      });
    } catch (error) {
      console.error("Feedback submission error", error);
    }

    setIsSubmitting(false);
    setShowPopup(true);

    setName("");
    setEmail("");
    setRating(0);
    setProblem("");
    setIsAnonymous(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <MessageSquare size={28} color="#ec4899" />
        <h2 className="section-title" style={{ margin: 0 }}>Feedback & Support</h2>
      </div>

      <div className="info-card" style={{ padding: '1.5rem', borderTop: '4px solid #ec4899', textAlign: 'center' }}>
        
        {/* --- ILLUSTRATION WITH TRANSPARENT CSS EFFECT --- */}
        <img 
          src="/Feedback_Illustrate_Essem_Connect.jpg" 
          alt="Feedback Illustration" 
          style={{ 
            width: '100%', 
            maxWidth: '300px', 
            margin: '0 auto 1rem auto', 
            display: 'block',
            mixBlendMode: 'multiply' // This removes the white background!
          }} 
        />

        <p style={{ color: '#4b5563', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          Your input helps improve the Essem Connect Web App for everyone on the factory floor. Let us know how we are doing!
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
          
          {/* Anonymous Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: isAnonymous ? '#f0fdf4' : '#f3f4f6', borderRadius: '0.5rem', border: `1px solid ${isAnonymous ? '#bbf7d0' : '#e5e7eb'}`, cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setIsAnonymous(!isAnonymous)}>
            <ShieldCheck size={20} color={isAnonymous ? "#16a34a" : "#9ca3af"} />
            <span style={{ fontSize: '0.9rem', color: isAnonymous ? '#16a34a' : '#4b5563', fontWeight: 500 }}>
              Submit Anonymously
            </span>
            <div style={{ marginLeft: 'auto', width: '36px', height: '20px', backgroundColor: isAnonymous ? '#22c55e' : '#d1d5db', borderRadius: '20px', position: 'relative', transition: 'all 0.3s' }}>
              <div style={{ width: '16px', height: '16px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: isAnonymous ? '18px' : '2px', transition: 'all 0.3s' }} />
            </div>
          </div>

          {/* Conditional Name & Email Fields */}
          <AnimatePresence>
            {!isAnonymous && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                  <div style={{ position: 'relative' }}>
                    <User size={18} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="text" placeholder="Your Name (Optional)" value={name} onChange={(e) => setName(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="email" placeholder="Your Email (Optional)" value={email} onChange={(e) => setEmail(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Star Rating Section */}
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', color: '#374151', fontWeight: 600, marginBottom: '0.5rem' }}>Rate your experience with Essem Connect</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} size={32} 
                  color={(hoveredStar || rating) >= star ? "#eab308" : "#d1d5db"}
                  fill={(hoveredStar || rating) >= star ? "#eab308" : "transparent"}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setRating(star)}
                  style={{ cursor: 'pointer', transition: 'all 0.1s' }}
                />
              ))}
            </div>
          </div>

          {/* Problem Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', color: '#374151', fontWeight: 600, marginBottom: '0.5rem' }}>
              Problem you faced in Essem Connect Web App
            </label>
            <textarea 
              required
              rows={4}
              placeholder="Describe the issue, bug, or feature request..."
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.95rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting || !problem || rating === 0}
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%',
              padding: '0.85rem', backgroundColor: (!problem || rating === 0) ? '#f3f4f6' : '#ec4899', 
              color: (!problem || rating === 0) ? '#9ca3af' : 'white', border: 'none', borderRadius: '0.75rem', 
              fontSize: '1rem', fontWeight: 600, cursor: (!problem || rating === 0) ? 'not-allowed' : 'pointer', transition: 'all 0.2s', marginTop: '0.5rem'
            }}
          >
            <Send size={18} /> {isSubmitting ? "Sending..." : "Submit Feedback"}
          </button>
        </form>
      </div>

      {/* --- SUCCESS POPUP MODAL --- */}
      <AnimatePresence>
        {showPopup && (
          <div className="modal-overlay" onClick={() => setShowPopup(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()} 
              style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '1rem', width: '100%', maxWidth: '350px', textAlign: 'center', position: 'relative' }}
            >
              <CheckCircle size={56} color="#10b981" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ color: '#1f2937', marginBottom: '0.5rem', fontSize: '1.25rem' }}>Thank You!</h3>
              <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                Thanks for your valuable feedback we are working on it where you have faced that problem.
              </p>
              <button 
                onClick={() => setShowPopup(false)} 
                style={{ width: '100%', padding: '0.75rem', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}