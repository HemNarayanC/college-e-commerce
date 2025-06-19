import vendorService from "../services/vendorService.js";

const registerVendor = async (req, res) => {
  try {
    const userId = req.user.userId; // from auth middleware (must be logged in)
    const vendorData = req.body;
    console.log("Registering vendor for user ID:", userId, "with data:", vendorData);

    const result = await vendorService.registerVendor(userId, vendorData);

    res.status(201).json({ message: "Vendor registered successfully", vendor: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user, vendor } = await vendorService.loginVendor({email, password}, res);

    res.status(200).json({
      message: "Vendor logged in successfully",
      token,
      user,
      vendor,
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export { registerVendor, loginVendor };