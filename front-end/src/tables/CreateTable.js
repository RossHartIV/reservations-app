
import React, { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

export default function CreateTable() {
    const history = useHistory();
    
    const [formData, setFormData] = useState({
        table_name: "",
        capacity: 0
    });
    const [formErrors, setFormErrors] = useState([]);

    const handleChange = ({ target: { name, value } }) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (evt) => {
        evt.preventDefault();
        setFormErrors([]);

        // the backend only accepts 'capacity' as a number, so we convert here
        formData.capacity = Number(formData.capacity)

        createTable(formData)
            .then(() => history.push('/dashboard'))
            .catch((error) => setFormErrors((currentErrors) => [...currentErrors, error]))
    };
    
    const showErrors = formErrors.map((error, index) => <ErrorAlert error={error} key={index}/>);

    const handleCancel = () => {
        history.goBack();
    };

    return (
        <div className="d-flex flex-column mb-3">
        <h1 className="h1 align-self-center">Create a New Table</h1>
        <form
          onSubmit={handleSubmit}
          className="align-self-center col-10 col-xl-5"
        >
          {showErrors}
          <fieldset>
            <div className="form-group my-2">
              <label htmlFor="table_name">Table Name</label>
              <input
                id="table_name"
                type="text"
                name="table_name"
                placeholder="Please provide a name for the table"
                title="Please provide a name for the table"
                className="form-control my-2"
                value={formData.table_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group my-2">
              <label htmlFor="capacity">Maximum Capacity</label>
              <input
                id="capacity"
                type="number"
                name="capacity"
                placeholder="Please enter the maximum seating capacity for this table"
                title="Please enter the maximum seating capacity for this table"
                className="form-control my-2"
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary btn-lg col-5"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-lg col-5">
                Submit
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    )
}