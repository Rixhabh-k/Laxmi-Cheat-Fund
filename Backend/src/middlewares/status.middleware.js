const userModel = require("../models/userModel");

const checkAccountStatus = async (req, res, next) => {
  let user = req.user;

  // If user is not already available, find them using phone number
  if (!user) {
    const { phoneNumber } = req.body;

    user = await userModel.findOne({ phoneNumber });
  }

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const accountStatus = user.status;

  if (accountStatus === "Pending") {
    return res.status(403).json({
      message:
        "Your account verification is pending. Please wait until admin approves it.",
    });
  }

  if (accountStatus === "Blocked") {
    return res.status(403).json({
      message:
        "Your account is blocked. Please contact the bank admin.",
    });
  }

  if (accountStatus === "Closed") {
    return res.status(403).json({
      message: "Your account has been closed.",
    });
  }

  next();
};

module.exports = checkAccountStatus;