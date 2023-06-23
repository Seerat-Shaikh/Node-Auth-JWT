const User = require("../models/User"); //importing

//handle errors

//This will evaluate error object & will return useful object which can send to json to user
const handleErrors = (err) => {
  console.log(err.message, err.code); //error code will thorugh error for unique property

  // errors object
  let errors = { email: "", password: "" }; //This will be sent as JSOn back to user
  
  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes("user validation failed")) {

    // we will take value of objects which are errors of email & passwords
    //forEach is used for array & by this we will know properties of Email & password Errors what that for

    Object.values(err.errors).forEach(({properties}) => {
      // updating error messages
      errors[properties.path] = properties.message;
    });
  }

  return errors;

}

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
    const user = await User.create({ email, password }); //It will (mongoDb) create locally user & save to database
    // It is asynchronous task which will return promise
    // Store the results that we can get from database & saved it in some variable
    //we using await as it will take some time to resolve promise
    res.status(201).json(user); //send user object request to json
  } catch (err) {
    // Handling error
    const errors = handleErrors(err);
    res.status(400).json({errors});
  }
};

module.exports.login_post = (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  res.send("user login");
};
