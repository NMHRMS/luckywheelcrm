import React from "react";

export default function LeadModal({ setModalVisible }) {
  return (
    <div>
      <h3>Add/Edit Lead</h3>
      <button onClick={() => setModalVisible(false)}>Close</button>
    </div>
  );
}