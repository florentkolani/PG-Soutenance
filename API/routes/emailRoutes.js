const express = require("express");
const { sendBulkEmail, getSentEmails } = require("../controllers/emailController");
const { protect } = require("../middleware/authMiddleware");
const Email = require("../models/emailModel");

const router = express.Router();

router.post("/send", protect, sendBulkEmail);

router.get("/sent", protect, getSentEmails);

module.exports = router;
