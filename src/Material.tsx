import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FileText, Search, AlertCircle, Box, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { rawBomData } from "./dataStore"; // FIXED: We pull the raw data here
import "./Dashboard.css";

// FIXED: Define the shape of our material to stop TypeScript errors
interface MaterialItem {
  id: string;
  desc: string;
}

// FIXED: Automatically extract and deduplicate materials from rawBomData
const allMaterials: MaterialItem[] = [];
const seenIds = new Set<string>();

Object.values(rawBomData).forEach((bomList) => {
  bomList.forEach((item) => {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      allMaterials.push({ id: item.id, desc: item.desc });
    }
  });
});

export default function Material() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMaterials = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return allMaterials; // FIXED: Pointing to our generated array
    return allMaterials.filter(
      (mat: MaterialItem) => // FIXED: Added type
        mat.id.toLowerCase().includes(query) || // FIXED: Changed to mat.id
        mat.desc.toLowerCase().includes(query)  // FIXED: Changed to mat.desc
    );
  }, [searchQuery]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={28} color="#f97316" />
          <h2 className="section-title" style={{ margin: 0 }}>Material Inventory</h2>
        </div>
      </div>

      {/* Button to redirect to Models */}
      <button 
        onClick={() => navigate("/model")}
        style={{ 
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          backgroundColor: '#eff6ff', color: '#2563eb', padding: '1rem', borderRadius: '0.75rem', 
          border: '1px solid #bfdbfe', fontWeight: 600, cursor: 'pointer', marginBottom: '1.5rem',
          boxShadow: '0 2px 4px rgba(37, 99, 235, 0.1)'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Box size={20} /> See Model-Wise Materials (BOM)
        </span>
        <ArrowRight size={20} />
      </button>

      {/* Fixed Mobile Responsive Search Bar */}
      <div className="search-container" style={{ position: 'relative', marginBottom: '1rem', width: '100%', boxSizing: 'border-box' }}>
        <Search size={20} color="#6b7280" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        <input 
          type="text" 
          placeholder="Search by Part Number or Name..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 2.5rem', borderRadius: '0.75rem', border: '1px solid #d1d5db', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
        />
      </div>

      <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '1rem' }}>
        Showing {filteredMaterials.length} unique materials extracted from BOMs
      </p>

      {/* Material List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filteredMaterials.length > 0 ? (
          filteredMaterials.map((mat: MaterialItem, idx: number) => ( // FIXED: Added types
            <div key={idx} className="info-card" style={{ padding: '1rem', borderLeftColor: '#f97316' }}>
              <span style={{ display: 'block', fontSize: '0.8rem', color: '#f97316', fontWeight: 700, marginBottom: '0.25rem' }}>
                {mat.id} {/* FIXED: Changed to mat.id */}
              </span>
              <span style={{ display: 'block', fontSize: '0.9rem', color: '#374151', lineHeight: 1.4 }}>
                {mat.desc} {/* FIXED: Changed to mat.desc */}
              </span>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            <AlertCircle size={40} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
            <p>No materials found matching "{searchQuery}"</p>
          </div>
        )}
      </div>

    </motion.div>
  );
}