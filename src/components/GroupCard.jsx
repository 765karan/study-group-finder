import { Link } from "react-router-dom";

function GroupCard({ id, name, subject, members, level, cardIndex }) {

  const handleMouseEnter = (e) => {
    e.currentTarget.style.border = "1px solid rgba(139,92,246,0.5)";
    e.currentTarget.style.background = "rgba(139,92,246,0.08)";
    e.currentTarget.style.transform = "translateY(-4px)";
    e.currentTarget.style.boxShadow = "0 20px 40px rgba(139,92,246,0.15)";
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)";
    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <Link
      to={`/group/${id}`}
      className={`card-${cardIndex} animate-fadeInUp`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        display: "block",
        textDecoration: "none",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "20px",
        padding: "24px",
        transition: "all 0.3s ease",
        cursor: "pointer"
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "700", color: "white" }}>
          {name}
        </h2>
        <span style={{
          background: "rgba(139,92,246,0.2)",
          border: "1px solid rgba(139,92,246,0.3)",
          color: "#c4b5fd",
          fontSize: "12px",
          padding: "4px 12px",
          borderRadius: "999px"
        }}>
          {subject}
        </span>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#9ca3af", fontSize: "13px" }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {members} members
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#9ca3af", fontSize: "13px" }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {level}
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <span style={{ color: "#a78bfa", fontSize: "13px", fontWeight: "500", display: "flex", alignItems: "center", gap: "4px" }}>
          View group
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export default GroupCard;