const express = require("express");
const router = express.Router();
const { chatWithDeepSeek } = require("../controllers/openRouterController");

router.post("/", chatWithDeepSeek);

module.exports = router;
