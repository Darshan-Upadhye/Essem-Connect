import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Clipboard, Calendar, XOctagon, Package, Truck, 
  Clock, AlertCircle, FileText, ArrowLeft, Send, CheckCircle, Plus, Search, Trash2, CheckSquare, Square
} from "lucide-react";
import { fullModelDatabase } from "./modelData"; 
import { materialDatabase } from "./dataStore"; 
import "./Dashboard.css";

type NoteType = "menu" | "material" | "dc" | "ot" | "4m" | "blank";

export default function Note() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const [activeView, setActiveView] = useState<NoteType>("menu");
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  // --- SHARED SEARCH STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const modelsList = fullModelDatabase.map(m => `${m.fgNumber} - ${m.modelName}`);
  const filteredModels = useMemo(() => 
    modelsList.filter(m => m.toLowerCase().includes(searchQuery.toLowerCase())), 
  [modelsList, searchQuery]);

  // --- MATERIAL NEED STATE ---
  const [materialNotes, setMaterialNotes] = useState<any[]>([]);
  const [activeMaterialNoteId, setActiveMaterialNoteId] = useState<string | null>(null);
  const [matForm, setMatForm] = useState({ lineNo: "", model: "", date: today });
  const [matSearch, setMatSearch] = useState("");
  const [showMatDropdown, setShowMatDropdown] = useState(false);
  const filteredMaterials = useMemo(() => 
    materialDatabase.filter(m => m.partId.toLowerCase().includes(matSearch.toLowerCase()) || m.description.toLowerCase().includes(matSearch.toLowerCase())), 
  [matSearch]);

  // --- DC STATE ---
  const [dcNotes, setDcNotes] = useState<Record<string, any[]>>({});
  const [dcDate, setDcDate] = useState(today);
  const [dcForm, setDcForm] = useState({ model: "", qty: "" });

  // --- OT STATE ---
  const [otNotes, setOtNotes] = useState<Record<string, any[]>>({});
  const [otDate, setOtDate] = useState(today);
  const [otForm, setOtForm] = useState({ workerName: "", model: "", workDone: "" });

  // --- 4M STATE ---
  const [fourMNotes, setFourMNotes] = useState<any[]>([]);
  const [fourMType, setFourMType] = useState<"Man" | "Material" | "Method" | "Machine">("Man");
  const [fourMForm, setFourMForm] = useState({ workerName: "", lineNo: "", model: "", lotNo: "", machineName: "", machineNo: "", changesDetails: "", methodChange: "", date: today });

  // --- BLANK NOTE STATE ---
  const [blankNotes, setBlankNotes] = useState<any[]>([]);
  const [blankForm, setBlankForm] = useState({ content: "" });

  // --- MODAL CONTROLS ---
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- LOAD DATA ---
  useEffect(() => {
    setMaterialNotes(JSON.parse(localStorage.getItem('essem_material_notes') || '[]'));
    setDcNotes(JSON.parse(localStorage.getItem('essem_dc_notes') || '{}'));
    setOtNotes(JSON.parse(localStorage.getItem('essem_ot_notes') || '{}'));
    setFourMNotes(JSON.parse(localStorage.getItem('essem_4m_notes') || '[]'));
    setBlankNotes(JSON.parse(localStorage.getItem('essem_blank_notes') || '[]'));
  }, []);

  // --- SAVE HELPERS ---
  const saveMaterials = (data: any) => { setMaterialNotes(data); localStorage.setItem('essem_material_notes', JSON.stringify(data)); };
  const saveDc = (data: any) => { setDcNotes(data); localStorage.setItem('essem_dc_notes', JSON.stringify(data)); };
  const saveOt = (data: any) => { setOtNotes(data); localStorage.setItem('essem_ot_notes', JSON.stringify(data)); };
  const saveFourM = (data: any) => { setFourMNotes(data); localStorage.setItem('essem_4m_notes', JSON.stringify(data)); };
  const saveBlank = (data: any) => { setBlankNotes(data); localStorage.setItem('essem_blank_notes', JSON.stringify(data)); };

  const triggerPopup = (msg: string) => {
    setPopupMessage(msg);
    setTimeout(() => setPopupMessage(null), 3000);
  };

  // --- SUBMIT HANDLERS ---
  const createMaterialNote = (e: React.FormEvent) => {
    e.preventDefault();
    if(!matForm.model) return alert("Select a model");
    const newNote = { id: Date.now().toString(), ...matForm, items: [] };
    saveMaterials([newNote, ...materialNotes]);
    setIsModalOpen(false);
    setActiveMaterialNoteId(newNote.id);
    setMatForm({ lineNo: "", model: "", date: today });
    setSearchQuery("");
  };

  const addMaterialToNote = (mat: any) => {
    const updated = materialNotes.map(note => {
      if (note.id === activeMaterialNoteId) {
        return { ...note, items: [...note.items, { ...mat, checked: false }] };
      }
      return note;
    });
    saveMaterials(updated);
    setMatSearch("");
    setShowMatDropdown(false);
  };

  const checkMaterialItem = (noteId: string, itemIdx: number) => {
    let matDesc = "";
    let lineNo = "";
    let modelName = "";

    const updated = materialNotes.map(note => {
      if (note.id === noteId) {
        lineNo = note.lineNo;
        modelName = note.model;
        const newItems = [...note.items];
        newItems[itemIdx].checked = !newItems[itemIdx].checked;
        if(newItems[itemIdx].checked) matDesc = newItems[itemIdx].description;
        return { ...note, items: newItems };
      }
      return note;
    });
    saveMaterials(updated);
    if (matDesc) triggerPopup(`${matDesc} is received on Line ${lineNo} - ${modelName}`);
  };

  const createDcNote = (e: React.FormEvent) => {
    e.preventDefault();
    if(!dcForm.model) return alert("Select a model");
    const currentList = dcNotes[dcDate] || [];
    saveDc({ ...dcNotes, [dcDate]: [...currentList, { id: Date.now().toString(), ...dcForm }] });
    setIsModalOpen(false);
    setDcForm({ model: "", qty: "" });
    setSearchQuery("");
  };

  const createOtNote = (e: React.FormEvent) => {
    e.preventDefault();
    if(!otForm.model) return alert("Select a model");
    const currentList = otNotes[otDate] || [];
    saveOt({ ...otNotes, [otDate]: [...currentList, { id: Date.now().toString(), ...otForm }] });
    setIsModalOpen(false);
    setOtForm({ workerName: "", model: "", workDone: "" });
    setSearchQuery("");
  };

  const create4MNote = (e: React.FormEvent) => {
    e.preventDefault();
    const newNote = { id: Date.now().toString(), type: fourMType, ...fourMForm, completed: false };
    saveFourM([newNote, ...fourMNotes]);
    setIsModalOpen(false);
    setFourMForm({ workerName: "", lineNo: "", model: "", lotNo: "", machineName: "", machineNo: "", changesDetails: "", methodChange: "", date: today });
    setSearchQuery("");
  };

  const check4MNote = (id: string) => {
    const updated = fourMNotes.map(n => n.id === id ? { ...n, completed: true } : n);
    saveFourM(updated);
    triggerPopup("4M form is Successful Filled");
  };

  const createBlankNote = (e: React.FormEvent) => {
    e.preventDefault();
    const newNote = { id: Date.now().toString(), content: blankForm.content, date: new Date().toLocaleString() };
    saveBlank([newNote, ...blankNotes]);
    setIsModalOpen(false);
    setBlankForm({ content: "" });
  };

  // --- DELETE HANDLERS ---
  const deleteMaterialNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = materialNotes.filter(n => n.id !== id);
    saveMaterials(updated);
  };

  const deleteDcNote = (id: string) => {
    const currentList = dcNotes[dcDate] || [];
    const updated = currentList.filter(n => n.id !== id);
    saveDc({ ...dcNotes, [dcDate]: updated });
  };

  const deleteOtNote = (id: string) => {
    const currentList = otNotes[otDate] || [];
    const updated = currentList.filter(n => n.id !== id);
    saveOt({ ...otNotes, [otDate]: updated });
  };

  const delete4MNote = (id: string) => {
    const updated = fourMNotes.filter(n => n.id !== id);
    saveFourM(updated);
  };

  const deleteBlankNote = (id: string) => {
    const updated = blankNotes.filter(n => n.id !== id);
    saveBlank(updated);
  };

  // --- RENDER HELPERS ---
  const activeMaterialNote = materialNotes.find(n => n.id === activeMaterialNoteId);
  const currentDcNotes = dcNotes[dcDate] || [];
  const currentOtNotes = otNotes[otDate] || [];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ minHeight: '80vh' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {activeView !== "menu" ? (
          <button onClick={() => { setActiveView("menu"); setActiveMaterialNoteId(null); }} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#6b7280' }}>
            <ArrowLeft size={28} />
          </button>
        ) : (
          <Clipboard size={28} color="#64748b" />
        )}
        <h2 className="section-title" style={{ margin: 0 }}>
          {activeView === "menu" ? "Notes & Logs" : 
           activeView === "material" ? "Material Need" : 
           activeView === "dc" ? "Delivery Challan (DC)" : 
           activeView === "ot" ? "OT Worker Details" : 
           activeView === "4m" ? "4M Form Pending" : "Blank Note"}
        </h2>
      </div>

      <AnimatePresence mode="wait">
        
        {/* =========================================
            MAIN MENU 
        ========================================= */}
        {activeView === "menu" && (
          <motion.div key="menu" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="info-card" onClick={() => navigate("/daily-plan")} style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', borderLeftColor: '#10b981' }}>
                <div style={{ backgroundColor: '#ecfdf5', padding: '0.75rem', borderRadius: '0.5rem', color: '#10b981' }}><Calendar size={24} /></div>
                <div><h3 style={{ margin: '0 0 0.25rem 0', color: '#1f2937', fontSize: '1.05rem' }}>Daily Plan</h3><p style={{ margin: 0, color: '#6b7280', fontSize: '0.8rem' }}>Go to the daily production planning notepad.</p></div>
              </div>
              <div className="info-card" onClick={() => setActiveView("material")} style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', borderLeftColor: '#f59e0b' }}>
                <div style={{ backgroundColor: '#fefce8', padding: '0.75rem', borderRadius: '0.5rem', color: '#f59e0b' }}><Package size={24} /></div>
                <div><h3 style={{ margin: '0 0 0.25rem 0', color: '#1f2937', fontSize: '1.05rem' }}>Material Need</h3><p style={{ margin: 0, color: '#6b7280', fontSize: '0.8rem' }}>Log required raw materials and shortages.</p></div>
              </div>
              <div className="info-card" onClick={() => navigate("/rejection")} style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', borderLeftColor: '#dc2626' }}>
                <div style={{ backgroundColor: '#fef2f2', padding: '0.75rem', borderRadius: '0.5rem', color: '#dc2626' }}><XOctagon size={24} /></div>
                <div><h3 style={{ margin: '0 0 0.25rem 0', color: '#1f2937', fontSize: '1.05rem' }}>Rejection</h3><p style={{ margin: 0, color: '#6b7280', fontSize: '0.8rem' }}>Go to the rejection and scrap logging module.</p></div>
              </div>
              <div className="info-card" onClick={() => setActiveView("dc")} style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', borderLeftColor: '#3b82f6' }}>
                <div style={{ backgroundColor: '#eff6ff', padding: '0.75rem', borderRadius: '0.5rem', color: '#3b82f6' }}><Truck size={24} /></div>
                <div><h3 style={{ margin: '0 0 0.25rem 0', color: '#1f2937', fontSize: '1.05rem' }}>Delivery Challan (DC)</h3><p style={{ margin: 0, color: '#6b7280', fontSize: '0.8rem' }}>Draft notes for outgoing material and DC generation.</p></div>
              </div>
              <div className="info-card" onClick={() => setActiveView("ot")} style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', borderLeftColor: '#8b5cf6' }}>
                <div style={{ backgroundColor: '#f3e8ff', padding: '0.75rem', borderRadius: '0.5rem', color: '#8b5cf6' }}><Clock size={24} /></div>
                <div><h3 style={{ margin: '0 0 0.25rem 0', color: '#1f2937', fontSize: '1.05rem' }}>OT Worker Details</h3><p style={{ margin: 0, color: '#6b7280', fontSize: '0.8rem' }}>Log operator names and hours for Overtime.</p></div>
              </div>
              <div className="info-card" onClick={() => setActiveView("4m")} style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', borderLeftColor: '#ec4899' }}>
                <div style={{ backgroundColor: '#fdf2f8', padding: '0.75rem', borderRadius: '0.5rem', color: '#ec4899' }}><AlertCircle size={24} /></div>
                <div><h3 style={{ margin: '0 0 0.25rem 0', color: '#1f2937', fontSize: '1.05rem' }}>4M Form Pending</h3><p style={{ margin: 0, color: '#6b7280', fontSize: '0.8rem' }}>Note pending Man, Machine, Material, Method forms.</p></div>
              </div>
              <div className="info-card" onClick={() => setActiveView("blank")} style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', borderLeftColor: '#64748b' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem', color: '#64748b' }}><FileText size={24} /></div>
                <div><h3 style={{ margin: '0 0 0.25rem 0', color: '#1f2937', fontSize: '1.05rem' }}>Blank Note</h3><p style={{ margin: 0, color: '#6b7280', fontSize: '0.8rem' }}>Create a quick general purpose note.</p></div>
              </div>
            </div>
          </motion.div>
        )}

        {/* =========================================
            MATERIAL NEED VIEW
        ========================================= */}
        {activeView === "material" && (
          <motion.div key="material" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            
            {/* List View */}
            {!activeMaterialNoteId ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {materialNotes.length === 0 ? <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '2rem' }}>No Material Notes created yet.</p> : 
                  materialNotes.map(note => (
                    <div key={note.id} className="info-card" onClick={() => setActiveMaterialNoteId(note.id)} style={{ padding: '1rem', borderLeftColor: '#f59e0b', cursor: 'pointer', position: 'relative' }}>
                      <div style={{ paddingRight: '2rem' }}>
                        <h4 style={{ margin: '0 0 0.25rem 0', color: '#1f2937' }}>Line {note.lineNo} | {note.date}</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>{note.model}</p>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#d97706', fontWeight: 600 }}>{note.items?.length || 0} items requested</p>
                      </div>
                      <button onClick={(e) => deleteMaterialNote(note.id, e)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))
                }
              </div>
            ) : (
              /* Inside Note View */
              <div className="info-card" style={{ padding: '1rem', backgroundColor: '#fefce8', border: '1px solid #fde047', minHeight: '60vh' }}>
                <button onClick={() => setActiveMaterialNoteId(null)} style={{ background: 'none', border: 'none', color: '#b45309', fontWeight: 600, cursor: 'pointer', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><ArrowLeft size={16}/> Back</button>
                <h3 style={{ margin: '0 0 0.25rem 0', color: '#854d0e' }}>Line: {activeMaterialNote?.lineNo} | Date: {activeMaterialNote?.date}</h3>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#a16207' }}>Model: {activeMaterialNote?.model}</p>
                
                {/* Material Search */}
                <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                  <Search size={18} color="#ca8a04" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text" value={matSearch} onChange={e => { setMatSearch(e.target.value); setShowMatDropdown(true); }}
                    onFocus={() => setShowMatDropdown(true)} placeholder="Search material to add..." 
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.2rem', borderRadius: '0.5rem', border: '1px solid #fde047', outline: 'none', boxSizing: 'border-box' }} 
                  />
                  {showMatDropdown && matSearch && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, maxHeight: '200px', overflowY: 'auto', backgroundColor: '#fff', border: '1px solid #d1d5db', zIndex: 10, borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginTop: '4px' }}>
                      {filteredMaterials.map(m => (
                        <div key={m.partId} onMouseDown={(e) => e.preventDefault()} onClick={() => addMaterialToNote(m)} style={{ padding: '0.75rem', cursor: 'pointer', borderBottom: '1px solid #f3f4f6', fontSize: '0.8rem', color: '#374151' }}>
                          <strong>{m.partId}</strong> - {m.description}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* To Do List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {activeMaterialNote?.items?.map((item: any, idx: number) => (
                    <div key={idx} onClick={() => checkMaterialItem(activeMaterialNote.id, idx)} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem', backgroundColor: '#fff', borderRadius: '0.5rem', border: '1px solid #fef08a', cursor: 'pointer', opacity: item.checked ? 0.6 : 1 }}>
                      {item.checked ? <CheckSquare size={20} color="#10b981" /> : <Square size={20} color="#ca8a04" />}
                      <span style={{ fontSize: '0.85rem', color: '#374151', textDecoration: item.checked ? 'line-through' : 'none' }}>{item.partId} - {item.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* =========================================
            DC OR OT VIEW (Calendar Based)
        ========================================= */}
        {(activeView === "dc" || activeView === "ot") && (
          <motion.div key="dc_ot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <input 
                type="date" value={activeView === "dc" ? dcDate : otDate} 
                onChange={(e) => activeView === "dc" ? setDcDate(e.target.value) : setOtDate(e.target.value)}
                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none', fontFamily: 'inherit', fontWeight: 600, color: '#374151' }} 
              />
            </div>
            
            <div className="info-card" style={{ padding: '1.5rem', backgroundColor: activeView === "dc" ? '#eff6ff' : '#f3e8ff', border: `1px solid ${activeView === "dc" ? '#bfdbfe' : '#d8b4fe'}`, minHeight: '50vh' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: activeView === "dc" ? '#1e40af' : '#6b21a8' }}>Notes for {activeView === "dc" ? dcDate : otDate}</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(activeView === "dc" ? currentDcNotes : currentOtNotes).length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '2rem' }}>No records for this date.</p>
                ) : (
                  (activeView === "dc" ? currentDcNotes : currentOtNotes).map((item: any) => (
                    <div key={item.id} style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', position: 'relative' }}>
                      <div style={{ paddingRight: '2rem' }}>
                        {activeView === "dc" ? (
                          <>
                            <h4 style={{ margin: '0 0 0.25rem 0', color: '#1f2937', fontSize: '0.9rem' }}>{item.model}</h4>
                            <p style={{ margin: 0, color: '#2563eb', fontWeight: 600, fontSize: '0.85rem' }}>Plan/Achievement Qty: {item.qty}</p>
                          </>
                        ) : (
                          <>
                            <h4 style={{ margin: '0 0 0.25rem 0', color: '#1f2937', fontSize: '1rem' }}>{item.workerName}</h4>
                            <p style={{ margin: '0 0 0.25rem 0', color: '#6b7280', fontSize: '0.8rem' }}>Model: {item.model}</p>
                            <p style={{ margin: 0, color: '#7e22ce', fontWeight: 500, fontSize: '0.85rem' }}>Work Done: {item.workDone}</p>
                          </>
                        )}
                      </div>
                      <button onClick={() => activeView === "dc" ? deleteDcNote(item.id) : deleteOtNote(item.id)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* =========================================
            4M FORM PENDING VIEW
        ========================================= */}
        {activeView === "4m" && (
          <motion.div key="4m" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {fourMNotes.length === 0 ? <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '2rem' }}>No pending 4M forms.</p> : 
                  fourMNotes.map(note => (
                    <div key={note.id} className="info-card" style={{ padding: '1rem', borderLeftColor: '#ec4899', opacity: note.completed ? 0.5 : 1, position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingRight: '2rem' }}>
                        <div>
                          <span style={{ backgroundColor: '#fdf2f8', color: '#db2777', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>{note.type}</span>
                          <h4 style={{ margin: '0.5rem 0 0.25rem 0', color: '#1f2937', fontSize: '0.9rem' }}>{note.model}</h4>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>Date: {note.date}</p>
                          {note.type === "Man" && <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#374151' }}>Worker: {note.workerName} | Line: {note.lineNo} | Lot: {note.lotNo}</p>}
                          {note.type === "Machine" && <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#374151' }}>Machine: {note.machineName} ({note.machineNo})</p>}
                          {note.type === "Material" && <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#374151' }}>Changes: {note.changesDetails}</p>}
                          {note.type === "Method" && <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#374151' }}>Method: {note.methodChange}</p>}
                        </div>
                        {!note.completed && (
                          <div onClick={() => check4MNote(note.id)} style={{ cursor: 'pointer', padding: '0.5rem' }}>
                            <Square size={24} color="#9ca3af" />
                          </div>
                        )}
                      </div>
                      <button onClick={() => delete4MNote(note.id)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                }
              </div>
          </motion.div>
        )}

        {/* =========================================
            BLANK NOTE VIEW
        ========================================= */}
        {activeView === "blank" && (
          <motion.div key="blank" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {blankNotes.length === 0 ? <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '2rem' }}>No blank notes created.</p> : 
                  blankNotes.map(note => (
                    <div key={note.id} className="info-card" style={{ padding: '1rem', borderLeftColor: '#64748b', whiteSpace: 'pre-wrap', position: 'relative' }}>
                      <div style={{ paddingRight: '2rem' }}>
                        <p style={{ margin: 0, color: '#374151', fontSize: '0.9rem', lineHeight: 1.5 }}>{note.content}</p>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.7rem', color: '#9ca3af' }}>{note.date}</p>
                      </div>
                      <button onClick={() => deleteBlankNote(note.id)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                }
              </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* FAB ICON - Shows on all sub-views except Menu and active material note detail */}
      {activeView !== "menu" && !activeMaterialNoteId && (
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ 
            position: 'fixed', bottom: '90px', right: '20px', width: '60px', height: '60px', 
            backgroundColor: '#1f2937', color: '#fff', borderRadius: '50%', border: 'none', 
            display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            cursor: 'pointer', zIndex: 40
          }}
        >
          <Plus size={32} />
        </button>
      )}

      {/* --- ALL MODALS --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()} 
              style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '1rem', width: '100%', maxWidth: '400px', position: 'relative', maxHeight: '80vh', overflowY: 'auto' }}
            >
              <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem', cursor: 'pointer', color: '#4b5563' }}>×</button>
              
              <h3 style={{ margin: '0 0 1.5rem 0', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus color="#10b981" /> Create New Note
              </h3>

              {/* SEARCH MODEL INPUT (Used by Material, DC, OT, 4M) */}
              {activeView !== "blank" && (
                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Select Model</label>
                  <div style={{ position: 'relative' }}>
                    <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="text" required value={searchQuery} 
                      onChange={e => { setSearchQuery(e.target.value); setShowModelDropdown(true); }}
                      onFocus={() => setShowModelDropdown(true)}
                      onBlur={() => setTimeout(() => setShowModelDropdown(false), 200)}
                      placeholder="Search model..." 
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.2rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} 
                    />
                  </div>
                  {showModelDropdown && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, maxHeight: '180px', overflowY: 'auto', backgroundColor: '#fff', border: '1px solid #d1d5db', zIndex: 10, borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginTop: '4px' }}>
                      {filteredModels.map(m => (
                        <div key={m} onMouseDown={(e) => e.preventDefault()} onClick={() => { 
                          setSearchQuery(m); setShowModelDropdown(false);
                          if(activeView === "material") setMatForm({...matForm, model: m});
                          if(activeView === "dc") setDcForm({...dcForm, model: m});
                          if(activeView === "ot") setOtForm({...otForm, model: m});
                          if(activeView === "4m") setFourMForm({...fourMForm, model: m});
                        }} style={{ padding: '0.75rem', cursor: 'pointer', borderBottom: '1px solid #f3f4f6', fontSize: '0.8rem', color: '#374151' }}>{m}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* MATERIAL FORM */}
              {activeView === "material" && (
                <form onSubmit={createMaterialNote} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div><label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Line No</label><input type="text" required value={matForm.lineNo} onChange={e => setMatForm({...matForm, lineNo: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} /></div>
                  <div><label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Date</label><input type="date" required value={matForm.date} onChange={e => setMatForm({...matForm, date: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} /></div>
                  <button type="submit" style={{ marginTop: '0.5rem', padding: '0.85rem', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                    <Send size={18} /> Proceed
                  </button>
                </form>
              )}

              {/* DC FORM */}
              {activeView === "dc" && (
                <form onSubmit={createDcNote} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div><label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Plan Quantity (Achievement)</label><input type="number" required value={dcForm.qty} onChange={e => setDcForm({...dcForm, qty: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} /></div>
                  <button type="submit" style={{ marginTop: '0.5rem', padding: '0.85rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                    <Send size={18} /> Add to DC
                  </button>
                </form>
              )}

              {/* OT FORM */}
              {activeView === "ot" && (
                <form onSubmit={createOtNote} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div><label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Worker Name</label><input type="text" required value={otForm.workerName} onChange={e => setOtForm({...otForm, workerName: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} /></div>
                  <div><label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Works Done</label><textarea required value={otForm.workDone} onChange={e => setOtForm({...otForm, workDone: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} /></div>
                  <button type="submit" style={{ marginTop: '0.5rem', padding: '0.85rem', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                    <Send size={18} /> Add to OT List
                  </button>
                </form>
              )}

              {/* 4M FORM */}
              {activeView === "4m" && (
                <form onSubmit={create4MNote} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>4M Type</label>
                    <select value={fourMType} onChange={e => setFourMType(e.target.value as any)} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none', backgroundColor: '#fff' }}>
                      <option value="Man">Man</option><option value="Machine">Machine</option><option value="Material">Material</option><option value="Method">Method</option>
                    </select>
                  </div>
                  
                  {fourMType === "Man" && (
                    <>
                      <div><input type="text" required placeholder="New Worker Name" value={fourMForm.workerName} onChange={e => setFourMForm({...fourMForm, workerName: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} /></div>
                      <div><input type="text" required placeholder="Line No" value={fourMForm.lineNo} onChange={e => setFourMForm({...fourMForm, lineNo: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} /></div>
                      <div><input type="text" required placeholder="Lot No" value={fourMForm.lotNo} onChange={e => setFourMForm({...fourMForm, lotNo: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} /></div>
                    </>
                  )}
                  {fourMType === "Machine" && (
                    <>
                      <div><input type="text" required placeholder="Machine Name" value={fourMForm.machineName} onChange={e => setFourMForm({...fourMForm, machineName: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} /></div>
                      <div><input type="text" required placeholder="Machine Number" value={fourMForm.machineNo} onChange={e => setFourMForm({...fourMForm, machineNo: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} /></div>
                    </>
                  )}
                  {fourMType === "Material" && (
                    <div><textarea required placeholder="Material Changes Details" value={fourMForm.changesDetails} onChange={e => setFourMForm({...fourMForm, changesDetails: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} /></div>
                  )}
                  {fourMType === "Method" && (
                    <div><textarea required placeholder="Which method has changed?" value={fourMForm.methodChange} onChange={e => setFourMForm({...fourMForm, methodChange: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} /></div>
                  )}
                  
                  <div><input type="date" required value={fourMForm.date} onChange={e => setFourMForm({...fourMForm, date: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} /></div>

                  <button type="submit" style={{ marginTop: '0.5rem', padding: '0.85rem', backgroundColor: '#ec4899', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                    <Send size={18} /> Submit 4M
                  </button>
                </form>
              )}

              {/* BLANK FORM */}
              {activeView === "blank" && (
                <form onSubmit={createBlankNote} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <textarea required rows={6} placeholder="Start typing your note here..." value={blankForm.content} onChange={e => setBlankForm({content: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                  <button type="submit" style={{ marginTop: '0.5rem', padding: '0.85rem', backgroundColor: '#64748b', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                    <Send size={18} /> Save Note
                  </button>
                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* POPUP MESSAGE */}
      <AnimatePresence>
        {popupMessage && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              style={{ backgroundColor: '#fff', padding: '2.5rem 1.5rem', borderRadius: '1rem', width: '100%', maxWidth: '350px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
            >
              <CheckCircle size={64} color="#10b981" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ color: '#1f2937', marginBottom: '0.5rem', fontSize: '1.25rem' }}>Success!</h3>
              <p style={{ color: '#4b5563', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>{popupMessage}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}