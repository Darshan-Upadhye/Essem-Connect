import { motion } from "framer-motion";
import { useNavigate, useOutletContext } from "react-router-dom";
import { 
  Info, Box, Layers, FileText, AlertTriangle, 
  Calendar, XOctagon, Clipboard, Shield, BookOpen, MessageSquare 
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { setActiveModal } = useOutletContext<any>();

  // Added Safety and Learn to the top of Quick Links
  const quickLinks = [
    { name: "Safety", icon: <Shield size={24} />, action: () => navigate("/safety") },
    { name: "Learn", icon: <BookOpen size={24} />, action: () => navigate("/learn") },
    { name: "About", icon: <Info size={24} />, action: () => setActiveModal("about") },
    { name: "Department", icon: <Layers size={24} />, action: () => navigate("/departments") },
    { name: "Model", icon: <Box size={24} />, action: () => navigate("/model") },
    { name: "Material", icon: <FileText size={24} />, action: () => navigate("/material") },
    { name: "Rejection", icon: <XOctagon size={24} />, action: () => navigate("/rejection") },
    { name: "Daily Plan", icon: <Calendar size={24} />, action: () => navigate("/daily-plan") },
    { name: "Defects", icon: <AlertTriangle size={24} />, action: () => navigate("/defects") },
    { name: "Note", icon: <Clipboard size={24} />, action: () => navigate("/note") },
    { name: "Feedback", icon: <MessageSquare size={24} />, action: () => navigate("/feedback") },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h2 className="section-title">Quick Access</h2>
      <div className="grid-container">
        {quickLinks.map((item, index) => (
          <div key={index} className="grid-card" onClick={item.action}>
            <div className="icon-wrapper">{item.icon}</div>
            <span className="card-label">{item.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}