import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const STARS = Array.from({length:25},(_,i)=>({
  id:i,
  top:`${Math.random()*100}%`,
  left:`${Math.random()*100}%`,
  size:`${5+Math.random()*9}px`,
  delay:`${Math.random()*4}s`,
  dur:`${2+Math.random()*3}s`,
}));

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(160deg,#050510 0%,#0a0a20 35%,#10051a 70%,#050510 100%)",
      fontFamily:"Georgia,serif", color:"white",
      position:"relative", overflow:"hidden",
    }}>
      <style>{`
        @keyframes twinkle{0%,100%{opacity:.15;transform:scale(1)}50%{opacity:.9;transform:scale(1.5)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        .feature-card:hover{transform:translateY(-6px)!important;border-color:rgba(167,139,250,0.4)!important}
        .feature-card{transition:all .3s ease!important}
        .cta-btn:hover{transform:translateY(-2px)!important;box-shadow:0 12px 40px rgba(124,58,237,0.6)!important}
        .cta-btn{transition:all .2s ease!important}
        .sec-btn:hover{background:rgba(255,255,255,0.1)!important}
        .sec-btn{transition:background .2s!important}
      `}</style>

      {/* Stars background */}
      {STARS.map(s => (
        <div key={s.id} style={{
          position:"absolute", top:s.top, left:s.left,
          width:s.size, height:s.size, borderRadius:"50%",
          background:"radial-gradient(circle,white 0%,transparent 70%)",
          animation:`twinkle ${s.dur} ${s.delay} ease-in-out infinite`,
          pointerEvents:"none",
        }}/>
      ))}

      {/* NAV */}
      <nav style={{
        padding:"20px 40px", display:"flex",
        alignItems:"center", justifyContent:"space-between",
        position:"relative", zIndex:10,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="#fde68a">
            <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
          </svg>
          <span style={{ fontSize:"22px", fontWeight:"bold", color:"#fde68a" }}>DreamLoom</span>
        </div>
        <div style={{ display:"flex", gap:"12px" }}>
          {user ? (
            <Link to={user.role==="admin"?"/admin":"/dashboard"} style={{
              padding:"10px 22px",
              background:"linear-gradient(135deg,#7c3aed,#db2777)",
              color:"white", fontWeight:"bold", textDecoration:"none",
              borderRadius:"12px", fontSize:"14px",
              boxShadow:"0 4px 16px rgba(124,58,237,0.35)",
            }}>Dashboard</Link>
          ) : (
            <Link to="/auth" className="sec-btn" style={{
              padding:"10px 22px",
              background:"rgba(255,255,255,0.08)",
              border:"1px solid rgba(255,255,255,0.15)",
              color:"white", textDecoration:"none",
              borderRadius:"12px", fontSize:"14px",
            }}>Login / Register</Link>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        textAlign:"center", padding:"80px 24px 60px",
        position:"relative", zIndex:5,
        animation:"fadeUp .8s ease",
      }}>
        {/* Offer banner */}
        <div style={{
          display:"inline-flex", alignItems:"center", gap:"10px",
          padding:"8px 20px",
          background:"linear-gradient(135deg,rgba(251,191,36,0.15),rgba(239,68,68,0.15))",
          border:"1px solid rgba(251,191,36,0.35)",
          borderRadius:"99px", marginBottom:"32px",
          fontSize:"13px",
        }}>
          <span style={{
            background:"#ef4444", color:"white", padding:"2px 8px",
            borderRadius:"99px", fontSize:"11px", fontWeight:"bold",
          }}>LIMITED</span>
          <span style={{ color:"#fbbf24" }}>
            50% OFF for first 30 families — Only ₹5.00
          </span>
        </div>

        <div style={{ animation:"float 4s ease-in-out infinite", marginBottom:"24px" }}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="#fde68a"
            style={{margin:"0 auto",display:"block"}}>
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
        </div>

        <h1 style={{
          fontSize:"clamp(32px,6vw,64px)", fontWeight:"bold",
          lineHeight:"1.2", marginBottom:"20px",
          background:"linear-gradient(135deg,#ffffff 0%,#e0d7ff 50%,#fde68a 100%)",
          backgroundSize:"200% auto",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          animation:"shimmer 4s linear infinite",
        }}>
          Turn Your Baby's Photos Into<br/>
          Magical Bedtime Storybooks
        </h1>

        <p style={{
          fontSize:"clamp(15px,2.5vw,20px)",
          color:"rgba(255,255,255,0.55)",
          maxWidth:"560px", margin:"0 auto 40px",
          lineHeight:"1.7",
        }}>
          Personalised storybooks featuring your little one as the star —
          ready in minutes, cherished for a lifetime.
        </p>

        <div style={{ display:"flex", gap:"16px", justifyContent:"center", flexWrap:"wrap" }}>
          <Link to={user ? "/create" : "/auth"} className="cta-btn" style={{
            padding:"18px 40px",
            background:"linear-gradient(135deg,#7c3aed,#db2777)",
            color:"white", fontWeight:"bold", fontSize:"17px",
            textDecoration:"none", borderRadius:"16px",
            boxShadow:"0 8px 32px rgba(124,58,237,0.45)",
          }}>
            {user ? "Create Storybook" : "Get Started Free"}
          </Link>
          <Link to="/auth" className="sec-btn" style={{
            padding:"18px 40px",
            background:"rgba(255,255,255,0.07)",
            border:"1px solid rgba(255,255,255,0.15)",
            color:"white", fontSize:"17px",
            textDecoration:"none", borderRadius:"16px",
          }}>Login</Link>
        </div>

        {/* Trust badges */}
        <div style={{
          display:"flex", gap:"32px", justifyContent:"center",
          flexWrap:"wrap", marginTop:"48px",
          color:"rgba(255,255,255,0.35)", fontSize:"13px",
        }}>
          {[
            ["Instant PDF", "Ready in minutes"],
            ["Real Photos", "Your baby stars"],
            ["Secure Pay", "via Razorpay"],
          ].map(([title,sub]) => (
            <div key={title} style={{ textAlign:"center" }}>
              <p style={{ color:"rgba(255,255,255,0.7)", fontWeight:"bold", margin:"0 0 2px" }}>{title}</p>
              <p style={{ margin:0 }}>{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding:"60px 24px", position:"relative", zIndex:5, maxWidth:"1100px", margin:"0 auto" }}>
        <h2 style={{ textAlign:"center", fontSize:"32px", fontWeight:"bold", color:"#fde68a", marginBottom:"48px" }}>
          How It Works
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:"20px" }}>
          {[
            {
              step:"01", title:"Register & Login",
              desc:"Sign up with your mobile number. OTP verified — no passwords needed.",
              color:"#a78bfa",
            },
            {
              step:"02", title:"Upload Baby Photos",
              desc:"Upload 6-10 of your favourite baby photos. We handle the rest.",
              color:"#ec4899",
            },
            {
              step:"03", title:"Pay & Generate",
              desc:"Pay securely via Razorpay. Your personalised storybook is created instantly.",
              color:"#fbbf24",
            },
            {
              step:"04", title:"Download & Print",
              desc:"Download your PDF and print it anywhere. Keep it forever.",
              color:"#34d399",
            },
          ].map((item) => (
            <div key={item.step} className="feature-card" style={{
              background:"rgba(255,255,255,0.04)",
              border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:"22px", padding:"28px",
            }}>
              <div style={{
                fontSize:"13px", fontWeight:"bold", color:item.color,
                marginBottom:"14px", opacity:0.7,
              }}>STEP {item.step}</div>
              <h3 style={{ fontSize:"18px", fontWeight:"bold", marginBottom:"10px" }}>{item.title}</h3>
              <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"14px", lineHeight:"1.7", margin:0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding:"60px 24px", position:"relative", zIndex:5, maxWidth:"600px", margin:"0 auto", textAlign:"center" }}>
        <h2 style={{ fontSize:"30px", fontWeight:"bold", marginBottom:"8px" }}>Simple Pricing</h2>
        <p style={{ color:"rgba(255,255,255,0.4)", marginBottom:"36px" }}>One storybook, one price. No subscriptions.</p>

        <div style={{
          background:"rgba(255,255,255,0.05)",
          border:"1px solid rgba(167,139,250,0.3)",
          borderRadius:"24px", padding:"40px",
          position:"relative", overflow:"hidden",
        }}>
          <div style={{
            position:"absolute", top:"16px", right:"16px",
            background:"linear-gradient(135deg,#f59e0b,#ef4444)",
            color:"white", padding:"4px 14px",
            borderRadius:"99px", fontSize:"12px", fontWeight:"bold",
          }}>First 30 Families</div>

          <div style={{ marginBottom:"20px" }}>
            <span style={{ fontSize:"48px", fontWeight:"bold", color:"#fbbf24" }}>₹5.00</span>
            <span style={{ color:"rgba(255,255,255,0.3)", marginLeft:"8px", textDecoration:"line-through" }}>₹10.00</span>
          </div>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"14px", marginBottom:"28px" }}>
            After first 30 families: ₹10.00 per storybook
          </p>

          {["8-page personalised PDF","Your baby's real photos","Unique theme per page","Instant download","Stored in your dashboard"].map(f => (
            <div key={f} style={{ display:"flex", gap:"10px", alignItems:"center", marginBottom:"12px", textAlign:"left" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#34d399">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span style={{ color:"rgba(255,255,255,0.7)", fontSize:"14px" }}>{f}</span>
            </div>
          ))}

          <Link to={user ? "/create" : "/auth"} className="cta-btn" style={{
            display:"block", marginTop:"28px", padding:"16px",
            background:"linear-gradient(135deg,#7c3aed,#db2777)",
            color:"white", fontWeight:"bold", fontSize:"16px",
            textDecoration:"none", borderRadius:"14px",
            boxShadow:"0 6px 24px rgba(124,58,237,0.4)",
          }}>
            {user ? "Create Now" : "Get Started"}
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding:"32px 24px", textAlign:"center",
        borderTop:"1px solid rgba(255,255,255,0.07)",
        position:"relative", zIndex:5,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", justifyContent:"center", marginBottom:"8px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fde68a">
            <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
          </svg>
          <span style={{ color:"#fde68a", fontWeight:"bold" }}>DreamLoom</span>
        </div>
        <p style={{ color:"rgba(255,255,255,0.25)", fontSize:"13px", margin:0 }}>
          Crafted with love for little dreamers everywhere
        </p>
      </footer>
    </div>
  );
}