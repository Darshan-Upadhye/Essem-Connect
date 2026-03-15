import { useState } from "react";

export default function IntroLoader({ children }: { children: React.ReactNode }) {
  // Check if the intro has already been played during this browsing session
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem("introPlayed");
  });

  // Function to hide the video and show the app
  const handleVideoEnd = () => {
    sessionStorage.setItem("introPlayed", "true");
    setShowIntro(false);
  };

  // If the intro is done, just show the normal app
  if (!showIntro) {
    return <>{children}</>;
  }

  // Otherwise, show the full-screen video
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100dvh",
      backgroundColor: "#ffffff",
      zIndex: 9999, // Keeps it on top of everything
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <video
        src="/intro.mp4"
        autoPlay
        muted /* MUST be muted to autoplay on mobile */
        playsInline /* MUST be included so iPhones don't open the native video player */
        onEnded={handleVideoEnd}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      
      {/* Optional Skip Button */}
      <button 
        onClick={handleVideoEnd}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "8px 16px",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(4px)",
          border: "none",
          borderRadius: "20px",
          color: "#1f2937",
          fontWeight: "bold",
          cursor: "pointer",
          zIndex: 10000
        }}
      >
        Skip
      </button>
    </div>
  );
}