const mongoose = require("mongoose")
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Todo = require("../models/Todo");
const Category = require('../models/Category');


router.post("/", protect, async (req, res) => {
  const { title, category, status } = req.body;

  try {
    let categoryId = null;

    
    if (category === "Uncategorized") {
      categoryId = null; 
    } else if (category) {
     
      if (mongoose.Types.ObjectId.isValid(category)) {
        categoryId = category;
      } else {
        return res.status(400).json({ message: "Invalid category ID" });
      }
    }

    
    const todo = new Todo({
      user: req.user._id,
      title,
      category: categoryId,  
      status: status || "Pending",
    });

    const createdTodo = await todo.save();
    res.status(201).json(createdTodo);
  } catch (error) {
    console.error("Error creating todo:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});





router.get("/", protect, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});



router.put('/:id', protect, async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Todo ID:", req.params.id);
    console.log("User ID:", req.user._id);

    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });

    if (!todo) {
      return res.status(404).json({ message: 'To-do not found' });
    }

  
    todo.title = req.body.title || todo.title;
    todo.category = req.body.category || todo.category;
    todo.status = req.body.status || todo.status;
    todo.updatedAt = Date.now();

    const updatedTodo = await todo.save(); 

    console.log("Updated Todo:", updatedTodo);

    res.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});




router.delete("/:id", protect, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      console.log(`Todo with id ${req.params.id} not found`);
      return res.status(404).json({ message: "To-do not found" });
    }

    console.log(`Todo found:`, todo);
    console.log(`User making request: ${req.user._id}`);
    console.log(`Todo user: ${todo.user}`);

    if (todo.user.toString() !== req.user._id.toString()) {
      console.log("User not authorized");
      return res.status(401).json({ message: "Not authorized" });
    }

    await Todo.deleteOne({ _id: req.params.id });
    res.json({ message: "To-do removed" });
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});


router.put('/reorder', protect, async (req, res) => {
  const { todos } = req.body;

  try {
    for (let todo of todos) {
      await Todo.findByIdAndUpdate(todo._id, { position: todo.position });
    }
    res.status(200).json({ message: 'Reordered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;