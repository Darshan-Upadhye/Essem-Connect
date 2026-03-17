import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Search, FileText, Image as ImageIcon, ChevronRight, XCircle } from "lucide-react";
import { fullModelDatabase } from "./modelData"; 
import { rawBomData } from "./dataStore"; // FIXED: Changed to rawBomData
import "./Dashboard.css"; 

// FIXED: Added TypeScript Interface to stop the "implicit any" errors
interface BomItem {
  id: string;
  desc: string;
  qty: string;
}

export default function Model() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModel, setSelectedModel] = useState<any | null>(null);

  const filteredModels = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return fullModelDatabase;
    return fullModelDatabase.filter(
      (m) => m.fgNumber.toLowerCase().includes(query) || m.modelName.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // FIXED: Pointing to rawBomData
  const currentBom = selectedModel ? rawBomData[selectedModel.fgNumber] : null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Box size={28} color="#2563eb" />
          <h2 className="section-title" style={{ margin: 0 }}>Model Directory</h2>
        </div>

        {/* Fixed Mobile Responsive Search Bar */}
        <div className="search-container" style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
          <Search size={20} color="#6b7280" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search by FG Number or Model Name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 2.5rem', borderRadius: '0.75rem', border: '1px solid #d1d5db', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
          />
        </div>
      </div>

      <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '1rem' }}>
        Showing {filteredModels.length} models
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filteredModels.length > 0 ? (
          filteredModels.map((model, idx) => {
            const hasData = !!rawBomData[model.fgNumber]; // FIXED: Check against rawBomData
            return (
              <div key={idx} className="info-card" onClick={() => setSelectedModel(model)} style={{ padding: '1rem', borderLeftColor: hasData ? '#10b981' : '#d1d5db', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: '#6b7280', fontWeight: 600, marginBottom: '0.2rem' }}>{model.fgNumber !== "N/A" ? model.fgNumber : "NO FG NUMBER"}</span>
                  <span style={{ display: 'block', fontSize: '0.95rem', color: '#1f2937', fontWeight: 500 }}>{model.modelName}</span>
                </div>
                <ChevronRight size={20} color="#9ca3af" />
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}><p>No models found matching "{searchQuery}"</p></div>
        )}
      </div>

      <AnimatePresence>
        {selectedModel && (
          <div className="modal-overlay" onClick={() => setSelectedModel(null)}>
            <motion.div className="modal-content" initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()} style={{ padding: '1.5rem', maxHeight: '85vh', overflowY: 'auto' }}>
              <button className="close-btn" onClick={() => setSelectedModel(null)}>×</button>

              <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>{selectedModel.fgNumber}</span>
                <h3 style={{ margin: '0.25rem 0 0 0', fontSize: '1.1rem', color: '#1f2937' }}>{selectedModel.modelName}</h3>
              </div>

              {currentBom ? (
                <div>
                  {/* Dynamic Image Loader! */}
                  <div style={{ backgroundColor: '#f3f4f6', borderRadius: '0.5rem', minHeight: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', marginBottom: '1.5rem', border: '2px dashed #d1d5db', overflow: 'hidden', position: 'relative' }}>
                    
                    {/* Placeholder Content (Sits underneath the image) */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 0 }}>
                      <ImageIcon size={32} style={{ marginBottom: '0.5rem' }} />
                      <span style={{ fontSize: '0.85rem' }}>Save image as {selectedModel.fgNumber}.jpg</span>
                    </div>

                    {/* Image (Sits on top. If it loads, it completely covers the placeholder text) */}
                    <img 
                      key={selectedModel.fgNumber}
                      src={`/${selectedModel.fgNumber}.png`} 
                      alt={`${selectedModel.fgNumber} Harness`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 5, backgroundColor: '#f3f4f6' }}
                      onError={(e) => { 
                        // If no image is found, hide this img tag so the placeholder shows through
                        e.currentTarget.style.display = 'none'; 
                      }} 
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6', marginBottom: '0.75rem' }}><FileText size={18} /> Bill of Materials (BOM)</h4>
                    <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left', color: '#6b7280' }}>
                          <th style={{ paddingBottom: '0.5rem' }}>Part ID</th>
                          <th style={{ paddingBottom: '0.5rem' }}>Description</th>
                          <th style={{ paddingBottom: '0.5rem', textAlign: 'right' }}>Qty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* FIXED: Mapped directly over currentBom and added Types */}
                        {currentBom.map((mat: BomItem, i: number) => (
                          <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                            <td style={{ padding: '0.5rem 0', color: '#374151', fontWeight: 600, verticalAlign: 'top', whiteSpace: 'nowrap', paddingRight: '10px' }}>{mat.id}</td>
                            <td style={{ padding: '0.5rem 0.5rem', color: '#4b5563' }}>{mat.desc}</td>
                            <td style={{ padding: '0.5rem 0', color: '#3b82f6', textAlign: 'right', fontWeight: 600, verticalAlign: 'top' }}>{mat.qty}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Removed the defects section because it is not in the PDF data */}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <XCircle size={56} color="#d1d5db" style={{ margin: '0 auto 1rem auto' }} />
                  <h3 style={{ color: '#4b5563', marginBottom: '0.5rem' }}>Data Not Found</h3>
                  <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.5 }}>The BOM sheet for this model has not been uploaded to the database yet.</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}