const AddTodoButton = ({ onAddTodo }) => {
    return (
      <button className="add-todo-floating-btn" onClick={onAddTodo}>
        Create Todo
      </button>
    );
  };
  
  export default AddTodoButton;
  