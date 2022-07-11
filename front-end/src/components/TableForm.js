import { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";
import { FaTimes, FaCheck } from "react-icons/fa"; 

const TableForm = () => {
  const initialFormState = {
    table_name: "",
    capacity: "",
    reservation_id: null,
  };

  let history = useHistory();
  const [formData, setFormData] = useState({ ...initialFormState });
  const [error, setError] = useState(null);

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]:
        target.name === "capacity" ? Number(target.value) : target.value,
    });
  };

  const handleCancel = () => {
    history.go(-1);
  };

  const handleSubmit = async (e) => {
    const abortController = new AbortController();
    try {
      e.preventDefault();
      await createTable(formData, abortController.signal);
      history.push("/dashboard");
    } catch (error) {
      setError(error);
    }
    return () => abortController.abort();
  };

  return (
    <div className="d-flex justify-content-center mt-3">
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit}>
        <h2>Create Table</h2>
        <div className="form-group">
          <label htmlFor="table_name">
            Table Name
            <input
              name="table_name"
              id="table_name"
              className="form-control"
              value={formData.table_name}
              onChange={handleChange}
              required={true}
            />
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="capacity">
            Capacity
            <input
              type="number"
              id="capacity"
              name="capacity"
              className="form-control"
              required
              min="1"
              onChange={handleChange}
              value={formData.capacity}
            />
          </label>
        </div>
        <div className="form-group">
          <button className="btn btn-primary" type="submit">
          <FaCheck /> Submit
          </button>
          <button
            onClick={handleCancel}
            className="btn btn-secondary mr-2"
            type="cancel"
          >
           <FaTimes /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TableForm;
