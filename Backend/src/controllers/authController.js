import authService from "../services/authService.js";

const register = async (req, res) => {
  try {
    const { name, email, password, phone, role, profileImage } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone) {
      return res
        .status(400)
        .json({
          message: "Name, email, password, and phone are required.",
        });
    }

    const user = await authService.registerUser({
      name,
      email,
      password,
      phone,
      role,
      profileImage,
    });

    // Remove sensitive info before sending response
    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    res.status(201).json({
      message: "User registered successfully",
      user: userResponse,
    });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({
        message: error.message || "Registration failed",
      });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    // Call login service
    const { user, token } = await authService.loginUser({ email, password });

    // Remove sensitive info before response
    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    // Send response with token
    res.status(200).json({
      message: "Login successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Login failed",
    });
  }
};

export {register, login};