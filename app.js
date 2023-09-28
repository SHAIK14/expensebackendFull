const path = require("path");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const userRoutes = require("./routes/User.js");
const expenseRouter = require("./routes/expense");
const purchaseRoutes = require("./routes/purchase");
const premiumFeatureRoutes = require("./routes/premiumFeature");
const resetPasswordRoutes = require("./routes/resetpassword");
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
const sequelize = require("./config/config");
const User = require("./models/user");
const Expense = require("./models/expenses");
const Order = require("./models/orders");
const Forgotpassword = require("./models/forgotpassword");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/expense", expenseRouter);
app.use("/api/purchase", purchaseRoutes);
app.use("/api/premium", premiumFeatureRoutes);
app.use("/api/password", resetPasswordRoutes);
app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));
User.hasMany(Expense);
// Expense.belongsTo(User);
Expense.belongsTo(User, { foreignKey: "UserId" });
User.hasMany(Order);
Order.belongsTo(User);
User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    app.listen(4000);
  })
  .catch((err) => {
    console.log(err);
  });
