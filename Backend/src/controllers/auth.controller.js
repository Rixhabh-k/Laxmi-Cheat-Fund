const userModel = require("../models/userModel");
const auditModel = require("../models/auditLogsModel");
const jwt = require("jsonwebtoken");
const ImageKit = require("@imagekit/nodejs");
const {toFile} = require("@imagekit/nodejs");
const bcrypt = require("bcrypt")

const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// creating user
const createAccountControlller = async (req, res) => {
    
  const {
    name,
    email,
    phoneNumber,
    aadharCardNumber,
    panCardNumber,
    address,
    accountType,
    nominee,
    image,
    pin,
    password
  } = req.body;

  const ip = req.ip;

  //creating account number

  const accountNumber = Math.floor(
    1000000000 + Math.random() * 9000000000,
  ).toString();

  const isAccountExist = await userModel.findOne({
    $or: [{ email: email }, { accountNumber: accountNumber }],
  });

  if (isAccountExist) {
    return res.status(400).json({
      message: "Account already exist",
    });
  }

  const file = await client.files.upload({
    file: await toFile(Buffer.from(req.file.buffer), "file"),
    fileName: Date.now().toString(),
    folder: "/LCF-Users"
  })

  const hashPin = await bcrypt.hash(pin,10)
  const hashPassword = await bcrypt.hash(password,10)

  const user = await userModel.create({
    name,
    email,
    phoneNumber,
    aadharCardNumber,
    panCardNumber,
    address,
    accountType,
    nominee,
    image:file.url,
    pin: hashPin,
    password:hashPassword,
    accountNumber: accountNumber,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token",token)

  const auditRecord = await auditModel.create({
    user: accountNumber,
    action: "New account creation",
    status: "Success",
    ipAddress:ip,
  })

  res.status(200).json({
    message: "Your account creation request and been sent to the admin wait until admin approves your account",
    user:{
      status: user.status
    }
  });
};


//loggin user
const loginController = async(req,res)=>{
    const {phoneNumber,password} = req.body;

    const user = await userModel.findOne({phoneNumber:phoneNumber})

    if(!user){
        return res.status(401).json({
            message: "user not found"
        })
    }

    

    const isPasswordValid = await bcrypt.compare(password,user.password)

    if(!isPasswordValid){
        return res.status(403).json({
            message: "Passoword is incorrect"
        })
    }

    const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn: "1d"})

    res.cookie("token",token)

    const auditRecord = await auditModel.create({
    user: user.accountNumber,
    action: "Login",
    login: Date.now(),
    status: "Success",
  })

    res.status(200).json({
        message: "user logged in sucessfully"
    })
}





module.exports = {
  createAccountControlller,
  loginController
};
