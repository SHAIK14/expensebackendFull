const express = require("express");
const User = require("../models/user");
const Expense = require("../models/expenses");
const sequelize = require("../config/config");
const getUserLeaderBoard = async (req, res) => {
  try {
    const userLeaderBoardDetails = await User.findAll({
      attributes: [
        "name",
        [
          sequelize.fn(
            "COALESCE",
            sequelize.fn("SUM", sequelize.col("expenses.expenseamount")),
            0
          ),
          "total_cost",
        ],
      ],
      include: [
        {
          model: Expense,
          attributes: [], // Empty attributes to avoid selecting expense columns
        },
      ],
      group: ["UserId", "Users.name"], // Include 'Users.name' in the GROUP BY clause
      raw: true, // Set raw to true to get plain JSON objects instead of Sequelize instances.
    });

    // Sort the leaderboard based on total_cost in descending order.
    userLeaderBoardDetails.sort(
      (a, b) => (b["total_cost"] || 0) - (a["total_cost"] || 0)
    );

    res.status(200).json(userLeaderBoardDetails);
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ error: "Error fetching leaderboard" });
  }
};

module.exports = {
  getUserLeaderBoard,
};

// const express = require("express");
// const User = require("../models/user");
// const Expense = require("../models/expenses");
// const sequelize = require("../config/config");

// const getUserLeaderBoard = async (req, res) => {
//   try {
//     const userLeaderBoardDetails = await User.findAll({
//       attributes: [
//         "name",
//         [
//           sequelize.fn("SUM", sequelize.col("expenses.expenseamount")),
//           "total_cost",
//         ],
//       ],
//       include: [
//         {
//           model: Expense,
//           attributes: [], // Empty attributes to avoid selecting expense columns
//         },
//       ],
//       group: ["UserId", "Users.name"], // Include 'Users.name' in the GROUP BY clause
//       raw: true, // Set raw to true to get plain JSON objects instead of Sequelize instances.
//     });

//     // Sort the leaderboard based on total_cost in descending order.
//     userLeaderBoardDetails.sort(
//       (a, b) => b["expenses.total_cost"] - a["expenses.total_cost"]
//     );

//     res.status(200).json(userLeaderBoardDetails);
//   } catch (err) {
//     console.error("Error fetching leaderboard:", err);
//     res.status(500).json({ error: "Error fetching leaderboard" });
//   }
// };

// module.exports = {
//   getUserLeaderBoard,
// };

// const express = require("express");
// const User = require("../models/user");
// const Expense = require("../models/expenses");
// const sequelize = require("../config/config");

// const getUserLeaderBoard = async (req, res) => {
//   try {
//     const users = await User.findAll({
//       attributes: ["id", "name"],
//     });
//     const expenses = await Expense.findAll({
//       attributes: [
//         "UserId",
//         [
//           sequelize.fn("sum", sequelize.col("expenses.expenseamount")),
//           "total_cost",
//         ],
//       ],
//       group: ["UserID"],
//     });
//     const userAggregatedExpenses = {};
//     console.log(expenses);
//     //   include: [
//     //     {
//     //       model: Expense,
//     //       attributes: [], // Make sure this is empty if you don't need any attributes from the Expense model.
//     //     },
//     //   ],
//     //   group: ["User.id"], // Make sure this matches your actual column name in the User table.
//     //   order: [["total_cost", "DESC"]],
//     var userLeaderBoardDetails = [];
//     users.forEach((user) => {
//       userLeaderBoardDetails.push({
//         name: user.name,
//         total_cost: userAggregatedExpenses[user.id] || 0,
//       });
//     });
//     console.log(userLeaderBoardDetails);
//     userLeaderBoardDetails.sort((a, b) => b.total_cost - a.total_cost);
//     res.status(200).json(userLeaderBoardDetails);
//   } catch (err) {
//     console.error("Error fetching leaderboard:", err); // Log the error for debugging.
//     res.status(500).json({ error: "Error fetching leaderboard" }); // Return a more descriptive error message.
//   }
// };

// module.exports = {
//   getUserLeaderBoard,
// };
