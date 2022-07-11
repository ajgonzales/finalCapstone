import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { readReservation, listTables, seatReservation } from "../utils/api";


function SeatReservation() {
  const { reservation_id } = useParams();
  const { push, goBack } = useHistory();
  const [reservation, setReservation] = useState({});
  const [tables, setTables] = useState([]);
  const [tableId, setTableId] = useState({});
  const [error, setError] = useState(null);

  useEffect(loadTables, []);

  function loadTables(){
    const abortController = new AbortController();
    listTables(abortController.signal).then(setTables);
    return () => abortController.abort();
  }

  useEffect(loadReservation, [reservation_id]);

  function loadReservation() {
    const abortController = new AbortController();
    readReservation(reservation_id, abortController.signal).then(setReservation);
    return () => abortController.abort();
  }

  function handleChange({ target }) {
    setTableId(target.value);
  }

  async function handleSubmit(e) {
    const abortController = new AbortController();
    try {
      e.preventDefault();
      await setError(null);
      await seatReservation(reservation_id, parseInt(tableId), abortController.signal)
      push("/dashboard");
    } catch(error) {
      setError(error);
    }
    return () => abortController.abort();
  }

  function handleCancel() {
    goBack();
  }

  return reservation.first_name ? (
    <div className=" container justify-content-center">
    <form onSubmit={handleSubmit}>
      <h2 className="mt-3">
        Select seating for {reservation.first_name} {reservation.last_name}'s reservation
      </h2>
      <h3>Party size: {reservation.people}</h3>
      <ErrorAlert error={error} />
      {tables.length ? (
        <>
          <label htmlFor="table">Select A Table: </label>
          <select value={tableId} onChange={handleChange} name="table_id" className="form-control" required={true}>
            <option value="">None selected</option>
            {tables.map((thisTable) => {
              return (
                <option value={thisTable.table_id} key={thisTable.table_id}>
                  {thisTable.table_name} - {thisTable.capacity}
                </option>
              );
            })}
          </select>
          <button type="submit" className="btn btn-primary mt-3">
            Submit
          </button>
          <button type="button" className="btn btn-secondary ml-2 mt-3" onClick={handleCancel}>
            Cancel
          </button>
        </>
      ) : (
        <p>Loading tables...</p>
      )}
    </form>
    </div>
  ) : (
    <p>Loading reservation...</p>
  );
}

export default SeatReservation;
