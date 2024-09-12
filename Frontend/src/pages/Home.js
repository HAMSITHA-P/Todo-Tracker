import { Link } from "react-router-dom";

const Home = ({isLoggedIn}) => {
  return (
    <>
      <main className="home-bg">
        <div className="home-overlay">
          <div className="home">
            <h1>Welcome to Todo Tracker</h1>
            <p>
              Organize your tasks efficiently with our simple and intuitive
              to-do list application. Add new tasks, categorize them, mark them
              as completed, and keep track of your progress easily.
            </p>
            <Link to={isLoggedIn ? `/todo` : "/login"} style={{ marginTop: "20px" }}>
              <button className="addBtn">Create Your Todo</button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
