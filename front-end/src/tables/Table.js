import React, { useState } from "react";
import { finishReservation } from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
export default function Table({ table }) {
  const history = useHistory();
  const [error, setError] = useState(null);
  const finishHandler = async (e) => {
    e.preventDefault();
    const conf = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );
    if (conf) {
      try {
        await finishReservation(table.table_id);
        history.go(0);
      } catch (err) {
        setError(err);
      }
    }
  };

  return (
    <>
      <ErrorAlert error={error} />
      <tr key={table.table_id}>
        <th scope="row">{table.table_id}</th>
        <td>{table.table_name}</td>
        <td>{table.capacity}</td>
        <td data-table-id-status={`${table.table_id}`}>
          {table.reservation_id ? "Occupied" : "Free"}
        </td>
        <td>
          {table.reservation_id && (
            <button
              className="btn btn-secondary"
              data-table-id-finish={table.table_id}
              onClick={finishHandler}
            >
              Finish
            </button>
          )}
        </td>
      </tr>
    </>
  );
}
