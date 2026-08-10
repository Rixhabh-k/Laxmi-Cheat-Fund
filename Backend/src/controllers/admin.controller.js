const adminModel = require("../models/adminModel");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//register admin
const adminRegisterController = async (req, res) => {
  const { adminUsername, email, password } = req.body;

  const isAccountExist = await adminModel.findOne();

  if (isAccountExist) {
    return res.status(403).json({
      message: "admin already exist",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const admin = await adminModel.create({
    adminUsername,
    email,
    password: hashPassword,
  });

  res.status(200).json({
    message: "admin created",
  });
};

//login admin
const adminLoginController = async (req, res) => {
  const { email, password } = req.body;

  const isAdminExist = await adminModel.findOne({ email: email });

  if (!isAdminExist) {
    return res.status(404).json({
      message: "Admin account not found",
    });
  }

  if (isAdminExist.role != "Admin") {
    return res.status(409).json({
      message: "Only admin can login",
    });
  }

  const isPassowrdValid = await bcrypt.compare(password, isAdminExist.password);

  if (!isPassowrdValid) {
    return res.status(409).json({
      message: "Incorrect password",
    });
  }

  const token = jwt.sign({ id: isAdminExist._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token);

  res.status(200).json({
    message: "admin logged in",
  });
};

//get users
const getUsersController = async (req, res) => {

  
  const { status } = req.query;

  const filter = {};

  if (status) {
    filter.status = status;
  }

  const users = await userModel.find(filter).select("-password -pin");

  res.status(200).json({
    message: "Users fetched successfully",
    count: users.length,
    users,
  });
};

// update user status
const updateUserStatusController = async (req, res) => {
  const allowedTransitions = {
    Pending: ["Active", "Rejected"],
    Active: ["Blocked", "Closed"],
    Blocked: ["Active", "Closed"],
    Closed: [],
    Rejected: [],
  };

  const { userId } = req.params;

  const user = await userModel.findById(userId);

  if (!user) {
    return res.status(404).json({
      message: "user not found",
    });
  }

  const currentStatus = user.status;

  const newStatus = req.body.status;

  const allowedStatuses = allowedTransitions[currentStatus];

  if (!allowedStatuses.includes(newStatus)) {
    return res.status(400).json({
      message: `Cannot change status from ${currentStatus} to ${newStatus}`,
    });
  }

  user.status = newStatus;

  await user.save();

  res.status(200).json({
    message: "User status updated successfully",
    user: {
      id: user._id,
      name: user.name,
      status: user.status,
    },
  });
};





module.exports = {
  adminRegisterController,
  adminLoginController,
  getUsersController,
  updateUserStatusController,
};
