import React, { useEffect, forwardRef, useState } from "react";
import axios from "axios";
import { replace, useNavigate } from "react-router-dom";
import AddTodoButton from "./AddTodoButton";

const Sidebar = forwardRef(
  (
    {
      onAddTodo,
      setSelectedCategory,
      openCategoryModal,
      sidebarOpen,
      setSidebarOpen,
      username,
      categoriesUpdated,
      handleTodoChange,
      setCategoriesUpdated,
    },
    ref
  ) => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

   
    const fetchCategories = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("user"))?.token;

        if (!token) {
          console.error("No token found in localStorage");
          return;
        }

       
        const response = await axios.get(
          "http://localhost:5001/api/categories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCategories(response.data);
      } catch (error) {
        console.error(
          "Error fetching categories:",
          error.response?.data?.message || error.message
        );
      }
    };

    const handleDeleteCategory = async (categoryId) => {
      try {
        const token = JSON.parse(localStorage.getItem("user"))?.token;

        if (!token) {
          console.error("No token found in localStorage");
          return;
        }

        const response = await fetch(
          `http://localhost:5001/api/categories/${categoryId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );

        if (response.ok) {
          
          setCategoriesUpdated(!categoriesUpdated); 
        } else {
          console.error("Error deleting category and todos");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    };

    useEffect(() => {
      fetchCategories();
    }, [categoriesUpdated]);

    
    const handleLogout = () => {
      localStorage.removeItem("user");
      navigate("/", { replace: true });
      window.location.reload();
    };

    
    const handleCategoryClick = (categoryId) => {
      setSelectedCategory(categoryId);
      setSidebarOpen(false); 
    };

    return (
      <>
        <aside ref={ref}>
          <div className={sidebarOpen ? "sidebar active" : "sidebar"}>
            <button className="add-todo-btn" onClick={onAddTodo}>
              Create Todo
              <span>+</span>
            </button>
            <div className="categories">
              <h3>Categories</h3>
              <ul>
                <li onClick={() => handleCategoryClick("All")}>
                  <span>All </span>
                  {/* <span className="catg-length">{categories.length}</span> */}
                </li>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <li key={category._id}>
                      <span onClick={() => handleCategoryClick(category._id)}>
                        {category.name}
                      </span>
                      <div>
                        <span className="catg-length">
                          {category.todoCount}
                        </span>
                        <span
                          onClick={() => handleDeleteCategory(category._id)}
                        >
                          <i
                            class="fa-solid fa-trash-can"
                            style={{ color: "#ff0000", marginLeft: 8 }}
                          ></i>
                        </span>
                      </div>
                    </li>
                  ))
                ) : (
                  <li>No categories found</li>
                )}
              </ul>
              <button className="add-catg-btn" onClick={openCategoryModal}>
                Create Category
              </button>
            </div>
            <div className="bottom-btn">
              <p className="loggedIn-user">{username}</p>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </aside>
        <AddTodoButton onAddTodo={onAddTodo} />
      </>
    );
  }
);

export default Sidebar;
