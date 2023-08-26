const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./routes/user");
const sequelize = require("./config/config");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/api/users", userRoutes);

sequelize
  .sync()
  .then(() => {
    app.listen(4000);
  })
  .catch((err) => {
    console.log(err);
  });
