const User = require("../model/authModel");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "kishan sheth super secret key", {
    expiresIn: maxAge,
  });
};

const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  console.log(err);
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  if (err.code === 11000) {
    errors.email = "Email is already registered";
    return errors;
  }

  if (err.message.includes("Users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

module.exports.register = async (req, res, next) => {
  try {
    
    const { email, password } = req.body; // extraction email and password from request body
    const user = await User.create({ email, password }); // creating a new user using email and password


    const token = createToken(user._id); // create a new token using user id 

    res.cookie("jwt", token, {  // using the above token here to generate cookies 
      withCredentials: true,
      httpOnly: false,
      maxAge: maxAge * 1000,
    });

    res.status(201).json({ user: user._id, created: true }); // if user is registered successfully sending the response
  } catch (err) {
    // Handling the errors if the user is not registered properly 
    console.log(err);
    const errors = handleErrors(err); // using the handle errors function to handle errors manually 
    // here the handle errors function is returning an object with 
    // we are sending the returned object in the response json 
    res.json({ errors, created: false });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    
    const user = await User.login(email, password); //using the login method from the user model 

    const token = createToken(user._id); // creating the token using the id

    res.cookie("jwt", token, { httpOnly: false, maxAge: maxAge * 1000 }); // setting a cookie in the HTTP response 
    res.status(200).json({ user: user._id, status: true });
  } catch (err) {
    const errors = handleErrors(err); // sending the error to the handlerror function and 
    // that will return the object
    res.json({ errors, status: false }); // sending the returned error object as response 
  }
};