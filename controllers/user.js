const User = require("../models/User");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    res.status(201).json({ message: "User signed up successfully", user });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ message: "Error signing up" });
  }
};

module.exports = {
  signup,
};
