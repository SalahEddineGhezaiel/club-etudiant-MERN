const express = require('express');
const { getReviews, createReview, updateReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

// Ownership (author or admin) is checked inside the controllers
router.get('/', getReviews);
router.post('/', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

module.exports = router;
