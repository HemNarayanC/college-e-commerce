import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { createToken } from "../utils/authToken.js";

const registerUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw {
      statusCode: 409,
      message: "User already exists",
    };
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(userData.password, salt);

  const newUser = await User.create({
    name: userData.name,
    email: userData.email,
    passwordHash: passwordHash,
    phone: userData.phone,
    role: userData.role,
    profileImage: userData.profileImage,
  });

  return newUser;
};

const loginUser = async ({ email, password }, res) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw { statusCode: 401, message: "Invalid email or password" };
  }

  const isMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    throw { statusCode: 401, message: "Invalid email or password" };
  }

  const token = createToken({ userId: user._id, role: user.role });

  // Set token in secure HTTP-only cookie
  res.cookie("userToken", token, {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  // Also return it as Bearer in the response (optional)
  return {
    user,
    token: `Bearer ${token}` // <-- This is how you return a Bearer token
  };
};

export default { registerUser, loginUser };
