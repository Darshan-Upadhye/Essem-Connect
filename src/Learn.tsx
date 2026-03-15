import { motion } from "framer-motion";
import { 
  BookOpen, HelpCircle, AlertOctagon, Recycle, 
  CheckCircle, TrendingUp, Shield, Check, X 
} from "lucide-react";

export default function Learn() {
  // PPE Chart Data based on the provided image
  const ppeData = [
    { area: "Store", shoes: true, gloves: false, goggles: false, mask: false, helmet: true, earPlug: false, apron: true },
    { area: "Child Part Assembly", shoes: true, gloves: false, goggles: false, mask: false, helmet: false, earPlug: false, apron: true },
    { area: "Tinning", shoes: true, gloves: true, goggles: true, mask: true, helmet: false, earPlug: false, apron: true },
    { area: "Cutting Crimping", shoes: true, gloves: false, goggles: false, mask: false, helmet: false, earPlug: false, apron: true },
    { area: "Sleeve Cutting", shoes: true, gloves: false, goggles: false, mask: false, helmet: false, earPlug: false, apron: true },
    { area: "Maintenance", shoes: true, gloves: false, goggles: true, mask: false, helmet: true, earPlug: false, apron: true },
    { area: "Assembly", shoes: true, gloves: false, goggles: false, mask: false, helmet: false, earPlug: false, apron: true },
  ];

  const renderIcon = (isRequired: boolean) => {
    return isRequired 
      ? <Check size={18} color="#16a34a" style={{ margin: '0 auto' }} /> 
      : <X size={18} color="#dc2626" style={{ margin: '0 auto' }} />;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <BookOpen size={28} color="#9333ea" />
        <h2 className="section-title" style={{ margin: 0 }}>Learning Center</h2>
      </div>

      <div className="info-list">
        {/* 4M & 5S Section */}
        <div className="info-card border-purple">
          <div className="info-header"><CheckCircle size={20} color="#9333ea" /> <h3>Core Methodologies (4M & 5S)</h3></div>
          <div className="content-split">
            <div>
              <strong>4M Checklist:</strong>
              <ul>
                <li><strong>Man:</strong> Is the operator trained?</li>
                <li><strong>Machine:</strong> Is the applicator/machine OK?</li>
                <li><strong>Material:</strong> Are wires/terminals correct?</li>
                <li><strong>Method:</strong> Following the Work Instruction?</li>
              </ul>
            </div>
            <div>
              <strong>5S Principles:</strong>
              <ul>
                <li><strong>Sort:</strong> Remove unnecessary items.</li>
                <li><strong>Set in Order:</strong> A place for everything.</li>
                <li><strong>Shine:</strong> Keep the routing board clean.</li>
                <li><strong>Standardize:</strong> Follow visual rules.</li>
                <li><strong>Sustain:</strong> Maintain the discipline.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Kaizen Principle Section */}
        <div className="info-card border-green">
          <div className="info-header"><TrendingUp size={20} color="#16a34a" /> <h3>Kaizen (Continuous Improvement)</h3></div>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Kaizen</strong> is a Japanese term meaning "Change for the better." It is a mindset that focuses on continuous, small improvements in daily operations.
          </p>
          <ul style={{ paddingLeft: '1.2rem', color: '#4b5563', fontSize: '0.9rem', margin: 0 }}>
            <li>Every employee, from operators to management, is encouraged to suggest improvements.</li>
            <li>Focuses on eliminating waste (Muda) such as excess movement, waiting time, and defects.</li>
            <li>Small, daily optimizations lead to massive long-term gains in safety, quality, and efficiency.</li>
          </ul>
        </div>

        {/* PPE Applicability Chart */}
        <div className="info-card border-blue">
          <div className="info-header"><Shield size={20} color="#3b82f6" /> <h3>PPE Applicability by Process</h3></div>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1rem' }}>Mandatory Personal Protective Equipment (PPE) requirements across different plant areas.</p>
          
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Process Area</th>
                  <th>Shoes</th>
                  <th>Gloves</th>
                  <th>Goggles</th>
                  <th>Mask</th>
                  <th>Helmet</th>
                  <th>Ear Plug</th>
                  <th>Apron</th>
                </tr>
              </thead>
              <tbody>
                {ppeData.map((row, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: 'left', fontWeight: 500 }}>{row.area}</td>
                    <td>{renderIcon(row.shoes)}</td>
                    <td>{renderIcon(row.gloves)}</td>
                    <td>{renderIcon(row.goggles)}</td>
                    <td>{renderIcon(row.mask)}</td>
                    <td>{renderIcon(row.helmet)}</td>
                    <td>{renderIcon(row.earPlug)}</td>
                    <td>{renderIcon(row.apron)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Color Coding: Bins & Dustbins */}
        <div className="info-card border-blue">
          <div className="info-header"><Recycle size={20} color="#3b82f6" /> <h3>Color Codes: Bins & Dustbins</h3></div>
          <div className="content-split">
            <div>
              <strong>Material Bins:</strong>
              <ul className="color-list">
                <li><span className="color-dot bg-green"></span> <strong>Green:</strong> OK / Passed Parts</li>
                <li><span className="color-dot bg-red"></span> <strong>Red:</strong> Rejected / Scrap</li>
                <li><span className="color-dot bg-yellow"></span> <strong>Yellow:</strong> Suspected / Hold</li>
                <li><span className="color-dot bg-blue"></span> <strong>Blue:</strong> Raw Material</li>
              </ul>
            </div>
            <div>
              <strong>Dustbins:</strong>
              <ul className="color-list">
                <li><span className="color-dot bg-green"></span> <strong>Green:</strong> Wet / Canteen Waste</li>
                <li><span className="color-dot bg-blue"></span> <strong>Blue:</strong> Dry / Paper / Cardboard</li>
                <li><span className="color-dot bg-red"></span> <strong>Red:</strong> Hazardous / Chemical</li>
                <li><span className="color-dot bg-yellow"></span> <strong>Yellow:</strong> Glass / Sharp objects</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Abnormal Situations */}
        <div className="info-card border-orange">
          <div className="info-header"><AlertOctagon size={20} color="#f97316" /> <h3>Abnormal Situations & Protocols</h3></div>
          <p style={{ marginBottom: '0.5rem' }}>An <strong>Abnormal Situation</strong> is any deviation from standard operations. Immediately stop work and inform the supervisor if you encounter:</p>
          <ul style={{ marginBottom: '1rem', paddingLeft: '1.2rem', color: '#4b5563', fontSize: '0.9rem' }}>
            <li>Machine breakdown or strange noises.</li>
            <li>Defective raw materials (e.g., oxidized terminals).</li>
            <li>Power failure or accident on the floor.</li>
          </ul>
          <p style={{ marginBottom: '0.5rem' }}><strong>Term Definitions:</strong></p>
          <ul style={{ paddingLeft: '1.2rem', color: '#4b5563', fontSize: '0.9rem' }}>
            <li><strong>Suspected:</strong> Parts that may have a defect. Do not mix; place in Yellow bin for QA inspection.</li>
            <li><strong>Retro:</strong> Modifying or reworking an existing, finished wiring harness based on a new customer drawing update.</li>
          </ul>
        </div>

        {/* FAQ */}
        <div className="info-card border-gray">
          <div className="info-header"><HelpCircle size={20} color="#6b7280" /> <h3>Frequently Asked Questions</h3></div>
          <div className="faq-item">
            <strong>Q: What is a PFC (Process Flow Chart)?</strong>
            <p>A: A visual document detailing the exact step-by-step sequence of operations required to build a wire harness, from raw material to finished good.</p>
          </div>
          <div className="faq-item">
            <strong>Q: What is a WI (Work Instruction)?</strong>
            <p>A: A detailed, visual guide mounted at your workstation explaining precisely how to perform a specific manufacturing task correctly and safely according to quality standards.</p>
          </div>
          <div className="faq-item">
            <strong>Q: Where do I check the exact wire length?</strong>
            <p>A: Always refer to the Work Instruction (WI) mounted at your designated routing or cutting station.</p>
          </div>
          <div className="faq-item">
            <strong>Q: What if a terminal crimp looks loose?</strong>
            <p>A: Stop. Place the wire in the Suspected (Yellow) bin and request a pull-force test from QA.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}