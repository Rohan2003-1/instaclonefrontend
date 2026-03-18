import { Link, useNavigate } from "react-router-dom";
import { FiHome, FiPlusSquare, FiUser, FiLogOut, FiSun, FiMoon } from "react-icons/fi";
import { toast } from "react-toastify";

const Navbar = ({ darkMode, setDarkMode, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    toast.success("Logged out!");
    navigate("/login");
  };

  return (
    <nav className="navbar-custom">
      <div className="container d-flex justify-content-between align-items-center">

        {/* logo */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="navbar-brand-text">InstaClone</span>
        </Link>

        {/* right side icons */}
        <div className="d-flex align-items-center gap-3">

          <Link to="/" className="icon-btn" title="Home">
            <FiHome size={22} />
          </Link>

          <Link to="/upload" className="icon-btn" title="Upload Post">
            <FiPlusSquare size={22} />
          </Link>

          <Link to="/profile" className="icon-btn" title="Profile">
            <FiUser size={22} />
          </Link>

          <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FiSun size={16} /> : <FiMoon size={16} />}
            {darkMode ? "Light" : "Dark"}
          </button>

          <button className="icon-btn" onClick={handleLogout} title="Logout">
            <FiLogOut size={22} />
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
