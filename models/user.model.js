const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const schema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minLength: [6, "Minimum length is: 6"]
        },
        about: {
            type: String,
            maxLength: [200, "Maximun length is: 200"]
        }
    },
    { timestamps: true }
);

schema.pre("save", function (next) {
    const user = this;

    if (user.isModified("password")) {
        bcrypt
            .hash(user.password, 10)
            .then((encryptedPassword) => {
                user.password = encryptedPassword;
                next();
            })
            .catch(next);
    } else {
        next();
    }
});

module.exports = mongoose.model("User", schema);