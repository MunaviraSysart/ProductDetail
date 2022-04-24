const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
   name: {
       type: String,
       required: true
   },
   description: {
       type: String,
       required: true
   },
   price: {
       type: Number,
       required: true
   },
   productImage: {
       type: Array,
       required: true
   },
   barcodeDetails: {
       type: Object,
       required: true
   }
})

module.exports = mongoose.model('product', ProductSchema);