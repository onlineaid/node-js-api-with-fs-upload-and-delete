const router = require('express').Router();
const proCtrl = require('../controller/proCtrl');
const upload = require('../middleware/upload')


router.post('/product', upload.single('image'), proCtrl.createProduct)
router.post('/product/multi', upload.array('images', 3), proCtrl.uploadMultiProduct)
router.put('/product/multi/:id',upload.array('images', 3), proCtrl.updateMultiProduct)
router.delete('/product/multi/:id', proCtrl.delMultiProduct)
router.delete('/product/del/:id', proCtrl.deleteProduct)
router.get('/product',  proCtrl.getProduct)
router.delete('/productDel',  proCtrl.delAllProduct)


module.exports = router;
