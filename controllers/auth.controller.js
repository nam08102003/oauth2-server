const UserModel = require("../models").User;
const bcrypt = require("bcrypt");

module.exports = {
  handleLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const checkEmail = await UserModel.findOne({ where: { email } });
      if (!checkEmail) {
        console.log("Vào đây");
        req.flash("msg", "Tài khoản không tồn tại.");
        res.render("auth/login");
        return;
      }

      const checkPassword = bcrypt.compareSync(
        password,
        checkEmail.dataValues.password
      );
      if (!checkPassword) {
        req.flash("msg", "Tài khoản hoặc mật khẩu không chính xác.");
        res.render("auth/login");
        return;
      }

      const data = {
        id: checkEmail.dataValues.id,
        fullName: checkEmail.dataValues.fullName,
      };
      res.cookie("user", JSON.stringify(data), {
        maxAge: 900000,
        httpOnly: true,
      });
      if (req.query.client_id && req.query.redirect_uri) {
        console.log(req.query.client_id);
        const dataQuery = new URLSearchParams(req.query).toString();
        return res.redirect(`/redirect?${dataQuery}`);
      }

      return res.redirect("/");
    } catch (e) {
      console.log(e);
    }
  },
  handleRegister: async (req, res) => {
    try {
      const { email, password, fullName } = req.body;
      const checkEmail = await UserModel.findOne({ where: { email } });
      if (checkEmail) {
        console.log("Vào đây");
        req.flash("msg", "Tài khoản đã tồn tại.");
        res.render("auth/register");
        return;
      }
      const salt = 10;
      const hasPassword = bcrypt.hashSync(password, salt);
      const newUser = await UserModel.create({
        email,
        password: hasPassword,
        fullName,
      });
      if (!newUser) {
        req.flash("msg", "Có lỗi. Vui lòng thử lại sau ít phút");
        res.render("auth/register");
        return;
      }

      req.flash("msg", "Đăng ký tài khoản thành công");
      res.render("auth/register");
      return;
    } catch (e) {
      console.log(e);
    }
  },
};
