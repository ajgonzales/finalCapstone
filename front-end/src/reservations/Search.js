import React, { useState } from "react";
import Reservations from "./Reservations";
import { listReservations } from "../utils/api";
export default function Search() {
  const [number, setNumber] = useState([]);
  const [results, setResults] = useState([]);
  const [clicked,setClicked] = useState(false)

  const handleChange = (e) => {
    setNumber(e.target.value);
  };

  const handleClick = (e) => {
    const ac = new AbortController();
    e.preventDefault();
    setClicked(!clicked)
    listReservations({ mobile_number: number }, ac.signal).then(setResults);
    return () => ac.abort();
  };
  return (
    <div className="d-flex flex-column flex-wrap justify-content-center align-items-center mt-4">
      <h1 className="text-center my-3">Search for reservation</h1>
      <form>
        <input
          className="form-control form-control-lg text-center"
          type="search"
          pattern="/\W/"
          name="mobile_number"
          value={number}
          onChange={handleChange}
          placeholder="Enter a customer's phone number"
        />
        <button className="btn btn-lg btn-secondary mx-auto" type="submit" onClick={handleClick}>
          Find
        </button>
     
      </form>
      {results.length ? (
        <Reservations reservations={results} />
      ) : clicked && (
        <h3>No reservations found</h3>
      )}
    </div>
  );
}
