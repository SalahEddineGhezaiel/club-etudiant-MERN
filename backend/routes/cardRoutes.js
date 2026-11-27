const express = require('express');
const { getMyCard, getCards, createCard, updateCard, deleteCard } = require('../controllers/cardController');
const { protect, adminOnly } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.get('/me', getMyCard);
router.get('/', adminOnly, getCards);
router.post('/', adminOnly, createCard);
router.put('/:id', adminOnly, updateCard);
router.delete('/:id', adminOnly, deleteCard);

module.exports = router;
