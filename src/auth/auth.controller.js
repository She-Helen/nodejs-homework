const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { promises: fsPromises } = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "./.env") });
const uuid = require("uuid");
const { UserModel } = require("../users/user.model");
const { Conflict, Unauthorized, NotFound } = require("../helpers/errors");
const { avatarGenerate } = require("../helpers/avatarGenerate");
const { sendVerificationEmail } = require("../helpers/emailing.client");

exports.registerUser = async (req, res, next) => {
  const { email, password } = req.body;
  const existUser = await UserModel.findOne({ email });
  if (existUser) {
    throw new Conflict("Email in use");
  }
  const passwordHash = await bcrypt.hash(
    password,
    Number(process.env.SALT_ROUNDS)
  );

  const avatarName = await avatarGenerate();
  const src = path.join(__dirname, `../../tmp/${avatarName}`);
  const dest = path.join(__dirname, `../../public/images/${avatarName}`);
  await fsPromises.copyFile(src, dest, (err) => {
    if (err) throw err;
  });
  await fsPromises.unlink(src);
  const avatarURL = `http://localhost:${process.env.PORT}/images/${avatarName}`;

  const user = await UserModel.create({
    email,
    passwordHash,
    avatarURL,
    verificationToken: uuid.v4(),
  });

  await sendVerificationEmail(user);
  return res
    .status(201)
    .send({ user: { email, subscription: user.subscription, avatarURL } });
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existUser = await UserModel.findOne({ email });
    if (!existUser) {
      throw new Unauthorized("Email is wrong");
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existUser.passwordHash
    );
    if (!isPasswordValid) {
      throw new Unauthorized("Password is wrong");
    }
    if (existUser.verificationToken) {
      throw new Unauthorized("Please verify your account");
    }

    const token = jwt.sign({ userId: existUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    await UserModel.findByIdAndUpdate(existUser._id, { token });
    return res.status(200).send({
      token,
      user: {
        email,
        subscription: existUser.subscription,
        avatarURL: existUser.avatarURL,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  const { user, token } = req;

  await UserModel.updateOne(
    { _id: user._id },
    {
      $pull: { tokens: token },
    }
  );
  return res.status(204).send();
};

exports.verifyUser = async (req, res, next) => {
  const { verificationToken } = req.params;

  const user = await UserModel.findOne({ verificationToken });
  if (!user) {
    throw new NotFound("Not found. You have already verified your email!");
  }
  await UserModel.updateOne({ _id: user._id }, { verificationToken: null });

  return res.status(200).send("Email successfully verified!");
};
