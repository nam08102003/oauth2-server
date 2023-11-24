var express = require("express");
var router = express.Router();
const UserModel = require("../models").User;
const { authenticate, authorize, token } = require("../oauth2.service");

router.post("/token", token);
router.get("/authenticate", authenticate, async (req, res) => {
  const { userId } = req.auth;
  if (!userId) {
    return res.status(401).json("Unauthorize");
  }

  const user = await UserModel.findByPk(userId);
  if (!user) {
    return res.status(401).json("Unauthorize");
  }

  delete user.dataValues.password;
  return res.status(200).json({
    data: user.dataValues,
  });
});

module.exports = router;
