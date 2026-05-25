import { createContext, useState, useContext, useEffect } from "react";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("dl_token");
    const u = localStorage.getItem("dl_user");
    if (t && u) { setToken(t); setUser(JSON.parse(u)); }
    setLoading(false);
  }, []);

  const login = (userData, tokenData) => {
    setUser(userData); setToken(tokenData);
    localStorage.setItem("dl_token", tokenData);
    localStorage.setItem("dl_user",  JSON.stringify(userData));
  };
  const logout = () => {
    setUser(null); setToken(null);
    localStorage.removeItem("dl_token");
    localStorage.removeItem("dl_user");
  };
  const updateUser = (u) => {
    const m = { ...user, ...u };
    setUser(m);
    localStorage.setItem("dl_user", JSON.stringify(m));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);