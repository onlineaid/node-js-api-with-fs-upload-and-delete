const mongoose = require('mongoose')

const productScheme = new mongoose.Schema({
    title : {
        type: String,
        required: [true, 'Plz give a title']
    },

    image: {
        type: String,
        default: ''
    },
    img: [{
        type: String,
    }],


    images: [{

        type: String
        // url:{
        //     type: String
        // }
    }]
    
}, {
    timestamps: true
})

module.exports = mongoose.model('Product', productScheme)