const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

// const Schema = mysql.Schema
const userSchema = new Schema({
  USER_ID: {
    type: String,
  },
  USER_NAME: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  USER_EMAIL: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  USER_PASSWORD: {
    type: String,
    required: true,
  },
  USER_ROLE: {
    type: String,
    default: "Basic",
    required: true,
  },
  USER_STATUS: {
    type: String,
    default: true,
    required: true,
  },
});

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.USER_PASSWORD, salt);
    this.USER_PASSWORD = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model("users", userSchema);
module.exports = User;
