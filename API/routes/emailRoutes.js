const express = require("express");
const { sendBulkEmail } = require("../controllers/emailController");
const { protect } = require("../middleware/authMiddleware");
const Email = require("../models/emailModel");

const router = express.Router();

router.post("/send", protect, sendBulkEmail);

router.get("/sent", protect, async (req, res) => {
  try {
    const emails = await Email.find({ sender: req.user.email })
      .select("senderName recipients subject message sentAt") // Include senderName
      .sort({ sentAt: -1 });
    res.status(200).json({ emails });
  } catch (error) {
    console.error("Erreur lors de la récupération des emails envoyés :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des emails." });
  }
});

module.exports = router;
