import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const CLOUDINARY_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

function EditRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    category: "PG",
    dealerName: "",
    dealerPhone: "",
    dealerVerified: true,
    images: [],          // array of Cloudinary URLs
  });

  const [previews, setPreviews] = useState([]);   // { url, status: 'existing'|'uploading'|'done'|'error' }
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // ── Fetch existing room ──────────────────────────────────────────────────────
  const fetchRoom = async () => {
    try {
      const res = await API.get(`/rooms/${id}`);
      const d = res.data;
      setFormData({
        title:          d.title         || "",
        description:    d.description   || "",
        location:       d.location      || "",
        price:          d.price         || "",
        category:       d.category      || "PG",
        dealerName:     d.dealerName    || "",
        dealerPhone:    d.dealerPhone   || "",
        dealerVerified: d.dealerVerified ?? false,
        images:         d.images        || (d.image ? [d.image] : []),
      });
      // build previews from existing URLs
      setPreviews(
        (d.images || (d.image ? [d.image] : [])).map((url) => ({
          url,
          status: "existing",
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchRoom(); }, []);

  // ── Field change ─────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  };

  // ── Upload single file to Cloudinary ─────────────────────────────────────────
  const uploadToCloudinary = async (file, index) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: data }
    );
    if (!res.ok) throw new Error("Upload failed");
    const json = await res.json();
    return json.secure_url;
  };

  // ── Handle file selection / drop ──────────────────────────────────────────────
  const handleFiles = async (files) => {
    const accepted = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (!accepted.length) return;

    // Add placeholders
    const placeholders = accepted.map((f) => ({
      url: URL.createObjectURL(f),
      status: "uploading",
    }));
    setPreviews((prev) => [...prev, ...placeholders]);
    setUploading(true);

    const newUrls = [];
    for (let i = 0; i < accepted.length; i++) {
      const startIndex = previews.length + i;
      try {
        const url = await uploadToCloudinary(accepted[i], startIndex);
        newUrls.push(url);
        setPreviews((prev) =>
          prev.map((p, idx) =>
            idx === startIndex ? { url, status: "done" } : p
          )
        );
      } catch {
        setPreviews((prev) =>
          prev.map((p, idx) =>
            idx === startIndex ? { ...p, status: "error" } : p
          )
        );
      }
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newUrls],
    }));
    setUploading(false);
  };

  const handleFileInput = (e) => handleFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  // ── Remove photo ──────────────────────────────────────────────────────────────
  const removePhoto = (idx) => {
    const removed = previews[idx];
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((url) => url !== removed.url),
    }));
  };

  // ── Submit ────────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploading) return;
    setSaving(true);
    try {
      const res = await API.put(`/rooms/${id}`, formData);
      alert(res.data.message);
      navigate("/admin");
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>

      {/* PAGE HEADER */}
      <div style={{
        background: "var(--navy)",
        padding: "3.5rem 2.5rem",
        textAlign: "center",
      }}>
        <p style={overlineStyle}>Admin · Room Management</p>
        <h1 style={pageTitleStyle}>Edit Room</h1>
      </div>

      {/* FORM WRAPPER */}
      <div style={{ maxWidth: "820px", margin: "3rem auto", padding: "0 2rem 4rem" }}>
        <form onSubmit={handleSubmit}>

          {/* ── PHOTO UPLOAD SECTION ─────────────────────────────────────── */}
          <Section title="Room Photos" subtitle="Upload multiple photos — first image is the cover">

            {/* Drop zone */}
            <div
              onClick={() => fileInputRef.current.click()}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              style={{
                border: `2px dashed ${dragOver ? "var(--terra)" : "var(--gray-lt)"}`,
                borderRadius: "4px",
                padding: "2.5rem",
                textAlign: "center",
                cursor: "pointer",
                background: dragOver ? "rgba(194,113,79,0.05)" : "var(--white)",
                transition: "all 0.2s",
                marginBottom: "1.25rem",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem", opacity: 0.4 }}>◈</div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", color: "var(--navy)", marginBottom: "0.3rem" }}>
                Drop photos here or click to browse
              </p>
              <p style={{ fontSize: "0.78rem", color: "var(--gray)", letterSpacing: "0.04em" }}>
                JPG, PNG, WEBP · Multiple files supported
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileInput}
              style={{ display: "none" }}
            />

            {/* Preview grid */}
            {previews.length > 0 && (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: "0.85rem",
                marginTop: "0.5rem",
              }}>
                {previews.map((p, i) => (
                  <div key={i} style={{
                    position: "relative",
                    borderRadius: "4px",
                    overflow: "hidden",
                    border: i === 0 ? "2px solid var(--gold)" : "1px solid var(--gray-lt)",
                    aspectRatio: "1",
                  }}>
                    <img
                      src={p.url}
                      alt=""
                      style={{
                        width: "100%", height: "100%",
                        objectFit: "cover",
                        opacity: p.status === "uploading" ? 0.45 : 1,
                        transition: "opacity 0.3s",
                      }}
                    />

                    {/* Cover badge */}
                    {i === 0 && (
                      <span style={{
                        position: "absolute", top: "0.4rem", left: "0.4rem",
                        background: "var(--gold)", color: "var(--navy)",
                        fontSize: "0.6rem", letterSpacing: "0.1em",
                        textTransform: "uppercase", padding: "0.2rem 0.5rem",
                        fontFamily: "'DM Sans', sans-serif", fontWeight: "600",
                      }}>Cover</span>
                    )}

                    {/* Uploading spinner */}
                    {p.status === "uploading" && (
                      <div style={{
                        position: "absolute", inset: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: "rgba(15,31,46,0.4)",
                      }}>
                        <div style={{
                          width: "24px", height: "24px",
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTopColor: "white",
                          borderRadius: "50%",
                          animation: "spin 0.7s linear infinite",
                        }} />
                      </div>
                    )}

                    {/* Error overlay */}
                    {p.status === "error" && (
                      <div style={{
                        position: "absolute", inset: 0, background: "rgba(198,40,40,0.7)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "white", fontSize: "0.72rem", letterSpacing: "0.06em",
                      }}>Failed</div>
                    )}

                    {/* Remove btn */}
                    {p.status !== "uploading" && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removePhoto(i); }}
                        style={{
                          position: "absolute", top: "0.35rem", right: "0.35rem",
                          background: "rgba(15,31,46,0.75)",
                          color: "white", border: "none",
                          width: "22px", height: "22px",
                          borderRadius: "50%", cursor: "pointer",
                          fontSize: "0.75rem", lineHeight: "22px",
                          textAlign: "center", padding: 0,
                        }}
                      >×</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* ── ROOM DETAILS ─────────────────────────────────────────────── */}
          <Section title="Room Details" subtitle="Basic listing information">
            <FormField label="Room Title">
              <input
                name="title" value={formData.title}
                onChange={handleChange} required
                placeholder="e.g. Cozy Studio near IIT"
                style={inputStyle}
              />
            </FormField>

            <FormField label="Description">
              <textarea
                name="description" value={formData.description}
                onChange={handleChange} required rows={4}
                placeholder="Describe the room, amenities, and surroundings…"
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.65 }}
              />
            </FormField>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              <FormField label="Location">
                <input
                  name="location" value={formData.location}
                  onChange={handleChange} required
                  placeholder="City, Area"
                  style={inputStyle}
                />
              </FormField>

              <FormField label="Monthly Price (₹)">
                <input
                  name="price" type="number" value={formData.price}
                  onChange={handleChange} required
                  placeholder="e.g. 8000"
                  style={inputStyle}
                />
              </FormField>
            </div>

            <FormField label="Category">
              <select name="category" value={formData.category} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="PG">PG</option>
                <option value="Hostel">Hostel</option>
                <option value="Room">Room</option>
              </select>
            </FormField>
          </Section>

          {/* ── DEALER INFO ───────────────────────────────────────────────── */}
          <Section title="Dealer Information" subtitle="Contact details shown to potential tenants">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              <FormField label="Dealer Name">
                <input
                  name="dealerName" value={formData.dealerName}
                  onChange={handleChange}
                  placeholder="Full name"
                  style={inputStyle}
                />
              </FormField>

              <FormField label="Phone Number">
                <input
                  name="dealerPhone" value={formData.dealerPhone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  style={inputStyle}
                />
              </FormField>
            </div>

            {/* Verified toggle */}
            <div
              onClick={() => setFormData({ ...formData, dealerVerified: !formData.dealerVerified })}
              style={{
                display: "flex", alignItems: "center", gap: "1rem",
                padding: "1rem 1.25rem",
                background: formData.dealerVerified ? "rgba(46,125,50,0.06)" : "var(--white)",
                border: `1px solid ${formData.dealerVerified ? "rgba(46,125,50,0.3)" : "var(--gray-lt)"}`,
                borderRadius: "4px",
                cursor: "pointer",
                transition: "all 0.2s",
                marginTop: "0.25rem",
                userSelect: "none",
              }}
            >
              {/* Custom toggle */}
              <div style={{
                width: "44px", height: "24px",
                borderRadius: "12px",
                background: formData.dealerVerified ? "#2e7d32" : "var(--gray-lt)",
                position: "relative", flexShrink: 0,
                transition: "background 0.2s",
              }}>
                <div style={{
                  position: "absolute",
                  top: "3px",
                  left: formData.dealerVerified ? "23px" : "3px",
                  width: "18px", height: "18px",
                  borderRadius: "50%",
                  background: "white",
                  transition: "left 0.2s",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                }} />
              </div>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", fontWeight: "500", color: "var(--navy)" }}>
                  Verified Dealer
                </p>
                <p style={{ fontSize: "0.75rem", color: "var(--gray)", marginTop: "0.1rem" }}>
                  {formData.dealerVerified ? "Badge shown on listing" : "No verification badge"}
                </p>
              </div>
              {formData.dealerVerified && (
                <span style={{
                  marginLeft: "auto",
                  background: "rgba(46,125,50,0.1)",
                  color: "#2e7d32",
                  padding: "0.25rem 0.75rem",
                  fontSize: "0.7rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: "600",
                  borderRadius: "2px",
                }}>✓ Verified</span>
              )}
            </div>
          </Section>

          {/* ── ACTIONS ──────────────────────────────────────────────────── */}
          <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
            <button
              type="button"
              onClick={() => navigate("/admin")}
              style={{
                flex: 1,
                background: "transparent",
                color: "var(--navy)",
                border: "1px solid var(--gray-lt)",
                padding: "1rem",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.85rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: "2px",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--navy)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--gray-lt)"}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || uploading}
              style={{
                flex: 2,
                background: (saving || uploading) ? "var(--navy-mid)" : "var(--navy)",
                color: "var(--white)",
                border: "none",
                padding: "1rem",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.85rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: (saving || uploading) ? "not-allowed" : "pointer",
                borderRadius: "2px",
                opacity: (saving || uploading) ? 0.75 : 1,
                transition: "background 0.2s",
              }}
              onMouseEnter={e => { if (!saving && !uploading) e.currentTarget.style.background = "var(--terra)"; }}
              onMouseLeave={e => e.currentTarget.style.background = (saving || uploading) ? "var(--navy-mid)" : "var(--navy)"}
            >
              {uploading ? "Uploading Photos…" : saving ? "Saving Changes…" : "Save Changes"}
            </button>
          </div>

        </form>
      </div>

      {/* Spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function Section({ title, subtitle, children }) {
  return (
    <div style={{
      background: "var(--white)",
      borderRadius: "4px",
      padding: "2rem 2.25rem",
      boxShadow: "0 2px 16px rgba(15,31,46,0.06)",
      borderTop: "3px solid var(--gold)",
      marginBottom: "1.75rem",
    }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.55rem", fontWeight: "600",
          color: "var(--navy)", marginBottom: "0.2rem",
        }}>{title}</h2>
        {subtitle && (
          <p style={{ fontSize: "0.78rem", color: "var(--gray)", letterSpacing: "0.03em" }}>
            {subtitle}
          </p>
        )}
        <div style={{ width: "36px", height: "2px", background: "var(--terra)", marginTop: "0.6rem" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {children}
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label style={{
        display: "block",
        fontSize: "0.7rem",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "var(--gray)",
        marginBottom: "0.45rem",
        fontFamily: "'DM Sans', sans-serif",
      }}>{label}</label>
      {children}
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const overlineStyle = {
  fontSize: "0.75rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "var(--gold)",
  marginBottom: "0.75rem",
  fontFamily: "'DM Sans', sans-serif",
};

const pageTitleStyle = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: "3rem",
  fontWeight: "700",
  color: "var(--white)",
};

const inputStyle = {
  width: "100%",
  border: "1px solid var(--gray-lt)",
  background: "var(--cream)",
  padding: "0.85rem 1rem",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.9rem",
  color: "var(--text)",
  outline: "none",
  borderRadius: "2px",
  transition: "border-color 0.2s",
};

export default EditRoom;