const express = require("express");
const expenseController = require("../controllers/expense");

const router = express.Router();

router.post("/addexpense", expenseController.addExpense);
router.get("/getexpenses", expenseController.getExpenses);
router.delete("/delete/:id", expenseController.deleteExpense);

module.exports = router;
