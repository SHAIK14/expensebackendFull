const User = require("../models/user");

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send("All fields are required.");
    }

    await User.create({
      name,
      email,
      password,
    });

    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while signing up.");
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).send("User not found.");
    }

    if (user.password !== password) {
      return res.status(401).send("Invalid password.");
    }

    res.send("Login successful!");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while logging in.");
  }
};
