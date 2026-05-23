import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoomDetails from "./pages/RoomDetails";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AddRoom from "./pages/AddRoom";

function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/room/:id" element={<RoomDetails />} />

        <Route
            path="/mybookings"
            element={
            <ProtectedRoute>
            <MyBookings />
            </ProtectedRoute>
                              }
                              /> 
          <Route
  path="/addroom"
  element={
    <AdminRoute>
      <AddRoom />
    </AdminRoute>
  }
/>                    

<Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>

      </Routes>

    </BrowserRouter>
  );
}

export default App;