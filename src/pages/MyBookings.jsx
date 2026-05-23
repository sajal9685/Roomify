import { useEffect, useState } from "react";
import API from "../services/api";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/mybookings");
      setBookings(res.data);
    } catch (error) { console.log(error); }
  };

  useEffect(() => { fetchBookings(); }, []);

  const cancelBooking = async (id) => {
    try {
      const res = await API.put(`/bookings/cancel/${id}`);
      alert(res.data.message);
      fetchBookings();
    } catch (error) { alert(error.response.data.message); }
  };

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      {/* PAGE HEADER */}
      <div style={{
        background: "var(--navy)",
        padding: "3.5rem 2.5rem",
        textAlign: "center"
      }}>
        <p style={{
          fontSize: "0.75rem", letterSpacing: "0.2em",
          textTransform: "uppercase", color: "var(--gold)",
          marginBottom: "0.75rem", fontFamily: "'DM Sans', sans-serif"
        }}>Your reservations</p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "3rem", fontWeight: "700", color: "var(--white)"
        }}>My Bookings</h1>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "3rem 2rem" }}>
        {bookings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 0", color: "var(--gray)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>◈</div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", marginBottom: "0.5rem" }}>
              No bookings yet
            </p>
            <p style={{ fontSize: "0.9rem" }}>Start exploring stays to make your first booking.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {bookings.map((booking) => (
              <div key={booking._id} style={{
                background: "var(--white)",
                borderRadius: "4px",
                overflow: "hidden",
                boxShadow: "0 2px 16px rgba(15,31,46,0.07)",
                display: "grid",
                gridTemplateColumns: "280px 1fr",
              }}>
                {/* IMAGE */}
                <div style={{ overflow: "hidden", height: "100%", minHeight: "200px" }}>
                  <img
                    src={booking.room.image}
                    alt={booking.room.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>

                {/* CONTENT */}
                <div style={{ padding: "1.75rem 2rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <h2 style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.7rem", fontWeight: "600", color: "var(--navy)"
                    }}>{booking.room.title}</h2>

                    <span style={{
                      padding: "0.3rem 0.9rem",
                      fontSize: "0.72rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: "600",
                      background: booking.status === "Booked" ? "rgba(46,125,50,0.1)" : "rgba(198,40,40,0.1)",
                      color: booking.status === "Booked" ? "#2e7d32" : "#c62828",
                      borderRadius: "2px"
                    }}>
                      {booking.status}
                    </span>
                  </div>

                  <p style={{ color: "var(--terra)", fontSize: "0.85rem", marginTop: "0.35rem" }}>
                    ◉ {booking.room.location}
                  </p>

                  <div style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "1rem", marginTop: "1.25rem",
                    paddingTop: "1.25rem",
                    borderTop: "1px solid var(--cream-dk)"
                  }}>
                    <InfoBlock label="Check-in" value={booking.checkIn.slice(0, 10)} />
                    <InfoBlock label="Check-out" value={booking.checkOut.slice(0, 10)} />
                    <InfoBlock label="Total" value={`₹ ${booking.totalPrice}`} />
                  </div>

                  {booking.status === "Booked" && (
                    <button
                      onClick={() => cancelBooking(booking._id)}
                      style={{
                        marginTop: "1.5rem",
                        background: "transparent",
                        color: "#c62828",
                        border: "1px solid #c62828",
                        padding: "0.5rem 1.25rem",
                        fontSize: "0.75rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif",
                        transition: "all 0.2s",
                        borderRadius: "2px"
                      }}
                      onMouseEnter={e => {
                        e.target.style.background = "#c62828";
                        e.target.style.color = "white";
                      }}
                      onMouseLeave={e => {
                        e.target.style.background = "transparent";
                        e.target.style.color = "#c62828";
                      }}
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div>
      <p style={{
        fontSize: "0.68rem", textTransform: "uppercase",
        letterSpacing: "0.1em", color: "var(--gray)",
        fontFamily: "'DM Sans', sans-serif", marginBottom: "0.25rem"
      }}>{label}</p>
      <p style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "1.1rem", color: "var(--navy)", fontWeight: "600"
      }}>{value}</p>
    </div>
  );
}

export default MyBookings;