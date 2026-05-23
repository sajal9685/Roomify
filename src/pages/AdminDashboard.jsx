import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [activeTab, setActiveTab] = useState("bookings");

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings");
      setBookings(res.data);
    } catch (error) { console.log(error); }
  };

  const fetchRooms = async () => {
    try {
      const res = await API.get("/rooms");
      setRooms(res.data);
    } catch (error) { console.log(error); }
  };

  useEffect(() => { fetchBookings(); fetchRooms(); }, []);

  const deleteRoom = async (id) => {
    try {
      const res = await API.delete(`/rooms/${id}`);
      alert(res.data.message);
      fetchRooms();
    } catch (error) { alert(error.response.data.message); }
  };

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      {/* HEADER */}
      <div style={{ background: "var(--navy)", padding: "3rem 2.5rem" }}>
        <p style={{
          fontSize: "0.72rem", letterSpacing: "0.2em",
          textTransform: "uppercase", color: "var(--gold)",
          marginBottom: "0.5rem", fontFamily: "'DM Sans', sans-serif"
        }}>Control Center</p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "2.8rem", fontWeight: "700", color: "var(--white)"
        }}>Admin Dashboard</h1>

        {/* STATS ROW */}
        <div style={{
          display: "flex", gap: "2.5rem", marginTop: "2rem"
        }}>
          <StatChip label="Total Bookings" value={bookings.length} />
          <StatChip label="Active Rooms" value={rooms.length} />
          <StatChip
            label="Confirmed"
            value={bookings.filter(b => b.status === "Booked").length}
            accent
          />
        </div>
      </div>

      {/* TABS */}
      <div style={{
        background: "var(--navy-mid)",
        display: "flex",
        paddingLeft: "2.5rem",
        borderTop: "1px solid rgba(255,255,255,0.05)"
      }}>
        {["bookings", "rooms"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            background: "transparent",
            color: activeTab === tab ? "var(--gold)" : "var(--gray-lt)",
            border: "none",
            borderBottom: activeTab === tab ? "2px solid var(--gold)" : "2px solid transparent",
            padding: "1rem 1.75rem",
            fontSize: "0.8rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: "500",
            transition: "color 0.2s"
          }}>
            {tab === "bookings" ? "All Bookings" : "Manage Rooms"}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2.5rem 2rem" }}>

        {/* BOOKINGS TAB */}
        {activeTab === "bookings" && (
          <>
            <SectionTitle title="All Bookings" subtitle={`${bookings.length} total reservations`} />
            <div style={{
              background: "var(--white)",
              borderRadius: "4px",
              overflow: "hidden",
              boxShadow: "0 2px 16px rgba(15,31,46,0.07)"
            }}>
              {/* Table header */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "2fr 1.5fr 1fr 1fr",
                padding: "0.85rem 1.5rem",
                background: "var(--navy)",
                color: "var(--gray-lt)",
                fontSize: "0.68rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontFamily: "'DM Sans', sans-serif"
              }}>
                <span>Room</span><span>Guest</span><span>Amount</span><span>Status</span>
              </div>

              {bookings.map((booking, i) => (
                <div key={booking._id} style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.5fr 1fr 1fr",
                  padding: "1.1rem 1.5rem",
                  alignItems: "center",
                  borderBottom: "1px solid var(--cream-dk)",
                  background: i % 2 === 0 ? "var(--white)" : "var(--cream)"
                }}>
                  <div>
                    <p style={{ fontWeight: "500", color: "var(--navy)", fontSize: "0.9rem" }}>
                      {booking.room?.title}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: "0.88rem", color: "var(--text)" }}>{booking.user?.name}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--gray)" }}>{booking.user?.email}</p>
                  </div>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: "600", color: "var(--navy)" }}>
                    ₹ {booking.totalPrice}
                  </p>
                  <span style={{
                    display: "inline-block",
                    padding: "0.25rem 0.75rem",
                    fontSize: "0.7rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    fontWeight: "600",
                    fontFamily: "'DM Sans', sans-serif",
                    background: booking.status === "Booked" ? "rgba(46,125,50,0.1)" : "rgba(198,40,40,0.1)",
                    color: booking.status === "Booked" ? "#2e7d32" : "#c62828",
                    borderRadius: "2px"
                  }}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ROOMS TAB */}
        {activeTab === "rooms" && (
          <>
            <SectionTitle title="Manage Rooms" subtitle={`${rooms.length} listings`} />
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.5rem"
            }}>
              {rooms.map((room) => (
                <div key={room._id} style={{
                  background: "var(--white)",
                  borderRadius: "4px",
                  overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(15,31,46,0.07)"
                }}>
                  <div style={{ height: "180px", overflow: "hidden" }}>
                    <img src={room.image} alt={room.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ padding: "1.25rem" }}>
                    <h3 style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.35rem", color: "var(--navy)", marginBottom: "0.3rem"
                    }}>{room.title}</h3>
                    <p style={{ color: "var(--gray)", fontSize: "0.82rem", marginBottom: "0.25rem" }}>
                      ◉ {room.location}
                    </p>
                    <p style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.2rem", fontWeight: "600",
                      color: "var(--navy)", marginBottom: "1rem"
                    }}>₹ {room.price}</p>
                   <div style={{ display: "flex", gap: "0.75rem" }}>

  <Link
    to={`/edit-room/${room._id}`}
    style={{
      background: "transparent",
      color: "var(--navy)",
      border: "1px solid var(--navy)",
      padding: "0.45rem 1rem",
      fontSize: "0.72rem",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif",
      transition: "all 0.2s",
      borderRadius: "2px",
      textDecoration: "none"
    }}
  >
    Edit
  </Link>

  <button
    onClick={() => deleteRoom(room._id)}
    style={{
      background: "transparent",
      color: "#c62828",
      border: "1px solid #c62828",
      padding: "0.45rem 1rem",
      fontSize: "0.72rem",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif",
      transition: "all 0.2s",
      borderRadius: "2px"
    }}
  >
    Delete
  </button>

</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatChip({ label, value, accent }) {
  return (
    <div style={{
      borderLeft: `2px solid ${accent ? "var(--terra)" : "var(--gold)"}`,
      paddingLeft: "1rem"
    }}>
      <p style={{
        fontSize: "0.68rem", letterSpacing: "0.12em",
        textTransform: "uppercase", color: "var(--gray-lt)",
        fontFamily: "'DM Sans', sans-serif", marginBottom: "0.2rem"
      }}>{label}</p>
      <p style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "2rem", fontWeight: "700",
        color: accent ? "var(--terra-lt)" : "var(--gold)"
      }}>{value}</p>
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "1.9rem", color: "var(--navy)"
      }}>{title}</h2>
      <p style={{ color: "var(--gray)", fontSize: "0.85rem", marginTop: "0.2rem" }}>{subtitle}</p>
      <div style={{ width: "40px", height: "2px", background: "var(--gold)", marginTop: "0.6rem" }} />
    </div>
  );
}

export default AdminDashboard;