const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
    if (err) {
      res.json({
        error: err,
      });
    }

    let user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPass,
      imgUrl: req.body.imgUrl,
    });

    user
      .save()
      .then((user) => {
        res.json({
          message: "User Added Successfully",
        });
      })
      .catch((error) => {
        res.json({
          message: "An error occured",
        });
      });
  });
};

const login = (req, res, next) => {
  var email = req.query.email;
  var password = req.query.password;
  User.findOne({ email: email }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          res.json({
            error: err,
          });
        }
        if (result) {
          let userToken = jwt.sign(
            { user: user },
            process.env.USER_SECRET_TOKEN
          );

          let decode = jwt.verify(userToken, process.env.USER_SECRET_TOKEN);

          res.status(200).json({
            message: "Login Successful!",
            userToken,
          });
        } else {
          res.status(200).json({
            message: "Password does not matched",
          });
        }
      });
    } else {
      res.json({
        message: "No user found",
      });
    }
  });
};

module.exports = {
  register,
  login,
};
