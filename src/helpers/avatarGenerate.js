const Avatar = require('avatar-builder');
const fs = require('fs');
const multer = require("multer");
const { nanoid } = require('nanoid');
const path = require('path');

exports.avatarGenerate = async () => {
    const name = nanoid();
    const avatarsPath = path.join(__dirname, "../../tmp/");
    const avatarName = `${name}.png`
    const avatar = Avatar.builder(Avatar.Image.margin(Avatar.Image.circleMask(Avatar.Image.identicon())),128,128, {cache: Avatar.Cache.lru()});
    const buffer = await avatar.create(name);
    await fs.writeFile(avatarsPath+avatarName, buffer, err => {
        if (err)  throw err 
    });
    
    return avatarName
}

const STATIC_FILES_PATH = path.join(__dirname, "../../public/images");
const storage = multer.diskStorage({
    destination: STATIC_FILES_PATH,
    filename: (req, file, cb) => { 
        const ext = path.parse(file.originalname).ext;
        cb(null, nanoid() + ext);
    },
});

const upload = multer({ storage });

exports.avatarUpload = upload.single('avatar');

exports.deleteOldAvatar = async(avatarName) => {
    const src = path.join(__dirname, (`../../public/images/${avatarName}`));
    await fs.promises.unlink(src);
}