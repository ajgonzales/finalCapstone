import React from "react";

//import Error from "./Error";

//const url = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
export default function ReservationForm({
  purpose,
  changeHandler,
  cancelHandler,
  submitHandler,
  formData,
}) {
  return (
    <>
      <h1 className="text-center mt-4">{purpose} Reservation</h1>
      <form onSubmit={submitHandler}>
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          name="first_name"
          id="firstName"
          placeholder="First Name"
          value={formData.first_name}
          onChange={changeHandler}
          className="form-control form-control-lg"
          required
        />
        <label htmlFor="last_name">Last Name</label>
        <input
          type="text"
          name="last_name"
          id="lastName"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={changeHandler}
          className="mx-2 form-control form-control-lg"
          required
        />
        <label htmlFor="mobile_number">Mobile Number</label>
        <input
          type="text"
          name="mobile_number"
          id="mobileNumber"
          placeholder="XXX-XXX-XXXX"
          value={formData.mobile_number}
          onChange={changeHandler}
          className="mx-2 form-control form-control-lg"
          required
        />
        <label htmlFor="reservation_date">Reservation Date</label>
        <input
          type="date"
          name="reservation_date"
          id="reservationDate"
          value={formData.reservation_date}
          onChange={changeHandler}
          className="mx-2 form-control form-control-lg"
          required
        />
        <label htmlFor="reservation_time">Reservation Time</label>
        <input
          type="time"
          name="reservation_time"
          id="reservationTime"
          onChange={changeHandler}
          value={formData.reservation_time}
          className="mx-2 form-control form-control-lg"
          required
        />
        <label htmlFor="people">Party Size</label>
        <input
          type="number"
          name="people"
          id="people"
          value={formData.people}
          onChange={changeHandler}
          min={1}
          className="mx-2 form-control form-control-lg"
          required
        />
        <div className="d-flex flex-wrap align-items-center justify-content-center">
          <button className="btn btn-lg btn-primary mx-auto" type="submit">
            Submit
          </button>
          <button
            className="btn btn-lg btn-danger mx-auto"
            onClick={cancelHandler}
            type="button"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
