import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav style={{
      background: "var(--navy)",
      padding: "0 2.5rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      height: "68px",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 2px 20px rgba(0,0,0,0.25)"
    }}>
      {/* LOGO */}
      <Link to="/" style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "1.75rem",
        fontWeight: "700",
        color: "var(--white)",
        textDecoration: "none",
        letterSpacing: "0.12em",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem"
      }}>
        <span style={{ color: "var(--gold)" }}>◈</span> ROOMIFY
      </Link>

      {/* MENU */}
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <NavLink to="/">Home</NavLink>

        {user ? (
          <>
            <NavLink to="/mybookings">My Bookings</NavLink>

            {user.role === "admin" && (
              <>
                <NavLink to="/admin">Dashboard</NavLink>
                <NavLink to="/addroom">Add Room</NavLink>
              </>
            )}

            <button
              onClick={handleLogout}
              style={{
                background: "var(--terra)",
                color: "var(--white)",
                border: "none",
                padding: "0.5rem 1.25rem",
                fontSize: "0.78rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "background 0.2s"
              }}
              onMouseEnter={e => e.target.style.background = "#b5623e"}
              onMouseLeave={e => e.target.style.background = "var(--terra)"}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <Link to="/register" style={{
              background: "var(--gold)",
              color: "var(--navy)",
              padding: "0.5rem 1.4rem",
              textDecoration: "none",
              fontSize: "0.78rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: "600",
              fontFamily: "'DM Sans', sans-serif",
              transition: "background 0.2s"
            }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

function NavLink({ to, children }) {
  return (
    <Link to={to} style={{
      color: "var(--gray-lt)",
      textDecoration: "none",
      fontSize: "0.82rem",
      letterSpacing: "0.07em",
      textTransform: "uppercase",
      fontFamily: "'DM Sans', sans-serif",
      transition: "color 0.2s",
      position: "relative"
    }}
    onMouseEnter={e => e.target.style.color = "var(--gold)"}
    onMouseLeave={e => e.target.style.color = "var(--gray-lt)"}
    >
      {children}
    </Link>
  );
}

export default Navbar;