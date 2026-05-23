import { useEffect, useState } from "react";
import API from "../services/api";

function MyBookings() {

  const [bookings, setBookings] = useState([]);




  // FETCH BOOKINGS
  const fetchBookings = async () => {

    try {

      const res = await API.get("/bookings/mybookings");

      setBookings(res.data);

    } catch (error) {

      console.log(error);
    }
  };




  useEffect(() => {

    fetchBookings();

  }, []);




  // CANCEL BOOKING
  const cancelBooking = async (id) => {

    try {

      const res = await API.put(`/bookings/cancel/${id}`);

      alert(res.data.message);

      fetchBookings();

    } catch (error) {

      alert(error.response.data.message);
    }
  };





  return (

    <div className="min-h-screen bg-[#ECEFCA] p-8">

      <h1 className="text-4xl font-bold text-center mb-10 text-[#213448]">

        My Bookings

      </h1>




      {
        bookings.length === 0 ? (

          <h2 className="text-center text-xl">
            No bookings found
          </h2>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {
              bookings.map((booking) => (

                <div
                  key={booking._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >

                  {/* ROOM IMAGE */}
                  <img
                    src={booking.room.image}
                    alt={booking.room.title}
                    className="w-full h-56 object-cover"
                  />



                  {/* CONTENT */}
                  <div className="p-6">

                    <h2 className="text-2xl font-bold mb-3">

                      {booking.room.title}

                    </h2>

                    <p className="mb-2">
                      📍 {booking.room.location}
                    </p>

                    <p className="mb-2">
                      Check In:
                      {" "}
                      {booking.checkIn.slice(0, 10)}
                    </p>

                    <p className="mb-2">
                      Check Out:
                      {" "}
                      {booking.checkOut.slice(0, 10)}
                    </p>

                    <p className="mb-2 font-semibold">
                      ₹ {booking.totalPrice}
                    </p>

                    <p className="mb-4">

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




                    {
                      booking.status === "Booked" && (

                        <button
                          onClick={() => cancelBooking(booking._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                          Cancel Booking
                        </button>

                      )
                    }

                  </div>

                </div>
              ))
            }

          </div>
        )
      }

    </div>
  );
}

export default MyBookings;