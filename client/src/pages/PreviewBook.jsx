import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PreviewBook() {
  const location = useLocation();
  const navigate  = useNavigate();
  const { previewUrl, downloadUrl, babyName } = location.state || {};
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(t);
  }, []);

  if (!downloadUrl) {
    return (
      <div style={{
        minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
        background:"linear-gradient(135deg,#0a0a1a,#0d0d2b,#1a0a2e)",
        fontFamily:"Georgia,serif", color:"white", textAlign:"center", padding:"24px",
      }}>
        <div>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)"
            strokeWidth="1.5" style={{margin:"0 auto 16px",display:"block"}}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <h2 style={{ fontSize:"22px", marginBottom:"12px" }}>No storybook found</h2>
          <p style={{ color:"rgba(255,255,255,0.4)", marginBottom:"24px" }}>
            Please go back and generate your storybook first.
          </p>
          <button onClick={() => navigate("/create")} style={{
            padding:"12px 28px",
            background:"linear-gradient(135deg,#7c3aed,#db2777)",
            color:"white", fontWeight:"bold", border:"none",
            borderRadius:"12px", cursor:"pointer", fontSize:"15px",
          }}>Create Storybook</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(135deg,#0a0a1a 0%,#0d0d2b 50%,#1a0a2e 100%)",
      fontFamily:"Georgia,serif", color:"white",
    }}>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes confettiFall{
          0%{transform:translateY(-10px) rotate(0deg);opacity:1}
          100%{transform:translateY(100vh) rotate(720deg);opacity:0}
        }
        .action-card:hover{transform:translateY(-3px)!important;box-shadow:0 16px 48px rgba(0,0,0,0.4)!important}
        .action-card{transition:all .25s ease!important}
      `}</style>

      {/* Confetti burst */}
      {showConfetti && (
        <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:100, overflow:"hidden" }}>
          {Array.from({length:40},(_,i) => (
            <div key={i} style={{
              position:"absolute",
              left:`${Math.random()*100}%`,
              top:`-20px`,
              width:`${6+Math.random()*8}px`,
              height:`${6+Math.random()*8}px`,
              borderRadius: Math.random()>0.5?"50%":"2px",
              background:["#fde68a","#a78bfa","#ec4899","#34d399","#60a5fa","#f87171"][Math.floor(Math.random()*6)],
              animation:`confettiFall ${2+Math.random()*3}s ${Math.random()*2}s ease-in forwards`,
            }}/>
          ))}
        </div>
      )}

      {/* Nav */}
      <nav style={{
        padding:"18px 32px", display:"flex", alignItems:"center", justifyContent:"space-between",
        background:"rgba(255,255,255,0.04)", backdropFilter:"blur(12px)",
        borderBottom:"1px solid rgba(255,255,255,0.07)",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#fde68a">
            <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
          </svg>
          <span style={{ color:"#fde68a", fontWeight:"bold", fontSize:"18px" }}>DreamLoom</span>
        </div>
        <button onClick={() => navigate("/dashboard")} style={{
          padding:"8px 18px", background:"rgba(255,255,255,0.07)",
          border:"1px solid rgba(255,255,255,0.12)",
          borderRadius:"10px", color:"rgba(255,255,255,0.7)",
          cursor:"pointer", fontSize:"13px",
        }}>My Dashboard</button>
      </nav>

      <div style={{ maxWidth:"700px", margin:"0 auto", padding:"48px 24px", animation:"fadeIn .6s ease" }}>

        {/* Success header */}
        <div style={{ textAlign:"center", marginBottom:"48px" }}>
          <div style={{ animation:"float 3s ease-in-out infinite", marginBottom:"20px" }}>
            <svg width="72" height="72" viewBox="0 0 24 24" fill="#fde68a"
              style={{margin:"0 auto",display:"block"}}>
              <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
            </svg>
          </div>
          <h1 style={{ fontSize:"36px", fontWeight:"bold", marginBottom:"12px" }}>
            {babyName ? `${babyName}'s Storybook is Ready!` : "Your Storybook is Ready!"}
          </h1>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"17px" }}>
            A magical bedtime adventure has been created with love
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"32px" }}>
          <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="action-card"
            style={{
              display:"flex", flexDirection:"column", alignItems:"center", gap:"12px",
              padding:"28px 20px", textDecoration:"none",
              background:"linear-gradient(135deg,rgba(52,211,153,0.15),rgba(16,185,129,0.1))",
              border:"1px solid rgba(52,211,153,0.35)",
              borderRadius:"20px",
              boxShadow:"0 8px 32px rgba(0,0,0,0.3)",
            }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            <div style={{ textAlign:"center" }}>
              <p style={{ color:"#34d399", fontWeight:"bold", fontSize:"16px", margin:"0 0 4px" }}>
                Download PDF
              </p>
              <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"12px", margin:0 }}>
                Save to your device
              </p>
            </div>
          </a>

          <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="action-card"
            style={{
              display:"flex", flexDirection:"column", alignItems:"center", gap:"12px",
              padding:"28px 20px", textDecoration:"none",
              background:"linear-gradient(135deg,rgba(167,139,250,0.15),rgba(124,58,237,0.1))",
              border:"1px solid rgba(167,139,250,0.35)",
              borderRadius:"20px",
              boxShadow:"0 8px 32px rgba(0,0,0,0.3)",
            }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <div style={{ textAlign:"center" }}>
              <p style={{ color:"#a78bfa", fontWeight:"bold", fontSize:"16px", margin:"0 0 4px" }}>
                Preview Online
              </p>
              <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"12px", margin:0 }}>
                View in browser
              </p>
            </div>
          </a>
        </div>

        {/* Info card */}
        <div style={{
          padding:"24px 28px",
          background:"rgba(255,255,255,0.04)",
          border:"1px solid rgba(255,255,255,0.08)",
          borderRadius:"20px", marginBottom:"24px",
        }}>
          <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"14px", lineHeight:"1.8", margin:0 }}>
            Your storybook is also saved in your dashboard for future downloads.
            You can print it at any local print shop or Kinkos — ask for A4 colour printing and binding.
          </p>
        </div>

        {/* Create another */}
        <div style={{ textAlign:"center" }}>
          <button onClick={() => navigate("/create")} style={{
            padding:"14px 32px",
            background:"linear-gradient(135deg,#7c3aed,#db2777)",
            color:"white", fontWeight:"bold", fontSize:"15px",
            border:"none", borderRadius:"14px", cursor:"pointer",
            boxShadow:"0 6px 24px rgba(124,58,237,0.4)",
          }}>
            Create Another Storybook
          </button>
        </div>

      </div>
    </div>
  );
}