import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // LOGOUT
  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (

    <nav className="bg-[#213448] text-white px-8 py-4 flex justify-between items-center">

      {/* LOGO */}
      <Link to="/" className="text-2xl font-bold">
        ROOMIFY
      </Link>


      {/* MENU */}
      <div className="flex gap-6 items-center">

        <Link to="/">
          Home
        </Link>


        {
          user ? (

            <>
              
              <Link to="/mybookings">
                My Bookings
              </Link>


             {
  user.role === "admin" && (

    <>
    
      <Link to="/admin">
        Admin
      </Link>

      <Link to="/addroom">
        Add Room
      </Link>

    </>
  )
}

              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-1 rounded"
              >
                Logout
              </button>

            </>

          ) : (

            <>

              <Link to="/login">
                Login
              </Link>

              <Link to="/register">
                Register
              </Link>

            </>
          )
        }

      </div>

    </nav>
  );
}

export default Navbar;