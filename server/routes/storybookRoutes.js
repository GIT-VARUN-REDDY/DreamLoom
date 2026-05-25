const express = require("express");
const router  = express.Router();
const multer  = require("multer");
const { authMiddleware } = require("../middleware/auth");
const { uploadPhotos, generateStorybook, getMyStorybooks, previewPdf, downloadPdf } = require("../controllers/storybookController");

const storage = multer.diskStorage({
  destination: (req,file,cb) => cb(null,"uploads/"),
  filename:    (req,file,cb) => cb(null,`${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.post("/upload",            authMiddleware, upload.array("photos",10), uploadPhotos);
router.post("/generate",          authMiddleware, generateStorybook);
router.get("/my-storybooks",      authMiddleware, getMyStorybooks);
// preview & download accept ?token= so they work as direct browser links
router.get("/preview/:filename",  authMiddleware, previewPdf);
router.get("/download/:filename", authMiddleware, downloadPdf);

module.exports = router;