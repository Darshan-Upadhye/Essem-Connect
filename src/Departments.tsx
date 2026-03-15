import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import { AlertTriangle, Users, Wrench, ShoppingCart, CheckCircle, Package, TrendingUp, Box } from "lucide-react";

export default function Departments() {
  const { handleComingSoon } = useOutletContext<any>();

  const departments = [
    { name: "Development", icon: <TrendingUp size={24} /> },
    { name: "Production", icon: <CheckCircle size={24} /> },
    { name: "Quality Assurance", icon: <AlertTriangle size={24} /> },
    { name: "Purchase", icon: <ShoppingCart size={24} /> },
    { name: "Sell", icon: <TrendingUp size={24} /> },
    { name: "Store", icon: <Package size={24} /> },
    { name: "Maintenance", icon: <Wrench size={24} /> },
    { name: "Human Resources", icon: <Users size={24} /> },
    { name: "Finish Goods (FG)", icon: <Box size={24} /> },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h2 className="section-title">All Departments</h2>
      <div className="grid-container">
        {departments.map((dept, index) => (
          <div key={index} className="grid-card dept-card" onClick={() => handleComingSoon(dept.name)}>
            <div className="icon-wrapper">{dept.icon}</div>
            <span className="card-label">{dept.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}