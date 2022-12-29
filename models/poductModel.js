const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    brand:{
        type: String,
        required: true,

    },
    name:{
        type: String,
        required: true,

    },
    description:{
        type: String,
        required: true
    },
    images: {
type: [String],

    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        refer: 'Category',
        required: true
    },
    price:{
type: Number,
required: true
    },
    discount: {
type: String,
required: true

    },
    stock: {
        type: Number,
        required: true
    }
    

})

const Product = mongoose.model('Product', productSchema);
 

module.exports = Product;