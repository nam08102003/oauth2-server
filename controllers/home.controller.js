const ClientModel = require("../models").Client;

module.exports = {
  index: async (req, res) => {
    try {
      const user = JSON.parse(req.cookies["user"]);
      const listApp = await ClientModel.findAll({ where: { userId: user.id } });

      res.render("index", { listApp });
    } catch (e) {
      console.log(e);
    }
  },
};
