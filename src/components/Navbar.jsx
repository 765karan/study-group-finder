import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Why getSession?
    // Checks if someone is already logged in
    // when the page loads.

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Why onAuthStateChange?
    // Listens for login/logout events in real time.
    // When user logs in → updates navbar instantly.
    // When user logs out → clears user from navbar.

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0,
      zIndex: 100,
      background: "rgba(10,10,15,0.8)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      padding: "0 24px",
      height: "60px",
      display: "flex", alignItems: "center", justifyContent: "space-between"
    }}>

      {/* Logo */}
      <Link to="/" style={{ textDecoration: "none" }}>
        <span style={{
          fontSize: "18px", fontWeight: "800", color: "white",
        }}>
          Study Group{" "}
          <span style={{
            background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Finder
          </span>
        </span>
      </Link>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {user ? (
          <>
            {/* Show user email */}
            <span style={{
              color: "#6b7280", fontSize: "13px",
              maxWidth: "200px", overflow: "hidden",
              textOverflow: "ellipsis", whiteSpace: "nowrap"
            }}>
              {user.email}
            </span>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#9ca3af", padding: "6px 14px",
                borderRadius: "8px", fontSize: "13px",
                cursor: "pointer", transition: "all 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{
              color: "#9ca3af", fontSize: "14px",
              textDecoration: "none", fontWeight: "500"
            }}>
              Login
            </Link>
            <Link to="/signup" style={{
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              color: "white", padding: "8px 16px",
              borderRadius: "8px", fontSize: "14px",
              textDecoration: "none", fontWeight: "600"
            }}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;