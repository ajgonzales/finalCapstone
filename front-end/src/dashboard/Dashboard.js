import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import { next, previous, today } from "../utils/date-time";
import { listTables } from "../utils/api";
import { useHistory } from "react-router";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { GrAdd } from "react-icons/gr";
import ReservationList from "../components/ReservationList";
import TableList from "../components/TableList";
import "./Dashboard.css";
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const query = useQuery();
  const dateQuery = query.get("date");
  const [pageDate, setPageDate] = useState(dateQuery ? dateQuery : date);
  const history = useHistory();

  useEffect(loadDashboard, [date, pageDate]);

  const nextDateHandler = () => {
    setPageDate(next(pageDate));
    history.push(`/dashboard?date=${next(pageDate)}`);
  };

  const previousDateHandler = () => {
    setPageDate(previous(pageDate));
    history.push(`/dashboard?date=${previous(pageDate)}`);
  };

  const todayHandler = () => {
    setPageDate(today(date));
    history.push(`/dashboard?date=${date}`);
  };

  function loadDashboard() {
    const date = pageDate;
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    listTables(abortController.signal)
      .then(setTables)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h2 className="mt-3">Dashboard</h2>
      <div className="d-md-flex mb-3 row ml-1 justify-content-center">
        <h4 className="mb-0">Reservations for date {pageDate}</h4>
      </div>
      <div className="dashboard dashboard-nav row ml-1 mb-5 justify-content-center">
        <button className="btn btn-secondary" onClick={previousDateHandler}>
          <FaAngleLeft />
          Previous
        </button>
        <button className="btn btn-primary" onClick={todayHandler}>
          Today
        </button>
        <button className="btn btn-secondary" onClick={nextDateHandler}>
          Next
          <FaAngleRight />
        </button>
      </div>
      <div className="dashboard error-list row ml-1">
        <ErrorAlert error={reservationsError} />
      </div>
      <div className="container">
        <div className="row mx-1">
          <div className="col-md-6 col-sm-12">
            <h4 className="text-center mb-3">
              Reservations
              <Link to="/reservations/new" className="ml-2 mb-4">
                <GrAdd />
              </Link>
            </h4>
            <ReservationList reservations={reservations} />
          </div>
          <div className="col-md-6 col-sm-12">
            <h4 className="text-center mb-3">
              Tables
              <Link to="/tables/new" className="ml-2 mb-4">
                <GrAdd />
              </Link>
            </h4>
            <TableList tables={tables} loadDashboard={loadDashboard} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
