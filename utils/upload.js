import multer from "multer";

const storage = multer.diskStorage({
    destination: function (res, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

export default upload;