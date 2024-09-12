import { useState, useRef, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import Sidebar from "../components/Sidebar";


Modal.setAppElement("#root");

const Todo = ({ sidebarOpen, setSidebarOpen, username }) => {
  const [todos, setTodos] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newTodo, setNewTodo] = useState({ title: "", category: "" });
  const [editTodo, setEditTodo] = useState(null);
  const [error, setError] = useState("");
  const [errorDetails, setErrorDetails] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoriesUpdated, setCategoriesUpdated] = useState(false);
  const [categoryModalIsOpen, setCategoryModalIsOpen] = useState(false);
  const sidebarRef = useRef(null);

 
  const fetchTodos = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      // console.log(token);
      const response = await axios.get("http://localhost:5001/api/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTodos(response.data);
      // console.log(response.data);
    } catch (error) {
      setError("Failed to fetch todos");
    }
  };

  
  const fetchCategories = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const response = await axios.get("http://localhost:5001/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data);
    } catch (error) {
      setError("Failed to fetch categories");
    }
  };

  const openModal = (todo = null) => {
    setEditTodo(todo);
    setNewTodo({
      title: todo ? todo.title : "",
      category: todo ? todo.category || "Uncategorized" : "Uncategorized", 
    });
    setModalIsOpen(true);
    handleTodoChange();
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditTodo(null);
    setNewTodo({ title: "", category: "Uncategorized" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = JSON.parse(localStorage.getItem("user"))?.token;

    try {
      
      const updatedTodo = {
        ...newTodo,
        category: newTodo.category || null, 
      };

      if (editTodo) {
       
        await axios.put(
          `http://localhost:5001/api/todos/${editTodo._id}`,
          updatedTodo,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        
        await axios.post("http://localhost:5001/api/todos", updatedTodo, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(updatedTodo);
      }

      closeModal();
      fetchTodos(); 
      handleTodoChange(); 
    } catch (err) {
      setError("Failed to save todo");
      setErrorDetails(err.response?.data?.message || err.message);
    }
  };

  
  const deleteTodo = async (todoId) => {
    const token = JSON.parse(localStorage.getItem("user"))?.token;
    try {
      await axios.delete(`http://localhost:5001/api/todos/${todoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTodos();
      handleTodoChange();
    } catch (err) {
      setError("Failed to delete todo");
      setErrorDetails(err.response?.data?.message || err.message);
    }
  };

  const handleStatusChange = async (todo) => {
    const updatedStatus = todo.status === "Pending" ? "Completed" : "Pending";
    const token = JSON.parse(localStorage.getItem("user"))?.token;

    try {
      await axios.put(
        `http://localhost:5001/api/todos/${todo._id}`,
        { ...todo, status: updatedStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchTodos(); 
    } catch (err) {
      setError("Failed to update status");
      setErrorDetails(err.response?.data?.message || err.message);
    }
  };

  const createCategory = async (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem("user"))?.token;
    try {
     
      await axios.post(
        "http://localhost:5001/api/categories",
        { name: categoryName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

     
      setCategoriesUpdated((prevState) => !prevState);

      
      setCategoryName("");
      setCategoryModalIsOpen(false);
    } catch (err) {
      setError("Failed to create category");
      setErrorDetails(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchTodos();
    fetchCategories();

    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      window.document.addEventListener("mousedown", handleClickOutside);
    } else {
      window.document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen, setSidebarOpen, categoriesUpdated]);

  
  const filteredTodos =
    selectedCategory === "All"
      ? todos
      : todos.filter((todo) => todo.category === selectedCategory);

  
  const sortedTodos = filteredTodos.sort((a, b) => {
    if (a.status === "Pending" && b.status === "Completed") return -1;
    if (a.status === "Completed" && b.status === "Pending") return 1;
    return 0;
  });

  const handleTodoChange = () => {
    setCategoriesUpdated(!categoriesUpdated); 
  };

  return (
    <div className="todo-page">
      <Sidebar
        ref={sidebarRef}
        categories={categories}
        onAddTodo={() => openModal()}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setSelectedCategory={setSelectedCategory}
        categoriesUpdated={categoriesUpdated}
        setCategoriesUpdated={setCategoriesUpdated}
        handleTodoChange={() => handleTodoChange}
        openCategoryModal={() => {
          setCategoryModalIsOpen(true);
          setSidebarOpen(false);
        }}
        username={username}
      />
      <div className="todo-lists-area">
        <h3>
          Your To-Do Lists
          {selectedCategory !== "All"
            ? ` - ${
                categories.find((cat) => cat._id === selectedCategory)?.name
              }`
            : " - All"}
        </h3>

        {error && (
          <div>
            <p className="error">{error}</p>
            <p className="error-details">{errorDetails}</p>
          </div>
        )}
        {sortedTodos.length === 0 ? (
          <p className="no-todos">
            No todos found. Add a new todo using the button Create Todo.
          </p>
        ) : (
          <ul className="todo-list">
            {sortedTodos.map((todo) => (
              <li key={todo._id} className="todo-item">
                <div>
                  <input
                    type="checkbox"
                    checked={todo.status === "Completed"}
                    onChange={() => handleStatusChange(todo)}
                  />
                  <span
                    className={todo.status === "Completed" ? "completed" : ""}
                  >
                    {todo.title}
                  </span>
                </div>
                <div className="todo-actions">
                  <button onClick={() => openModal(todo)}>Edit</button>
                  <button
                    onClick={() => deleteTodo(todo._id)}
                    style={{ marginLeft: 10, color: "red" }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Todo Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Todo Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>{editTodo ? "Edit Todo" : "Add Todo"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            placeholder="Write your todo...."
            required
          />
          <select
            value={newTodo.category || "Uncategorized"}
            onChange={(e) =>
              setNewTodo({ ...newTodo, category: e.target.value })
            }
            className="catg-options"
          >
            <option value="Uncategorized">Uncategorized</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          <button type="submit">{editTodo ? "Update" : "Add"}</button>
          <button type="button" onClick={closeModal} className="cancel-btn">
            Cancel
          </button>
        </form>
      </Modal>

      {/* Category Modal */}
      <Modal
        isOpen={categoryModalIsOpen}
        onRequestClose={() => setCategoryModalIsOpen(false)}
        contentLabel="Create Category Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Create Category</h2>
        <form onSubmit={createCategory}>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name..."
            required
          />
          <button type="submit">Create</button>
          <button
            type="button"
            onClick={() => setCategoryModalIsOpen(false)}
            className="cancel-btn"
          >
            Cancel
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Todo;
