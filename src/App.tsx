import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./App.css";

export default function App() {
  // 1. Initialize the navigate function
  const navigate = useNavigate();

  return (
    <div className="app-container">
      {/* Illustration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="content-wrapper"
      >
        <img
          src="/Welcome_Illustrate_Essem_Connect.jpg"
          alt="Welcome Illustration"
          className="illustration-img"
        />
      </motion.div>

      {/* Get Started Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="button-wrapper"
      >
        {/* 2. Add the onClick event to the button */}
        <button className="start-button" onClick={() => navigate('/dashboard')}>
          Get Started
        </button>
      </motion.div>
    </div>
  );
}