import mongoose from 'mongoose';

const {ObjectId} = mongoose.Schema;
const productSchema = mongoose.Schema({
    name: {
        type: String,
        strim: true,
        maxLength: 255,
        required: true
    },
    description: {
        type: String,
        required: true,
        maxLength: 2000
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: ObjectId,
        ref: 'Category',
        required: true
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    quantity: {
        type: Number,
    },
    status: {
        type: String,
    },
    shipping: {
        
        type: Boolean,
    },
    sold: {
        type: Number,
        default: 0,
    },
    status:{
        type: Number,
    }
}, { timeStamps: true });

module.exports = mongoose.model('Product', productSchema)