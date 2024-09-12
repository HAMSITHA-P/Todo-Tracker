const Category = require("../models/Category");
const Todo = require("../models/Todo");


const createCategory = async (req, res) => {
  try {
    
    const { name } = req.body;

   
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    
    const existingCategory = await Category.findOne({
      name,
      user: req.user.id,
    });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    
    const category = new Category({
      name,
      user: req.user.id,
    });

    const savedCategory = await category.save();

    
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error("Error creating category:", error); 
    res.status(500).json({ message: "Server error while creating category" });
  }
};

// Get all categories for the user
const getCategoriesWithTodoCount = async (req, res) => {
  try {
    
    const categories = await Category.find({ user: req.user._id });

    
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const todoCount = await Todo.countDocuments({
          category: category._id,
          user: req.user._id, 
        });
        return {
          ...category.toObject(),
          todoCount,
        };
      })
    );

    res.status(200).json(categoriesWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteCategoryAndTodos = async (req, res) => {
  const categoryId = req.params.id;

  try {
    
    await Todo.deleteMany({ category: categoryId });

    
    await Category.findByIdAndDelete(categoryId);

    res.status(200).json({ message: 'Category and associated todos deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category and todos', error });
  }
};


const getTodosByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const todos = await Todo.find({
      user: req.user.id,
      category: category, 
    });

    res.json(todos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error while filtering todos by category" });
  }
};

module.exports = {
  createCategory,
  getCategoriesWithTodoCount,
  getTodosByCategory,
  deleteCategoryAndTodos
};
