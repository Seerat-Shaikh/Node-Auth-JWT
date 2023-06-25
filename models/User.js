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
        minlength: [6, 'Minimum password length is 6 characters']
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

// static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email }); // this here refers to user. It will first check email exists or not
    if (user) {
      const auth = await bcrypt.compare(password, user.password); //if email exists so we will compare its hashed password with the one saved in database if it matches return to screen otherwise throw error
      if (auth) {
        return user;
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect email');
};
  
  

//Model based on Schema
const User = mongoose.model('user', userSchema); //(name, schema) name must be singular what we define for database
module.exports = User;
  

//Model based on Schema
const User = mongoose.model('user', userSchema); //(name, schema) name must be singular what we define for database
module.exports = User;
