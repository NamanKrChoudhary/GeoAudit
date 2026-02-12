import React, { useState } from "react";
import { Download, Siren, Share2, Printer, Check, X } from "lucide-react";
import "./Dashboard.css";

const PlotView = ({ data }) => {
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  // --- ACTIONS (Mimicking the Backend Endpoint /api/intelligence/action) ---

  const handleGenerateDossier = () => {
    setActionLoading("dossier");
    // Simulate API Call
    setTimeout(() => {
      setActionLoading(null);
      setToast({
        type: "success",
        msg: "Official Audit Dossier sent to Admin Email.",
      });
      setTimeout(() => setToast(null), 3000);
    }, 1500);
  };

  const handleIssueNotice = () => {
    setActionLoading("notice");
    // Simulate API Call
    setTimeout(() => {
      setActionLoading(null);
      setToast({
        type: "error",
        msg: "Legal Notice Issued. Status updated to WARNING_SENT.",
      });
      setTimeout(() => setToast(null), 3000);
    }, 1500);
  };

  return (
    <div className="results-container">
      {/* --- TOAST NOTIFICATION --- */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "50%",
            transform: "translateX(50%)",
            background: toast.type === "success" ? "#dcfce7" : "#fee2e2",
            color: toast.type === "success" ? "#166534" : "#991b1b",
            padding: "12px 24px",
            borderRadius: "50px",
            fontWeight: "bold",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {toast.type === "success" ? <Check size={18} /> : <Siren size={18} />}
          {toast.msg}
        </div>
      )}

      {/* --- LEFT: ZOOMED MAP (50%) --- */}
      <div className="map-view" style={{ flex: 1, borderRight: "none" }}>
        <div className="map-placeholder">
          {/* Zoomed-In Satellite Texture */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              background: `url('https://www.transparenttextures.com/patterns/black-scales.png')`,
              backgroundColor: "#475569",
              opacity: 0.8,
            }}
          ></div>

          {/* SVG Geometry (Single Plot Focus) */}
          <svg
            viewBox="0 0 100 100"
            className="map-overlay-svg"
            style={{ padding: "20px" }}
          >
            {/* The Plot Boundary */}
            <path
              d="M20,20 L80,20 L80,80 L20,80 Z"
              fill="none"
              stroke="white"
              strokeWidth="1"
              strokeDasharray="2,2"
            />

            {/* The Encroachment (If exists) */}
            {data.status === "ENCROACHED" && (
              <path
                d="M80,20 L85,25 L80,40 Z"
                fill="rgba(239, 68, 68, 0.8)"
                stroke="red"
                strokeWidth="1"
                className="animate-pulse"
              />
            )}
          </svg>

          {/* HUD Overlay */}
          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
              fontFamily: "JetBrains Mono",
              color: "white",
              fontSize: "0.8rem",
            }}
          >
            COORDS: 21.251° N, 81.629° E<br />
            SCALE: 1:500
          </div>
        </div>
      </div>

      {/* --- RIGHT: INTELLIGENCE PANEL (50%) --- */}
      <div className="sidebar-view" style={{ flex: 1, padding: "0 0 0 20px" }}>
        {/* Header */}
        <div
          style={{
            borderBottom: "2px solid var(--slate)",
            paddingBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
            }}
          >
            <div>
              <h1 style={{ margin: 0, fontSize: "2.5rem" }}>
                {data.id || "PLOT_99"}
              </h1>
              <span style={{ color: "#64748b" }}>Owner: {data.owner}</span>
            </div>
            {/* Verification QR Placeholder */}
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "white",
                border: "1px solid #ccc",
                padding: "5px",
              }}
            >
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data.id}`}
                alt="QR"
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          <div className="stat-card">
            <div className="stat-label">Allocated Area</div>
            <div className="stat-value">
              5,000 <span style={{ fontSize: "1rem" }}>sq.ft</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Measured Deviation</div>
            <div
              className="stat-value"
              style={{ color: data.deviation > 0 ? "red" : "green" }}
            >
              {data.deviation || 0}%
            </div>
          </div>
        </div>

        {/* Action Center - THE BACKEND HOOKS */}
        <div
          style={{
            marginTop: "30px",
            background: "#f1f5f9",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h4
            style={{
              margin: "0 0 15px 0",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Command Actions
          </h4>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {/* Button 1: Generate Dossier (Safe Action) */}
            <button
              className="btn"
              onClick={handleGenerateDossier}
              disabled={actionLoading}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                background: "white",
                border: "2px solid var(--slate)",
              }}
            >
              {actionLoading === "dossier" ? (
                "Generating PDF..."
              ) : (
                <>
                  <Download size={18} /> Generate Official Dossier
                </>
              )}
            </button>

            {/* Button 2: Issue Notice (Danger Action - Only if Encroached) */}
            {data.status === "ENCROACHED" && (
              <button
                className="btn"
                onClick={handleIssueNotice}
                disabled={actionLoading}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  background: "#fee2e2",
                  color: "#b91c1c",
                  borderColor: "#b91c1c",
                }}
              >
                {actionLoading === "notice" ? (
                  "Sending Notice..."
                ) : (
                  <>
                    <Siren size={18} /> ISSUE LEGAL NOTICE
                  </>
                )}
              </button>
            )}

            {/* Disabled State if Compliant */}
            {data.status === "COMPLIANT" && (
              <div
                style={{
                  textAlign: "center",
                  color: "#166534",
                  fontSize: "0.9rem",
                  padding: "10px",
                }}
              >
                <CheckCircle size={16} style={{ marginBottom: "-3px" }} />{" "}
                Property is compliant. No legal actions available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlotView;
