import React from "react";

const AdminDashboard = () => {
  return (
    <div
      style={{ background: "#e3f2fd", padding: "15px", borderRadius: "8px" }}
    >
      <h2>Admin Overview</h2>
      <p>Welcome, Admin. Here you will see the files uploaded by users.</p>
      <div
        style={{
          border: "2px dashed #90caf9",
          padding: "20px",
          textAlign: "center",
        }}
      >
        [List of Submissions will appear here]
      </div>
    </div>
  );
};

export default AdminDashboard;
