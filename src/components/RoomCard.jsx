import { Link } from "react-router-dom";

function RoomCard({ room }) {

  return (

    <div className="shadow-lg rounded-lg overflow-hidden bg-white">

      {/* IMAGE */}
      <img
        src={room.image}
        alt={room.title}
        className="h-52 w-full object-cover"
      />



      {/* CONTENT */}
      <div className="p-4">

        <h2 className="text-2xl font-bold mb-2">
          {room.title}
        </h2>

        <p className="text-gray-600 mb-2">
          📍 {room.location}
        </p>

        <p className="text-lg font-semibold mb-3">
          ₹ {room.price}
        </p>

        <Link
          to={`/room/${room._id}`}
          className="bg-[#213448] text-white px-4 py-2 rounded"
        >
          View Details
        </Link>

      </div>

    </div>
  );
}

export default RoomCard;