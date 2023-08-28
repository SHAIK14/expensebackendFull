const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Bad parameters, something is missing!" });
    }
    const saltrounds = 10;
    bcrypt.hash(password, saltrounds, async (err, hash) => {
      console.log(err);
      await User.create({ name, email, password: hash });
      res.status(201).json({ message: "Successfuly create new user" });
    });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ message: "Error signing up" });
  }
};
const generateAccessToken = (id, name, ispremiumuser) => {
  return jwt.sign({ userId: id, name: name, ispremiumuser }, "secretkey");
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Bad parameters, something is missing!" });
    }
    console.log("Before querying user");
    const user = await User.findOne({ where: { email } });
    console.log("After querying user", user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        throw new Error("Something went wrong");
      }
      if (result === true) {
        return res.status(200).json({
          success: true,
          message: "User logged in successfully",
          token: generateAccessToken(user.id, user.name, user.ispremiumuser),
        });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Password is incorrect" });
      }
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ error: "Bad parameters, something is missing!" });
//     }

//     const user = await User.findOne({ where: { email } });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     if (user.length > 0) {
//       bcrypt.compare(password, user[0].password, (err, result) => {
//         if (err) {
//           throw new Error("Something went wrong");
//         }
//         if (result === true) {
//           return res.status(200).json({
//             success: true,
//             message: "User logged in successfully",
//             token: generateAccessToken(
//               user[0].id,
//               user[0].name,
//               user[0].ispremiumuser
//             ),
//           });
//         } else {
//           return res
//             .status(400)
//             .json({ success: false, message: "Password is incorrect" });
//         }
//       });
//     } else {
//       return res
//         .status(404)
//         .json({ success: false, message: "User Doesnot exitst" });
//     }
//   } catch (error) {
//     console.error("Error logging in:", error);
//     res.status(500).json({ message: "Error logging in" });
//   }
// };

module.exports = {
  signup,
  login,
};
