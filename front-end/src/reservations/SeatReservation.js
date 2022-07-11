import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { getTables, seatReservation } from "../utils/api";
import Error from "./Error";
export default function SeatReservation() {
  const { reservation_id } = useParams();
  const history = useHistory();
  const [tableList, setTableList] = useState([]);
  useEffect(() => {
    const ac = new AbortController();
    getTables(ac.signal).then(setTableList);
    return () => ac.abort();
  }, []);
  const [errors, setErrors] = useState({});
  const [selectedTable, setSelectedTable] = useState(1);

  const errorMap = Object.keys(errors).map((error, index) => (
    <Error key={index} error={error} />
  ));

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await seatReservation(selectedTable, reservation_id);
      history.push("/dashboard");
    } catch (error) {
      if (!errors[error.message]) {
        setErrors({ ...errors, [error.message]: 1 });
      }
    }
  };

  const handleChange = (e) => {
    setSelectedTable(e.target.value);
  };

  return (
    <div className="d-flex flex-column flex-wrap text-center">
      <h1>Seat Reservation #{reservation_id}</h1>
      <div className="createErrors">{errorMap ? errorMap : null}</div>
      
      <div className="d-flex flex-column form-group alilgn-items-center justify-content-center mx-auto">
        <select
          name="table_id"
          className="form-control form-control-lg mb-3"
          onChange={handleChange}
        >
          {tableList.map((table) => (
            <option key={table.table_id} value={table.table_id}>
              {table.table_name} - {table.capacity}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="btn btn-lg btn-primary mb-3"
          onClick={submitHandler}
          
        >
          Submit
        </button>
        <button
          type="button"
          onClick={() => history.goBack()}
          className="mx-auto btn btn-lg btn-danger"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
