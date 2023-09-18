const express = require("express");

const resetpasswordController = require("../controllers/resetpassword");

const router = express.Router();

router.use("/forgotpassword", resetpasswordController.forgotpassword);
router.get("/resetpassword/:id", resetpasswordController.resetPassword);

router.get("/updatepassword/:id", resetpasswordController.updatepassword);

module.exports = router;
