const mongoose = require('mongoose'); //For creating new user model
const { isEmail } = require('validator'); //importing isEmail package from validator we installed

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'], //First will be array value second is custom error
        unique: true, //no user can signup with same email twice
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email'] //isEamil will check that email is valid or not
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        minlength: [6, 'Minimum password length is 6 character']
    },
});

//Model based on Schema
const User = mongoose.model('user', userSchema); //(name, schema) name must be singular what we define for database
module.exports = User;