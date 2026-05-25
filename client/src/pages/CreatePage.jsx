import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { uploadPhotos, generateStorybook, createOrder, verifyPayment } from "../services/api";

const BACKEND_URL = "https://dreamloom-i2oa.onrender.com";

/* ── LOADING SCREEN ─────────────────────────────────── */
const MSGS = [
  "Starting your magical storybook...",
  "Crafting personalised story pages...",
  "Adding dreamy colours and sparkles...",
  "Almost there — final magic touches...",
];

function LoadingScreen() {
  const [idx, setIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  useState(() => {
    const m = setInterval(() => setIdx(p => Math.min(p+1, MSGS.length-1)), 20000);
    const t = setInterval(() => setElapsed(p => p+1), 1000);
    return () => { clearInterval(m); clearInterval(t); };
  });
  const fmt = s => s < 60 ? `${s}s` : `${Math.floor(s/60)}m ${s%60}s`;
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      background:"linear-gradient(135deg,#0a0a1a,#0d0d2b,#1a0a2e)", fontFamily:"Georgia,serif" }}>
      <div style={{ textAlign:"center", padding:"48px 32px", maxWidth:"420px" }}>
        <div style={{ marginBottom:"24px", animation:"float 2s ease-in-out infinite" }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="#fde68a" style={{margin:"0 auto",display:"block"}}>
            <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
          </svg>
        </div>
        <h2 style={{ color:"white", fontSize:"24px", fontWeight:"bold", marginBottom:"10px" }}>
          Creating Your Magical Storybook
        </h2>
        <p style={{ color:"#a78bfa", fontSize:"16px", marginBottom:"28px" }}>{MSGS[idx]}</p>
        <div style={{ display:"flex", justifyContent:"center", gap:"8px", marginBottom:"20px" }}>
          {MSGS.map((_,i) => (
            <div key={i} style={{
              width:"10px", height:"10px", borderRadius:"50%",
              background: i<=idx ? "#a78bfa" : "rgba(255,255,255,0.15)",
              transition:"background .3s",
            }}/>
          ))}
        </div>
        <div style={{ height:"6px", background:"rgba(255,255,255,0.08)", borderRadius:"99px", overflow:"hidden", marginBottom:"16px" }}>
          <div style={{
            height:"100%", borderRadius:"99px",
            background:"linear-gradient(90deg,#7c3aed,#db2777)",
            width:`${Math.min(((idx+1)/MSGS.length)*100,95)}%`,
            transition:"width 1s ease",
          }}/>
        </div>
        <p style={{ color:"rgba(255,255,255,0.3)", fontSize:"13px", marginBottom:"20px" }}>
          Time elapsed: {fmt(elapsed)}
        </p>
        <div style={{
          padding:"16px 20px", background:"rgba(167,139,250,0.08)",
          border:"1px solid rgba(167,139,250,0.2)", borderRadius:"14px",
        }}>
          <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"13px", lineHeight:"1.6", margin:0 }}>
            Your personalised storybook is being crafted with love.
            Please don't close this page — your PDF will be ready shortly!
          </p>
        </div>
      </div>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
    </div>
  );
}

/* ── PHOTO UPLOADER ─────────────────────────────────── */
function PhotoGrid({ photos, isUploading }) {
  if (!photos.length) return null;
  return (
    <div style={{ marginTop:"16px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px" }}>
        <span style={{ color:"rgba(255,255,255,0.6)", fontSize:"13px" }}>
          {photos.length}/10 photos uploaded
        </span>
        {photos.length >= 6 && (
          <span style={{ color:"#34d399", fontSize:"13px", fontWeight:"bold" }}>
            ✓ Ready
          </span>
        )}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(80px,1fr))", gap:"8px" }}>
        {photos.map((photo, i) => (
          <div key={photo.filename} style={{
            aspectRatio:"1", borderRadius:"10px", overflow:"hidden",
            border:"2px solid rgba(167,139,250,0.3)", position:"relative",
          }}>
            <img src={`${BACKEND_URL}${photo.path}`} alt={`${i+1}`}
              style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
            <div style={{
              position:"absolute", top:"3px", left:"3px",
              background:"rgba(124,58,237,0.85)", borderRadius:"50%",
              width:"18px", height:"18px", display:"flex",
              alignItems:"center", justifyContent:"center",
              fontSize:"10px", color:"white", fontWeight:"bold",
            }}>{i+1}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:"3px", marginTop:"10px" }}>
        {[...Array(10)].map((_,i) => (
          <div key={i} style={{
            flex:1, height:"4px", borderRadius:"2px",
            background: i < photos.length ? (i < 6 ? "#a78bfa" : "#34d399") : "rgba(255,255,255,0.1)",
            transition:"background .3s",
          }}/>
        ))}
      </div>
    </div>
  );
}

/* ── MAIN CREATE PAGE ───────────────────────────────── */
export default function CreatePage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [babyName,    setBabyName]    = useState("");
  const [parentName,  setParentName]  = useState("");
  const [photos,      setPhotos]      = useState([]);
  const [sessionId,   setSessionId]   = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating,setIsGenerating]= useState(false);
  const [isPaying,    setIsPaying]    = useState(false);
  const [error,       setError]       = useState("");
  const [step,        setStep]        = useState("form"); // form | payment | generating

  const applyDiscount = user?.isFirstThirty && !user?.discountUsed;
  const price = applyDiscount ? "₹5.00" : "₹10.00";

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setError("");
    setIsUploading(true);
    try {
      const { data } = await uploadPhotos(files);
      setPhotos(data.photos);
      setSessionId(data.sessionId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload photos");
    } finally { setIsUploading(false); }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    if (!files.length) return;
    setError("");
    setIsUploading(true);
    try {
      const { data } = await uploadPhotos(files);
      setPhotos(data.photos);
      setSessionId(data.sessionId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload photos");
    } finally { setIsUploading(false); }
  };

  const handlePayAndGenerate = async (e) => {
    e.preventDefault();
    setError("");
    if (!babyName.trim()) { setError("Please enter your baby's name"); return; }
    if (!sessionId || photos.length < 6) { setError("Please upload at least 6 photos"); return; }

    setIsPaying(true);

    try {
      // 1. Create Razorpay order
      const { data: orderData } = await createOrder();

      // 2. Open Razorpay checkout
      await new Promise((resolve, reject) => {
        const options = {
          key:         orderData.key,
          amount:      orderData.order.amount,
          currency:    "INR",
          name:        "DreamLoom",
          description: `${babyName}'s Magical Storybook`,
          order_id:    orderData.order.id,
          prefill:     { contact: user?.mobile },
          theme:       { color: "#7c3aed" },
          handler: async (response) => {
            try {
              // 3. Verify payment
              await verifyPayment({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
              });

              setIsPaying(false);
              setIsGenerating(true);

              // 4. Generate storybook
              const { data: genData } = await generateStorybook({
                babyName:   babyName.trim(),
                parentName: parentName.trim(),
                sessionId,
                paymentId:  response.razorpay_payment_id,
                orderId:    response.razorpay_order_id,
                amountPaid: orderData.order.amount,
              });

              navigate("/preview", { state: {
                previewUrl:  genData.previewUrl,
                downloadUrl: genData.downloadUrl,
                babyName:    babyName.trim(),
              }});
              resolve();
            } catch (err) {
              setError("Payment verified but storybook generation failed. Please contact support.");
              setIsGenerating(false);
              setIsPaying(false);
              reject(err);
            }
          },
          modal: {
            ondismiss: () => {
              setIsPaying(false);
              reject(new Error("Payment cancelled"));
            },
          },
        };

        if (!window.Razorpay) {
          reject(new Error("Razorpay not loaded"));
          return;
        }
        const rzp = new window.Razorpay(options);
        rzp.open();
      });

    } catch (err) {
      if (err.message !== "Payment cancelled") {
        setError(err.response?.data?.message || err.message || "Payment failed");
      }
      setIsPaying(false);
    }
  };

  if (isGenerating) return <LoadingScreen />;

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(135deg,#0a0a1a 0%,#0d0d2b 50%,#1a0a2e 100%)",
      fontFamily:"Georgia,serif", color:"white", padding:"20px",
    }}>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .input-field{
          width:100%; padding:14px 18px;
          background:rgba(255,255,255,0.07);
          border:1.5px solid rgba(255,255,255,0.12);
          border-radius:14px; color:white; font-size:15px;
          outline:none; transition:border-color .2s, background .2s;
          font-family:Georgia,serif; box-sizing:border-box;
        }
        .input-field::placeholder{color:rgba(255,255,255,0.3)}
        .input-field:focus{border-color:rgba(167,139,250,0.7);background:rgba(255,255,255,0.1)}
        .drop-zone{
          border:2px dashed rgba(167,139,250,0.3);
          border-radius:18px; padding:36px 24px;
          text-align:center; cursor:pointer;
          transition:border-color .2s, background .2s;
          background:rgba(255,255,255,0.03);
        }
        .drop-zone:hover{border-color:rgba(167,139,250,0.6);background:rgba(167,139,250,0.05)}
        .pay-btn{
          width:100%; padding:18px;
          background:linear-gradient(135deg,#7c3aed,#db2777);
          color:white; font-size:17px; font-weight:bold;
          border:none; border-radius:16px; cursor:pointer;
          font-family:Georgia,serif;
          box-shadow:0 6px 32px rgba(124,58,237,0.45);
          transition:transform .15s, box-shadow .15s;
        }
        .pay-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 40px rgba(124,58,237,0.6)}
        .pay-btn:disabled{opacity:0.55;cursor:not-allowed;transform:none}
      `}</style>

      {/* Back nav */}
      <div style={{ maxWidth:"600px", margin:"0 auto 24px" }}>
        <button onClick={() => navigate("/dashboard")} style={{
          background:"none", border:"none", color:"rgba(255,255,255,0.5)",
          cursor:"pointer", fontSize:"14px", display:"flex", alignItems:"center", gap:"6px",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Dashboard
        </button>
      </div>

      <div style={{ maxWidth:"600px", margin:"0 auto", animation:"fadeIn .5s ease" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:"36px" }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="#fde68a" style={{margin:"0 auto 14px",display:"block"}}>
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          <h1 style={{ fontSize:"30px", fontWeight:"bold", marginBottom:"8px" }}>Create Your Storybook</h1>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"15px" }}>
            A personalised magical bedtime adventure for your baby
          </p>

          {/* Price badge */}
          <div style={{ marginTop:"16px", display:"flex", justifyContent:"center", gap:"12px", alignItems:"center", flexWrap:"wrap" }}>
            {applyDiscount ? (
              <>
                <span style={{
                  padding:"8px 20px",
                  background:"linear-gradient(135deg,rgba(251,191,36,0.2),rgba(239,68,68,0.2))",
                  border:"1px solid rgba(251,191,36,0.4)",
                  borderRadius:"99px", fontSize:"18px", fontWeight:"bold", color:"#fbbf24",
                }}>₹5.00</span>
                <span style={{ color:"rgba(255,255,255,0.4)", textDecoration:"line-through", fontSize:"15px" }}>₹10.00</span>
                <span style={{
                  padding:"4px 12px", background:"#ef4444",
                  borderRadius:"99px", fontSize:"12px", color:"white", fontWeight:"bold",
                }}>50% OFF</span>
              </>
            ) : (
              <span style={{
                padding:"8px 20px",
                background:"linear-gradient(135deg,rgba(124,58,237,0.2),rgba(219,39,119,0.2))",
                border:"1px solid rgba(124,58,237,0.4)",
                borderRadius:"99px", fontSize:"18px", fontWeight:"bold", color:"#a78bfa",
              }}>₹10.00</span>
            )}
          </div>
        </div>

        {/* Form card */}
        <div style={{
          background:"rgba(255,255,255,0.04)",
          border:"1px solid rgba(255,255,255,0.08)",
          borderRadius:"24px", padding:"36px",
          boxShadow:"0 20px 60px rgba(0,0,0,0.4)",
        }}>
          <form onSubmit={handlePayAndGenerate} style={{ display:"flex", flexDirection:"column", gap:"22px" }}>

            {/* Baby Name */}
            <div>
              <label style={{ display:"block", color:"rgba(255,255,255,0.7)", fontSize:"13px", marginBottom:"8px" }}>
                Baby's Name *
              </label>
              <input className="input-field" type="text" value={babyName}
                onChange={e => setBabyName(e.target.value)}
                placeholder="Enter your baby's name" maxLength={50}/>
            </div>

            {/* Parent Name */}
            <div>
              <label style={{ display:"block", color:"rgba(255,255,255,0.7)", fontSize:"13px", marginBottom:"8px" }}>
                Parent Name(s) <span style={{color:"rgba(255,255,255,0.3)"}}>optional</span>
              </label>
              <input className="input-field" type="text" value={parentName}
                onChange={e => setParentName(e.target.value)}
                placeholder="e.g. Mommy & Daddy" maxLength={100}/>
            </div>

            {/* Photo Upload */}
            <div>
              <label style={{ display:"block", color:"rgba(255,255,255,0.7)", fontSize:"13px", marginBottom:"8px" }}>
                Upload Photos * <span style={{color:"rgba(255,255,255,0.3)"}}>(6–10 photos)</span>
              </label>

              <label className="drop-zone" onDrop={handleDrop}
                onDragOver={e => e.preventDefault()} style={{ display:"block" }}>
                <input type="file" accept="image/*" multiple onChange={handleFileChange}
                  style={{ display:"none" }} disabled={isUploading}/>
                {isUploading ? (
                  <div style={{ color:"#a78bfa" }}>
                    <div style={{
                      width:"32px", height:"32px", borderRadius:"50%",
                      border:"3px solid rgba(167,139,250,0.3)",
                      borderTopColor:"#a78bfa",
                      animation:"spin 1s linear infinite",
                      margin:"0 auto 12px",
                    }}/>
                    <p style={{ margin:0, fontSize:"14px" }}>Uploading photos...</p>
                  </div>
                ) : (
                  <>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(167,139,250,0.6)" strokeWidth="1.5" style={{margin:"0 auto 12px",display:"block"}}>
                      <polyline points="16 16 12 12 8 16"/>
                      <line x1="12" y1="12" x2="12" y2="21"/>
                      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                    </svg>
                    <p style={{ color:"rgba(255,255,255,0.7)", margin:"0 0 4px", fontSize:"14px", fontWeight:"bold" }}>
                      Drop photos here or click to select
                    </p>
                    <p style={{ color:"rgba(255,255,255,0.3)", margin:0, fontSize:"12px" }}>
                      JPEG, PNG, WebP • Max 10MB each • 6–10 photos
                    </p>
                  </>
                )}
              </label>

              <PhotoGrid photos={photos} isUploading={isUploading}/>
            </div>

            {/* What you get */}
            {photos.length >= 6 && babyName && (
              <div style={{
                padding:"16px 20px",
                background:"rgba(167,139,250,0.08)",
                border:"1px solid rgba(167,139,250,0.2)",
                borderRadius:"14px",
                animation:"fadeIn .3s ease",
              }}>
                <p style={{ color:"#a78bfa", fontWeight:"bold", fontSize:"14px", marginBottom:"10px" }}>
                  Your storybook will include:
                </p>
                {[
                  `8 personalised pages for ${babyName}`,
                  "Your real baby photos on every page",
                  "Unique magical theme per page",
                  "Instant PDF download",
                ].map(item => (
                  <div key={item} style={{ display:"flex", gap:"8px", alignItems:"center", marginBottom:"6px" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#34d399">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span style={{ color:"rgba(255,255,255,0.7)", fontSize:"13px" }}>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{
                padding:"12px 16px", background:"rgba(239,68,68,0.1)",
                border:"1px solid rgba(239,68,68,0.3)",
                borderRadius:"12px", color:"#f87171", fontSize:"13px", textAlign:"center",
              }}>{error}</div>
            )}

            {/* Pay button */}
            <button className="pay-btn" type="submit"
              disabled={isUploading || isPaying || photos.length < 6 || !babyName.trim()}>
              {isPaying ? "Opening Payment..." : isUploading ? "Uploading..." : `Pay ${price} & Generate Storybook`}
            </button>

            <p style={{ textAlign:"center", color:"rgba(255,255,255,0.25)", fontSize:"12px" }}>
              Secured by Razorpay • Your photos are deleted after PDF generation
            </p>
          </form>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}