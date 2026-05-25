const User      = require("../models/User");
const Storybook = require("../models/Storybook");
const path      = require("path");
const fs        = require("fs");
const jwt       = require("jsonwebtoken");

const getStats = async (req, res) => {
  try {
    const totalUsers      = await User.countDocuments({ role:"user" });
    const totalStorybooks = await Storybook.countDocuments();
    const paidStorybooks  = await Storybook.countDocuments({ status:{$in:["paid","generated"]} });
    const firstThirtyUsed = await User.countDocuments({ isFirstThirty:true });
    const discountUsed    = await User.countDocuments({ discountUsed:true });
    const weekAgo         = new Date(Date.now()-7*24*60*60*1000);
    const recentSignups   = await User.countDocuments({ createdAt:{$gte:weekAgo}, role:"user" });
    const rev             = await Storybook.aggregate([{ $match:{status:{$in:["paid","generated"]}} },{ $group:{_id:null,total:{$sum:"$amountPaid"}} }]);

    res.json({ success:true, stats:{
      totalUsers, totalStorybooks, paidStorybooks, firstThirtyUsed, discountUsed,
      totalRevenue: ((rev[0]?.total||0)/100).toFixed(2),
      recentSignups, offersRemaining: Math.max(0,30-firstThirtyUsed),
    }});
  } catch (err) { res.status(500).json({ success:false, message:"Failed to get stats" }); }
};

const getAllUsers = async (req, res) => {
  try {
    const page=parseInt(req.query.page)||1, limit=20, skip=(page-1)*limit;
    const users = await User.find({ role:"user" }).sort({ createdAt:-1 }).skip(skip).limit(limit).select("-__v");
    const total = await User.countDocuments({ role:"user" });
    res.json({ success:true, users, total, page, pages:Math.ceil(total/limit) });
  } catch (err) { res.status(500).json({ success:false, message:"Failed to get users" }); }
};

const getAllStorybooks = async (req, res) => {
  try {
    const page=parseInt(req.query.page)||1, limit=20, skip=(page-1)*limit;
    const storybooks = await Storybook.find().populate("user","mobile name email").sort({ createdAt:-1 }).skip(skip).limit(limit).select("-__v");
    const total = await Storybook.countDocuments();
    res.json({ success:true, storybooks, total, page, pages:Math.ceil(total/limit) });
  } catch (err) { res.status(500).json({ success:false, message:"Failed to get storybooks" }); }
};

const getUserStorybooks = async (req, res) => {
  try {
    const storybooks = await Storybook.find({ user:req.params.userId }).sort({ createdAt:-1 });
    res.json({ success:true, storybooks });
  } catch (err) { res.status(500).json({ success:false, message:"Failed to get user storybooks" }); }
};

// Admin PDF access — token via query param
const adminPreviewPdf = (req, res) => {
  try {
    const filePath = path.join(__dirname,"../../generated-pdfs",req.params.filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ success:false, message:"PDF not found" });
    res.setHeader("Content-Type","application/pdf");
    res.setHeader("Content-Disposition","inline");
    res.setHeader("Access-Control-Allow-Origin","*");
    res.sendFile(filePath);
  } catch (err) { res.status(500).json({ success:false, message:"Failed to preview PDF" }); }
};

const adminDownloadPdf = (req, res) => {
  try {
    const filePath = path.join(__dirname,"../../generated-pdfs",req.params.filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ success:false, message:"PDF not found" });
    res.download(filePath, req.params.filename);
  } catch (err) { res.status(500).json({ success:false, message:"Failed to download PDF" }); }
};

module.exports = { getStats, getAllUsers, getAllStorybooks, getUserStorybooks, adminPreviewPdf, adminDownloadPdf };