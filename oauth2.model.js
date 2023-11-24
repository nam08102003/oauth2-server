const ClientModel = require("./models/index").Client;
const AuthorizeModel = require("./models/index").Authorizes;
const AuthorizeTokenModel = require("./models/index").AuthorizeToken;

async function getClient(clientId, clientSecret) {
  const client = await ClientModel.findOne({
    where: { clientId, ...(clientSecret && { clientSecret }) },
  });
  if (!client) throw new Error("Client không tồn tại");
  return {
    id: client.dataValues.clientId,
    grants: ["authorization_code"],
    redirectUris: [client.dataValues.callbackUrl],
  };
}

/**
 * Save authorization code.
 */
async function saveAuthorizationCode(code, client, user) {
  const authorizationCode = {
    authorizationCode: code.authorizationCode,
    expiresAt: code.expiresAt,
    clientId: client.id,
    userId: user.id,
  };

  await AuthorizeModel.create({
    ...authorizationCode,
    code: authorizationCode.authorizationCode,
  });

  return authorizationCode;
}

/**
 * Get authorization code.
 */
async function getAuthorizationCode(authorizationCode) {
  //   const code = await OAuthAuthorizationCodesModel.findOne({
  //     authorizationCode,
  //   }).lean();
  const code = await AuthorizeModel.findOne({
    where: { code: authorizationCode },
  });
  if (!code) throw new Error("Authorization code không tồn tại");

  return {
    code: code.dataValues.code,
    expiresAt: code.dataValues.expiresAt,
    client: { id: code.dataValues.clientId },
    user: { id: code.dataValues.userId },
  };
}

/**
 * Revoke authorization code.
 */
async function revokeAuthorizationCode({ code }) {
  return await AuthorizeModel.destroy({
    where: {
      code,
    },
  });
}

/**
 * Revoke a refresh token.
 */
// async function revokeToken({ refreshToken }) {
//   const res = await OAuthAccessTokensModel.deleteOne({ refreshToken });
//   return res.deletedCount === 1;
// }

/**
 * Save token.
 */
async function saveToken(token, client, user) {
  await AuthorizeTokenModel.create({
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    clientId: client.id,
    userId: user.id,
  });

  return {
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    client: { id: client.id },
    user: { id: user.id },
  };
}

/**
 * Get access token.
 */
async function getAccessToken(accessToken) {
  const token = await AuthorizeTokenModel.findOne({ where: { accessToken } });
  if (!token) throw new Error("Access token không tồn tại");
  return {
    accessToken: token.dataValues.accessToken,
    accessTokenExpiresAt: token.dataValues.accessTokenExpiresAt,
    client: { id: token.dataValues.clientId },
    user: { id: token.dataValues.userId },
  };
}

/**
 * Get refresh token.
 */
// async function getRefreshToken(refreshToken) {
//   const token = await OAuthRefreshTokensModel.findOne({ refreshToken }).lean();
//   if (!token) throw new Error("Refresh token not found");

//   return {
//     refreshToken: token.refreshToken,
//     // refreshTokenExpiresAt: token.refreshTokenExpiresAt, // never expires
//     scope: token.scope,
//     client: { id: token.clientId },
//     user: { id: token.userId },
//   };
// }

module.exports = {
  getAccessToken,
  getClient,
  getAuthorizationCode,
  //   getRefreshToken,
  saveAuthorizationCode,
  saveToken,
  revokeAuthorizationCode,
};
