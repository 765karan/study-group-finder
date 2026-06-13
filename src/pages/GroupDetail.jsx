import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroup();
  }, []);

  const fetchGroup = async () => {
    // Why .eq("id", id)?
    // .eq means "where id equals this value"
    // .single() means "expect exactly one row back"
    // instead of an array — since id is unique.

    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
    } else {
      setGroup(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#6b7280" }}>Loading group...</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0f", padding: "48px 24px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <button onClick={() => navigate("/")} style={{ color: "#a78bfa", background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}>
            ← Back to groups
          </button>
          <h1 style={{ color: "white", fontSize: "32px", fontWeight: "700", marginTop: "24px" }}>
            Group not found
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f" }}>

      <div style={{
        position: "fixed", top: "-100px", left: "50%", transform: "translateX(-50%)",
        width: "600px", height: "400px",
        background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "680px", margin: "0 auto", padding: "48px 24px" }}>

        <button
          onClick={() => navigate("/")}
          style={{ color: "#a78bfa", fontSize: "14px", background: "none", border: "none", cursor: "pointer", marginBottom: "32px" }}
        >
          ← Back to groups
        </button>

        {/* Header */}
        <div className="animate-slideInLeft" style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "40px", fontWeight: "800", color: "white", marginBottom: "12px" }}>
            {group.name}
          </h1>
          <span style={{
            background: "rgba(139,92,246,0.2)",
            border: "1px solid rgba(139,92,246,0.3)",
            color: "#c4b5fd", fontSize: "13px",
            padding: "6px 16px", borderRadius: "999px"
          }}>
            {group.subject}
          </span>
        </div>

        {/* Stats */}
        <div className="animate-fadeInUp" style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "16px", marginBottom: "24px"
        }}>
          {[
            { label: "Members", value: group.members },
            { label: "Level", value: group.level },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px", padding: "20px"
            }}>
              <p style={{ color: "#6b7280", fontSize: "12px", marginBottom: "8px" }}>
                {stat.label}
              </p>
              <p style={{ color: "white", fontSize: "28px", fontWeight: "700" }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Description */}
        {group.description && (
          <div className="animate-fadeInUp" style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px", padding: "24px", marginBottom: "24px"
          }}>
            <h2 style={{ color: "white", fontWeight: "700", marginBottom: "12px" }}>
              About this group
            </h2>
            <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: "1.6" }}>
              {group.description}
            </p>
          </div>
        )}

        {/* Join button */}
        <button
          className="glow-button"
          style={{
            width: "100%", padding: "16px",
            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
            color: "white", border: "none",
            borderRadius: "16px", fontSize: "16px",
            fontWeight: "700", cursor: "pointer",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          Join this group
        </button>

      </div>
    </div>
  );
}

export default GroupDetail;