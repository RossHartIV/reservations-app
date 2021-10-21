import React, { useState, useEffect } from 'react';
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from 'react-router-dom';

export default function ReservationForm({defaultForm, submitType, newOrEdit}) {
    const history = useHistory();
    
    const [formData, setFormData] = useState(defaultForm);
    const [formErrors, setFormErrors] = useState([]);

    useEffect(() => {
        setFormData(defaultForm);
    }, [defaultForm])

    const validForm = () => {
        let result = true;
        let reservationDate = new Date(`${formData.reservation_date}T${formData.reservation_time}`);
        if (Date.parse(reservationDate) < Date.parse(new Date())) {
            result = false;
            setFormErrors((currentErrors) => [
                ...currentErrors,
                { message: 'You have selected a past date, please select a future date for your reservation.'}
            ]);
        };
        if (reservationDate.getDay() === 2) {
            result = false;
            setFormErrors((currentErrors) => [
                ...currentErrors,
                { message: 'You have selected a reservation on a Tuesday. The restaurant is not open on Tuesdays, please select another day for your reservation.'}
            ]);
        };

        const open = new Date(`${formData.reservation_date}T10:30`);
        const close = new Date(`${formData.reservation_date}T21:30`);
        if (reservationDate < open) {
            result = false;
            setFormErrors((currentErrors) => [
                ...currentErrors,
                { message: 'You have selected a reservation time for before we open. Please select a time between 10:30am and 9:30pm.'}
            ]);
        };
        if (reservationDate > close) {
            result = false;
            setFormErrors((currentErrors) => [
                ...currentErrors,
                { message: 'You have selected a reservation time for after we open. Please select a time between 10:30am and 9:30pm.'}
            ]);
        };
        return result
    };

    const showErrors = formErrors.map((error, index) => <ErrorAlert error={error} key={index}/>);

    const handleChange = ({ target: { name, value } }) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (evt) => {
        evt.preventDefault();
        setFormErrors([]);

        // The database only stores 'people' as a number, so I just change it here
        formData.people = Number(formData.people);

        if (validForm()) {
            console.log(formData)
            submitType(formData)
                .then(() => history.push(`/dashboard?date=${formData.reservation_date}`))
                .catch((error) => setFormErrors((currentErrors) => [...currentErrors, error]));
        };
    };

    const handleCancel = () => {
        history.goBack();
    };

    return (
        <div className="d-flex flex-column mb-3">
            {newOrEdit === 'New' ? <h1 className="h1 align-self-center">New Reservation</h1>:<h1 className="h1 align-self-center">Edit Reservation</h1>}
            <form className="align-self-center col-10 col-xl-5" onSubmit={handleSubmit}>
            {showErrors}
                <fieldset className="d-flex flex-column ">
                    <div className="form-group my-2">
                    <label htmlFor="first_name">First Name</label>
                    <input
                        id="first_name"
                        type="text"
                        name="first_name"
                        placeholder="Enter your first name"
                        title="Enter your first name"
                        className="form-control my-2"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                    </div>

                    <div className="form-group my-2">
                    <label htmlFor="last_name">Last Name</label>
                    <input
                        id="last_name"
                        type="text"
                        name="last_name"
                        placeholder="Enter your last name"
                        title="Enter your last name"
                        className="form-control my-2"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                    </div>

                    <div className="form-group my-2">
                    <label htmlFor="mobile_number">Mobile number</label>
                    <input
                        id="mobile_number"
                        type="text"
                        name="mobile_number"
                        placeholder="Enter your mobile phone number"
                        title="Enter your mobile phone number"
                        className="form-control my-2"
                        value={formData.mobile_number}
                        onChange={handleChange}
                        required
                    />
                    </div>

                    <div className="form-group my-2">
                    <label htmlFor="reservation_date">Date of Reservation</label>
                    <input
                        id="reservation_date"
                        type="date"
                        name="reservation_date"
                        title="Please select the date you wish to reserve"
                        className="form-control my-2"
                        value={formData.reservation_date}
                        onChange={handleChange}
                        required
                    />
                    </div>

                    <div className="form-group my-2">
                    <label htmlFor="reservation_time">Time of Reservation</label>
                    <input
                        id="reservation_time"
                        type="time"
                        name="reservation_time"
                        title="Please select the time you wish to reserve"
                        className="form-control my-2"
                        value={formData.reservation_time}
                        onChange={handleChange}
                        required
                    />
                    </div>

                    <div className="form-group my-2">
                    <label htmlFor="people">Size of Party</label>
                    <input
                        id="people"
                        type="number"
                        name="people"
                        placeholder="Please enter the size of your party"
                        title="Please enter the size of your party"
                        className="form-control my-2"
                        min="1"
                        value={formData.people}
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
};