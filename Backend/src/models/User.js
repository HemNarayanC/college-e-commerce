import mongoose from "mongoose";
import { EMAIL_REGEX } from "../constants/regex.js";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2 },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    validate: {
      validator: function (email) {
        return EMAIL_REGEX.test(email);
      },
      message: "Invalid email address",
    },
  },
  passwordHash: { type: String, required: true },
  phone: { type: String, required: true, match: /^\d{10}$/ },
role: {
  type: [String],
  enum: ["customer", "vendor", "admin"],
  default: ["customer"],
},

  profileImage: { type: String },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

export default mongoose.model("User", UserSchema);