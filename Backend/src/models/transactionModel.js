const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  type: {
    type: String,
    enum: ["Deposit", "Withdrawal", "Transfer"],
    required: true,
  },
  transactionRef: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  senderAccountNumber: {
    type: String,
  },
  reciverAccountNumber: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Success", "Failed"],
    default: "Success",
  },

  failureReason: {
    type: String,
  },
},{timestamps:true});

const transactionModel = mongoose.model("transactions", transactionSchema);

module.exports = transactionModel;
