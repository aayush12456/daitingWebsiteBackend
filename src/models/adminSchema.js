const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {Schema}=mongoose
const adminAuthSchema = mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique: [true, "Email is already present"],
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  
  password: {
    type: String,
    required: true,
  },
 
},


{
  timestamps : true
}
);


adminAuthSchema.methods.generateAuthToken = async function () {
  try {
    console.log('toke data',this._id);
    // const token = jwt.sign(
    //   { _id: this._id.toString() },
    //   process.env.registerData,
    //   {
    //     expiresIn: 3600,
    //   }
    // );
    const token = jwt.sign(
        { _id: this._id.toString() },
        'registerData',
        {
          expiresIn: 3600,
        }
      );
    return token;
  } catch (e) {
    res.status(400).send({ mssg: "token does not exist" });
  }
};
adminAuthSchema .pre("save", async function (next) {
  if (this.isModified("password")) {
    console.log(`the current pass is ${this.password}`);
    this.password = await bcrypt.hash(this.password, 10);
    console.log(`the new  pass is ${this.password}`);
  }
  next();
});
const adminRegisterUser = new mongoose.model("adminData", adminAuthSchema );
module.exports = adminRegisterUser;
