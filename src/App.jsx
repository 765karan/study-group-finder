// Why these imports?
// BrowserRouter — wraps the whole app, enables routing
// Routes — container for all your routes
// Route — maps a URL path to a component

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateGroup from "./pages/CreateGroup";
import GroupDetail from "./pages/GroupDetail";

function App() {
  return (
    // Why BrowserRouter wraps everything?
    // It listens to URL changes and tells Routes which
    // component to show. Everything inside it can use
    // React Router features like Link and useParams.

    <BrowserRouter>
      <Routes>
        {/* path="/" means show Home when URL is localhost:5173/ */}
        <Route path="/" element={<Home />} />

        {/* path="/create" shows CreateGroup page */}
        <Route path="/create" element={<CreateGroup />} />

        {/* :id is a dynamic segment — matches /group/1, /group/2 etc.
            useParams() in GroupDetail reads this :id value */}
        <Route path="/group/:id" element={<GroupDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;