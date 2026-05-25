import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyStorybooks } from "../services/api";

const svgMoon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="#fde68a"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>`;

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [storybooks, setStorybooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyStorybooks()
      .then(({ data }) => setStorybooks(data.storybooks || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); navigate("/auth"); };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a1a 0%, #0d0d2b 50%, #1a0a2e 100%)",
      fontFamily: "Georgia, serif",
      color: "white",
    }}>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .sb-card:hover { transform:translateY(-4px) scale(1.01); box-shadow:0 20px 60px rgba(124,58,237,0.3) !important; }
        .sb-card { transition:all .25s ease; }
        .nav-btn:hover { background:rgba(255,255,255,0.12) !important; }
      `}</style>

      {/* NAV */}
      <nav style={{
        padding: "18px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#fde68a">
            <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
          </svg>
          <span style={{ fontSize:"20px", fontWeight:"bold", color:"#fde68a" }}>DreamLoom</span>
        </div>
        <div style={{ display:"flex", gap:"12px", alignItems:"center" }}>
          <span style={{ color:"rgba(255,255,255,0.5)", fontSize:"14px" }}>
            {user?.name || user?.mobile}
          </span>
          <button className="nav-btn" onClick={handleLogout} style={{
            padding:"8px 18px", background:"rgba(255,255,255,0.07)",
            border:"1px solid rgba(255,255,255,0.15)",
            borderRadius:"10px", color:"rgba(255,255,255,0.7)",
            cursor:"pointer", fontSize:"13px", transition:"background .2s",
          }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"40px 24px" }}>

        {/* Welcome + Offer Banner */}
        <div style={{ animation:"fadeIn .5s ease", marginBottom:"36px" }}>
          <h1 style={{ fontSize:"32px", fontWeight:"bold", marginBottom:"8px" }}>
            Welcome back{user?.name ? `, ${user.name}` : ""}
            <span style={{ marginLeft:"10px", animation:"float 3s infinite", display:"inline-block" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#fde68a">
                <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
              </svg>
            </span>
          </h1>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"16px" }}>
            Create magical storybooks featuring your little one
          </p>
        </div>

        {/* 50% OFF Banner */}
        {user?.isFirstThirty && !user?.discountUsed && (
          <div style={{
            background: "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(239,68,68,0.15))",
            border: "1px solid rgba(251,191,36,0.4)",
            borderRadius: "18px",
            padding: "20px 28px",
            marginBottom: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            animation: "fadeIn .6s ease",
          }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"4px" }}>
                <span style={{ fontSize:"24px", fontWeight:"bold", color:"#fbbf24" }}>50% OFF</span>
                <span style={{
                  background:"#ef4444", color:"white", fontSize:"11px",
                  fontWeight:"bold", padding:"3px 8px", borderRadius:"20px",
                }}>FIRST 30 FAMILIES</span>
              </div>
              <p style={{ color:"rgba(255,255,255,0.7)", fontSize:"14px", margin:0 }}>
                You're one of our first 30 families! Pay only <strong style={{color:"#fbbf24"}}>₹99.50</strong> instead of ₹199
              </p>
            </div>
            <Link to="/create" style={{
              padding:"12px 24px",
              background:"linear-gradient(135deg,#f59e0b,#ef4444)",
              color:"white", fontWeight:"bold", fontSize:"15px",
              borderRadius:"12px", textDecoration:"none",
              boxShadow:"0 4px 20px rgba(245,158,11,0.4)",
            }}>
              Claim Offer
            </Link>
          </div>
        )}

        {/* Stats row */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:"16px", marginBottom:"36px" }}>
          {[
            { label:"Total Storybooks", value: storybooks.length, color:"#a78bfa" },
            { label:"Mobile", value: user?.mobile, color:"#34d399", small:true },
            { label:"Member Since", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN",{month:"short",year:"numeric"}) : "—", color:"#60a5fa" },
          ].map((s) => (
            <div key={s.label} style={{
              background:"rgba(255,255,255,0.05)",
              border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:"16px", padding:"20px",
              animation:"fadeIn .5s ease",
            }}>
              <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"12px", marginBottom:"8px" }}>{s.label}</p>
              <p style={{ color:s.color, fontSize:s.small?"15px":"26px", fontWeight:"bold", margin:0 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Create button */}
        <div style={{ marginBottom:"36px" }}>
          <Link to="/create" style={{
            display:"inline-flex", alignItems:"center", gap:"10px",
            padding:"16px 32px",
            background:"linear-gradient(135deg,#7c3aed,#db2777)",
            color:"white", fontWeight:"bold", fontSize:"16px",
            borderRadius:"16px", textDecoration:"none",
            boxShadow:"0 6px 28px rgba(124,58,237,0.45)",
            transition:"transform .15s",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Create New Storybook
          </Link>
        </div>

        {/* Storybooks grid */}
        <h2 style={{ fontSize:"20px", fontWeight:"bold", marginBottom:"20px", color:"rgba(255,255,255,0.85)" }}>
          My Storybooks ({storybooks.length})
        </h2>

        {loading ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"20px" }}>
            {[1,2,3].map(i => (
              <div key={i} style={{
                height:"200px", background:"rgba(255,255,255,0.04)",
                borderRadius:"18px", border:"1px solid rgba(255,255,255,0.06)",
                animation:"fadeIn .3s ease",
              }}/>
            ))}
          </div>
        ) : storybooks.length === 0 ? (
          <div style={{
            textAlign:"center", padding:"60px 20px",
            background:"rgba(255,255,255,0.03)",
            border:"1px solid rgba(255,255,255,0.07)",
            borderRadius:"24px",
          }}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" style={{margin:"0 auto 16px",display:"block"}}>
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"16px", marginBottom:"20px" }}>
              No storybooks yet. Create your first magical story!
            </p>
            <Link to="/create" style={{
              padding:"12px 28px",
              background:"linear-gradient(135deg,#7c3aed,#db2777)",
              color:"white", fontWeight:"bold",
              borderRadius:"12px", textDecoration:"none",
            }}>Create Now</Link>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"20px" }}>
            {storybooks.map((sb, i) => (
              <div key={sb._id} className="sb-card" style={{
                background:"rgba(255,255,255,0.05)",
                border:"1px solid rgba(255,255,255,0.08)",
                borderRadius:"20px", padding:"24px",
                animation:`fadeIn ${.3+i*.1}s ease`,
                boxShadow:"0 8px 32px rgba(0,0,0,0.3)",
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"14px" }}>
                  <div>
                    <h3 style={{ fontSize:"18px", fontWeight:"bold", color:"#fde68a", marginBottom:"4px" }}>
                      {sb.babyName}'s Story
                    </h3>
                    <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"12px" }}>
                      {new Date(sb.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
                    </p>
                  </div>
                  <span style={{
                    padding:"4px 10px",
                    background: sb.status === "generated" ? "rgba(52,211,153,0.15)" : "rgba(251,191,36,0.15)",
                    border: `1px solid ${sb.status === "generated" ? "rgba(52,211,153,0.4)" : "rgba(251,191,36,0.4)"}`,
                    borderRadius:"20px", fontSize:"11px",
                    color: sb.status === "generated" ? "#34d399" : "#fbbf24",
                  }}>{sb.status}</span>
                </div>

                <div style={{ display:"flex", gap:"8px", marginTop:"auto" }}>
                  {sb.previewUrl && (
                    <a href={sb.previewUrl} target="_blank" rel="noopener noreferrer" style={{
                      flex:1, padding:"10px", textAlign:"center",
                      background:"rgba(167,139,250,0.15)",
                      border:"1px solid rgba(167,139,250,0.3)",
                      borderRadius:"10px", color:"#a78bfa",
                      fontSize:"13px", fontWeight:"bold", textDecoration:"none",
                      transition:"background .2s",
                    }}>Preview</a>
                  )}
                  {sb.downloadUrl && (
                    <a href={sb.downloadUrl} target="_blank" rel="noopener noreferrer" style={{
                      flex:1, padding:"10px", textAlign:"center",
                      background:"rgba(52,211,153,0.15)",
                      border:"1px solid rgba(52,211,153,0.3)",
                      borderRadius:"10px", color:"#34d399",
                      fontSize:"13px", fontWeight:"bold", textDecoration:"none",
                    }}>Download</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}