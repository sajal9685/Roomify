import { useEffect, useState } from "react";
import API from "../services/api";
import RoomCard from "../components/RoomCard";

function Home() {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const fetchRooms = async () => {
    try {
      const res = await API.get("/rooms");
      setRooms(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  const filteredRooms = rooms.filter((room) => {
    const matchLocation = room.location.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "" ? true : room.category === category;
    const matchPrice = maxPrice === "" ? true : room.price <= Number(maxPrice);
    return matchLocation && matchCategory && matchPrice;
  });

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>

      {/* HERO */}
      <div style={{
        background: "var(--navy)",
        padding: "6rem 2.5rem 5rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* decorative grain overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
          opacity: 0.5, pointerEvents: "none"
        }}/>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.78rem",
          letterSpacing: "0.25em",
          color: "var(--gold)",
          textTransform: "uppercase",
          marginBottom: "1rem"
        }}>
          Curated Stays · PGs · Hostels · Rooms
        </p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(2.8rem, 6vw, 5rem)",
          color: "var(--white)",
          fontWeight: "700",
          lineHeight: 1.1,
          marginBottom: "1.5rem"
        }}>
          Find Your Perfect<br />
          <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Place to Stay</em>
        </h1>
        <p style={{
          color: "var(--gray-lt)",
          maxWidth: "480px",
          margin: "0 auto",
          fontSize: "1rem",
          lineHeight: 1.7
        }}>
          Handpicked accommodations for students, travelers, and professionals across the city.
        </p>
      </div>

      {/* FILTER BAR */}
      <div style={{
        background: "var(--navy-mid)",
        padding: "1.5rem 2.5rem",
        display: "flex",
        gap: "1rem",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
      }}>
        <input
          type="text"
          placeholder="Search by location…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={filterInputStyle}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={filterInputStyle}
        >
          <option value="">All Categories</option>
          <option value="PG">PG</option>
          <option value="Hostel">Hostel</option>
          <option value="Room">Room</option>
        </select>
        <input
          type="number"
          placeholder="Max Price (₹)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={filterInputStyle}
        />
      </div>

      {/* ROOMS */}
      <div style={{ padding: "4rem 2.5rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "2rem",
            color: "var(--navy)",
            fontWeight: "600"
          }}>
            {filteredRooms.length > 0
              ? `${filteredRooms.length} Available Stays`
              : "Available Stays"}
          </h2>
          <div style={{ width: "48px", height: "2px", background: "var(--gold)", marginTop: "0.6rem" }} />
        </div>

        {filteredRooms.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "5rem 2rem",
            color: "var(--gray)"
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>◈</div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem" }}>
              No stays found
            </p>
            <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "2rem"
          }}>
            {filteredRooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const filterInputStyle = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(201,168,76,0.3)",
  color: "var(--white)",
  padding: "0.7rem 1.2rem",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.88rem",
  outline: "none",
  minWidth: "200px",
  borderRadius: "2px",
  cursor: "pointer"
};

export default Home;