import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import GroupCard from "../components/GroupCard";
import { supabase } from "../lib/supabase";

// Why remove the hardcoded groups array?
// Data now lives in Supabase database — not in our code.
// We fetch it fresh every time the page loads.

function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  // Why two new states?
  // groups — holds data fetched from database
  // loading — tracks if data is still being fetched
  // Without loading state, user sees empty screen briefly
  // while data is being fetched — bad UX.

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Why useEffect?
  // useEffect runs code AFTER the component appears on screen.
  // Perfect for fetching data — we don't want to block
  // rendering while waiting for the database response.
  // The empty [] at the end means "run this only once
  // when the page first loads" — not on every re-render.

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    // Why async/await?
    // Fetching from database takes time — it's not instant.
    // async/await lets us wait for the response without
    // freezing the whole app. Think of it like ordering food —
    // you don't stand frozen at the counter, you sit and wait.

    const { data, error } = await supabase
      .from("groups")   // which table
      .select("*");     // which columns (* means all)

    if (error) {
      console.error("Error fetching groups:", error);
    } else {
      setGroups(data);
    }

    setLoading(false);
  };

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", padding: "0" }}>

      <div style={{
        position: "fixed", top: "-100px", left: "50%", transform: "translateX(-50%)",
        width: "600px", height: "400px",
        background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: "680px", margin: "0 auto",
        padding: "80px 24px 48px 24px"
      }}>

        {/* Header */}
        <div className="animate-slideInLeft" style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ color: "#a78bfa", fontSize: "11px", letterSpacing: "3px", marginBottom: "8px" }}>
                BETA
              </p>
              <h1 style={{ fontSize: "42px", fontWeight: "800", color: "white", lineHeight: 1.1 }}>
                Study Group{" "}
                <span style={{
                  background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
                  Finder
                </span>
              </h1>
              <p style={{ color: "#6b7280", marginTop: "8px", fontSize: "14px" }}>
                Find your perfect study group
              </p>
            </div>

            <Link to="/create" className="glow-button" style={{
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              color: "white", padding: "10px 20px",
              borderRadius: "12px", fontSize: "14px",
              fontWeight: "600", textDecoration: "none",
              whiteSpace: "nowrap", marginTop: "8px",
            }}>
              + Create group
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="animate-fadeInUp" style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px", marginBottom: "32px"
        }}>
          {[
            { label: "Total groups", value: groups.length },
            { label: "Total members", value: groups.reduce((a, g) => a + g.members, 0) },
            { label: "Subjects", value: new Set(groups.map(g => g.subject)).size },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px", padding: "16px",
              textAlign: "center"
            }}>
              <p style={{ fontSize: "28px", fontWeight: "700", color: "#a78bfa" }}>
                {stat.value}
              </p>
              <p style={{ color: "#6b7280", fontSize: "12px", marginTop: "4px" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="animate-fadeInUp" style={{ position: "relative", marginBottom: "24px" }}>
          <svg style={{
            position: "absolute", left: "16px", top: "50%",
            transform: "translateY(-50%)", width: "16px", height: "16px"
          }} fill="none" stroke="#6b7280" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glow-input"
            style={{
              width: "100%", background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "white", borderRadius: "12px",
              padding: "12px 16px 12px 44px", fontSize: "14px",
            }}
          />
        </div>

        {/* Why show loading state?
            Database fetch takes 200-500ms.
            Without this the user sees an empty list briefly.
            This shows a friendly message instead. */}

        {loading ? (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              Loading groups...
            </p>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {filteredGroups.map((group, index) => (
                <GroupCard
                  key={group.id}
                  id={group.id}
                  name={group.name}
                  subject={group.subject}
                  members={group.members}
                  level={group.level}
                  cardIndex={index + 1}
                />
              ))}
            </div>

            {filteredGroups.length === 0 && !loading && (
              <div style={{ textAlign: "center", padding: "64px 0" }}>
                <p style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</p>
                <p style={{ color: "#9ca3af" }}>No groups found</p>
                <p style={{ color: "#4b5563", fontSize: "13px", marginTop: "4px" }}>
                  Try a different search term
                </p>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

export default Home;