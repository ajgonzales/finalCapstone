import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";
import Error from "./Error";

export default function CreateReservation() {
  const [errors, setErrors] = useState({});
  const history = useHistory();

  const handleErrorClose = (e) => {
    const errorMessage = e.target.parentNode.parentNode.childNodes[0].innerHTML;
    delete errors[`${errorMessage}`];
    setErrors({ ...errors });
  };

  const errorMap = Object.keys(errors).map((error) => (
    <Error key={`${error.split(" ")[0][0]}${error.split(" ")[1][0]}${error.split(" ")[2][0]}${error.split(" ")[3][0]}`} error={error} handleErrorClose={handleErrorClose} />
  ));

  const initialFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };

  const [formData, setFormData] = useState({ ...initialFormData });

  const handleChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    history.go(-1);
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    const ac = new AbortController();
    formData.people = parseInt(formData.people);
    formData.reservation_date = formData.reservation_date.split("T")[0];
    try {
      await createReservation(formData, ac.signal);
      setErrors({});
      history.push(`/dashboard?date=${formData.reservation_date}`);
    } catch (error) {
      if (error.message.split("|").length === 2) {
        const message1 = error.message.split("|")[0];
        const message2 = error.message.split("|")[1];
        console.log(message1, message2)
        if (!errors[message1] || !errors[message2]) {
          setErrors({ ...errors, [message1]: 1, [message2]: 1  });
        }
      }
     else if (!errors[error.message]) {
        setErrors({ ...errors, [error.message]: 1 })
    }
}
    return () => ac.abort();
  };

  return (
    <>
      <div className="createErrors">{errorMap ? errorMap : null}</div>
      <ReservationForm
        mode={"Create"}
        handleChange={handleChange}
        handleCancel={handleCancel}
        submitHandler={submitHandler}
        formData={formData}
      />
    </>
  );
}
