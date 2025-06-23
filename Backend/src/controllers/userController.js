import userService from "../services/userService.js";

const getAllUsers = async (req, res) => {
  try {
    const data = await userService.getAllUsers();
    res.json(data);
    // res.send("Some Users Data.....");
  } catch (error) {
    console.log(error);
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.user.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await userService.updateUserProfile(req.user.id, req.body);
    res.status(200).json({ message: "Profile updated", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export {
  getAllUsers
};