const sibApiV3Sdk = require("sib-api-v3-sdk");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const ForgetPassword = require("../models/forgotpassword");
require("dotenv").config();

// -----------------------------------------------------------------------------

sibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
  process.env.API_KEY;

const forgotpassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ where: { email: email } });
    console.log(user);
    if (user) {
      const userId = user.id;
      const id = uuid.v4();
      await ForgetPassword.create({
        id,
        active: true,
        UserId: userId,
      }).catch((err) => {
        console.log(err);
        throw new Error(err);
      });

      const apiInstance = new sibApiV3Sdk.TransactionalEmailsApi();

      const sendSmtpEmail = new sibApiV3Sdk.SendSmtpEmail();
      sendSmtpEmail.sender = { email: "smd.20sa@gmail.com" }; //process.env.SG_MAIL
      sendSmtpEmail.subject = "Reset Password";
      sendSmtpEmail.textContent = "Forget Password";
      sendSmtpEmail.htmlContent = `<a href="http://localhost:4000/api/password/resetpassword/${id}">Reset password</a>`; //
      sendSmtpEmail.to = [{ email }];

      apiInstance
        .sendTransacEmail(sendSmtpEmail)
        .then((data) => {
          console.log(data);
          const statusCode = data.code || 200; // Default to 200 if code is undefined
          return res.status(statusCode).json({
            message: "Link to reset password sent to your mail",
            success: true,
          });
        })
        .catch((err) => {
          console.log(err);
          const statusCode = err.code || 500; // Default to 500 if code is undefined
          return res
            .status(statusCode)
            .json({ message: err.message, success: false });
        });
    } else {
      throw new Error("User doesnt exist");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error, success: false });
  }
};
const resetPassword = async (req, res, next) => {
  try {
    const id = req.params.id;
    const forgotpasswordrequest = await ForgetPassword.findOne({
      where: { id: id },
    });
    if (forgotpasswordrequest) {
      await forgotpasswordrequest.update({ active: false });

      res.status(200).send(`<html>
            <script>
                function formsubmitted(e){
                    e.preventDefault();
                }
            </script>
            <form action="/api/password/updatepassword/${id}" method="get">
                <label for="newpassword">Enter New password</label>
                <input name="newpassword" type="password" required></input>
                <button>Reset password</button>
            </form>
        </html>`);
      res.end();
    } else {
      throw new Error("invalid uuid");
    }
  } catch (err) {
    res.status(500).json({ message: err, success: false });
  }
};

const updatepassword = async (req, res, next) => {
  try {
    const { newpassword } = req.query;
    // console.log("newpassword in updatepassword fn", newpassword);

    const resetpasswordid = req.params.id;
    // console.log("resetpassworddid in updatepassword fn", resetpasswordid);

    const resetpasswordrequest = await ForgetPassword.findOne({
      where: { id: resetpasswordid },
    });
    // console.log(
    //   "resetpasswordrequest in updatepassword fn,",

    //   resetpasswordrequest
    // );
    const user = await User.findOne({
      where: { id: resetpasswordrequest.UserId },
    });
    // console.log("user in updatepassword fn,", user);

    if (user) {
      const saltRounds = 10;
      bcrypt.hash(newpassword, saltRounds, function (err, hash) {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: err });
        }
        console.log("Generated hash:", hash);
        user
          .update({ password: hash })
          .then(() => {
            console.log("Updated user:", updatedUser);
            res
              .status(201)
              .json({ message: "Successfuly updated the new password" });
          })
          .catch((err) => {
            return res.status(500).json({ message: err });
          });
      });
    } else {
      return res.status(404).json({ error: "No user Exists", success: false });
    }
  } catch (error) {
    return res.status(403).json({ error, success: false });
  }
};

module.exports = {
  forgotpassword,
  resetPassword,
  updatepassword,
};
