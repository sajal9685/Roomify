import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/register", formData);
      alert(res.data.message);
      navigate("/login");
    } catch (error) {
      alert(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      background: "var(--cream)"
    }}>
      {/* LEFT PANEL */}
      <div style={{
        background: "var(--navy)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "4rem",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px", height: "600px", borderRadius: "50%",
          border: "1px solid rgba(201,168,76,0.12)", pointerEvents: "none"
        }} />

        <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "3.5rem", fontWeight: "700",
            color: "var(--white)", letterSpacing: "0.1em", marginBottom: "0.5rem"
          }}>
            <span style={{ color: "var(--gold)" }}>◈</span> ROOMIFY
          </div>
          <div style={{ width: "48px", height: "1px", background: "var(--gold)", margin: "1.25rem auto" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "2rem", textAlign: "left" }}>
            {[
              ["◉", "Verified listings only"],
              ["◈", "Book instantly, no waiting"],
              ["◎", "Flexible check-in & check-out"]
            ].map(([icon, text]) => (
              <div key={text} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <span style={{ color: "var(--gold)", fontSize: "1rem" }}>{icon}</span>
                <span style={{ color: "var(--gray-lt)", fontSize: "0.9rem" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "4rem 5rem"
      }}>
        <div style={{ maxWidth: "380px", width: "100%" }}>
          <p style={{
            fontSize: "0.75rem", letterSpacing: "0.2em",
            textTransform: "uppercase", color: "var(--terra)",
            marginBottom: "0.75rem", fontFamily: "'DM Sans', sans-serif"
          }}>Join Roomify</p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "2.8rem", fontWeight: "700",
            color: "var(--navy)", marginBottom: "0.5rem"
          }}>Create Account</h1>
          <div style={{ width: "40px", height: "2px", background: "var(--gold)", marginBottom: "2.5rem" }} />

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input type="text" name="name" placeholder="Your name" onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input type="email" name="email" placeholder="you@example.com" onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input type="password" name="password" placeholder="••••••••" onChange={handleChange} style={inputStyle} />
            </div>

            <button type="submit" disabled={loading} style={{
              background: "var(--navy)", color: "var(--white)",
              border: "none", padding: "1rem",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.85rem", letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "0.5rem", opacity: loading ? 0.7 : 1,
              transition: "background 0.2s"
            }}
            onMouseEnter={e => { if (!loading) e.target.style.background = "var(--terra)"; }}
            onMouseLeave={e => e.target.style.background = "var(--navy)"}
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p style={{ marginTop: "2rem", fontSize: "0.85rem", color: "var(--gray)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--terra)", textDecoration: "none", fontWeight: "500" }}>
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block", fontSize: "0.72rem",
  textTransform: "uppercase", letterSpacing: "0.1em",
  color: "var(--gray)", marginBottom: "0.4rem",
  fontFamily: "'DM Sans', sans-serif"
};

const inputStyle = {
  width: "100%", border: "none",
  borderBottom: "1.5px solid var(--gray-lt)",
  background: "transparent", padding: "0.75rem 0",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.95rem", color: "var(--text)",
  outline: "none", transition: "border-color 0.2s"
};

export default Register;