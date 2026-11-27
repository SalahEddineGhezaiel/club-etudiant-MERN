const express = require('express');
const {
  getWorkshops,
  getWorkshopById,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
} = require('../controllers/workshopController');
const { protect, adminOnly } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.get('/', getWorkshops);
router.get('/:id', getWorkshopById);
router.post('/', adminOnly, createWorkshop);
router.put('/:id', adminOnly, updateWorkshop);
router.delete('/:id', adminOnly, deleteWorkshop);

module.exports = router;
