import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard/Dashboard";

// We create a small helper component to handle the "should I show the navbar?" logic
const NavigationManager = () => {
  const location = useLocation();

  // If the URL is exactly "/dashboard", showNavbar will be false
  const showNavbar = location.pathname !== "/dashboard";

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <NavigationManager />
      </div>
    </Router>
  );
}

export default App;
