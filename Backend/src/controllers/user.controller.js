const userModel = require("../models/userModel");
const transactionModel = require("../models/transactionModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const generateTransactionId = require("../utils/generateTransactionId")

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

//amount deposite
const depositeAmountController = async (req, res) => {
  const userId = req.user.id;
  const { amount, pin } = req.body;

  const user = await userModel.findById(userId);

  if (!user) {
    return res.status(404).json({
      message: "user not found",
    });
  }

  const isPinValid = await bcrypt.compare(pin, user.pin);

  if (!isPinValid) {
    return res.status(409).json({
      message: "Incorrect Pin",
    });
  }

  if (amount <= 0) {
    return res.status(400).json({
      message: "Amount must be greater than 0",
    });
  }

  const currentBalance = user.balance;

  await userModel.findByIdAndUpdate(userId, {
    balance: currentBalance + amount,
  });

  const transactionId = generateTransactionId()

  const transactionRecord = await transactionModel.create({
    userId: userId,
    type: "Deposit",
    transactionRef: transactionId,
    amount: amount,
    accountNumber: user.accountNumber,
    
    
  })

  res.status(201).json({
    message: "Amount deposited into your account",
  });
};

//withdrawal
const withdrawalAmountController = async(req,res)=>{
  const userId = req.user.id
  
  const {withdrawalAmount, pin} = req.body

  const user = await userModel.findById(userId)

  if(!user){
    return res.status(404).json({
      message: "user not found"
    })
  }

  const isPinValid = await bcrypt.compare(pin, user.pin);

  if (!isPinValid) {
    return res.status(409).json({
      message: "Incorrect Pin",
    });
  }

  const currentBalance = user.balance;

  if(currentBalance<withdrawalAmount){
    return res.status(403).json({
      message: "Insufficient Balance"
    })
  }

  if(withdrawalAmount<=0){
    return res.status(403).json({
      message: "Invalid amount"
    })
  }

  await userModel.findByIdAndUpdate(userId,{
    balance: currentBalance - withdrawalAmount
  })

  const transactionId = generateTransactionId()

  const transactionRecord = await transactionModel.create({
    userId: userId,
    type: "Withdrawal",
    transactionRef: transactionId,
    amount: withdrawalAmount,
    accountNumber: user.accountNumber
  })

  const remaningAmount = currentBalance-withdrawalAmount

  res.status(201).json({
    message: "Withdrawal sucessfull",
    remaningAmount
  })


}

//sending money
const sendAmountController = async(req,res)=>{
  const userId = req.user.id //sender 

  const {reciverAccountNumber,pin,amount} = req.body // reciver

  const senderUser = await userModel.findById(userId)

  if(!senderUser){
    return res.status(404).json({
      message:"Sender not found"
    })
  }

  const isPinValid = await bcrypt.compare(pin,senderUser.pin)

  if (!isPinValid) {
    return res.status(409).json({
      message: "Incorrect Pin",
    });
  }

  const senderCurrentBalance = senderUser.balance

  const reciverUser = await userModel.findOne({accountNumber:reciverAccountNumber})

  if(!reciverUser){
    return res.status(404).json({
      message:"Reciver not found"
    }) 
  }

  const reciverCurrentBalance = reciverUser.balance

  const reciveruserId = reciverUser._id

  if(amount<=0){
    return res.status(409).json({
      message: "Amount should be more than 0"
    })
  }

  if (senderCurrentBalance < amount) {
  return res.status(403).json({
    message: "Insufficient balance",
  });
}

if (senderUser._id.toString() === reciverUser._id.toString()) {
  return res.status(400).json({
    message: "You cannot transfer money to yourself",
  });
}

if (reciverUser.status !== "Active") {
  return res.status(403).json({
    message: "Receiver account is not active",
  });
}

  await userModel.findByIdAndUpdate(userId,{
    balance: senderCurrentBalance - amount
  })

  await userModel.findByIdAndUpdate(reciveruserId,{
    balance: reciverCurrentBalance + amount
  })

  const transactionId = generateTransactionId()

  const transactionRecord = await transactionModel.create({
    userId: userId,
    type: "Transfer",
    transactionRef: transactionId,
    amount: amount,
    accountNumber: senderUser.accountNumber,
    senderAccountNumber: senderUser.accountNumber,
    reciverAccountNumber: reciverUser.accountNumber
  })

  res.status(201).json({
    message: "Transfer sucessfull",
  })
  
 
}

module.exports = {
  getUserProfileContoller,
  depositeAmountController,
  withdrawalAmountController,
  sendAmountController
};
