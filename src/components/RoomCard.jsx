import { Link } from "react-router-dom";

function RoomCard({ room }) {
  return (
    <div style={{
      background: "var(--white)",
      borderRadius: "4px",
      overflow: "hidden",
      boxShadow: "0 2px 16px rgba(15,31,46,0.08)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      display: "flex",
      flexDirection: "column"
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = "translateY(-5px)";
      e.currentTarget.style.boxShadow = "0 16px 40px rgba(15,31,46,0.15)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 2px 16px rgba(15,31,46,0.08)";
    }}
    >
{/* IMAGE */}
<div
  style={{
    position: "relative",
    overflow: "hidden",
    height: "220px"
  }}
>

  <img
    src={room.images?.[0] || room.image}
    alt={room.title}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.5s ease"
    }}
    onMouseEnter={(e) =>
      (e.target.style.transform = "scale(1.05)")
    }
    onMouseLeave={(e) =>
      (e.target.style.transform = "scale(1)")
    }
  />



  {/* CATEGORY PILL */}
  <span
    style={{
      position: "absolute",
      top: "1rem",
      left: "1rem",
      background: "var(--navy)",
      color: "var(--gold)",
      padding: "0.25rem 0.75rem",
      fontSize: "0.7rem",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: "500"
    }}
  >
    {room.category}
  </span>



  {/* VERIFIED DEALER */}
  {
    room.dealerVerified && (

      <span
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          background: "rgba(255,255,255,0.95)",
          color: "green",
          padding: "0.3rem 0.7rem",
          borderRadius: "20px",
          fontSize: "0.72rem",
          fontWeight: "600",
          fontFamily: "'DM Sans', sans-serif",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}
      >
        ✅ Verified
      </span>
    )
  }

</div>

      {/* CONTENT */}
      <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.5rem",
          fontWeight: "600",
          color: "var(--navy)",
          lineHeight: 1.2
        }}>
          {room.title}
        </h2>

        <p style={{ color: "var(--gray)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <span style={{ color: "var(--terra)" }}>◉</span> {room.location}
        </p>

        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "auto",
          paddingTop: "1rem",
          borderTop: "1px solid var(--cream-dk)"
        }}>
          <div>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.6rem",
              fontWeight: "700",
              color: "var(--navy)"
            }}>₹ {room.price}</span>
            <span style={{ fontSize: "0.75rem", color: "var(--gray)", marginLeft: "0.25rem" }}>/month</span>
          </div>

          <Link
            to={`/room/${room._id}`}
            style={{
              background: "var(--navy)",
              color: "var(--white)",
              padding: "0.55rem 1.25rem",
              textDecoration: "none",
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: "500",
              transition: "background 0.2s",
              borderRadius: "2px"
            }}
            onMouseEnter={e => e.target.style.background = "var(--terra)"}
            onMouseLeave={e => e.target.style.background = "var(--navy)"}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RoomCard;