import React, { useState } from "react";
import { finishTable } from "../utils/api";
import FinishButton from "./FinishButton";
import ErrorAlert from "../layout/ErrorAlert";
import "./Table.css";
export default function Table({ table, loadDashboard }) {
  const [error, setError] = useState(null);
  const handleFinish = async (e) => {
    e.preventDefault();
    try {
      if (
        window.confirm(
          "Is this table ready to seat new guests? This cannot be undone."
        )
      ) {
        await finishTable(table.table_id);
        loadDashboard();
      }
    } catch (error) {
      setError(error);
    }
  };
  return (
    <>
      <ErrorAlert error={error} />
      <div className="card border-secondary mb-3 text-center">
        <div className="card-header">Table ID: {table.table_id}</div>
        <div className="card-body text-secondary">
          <p className="card-text">Table Name: {table.table_name}</p>
          <p className="card-text">Table Capacity: {table.capacity}</p>
          <p className="card-text">Reservation ID: {table.reservation_id}</p>
          <p className="card-text" data-table-id-status={table.table_id}>
            Status:
            {table.reservation_id ? "occupied" : "free"}
          </p>
          <p className="card-text">
            {table.reservation_id ? (
              <FinishButton table={table} handleFinish={handleFinish} />
            ) : null}
          </p>
        </div>
      </div>
    </>
  );
}
