import React, { useEffect, useState } from "react";
import { listReservations, getTables } from "../utils/api";
import useQuery from "../utils/useQuery";
import ErrorAlert from "../layout/ErrorAlert";
import { today, next, previous } from "../utils/date-time";
import { useHistory } from "react-router-dom";
import Reservations from "../reservations/Reservations";
import Tables from "../tables/Tables";
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const query = useQuery();
  const dateQuery = query.get("date");
  const [pageDate, setPageDate] = useState(dateQuery ? dateQuery : date);
  const [tables, setTables] = useState([]);
  useEffect(loadDashboard, [pageDate, date]);

  function loadDashboard() {
    const date = pageDate;
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    getTables(abortController.signal)
      .then(setTables)
      .catch(setReservationsError);
    return () => abortController.abort();
  }
  const history = useHistory();

  const nextDateHandler = () => {
    setPageDate(() => next(pageDate));

    history.push(`/dashboard?date=${next(pageDate)}`);
  };

  const previousDateHandler = () => {
    setPageDate(() => previous(pageDate));
    history.push(`/dashboard?date=${previous(pageDate)}`);
  };

  const todayHandler = () => {
    setPageDate(() => today());
    history.push(`/dashboard?date=${today()}`);
  };

  return (
    <main className="container-fluid justify-content-center align-items-center">
      <h1 className="text-center">Dashboard</h1>
      <div className="d-flex flex-column mb-3">
        <h4 className="mb-0 text-center">Reservations for date {pageDate}</h4>
        <div className="btn-group mx-0">
          <button
            onClick={previousDateHandler}
            name="previous"
            className="btn btn-secondary"
          >
            Previous Day
          </button>
          <button
            onClick={todayHandler}
            name="today"
            className="btn btn-secondary"
          >
            Today
          </button>
          <button
            onClick={nextDateHandler}
            name="next"
            className="btn btn-secondary"
          >
            Next Day
          </button>
        </div>
      </div>
      <div className="container justify-content-center align-items-center col-12">
        <ErrorAlert className="col col-12" error={reservationsError} />
        <div className="col-12">
          <Reservations reservations={reservations} />
        </div>
        <div className="col-12">
          <Tables tables={tables} />
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
