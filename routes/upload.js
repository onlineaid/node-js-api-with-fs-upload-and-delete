const router = require('express').Router()
const uploadCtrl = require('../controller/uploadCtrl')
// const auth = require('../middleware/auth')
const upload = require('../middleware/upload')

router.post('/upload_avatar', upload.single('img'), uploadCtrl.uploadAvatar)

module.exports = router;