import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { adminGetStats, adminGetUsers, adminGetStorybooks } from "../services/api";

const BACKEND = "https://dreamloom-i2oa.onrender.com/api";

export default function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [tab,        setTab]        = useState("overview");
  const [stats,      setStats]      = useState(null);
  const [users,      setUsers]      = useState([]);
  const [storybooks, setStorybooks] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [userPage,   setUserPage]   = useState(1);
  const [sbPage,     setSbPage]     = useState(1);
  const [userTotal,  setUserTotal]  = useState(0);
  const [sbTotal,    setSbTotal]    = useState(0);
  const [search,     setSearch]     = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") { navigate("/auth"); return; }
    loadStats();
  }, []);

  useEffect(() => { if (tab === "users")      loadUsers(userPage); }, [tab, userPage]);
  useEffect(() => { if (tab === "storybooks") loadStorybooks(sbPage); }, [tab, sbPage]);

  const loadStats = async () => {
    setLoading(true);
    try { const { data } = await adminGetStats(); setStats(data.stats); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const loadUsers = async (page) => {
    setLoading(true);
    try {
      const { data } = await adminGetUsers(page);
      setUsers(data.users); setUserTotal(data.total);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const loadStorybooks = async (page) => {
    setLoading(true);
    try {
      const { data } = await adminGetStorybooks(page);
      setStorybooks(data.storybooks); setSbTotal(data.total);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const filteredUsers = users.filter(u =>
    !search || u.mobile?.includes(search) || u.name?.toLowerCase().includes(search.toLowerCase())
  );

  const StatCard = ({ label, value, sub, color, icon }) => (
    <div style={{
      background:"rgba(255,255,255,0.05)",
      border:`1px solid ${color}30`,
      borderRadius:"20px", padding:"24px",
      position:"relative", overflow:"hidden",
    }}>
      <div style={{
        position:"absolute", top:"-10px", right:"-10px",
        width:"80px", height:"80px", borderRadius:"50%",
        background:`${color}15`,
      }}/>
      <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"12px", marginBottom:"8px" }}>{label}</p>
      <p style={{ color, fontSize:"32px", fontWeight:"bold", margin:"0 0 4px" }}>{value}</p>
      {sub && <p style={{ color:"rgba(255,255,255,0.35)", fontSize:"12px", margin:0 }}>{sub}</p>}
    </div>
  );

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(135deg,#050510 0%,#0a0a20 50%,#10051a 100%)",
      fontFamily:"Georgia,serif", color:"white",
    }}>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .tab-btn:hover{background:rgba(255,255,255,0.1)!important}
        .tab-active{background:rgba(124,58,237,0.25)!important;border-color:rgba(124,58,237,0.6)!important;color:#a78bfa!important}
        .row-hover:hover{background:rgba(255,255,255,0.06)!important}
        .page-btn:hover:not(:disabled){background:rgba(124,58,237,0.3)!important}
        .action-btn:hover{opacity:.8}
        input::placeholder{color:rgba(255,255,255,0.3)}
      `}</style>

      {/* SIDEBAR */}
      <div style={{ display:"flex", minHeight:"100vh" }}>
        <aside style={{
          width:"220px", flexShrink:0,
          background:"rgba(255,255,255,0.03)",
          borderRight:"1px solid rgba(255,255,255,0.07)",
          padding:"28px 16px",
          display:"flex", flexDirection:"column",
          position:"sticky", top:0, height:"100vh",
        }}>
          <div style={{ marginBottom:"32px", paddingLeft:"8px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#fde68a">
                <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
              </svg>
              <span style={{ color:"#fde68a", fontWeight:"bold", fontSize:"17px" }}>DreamLoom</span>
            </div>
            <span style={{ color:"rgba(255,255,255,0.3)", fontSize:"11px", paddingLeft:"32px" }}>Admin Panel</span>
          </div>

          {[
            { id:"overview",   label:"Overview"   },
            { id:"users",      label:"Users"       },
            { id:"storybooks", label:"Storybooks"  },
          ].map(t => (
            <button key={t.id} className={`tab-btn ${tab===t.id?"tab-active":""}`}
              onClick={() => setTab(t.id)}
              style={{
                display:"block", width:"100%", textAlign:"left",
                padding:"12px 16px", marginBottom:"4px",
                background:"transparent",
                border:"1px solid transparent",
                borderRadius:"12px", color:"rgba(255,255,255,0.6)",
                cursor:"pointer", fontSize:"14px",
                transition:"all .2s",
              }}>{t.label}</button>
          ))}

          <div style={{ marginTop:"auto" }}>
            <div style={{
              padding:"12px 16px", marginBottom:"12px",
              background:"rgba(255,255,255,0.04)", borderRadius:"12px",
            }}>
              <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"11px", margin:"0 0 2px" }}>Logged in as</p>
              <p style={{ color:"#a78bfa", fontSize:"13px", margin:0, wordBreak:"break-all" }}>{user?.mobile}</p>
            </div>
            <button onClick={() => { logout(); navigate("/auth"); }} style={{
              width:"100%", padding:"10px",
              background:"rgba(239,68,68,0.12)",
              border:"1px solid rgba(239,68,68,0.25)",
              borderRadius:"12px", color:"#f87171",
              cursor:"pointer", fontSize:"13px",
            }}>Logout</button>
          </div>
        </aside>

        {/* MAIN */}
        <main style={{ flex:1, padding:"36px 32px", overflowX:"auto" }}>

          {/* OVERVIEW */}
          {tab === "overview" && (
            <div style={{ animation:"fadeIn .4s ease" }}>
              <h1 style={{ fontSize:"28px", fontWeight:"bold", marginBottom:"28px" }}>Overview</h1>

              {loading || !stats ? (
                <div style={{ color:"rgba(255,255,255,0.4)" }}>Loading stats...</div>
              ) : (
                <>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"16px", marginBottom:"32px" }}>
                    <StatCard label="Total Users"      value={stats.totalUsers}       color="#a78bfa" sub={`+${stats.recentSignups} this week`}/>
                    <StatCard label="Total Storybooks" value={stats.totalStorybooks}  color="#34d399" sub={`${stats.paidStorybooks} paid`}/>
                    <StatCard label="Total Revenue"    value={`₹${stats.totalRevenue}`} color="#fbbf24"/>
                    <StatCard label="Offers Remaining" value={stats.offersRemaining}  color="#f472b6" sub={`${stats.discountUsed} discounts used`}/>
                  </div>

                  {/* Offer progress bar */}
                  <div style={{
                    background:"rgba(255,255,255,0.05)",
                    border:"1px solid rgba(255,255,255,0.08)",
                    borderRadius:"20px", padding:"24px", marginBottom:"24px",
                  }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"12px" }}>
                      <span style={{ fontWeight:"bold", fontSize:"15px" }}>First 30 Families Offer</span>
                      <span style={{ color:"#fbbf24" }}>{stats.firstThirtyUsed}/30 claimed</span>
                    </div>
                    <div style={{ height:"10px", background:"rgba(255,255,255,0.08)", borderRadius:"99px", overflow:"hidden" }}>
                      <div style={{
                        height:"100%",
                        width:`${(stats.firstThirtyUsed/30)*100}%`,
                        background:"linear-gradient(90deg,#7c3aed,#db2777)",
                        borderRadius:"99px",
                        transition:"width .5s ease",
                      }}/>
                    </div>
                    <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"12px", marginTop:"8px" }}>
                      {stats.offersRemaining} spots remaining at 50% off
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* USERS */}
          {tab === "users" && (
            <div style={{ animation:"fadeIn .4s ease" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px", flexWrap:"wrap", gap:"12px" }}>
                <h1 style={{ fontSize:"24px", fontWeight:"bold", margin:0 }}>Users ({userTotal})</h1>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by mobile or name..."
                  style={{
                    padding:"10px 16px", background:"rgba(255,255,255,0.07)",
                    border:"1px solid rgba(255,255,255,0.15)", borderRadius:"12px",
                    color:"white", fontSize:"14px", outline:"none", width:"250px",
                  }}/>
              </div>

              <div style={{
                background:"rgba(255,255,255,0.03)",
                border:"1px solid rgba(255,255,255,0.07)",
                borderRadius:"20px", overflow:"hidden",
              }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"14px" }}>
                  <thead>
                    <tr style={{ background:"rgba(255,255,255,0.04)", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
                      {["Mobile","Name","Email","Orders","Offer","Discount","Joined"].map(h => (
                        <th key={h} style={{ padding:"14px 16px", textAlign:"left", color:"rgba(255,255,255,0.5)", fontWeight:"normal", fontSize:"12px" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={7} style={{ padding:"40px", textAlign:"center", color:"rgba(255,255,255,0.3)" }}>Loading...</td></tr>
                    ) : filteredUsers.map((u, i) => (
                      <tr key={u._id} className="row-hover" style={{
                        borderBottom:"1px solid rgba(255,255,255,0.04)",
                        transition:"background .15s",
                        animation:`fadeIn ${.1+i*.05}s ease`,
                      }}>
                        <td style={{ padding:"14px 16px", color:"#a78bfa", fontWeight:"bold" }}>{u.mobile}</td>
                        <td style={{ padding:"14px 16px", color:"rgba(255,255,255,0.8)" }}>{u.name || "—"}</td>
                        <td style={{ padding:"14px 16px", color:"rgba(255,255,255,0.5)", fontSize:"13px" }}>{u.email || "—"}</td>
                        <td style={{ padding:"14px 16px", color:"#34d399", textAlign:"center" }}>{u.totalOrders}</td>
                        <td style={{ padding:"14px 16px", textAlign:"center" }}>
                          {u.isFirstThirty
                            ? <span style={{ color:"#fbbf24", fontSize:"12px" }}>Yes</span>
                            : <span style={{ color:"rgba(255,255,255,0.25)", fontSize:"12px" }}>No</span>}
                        </td>
                        <td style={{ padding:"14px 16px", textAlign:"center" }}>
                          {u.discountUsed
                            ? <span style={{ color:"#f87171", fontSize:"12px" }}>Used</span>
                            : <span style={{ color:"rgba(255,255,255,0.25)", fontSize:"12px" }}>—</span>}
                        </td>
                        <td style={{ padding:"14px 16px", color:"rgba(255,255,255,0.4)", fontSize:"12px" }}>
                          {new Date(u.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div style={{ display:"flex", justifyContent:"center", gap:"8px", marginTop:"20px" }}>
                <button className="page-btn" onClick={() => setUserPage(p=>Math.max(1,p-1))} disabled={userPage===1}
                  style={{ padding:"8px 16px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px", color:"white", cursor:"pointer", transition:"background .2s" }}>
                  Prev</button>
                <span style={{ padding:"8px 16px", color:"rgba(255,255,255,0.5)", fontSize:"14px" }}>
                  Page {userPage} of {Math.ceil(userTotal/20)||1}
                </span>
                <button className="page-btn" onClick={() => setUserPage(p=>p+1)} disabled={userPage*20>=userTotal}
                  style={{ padding:"8px 16px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px", color:"white", cursor:"pointer", transition:"background .2s" }}>
                  Next</button>
              </div>
            </div>
          )}

          {/* STORYBOOKS */}
          {tab === "storybooks" && (
            <div style={{ animation:"fadeIn .4s ease" }}>
              <h1 style={{ fontSize:"24px", fontWeight:"bold", marginBottom:"24px" }}>Storybooks ({sbTotal})</h1>

              <div style={{
                background:"rgba(255,255,255,0.03)",
                border:"1px solid rgba(255,255,255,0.07)",
                borderRadius:"20px", overflow:"hidden",
              }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"14px" }}>
                  <thead>
                    <tr style={{ background:"rgba(255,255,255,0.04)", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
                      {["Baby Name","User Mobile","Amount","Status","Date","Actions"].map(h => (
                        <th key={h} style={{ padding:"14px 16px", textAlign:"left", color:"rgba(255,255,255,0.5)", fontWeight:"normal", fontSize:"12px" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={6} style={{ padding:"40px", textAlign:"center", color:"rgba(255,255,255,0.3)" }}>Loading...</td></tr>
                    ) : storybooks.map((sb, i) => (
                      <tr key={sb._id} className="row-hover" style={{
                        borderBottom:"1px solid rgba(255,255,255,0.04)",
                        transition:"background .15s",
                        animation:`fadeIn ${.1+i*.04}s ease`,
                      }}>
                        <td style={{ padding:"14px 16px", color:"#fde68a", fontWeight:"bold" }}>{sb.babyName}</td>
                        <td style={{ padding:"14px 16px", color:"#a78bfa" }}>{sb.user?.mobile || "—"}</td>
                        <td style={{ padding:"14px 16px", color:"#34d399" }}>
                          {sb.amountPaid ? `₹${(sb.amountPaid/100).toFixed(0)}` : "—"}
                        </td>
                        <td style={{ padding:"14px 16px" }}>
                          <span style={{
                            padding:"3px 10px", borderRadius:"20px", fontSize:"11px",
                            background: sb.status==="generated"?"rgba(52,211,153,0.15)":"rgba(251,191,36,0.15)",
                            border:`1px solid ${sb.status==="generated"?"rgba(52,211,153,0.4)":"rgba(251,191,36,0.4)"}`,
                            color: sb.status==="generated"?"#34d399":"#fbbf24",
                          }}>{sb.status}</span>
                        </td>
                        <td style={{ padding:"14px 16px", color:"rgba(255,255,255,0.4)", fontSize:"12px" }}>
                          {new Date(sb.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
                        </td>
                        <td style={{ padding:"14px 16px" }}>
                          {sb.pdfFile && (
                            <div style={{ display:"flex", gap:"8px" }}>
                              <a className="action-btn" href={`${BACKEND}/admin/pdf/preview/${sb.pdfFile}`}
                                target="_blank" rel="noopener noreferrer"
                                style={{
                                  padding:"6px 12px", background:"rgba(167,139,250,0.15)",
                                  border:"1px solid rgba(167,139,250,0.3)",
                                  borderRadius:"8px", color:"#a78bfa",
                                  fontSize:"12px", textDecoration:"none",
                                  transition:"opacity .2s",
                                }}>Preview</a>
                              <a className="action-btn" href={`${BACKEND}/admin/pdf/download/${sb.pdfFile}`}
                                target="_blank" rel="noopener noreferrer"
                                style={{
                                  padding:"6px 12px", background:"rgba(52,211,153,0.15)",
                                  border:"1px solid rgba(52,211,153,0.3)",
                                  borderRadius:"8px", color:"#34d399",
                                  fontSize:"12px", textDecoration:"none",
                                  transition:"opacity .2s",
                                }}>Download</a>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display:"flex", justifyContent:"center", gap:"8px", marginTop:"20px" }}>
                <button className="page-btn" onClick={() => setSbPage(p=>Math.max(1,p-1))} disabled={sbPage===1}
                  style={{ padding:"8px 16px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px", color:"white", cursor:"pointer", transition:"background .2s" }}>Prev</button>
                <span style={{ padding:"8px 16px", color:"rgba(255,255,255,0.5)", fontSize:"14px" }}>
                  Page {sbPage} of {Math.ceil(sbTotal/20)||1}
                </span>
                <button className="page-btn" onClick={() => setSbPage(p=>p+1)} disabled={sbPage*20>=sbTotal}
                  style={{ padding:"8px 16px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px", color:"white", cursor:"pointer", transition:"background .2s" }}>Next</button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}