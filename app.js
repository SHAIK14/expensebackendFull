const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./routes/User");
const expenseRouter = require("./routes/expense");
const purchaseRoutes = require("./routes/purchase");
const premiumFeatureRoutes = require("./routes/premiumFeature");
const sequelize = require("./config/config");
const User = require("./models/user");
const Expense = require("./models/expenses");
const Order = require("./models/orders");
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/expense", expenseRouter);
app.use("/api/purchase", purchaseRoutes);
app.use("/api/premium", premiumFeatureRoutes);
User.hasMany(Expense);
// Expense.belongsTo(User);
Expense.belongsTo(User, { foreignKey: "UserId" });
User.hasMany(Order);
Order.belongsTo(User);
sequelize
  .sync()
  .then(() => {
    app.listen(4000);
  })
  .catch((err) => {
    console.log(err);
  });
