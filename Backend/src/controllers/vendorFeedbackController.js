import vendorFeedbackService from "../services/vendorFeedbackService.js";

const submitFeedback = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await vendorFeedbackService.addFeedback(userId, req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getVendorFeedbacks = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;
    console.log("Fetching feedbacks for vendor:", vendorId);
    const feedbacks = await vendorFeedbackService.getVendorFeedbacks(vendorId);
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getVendorRating = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;
    const rating = await vendorFeedbackService.getAverageRating(vendorId);
    res.json(rating);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { submitFeedback, getVendorFeedbacks, getVendorRating };
