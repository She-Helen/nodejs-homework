const { serializeUser } = require("./user.serializer");
const { UserModel } = require('./user.model');
const { Conflict } = require("../helpers/errors");
const { deleteOldAvatar } = require("../helpers/avatarGenerate");

exports.getCurrentUser = (req, res, next) => {
  res.status(200).send(serializeUser(req.user));
};

exports.updateUserSubsc = async (req, res, next) => {
  try {
      const { _id } = req.user;
      const { subscription } = req.body;
      const subscTypes = UserModel.schema.tree.subscription.enum;
      if (!subscTypes.includes(subscription)) { 
        throw new Conflict('Subscription type is not allowed'); 
      };
      const updatedUser = await UserModel.findByIdAndUpdate(_id, {subscription}, { new: true });
      return res.status(200).send(serializeUser(updatedUser));
  } catch (error) {
      next(error);
  }
};

exports.updateUserAvatar = async (req, res, next) => {
  try {
      const { _id, avatarURL } = req.user;
      const baseAvatarURL = 'http://localhost:3000/images/';
      const { filename } = req.file;
      const newAvatarURL = baseAvatarURL+filename;
      const updatedUser = await UserModel.findByIdAndUpdate(_id, {avatarURL: newAvatarURL}, { new: true });
      const oldAvatarName = avatarURL.replace(baseAvatarURL, '');
      await deleteOldAvatar(oldAvatarName);
      return res.status(200).send({avatarURL: updatedUser.avatarURL});
  } catch (error) {
      next(error);
  }
}