import React from "react";
import Reservation from "../components/Reservation";

export default function ReservationList({ reservations }) {
  const reservationsMap = reservations.map((reservation) => (
    <Reservation key={reservation.reservation_id} reservation={reservation} />
  ));
  if (reservationsMap.length) {
    return <div>{reservationsMap}</div>;
  } else
    return (
      <div>
        <p className="lead text-center">
            <br/>
          There are currently no reservations for this day
        </p>
      </div>
    );
}