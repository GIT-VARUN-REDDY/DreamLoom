const express = require("express");
const router  = express.Router();
const { adminMiddleware } = require("../middleware/auth");
const { getStats, getAllUsers, getAllStorybooks, getUserStorybooks, adminPreviewPdf, adminDownloadPdf } = require("../controllers/adminController");

router.get("/stats",                     adminMiddleware, getStats);
router.get("/users",                     adminMiddleware, getAllUsers);
router.get("/storybooks",                adminMiddleware, getAllStorybooks);
router.get("/users/:userId/storybooks",  adminMiddleware, getUserStorybooks);
// Admin PDF — token via ?token= query param
router.get("/pdf/preview/:filename",     adminMiddleware, adminPreviewPdf);
router.get("/pdf/download/:filename",    adminMiddleware, adminDownloadPdf);

module.exports = router;