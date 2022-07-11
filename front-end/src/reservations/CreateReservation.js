import ReservationForm from "./ReservationForm";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import Error from "./Error";
export default function CreateReservation() {
  const initForm = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };

  const [formData, setFormData] = useState(initForm);
  const [errors, setErrors] = useState({});
  const history = useHistory();

  const errorMap = Object.keys(errors).map((error, index) => (
    <Error key={index} error={error} />
  ));

  const cancelHandler = (e) => {
    e.preventDefault();
    history.go(-1);
  };
  const changeHandler = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const ac = new AbortController();
    formData.people = parseInt(formData.people);
    try {
      await createReservation(formData, ac.signal);

      setErrors({});
      history.push(`/dashboard?date=${formData.reservation_date}`);
    } catch (error) {
      if (!errors[error.message]) {
        setErrors({ ...errors, [error.message]: 1 });
      }
    }
    return () => ac.abort();
  };
  return (
    <>
      <div className="createErrors">{errorMap ? errorMap : null}</div>
      <ReservationForm
        formData={formData}
        purpose={"Create"}
        submitHandler={submitHandler}
        changeHandler={changeHandler}
        cancelHandler={cancelHandler}
      />
    </>
  );
}
