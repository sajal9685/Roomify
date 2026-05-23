import { useEffect, useState } from "react";
import API from "../services/api";

function AdminDashboard() {

  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);




  // FETCH ALL BOOKINGS
  const fetchBookings = async () => {

    try {

      const res = await API.get("/bookings");

      setBookings(res.data);

    } catch (error) {

      console.log(error);
    }
  };




  // FETCH ALL ROOMS
  const fetchRooms = async () => {

    try {

      const res = await API.get("/rooms");

      setRooms(res.data);

    } catch (error) {

      console.log(error);
    }
  };




  useEffect(() => {

    fetchBookings();
    fetchRooms();

  }, []);




  // DELETE ROOM
  const deleteRoom = async (id) => {

    try {

      const res = await API.delete(`/rooms/${id}`);

      alert(res.data.message);

      fetchRooms();

    } catch (error) {

      alert(error.response.data.message);
    }
  };





  return (

    <div className="min-h-screen bg-[#ECEFCA] p-8">

      {/* TITLE */}
      <h1 className="text-4xl font-bold text-center mb-10 text-[#213448]">

        Admin Dashboard

      </h1>





      {/* BOOKINGS SECTION */}
      <div className="mb-16">

        <h2 className="text-3xl font-bold mb-6 text-[#213448]">

          All Bookings

        </h2>



        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {
            bookings.map((booking) => (

              <div
                key={booking._id}
                className="bg-white p-6 rounded-lg shadow-lg"
              >

                <h3 className="text-2xl font-bold mb-2">

                  {booking.room?.title}

                </h3>

                <p className="mb-2">
                  User:
                  {" "}
                  {booking.user?.name}
                </p>

                <p className="mb-2">
                  Email:
                  {" "}
                  {booking.user?.email}
                </p>

                <p className="mb-2">
                  ₹ {booking.totalPrice}
                </p>

                <p className="mb-2">
                  Status:
                  {" "}

                  <span className={
                    booking.status === "Booked"
                      ? "text-green-600 font-bold"
                      : "text-red-500 font-bold"
                  }>

                    {booking.status}

                  </span>
                </p>

              </div>
            ))
          }

        </div>

      </div>





      {/* ROOMS SECTION */}
      <div>

        <h2 className="text-3xl font-bold mb-6 text-[#213448]">

          Manage Rooms

        </h2>



        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {
            rooms.map((room) => (

              <div
                key={room._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >

                <img
                  src={room.image}
                  alt={room.title}
                  className="h-56 w-full object-cover"
                />



                <div className="p-5">

                  <h3 className="text-2xl font-bold mb-2">

                    {room.title}

                  </h3>

                  <p className="mb-2">
                    📍 {room.location}
                  </p>

                  <p className="mb-4 font-semibold">
                    ₹ {room.price}
                  </p>



                  <button
                    onClick={() => deleteRoom(room._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete Room
                  </button>

                </div>

              </div>
            ))
          }

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;