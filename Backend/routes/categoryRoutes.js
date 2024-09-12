const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createCategory,
  getCategoriesWithTodoCount,
  deleteCategoryAndTodos,
} = require('../controllers/categoryController');


router.post('/', protect, createCategory);


router.get('/', protect,  getCategoriesWithTodoCount,);

router.delete("/:id", protect, deleteCategoryAndTodos);


// router.get('/filter', protect, getTodosByCategory);

module.exports = router;
