import ReservationForm from "./ReservationForm";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { editReservation, readReservation } from "../utils/api";
import Error from "./Error";

export default function EditReservation() {
  const { reservation_id } = useParams();
  const [editFormData, setEditFormData] = useState({});
  const [errors, setErrors] = useState({});
  const history = useHistory();

  useEffect(() => {
    const ac = new AbortController();
    readReservation(reservation_id, ac.signal)
      .then((res) =>
        setEditFormData({
          ...res,
          reservation_date: res.reservation_date.split("T")[0],
        })
      )
      .catch((error)=>{
        
        if (!errors[error.message]) {
          setErrors({ ...errors, [error.message]: 1 });
        }
      });
    return () => ac.abort();
  }, [errors,reservation_id]);

  const errorMap = Object.keys(errors).map((error, index) => (
    <Error key={index} error={error} />
  ));

  const handleCancel = (e) => {
    e.preventDefault();
    history.go(-1);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const ac = new AbortController();
    editFormData.people = parseInt(editFormData.people);
    try {
      await editReservation(editFormData, ac.signal);
      history.push(`/dashboard?date=${editFormData.reservation_date}`);
    } catch (error) {
      if (!errors[error.message]) {
        setErrors({ ...errors, [error.message]: 1 });
      }
    }
    return () => ac.abort();
  };

  return (
    Object.keys(editFormData).length ? (
      <>
        <div className="createErrors">{errorMap ? errorMap : null}</div>
        <ReservationForm
          formData={editFormData}
          purpose={"Edit"}
          submitHandler={handleSubmit}
          changeHandler={handleChange}
          cancelHandler={handleCancel}
        />
      </>
    ) : <h3>Loading</h3>
  );
}
