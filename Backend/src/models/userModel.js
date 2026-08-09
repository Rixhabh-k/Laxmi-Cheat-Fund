const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Account holder name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      // match: [/^[6-9]\d{9}$/, "Invalid phone number"],
    },

    aadharCardNumber: {
      type: String,
      required: [true, "Aadhaar number is required"],
      unique: true,
      // match: [/^\d{12}$/, "Aadhaar must be 12 digits"],
    },

    panCardNumber: {
      type: String,
      required: [true, "PAN number is required"],
      unique: true,
      uppercase: true,
      // match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number"],
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },

    accountType: {
      type: String,
      enum: ["Saving", "Current"],
      required: [true, "Account type is required"],
    },

    nominee: {
      type: String,
      required: [true, "Nominee name is required"],
      trim: true,
    },

    image: {
      type: String, // Store ImageKit/Cloudinary URL
      default: "https://ik.imagekit.io/rixhabh/LCF%20Users/users-default-image.avif",
    },
    password:{
      type: String,
      required: [true, "Password is required"],
    },

    pin: {
      type: String,
      required: [true, "PIN is required"],
    },
    accountNumber: {
      type: String,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Active", "Blocked", "Closed","Pending","Rejected"],
      default: "Pending",
    },
    role:{
      type: String,
      default: "User"
    }
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
