import reviewService from "../services/reviewService.js";

const addReview = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, rating, comment, comfortScore } = req.body;
    const review = await reviewService.addReview(userId, {
      productId,
      rating,
      comment,
      comfortScore,
    });
    res.status(201).json({ message: "Review added", review });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const data = await reviewService.getReviewsByProduct(productId, {
      page,
      limit,
    });
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const replyToReview = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;
    const { reviewId } = req.params;
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Reply message cannot be empty" });
    }
    const review = await reviewService.replyToReview(
      vendorId,
      reviewId,
      message
    );
    res.status(200).json({ message: "Reply added", review });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const flagReview = async (req, res) => {
  try {
    const flaggerId = req.user?.userId || req.user?.vendorId;
    const { reviewId } = req.params;
    const { reason } = req.body;

    if (!flaggerId) {
      return res.status(403).json({ message: "Unauthorized to flag reviews" });
    }
    const review = await reviewService.flagReview(flaggerId, reviewId, reason);
    res.status(200).json({ message: "Review flagged", review });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getFlaggedReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const data = await reviewService.getFlaggedReviews({ page, limit });
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const setReviewActive = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { isActive } = req.body;
    if (typeof isActive !== "boolean") {
      return res.status(400).json({ error: "`isActive` must be boolean" });
    }
    const review = await reviewService.setReviewActive(reviewId, isActive);
    res.status(200).json({ message: `Review ${isActive ? "reactivated" : "deactivated"}`, review });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export {
  addReview,
  getReviewsByProduct,
  replyToReview,
  flagReview,
  getFlaggedReviews,
  setReviewActive,
};
