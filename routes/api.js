var express = require("express");
var router = express.Router();
const { authenticate, authorize, token } = require("../oauth2.service");

router.post("/token", token);
router.get("/authenticate", authenticate);

module.exports = router;
