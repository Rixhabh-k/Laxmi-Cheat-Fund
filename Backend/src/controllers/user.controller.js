const userModel = require("../models/userModel");
const transactionModel = require("../models/transactionModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const generateTransactionId = require("../utils/generateTransactionId");

const getUserProfileContoller = async (req, res) => {
  const userId = req.user.id;

  const user = await userModel.findById(userId);

  if (!user) {
    return res.status(404).json({
      message: "user not found",
    });
  }

  res.status(201).json({
    message: "profile fetched successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      accountNumber: user.accountNumber,
      accountType: user.accountType,
      address: user.address,
      image: user.image,
      status: user.status,
      createdAt: user.createdAt,
    },
  });
};

// amount deposit
const depositeAmountController = async (req, res) => {
  const userId = req.user.id;
  const { amount, pin } = req.body;

  const user = await userModel.findById(userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const isPinValid = await bcrypt.compare(pin, user.pin);

  const transactionId = generateTransactionId();

  if (!isPinValid) {
    await transactionModel.create({
      userId: userId,
      type: "Deposit",
      transactionRef: transactionId,
      amount: amount,
      accountNumber: user.accountNumber,
      status: "Failed",
      failureReason: "Incorrect PIN",
    });

    return res.status(409).json({
      message: "Incorrect Pin",
      transactionRecord: {
        type: "Deposit",
        transactionRef: transactionId,
        amount: amount,
        accountNumber: user.accountNumber,
        status: "Failed",
        failureReason: "Incorrect PIN",
      },
    });
  }

  if (amount <= 0) {
    await transactionModel.create({
      userId: userId,
      type: "Deposit",
      transactionRef: transactionId,
      amount: amount,
      accountNumber: user.accountNumber,
      status: "Failed",
      failureReason: "Invalid amount",
    });

    return res.status(400).json({
      message: "Amount must be greater than 0",
      transactionRecord: {
        type: "Deposit",
        transactionRef: transactionId,
        amount: amount,
        accountNumber: user.accountNumber,
        status: "Failed",
        failureReason: "Invalid Amount",
      },
    });
  }

  const currentBalance = user.balance;

  await userModel.findByIdAndUpdate(userId, {
    balance: currentBalance + amount,
  });

  const transactionRecord = await transactionModel.create({
    userId: userId,
    type: "Deposit",
    transactionRef: transactionId,
    amount: amount,
    accountNumber: user.accountNumber,
    status: "Success",
  });

  return res.status(201).json({
    message: "Amount deposited into your account",
    transactionRecord: {
        type: "Deposit",
        transactionRef: transactionId,
        amount: amount,
        accountNumber: user.accountNumber,
        status: "Success", 
      },
  });
};

// withdrawal
const withdrawalAmountController = async (req, res) => {
  const userId = req.user.id;

  const { withdrawalAmount, pin } = req.body;

  const user = await userModel.findById(userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const isPinValid = await bcrypt.compare(pin, user.pin);

  const transactionId = generateTransactionId();

  if (!isPinValid) {
    await transactionModel.create({
      userId: userId,
      type: "Withdrawal",
      transactionRef: transactionId,
      amount: withdrawalAmount,
      accountNumber: user.accountNumber,
      status: "Failed",
      failureReason: "Incorrect PIN",
    });

    return res.status(409).json({
      message: "Incorrect Pin",
      transactionRecord: {
        type: "Withdrawal",
        transactionRef: transactionId,
        amount: withdrawalAmount,
        accountNumber: user.accountNumber,
        status: "Failed",
        failureReason: "Incorrect PIN",
      },
    });
  }

  if (withdrawalAmount <= 0) {
    await transactionModel.create({
      userId: userId,
      type: "Withdrawal",
      transactionRef: transactionId,
      amount: withdrawalAmount,
      accountNumber: user.accountNumber,
      status: "Failed",
      failureReason: "Invalid amount",
    });

    return res.status(403).json({
      message: "Invalid amount",
      transactionRecord: {
        type: "Withdrawal",
        transactionRef: transactionId,
        amount: withdrawalAmount,
        accountNumber: user.accountNumber,
        status: "Failed",
        failureReason: "Invalid amount",
      },
    });
  }

  const currentBalance = user.balance;

  if (currentBalance < withdrawalAmount) {
    await transactionModel.create({
      userId: userId,
      type: "Withdrawal",
      transactionRef: transactionId,
      amount: withdrawalAmount,
      accountNumber: user.accountNumber,
      status: "Failed",
      failureReason: "Insufficient balance",
    });

    return res.status(403).json({
      message: "Insufficient Balance",
      transactionRecord: {
        type: "Withdrawal",
        transactionRef: transactionId,
        amount: withdrawalAmount,
        accountNumber: user.accountNumber,
        status: "Failed",
        failureReason: "Insufficient Balance",
      },
    });
  }

  const remaningAmount = currentBalance - withdrawalAmount;

  await userModel.findByIdAndUpdate(userId, {
    balance: remaningAmount,
  });

  const transactionRecord = await transactionModel.create({
    userId: userId,
    type: "Withdrawal",
    transactionRef: transactionId,
    amount: withdrawalAmount,
    accountNumber: user.accountNumber,
    status: "Success",
  });

  return res.status(201).json({
    message: "Withdrawal successful",
    remaningAmount,
    transactionRecord: {
        type: "Withdrawal",
        transactionRef: transactionId,
        amount: withdrawalAmount,
        accountNumber: user.accountNumber,
        status: "Success", 
      },
  });
};

// sending money - transfer
const sendAmountController = async (req, res) => {
  const userId = req.user.id; // sender

  const { receiverAccountNumber, pin, amount } = req.body; // receiver

  const senderUser = await userModel.findById(userId);

  if (!senderUser) {
    return res.status(404).json({
      message: "Sender not found",
    });
  }

  const isPinValid = await bcrypt.compare(pin, senderUser.pin);

  const transactionId = generateTransactionId();

  if (!isPinValid) {
    await transactionModel.create({
      userId: userId,
      type: "Transfer",
      transactionRef: transactionId,
      amount: amount,
      accountNumber: senderUser.accountNumber,
      senderAccountNumber: senderUser.accountNumber,
      status: "Failed",
      failureReason: "Incorrect PIN",
    });

    return res.status(409).json({
      message: "Incorrect PIN",
      transactionRecord: {
        type: "Transfer",
        transactionRef: transactionId,
        amount: amount,
        senderAccountNumber: senderUser.accountNumber,
        receiverAccountNumber: receiverAccountNumber,
        status: "Failed", 
        failureReason: "Incorrect PIN",
      },
    });
  }

  if (amount <= 0) {
    await transactionModel.create({
      userId: userId,
      type: "Transfer",
      transactionRef: transactionId,
      amount: amount,
      accountNumber: senderUser.accountNumber,
      senderAccountNumber: senderUser.accountNumber,
      status: "Failed",
      failureReason: "Invalid amount",
    });

    return res.status(409).json({
      message: "Amount should be more than 0",
    });
  }

  const senderCurrentBalance = senderUser.balance;

  const receiverUser = await userModel.findOne({
    accountNumber: receiverAccountNumber,
  });

  if (!receiverUser) {
    await transactionModel.create({
      userId: userId,
      type: "Transfer",
      transactionRef: transactionId,
      amount: amount,
      accountNumber: senderUser.accountNumber,
      senderAccountNumber: senderUser.accountNumber,
      receiverAccountNumber: receiverAccountNumber,
      status: "Failed",
      failureReason: "Receiver not found",
    });

    return res.status(404).json({
      message: "Receiver not found",
      transactionRecord: {
        type: "Transfer",
        transactionRef: transactionId,
        amount: amount,
        senderAccountNumber: senderUser.accountNumber,
        receiverAccountNumber: receiverAccountNumber,
        status: "Failed", 
        failureReason: "Reciver not found",
      },
    });
  }

  const receiverCurrentBalance = receiverUser.balance;
  const receiverUserId = receiverUser._id;

  if (senderUser._id.toString() === receiverUser._id.toString()) {
    await transactionModel.create({
      userId: userId,
      type: "Transfer",
      transactionRef: transactionId,
      amount: amount,
      accountNumber: senderUser.accountNumber,
      senderAccountNumber: senderUser.accountNumber,
      receiverAccountNumber: receiverUser.accountNumber,
      status: "Failed",
      failureReason: "Cannot transfer money to yourself",
    });

    return res.status(400).json({
      message: "You cannot transfer money to yourself",
      transactionRecord: {
        type: "Transfer",
        transactionRef: transactionId,
        amount: amount,
        senderAccountNumber: senderUser.accountNumber,
        receiverAccountNumber: receiverAccountNumber,
        status: "Failed", 
        failureReason: "You cannot send money to yourself",
      },
    });
  }

  if (receiverUser.status !== "Active") {
    await transactionModel.create({
      userId: userId,
      type: "Transfer",
      transactionRef: transactionId,
      amount: amount,
      accountNumber: senderUser.accountNumber,
      senderAccountNumber: senderUser.accountNumber,
      receiverAccountNumber: receiverUser.accountNumber,
      status: "Failed",
      failureReason: "Receiver account is not active",
    });

    return res.status(403).json({
      message: "Receiver account is not active",
      transactionRecord: {
        type: "Transfer",
        transactionRef: transactionId,
        amount: amount,
        senderAccountNumber: senderUser.accountNumber,
        receiverAccountNumber: receiverAccountNumber,
        status: "Failed", 
        failureReason: "The receiver account is not Active",
      },
    });
  }

  if (senderCurrentBalance < amount) {
    await transactionModel.create({
      userId: userId,
      type: "Transfer",
      transactionRef: transactionId,
      amount: amount,
      accountNumber: senderUser.accountNumber,
      senderAccountNumber: senderUser.accountNumber,
      receiverAccountNumber: receiverUser.accountNumber,
      status: "Failed",
      failureReason: "Insufficient balance",
    });

    return res.status(403).json({
      message: "Insufficient balance",
      transactionRecord: {
        type: "Transfer",
        transactionRef: transactionId,
        amount: amount,
        senderAccountNumber: senderUser.accountNumber,
        receiverAccountNumber: receiverAccountNumber,
        status: "Failed", 
        failureReason: "Insufficienct Balance",
      },
    });
  }

  await userModel.findByIdAndUpdate(userId, {
    balance: senderCurrentBalance - amount,
  });

  await userModel.findByIdAndUpdate(receiverUserId, {
    balance: receiverCurrentBalance + amount,
  });

  await transactionModel.create({
    userId: userId,
    type: "Transfer",
    transactionRef: transactionId,
    amount: amount,
    accountNumber: senderUser.accountNumber,
    senderAccountNumber: senderUser.accountNumber,
    receiverAccountNumber: receiverUser.accountNumber,
    status: "Success",
  });

  return res.status(201).json({
    message: "Transfer successful",
    transactionRecord: {
        type: "Transfer",
        transactionRef: transactionId,
        amount: amount,
        senderAccountNumber: senderUser.accountNumber,
        receiverAccountNumber: receiverAccountNumber,
        status: "Success", 
      
      },
  });
};

module.exports = {
  getUserProfileContoller,
  depositeAmountController,
  withdrawalAmountController,
  sendAmountController,
};
