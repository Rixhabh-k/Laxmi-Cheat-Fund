const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

async function verifyUser(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Token not found",
      });
    }

    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await userModel.findById(decode.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();

  } catch (err) {
    return res.status(401).json({
      message: "User is unauthorized",
    });
  }
}

module.exports = verifyUser;