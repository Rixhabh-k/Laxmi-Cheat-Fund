const transactionModel = require("../models/transactionModel");

const createTransactionRecord = async ({
  userId,
  type,
  transactionRef,
  amount,
  accountNumber,
  status,
  failureReason,
  senderAccountNumber,
  receiverAccountNumber,
}) => {
  return await transactionModel.create({
    userId,
    type,
    transactionRef,
    amount,
    accountNumber,
    status,
    failureReason,
    senderAccountNumber,
    receiverAccountNumber,
  });
};

module.exports = createTransactionRecord;