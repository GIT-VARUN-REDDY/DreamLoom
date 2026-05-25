require("dotenv").config();
const express  = require("express");
const cors     = require("cors");
const mongoose = require("mongoose");
const path     = require("path");
const fs       = require("fs");

const app = express();

// Ensure directories exist
["uploads","generated-pdfs"].forEach(d => {
  const p = path.join(__dirname,d);
  if (!fs.existsSync(p)) fs.mkdirSync(p,{recursive:true});
});

app.use(cors({ origin:"*" }));
app.use(express.json({ limit:"50mb" }));
app.use(express.urlencoded({ limit:"50mb", extended:true }));
app.use("/uploads",        express.static(path.join(__dirname,"uploads")));
app.use("/generated-pdfs", express.static(path.join(__dirname,"generated-pdfs")));

// Increase timeout for PDF generation
app.use((req,res,next) => {
  if (req.path.includes("/generate")) { req.setTimeout(300000); res.setTimeout(300000); }
  next();
});

app.use("/api/auth",      require("./routes/authRoutes"));
app.use("/api/payment",   require("./routes/paymentRoutes"));
app.use("/api/storybook", require("./routes/storybookRoutes"));
app.use("/api/admin",     require("./routes/adminRoutes"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB error:", err));

app.get("/", (req,res) => res.send("DreamLoom Backend Running 🌙"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));