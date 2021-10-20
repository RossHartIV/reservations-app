import React, { useEffect, useState } from "react";
import ChangeDate from './ChangeDate'
import { listReservations, listTables, updateStatus, deleteReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

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
    const abortController = new AbortController();
    setReservationsError(null);
    setReservations([]);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }
  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    setTables([]);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  useEffect(loadReservations, [date]);
  // useEffect(loadTables);

  // function loadDashboard() {
  //   loadReservations();
  //   loadTables();
  // }

  return (
    <main>
      <div className="d-flex flex-column mb-3">
        <h1 className="h1 align-self-center">Dashboard</h1>
        <div className="container-lg d-flex flex-column align-items-center justify-content-center px-0">
          <div className="col-12">
            {/* <ErrorAlert error={reservationsError} />
            <ErrorAlert error={tablesError} /> */}
          </div>
          <h4 className="h4">Reservations for {date}</h4>
          <div>
            <ChangeDate displayedDate={date} buttonType="Previous"/>
            <ChangeDate displayedDate={date} buttonType="Today" />
            <ChangeDate displayedDate={date} buttonType="Next" />
          </div>
          {/* <div className="col-11">
            <DisplayTable
              data={reservations}
              objCols={reservationsCols}
              buttonFunction={cancelReservation}
            />
          </div>
          <h4 className="h4 mt-5">Tables in the Restaurant</h4>
          <div className="col-12">
            <DisplayTable
              data={tables}
              objCols={tableCols}
              buttonFunction={finishTable}
            />
          </div> */}
        </div>
      </div>
    </main>
  );
}

