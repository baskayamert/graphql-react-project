const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    name: String,
    productId: String,
    height: Number,
    width: Number
});

module.exports = mongoose.model('Image', imageSchema);