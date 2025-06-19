import User from "../models/User.js";

const getAllUsers = async () => {
   const users = await User.find();
   //if returned array of users then map through the array and remove password from each user object
   const userObj = users.map((user) => {
    const userData = user.toObject();
    delete userData.password; // Remove password from the user object
    return userData;
   })
   return userObj
}

export default {getAllUsers};