import { join } from "path";
import multer from "multer";
import { existsSync, mkdirSync } from "fs";

let multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file);
    let userName = req.userDetail.UserName;
    let folder_type = req.body.folder_type;
    let userFolder = join("uploads", userName);
    let uploadFolder = join(userFolder, folder_type);
    if (!existsSync(userFolder)) {
      mkdirSync(userFolder, { recursive: true });
    }

    // Ensure the upload folder exists
    if (!existsSync(uploadFolder)) {
      mkdirSync(uploadFolder, { recursive: true });
    }
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    let timeStamp = Date.now();
    let fileName = `${file.fieldname}_${timeStamp}_${file.originalname}`;
    cb(null, fileName);
  },
});

export let multerUpload = multer({
  storage: multerStorage,
});
