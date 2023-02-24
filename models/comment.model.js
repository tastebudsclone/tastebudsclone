const mongoose = require('mongoose')

const schema = new mongoose.Schema(
    {
        message: {
            type: String,
            required: [ true, "Message is required"],
            maxLength: [ 150, "Maximum length is 150 characters."]
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            require: [true, "User is required"]
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            require: [true, "User is required"]
        },
        likes: {
            type: Number, default: 0 
        }
    }, {timestamps: true}
)

 
module.exports = mongoose.model('Comment', schema);