import React, { useState } from "react";
import { Search, ShieldAlert, User, Database, Moon, LogIn } from "lucide-react";
import "./Dashboard.css";

// --- MOCK DATA SERVICE ---
const MOCK_DB = {
  areas: {
    "Siltara Phase-II": {
      metrics: {
        complianceHealth: 85.5,
        totalEncroached: 1250,
        revenueAtRisk: 250000,
      },
      geometry: {
        intended: "M10,10 L90,10 L90,90 L10,90 Z",
        existing: "M10,10 L92,12 L88,90 L10,90 Z",
        encroached: "M90,10 L92,12 L90,20 Z",
        unused: "M50,50 L70,50 L70,70 L50,70 Z",
      },
      plots: [
        {
          id: "PLOT_B2",
          owner: "Jindal Steel",
          status: "ENCROACHED",
          deviation: 15,
        },
        {
          id: "PLOT_C1",
          owner: "Tata Power",
          status: "COMPLIANT",
          deviation: 0,
        },
        {
          id: "PLOT_D4",
          owner: "Unregistered",
          status: "VACANT",
          deviation: 0,
        },
      ],
    },
  },
  owners: {
    "Jindal Steel": ["PLOT_B2", "PLOT_X9", "PLOT_A1"],
  },
  plots: {
    PLOT_B2: {
      area: "Siltara Phase-II",
      owner: "Jindal Steel",
      size: "5000sqft",
      status: "ENCROACHED",
    },
  },
};

// --- SUB-COMPONENTS (Now declared OUTSIDE) ---

// 1. The Map View
const AreaView = ({ data, auditMode, searchQuery }) => (
  <div className="results-container">
    {/* 60% Map */}
    <div className="map-view">
      <div className="map-placeholder">
        <div style={{ position: "absolute", bottom: 20, left: 20, zIndex: 10 }}>
          <span className="badge badge-lime">LIVE SATELLITE FEED</span>
        </div>

        <svg
          viewBox="0 0 100 100"
          className="map-overlay-svg"
          preserveAspectRatio="none"
        >
          <path
            d={data.geometry.intended}
            fill="none"
            stroke="blue"
            strokeWidth="0.5"
            strokeDasharray="2"
          />
          <path
            d={data.geometry.existing}
            fill="none"
            stroke="white"
            strokeWidth="0.5"
          />
          <path
            d={data.geometry.encroached}
            fill="rgba(239, 68, 68, 0.6)"
            stroke="red"
            strokeWidth="0.2"
          />
          {auditMode && (
            <path
              d={data.geometry.unused}
              fill="rgba(209, 255, 66, 0.4)"
              stroke="var(--lime)"
              strokeWidth="0.5"
              className="animate-pulse"
            />
          )}
        </svg>

        <span style={{ opacity: 0.5 }}>Interactive Map Area (Leaflet)</span>
      </div>
    </div>

    {/* 40% Sidebar */}
    <div className="sidebar-view">
      <h2>
        {searchQuery}{" "}
        <span style={{ fontSize: "0.6em", color: "#64748b" }}>ID: 992-A</span>
      </h2>

      <div className="stat-card">
        <div className="stat-label">Compliance Health</div>
        <div
          className="stat-value"
          style={{
            color: data.metrics.complianceHealth > 80 ? "#16a34a" : "#ef4444",
          }}
        >
          {data.metrics.complianceHealth}%
        </div>
        <div
          style={{
            height: "4px",
            background: "#e2e8f0",
            marginTop: "10px",
            borderRadius: "2px",
          }}
        >
          <div
            style={{
              width: `${data.metrics.complianceHealth}%`,
              background: "var(--slate)",
              height: "100%",
            }}
          ></div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Revenue At Risk</div>
        <div className="stat-value">
          ₹ {data.metrics.revenueAtRisk.toLocaleString()}
        </div>
      </div>

      <div className="stat-card" style={{ flex: 1, overflowY: "auto" }}>
        <div className="stat-label" style={{ marginBottom: "10px" }}>
          Property Breakdown
        </div>
        {data.plots.map((plot) => (
          <div
            key={plot.id}
            style={{
              padding: "10px",
              borderBottom: "1px solid #eee",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>{plot.id}</span>
            <span
              className={`badge ${plot.status === "COMPLIANT" ? "badge-green" : "badge-red"}`}
            >
              {plot.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 2. The Owner View
const OwnerView = ({ data }) => (
  <div className="results-container" style={{ flexDirection: "column" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
      <div
        style={{
          width: "60px",
          height: "60px",
          background: "var(--lime)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <User size={30} color="var(--slate)" />
      </div>
      <div>
        <h2 style={{ margin: 0 }}>Owner: {data.owner}</h2>
        <p style={{ margin: 0, color: "#64748b" }}>
          Total Properties: {data.plots.length}
        </p>
      </div>
    </div>

    <div className="owner-grid">
      {data.plots.map((plotId, index) => (
        <div key={index} className="plot-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "15px",
            }}
          >
            <Database size={20} />
            <span className="badge badge-lime">ACTIVE</span>
          </div>
          <h3>{plotId}</h3>
          <p style={{ fontSize: "0.9rem" }}>Located in Siltara Phase-II</p>
          <button
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "10px" }}
          >
            View Full Audit
          </button>
        </div>
      ))}
    </div>
  </div>
);

// 3. The Plot View
const PlotView = ({ data, searchQuery }) => (
  <div className="results-container">
    <div className="map-view" style={{ flex: 1 }}>
      <div className="map-placeholder">
        <div
          style={{
            width: "300px",
            height: "300px",
            border: "2px dashed var(--lime)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ZOOM LEVEL: MAX
        </div>
      </div>
    </div>
    <div className="sidebar-view" style={{ flex: 1 }}>
      <h1>{searchQuery}</h1>
      <div className="stat-card">
        <div className="stat-label">Owner</div>
        <div className="stat-value" style={{ fontSize: "1.5rem" }}>
          {data.owner}
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Current Status</div>
        <div
          className="stat-value"
          style={{ color: data.status === "ENCROACHED" ? "red" : "green" }}
        >
          {data.status}
        </div>
      </div>
    </div>
  </div>
);

// --- MAIN DASHBOARD COMPONENT ---
const UserDashboard = () => {
  // State
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("area");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [viewMode, setViewMode] = useState("standard");

  // --- Handlers ---
  const executeSearch = (isAudit = false) => {
    setLoading(true);
    setError(null);
    setViewMode(isAudit ? "audit" : "standard");

    setTimeout(() => {
      let data = null;
      if (searchType === "area") {
        data = MOCK_DB.areas[searchQuery] || null;
      } else if (searchType === "owner") {
        const plots = MOCK_DB.owners[searchQuery];
        data = plots
          ? { type: "owner_collection", owner: searchQuery, plots }
          : null;
      } else if (searchType === "plotid") {
        data = MOCK_DB.plots[searchQuery] || null;
      }

      if (data) {
        setResultData(data);
        setHasSearched(true);
      } else {
        setError(`No data found for ${searchType}: "${searchQuery}"`);
      }
      setLoading(false);
    }, 800);
  };

  const resetSearch = () => {
    setHasSearched(false);
    setResultData(null);
    setSearchQuery("");
  };

  // --- Main Render ---
  return (
    <div className="matrix-bg">
      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "15px 30px",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            fontWeight: "800",
            fontSize: "1.2rem",
            letterSpacing: "-1px",
          }}
        >
          NEXORA<span style={{ color: "var(--lime)" }}>.AI</span>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn btn-login">
            <Moon size={16} />
          </button>
          <button
            className="btn btn-login"
            style={{ display: "flex", gap: "5px", alignItems: "center" }}
          >
            <LogIn size={16} /> Login
          </button>
        </div>
      </nav>

      <div
        className={`dashboard-container ${hasSearched ? "searched" : "initial"}`}
      >
        {/* Error Popup */}
        {error && (
          <div className="error-popup">
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <ShieldAlert size={20} /> {error}
            </div>
          </div>
        )}

        {/* Hero Section */}
        {!hasSearched && (
          <div className="hero-content">
            <h1 className="main-heading">
              Data About Estates. <br /> All at once.
            </h1>
            <p className="sub-heading">
              Access real-time satellite intelligence, compliance audits, and
              encroachment data across all registered industrial zones.
            </p>
          </div>
        )}

        {/* Search Bar */}
        <div className="search-wrapper">
          <div className="search-input-group">
            <input
              className="input-field input-name"
              placeholder={
                searchType === "area"
                  ? "Enter Area Name (e.g. Siltara)"
                  : "Enter ID/Name..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && executeSearch(false)}
            />
            <select
              className="input-field input-select"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="area">Area</option>
              <option value="owner">Owner</option>
              <option value="plotid">Plot ID</option>
            </select>
          </div>

          <div style={{ display: "flex" }}>
            <button
              className="btn btn-primary"
              onClick={() => executeSearch(false)}
              disabled={loading}
            >
              {loading ? "..." : <Search size={18} />}
            </button>
            <button
              className="btn btn-audit"
              onClick={() => executeSearch(true)}
              disabled={loading}
            >
              GET AUDIT
            </button>
          </div>
        </div>

        {/* Result Content Area */}
        {hasSearched && resultData && (
          <>
            {/* KEY CHANGE: Passed 'searchQuery' as a prop 
              because these components are now outside the main scope.
            */}
            {searchType === "area" && (
              <AreaView
                data={resultData}
                auditMode={viewMode === "audit"}
                searchQuery={searchQuery}
              />
            )}
            {searchType === "owner" && (
              <OwnerView data={resultData} searchQuery={searchQuery} />
            )}
            {searchType === "plotid" && (
              <PlotView data={resultData} searchQuery={searchQuery} />
            )}

            <div style={{ marginTop: "20px" }}>
              <button
                onClick={resetSearch}
                style={{
                  background: "none",
                  border: "none",
                  textDecoration: "underline",
                  cursor: "pointer",
                  color: "#64748b",
                }}
              >
                Clear Search & Start Over
              </button>
            </div>
          </>
        )}

        {/* Generic Footer */}
        <footer>
          <p>
            © 2026 Dept of Industrial Commerce. Powered by Intelligence Backend.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              marginTop: "10px",
            }}
          >
            <span>Privacy</span>
            <span>Terms</span>
            <span>
              API Status: <span style={{ color: "green" }}>● Online</span>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default UserDashboard;
