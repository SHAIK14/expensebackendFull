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
      sendSmtpEmail.htmlContent = `<a href="http://localhost:4000/password/resetpassword/${id}">Reset password</a>`; //
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

module.exports = {
  forgotpassword,
};
