const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, './.env') });
const { UserModel } = require('../users/user.model.js');
const { Conflict, Unauthorized } = require('../helpers/errors');

exports.registerUser = async (req, res, next) => {

        const {email, password} = req.body;
        const existUser = await UserModel.findOne({email});
        if (existUser) {
            throw new Conflict("Email in use");
        }
        const passwordHash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
        const user = await UserModel.create({email, passwordHash});
        return res.status(201).send({user: {email, subscription: user.subscription}});

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
        return res.status(200).send({token, user: {email, subscription: existUser.subscription}});
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