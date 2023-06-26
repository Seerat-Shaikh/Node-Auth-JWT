const User = require("../models/User"); //importing
const jwt = require('jsonwebtoken');

//handle errors

//This will evaluate error object & will return useful object which can send to json to user
const handleErrors = (err) => {
  console.log(err.message, err.code); //error code will thorugh error for unique property

  // errors object
  let errors = { email: "", password: "" }; //This will be sent as JSOn back to user
  
  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes("user validation failed")) {
    // console.log(err);
    // we will take value of objects which are errors of email & passwords
    //forEach is used for array & by this we will know properties of Email & password Errors what that for

    Object.values(err.errors).forEach(({properties}) => {
      // console.log(val);
      // console.log(properties);

      // updating error messages
      errors[properties.path] = properties.message;
    });
  }

  return errors;

}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'net ninja secret', {
    expiresIn: maxAge
  });
};

// controller actions
module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.signup_post = async (req, res) => {
  //async beacuse of await
  // we willcreate new user using schema properties we assigned
  const { email, password } = req.body;

  try {
    //After creating user we will send a json webtoken to back in browser in cookie or nay request will made if
    //so we will send it to jwt in cookie for verification either user is that or not
    const user = await User.create({ email, password }); //It will (mongoDb) create locally user & save to database
    // It is asynchronous task which will return promise
    // Store the results that we can get from database & saved it in some variable
    //we using await as it will take some time to resolve promise
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
    //res.status(201).json(user); //send user object request to json
  } catch (err) {
    // Handling error
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  //console.log(email, password);
  //res.send("user login");
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  }

  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  // it will not delete cookie so we just replace it with empty space & set its expire date 1ms  
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}
