import React from "react";
import {
  Building,
  MapPin,
  AlertTriangle,
  CheckCircle,
  PieChart,
} from "lucide-react";
import "./Dashboard.css";
const OwnerView = ({ data }) => {
  // Mock aggregation of stats
  const totalPlots = data.plots.length;
  const compliantPlots = data.plots.filter(
    (p) => p.status === "COMPLIANT",
  ).length;
  const encroachmentRisk = data.plots.some((p) => p.status === "ENCROACHED");

  return (
    <div
      className="results-container"
      style={{ flexDirection: "column", gap: "30px" }}
    >
      {/* --- HEADER: OWNER PROFILE --- */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "var(--white)",
          padding: "30px",
          borderRadius: "12px",
          border: "2px solid var(--slate)",
          boxShadow: "4px 4px 0px var(--slate)",
        }}
      >
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              background: "var(--lime)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid var(--slate)",
            }}
          >
            <Building size={40} strokeWidth={1.5} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "2rem" }}>{data.owner}</h1>
            <div
              style={{
                display: "flex",
                gap: "15px",
                marginTop: "10px",
                color: "#64748b",
              }}
            >
              <span
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <MapPin size={16} /> Total Holdings: {totalPlots} Plots
              </span>
              <span
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <PieChart size={16} /> Compliance Rate:{" "}
                {Math.round((compliantPlots / totalPlots) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Global Status Badge */}
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: "0.8rem",
              textTransform: "uppercase",
              marginBottom: "5px",
              letterSpacing: "1px",
            }}
          >
            Portfolio Status
          </div>
          {encroachmentRisk ? (
            <span
              className="badge badge-red"
              style={{ fontSize: "1rem", padding: "8px 16px" }}
            >
              <AlertTriangle
                size={16}
                style={{ marginBottom: "-2px", marginRight: "5px" }}
              />
              ACTION REQUIRED
            </span>
          ) : (
            <span
              className="badge badge-green"
              style={{ fontSize: "1rem", padding: "8px 16px" }}
            >
              <CheckCircle
                size={16}
                style={{ marginBottom: "-2px", marginRight: "5px" }}
              />
              FULLY COMPLIANT
            </span>
          )}
        </div>
      </div>

      {/* --- GRID: PLOT CARDS --- */}
      <h3 style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>
        Registered Properties
      </h3>

      <div className="owner-grid">
        {data.plots.map((plot, index) => (
          <div
            key={index}
            className="plot-card"
            style={{ position: "relative", overflow: "hidden" }}
          >
            {/* Card Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <span
                style={{
                  fontFamily: "JetBrains Mono",
                  fontWeight: "700",
                  fontSize: "1.2rem",
                }}
              >
                {plot.id || plot}{" "}
                {/* Handle if data is object or just ID string */}
              </span>
              {/* If we have status in the plot object, show badge */}
              {plot.status && (
                <span
                  className={`badge ${plot.status === "COMPLIANT" ? "badge-green" : "badge-red"}`}
                >
                  {plot.status}
                </span>
              )}
            </div>

            {/* Content */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                fontSize: "0.9rem",
                color: "#475569",
              }}
            >
              <div>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    color: "#94a3b8",
                  }}
                >
                  AREA
                </span>
                Siltara Ph-II
              </div>
              <div>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    color: "#94a3b8",
                  }}
                >
                  TYPE
                </span>
                Industrial
              </div>
            </div>

            {/* "Radius" Visualization (Abstract) */}
            <div
              style={{
                marginTop: "20px",
                height: "6px",
                width: "100%",
                background: "#e2e8f0",
                borderRadius: "3px",
              }}
            >
              <div
                style={{
                  width: plot.deviation
                    ? `${Math.min(plot.deviation * 2, 100)}%`
                    : "0%",
                  background: "#ef4444",
                  height: "100%",
                  borderRadius: "3px",
                }}
              ></div>
            </div>
            {plot.deviation > 0 && (
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#ef4444",
                  marginTop: "5px",
                  textAlign: "right",
                }}
              >
                {plot.deviation}% Deviation Detected
              </div>
            )}

            <button
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "20px" }}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default OwnerView;
