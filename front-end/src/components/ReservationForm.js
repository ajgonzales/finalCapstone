import React from "react";
import { FaTimes, FaCheck } from "react-icons/fa";

export default function ReservationForm({
  handleChange,
  submitHandler,
  formData,
  handleCancel,
  mode,
}) {
  return (
    <div className="ml-3 mr-3">
      <h1 className="my-3">{mode} Reservation</h1>
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="first_name">Enter Your First Name:</label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            className="form-control"
            required
            onChange={handleChange}
            value={formData.first_name}
          />
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Enter Your Last Name:</label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            className="form-control"
            required
            onChange={handleChange}
            value={formData.last_name}
          />
        </div>
        <div className="form-group">
          <label htmlFor="mobile_number">Enter Mobile Number:</label>
          <input
            id="mobile_number"
            name="mobile_number"
            type="text"
            className="form-control"
            required
            pattern="^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$"
            onChange={handleChange}
            value={formData.mobile_number}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reservation_date">Select Reservation Date:</label>
          <input
            id="reservation_date"
            name="reservation_date"
            type="date"
            className="form-control"
            required
            onChange={handleChange}
            value={formData.reservation_date}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reservation_time">Select Reservation Time:</label>
          <input
            id="reservation_time"
            name="reservation_time"
            className="form-control"
            type="time"
            required
            onChange={handleChange}
            value={formData.reservation_time}
          />
        </div>
        <div className="form-data">
          <label htmlFor="people">Set Number of Guests:</label>
          <input
            id="people"
            name="people"
            type="number"
            className="form-control"
            required
            min={1}
            onChange={handleChange}
            value={formData.people}
          />
        </div>
        <div className="form-group mt-3">
          <button
            className="btn btn-secondary mr-2"
            type="button"
            onClick={handleCancel}
          >
            <FaTimes /> Cancel
          </button>
          <button className="btn btn-primary" type="submit">
            <FaCheck /> Submit
          </button>
        </div>
      </form>
    </div>
  );
}
