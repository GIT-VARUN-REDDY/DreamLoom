import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import AuthPage       from "./pages/AuthPage";
import Dashboard      from "./pages/Dashboard";
import CreatePage     from "./pages/CreatePage";
import PreviewBook    from "./pages/PreviewBook";
import AdminDashboard from "./pages/AdminDashboard";
import HomePage       from "./pages/HomePage";

/* ── PROTECTED ROUTE ─────────────────────────────────── */
function Protected({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{
      minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      background:"linear-gradient(135deg,#0a0a1a,#0d0d2b)",
    }}>
      <div style={{
        width:"40px", height:"40px", borderRadius:"50%",
        border:"3px solid rgba(167,139,250,0.2)",
        borderTopColor:"#a78bfa",
        animation:"spin 1s linear infinite",
      }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!user) return <Navigate to="/auth" replace/>;
  if (adminOnly && user.role !== "admin") return <Navigate to="/dashboard" replace/>;
  return children;
}

/* ── APP ─────────────────────────────────────────────── */
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/"         element={<HomePage/>}/>
      <Route path="/auth"     element={user ? <Navigate to={user.role==="admin"?"/admin":"/dashboard"} replace/> : <AuthPage/>}/>

      <Route path="/dashboard" element={
        <Protected><Dashboard/></Protected>
      }/>
      <Route path="/create" element={
        <Protected><CreatePage/></Protected>
      }/>
      <Route path="/preview" element={
        <Protected><PreviewBook/></Protected>
      }/>
      <Route path="/admin" element={
        <Protected adminOnly><AdminDashboard/></Protected>
      }/>

      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes/>
      </BrowserRouter>
    </AuthProvider>
  );
}