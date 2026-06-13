import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    // Why signInWithPassword?
    // Supabase Auth handles everything — hashing,
    // session tokens, security. We just pass email
    // and password and it does the rest.

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      // Login successful — go to home
      navigate("/");
    }

    setLoading(false);
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "white",
    borderRadius: "12px",
    padding: "12px 16px",
    fontSize: "14px",
    outline: "none",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>

      <div style={{
        position: "fixed", top: "-100px", left: "50%", transform: "translateX(-50%)",
        width: "600px", height: "400px",
        background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0
      }} />

      <div className="animate-fadeInUp" style={{
        position: "relative", zIndex: 1,
        width: "100%", maxWidth: "420px",
        margin: "0 auto", padding: "0 24px"
      }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "800", color: "white", marginBottom: "8px" }}>
            Welcome back
          </h1>
          <p style={{ color: "#6b7280", fontSize: "14px" }}>
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px", padding: "32px"
        }}>

          {error && (
            <div style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#fca5a5", borderRadius: "12px",
              padding: "12px 16px", marginBottom: "24px",
              fontSize: "14px"
            }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            <div>
              <label style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "6px", display: "block" }}>
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "6px", display: "block" }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="glow-button"
              style={{
                width: "100%", padding: "14px",
                background: loading ? "rgba(124,58,237,0.5)" : "linear-gradient(135deg, #7c3aed, #4f46e5)",
                color: "white", border: "none",
                borderRadius: "12px", fontSize: "15px",
                fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
                marginTop: "8px"
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </div>

          {/* Link to signup */}
          <p style={{ color: "#6b7280", fontSize: "14px", textAlign: "center", marginTop: "24px" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#a78bfa", textDecoration: "none", fontWeight: "600" }}>
              Sign up
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;