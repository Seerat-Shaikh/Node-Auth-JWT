const mongoose = require('mongoose'); //For creating new user model
const { isEmail } = require('validator'); //importing isEmail package from validator we installed
const bcrypt = require('bcrypt');

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

// fire a function after doc saved to db
userSchema.post('save', function (doc, next) { //post is referring to something happening after firing a function to database
    console.log('new user was created & saved', doc);
    next();
});

// fire a function before doc saved to db
userSchema.pre('save', async function (next) { //pre is before
    //console.log('user about to be created & saved', this); //"this" will create local instant of user before we save it to the database
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt); //this refers to instant of user we trying to create
    next();
});
  

//Model based on Schema
const User = mongoose.model('user', userSchema); //(name, schema) name must be singular what we define for database
module.exports = User;
