const router = require('express').Router();
const useCtrl = require('../controller/userCtrl')
const auth = require('../middleware/auth')
const admin = require('../middleware/authAdmin')
const upload = require('../middleware/upload')

// const {deleteUser} = require('../controller/userDeleteCtrl')


router.post('/register', upload.single('avatar'), useCtrl.register)

router.post('/activation', useCtrl.activateEmail)
router.post('/login', useCtrl.login)
router.post('/refreshtoken', useCtrl.getAccessToken)
router.post('/forgot', useCtrl.forgotPassword)
router.post('/reset', auth, useCtrl.resetPassword)

router.get('/userinfo', auth, useCtrl.getUserInfo)
router.get('/alluserinfo', auth, admin, useCtrl.getAllUserInfo)

router.get('/logout', useCtrl.logout)

router.patch('/updateuser', auth, useCtrl.updateUser)
router.patch('/updateuserrole/:id', auth, admin, useCtrl.updateUserRole)

router.delete('/delete/:id', auth, admin, useCtrl.deleteUser)


// router.get('/delete/:id', deleteUser)


module.exports = router;