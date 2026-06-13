import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

// Why useNavigate?
// After creating a group we want to automatically
// send the user back to home page to see their new group.
// useNavigate gives us a function to do that programmatically.

function CreateGroup() {

  // Why one state object instead of separate states?
  // We have 4 fields — we could do useState for each one,
  // but grouping them in one object is cleaner and easier
  // to pass to Supabase in one go.

  const [form, setForm] = useState({
    name: "",
    subject: "",
    members: 1,
    level: "Beginner",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Why this handleChange function?
  // Instead of writing a separate onChange for every input,
  // we write one smart function that handles all of them.
  // [e.target.name] uses the input's name attribute to know
  // which field to update — very clean pattern.

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    //         ↑ spread operator — copy all existing values
    //           then overwrite only the changed field
  };

  const handleSubmit = async () => {
    // Basic validation — don't submit empty form
    if (!form.name || !form.subject) {
      setError("Please fill in group name and subject.");
      return;
    }

    setLoading(true);
    setError(null);

    // Why supabase.from("groups").insert()?
    // .from("groups") — target our groups table
    // .insert([form]) — insert a new row with our form data
    // It's that simple — Supabase handles the SQL for us!

    const { error } = await supabase
      .from("groups")
      .insert([{
        name: form.name,
        subject: form.subject,
        members: Number(form.members),
        level: form.level,
        description: form.description,
      }]);

    if (error) {
      setError("Something went wrong. Please try again.");
      console.error(error);
    } else {
      // Why navigate("/")?
      // Group was saved successfully!
      // Send user back to home to see their new group.
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
          style={{ color: "#a78bfa", fontSize: "14px", background: "none", border: "none", cursor: "pointer", marginBottom: "32px", display: "inline-block" }}
        >
          ← Back to groups
        </button>

        <h1 className="animate-slideInLeft" style={{ fontSize: "40px", fontWeight: "800", color: "white", margin: "24px 0 8px" }}>
          Create a group
        </h1>
        <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "40px" }}>
          Fill in the details to start your study group
        </p>

        {/* Why show error here?
            If something goes wrong we show a clear message
            so user knows what to fix — never fail silently. */}
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

        <div className="animate-fadeInUp" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          <div>
            <label style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "6px", display: "block" }}>
              Group name *
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Math Warriors"
              value={form.name}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "6px", display: "block" }}>
              Subject *
            </label>
            <input
              type="text"
              name="subject"
              placeholder="e.g. Calculus"
              value={form.subject}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "6px", display: "block" }}>
              Max members
            </label>
            <input
              type="number"
              name="members"
              placeholder="e.g. 10"
              value={form.members}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "6px", display: "block" }}>
              Level
            </label>
            <select
              name="level"
              value={form.level}
              onChange={handleChange}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option style={{ background: "#1a1a2e" }}>Beginner</option>
              <option style={{ background: "#1a1a2e" }}>Intermediate</option>
              <option style={{ background: "#1a1a2e" }}>Advanced</option>
            </select>
          </div>

          <div>
            <label style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "6px", display: "block" }}>
              Description
            </label>
            <textarea
              name="description"
              placeholder="What will your group study? Who should join?"
              value={form.description}
              onChange={handleChange}
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="glow-button"
            style={{
              width: "100%", padding: "14px",
              background: loading ? "rgba(124,58,237,0.5)" : "linear-gradient(135deg, #7c3aed, #4f46e5)",
              color: "white", border: "none",
              borderRadius: "12px", fontSize: "15px",
              fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
              marginTop: "8px", transition: "all 0.3s"
            }}
          >
            {loading ? "Creating..." : "Create group"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default CreateGroup;