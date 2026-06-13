import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [joined, setJoined] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);

  useEffect(() => {
    fetchGroup();
    fetchUser();
    fetchMembers();
  }, []);

  const fetchUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  };

  const fetchGroup = async () => {
    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
    } else {
      setGroup(data);
      checkMembership();
    }
    setLoading(false);
  };

  const checkMembership = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data } = await supabase
      .from("memberships")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("group_id", id)
      .maybeSingle();

    if (data) setJoined(true);
  };

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("memberships")
      .select("user_id, created_at")
      .eq("group_id", id);

    if (error) {
      console.error(error);
    } else {
      setGroupMembers(data);
    }
  };

  const handleJoin = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setJoinLoading(true);

    if (joined) {
      await supabase
        .from("memberships")
        .delete()
        .eq("user_id", user.id)
        .eq("group_id", id);

      setJoined(false);
    } else {
      await supabase
        .from("memberships")
        .insert([{ user_id: user.id, group_id: id }]);

      setJoined(true);
    }

    fetchMembers();
    setJoinLoading(false);
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

      <div style={{ position: "relative", zIndex: 1, maxWidth: "680px", margin: "0 auto", padding: "80px 24px 48px" }}>

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
            { label: "Members", value: groupMembers.length },
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

        {/* Members list */}
        <div className="animate-fadeInUp" style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px", padding: "24px",
          marginBottom: "24px"
        }}>
          <h2 style={{ color: "white", fontWeight: "700", marginBottom: "16px" }}>
            Members ({groupMembers.length})
          </h2>

          {groupMembers.length === 0 ? (
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              No members yet — be the first to join!
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {groupMembers.map((member, index) => (
                <div key={member.user_id} style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "10px 14px",
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.06)"
                }}>
                  <div style={{
                    width: "32px", height: "32px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "13px", fontWeight: "700", color: "white",
                    flexShrink: 0
                  }}>
                    {index + 1}
                  </div>

                  <div>
                    <p style={{ color: "#9ca3af", fontSize: "13px" }}>
                      Member #{index + 1}
                    </p>
                    <p style={{ color: "#6b7280", fontSize: "11px", marginTop: "2px" }}>
                      Joined {new Date(member.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {user && member.user_id === user.id && (
                    <span style={{
                      marginLeft: "auto",
                      background: "rgba(139,92,246,0.2)",
                      border: "1px solid rgba(139,92,246,0.3)",
                      color: "#c4b5fd", fontSize: "11px",
                      padding: "2px 10px", borderRadius: "999px"
                    }}>
                      You
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Join button */}
        <button
          onClick={handleJoin}
          disabled={joinLoading}
          className="glow-button"
          style={{
            width: "100%", padding: "16px",
            background: joined
              ? "linear-gradient(135deg, #059669, #047857)"
              : "linear-gradient(135deg, #7c3aed, #4f46e5)",
            color: "white", border: "none",
            borderRadius: "16px", fontSize: "16px",
            fontWeight: "700", cursor: joinLoading ? "not-allowed" : "pointer",
            transition: "all 0.3s"
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          {joinLoading ? "..." : joined ? "✓ Joined — Leave group" : "Join this group"}
        </button>

        {!user && (
          <p style={{ color: "#6b7280", fontSize: "13px", textAlign: "center", marginTop: "12px" }}>
            You need to{" "}
            <span onClick={() => navigate("/login")} style={{ color: "#a78bfa", cursor: "pointer" }}>
              login
            </span>
            {" "}to join a group
          </p>
        )}

      </div>
    </div>
  );
}

export default GroupDetail;