const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { promises: fsPromises } = require("fs");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, './.env') });
const { UserModel } = require('../users/user.model.js');
const { Conflict, Unauthorized } = require('../helpers/errors');
const { avatarGenerate } = require('../helpers/avatarGenerate.js');

exports.registerUser = async (req, res, next) => {

        const {email, password} = req.body;
        const existUser = await UserModel.findOne({email});
        if (existUser) {
            throw new Conflict("Email in use");
        }
        const passwordHash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
        
        const avatarName = await avatarGenerate();
        const src = path.join(__dirname, (`../../tmp/${avatarName}`));
        const dest = path.join(__dirname, (`../../public/images/${avatarName}`));
        await fsPromises.copyFile(src, dest, (err) => {
          if (err) throw err;
        });
        await fsPromises.unlink(src);

        const avatarURL = `http://localhost:${process.env.PORT}/images/${avatarName}`
        const user = await UserModel.create({email, passwordHash, avatarURL});
        return res.status(201).send({user: {email, subscription: user.subscription, avatarURL}});

};

exports.loginUser = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const existUser = await UserModel.findOne({email});
        if (!existUser) {
            throw new Unauthorized("Email is wrong");
        }
        const isPasswordValid = await bcrypt.compare(password, existUser.passwordHash);
        if (!isPasswordValid) {
          throw new Unauthorized("Password is wrong");
        }
        const token = jwt.sign({ userId: existUser._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
          });
          await UserModel.findByIdAndUpdate(existUser._id,  {token} );
        return res.status(200).send({token, user: {email, subscription: existUser.subscription, avatarURL: existUser.avatarURL}});
    }
    catch (err) {
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