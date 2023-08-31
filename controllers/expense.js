const Expense = require("../models/expenses");
const addExpense = async (req, res) => {
  try {
    const { expenseamount, description, category } = req.body;

    if (!expenseamount || !description || !category) {
      return res
        .status(400)
        .json({ error: "Bad parameters, something is missing!" });
    }

    console.log(
      "Creating expense for user ID: in the addexpense folder",
      req.user.id
    );

    const expense = await Expense.create({
      expenseamount,
      description,
      category,
      UserId: req.user.id,
    });

    console.log("Created expense:", expense);

    return res
      .status(201)
      .json({ message: "Expense added successfully", expense });
  } catch (error) {
    console.error("Error adding expense:", error);
    return res.status(500).json({ message: "Error adding expense" });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ where: { userId: req.user.id } });
    return res.status(200).json({ expenses });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return res.status(500).json({ message: "Error fetching expenses" });
  }
};
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await expense.destroy({ where: { id: expense, userId: req.user.id } });
    return res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return res.status(500).json({ message: "Error deleting expense" });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  deleteExpense,
};
