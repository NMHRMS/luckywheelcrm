import React from "react";

const TableRow = ({ index, lead }) => {
  return (
    <tr>
      <td>{index}</td>
      <td>{lead.ownerName}</td>
      <td>{lead.fatherName}</td>
      <td>{lead.mobileNo}</td>
      <td>{lead.officeName}</td>
      <td>{lead.districtName}</td>
      <td>{lead.currentAddress}</td>
    </tr>
  );
};

export default TableRow;
