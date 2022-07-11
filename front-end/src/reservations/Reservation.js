import { cancelReservation } from "../utils/api";
import { useHistory , Link } from "react-router-dom";

export default function Reservation({ reservation }) {
  const history = useHistory();
  const cancelHandler = async (e) => {
    e.preventDefault();
    const conf = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );
    if (conf) {
      await cancelReservation(reservation, "cancelled");
      history.push("/");
    }
  };
  return (
    <tr key={reservation.reservation_id}>
      <th scope="row">{reservation.reservation_id}</th>
      <td>
        {reservation.first_name} {reservation.last_name}
      </td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_date}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.people}</td>
      <td data-reservation-id-status={reservation.reservation_id}>
        {reservation.status}
      </td>
      <td>
        {reservation.status === "booked" ? (
          <Link
            className="btn btn-secondary"
            to={`/reservations/${reservation.reservation_id}/seat`}
          >
            Seat
          </Link>
        ) : null}
      </td>
      <td>
        <Link
          to={`/reservations/${reservation.reservation_id}/edit`}
          className="btn btn-primary"
        >
          Edit
        </Link>
      </td>
      <td>
        <button
        type="button"
          className="btn btn-danger"
          onClick={cancelHandler}
          data-reservation-id-cancel={reservation.reservation_id}
        >
          Cancel
        </button>
      </td>
    </tr>
  );
}
