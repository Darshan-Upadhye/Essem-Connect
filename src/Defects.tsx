import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle, Wrench, Zap, Link, Box, 
  Circle, Shield, MoreHorizontal, Settings, Info,
  CheckCircle, XCircle
} from "lucide-react";
import "./Dashboard.css"; // Reusing your master theme!

// --- Defect Database with Rework Logic ---
const defectData = [
  {
    category: "Lumberg Defects",
    icon: <Settings size={20} />,
    color: "#db2777",
    defects: [
      { name: "Wire Location", rework: true, guide: "Use the designated extraction tool to remove the terminal. Re-insert into the correct cavity and perform a click & pull test." },
      { name: "Lumberg Backout", rework: true, guide: "Push the terminal fully into the housing until it clicks. Perform a pull test. If the locking lance is damaged, cut and re-crimp." },
      { name: "Lumberg wire excess / short", rework: false, guide: "Unrecoverable if too short. If excess, depends on tolerance. Usually requires cut and re-crimp." },
      { name: "Lumberg terminal damage", rework: false, guide: "Cut wire, strip, and re-crimp a new Lumberg terminal." },
      { name: "Lumberg wrong", rework: true, guide: "Extract incorrect terminal, cut wire, and re-crimp with the correct Lumberg terminal." },
      { name: "Lumberg terminal gap excess", rework: false, guide: "Reject. Terminal must be replaced to ensure proper mating." },
      { name: "Lumberg half press", rework: true, guide: "Use a hand tool or press to fully seat the terminal until locked." }
    ]
  },
  {
    category: "Terminal Defects",
    icon: <Zap size={20} />,
    color: "#eab308",
    defects: [
      { name: "PVC crimping", rework: false, guide: "Cut affected area, strip to standard length, and re-crimp." },
      { name: "Crimping Backout", rework: false, guide: "Cut and re-crimp. Adjust applicator height to prevent recurrence." },
      { name: "Terminal Damage Cut Bend", rework: false, guide: "Scrap terminal. Cut wire and re-crimp." },
      { name: "Terminal Backout", rework: true, guide: "Ensure terminal is fully pushed into housing until secondary lock engages." },
      { name: "Copper stands out", rework: false, guide: "Cut, re-strip ensuring all strands are gathered, and re-crimp." },
      { name: "Low core / High core", rework: false, guide: "Applicator adjustment required. Cut and re-crimp." },
      { name: "Wire seal damage", rework: false, guide: "Cut wire, insert new wire seal, and re-crimp." },
      { name: "CFM rejection", rework: false, guide: "Verify Crimp Force Monitor settings. Discard suspected piece." },
      { name: "Double stroke / Empty stroke", rework: false, guide: "Scrap terminal. Clear applicator jam if any." },
      { name: "Head cut, Bend, twist", rework: false, guide: "Cut and re-crimp. Check feeding mechanism on machine." },
      { name: "PVC barrel Damage", rework: false, guide: "Cut and re-crimp." },
      { name: "Strip length problem", rework: false, guide: "Adjust stripping blade/settings. Cut and re-process." },
      { name: "Less crimping strength", rework: false, guide: "Adjust crimp height. Perform pull-force test on next piece." },
      { name: "Excess blur", rework: false, guide: "Check tooling wear (anvil/punch). Replace terminal." },
      { name: "Applicator / Tool problem", rework: true, guide: "Call Maintenance for setup. Halt production on this machine." },
      { name: "Wire seal hole block", rework: false, guide: "Replace seal and re-crimp." },
      { name: "Wire seal out", rework: true, guide: "Manually adjust and push seal into correct position if uncrimped." },
      { name: "HST Cross out / HST wrong", rework: true, guide: "Cut old Heat Shrink Tube, apply new correct HST, and shrink." },
      { name: "Load fail", rework: false, guide: "Scrap and re-crimp. Check terminal reel tension." },
      { name: "Start piece / End piece", rework: false, guide: "Standard scrap for machine calibration." }
    ]
  },
  {
    category: "Connector Defects",
    icon: <Link size={20} />,
    color: "#3b82f6",
    defects: [
      { name: "Wire Location", rework: true, guide: "Extract terminal with specific tool and insert into correct connector cavity." },
      { name: "Backout", rework: true, guide: "Push terminal until lance locks. Engage secondary lock (TPA) if available." },
      { name: "Connector damage", rework: true, guide: "De-pin all terminals, discard damaged connector, and re-pin into a new connector." },
      { name: "Connector Shortmould / Flash", rework: true, guide: "De-pin and replace the defective connector housing." }
    ]
  },
  {
    category: "Retainer Defects",
    icon: <Shield size={20} />,
    color: "#8b5cf6",
    defects: [
      { name: "Damage", rework: true, guide: "Remove damaged retainer and replace with a new one." },
      { name: "Retainer Missing", rework: true, guide: "Snap a new retainer into the housing." },
      { name: "Retainer Open", rework: true, guide: "Push retainer firmly until it clicks into the fully locked position." }
    ]
  },
  {
    category: "Housing Defects",
    icon: <Box size={20} />,
    color: "#14b8a6",
    defects: [
      { name: "Wire Location", rework: true, guide: "Extract and relocate to the correct cavity." },
      { name: "Housing damage / crack", rework: true, guide: "De-pin all wires and replace the entire housing." },
      { name: "Housing Backout", rework: true, guide: "Ensure mating halves are fully pushed together until latched." },
      { name: "Gasket Missing in Housing", rework: true, guide: "De-pin, insert missing gasket, and re-pin." }
    ]
  },
  {
    category: "Grommet Defects",
    icon: <Circle size={20} />,
    color: "#f97316",
    defects: [
      { name: "Wrong Grommet", rework: true, guide: "Cut zip ties/tape, remove wrong grommet, slide on correct one, and re-tape." },
      { name: "Extra hole in grommet", rework: false, guide: "Water leakage risk. Replace grommet entirely." },
      { name: "Wire Location", rework: true, guide: "Reroute wire through the correct grommet hole." },
      { name: "Damage grommet", rework: true, guide: "Remove and replace the damaged grommet." }
    ]
  },
  {
    category: "Cable Defects",
    icon: <Wrench size={20} />,
    color: "#10b981",
    defects: [
      { name: "Cable length short", rework: false, guide: "Unrecoverable. Scrap the wire." },
      { name: "Cable length excess", rework: true, guide: "Cut to exact required length and re-process the end." },
      { name: "Heat sealing/shrinking open", rework: true, guide: "Re-apply heat gun evenly until fully shrunk. If burnt, must cut and replace." },
      { name: "Heat sealing burn", rework: false, guide: "Insulation damaged. Cut affected area and rework." },
      { name: "Cable damege", rework: false, guide: "Core/insulation damage is not allowed. Scrap wire." },
      { name: "Same cable in joint cable", rework: true, guide: "Separate cables and re-route correctly." },
      { name: "Tinning missing / not ok", rework: true, guide: "Apply flux and re-dip in solder pot for specified time." }
    ]
  },
  {
    category: "Other Defects",
    icon: <MoreHorizontal size={20} />,
    color: "#64748b",
    defects: [
      { name: "Sleeve length short / excess", rework: true, guide: "Remove sleeve and cut/apply a new one to exact drawing spec." },
      { name: "Nylon socket missing / double", rework: true, guide: "Add missing socket or remove the extra one." },
      { name: "Spring missing / double", rework: true, guide: "Install missing spring or remove duplicate." },
      { name: "Gasket Missing / wrong / damage", rework: true, guide: "Replace or install the correct gasket." },
      { name: "Screen printing missing / spread", rework: true, guide: "Clean with solvent if spread, or re-print/re-label." },
      { name: "Wire seal & gum seal missing / Backout", rework: false, guide: "Requires cutting the terminal and re-crimping with a seal." },
      { name: "Tapping open / not ok", rework: true, guide: "Remove bad tape and re-tape with 50% overlap as per standard." },
      { name: "Water / air leakage for grommet", rework: false, guide: "Check grommet size. Usually requires replacement." },
      { name: "Label missing", rework: true, guide: "Print and attach new label at the specified dimension." },
      { name: "S stamp missing", rework: true, guide: "Apply the 'S' (Safety) stamp on the designated area." },
      { name: "Cable tie missing", rework: true, guide: "Fasten cable tie and cut flush with no sharp edges." },
      { name: "Dummy Seal missing", rework: true, guide: "Insert dummy seal into the empty connector cavity." },
      { name: "Terminal missing", rework: true, guide: "Crimp missing terminal and insert into housing." }
    ]
  }
];

export default function Defects() {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [selectedDefect, setSelectedDefect] = useState<any | null>(null);

  const activeCategory = defectData[activeCategoryIndex];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <AlertTriangle size={28} color="#ef4444" />
        <h2 className="section-title" style={{ margin: 0 }}>Defect Library & Rework</h2>
      </div>

      {/* Graphical Representation (Summary Chart Mockup) */}
      <div className="info-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.75rem', fontWeight: 600 }}>DEFECT CATEGORY DISTRIBUTION</p>
        <div style={{ display: 'flex', gap: '4px', height: '24px', borderRadius: '12px', overflow: 'hidden' }}>
          {defectData.map((cat, idx) => (
            <div 
              key={idx} 
              style={{ 
                flex: cat.defects.length, 
                backgroundColor: cat.color,
                opacity: activeCategoryIndex === idx ? 1 : 0.4,
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
              onClick={() => setActiveCategoryIndex(idx)}
              title={cat.category}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#9ca3af', marginTop: '0.5rem' }}>
          <span>Lumberg</span>
          <span>Terminal (Largest)</span>
          <span>Others</span>
        </div>
      </div>

      {/* Layout: Sidebar Categories + Main List */}
      <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
        
        {/* Horizontal Scrollable Categories */}
        <div style={{ display: 'flex', overflowX: 'auto', gap: '0.5rem', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
          {defectData.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategoryIndex(idx)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.6rem 1rem', borderRadius: '2rem',
                border: 'none', whiteSpace: 'nowrap', cursor: 'pointer',
                backgroundColor: activeCategoryIndex === idx ? cat.color : 'rgba(255,255,255,0.7)',
                color: activeCategoryIndex === idx ? '#fff' : '#4b5563',
                boxShadow: activeCategoryIndex === idx ? `0 4px 10px ${cat.color}40` : '0 2px 4px rgba(0,0,0,0.05)',
                fontWeight: activeCategoryIndex === idx ? 600 : 400,
                transition: 'all 0.2s'
              }}
            >
              {cat.icon}
              {cat.category} ({cat.defects.length})
            </button>
          ))}
        </div>

        {/* Selected Category Defects List */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '1rem', color: activeCategory.color, margin: '0.5rem 0' }}>
            {activeCategory.category} Checklist
          </h3>
          
          {activeCategory.defects.map((defect, idx) => (
            <div 
              key={idx} 
              className="info-card" 
              style={{ 
                padding: '1rem', 
                borderLeftColor: activeCategory.color, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedDefect(defect)}
            >
              <span style={{ fontWeight: 500, color: '#374151' }}>{defect.name}</span>
              
              {/* Graphical Badge for Rework Status */}
              {defect.rework ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#16a34a', backgroundColor: '#dcfce7', padding: '4px 8px', borderRadius: '12px', fontWeight: 600 }}>
                  <Wrench size={14} /> Reworkable
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#dc2626', backgroundColor: '#fee2e2', padding: '4px 8px', borderRadius: '12px', fontWeight: 600 }}>
                  <XCircle size={14} /> Scrap / Cut
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Rework Guide Modal Popup */}
      <AnimatePresence>
        {selectedDefect && (
          <div className="modal-overlay" onClick={() => setSelectedDefect(null)}>
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()} 
            >
              <button className="close-btn" onClick={() => setSelectedDefect(null)}>×</button>
              
              <div className="modal-body text-center">
                {selectedDefect.rework ? (
                  <CheckCircle size={48} color="#16a34a" style={{ margin: '0 auto 1rem auto' }} />
                ) : (
                  <AlertTriangle size={48} color="#dc2626" style={{ margin: '0 auto 1rem auto' }} />
                )}
                
                <h3 style={{ marginBottom: '0.5rem' }}>{selectedDefect.name}</h3>
                
                <span style={{ 
                  display: 'inline-block', 
                  padding: '4px 12px', 
                  borderRadius: '12px', 
                  fontSize: '0.8rem', 
                  fontWeight: 600,
                  backgroundColor: selectedDefect.rework ? '#dcfce7' : '#fee2e2',
                  color: selectedDefect.rework ? '#16a34a' : '#dc2626',
                  marginBottom: '1.5rem'
                }}>
                  Status: {selectedDefect.rework ? "Authorized for Rework" : "Do Not Rework (Scrap/Cut)"}
                </span>

                <div style={{ textAlign: 'left', backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', marginBottom: '0.5rem', fontWeight: 600 }}>
                    <Info size={18} /> Standard Operating Procedure (SOP):
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#374151', lineHeight: 1.5 }}>
                    {selectedDefect.guide}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}