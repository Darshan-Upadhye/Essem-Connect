import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Plus, Search, Users, Box, Trash2, StickyNote } from "lucide-react";
import { fullModelDatabase } from "./modelData"; 
import "./Dashboard.css";

// Interface for a single Plan Item
interface PlanItem {
  id: string;
  model: string;
  qty: string;
  mp: string;
}

export default function DailyPlan() {
  const today = new Date().toISOString().split('T')[0];
  
  // -- STATE --
  const [selectedDate, setSelectedDate] = useState(today);
  const [plans, setPlans] = useState<Record<string, PlanItem[]>>({});
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Form State
  const [formModel, setFormModel] = useState("");
  const [formQty, setFormQty] = useState("");
  const [formMp, setFormMp] = useState("");

  // Load models for the dropdown
  const modelsList = fullModelDatabase.map(m => `${m.fgNumber} - ${m.modelName}`);
  const filteredModels = useMemo(() => 
    modelsList.filter(m => m.toLowerCase().includes(searchQuery.toLowerCase())), 
  [modelsList, searchQuery]);

  // -- LOAD/SAVE LOCAL STORAGE --
  useEffect(() => {
    const savedPlans = localStorage.getItem("essem_daily_plans");
    if (savedPlans) {
      setPlans(JSON.parse(savedPlans));
    }
  }, []);

  const saveToStorage = (newPlans: Record<string, PlanItem[]>) => {
    setPlans(newPlans);
    localStorage.setItem("essem_daily_plans", JSON.stringify(newPlans));
  };

  // -- HANDLERS --
  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formModel) return alert("Please select a valid model.");

    const newItem: PlanItem = {
      id: Date.now().toString(),
      model: formModel,
      qty: formQty,
      mp: formMp
    };

    const currentDayPlans = plans[selectedDate] || [];
    saveToStorage({
      ...plans,
      [selectedDate]: [...currentDayPlans, newItem]
    });

    // Reset Form
    setFormModel("");
    setSearchQuery("");
    setFormQty("");
    setFormMp("");
    setIsModalOpen(false);
  };

  const handleDeletePlan = (idToDelete: string) => {
    const currentDayPlans = plans[selectedDate] || [];
    const updatedPlans = currentDayPlans.filter(item => item.id !== idToDelete);
    saveToStorage({
      ...plans,
      [selectedDate]: updatedPlans
    });
  };

  // Get plans for currently selected date
  const currentPlans = plans[selectedDate] || [];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ position: 'relative', minHeight: '80vh' }}>
      
      {/* Header & Date Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CalendarIcon size={28} color="#10b981" />
          <h2 className="section-title" style={{ margin: 0 }}>Daily Plan</h2>
        </div>
        
        {/* Calendar Input */}
        <div style={{ position: 'relative' }}>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ 
              padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid #10b981', 
              backgroundColor: '#ecfdf5', color: '#065f46', fontWeight: 700, outline: 'none',
              fontFamily: 'inherit', fontSize: '0.95rem', cursor: 'pointer'
            }} 
          />
        </div>
      </div>

      {/* Notepad View */}
      <div className="info-card" style={{ padding: '1.5rem', backgroundColor: '#fefce8', border: '1px solid #fef08a', minHeight: '60vh', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '2px solid #fde047', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <StickyNote size={24} color="#ca8a04" />
          <h3 style={{ margin: 0, color: '#854d0e' }}>Plan Notepad: {new Date(selectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</h3>
        </div>

        {currentPlans.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#a16207', padding: '3rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Box size={48} color="#fde047" />
            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500 }}>No plans created for this date yet.</p>
            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>Click the + button below to add your first model.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {currentPlans.map((item, idx) => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '0.5rem', borderLeft: '4px solid #10b981', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', position: 'relative' }}
              >
                <div style={{ paddingRight: '2rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Item {idx + 1}</span>
                  <h4 style={{ margin: '0.25rem 0 0.75rem 0', color: '#1f2937', fontSize: '1rem', lineHeight: 1.4 }}>{item.model}</h4>
                  
                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#059669', fontWeight: 600, backgroundColor: '#ecfdf5', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.85rem' }}>
                      <Box size={16} /> Target Qty: {item.qty}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#4f46e5', fontWeight: 600, backgroundColor: '#e0e7ff', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.85rem' }}>
                      <Users size={16} /> MP: {item.mp}
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleDeletePlan(item.id)}
                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }}
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button (FAB) for Adding Plan */}
      <button 
        onClick={() => setIsModalOpen(true)}
        style={{ 
          position: 'fixed', bottom: '90px', right: '20px', width: '60px', height: '60px', 
          backgroundColor: '#10b981', color: '#fff', borderRadius: '50%', border: 'none', 
          display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
          cursor: 'pointer', zIndex: 40
        }}
      >
        <Plus size={32} />
      </button>

      {/* --- ADD PLAN MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()} 
              style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '1rem', width: '100%', maxWidth: '400px', position: 'relative' }}
            >
              <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem', cursor: 'pointer', color: '#4b5563' }}>×</button>
              
              <h3 style={{ margin: '0 0 1.5rem 0', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus color="#10b981" /> Add to Daily Plan
              </h3>

              <form onSubmit={handleAddPlan} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* Custom Searchable Model Dropdown */}
                <div style={{ position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Select Model Name</label>
                  <div style={{ position: 'relative' }}>
                    <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="text" required value={searchQuery} 
                      onChange={e => { setSearchQuery(e.target.value); setFormModel(""); setShowDropdown(true); }}
                      onFocus={() => setShowDropdown(true)}
                      onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                      placeholder="Search by FG Number or Name..." 
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.2rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} 
                    />
                  </div>
                  {showDropdown && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, maxHeight: '180px', overflowY: 'auto', backgroundColor: '#fff', border: '1px solid #d1d5db', zIndex: 10, borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginTop: '4px' }}>
                      {filteredModels.length > 0 ? filteredModels.map(m => (
                        <div key={m} onMouseDown={(e) => e.preventDefault()} onClick={() => { setFormModel(m); setSearchQuery(m); setShowDropdown(false); }} style={{ padding: '0.75rem', cursor: 'pointer', borderBottom: '1px solid #f3f4f6', fontSize: '0.85rem', color: '#374151' }}>
                          {m}
                        </div>
                      )) : <div style={{ padding: '0.75rem', fontSize: '0.85rem', color: '#9ca3af' }}>No models found</div>}
                    </div>
                  )}
                </div>

                {/* Plan Quantity */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Plan Quantity</label>
                  <input 
                    type="number" required min="1" value={formQty} onChange={e => setFormQty(e.target.value)} placeholder="0" 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} 
                  />
                </div>

                {/* MP (Man Power) */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>MP (Man Power)</label>
                  <input 
                    type="number" required min="1" step="0.5" value={formMp} onChange={e => setFormMp(e.target.value)} placeholder="0" 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} 
                  />
                </div>

                <button type="submit" style={{ marginTop: '0.5rem', padding: '0.85rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={18} /> Add to Plan
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}