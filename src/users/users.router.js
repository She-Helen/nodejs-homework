const { Router } = require("express");
const { authorize } = require("../helpers/auth.middleware");
const { avatarUpload } = require("../helpers/avatarGenerate");
const { getCurrentUser, updateUserSubsc, updateUserAvatar } = require("./users.controller");

const router = Router();

router.get("/current", authorize, getCurrentUser);
router.patch('/', authorize, updateUserSubsc);
router.patch('/avatars', authorize, avatarUpload, updateUserAvatar);

exports.usersRouter = router;