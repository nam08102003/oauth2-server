const oauthModel = require("./oauth2.model");
const model = require("./models");
const OAuth2Server = require("oauth2-server");

const ClientModel = model.Client;
const UserModel = model.User;

const oauth2 = new OAuth2Server({
  model: oauthModel,
  grants: ["authorization_code"],
});

const authorize = async (req, res) => {
  const request = new OAuth2Server.Request(req);
  const response = new OAuth2Server.Response(res);

  return oauth2
    .authorize(request, response, {
      authenticateHandler: {
        handle: async () => {
          const { client_id, redirect_uri, response_type, state } = req.query;
          console.log(redirect_uri);
          if (!client_id) {
            throw new Error("Client ID không được tìm thấy");
          }
          if (!redirect_uri) {
            throw new Error("Redirect Url không được tìm thấy");
          }
          if (!state) {
            throw new Error("Vui lòng truyền state lên url");
          }
          if (!response_type || response_type !== "code") {
            throw new Error("Vui lòng truyền response_type là code");
          }
          const client = await ClientModel.findOne({
            where: { clientId: client_id },
          });
          if (!client) throw new Error("Client không được tìm thấy");
          if (client.dataValues.callbackUrl !== redirect_uri) {
            throw new Error("Yêu cầu bị từ chối");
          }

          const { userId } = req.auth;
          if (!client.dataValues.userId && !userId) return {};

          const user = await UserModel.findByPk(userId);
          if (!user) throw new Error("User không tồn tại");

          return { id: user.dataValues.id };
        },
      },
    })
    .then((result) => {
      const urlRedirect =
        req.query.redirect_uri + `?code=${result.authorizationCode}`;
      res.redirect(urlRedirect);
    })
    .catch((err) => {
      console.log("err", err);
      res
        .status(err.code || 500)
        .json(err instanceof Error ? { error: err.message } : err);
    });
};

const authenticate = (req, res, next) => {
  const request = new OAuth2Server.Request(req);
  const response = new OAuth2Server.Response(res);
  return oauth2
    .authenticate(request, response)
    .then((data) => {
      req.auth = { userId: data?.user?.id };
      next();
    })
    .catch((err) => {
      console.log("err", err);
      res
        .status(err.code || 500)
        .json(err instanceof Error ? { error: err.message } : err);
    });
};

const token = (req, res) => {
  const request = new OAuth2Server.Request(req);
  const response = new OAuth2Server.Response(res);
  return oauth2
    .token(request, response, { alwaysIssueNewRefreshToken: false })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log("err", err);
      res
        .status(err.code || 500)
        .json(err instanceof Error ? { error: err.message } : err);
    });
};

module.exports = {
  authenticate,
  authorize,
  token,
};
