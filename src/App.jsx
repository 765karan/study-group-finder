import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import Home from "./pages/Home";
import CreateGroup from "./pages/CreateGroup";
import GroupDetail from "./pages/GroupDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";

// Why ProtectedRoute component?
// It wraps any page that requires login.
// If user is not logged in → redirect to /login.
// If logged in → show the page normally.
// This is the standard pattern in every real app.

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
  }, []);

  // Why show nothing while loading?
  // We need to check auth status first.
  // Without this, page flashes before redirecting.

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0a0a0f",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <p style={{ color: "#6b7280" }}>Loading...</p>
      </div>
    );
  }

  // Why Navigate?
  // If no user found → silently redirect to /login.
  // User never sees the protected page.

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/group/:id" element={<GroupDetail />} />

        {/* Why wrap CreateGroup in ProtectedRoute?
            Only logged in users can create groups.
            Anyone trying to visit /create without
            being logged in gets sent to /login. */}
        <Route path="/create" element={
          <ProtectedRoute>
            <CreateGroup />
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;