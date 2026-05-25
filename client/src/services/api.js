import axios from "axios";

const API = axios.create({
  baseURL: "https://dreamloom-i2oa.onrender.com/api"
});

/* ─────────────────────────────────────────────
   AUTH INTERCEPTOR (SAFE FOR MOBILE)
───────────────────────────────────────────── */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("dl_token");

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`
    };
  }

  return config;
});

/* ─────────────────────────────────────────────
   AUTH
───────────────────────────────────────────── */
export const sendOTP = (email, mobile) =>
  API.post("/auth/send-otp", { email, mobile });

export const verifyOTP = (email, mobile, otp, name) =>
  API.post("/auth/verify-otp", { email, mobile, otp, name });

export const verifyAdminPass = (tempToken, password) =>
  API.post("/auth/admin-login", { tempToken, password });

export const getMe = () => API.get("/auth/me");

/* ─────────────────────────────────────────────
   PAYMENT
───────────────────────────────────────────── */
export const createOrder = () =>
  API.post("/payment/create-order");

export const verifyPayment = (data) =>
  API.post("/payment/verify", data);

/* ─────────────────────────────────────────────
   STORYBOOK (FIXED UPLOAD)
   ⚠️ DO NOT set Content-Type manually
───────────────────────────────────────────── */
export const uploadPhotos = (files) => {
  const form = new FormData();

  files.forEach((file) => {
    form.append("photos", file);
  });

  return API.post("/storybook/upload", form);
};

export const generateStorybook = (data) =>
  API.post("/storybook/generate", data);

export const getMyStorybooks = () =>
  API.get("/storybook/my-storybooks");

/* ─────────────────────────────────────────────
   ADMIN
───────────────────────────────────────────── */
export const adminGetStats = () =>
  API.get("/admin/stats");

export const adminGetUsers = (page) =>
  API.get(`/admin/users?page=${page}`);

export const adminGetStorybooks = (page) =>
  API.get(`/admin/storybooks?page=${page}`);

export const adminGetUserBooks = (uid) =>
  API.get(`/admin/users/${uid}/storybooks`);

/* ─────────────────────────────────────────────
   PDF URL HELPERS (TOKEN SAFE)
───────────────────────────────────────────── */
export const pdfUrl = (filename, type = "preview") => {
  const token = localStorage.getItem("dl_token") || "";
  const baseUrl = "https://dreamloom-i2oa.onrender.com/api";

  return `${baseUrl}/storybook/${type}/${filename}?token=${token}`;
};

export const adminPdfUrl = (filename, type = "preview") => {
  const token = localStorage.getItem("dl_token") || "";
  const baseUrl = "https://dreamloom-i2oa.onrender.com/api";

  return `${baseUrl}/admin/pdf/${type}/${filename}?token=${token}`;
}; 