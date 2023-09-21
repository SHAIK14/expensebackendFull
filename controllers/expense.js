const Expense = require("../models/expenses");
const User = require("../models/user");
const sequelize = require("../config/config");
const DownloadedFiles = require("../models/Download");
require("dotenv").config();
const Aws = require("aws-sdk");

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

function uploadToS3(data, filename) {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

  // AKIAXEXUGGGVSE52NBGZ

  let s3bucket = new Aws.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  });
  var params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };
  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log("SOMETHING WENT WRONG", err);
        reject(err);
      } else {
        resolve(s3response.Location);
      }
    });
  });
}
const downloadExpense = async (req, res, next) => {
  try {
    const ex = await Expense.findAll({ where: { userId: req.user.id } });
    const good = JSON.stringify(ex);
    const userId = req.user.id;
    const fileName = `Expense${userId}/${new Date()}.txt`;
    const fileUrl = await uploadToS3(good, fileName);
    console.log(fileName, fileUrl);
    let data = await DownloadedFiles.create({
      url: fileUrl,
      userId: req.user.id,
    });

    res.status(200).json({ data: data, success: true });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ success: false });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  deleteExpense,
  downloadExpense,
};
