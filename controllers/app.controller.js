const ClientModel = require("../models").Client;
const sha1 = require("sha1");
const md5 = require("md5");

module.exports = {
  createApp: async (req, res) => {
    try {
      const { name } = req.body;
      const user = JSON.parse(req.cookies["user"]);
      const clientId = sha1(new Date().getTime() + Math.random());
      const newApp = await ClientModel.create({
        name,
        userId: user.id,
        clientId,
      });
      if (!newApp) {
        req.flash("msg", "Có lỗi. Vui lòng thử lại sau ít phút.");
        return res.render("index");
      }
      res.redirect(`/app/${newApp.id}`);
    } catch (e) {
      console.log(e);
    }
  },

  showInfoApp: async (req, res) => {
    try {
      const { appId } = req.params;
      if (!appId) {
        return res.render("index");
      }

      const app = await ClientModel.findByPk(appId);
      if (!app) {
        req.flash("msg", "Ứng dụng không tồn tại");
        return res.render("index");
      }
      res.render("app/info", {
        id: app.dataValues.id,
        name: app.dataValues.name,
        clientId: app.dataValues.clientId,
        callbackUrl: app.dataValues.callbackUrl,
        clientSecret: app.dataValues.clientSecret,
      });
    } catch (e) {
      console.log(e);
    }
  },

  createClientSecret: async (req, res) => {
    try {
      const { appId } = req.params;
      if (!appId) {
        return res.render("index");
      }
      const app = await ClientModel.findByPk(appId);
      if (!app) {
        req.flash("msg", "Ứng dụng không tồn tại");
        return res.render("index");
      }
      const clientSecret = md5(new Date().getTime() + Math.random());
      await ClientModel.update(
        {
          clientSecret,
        },
        { where: { id: appId } }
      );

      res.redirect(`/app/${appId}`);
    } catch (e) {
      console.log(e);
    }
  },
  saveCallbackUrl: async (req, res) => {
    try {
      const { callbackUrl } = req.body;
      const { appId } = req.params;
      if (!appId) {
        return res.render("index");
      }
      const app = await ClientModel.findByPk(appId);
      if (!app) {
        req.flash("msg", "Ứng dụng không tồn tại");
        return res.render("index");
      }

      await ClientModel.update(
        {
          callbackUrl,
        },
        { where: { id: appId } }
      );

      res.redirect(`/app/${appId}`);
    } catch (e) {
      console.log(e);
    }
  },
};
