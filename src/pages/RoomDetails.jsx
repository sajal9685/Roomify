import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: ""
  });

  const calculateDays = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;

    const checkInDate = new Date(bookingData.checkIn);
    const checkOutDate = new Date(bookingData.checkOut);

    const diffTime = checkOutDate - checkInDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays > 0 ? diffDays : 0;
  };

  const totalDays = calculateDays();
  const totalAmount = room ? totalDays * room.price : 0;

  const fetchRoom = async () => {
    try {
      const res = await API.get(`/rooms/${id}`);

      setRoom(res.data);

      const allImages = res.data.images?.length
        ? res.data.images
        : [res.data.image];

      setSelectedImage(allImages[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRoom();
  }, []);

  const handleChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        state: {
          from: `/room/${id}`
        }
      });

      return;
    }

    try {
      const res = await API.post("/bookings", {
        room: room._id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        totalPrice: totalAmount
      });

      alert(res.data.message);
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    }
  };

  if (!room) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.6rem",
          color: "var(--navy)"
        }}
      >
        <span
          style={{
            marginRight: "0.75rem",
            color: "var(--gold)"
          }}
        >
          ◈
        </span>
        Loading stay details…
      </div>
    );
  }

  const roomImages = room.images?.length ? room.images : [room.image];

  return (
    <div
      style={{
        background: "var(--cream)",
        minHeight: "100vh"
      }}
    >
      {/* HERO IMAGE */}
      <div
        style={{
          height: "460px",
          overflow: "hidden",
          position: "relative"
        }}
      >
        <img
          src={selectedImage}
          alt={room.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(15,31,46,0.2), rgba(15,31,46,0.65))"
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "2.5rem",
            left: "3rem"
          }}
        >
          <span
            style={{
              background: "var(--terra)",
              color: "var(--white)",
              padding: "0.3rem 0.9rem",
              fontSize: "0.72rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontFamily: "'DM Sans', sans-serif"
            }}
          >
            {room.category}
          </span>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "var(--white)",
              fontWeight: "700",
              marginTop: "0.75rem"
            }}
          >
            {room.title}
          </h1>

          <p
            style={{
              color: "var(--gold)",
              fontSize: "0.9rem",
              marginTop: "0.4rem"
            }}
          >
            ◉ {room.location}
          </p>
        </div>
      </div>

      {/* SMALL CLICKABLE IMAGES */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "1.5rem auto 0",
          padding: "0 2rem",
          display: "flex",
          gap: "1rem",
          overflowX: "auto"
        }}
      >
        {roomImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`room-${index}`}
            onClick={() => setSelectedImage(img)}
            style={{
              width: "120px",
              height: "80px",
              objectFit: "cover",
              borderRadius: "6px",
              cursor: "pointer",
              border:
                selectedImage === img
                  ? "3px solid var(--gold)"
                  : "2px solid transparent",
              opacity: selectedImage === img ? 1 : 0.75
            }}
          />
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "3rem 2rem",
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: "3rem",
          alignItems: "start"
        }}
      >
        {/* LEFT SECTION */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              marginBottom: "2rem"
            }}
          >
            <div
              style={{
                marginTop: "1.5rem",
                padding: "1rem",
                background: "var(--white)",
                border: "1px solid var(--gold)"
              }}
            >
              <h3>Dealer Details</h3>

              <p>Name: {room.dealerName}</p>
              <p>Phone: {room.dealerPhone}</p>

              {room.dealerVerified && (
                <p style={{ color: "green", fontWeight: "bold" }}>
                  ✅ Verified Dealer
                </p>
              )}
            </div>

            <div>
              <p
                style={{
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--gray)"
                }}
              >
                Price Per Day
              </p>

              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "2.5rem",
                  fontWeight: "700",
                  color: "var(--navy)"
                }}
              >
                ₹ {room.price}
              </p>
            </div>
          </div>

          <div
            style={{
              width: "48px",
              height: "2px",
              background: "var(--gold)",
              marginBottom: "1.5rem"
            }}
          />

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.6rem",
              color: "var(--navy)",
              marginBottom: "1rem"
            }}
          >
            About this Stay
          </h2>

          <p
            style={{
              color: "#4a4a4a",
              lineHeight: "1.8",
              fontSize: "0.95rem"
            }}
          >
            {room.description}
          </p>

          {/* FEATURE TAGS */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              marginTop: "2rem"
            }}
          >
            {["Verified Listing", "Instant Booking", "24h Support"].map(
              (f) => (
                <span
                  key={f}
                  style={{
                    border: "1px solid var(--gold)",
                    color: "var(--navy)",
                    padding: "0.4rem 1rem",
                    fontSize: "0.75rem",
                    letterSpacing: "0.08em",
                    fontFamily: "'DM Sans', sans-serif"
                  }}
                >
                  {f}
                </span>
              )
            )}
          </div>
        </div>

        {/* BOOKING CARD */}
        <div
          style={{
            background: "var(--white)",
            padding: "2rem",
            boxShadow: "0 4px 24px rgba(15,31,46,0.1)",
            borderTop: "3px solid var(--gold)",
            borderRadius: "4px"
          }}
        >
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.6rem",
              color: "var(--navy)",
              marginBottom: "0.4rem"
            }}
          >
            Reserve Your Stay
          </h3>

          <div
            style={{
              width: "40px",
              height: "2px",
              background: "var(--terra)",
              marginBottom: "1.5rem"
            }}
          />

          <form
            onSubmit={handleBooking}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem"
            }}
          >
            <div>
              <label style={labelStyle}>Check-in Date</label>

              <input
                type="date"
                name="checkIn"
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Check-out Date</label>

              <input
                type="date"
                name="checkOut"
                onChange={handleChange}
                required
                style={inputStyle}
                min={bookingData.checkIn}
              />
            </div>

            {totalDays > 0 && (
              <div
                style={{
                  background: "var(--cream)",
                  padding: "1rem",
                  border: "1px solid var(--gold)",
                  marginTop: "0.5rem"
                }}
              >
                <p
                  style={{
                    marginBottom: "0.5rem",
                    color: "var(--navy)",
                    fontWeight: "600"
                  }}
                >
                  Total Days: {totalDays}
                </p>

                <p
                  style={{
                    fontSize: "1.2rem",
                    color: "var(--terra)",
                    fontWeight: "700"
                  }}
                >
                  Total Price: ₹ {totalAmount}
                </p>
              </div>
            )}

            <button
              type="submit"
              style={{
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
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) =>
                (e.target.style.background = "var(--terra)")
              }
              onMouseLeave={(e) =>
                (e.target.style.background = "var(--navy)")
              }
            >
              Book Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "var(--gray)",
  marginBottom: "0.4rem",
  fontFamily: "'DM Sans', sans-serif"
};

const inputStyle = {
  width: "100%",
  border: "1px solid var(--gray-lt)",
  background: "var(--cream)",
  padding: "0.75rem 1rem",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.9rem",
  color: "var(--text)",
  outline: "none",
  borderRadius: "2px"
};

export default RoomDetails;