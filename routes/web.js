var express = require("express");
var router = express.Router();
const authController = require("../controllers/auth.controller");
const appController = require("../controllers/app.controller");
const homeController = require("../controllers/home.controller");
const checkAuthMiddleware = require("../middlewares/checkAuth");
const { authenticate, authorize, token } = require("../oauth2.service");

/* GET home page. */

router.get("/auth/login", function (req, res) {
  res.render("auth/login");
});

router.post("/auth/login", authController.handleLogin);

router.get(
  "/redirect",
  function (req, res, next) {
    const user = JSON.parse(req.cookies["user"]);
    req.auth = { userId: user.id };
    next();
  },
  authorize
);

router.get("/auth/register", function (req, res) {
  res.render("auth/register");
});

router.post("/auth/register", authController.handleRegister);
router.get("/auth/logout", function (req, res) {
  res.clearCookie("user");
  res.redirect("/auth/login");
});

router.use(checkAuthMiddleware);

router.get("/", homeController.index);

router.get("/create-app", (req, res) => {
  res.render("app/create");
});

router.get("/app/:appId", appController.showInfoApp);
router.post("/app/:appId", appController.saveCallbackUrl);
router.get("/app/:appId/client-secret", appController.createClientSecret);

router.post("/create-app", appController.createApp);

module.exports = router;
