import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function AddRoom() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    image: "",
    category: "PG"
  });




  // HANDLE INPUT
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };




  // SUBMIT FORM
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post("/rooms", formData);

      alert(res.data.message);

      navigate("/admin");

    } catch (error) {

      alert(error.response.data.message);
    }
  };





  return (

    <div className="min-h-screen bg-[#ECEFCA] flex justify-center items-center p-8">

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl"
      >

        <h1 className="text-4xl font-bold text-center mb-8 text-[#213448]">

          Add New Room

        </h1>




        {/* TITLE */}
        <input
          type="text"
          name="title"
          placeholder="Room Title"
          className="w-full border p-3 rounded mb-4"
          onChange={handleChange}
          required
        />




        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Room Description"
          className="w-full border p-3 rounded mb-4"
          rows="4"
          onChange={handleChange}
          required
        />




        {/* LOCATION */}
        <input
          type="text"
          name="location"
          placeholder="Location"
          className="w-full border p-3 rounded mb-4"
          onChange={handleChange}
          required
        />




        {/* PRICE */}
        <input
          type="number"
          name="price"
          placeholder="Price"
          className="w-full border p-3 rounded mb-4"
          onChange={handleChange}
          required
        />




        {/* IMAGE URL */}
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          className="w-full border p-3 rounded mb-4"
          onChange={handleChange}
          required
        />




        {/* CATEGORY */}
        <select
          name="category"
          className="w-full border p-3 rounded mb-6"
          onChange={handleChange}
        >

          <option value="PG">PG</option>

          <option value="Hostel">Hostel</option>

          <option value="Room">Room</option>

        </select>




        {/* BUTTON */}
        <button
          className="bg-[#213448] text-white w-full py-3 rounded text-lg"
        >
          Add Room
        </button>

      </form>

    </div>
  );
}

export default AddRoom;