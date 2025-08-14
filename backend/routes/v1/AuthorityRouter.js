const {getAuthorities} = require("../../controllers/v1/AuthorityController");
const {verifyToken, verifyOfficialToken} = require("../../middleware/verifyToken");
const express = require("express");
const router = express.Router();


router.get("/get-authorities-by-user", verifyToken, getAuthorities);
router.get("/get-authorities-by-official", verifyOfficialToken, getAuthorities);

module.exports = router;
