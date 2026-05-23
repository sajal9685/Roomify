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
    category: "PG",
    dealerName: "",
    dealerPhone: "",
    dealerVerified: true
  });

  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("location", formData.location);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("dealerName", formData.dealerName);
      data.append("dealerPhone", formData.dealerPhone);
      data.append("dealerVerified", formData.dealerVerified);

      images.forEach((img) => {
        data.append("images", img);
      });

      const res = await API.post("/rooms", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert(res.data.message);
      navigate("/admin");

    } catch (error) {
      alert(error.response?.data?.message || "Room upload failed");
    }
  };

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      <div style={{ background: "var(--navy)", padding: "3.5rem 2.5rem", textAlign: "center" }}>
        <p style={{
          fontSize: "0.75rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--gold)",
          marginBottom: "0.75rem",
          fontFamily: "'DM Sans', sans-serif"
        }}>
          Admin · Room Management
        </p>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "3rem",
          fontWeight: "700",
          color: "var(--white)"
        }}>
          Add New Room
        </h1>
      </div>

      <div style={{ maxWidth: "700px", margin: "3rem auto", padding: "0 2rem" }}>
        <div style={{
          background: "var(--white)",
          borderRadius: "4px",
          padding: "3rem",
          boxShadow: "0 4px 24px rgba(15,31,46,0.08)",
          borderTop: "3px solid var(--gold)"
        }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            <FormField label="Room Title">
              <input type="text" name="title" placeholder="e.g. Cozy Studio near IIT" onChange={handleChange} required style={inputStyle} />
            </FormField>

            <FormField label="Description">
              <textarea name="description" placeholder="Describe the room, amenities, and surroundings…" onChange={handleChange} required rows="4" style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
            </FormField>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <FormField label="Location">
                <input type="text" name="location" placeholder="City, Area" onChange={handleChange} required style={inputStyle} />
              </FormField>

              <FormField label="Monthly Price (₹)">
                <input type="number" name="price" placeholder="e.g. 8000" onChange={handleChange} required style={inputStyle} />
              </FormField>
            </div>

            <FormField label="Upload Room Images">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages([...e.target.files])}
                required
                style={inputStyle}
              />
            </FormField>

            <FormField label="Dealer Name">
              <input type="text" name="dealerName" placeholder="Dealer name" onChange={handleChange} required style={inputStyle} />
            </FormField>

            <FormField label="Dealer Phone">
              <input type="text" name="dealerPhone" placeholder="Dealer phone number" onChange={handleChange} required style={inputStyle} />
            </FormField>

            <label style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--navy)" }}>
              <input
                type="checkbox"
                name="dealerVerified"
                checked={formData.dealerVerified}
                onChange={handleChange}
                style={{ marginRight: "0.5rem" }}
              />
              Verified Dealer
            </label>

            <FormField label="Category">
              <select name="category" onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="PG">PG</option>
                <option value="Hostel">Hostel</option>
                <option value="Room">Room</option>
              </select>
            </FormField>

            <button type="submit" style={{
              background: "var(--navy)",
              color: "var(--white)",
              border: "none",
              padding: "1rem",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.85rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              marginTop: "0.5rem",
              transition: "background 0.2s",
              borderRadius: "2px"
            }}>
              Publish Room Listing
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label style={{
        display: "block",
        fontSize: "0.72rem",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "var(--gray)",
        marginBottom: "0.5rem",
        fontFamily: "'DM Sans', sans-serif"
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  border: "1px solid var(--gray-lt)",
  background: "var(--cream)",
  padding: "0.85rem 1rem",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.9rem",
  color: "var(--text)",
  outline: "none",
  borderRadius: "2px"
};

export default AddRoom;