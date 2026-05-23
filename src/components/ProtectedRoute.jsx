import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

  const token = localStorage.getItem("token");

  // USER NOT LOGGED IN
  if (!token) {

    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;