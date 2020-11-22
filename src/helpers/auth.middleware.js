const jwt = require("jsonwebtoken");
const { UserModel } = require("../users/user.model");
const { asyncWrapper } = require("./async-wrapper");
const { Unauthorized } = require("./errors");

exports.authorize = asyncWrapper(async (req, res, next) => {
  const authHeader = req.get("Authorization") || "";
  const token = authHeader.replace("Bearer ", "");

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Unauthorized("Not authorized");
  }

  const user = await UserModel.findOne({
    _id: payload.userId,
    token: token,
  });
  if (!user) {
    throw new Unauthorized("Not authorized");
  }
  req.user = user;
  req.token = token;
  next();
});