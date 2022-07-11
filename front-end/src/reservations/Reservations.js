import Reservation from "./Reservation";
export default function Reservations({ reservations }) {
  return (
    <>
      <legend className="text-center">Reservations</legend>
      <table className="table table-hover text-center">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">NAME</th>
            <th scope="col">PHONE</th>
            <th scope="col">DATE</th>
            <th scope="col">TIME</th>
            <th scope="col">PEOPLE</th>
            <th scope="col">STATUS</th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {reservations && reservations.map((reservation) => (
            <Reservation
              key={reservation.reservation_id}
              reservation={reservation}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}
