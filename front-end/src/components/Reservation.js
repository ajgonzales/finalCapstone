import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { cancelReservation } from "../utils/api";
import "./Reservation.css";

export default function Reservation({ reservation }) {
  const [error, setError] = useState(null);
  const history = useHistory();
  const handleReservationCancel = async (e) => {
    e.preventDefault();
    try {
      if (
        window.confirm(
          "Do you want to cancel this reservation? This cannot be undone."
        )
      ) {
        const status = "cancelled";
        await cancelReservation(reservation, status);
        history.go(0);
      }
    } catch (error) {
      setError(error);
    }
  };

  return (
    <>
      <ErrorAlert error={error} />
      <div className="card border-secondary mb-3 text-center">
        <div
          data-reservation-id-status={reservation.reservation_id}
          className="card-header"
        >
          Status: {reservation.status}
        </div>
        <div className="card-header">ID: {reservation.reservation_id}</div>
        <div className="card-body text-secondary">
          <p className="card-text">
            Name: {reservation.first_name}, {reservation.last_name}
          </p>
          <p className="card-text">Mobile: {reservation.mobile_number}</p>
          <p className="card-text">Party Size: {reservation.people}</p>
          <p className="card-text">
            Reservation Time: {reservation.reservation_time}
          </p>
          <div>
            {reservation.status === "booked" ? (
              <>
                <Link className="btn btn-secondary mr-3" to={`/reservations/${reservation.reservation_id}/seat`}>
                  Seat
                </Link>
                <Link className="btn btn-primary mr-3" to={`/reservations/${reservation.reservation_id}/edit`}>
                  Edit
                </Link>
              </>
            ) : null}
            <button
              className="btn btn-danger"
              type="button"
              name="cancel"
              data-reservation-id-cancel={reservation.reservation_id}
              onClick={handleReservationCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}