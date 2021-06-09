import mongoose from 'mongoose';

const cateSchema = mongoose.Schema({
    name: {
        type: String,
        strim: true,
        maxLength: 255,
        required: true
    },
    photo: {
        data: Buffer,
        contentType: String
    }
}, { timeStamps: true })

module.exports = mongoose.model('Category', cateSchema)