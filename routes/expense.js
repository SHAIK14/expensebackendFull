const express = require("express");
const expenseController = require("../controllers/expense");
const userauthentication = require("../middleware/auth");
const router = express.Router();

router.post(
  "/addexpense",
  userauthentication.authenticate,
  expenseController.addExpense
);
router.get(
  "/getexpenses",
  userauthentication.authenticate,
  expenseController.getExpenses
);
router.delete(
  "/delete/:id",
  userauthentication.authenticate,
  expenseController.deleteExpense
);
router.get(
  "/download",
  userauthentication.authenticate,
  expenseController.downloadExpense
);
module.exports = router;
