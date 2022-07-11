import React from "react";
import "./Error.css";
import { FaRegWindowClose } from "react-icons/fa";

export default function Error({ error, handleErrorClose }) {
  return (
    <div className="alert alert-danger mt-2 error-block d-flex justify-content-between align-items-center" role="alert">
      <div>{error}</div>
      <FaRegWindowClose onClick={handleErrorClose} />
    </div>
  );
}