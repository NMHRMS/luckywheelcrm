import React from "react";

import { Link } from "react-router-dom";

function Reports() {
  return (
    <div class="row">
      <div class="col-sm-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Daily Reports</h5>
            <p class="card-text">Daily Report's of CRE,DSE</p>
            <Link to={"/crm/dailyreport"} class="btn btn-primary">
              Go
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Reports;
