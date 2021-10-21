import React, { useEffect, useState } from "react";
import ChangeDate from './ChangeDate'
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ListReservations from "./ListReservations";
import ListTables from "./ListTables";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
export default function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);

  function loadReservations() {
    return listReservations({ date })
      .then(setReservations)
      .catch(setReservationsError);
  }

  function loadTables() {
    return listTables()
      .then(setTables)
      .catch((res) => {
        setTablesError(res)
      });
  }

  useEffect(loadReservations, [date]);
  useEffect(loadTables, []);

  const loadDashboard = () => {
    return loadReservations()
      .then(loadTables);
  }

  return (
      <div className="d-flex flex-column mb-3">
        <h1 className="h1 align-self-center">Dashboard</h1>
        <div className="container-lg d-flex flex-column align-items-center justify-content-center px-0">
          <div className="col-12">
            <ErrorAlert error={reservationsError} />
            <ErrorAlert error={tablesError} />
          </div>
          <h4 className="h4">Reservations for {date}</h4>
          <div>
            <ChangeDate displayedDate={date} buttonType="Previous"/>
            <ChangeDate displayedDate={date} buttonType="Today" />
            <ChangeDate displayedDate={date} buttonType="Next" />
          </div>
          <div className="col-11">
            <ListReservations reservations={reservations} loadDashboard={loadDashboard}/>
          </div>
          <h4 className="h4 mt-5">Restaurant Tables</h4>
          <div className="col-12">
            <ListTables tables={tables} loadDashboard={loadDashboard}/>
          </div>
        </div>
      </div>
  );
}

