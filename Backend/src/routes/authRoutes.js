import express from 'express';
import { login, logout, register } from '../controllers/authController.js';
import authenticate from '../middlewares/authMiddleware.js';
import { registerVendor } from '../controllers/vendorController.js';
// import { multer, storage } from '../middlewares/multerMiddleware.js';
import { uploadUserProfile } from '../services/cloudinaryConfig.js';
import { flagReview } from '../controllers/reviewController.js';
import authenticateUserOrVendor from '../middlewares/sharedFlagMiddleware.js';

const router = express.Router();
// const upload = multer({storage})

router.post('/register', uploadUserProfile.single('profileImage'), register);
router.post('/login', login);
router.post('/logout', authenticate, logout);
router.get('/profile', authenticate, (req, res) => {
  res.json({
    message: 'User profile',
    user: req.user, // User info attached by auth middleware
  });
});
router.post("/register", authenticate, registerVendor);
router.post("/:reviewId/flag", authenticateUserOrVendor, flagReview);

export default router;