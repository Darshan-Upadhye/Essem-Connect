import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Shield, Zap, Scissors, Eye, HandMetal, 
  PlusSquare, Wind, Activity, ArrowRight,
  AlertTriangle, CheckCircle, PhoneCall
} from "lucide-react"; // Flame removed to fix the warning
import "./Dashboard.css";

export default function Safety() {
  const [daysAccidentFree, setDaysAccidentFree] = useState(0);

  useEffect(() => {
    // --- SET YOUR LAST ACCIDENT DATE HERE (YYYY-MM-DD) ---
    // I set this to exactly 142 days ago. It will automatically update to 143 tomorrow!
    const lastIncidentDate = new Date("2025-10-22T00:00:00"); 
    const today = new Date();
    
    // Calculate the difference in milliseconds, then convert to days
    const differenceInTime = today.getTime() - lastIncidentDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    
    // Fallback to 0 if the date is set in the future by accident
    setDaysAccidentFree(differenceInDays > 0 ? differenceInDays : 0);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <Shield size={28} color="#ef4444" />
        <h2 className="section-title" style={{ margin: 0 }}>Health & Safety Dashboard</h2>
      </div>

      {/* Graphical Safety Status Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, #16a34a, #22c55e)', 
        borderRadius: '1rem', 
        padding: '1.5rem', 
        color: 'white', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        boxShadow: '0 4px 15px rgba(22, 163, 74, 0.3)'
      }}>
        <div>
          <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={24} /> Plant Safety Status: SECURE
          </h3>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>All manufacturing zones operating under standard safety parameters.</p>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.2)', padding: '0.75rem 1.5rem', borderRadius: '0.75rem' }}>
          {/* Dynamic Counter Here! */}
          <span style={{ display: 'block', fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{daysAccidentFree}</span>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Days Accident Free</span>
        </div>
      </div>

      {/* Emergency Protocol - Visual Flow */}
      <h3 style={{ fontSize: '1.1rem', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <AlertTriangle color="#ef4444" size={20} /> Emergency Response Protocol
      </h3>
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem'
      }}>
        <div style={{ flex: 1, minWidth: '150px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '0.75rem', padding: '1rem', textAlign: 'center' }}>
          <HandMetal size={32} color="#dc2626" style={{ margin: '0 auto 0.5rem auto' }} />
          <h4 style={{ color: '#991b1b', margin: '0 0 0.5rem 0', fontSize: '0.95rem' }}>1. E-STOP</h4>
          <p style={{ fontSize: '0.8rem', color: '#7f1d1d', margin: 0 }}>Hit the red Emergency Stop button on the applicator/machine immediately.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', color: '#9ca3af' }}><ArrowRight size={24} /></div>
        
        <div style={{ flex: 1, minWidth: '150px', background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '0.75rem', padding: '1rem', textAlign: 'center' }}>
          <PhoneCall size={32} color="#d97706" style={{ margin: '0 auto 0.5rem auto' }} />
          <h4 style={{ color: '#b45309', margin: '0 0 0.5rem 0', fontSize: '0.95rem' }}>2. ALERT</h4>
          <p style={{ fontSize: '0.8rem', color: '#92400e', margin: 0 }}>Inform the Line Supervisor and Maintenance team immediately.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', color: '#9ca3af' }}><ArrowRight size={24} /></div>
        
        <div style={{ flex: 1, minWidth: '150px', background: '#d1fae5', border: '1px solid #fcd34d', borderRadius: '0.75rem', padding: '1rem', textAlign: 'center' }}>
          <PlusSquare size={32} color="#059669" style={{ margin: '0 auto 0.5rem auto' }} />
          <h4 style={{ color: '#047857', margin: '0 0 0.5rem 0', fontSize: '0.95rem' }}>3. FIRST AID</h4>
          <p style={{ fontSize: '0.8rem', color: '#065f46', margin: 0 }}>Provide basic first aid if trained, or escort to the medical room.</p>
        </div>
      </div>

      <h3 style={{ fontSize: '1.1rem', color: '#1f2937', marginBottom: '1rem' }}>Detailed Hazard Guidelines</h3>
      <div className="grid-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        
        <div className="info-card border-red">
          <div className="info-header"><Scissors size={24} color="#ef4444" /> <h3>Mechanical & Pinch Hazards</h3></div>
          <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.9rem', color: '#4b5563', lineHeight: 1.6 }}>
            <li><strong>Crimping Presses:</strong> Never bypass the transparent safety guards. Always use tools, not fingers, to clear jammed terminals.</li>
            <li><strong>Wire Cutters:</strong> Blades are razor-sharp. Lock stripping machines before attempting any blade adjustments.</li>
            <li><strong>Loose Clothing:</strong> Aprons must be tied securely. No loose jewelry or untied hair near rotating stripping wheels.</li>
          </ul>
        </div>

        <div className="info-card border-blue">
          <div className="info-header"><Zap size={24} color="#3b82f6" /> <h3>Electrical Testing Safety</h3></div>
          <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.9rem', color: '#4b5563', lineHeight: 1.6 }}>
            <li><strong>Continuity Boards:</strong> Ensure testing boards are properly grounded before starting the shift.</li>
            <li><strong>High Voltage (HV) Tests:</strong> Stand on the insulated rubber mat. Do not touch the harness or test pins while the HV light is active.</li>
            <li><strong>Cable Damage:</strong> Report any frayed cords on the testing equipment immediately. Do not use tape to fix testing probes.</li>
          </ul>
        </div>

        <div className="info-card border-orange">
          <div className="info-header"><Wind size={24} color="#f97316" /> <h3>Soldering & Tinning Fumes</h3></div>
          <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.9rem', color: '#4b5563', lineHeight: 1.6 }}>
            <li><strong>Ventilation:</strong> The exhaust fume hood MUST be turned on 5 minutes before the solder pot reaches operating temperature.</li>
            <li><strong>Flux Handling:</strong> Avoid skin contact with chemical flux. Use designated droppers or brushes.</li>
            <li><strong>PPE Required:</strong> Goggles, Mask, and Apron are strictly mandatory in the Tinning zone as per the plant PPE chart.</li>
          </ul>
        </div>

        <div className="info-card border-purple">
          <div className="info-header"><Activity size={24} color="#9333ea" /> <h3>Ergonomics & Material Handling</h3></div>
          <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.9rem', color: '#4b5563', lineHeight: 1.6 }}>
            <li><strong>Routing Boards:</strong> Adjust the angle of the assembly board to prevent excessive neck bending or shoulder strain.</li>
            <li><strong>Wire Reels:</strong> Do not lift heavy wire spools manually. Use the designated trolley or ask for a two-person lift.</li>
            <li><strong>Micro-Breaks:</strong> Perform wrist and hand stretches every 2 hours to prevent repetitive strain from manual taping and routing.</li>
          </ul>
        </div>

        <div className="info-card border-green">
          <div className="info-header"><Eye size={24} color="#22c55e" /> <h3>Chemical & Fire Safety</h3></div>
          <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.9rem', color: '#4b5563', lineHeight: 1.6 }}>
            <li><strong>Flammable Materials:</strong> Keep IPA (Isopropyl Alcohol) and thinners in sealed, approved dispensers. Keep away from the heat gun station.</li>
            <li><strong>Heat Shrink Guns:</strong> Always place the heat gun in its metal holster when not actively shrinking tubes. Never leave it running unattended.</li>
            <li><strong>Extinguishers:</strong> Know the location of the nearest CO2/Powder extinguisher. Do not block fire exits with scrap bins.</li>
          </ul>
        </div>

      </div>
    </motion.div>
  );
}