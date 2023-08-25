const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const sequelize = require("./config/config");

const app = express();

app.use(cors());
app.use(express.json()); // new method: converts the recived data form jason to obj kind of body parser
app.use(express.urlencoded({ extended: true }));

app.use(authRoutes);

sequelize
  .sync({ force: false }) // if we set true it will drop ad recreate the table, so settig false will updatethe table
  .then(() => {
    app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
