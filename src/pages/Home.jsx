import { useEffect, useState } from "react";
import API from "../services/api";
import RoomCard from "../components/RoomCard";

function Home() {

  const [rooms, setRooms] = useState([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");

  const [maxPrice, setMaxPrice] = useState("");


  // FETCH ROOMS
  const fetchRooms = async () => {

    try {

      const res = await API.get("/rooms");

      setRooms(res.data);

    } catch (error) {

      console.log(error);
    }
  };


  useEffect(() => {

    fetchRooms();

  }, []);



  // FILTER LOGIC
  const filteredRooms = rooms.filter((room) => {

    const matchLocation =
      room.location.toLowerCase().includes(
        search.toLowerCase()
      );



    const matchCategory =
      category === ""
        ? true
        : room.category === category;



    const matchPrice =
      maxPrice === ""
        ? true
        : room.price <= Number(maxPrice);



    return (
      matchLocation &&
      matchCategory &&
      matchPrice
    );
  });



  return (

    <div className="p-8 bg-[#ECEFCA] min-h-screen">

      {/* TITLE */}
      <h1 className="text-4xl font-bold text-center mb-10 text-[#213448]">

        Find Your Perfect Stay

      </h1>



      {/* FILTER SECTION */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


          {/* SEARCH LOCATION */}
          <input
            type="text"
            placeholder="Search by location"
            className="border p-3 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />



          {/* CATEGORY */}
          <select
            className="border p-3 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >

            <option value="">
              All Categories
            </option>

            <option value="PG">
              PG
            </option>

            <option value="Hostel">
              Hostel
            </option>

            <option value="Room">
              Room
            </option>

          </select>



          {/* MAX PRICE */}
          <input
            type="number"
            placeholder="Max Price"
            className="border p-3 rounded"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />

        </div>

      </div>



      {/* ROOM GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {
          filteredRooms.map((room) => (

            <RoomCard
              key={room._id}
              room={room}
            />

          ))
        }

      </div>



      {/* NO ROOMS */}
      {
        filteredRooms.length === 0 && (

          <h2 className="text-center text-2xl mt-10">

            No rooms found

          </h2>
        )
      }

    </div>
  );
}

export default Home;