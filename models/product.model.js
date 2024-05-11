const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  _id: {
    type: String,
    //required: true,
  },
  // category_id: {
  //   type: String,
  //   required: true,
  // },
  available: {
    type: Boolean,
    // required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  colors: [String], // Assuming color is an array of strings
  sizes: [String], // Assuming size is an array of strings
  price: {
    original: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      
    },
    price: {
      type: Number,
      
    },
  },
  description: String,
  reviews: [String], // Assuming reviews is an array of strings
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    
  },
});

mongoose.model('Product', ProductSchema)