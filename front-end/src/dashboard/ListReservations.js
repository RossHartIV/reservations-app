import React from "react";
import { SeatBtn, EditBtn, CancelBtn } from "../utils/buttons";
import { Link } from "react-router-dom";

export default function ListReservations({ reservations, loadDashboard }) {
    const required = {
        first_name: "First Name",
        last_name: "Last Name",
        people: "Guests",
        reservation_time: "Time",
        mobile_number: "Mobile Number",
        status: "Status"
    }
    const Rows = () => {
        return reservations.map((reservation, i) => { 
            const Row = () => {
                return Object.keys(required).map((key, index) => {
                    if (key === "status"){
                        return (<td key={index} data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>)
                    }
                    return (<td key={index}>{reservation[key]}</td>);
                });
            };
            return (
                <tr key={i}>
                    <Row />
                    <td>
                        { reservation.status === "booked" &&<SeatBtn reservation_id={reservation.reservation_id} /> }
                        { reservation.status === "booked" && <EditBtn reservation_id={reservation.reservation_id} /> }
                        { (reservation.status !== "cancelled" && reservation.status !== "finished") && <CancelBtn reservation_id={reservation.reservation_id} status={reservation.reservation_status} loadReservations={loadDashboard} /> }
                    </td>
                </tr>
            )
        })
    };

    const Table = () => {
        return (
        <table className="table">
            <thead>
                <tr> 
                    {Object.values(required).map((info, index)=> <th key={index}>{info}</th>)}
                </tr>
            </thead>
            <tbody>
                <Rows />
            </tbody>
        </table>
        )
    }

    const NoReservations = () => {
        return (
            <div>
                <div style={{display: 'flex',  justifyContent:'center',  height: '7vh'}}>
                    <h2>No reservations found</h2>
                </div>
                <div style={{display: 'flex',  justifyContent:'center',  height: '10vh'}}>
                    <Link to={`/reservations/new`} href={`/reservations/new`} >
                        <button type="button" className="btn btn-success">
                            Add reservation
                        </button>
                    </Link>
                </div>
            </div>               
        )
    }
    
    return (
        <div className="row">
            <div className="col-12">

                {reservations.length === 0 ? <NoReservations/> : <Table /> }

            </div>
        </div>
    )
}