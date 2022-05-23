const multer = require('multer')
const path = require('path')

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if(isValid) {
            uploadError = null
        }
      cb(uploadError, 'upload')
    },
    filename: function (req, file, cb) {
      cb(null, 'online' + '-' + Date.now() + path.extname(file.originalname))

    }
})


const upload = multer({ storage: storage,
  limits: { fieldSize: 10 * 1024 * 1024 },
   // 1mb
  fileFilter: (req,  file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      // return res.status(400).json({msg: "Size too large."})

      let err = cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      return err;
    }
  }
})


module.exports = upload;



