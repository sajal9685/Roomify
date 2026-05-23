import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function RoomDetails() {

  const { id } = useParams();

  const [room, setRoom] = useState(null);

  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    totalPrice: ""
  });



  // FETCH SINGLE ROOM
  const fetchRoom = async () => {

    try {

      const res = await API.get(`/rooms/${id}`);

      setRoom(res.data);

    } catch (error) {

      console.log(error);
    }
  };



  useEffect(() => {

    fetchRoom();

  }, []);




  // HANDLE INPUT
  const handleChange = (e) => {

    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };




  // BOOK ROOM
  const handleBooking = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post("/bookings", {

        room: room._id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        totalPrice: bookingData.totalPrice

      });

      alert(res.data.message);

    } catch (error) {

      alert(error.response.data.message);
    }
  };




  if (!room) {
    return <h1 className="text-center mt-10">Loading...</h1>
  }




  return (

    <div className="min-h-screen bg-[#ECEFCA] p-8">

      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">

        {/* IMAGE */}
        <img
          src={room.image}
          alt={room.title}
          className="w-full h-[400px] object-cover"
        />



        {/* CONTENT */}
        <div className="p-8">

          <h1 className="text-4xl font-bold mb-4 text-[#213448]">
            {room.title}
          </h1>

          <p className="text-lg text-gray-600 mb-4">
            📍 {room.location}
          </p>

          <p className="text-xl font-semibold mb-6">
            ₹ {room.price}
          </p>

          <p className="text-gray-700 mb-8">
            {room.description}
          </p>



          {/* BOOKING FORM */}
          <form
            onSubmit={handleBooking}
            className="grid gap-4"
          >

            <input
              type="date"
              name="checkIn"
              className="border p-3 rounded"
              onChange={handleChange}
              required
            />



            <input
              type="date"
              name="checkOut"
              className="border p-3 rounded"
              onChange={handleChange}
              required
            />



            <input
              type="number"
              name="totalPrice"
              placeholder="Total Price"
              className="border p-3 rounded"
              onChange={handleChange}
              required
            />



            <button
              className="bg-[#213448] text-white py-3 rounded text-lg"
            >
              Book Now
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default RoomDetails;