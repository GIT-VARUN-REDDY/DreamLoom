const jwt   = require("jsonwebtoken");
const fetch  = require("node-fetch");
const User   = require("../models/User");
const OTP    = require("../models/OTP");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

/* ── BREVO EMAIL ─────────────────────────────────────── */
const sendBrevoEmail = async (toEmail, otp) => {
  const apiKey      = (process.env.BREVO_API_KEY      || "").trim();
  const senderEmail = (process.env.BREVO_SENDER_EMAIL || "").trim();
  const senderName  = (process.env.BREVO_SENDER_NAME  || "DreamLoom").trim();

  if (!apiKey || !senderEmail) {
    console.log(`\n====== DEV OTP for ${toEmail}: [ ${otp} ] ======\n`);
    return true;
  }

  console.log(`Brevo → ${toEmail} | key: ${apiKey.substring(0,12)}...`);

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "accept":"application/json","api-key":apiKey,"content-type":"application/json" },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to:     [{ email: toEmail }],
        subject: `Your DreamLoom OTP: ${otp}`,
        htmlContent: `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f8;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
  <tr><td align="center">
    <table width="480" cellpadding="0" cellspacing="0"
      style="background:#0a0a1a;border-radius:20px;padding:40px;color:white;text-align:center;">
      <tr><td style="padding-bottom:20px;">
        <h1 style="color:#fde68a;font-size:26px;margin:0 0 6px;">DreamLoom</h1>
        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Magical Storybooks for Your Baby</p>
      </td></tr>
      <tr><td style="padding:28px 0;">
        <div style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);border-radius:16px;padding:28px;">
          <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 16px;">Your One-Time Password is:</p>
          <div style="font-size:44px;font-weight:bold;letter-spacing:14px;color:#a78bfa;font-family:Courier,monospace;margin-bottom:16px;">${otp}</div>
          <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0;">Valid for 5 minutes only</p>
        </div>
      </td></tr>
      <tr><td><p style="color:rgba(255,255,255,0.25);font-size:12px;margin:0;">If you did not request this, ignore this email.</p></td></tr>
    </table>
  </td></tr>
</table></body></html>`,
      }),
    });
    const txt = await res.text();
    console.log(`Brevo status: ${res.status}`);
    if (res.ok) return true;
    console.error(`Brevo error: ${txt}`);
    console.log(`\n====== FALLBACK OTP for ${toEmail}: [ ${otp} ] ======\n`);
    return true;
  } catch (err) {
    console.error("Brevo network error:", err.message);
    console.log(`\n====== FALLBACK OTP for ${toEmail}: [ ${otp} ] ======\n`);
    return true;
  }
};

/* ── SEND OTP ─────────────────────────────────────────── */
const sendOTP = async (req, res) => {
  try {
    const { email, mobile } = req.body;
    if (!email || !mobile)
      return res.status(400).json({ success: false, message: "Email and mobile are required" });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ success: false, message: "Enter a valid email address" });

    const digits     = mobile.replace(/\D/g,"").slice(-10);
    if (digits.length !== 10)
      return res.status(400).json({ success: false, message: "Enter a valid 10-digit mobile number" });

    const fullMobile = `+91${digits}`;
    const identifier = email.toLowerCase().trim();

    const recent = await OTP.countDocuments({ identifier, createdAt: { $gte: new Date(Date.now()-10*60*1000) } });
    if (recent >= 3) return res.status(429).json({ success: false, message: "Too many requests. Wait 10 minutes." });

    const otp = generateOTP();
    await OTP.deleteMany({ identifier });
    await OTP.create({ identifier, mobile: fullMobile, otp, expiresAt: new Date(Date.now()+5*60*1000) });
    await sendBrevoEmail(identifier, otp);

    res.json({ success: true, message: `OTP sent to ${identifier}` });
  } catch (err) {
    console.error("sendOTP:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ── VERIFY OTP ───────────────────────────────────────── */
const verifyOTP = async (req, res) => {
  try {
    const { email, mobile, otp, name } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP required" });

    const identifier = email.toLowerCase().trim();
    const digits     = (mobile||"").replace(/\D/g,"").slice(-10);
    const fullMobile = digits.length===10 ? `+91${digits}` : null;

    const record = await OTP.findOne({ identifier });
    if (!record) return res.status(400).json({ success: false, message: "OTP expired. Request a new one." });

    record.attempts += 1;
    await record.save();

    if (record.attempts > 5) {
      await OTP.deleteMany({ identifier });
      return res.status(400).json({ success: false, message: "Too many wrong attempts. Request a new OTP." });
    }
    if (record.otp !== String(otp).trim()) {
      const left = 5 - record.attempts;
      return res.status(400).json({ success: false, message: `Invalid OTP. ${left} attempt${left!==1?"s":""} remaining.` });
    }
    if (record.expiresAt < new Date()) {
      await OTP.deleteMany({ identifier });
      return res.status(400).json({ success: false, message: "OTP expired. Request a new one." });
    }

    await OTP.deleteMany({ identifier });

    const mobileForCheck = fullMobile || record.mobile || "";
    const isAdmin        = mobileForCheck === process.env.ADMIN_MOBILE;

    // Admin → require password step, issue short-lived tempToken
    if (isAdmin) {
      return res.json({
        success: true,
        needsAdminPassword: true,
        tempToken: jwt.sign(
          { mobile: mobileForCheck, isAdmin: true, purpose: "admin-password-step" },
          process.env.JWT_SECRET,
          { expiresIn: "5m" }
        ),
      });
    }

    // Regular user
    let user = await User.findOne({ $or: [{ email: identifier }, ...(fullMobile?[{mobile:fullMobile}]:[]) ] });
    if (!user) {
      const count = await User.countDocuments({ role:"user" });
      user = await User.create({ mobile: fullMobile||mobileForCheck, email: identifier, name: name||"", role:"user", isFirstThirty: count<30 });
    } else {
      if (name && !user.name)       user.name   = name;
      if (fullMobile && !user.mobile) user.mobile = fullMobile;
      if (!user.email)              user.email  = identifier;
      await user.save();
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn:"7d" });
    res.json({
      success: true, needsAdminPassword: false, token,
      user: { id:user._id, mobile:user.mobile, email:user.email, name:user.name, role:user.role,
              isFirstThirty:user.isFirstThirty, discountUsed:user.discountUsed, totalOrders:user.totalOrders, createdAt:user.createdAt },
    });
  } catch (err) {
    console.error("verifyOTP:", err);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

/* ── VERIFY ADMIN PASSWORD ────────────────────────────── */
const verifyAdminPassword = async (req, res) => {
  try {
    const { tempToken, password } = req.body;
    if (!tempToken || !password) return res.status(400).json({ success:false, message:"Token and password required" });

    let decoded;
    try { decoded = jwt.verify(tempToken, process.env.JWT_SECRET); }
    catch { return res.status(401).json({ success:false, message:"Session expired. Please log in again." }); }

    if (!decoded.isAdmin || decoded.purpose !== "admin-password-step")
      return res.status(403).json({ success:false, message:"Invalid token" });

    const adminPass = (process.env.ADMIN_PASSWORD || "").trim();
    if (!adminPass) return res.status(500).json({ success:false, message:"Admin password not configured on server" });
    if (password.trim() !== adminPass) return res.status(401).json({ success:false, message:"Incorrect admin password" });

    let user = await User.findOne({ mobile: decoded.mobile });
    if (!user) user = await User.create({ mobile:decoded.mobile, email:"", name:"Admin", role:"admin" });

    const token = jwt.sign({ id:user._id, role:"admin" }, process.env.JWT_SECRET, { expiresIn:"7d" });
    res.json({ success:true, token, user:{ id:user._id, mobile:user.mobile, email:user.email, name:user.name, role:"admin" } });
  } catch (err) {
    console.error("verifyAdminPassword:", err);
    res.status(500).json({ success:false, message:"Server error" });
  }
};

/* ── DEBUG BREVO ──────────────────────────────────────── */
const debugBrevo = async (req, res) => {
  const apiKey = (process.env.BREVO_API_KEY||"").trim();
  if (!apiKey) return res.json({ status:"NOT_SET" });
  try {
    const r = await fetch("https://api.brevo.com/v3/account", { headers:{"api-key":apiKey,"accept":"application/json"} });
    const d = await r.json();
    res.json(r.ok ? { status:"OK", email:d.email, keyPrefix:apiKey.substring(0,12)+"..." } : { status:"ERROR", code:r.status, message:d.message });
  } catch (err) { res.json({ status:"ERROR", message:err.message }); }
};

module.exports = { sendOTP, verifyOTP, verifyAdminPassword, debugBrevo };