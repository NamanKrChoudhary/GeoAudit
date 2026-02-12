import React, { useState } from "react";
import {
  Layers,
  AlertTriangle,
  CheckCircle,
  Maximize,
  FileText,
  Activity,
} from "lucide-react";
import "./Dashboard.css";
const AreaView = ({ data, auditMode }) => {
  // State for the "Side-by-Side" Comparison
  const [overlayOpacity, setOverlayOpacity] = useState(0.6);
  const [activeLayer, setActiveLayer] = useState("combined"); // 'satellite', 'plan', 'combined'

  // Helper to determine badge color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLIANT":
        return "badge-green";
      case "ENCROACHED":
        return "badge-red";
      case "WARNING_SENT":
        return "badge-orange"; // As per spec
      default:
        return "badge-slate";
    }
  };

  return (
    <div className="results-container">
      {/* --- LEFT COL: THE "BAMBOOZLE" MAP (60%) --- */}
      <div className="map-view">
        {/* 1. Header & Controls inside the map */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            zIndex: 10,
            background: "rgba(255,255,255,0.9)",
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            backdropFilter: "blur(4px)",
          }}
        >
          <h3
            style={{
              margin: "0 0 5px 0",
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Layers size={16} /> ZONE: {data.areaName}
          </h3>

          {/* Layer Control / Opacity Slider */}
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label
              style={{
                fontSize: "0.75rem",
                fontWeight: "bold",
                color: "#64748b",
              }}
            >
              OVERLAY INTENSITY
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={overlayOpacity}
              onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
              style={{
                width: "100%",
                cursor: "pointer",
                accentColor: "var(--slate)",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.7rem",
              }}
            >
              <span>Satellite</span>
              <span>Master Plan</span>
            </div>
          </div>
        </div>

        {/* 2. The Map Layers */}
        <div className="map-placeholder" style={{ position: "relative" }}>
          {/* Layer A: "Satellite" Background (The raw reality) */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              background: `url('${data.backgroundUrl || "https://www.transparenttextures.com/patterns/black-scales.png"}')`, // Placeholder texture
              backgroundColor: "#334155", // Slate dark for satellite feel
              backgroundSize: "cover",
            }}
          ></div>

          {/* Layer B: The SVG Overlay (The "Intelligence") */}
          <svg
            viewBox="0 0 100 100"
            className="map-overlay-svg"
            preserveAspectRatio="none"
            style={{ opacity: overlayOpacity, transition: "opacity 0.2s" }}
          >
            {/* Blue: Legal Boundary (Intended) */}
            <path
              d={data.geometry.intended}
              fill="rgba(30, 58, 138, 0.1)"
              stroke="#3b82f6"
              strokeWidth="0.5"
              strokeDasharray="1,1"
            />

            {/* White: Existing Physical Boundary */}
            <path
              d={data.geometry.existing}
              fill="none"
              stroke="white"
              strokeWidth="0.5"
            />

            {/* Red: Encroachment (The Violation) */}
            <path
              d={data.geometry.encroached}
              fill="rgba(239, 68, 68, 0.7)"
              stroke="#ef4444"
              strokeWidth="0.2"
              className="animate-pulse-slow"
            />

            {/* AUDIT MODE SPECIAL: Highlight Unused Land */}
            {auditMode && (
              <path
                d={data.geometry.unused}
                fill="rgba(209, 255, 66, 0.5)"
                stroke="var(--lime)"
                strokeWidth="0.8"
              />
            )}
          </svg>

          {/* Floating "Live" Badge */}
          <div style={{ position: "absolute", bottom: 20, right: 20 }}>
            <span className="badge badge-red animate-pulse">● LIVE FEED</span>
          </div>
        </div>
      </div>

      {/* --- RIGHT COL: INTELLIGENCE SIDEBAR (40%) --- */}
      <div className="sidebar-view">
        {/* 1. Zone Health Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          <div className="stat-card" style={{ padding: "15px" }}>
            <div className="stat-label">COMPLIANCE</div>
            <div
              className="stat-value"
              style={{
                color:
                  data.metrics.complianceHealth > 80 ? "#16a34a" : "#ef4444",
              }}
            >
              {data.metrics.complianceHealth}%
            </div>
            <Activity size={16} color="#64748b" style={{ marginTop: "5px" }} />
          </div>

          <div className="stat-card" style={{ padding: "15px" }}>
            <div className="stat-label">AT RISK (m²)</div>
            <div className="stat-value" style={{ color: "#ef4444" }}>
              {data.metrics.totalEncroachedArea}
            </div>
            <div
              className="stat-label"
              style={{ fontSize: "0.7rem", marginTop: "5px" }}
            >
              Revenue: ₹{(data.metrics.revenueAtRisk / 100000).toFixed(1)}L
            </div>
          </div>
        </div>

        {/* 2. Action Buttons (If in Audit Mode) */}
        {auditMode && (
          <div
            className="stat-card"
            style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}
          >
            <h4 style={{ margin: "0 0 10px 0", color: "#166534" }}>
              Audit Actions
            </h4>
            <button
              className="btn btn-primary"
              style={{ width: "100%", fontSize: "0.8rem" }}
            >
              <FileText size={14} style={{ marginRight: "5px" }} /> Generate
              Full Report
            </button>
          </div>
        )}

        {/* 3. Plot Status List (Scrollable) */}
        <div
          className="stat-card"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            padding: "0",
          }}
        >
          <div
            style={{
              padding: "15px",
              borderBottom: "1px solid #e2e8f0",
              background: "#f8fafc",
            }}
          >
            <h4 style={{ margin: 0 }}>Plot Registry</h4>
            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
              {data.plots.length} Registered Units
            </span>
          </div>

          <div style={{ overflowY: "auto", padding: "0 15px" }}>
            {data.plots.map((plot) => (
              <div
                key={plot.id}
                style={{
                  padding: "15px 0",
                  borderBottom: "1px solid #f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
                className="plot-list-item"
              >
                {/* Plot Info */}
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "0.95rem" }}>
                    {plot.id}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    {plot.owner}
                  </div>
                  {plot.deviation > 0 && (
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#ef4444",
                        marginTop: "2px",
                      }}
                    >
                      Deviation: {plot.deviation}%
                    </div>
                  )}
                </div>

                {/* Status Badge & Action */}
                <div style={{ textAlign: "right" }}>
                  <span className={`badge ${getStatusColor(plot.status)}`}>
                    {plot.status}
                  </span>
                  <div style={{ marginTop: "5px" }}>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--slate)",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                        textDecoration: "underline",
                      }}
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AreaView;
