const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticate = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    console.log(token);
    const user = jwt.verify(token, "secretkey");
    console.log("userID is  ", user.userId);
    User.findByPk(user.userId).then((user) => {
      req.user = user; // the user i have verified above willbe stored and in req.user and it will availble to next functions, so in addexpense or any next function user can easily access the userId from that code:
      next();
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ success: false });
    // err
  }
};

module.exports = {
  authenticate,
};
