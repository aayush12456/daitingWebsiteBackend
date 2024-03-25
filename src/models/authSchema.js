const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {Schema}=mongoose
const authSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 3,
  },
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
  phone: {
    type: String,
    required: true,
    unique: true,
    min: 10,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    min: 10,
  },
  DOB: {
    type: String,
    required: true,
    min: 10,
  },
  city: {
    type: String,
    required: true,
    min: 10,
  },
  aboutUser: {
    type: String,
    required: true,
    min: 10,
  },

//  images:{  // single file schema
//     type: String,
//  },
images: [{
  type:String,
  required:true
}],

  // interest: {
  //   type: String,
  //   required: true,
  // },
  interest: [{
    type: String,
    required: true,
  }],
  education: {
    type: String,
    required: true,
    min: 10,
  },
  drinking: {
    type: String,
    required: true,
    min: 10,
  },
  smoking: {
    type: String,
    required: true,
    min: 10,
  },
  eating: {
    type: String,
    required: true,
    min: 10,
  },
  interest: [{
    type: String,
    required: true,
    minLength: 1 // Minimum length of each interest string
  }],
  profession: {
    type: String,
    required: true,
    min: 10,
  },
  looking: {
    type: String,
    required: true,
    min: 2,
  },
  relationship: {
    type: String,
    required: true,
    
  },
  zodiac: {
    type: String,
    required: true,
    
  },
  language: {
    type: String,
    required: true,
    
  },
  filterData:[
    {
      type:Schema.Types.ObjectId,
      ref:'UserData'
    }
  ],
  visitors:[
    {
      type:Schema.Types.ObjectId,
      ref:'UserData'
    }
  ],
  likes:[
    {
      type:Schema.Types.ObjectId,
      ref:'UserData'
    }
  ],
  likeFilterData:[
    {
      type:Schema.Types.ObjectId,
      ref:'UserData'
    }
  ],
  addToChatData:[
    {
      type:Schema.Types.ObjectId,
      ref:'UserData'
    }
  ],
});


authSchema.methods.generateAuthToken = async function () {
  try {
    console.log(this._id);
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
authSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    console.log(`the current pass is ${this.password}`);
    this.password = await bcrypt.hash(this.password, 10);
    console.log(`the new  pass is ${this.password}`);
  }
  next();
});
const registerUser = new mongoose.model("UserData", authSchema);
module.exports = registerUser;