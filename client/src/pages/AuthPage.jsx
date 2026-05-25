import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { sendOTP, verifyOTP, verifyAdminPass } from "../services/api";
import { useAuth } from "../context/AuthContext";

const STARS = Array.from({length:22},(_,i)=>({ id:i, top:`${Math.random()*100}%`, left:`${Math.random()*100}%`, size:`${5+Math.random()*9}px`, delay:`${Math.random()*4}s`, dur:`${2+Math.random()*3}s` }));

const Spinner = () => <span style={{width:"16px",height:"16px",borderRadius:"50%",border:"2px solid rgba(255,255,255,.3)",borderTopColor:"white",animation:"spin 1s linear infinite",display:"inline-block"}}/>;

export default function AuthPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [step,       setStep]       = useState("form");
  const [mobile,     setMobile]     = useState("");
  const [email,      setEmail]      = useState("");
  const [name,       setName]       = useState("");
  const [otp,        setOtp]        = useState("");
  const [adminPass,  setAdminPass]  = useState("");
  const [showPass,   setShowPass]   = useState(false);
  const [tempToken,  setTempToken]  = useState("");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [info,       setInfo]       = useState("");
  const [resend,     setResend]     = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    setResend(60);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setResend(p => { if(p<=1){clearInterval(timerRef.current);return 0;} return p-1; }), 1000);
  };

  const handleSendOTP = async e => {
    e.preventDefault(); setError(""); setInfo("");
    if (mobile.replace(/\D/g,"").length!==10) { setError("Enter a valid 10-digit mobile number"); return; }
    if (!email.includes("@")) { setError("Enter a valid email address"); return; }
    setLoading(true);
    try {
      await sendOTP(email.trim().toLowerCase(), mobile.replace(/\D/g,"").slice(-10));
      setInfo(`OTP sent to ${email.trim()} — check your inbox & spam`);
      setStep("otp"); startTimer();
    } catch(err) { setError(err.response?.data?.message||"Failed to send OTP"); }
    finally { setLoading(false); }
  };

  const handleVerifyOTP = async e => {
    e.preventDefault(); setError("");
    if (otp.replace(/\D/g,"").length!==6) { setError("Enter the 6-digit OTP from your email"); return; }
    setLoading(true);
    try {
      const { data } = await verifyOTP(email.trim().toLowerCase(), mobile, otp.trim(), name);
      if (data.needsAdminPassword) { setTempToken(data.tempToken); setStep("adminpass"); setInfo(""); }
      else { login(data.user, data.token); navigate("/dashboard"); }
    } catch(err) { setError(err.response?.data?.message||"Invalid OTP"); }
    finally { setLoading(false); }
  };

  const handleAdminPass = async e => {
    e.preventDefault(); setError("");
    if (!adminPass.trim()) { setError("Enter your admin password"); return; }
    setLoading(true);
    try {
      const { data } = await verifyAdminPass(tempToken, adminPass.trim());
      login(data.user, data.token); navigate("/admin");
    } catch(err) { setError(err.response?.data?.message||"Incorrect admin password"); setAdminPass(""); }
    finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (resend>0) return; setError(""); setInfo(""); setOtp(""); setLoading(true);
    try { await sendOTP(email.trim().toLowerCase(), mobile.replace(/\D/g,"").slice(-10)); setInfo("New OTP sent!"); startTimer(); }
    catch(err) { setError(err.response?.data?.message||"Failed to resend"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#050510 0%,#0a0a20 40%,#10051a 100%)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",fontFamily:"Georgia,serif"}}>
      <style>{`
        @keyframes twinkle{0%,100%{opacity:.12;transform:scale(1)}50%{opacity:.85;transform:scale(1.5)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .ain{width:100%;padding:14px 18px;background:rgba(255,255,255,.07);border:1.5px solid rgba(255,255,255,.12);border-radius:14px;color:white;font-size:15px;outline:none;transition:border-color .2s,background .2s;font-family:Georgia,serif;box-sizing:border-box;}
        .ain::placeholder{color:rgba(255,255,255,.28)} .ain:focus{border-color:rgba(167,139,250,.75);background:rgba(255,255,255,.1)}
        .opin{width:100%;padding:18px;text-align:center;font-size:32px;letter-spacing:16px;font-weight:bold;background:rgba(255,255,255,.07);border:1.5px solid rgba(255,255,255,.12);border-radius:14px;color:white;outline:none;font-family:monospace;box-sizing:border-box;transition:border-color .2s;}
        .opin:focus{border-color:rgba(167,139,250,.75)}
        .abtn{width:100%;padding:15px;background:linear-gradient(135deg,#7c3aed,#db2777);color:white;font-size:16px;font-weight:bold;border:none;border-radius:14px;cursor:pointer;font-family:Georgia,serif;box-shadow:0 4px 24px rgba(124,58,237,.45);transition:transform .15s,box-shadow .15s;}
        .abtn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 36px rgba(124,58,237,.6)} .abtn:disabled{opacity:.52;cursor:not-allowed;transform:none}
        .lnk{background:none;border:none;cursor:pointer;font-family:Georgia,serif;padding:0}
        label{color:rgba(255,255,255,.62);font-size:13px;display:block;margin-bottom:8px}
      `}</style>

      {STARS.map(s=><div key={s.id} style={{position:"absolute",top:s.top,left:s.left,width:s.size,height:s.size,borderRadius:"50%",background:"radial-gradient(circle,white 0%,transparent 70%)",animation:`twinkle ${s.dur} ${s.delay} ease-in-out infinite`,pointerEvents:"none"}}/>)}

      <div style={{width:"100%",maxWidth:"440px",margin:"20px",background:"rgba(255,255,255,.05)",backdropFilter:"blur(28px)",border:"1px solid rgba(255,255,255,.09)",borderRadius:"28px",padding:"44px 36px",animation:"slideUp .5s ease",boxShadow:"0 28px 80px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.07)"}}>

        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:"28px"}}>
          <div style={{animation:"float 3s ease-in-out infinite",marginBottom:"12px"}}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill={step==="adminpass"?"#f87171":"#fde68a"} style={{margin:"0 auto",display:"block"}}><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>
          </div>
          <h1 style={{color:"white",fontSize:"24px",fontWeight:"bold",margin:"0 0 4px"}}>DreamLoom</h1>
          <p style={{color:"rgba(255,255,255,.35)",fontSize:"12px",margin:0}}>{step==="adminpass"?"Admin Verification":"Magical Storybooks for Your Baby"}</p>
        </div>

        {/* Step dots */}
        <div style={{display:"flex",gap:"6px",marginBottom:"24px",justifyContent:"center"}}>
          {["form","otp","adminpass"].map((s,i)=>(
            <div key={s} style={{width:step===s?"28px":"8px",height:"8px",borderRadius:"4px",background:step===s?(s==="adminpass"?"#f87171":"#a78bfa"):["form","otp","adminpass"].indexOf(step)>i?"rgba(167,139,250,.4)":"rgba(255,255,255,.1)",transition:"all .3s"}}/>
          ))}
        </div>

        {/* STEP 1: FORM */}
        {step==="form"&&(
          <form onSubmit={handleSendOTP} style={{display:"flex",flexDirection:"column",gap:"16px"}}>
            <div><label>Your Name <span style={{color:"rgba(255,255,255,.25)"}}>optional</span></label>
              <input className="ain" type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your name" autoFocus/></div>
            <div><label>Mobile Number *</label>
              <div style={{display:"flex",gap:"10px"}}>
                <div style={{padding:"14px",flexShrink:0,background:"rgba(255,255,255,.07)",border:"1.5px solid rgba(255,255,255,.12)",borderRadius:"14px",color:"rgba(255,255,255,.7)",fontSize:"15px"}}>+91</div>
                <input className="ain" type="tel" value={mobile} onChange={e=>setMobile(e.target.value.replace(/\D/g,"").slice(0,10))} placeholder="10-digit number" maxLength={10}/>
              </div></div>
            <div><label>Email Address *</label>
              <input className="ain" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com"/>
              <p style={{color:"rgba(255,255,255,.25)",fontSize:"12px",margin:"6px 0 0"}}>OTP will be sent to this email</p></div>
            {error&&<p style={{color:"#f87171",fontSize:"13px",textAlign:"center",margin:0}}>{error}</p>}
            <button className="abtn" type="submit" disabled={loading||mobile.replace(/\D/g,"").length!==10||!email.includes("@")}>
              {loading?<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}><Spinner/> Sending OTP...</span>:"Send OTP to Email"}</button>
            <p style={{color:"rgba(255,255,255,.2)",fontSize:"12px",textAlign:"center",margin:0}}>Free • Secure • No spam</p>
          </form>
        )}

        {/* STEP 2: OTP */}
        {step==="otp"&&(
          <form onSubmit={handleVerifyOTP} style={{display:"flex",flexDirection:"column",gap:"16px"}}>
            {info&&<div style={{padding:"10px 14px",background:"rgba(52,211,153,.1)",border:"1px solid rgba(52,211,153,.25)",borderRadius:"12px",color:"#34d399",fontSize:"13px",textAlign:"center"}}>{info}</div>}
            <div style={{padding:"14px 18px",background:"rgba(167,139,250,.08)",border:"1px solid rgba(167,139,250,.2)",borderRadius:"14px",textAlign:"center"}}>
              <p style={{color:"rgba(255,255,255,.45)",fontSize:"13px",margin:"0 0 4px"}}>OTP sent to</p>
              <p style={{color:"#a78bfa",fontWeight:"bold",fontSize:"15px",margin:0}}>{email}</p>
              <p style={{color:"rgba(255,255,255,.25)",fontSize:"12px",margin:"4px 0 0"}}>Check inbox and spam folder</p>
            </div>
            <div><label>Enter 6-digit OTP</label>
              <input className="opin" type="tel" inputMode="numeric" value={otp} onChange={e=>{const v=e.target.value.replace(/\D/g,"");if(v.length<=6)setOtp(v);}} placeholder="——————" maxLength={6} autoFocus/></div>
            {error&&<p style={{color:"#f87171",fontSize:"13px",textAlign:"center",margin:0}}>{error}</p>}
            <button className="abtn" type="submit" disabled={loading||otp.replace(/\D/g,"").length!==6}>
              {loading?<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}><Spinner/> Verifying...</span>:"Verify OTP"}</button>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <button type="button" className="lnk" onClick={()=>{setStep("form");setOtp("");setError("");setInfo("");}} style={{color:"rgba(255,255,255,.35)",fontSize:"13px"}}>Change details</button>
              {resend>0?<span style={{color:"rgba(255,255,255,.3)",fontSize:"13px"}}>Resend in {resend}s</span>:<button type="button" className="lnk" onClick={handleResend} style={{color:"#a78bfa",fontSize:"13px"}}>Resend OTP</button>}
            </div>
          </form>
        )}

        {/* STEP 3: ADMIN PASSWORD */}
        {step==="adminpass"&&(
          <form onSubmit={handleAdminPass} style={{display:"flex",flexDirection:"column",gap:"16px"}}>
            <div style={{padding:"14px 18px",background:"rgba(248,113,113,.08)",border:"1px solid rgba(248,113,113,.25)",borderRadius:"14px",textAlign:"center"}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" style={{margin:"0 auto 8px",display:"block"}}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <p style={{color:"#f87171",fontWeight:"bold",fontSize:"14px",margin:"0 0 4px"}}>Admin Access Required</p>
              <p style={{color:"rgba(255,255,255,.4)",fontSize:"12px",margin:0}}>OTP verified. Enter admin password to continue.</p>
            </div>
            <div>
              <label>Admin Password *</label>
              <div style={{position:"relative"}}>
                <input className="ain" type={showPass?"text":"password"} value={adminPass} onChange={e=>setAdminPass(e.target.value)} placeholder="Enter admin password" autoFocus style={{paddingRight:"48px"}}/>
                <button type="button" onClick={()=>setShowPass(p=>!p)} style={{position:"absolute",right:"14px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,.4)",padding:0}}>
                  {showPass
                    ?<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    :<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                </button>
              </div>
            </div>
            {error&&<div style={{padding:"10px 14px",background:"rgba(248,113,113,.1)",border:"1px solid rgba(248,113,113,.3)",borderRadius:"12px",color:"#f87171",fontSize:"13px",textAlign:"center"}}>{error}</div>}
            <button className="abtn" type="submit" disabled={loading||!adminPass.trim()} style={{background:"linear-gradient(135deg,#991b1b,#7c3aed)"}}>
              {loading?<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}><Spinner/> Verifying...</span>:"Access Admin Panel"}</button>
            <button type="button" className="lnk" onClick={()=>{setStep("form");setAdminPass("");setTempToken("");setError("");}} style={{color:"rgba(255,255,255,.35)",fontSize:"13px",textAlign:"center",display:"block",margin:"0 auto"}}>Cancel & start over</button>
          </form>
        )}
      </div>
    </div>
  );
}