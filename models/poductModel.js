const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true

  },
  name: {
    type: String,
    required: true

  },
  description: {
    type: String,
    required: true
  },
  thumbnailImage: {
    type: String

  },
  image: {
    type: [String],
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    required: true

  },
  stock: {
    type: Number,
    required: true
  }

})

const Product = mongoose.model('Product', productSchema)

module.exports = Product
