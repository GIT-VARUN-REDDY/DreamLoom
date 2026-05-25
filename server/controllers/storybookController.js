const path      = require("path");
const fs        = require("fs");
const chromium  = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");
const { v4: uuidv4 } = require("uuid");
const sharp     = require("sharp");

const { generateStoryHTML } = require("../templates/storyTemplate");
const bedtimeStory = require("../stories/bedtime.json");
const Storybook    = require("../models/Storybook");
const User         = require("../models/User");
const { processPhoto } = require("./imageProcessor");

let uploadedPhotosStore = {};

/* ── PERSONALISATION ─────────────────────────────────── */
const magicalDetails = [
  "A tiny star winked from above",
  "The moonlight danced softly through the window",
  "A sleepy cloud floated gently by",
  "Little fireflies twinkled in the distance",
  "The night sky sparkled with a thousand diamonds",
  "A gentle breeze carried the scent of sweet dreams",
  "The stars hummed a quiet lullaby",
  "Moonbeams painted everything in silver light",
];

const personaliseStory = (pages, babyName, parentName) => {
  const parent = parentName || "Mommy & Daddy";
  const v      = babyName.length % 3;
  const tv = {
    "Bath Time":       [`Splish, splash! Little ${babyName} loves bath time. The warm bubbles tickle tiny fingers and toes. ${magicalDetails[0]} as ${babyName} giggled with pure joy.`,`The bathtub fills with the bubbliest water just for ${babyName}. Tiny hands splash and play while ${parent} hums softly. ${magicalDetails[1]}, and ${babyName} smiled the sweetest smile.`,`Bath time is ${babyName}'s favourite adventure! Bubbles pop and dance in the warm glow. ${magicalDetails[4]} just for ${babyName} tonight.`],
    "Pajama Time":     [`Now it's time for the cosiest pajamas — just for ${babyName}! ${parent} helps with each little button. ${magicalDetails[2]}, as if the sky was getting sleepy too.`,`${babyName} wriggles into the fluffiest pajamas. ${parent} does up every button with a kiss. ${magicalDetails[7]} fell gently across the soft fabric.`,`Cosy pajama time for sweet little ${babyName}! The fabric is so soft against tiny skin. ${magicalDetails[3]} just outside the window.`],
    "Family Cuddle":   [`The very best part of every evening — cuddle time with ${babyName}! Warm arms wrap around from ${parent}. ${magicalDetails[5]} as ${babyName} snuggled in close.`,`${babyName} melts into the warmest hug from ${parent}. Little fingers hold on tight. ${magicalDetails[1]}, blessing this precious moment.`,`Nothing is better than holding little ${babyName} close. ${parent} squeezes tight and ${babyName} squeezes right back. ${magicalDetails[6]} just for them.`],
    "Story Time":      [`With a favourite book open wide, ${babyName} listens to tales of magical lands. ${magicalDetails[4]} as if the story was coming alive.`,`${parent} turns each page slowly for ${babyName}, whose eyes grow wide with wonder. ${magicalDetails[0]} each time a new page turned.`,`Story time is pure magic for ${babyName}! The words float like tiny butterflies. ${magicalDetails[7]} made every illustration glow.`],
    "Lullaby Time":    [`A gentle lullaby fills the air as ${parent} sings softly for ${babyName}. ${magicalDetails[3]} danced to the rhythm of the song.`,`${parent}'s voice is the most beautiful sound to ${babyName}. Each note carries them closer to dreamland. ${magicalDetails[2]} swayed gently in time.`,`The lullaby wraps around ${babyName} like a warm hug. Tiny eyelids flutter and grow heavy. ${magicalDetails[6]} only for ${babyName} tonight.`],
    "Goodnight Kiss":  [`One soft kiss on ${babyName}'s forehead, then one on each cheek from ${parent}. ${magicalDetails[1]} painted the room in the softest glow.`,`${parent} plants the gentlest kiss on sleepy little ${babyName}. ${magicalDetails[7]} blessed this perfect moment.`,`Three goodnight kisses for ${babyName} — one for sweet dreams, one for love, one for morning. ${magicalDetails[5]} floated through the room.`],
    "Sweet Dreams":    [`And now dear ${babyName} drifts into the most magical dreamland. ${magicalDetails[4]} will watch over you all night.`,`${babyName} floats softly into dreamland on a cloud of pure love. ${magicalDetails[0]} will guide you home by morning.`,`Goodnight, sweet ${babyName}. The whole universe smiles as you sleep. ${magicalDetails[3]} light your way through every dream.`],
  };
  return pages.map(p => {
    if (p.type==="cover") return { ...p, photoPath:null, text:`${babyName}'s Bedtime Adventure` };
    const vars = tv[p.title];
    return { ...p, text: vars ? vars[v] : p.text.replace(/\[Baby Name\]/g,babyName).replace(/\[Parent Name\]/g,parent) };
  });
};

/* ── UPLOAD ──────────────────────────────────────────── */
const uploadPhotos = (req, res) => {
  try {
    if (!req.files || req.files.length < 6)
      return res.status(400).json({ success:false, message:"Please upload at least 6 photos" });
    const sessionId = uuidv4();
    uploadedPhotosStore[sessionId] = req.files.map(f => ({ filename:f.filename, path:`/uploads/${f.filename}`, originalName:f.originalname }));
    res.json({ success:true, sessionId, photoCount:req.files.length, photos:uploadedPhotosStore[sessionId] });
  } catch (err) { res.status(500).json({ success:false, message:"Failed to upload photos" }); }
};

/* ── GENERATE ────────────────────────────────────────── */
const generateStorybook = async (req, res) => {
  let browser = null;
  try {
    const { babyName, parentName, sessionId, paymentId, orderId, amountPaid } = req.body;
    const userId = req.user._id;

    if (!babyName) return res.status(400).json({ success:false, message:"Baby name is required" });
    if (!sessionId || !uploadedPhotosStore[sessionId])
      return res.status(400).json({ success:false, message:"No photos found. Please upload first." });
    if (!paymentId || !orderId)
      return res.status(402).json({ success:false, message:"Payment required before generating" });

    const photos = uploadedPhotosStore[sessionId];
    if (photos.length < 6) return res.status(400).json({ success:false, message:"At least 6 photos required" });

    const pdfDir = path.join(__dirname,"../generated-pdfs");
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir,{recursive:true});

    const allPages   = bedtimeStory.pages;
    const storyPages = allPages.filter(p=>p.type!=="cover");
    const pages      = personaliseStory(allPages, babyName, parentName);

    console.log(`Processing ${photos.length} photos...`);
    const processedPhotos = [];
    for (let i=0; i<photos.length; i++) {
      const matchingPage = storyPages[i%storyPages.length];
      const absPath = path.join(__dirname,"../uploads",photos[i].filename);
      console.log(`[${i+1}/${photos.length}] ${photos[i].filename} → "${matchingPage.title}"`);
      processedPhotos.push(await processPhoto(absPath, matchingPage.title));
    }

    const mappedPages = pages.map(p => {
      if (p.type==="cover") return { ...p, photoPath:null };
      const si = storyPages.findIndex(s=>s.pageNumber===p.pageNumber);
      return { ...p, photoPath: processedPhotos[si%processedPhotos.length] };
    });

    const html = generateStoryHTML({ babyName, parentName:parentName||"Mommy & Daddy", pages:mappedPages });
    console.log(`HTML: ${Math.round(html.length/1024)}KB`);

    browser = await puppeteer.launch({ args:chromium.args, defaultViewport:chromium.defaultViewport, executablePath:await chromium.executablePath(), headless:chromium.headless });
    const page = await browser.newPage();
    await page.setContent(html,{ waitUntil:"domcontentloaded", timeout:120000 });
    await new Promise(r=>setTimeout(r,800));

    const pdfFilename = `${babyName.replace(/\s+/g,"-").toLowerCase()}-storybook-${Date.now()}.pdf`;
    const pdfPath     = path.join(__dirname,"../generated-pdfs",pdfFilename);
    await page.pdf({ path:pdfPath, format:"A4", printBackground:true, margin:{top:"0",right:"0",bottom:"0",left:"0"} });
    console.log(`PDF: ${pdfFilename}`);
    await browser.close(); browser=null;

    const sb = await Storybook.create({ user:userId, babyName, parentName, photos:photos.map(p=>p.path), pdfFile:pdfFilename, amountPaid:amountPaid||0, paymentId, orderId, status:"generated" });
    await User.findByIdAndUpdate(userId,{ $inc:{totalOrders:1} });

    photos.forEach(p => { const fp=path.join(__dirname,"../uploads",p.filename); if(fs.existsSync(fp)) fs.unlinkSync(fp); });
    delete uploadedPhotosStore[sessionId];

    // Build URLs with token appended — so browser can open them directly
    const token   = req.headers.authorization?.split(" ")[1] || "";
    const baseUrl = `https://${req.get("host")}`;
    res.json({
      success:true, message:"Storybook generated successfully!", filename:pdfFilename, storybookId:sb._id,
      previewUrl:  `${baseUrl}/api/storybook/preview/${pdfFilename}?token=${token}`,
      downloadUrl: `${baseUrl}/api/storybook/download/${pdfFilename}?token=${token}`,
    });
  } catch (err) {
    console.error("generateStorybook:", err);
    if (browser) await browser.close();
    res.status(500).json({ success:false, message:"Failed to generate storybook", error:err.message });
  }
};

/* ── MY STORYBOOKS ───────────────────────────────────── */
const getMyStorybooks = async (req, res) => {
  try {
    const token      = req.headers.authorization?.split(" ")[1] || "";
    const baseUrl    = `https://${req.get("host")}`;
    const storybooks = await Storybook.find({ user:req.user._id }).sort({ createdAt:-1 });
    const result     = storybooks.map(sb => ({
      ...sb.toObject(),
      previewUrl:  sb.pdfFile ? `${baseUrl}/api/storybook/preview/${sb.pdfFile}?token=${token}` : null,
      downloadUrl: sb.pdfFile ? `${baseUrl}/api/storybook/download/${sb.pdfFile}?token=${token}` : null,
    }));
    res.json({ success:true, storybooks:result });
  } catch (err) { res.status(500).json({ success:false, message:"Failed to get storybooks" }); }
};

/* ── PREVIEW / DOWNLOAD (auth via header OR ?token=) ── */
const previewPdf = (req, res) => {
  try {
    const filePath = path.join(__dirname,"../generated-pdfs",req.params.filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ success:false, message:"PDF not found" });
    res.setHeader("Content-Type","application/pdf");
    res.setHeader("Content-Disposition","inline");
    res.setHeader("Access-Control-Allow-Origin","*");
    res.sendFile(filePath);
  } catch (err) { res.status(500).json({ success:false, message:"Failed to preview PDF" }); }
};

const downloadPdf = (req, res) => {
  try {
    const filePath = path.join(__dirname,"../generated-pdfs",req.params.filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ success:false, message:"PDF not found" });
    res.download(filePath, req.params.filename);
  } catch (err) { res.status(500).json({ success:false, message:"Failed to download PDF" }); }
};

module.exports = { uploadPhotos, generateStorybook, getMyStorybooks, previewPdf, downloadPdf };