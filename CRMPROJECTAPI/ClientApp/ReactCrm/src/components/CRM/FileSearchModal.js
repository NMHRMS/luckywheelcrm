import React from "react";

export default function FileSearchModal({ setFileSearchModalVisible }) {
  return (
    <div>
      <h3>Search File</h3>
      <button onClick={() => setFileSearchModalVisible(false)}>Close</button>
    </div>
  );
}