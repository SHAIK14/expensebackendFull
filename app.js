const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./routes/User");
const expenseRouter = require("./routes/expense");
const sequelize = require("./config/config");
const User = require("./models/user");
const Expense = require("./models/expenses");
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/expense", expenseRouter);
User.hasMany(Expense);
// Expense.belongsTo(User);
Expense.belongsTo(User, { foreignKey: "UserId" });

sequelize
  .sync()
  .then(() => {
    app.listen(4000);
  })
  .catch((err) => {
    console.log(err);
  });
