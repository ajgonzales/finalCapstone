import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import ReservationList from "./ReservationList";
import NothingToSeeHere from "./NothingToSeeHere";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function SearchPage() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [foundReservations, setFoundReservations] = useState([]);
  const [findError, setFindError] = useState(null);
  const [showList, setShowList] = useState(false);

  const handleChange = (e) => {
    e.preventDefault();
    setMobileNumber(e.target.value);
  };

  const handleFind = (e) => {
    e.preventDefault();
    const ac = new AbortController();
    function findReservations() {
      const mobile_number = mobileNumber;
      listReservations({ mobile_number }, ac.signal)
        .then(setFoundReservations)
        .then(setShowList(true))
        .catch(setFindError);
    }
    findReservations();
    return () => ac.abort();
  };

  return (
    <>
      <div className="search search-title row ml-2 mt-3 justify-content-center mb-3">
        <h1>Search Reservations</h1>
      </div>
      <div className="search search-error">
        <ErrorAlert error={findError} />
      </div>

      <div className="search search-input input-group row mx-2 mb-4 justify-content-center">
        <input
          id="mobile_number"
          name="mobile_number"
          placeholder="Mobile Number"
          type="text"
          required
          onChange={handleChange}
          value={mobileNumber}
        />
        <div className="input-group-append">
          <button
            className="btn btn-primary"
            type="submit"
            onClick={handleFind}
          >
            <FaSearch /> Find
          </button>
        </div>
      </div>
      {showList ? (
        <div className="search search-results justify-content-center">
          {foundReservations.length ? (
            <ReservationList reservations={foundReservations} />
          ) : (
            <NothingToSeeHere />
          )}
        </div>
      ) : null}
    </>
  );
}