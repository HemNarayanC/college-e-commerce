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

export {
  getAllUsers
};