const jwt = require("jsonwebtoken");
const User = require("../models/User");

const loggedUserInformation = (req, res, next) => {
  const userToken = req.headers.authorization.split(" ")[1];

  const decode = jwt.verify(userToken, process.env.USER_SECRET_TOKEN);

  if (decode) {
    res.json({
      _id: decode.user._id,
      name: decode.user.name,
      email: decode.user.email,
      imgUrl: decode.user.imgUrl,
      activeStatus: decode.user.activeStatus,
      socketID: decode.user.socketID,
    });
  } else {
    res.json({
      information: "information is not found",
    });
  }
};

const OtherUserInformation = (req, res, next) => {
  let email = req.params.email;
  console.log("params =>", req.params);
  console.log("email=>", email);
  User.find(
    { email: { $ne: email } },
    { _id: 1, name: 1, email: 1, imgUrl: 1, activeStatus: 1, socketID: 1 }
  )
    .then((response) => {
      res.json({
        response,
      });
    })
    .catch((error) => {
      res.json({
        error,
      });
    });
};

module.exports = { loggedUserInformation, OtherUserInformation };
