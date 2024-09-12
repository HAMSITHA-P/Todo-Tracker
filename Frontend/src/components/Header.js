import { Link } from "react-router-dom";

const Header = ({ isLoggedIn, username, setSidebarOpen, sidebarOpen }) => {
  return (
    <header>
      <div className="navbar">
        <div className="logo-title">
          {isLoggedIn && (
            <span className="sidebar-icon">
              {sidebarOpen ? (
                <i
                  class="fa-solid fa-x"
                  onClick={() => setSidebarOpen(false)}
                ></i>
              ) : (
                <i
                  class="fa-solid fa-bars"
                  onClick={() => setSidebarOpen(true)}
                ></i>
              )}
            </span>
          )}
          <h2>Todo Tracker</h2>
        </div>
        <nav>
          {isLoggedIn ? (
            <>
              {/* User Dropdown */}
              <div>
                <p className="username">Welcome! {username} </p>
              </div>
            </>
          ) : (
            <>
              <Link to="/signup">
                <button className="addBtn">Signup</button>
              </Link>
              <Link to="/login">
                <button className="addBtn">Login</button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
