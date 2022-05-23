const fs = require('fs')



const uploadCtrl = {
    uploadAvatar: (req, res) => {
        try {
            const file = req.file;
            if(!file) return res.status(400).send('No image in the request')
            const fileName = file.filename
            const basePath = `${req.protocol}://${req.get('host')}/upload/`;
            res.status(200).json({
                success: true,
                msg: 'img uplode',
                image: `${basePath}${fileName}`
            })
            
            console.log(req.file);
            console.log(req.file.path);
        
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteAvatar: (req, res) => {
        try {

            
        } catch (err) {
            return res.status(500).json({msg: err.message})
            
        }
    }

}

module.exports = uploadCtrl