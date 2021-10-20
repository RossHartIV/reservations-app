const service = require('./reservations.service')
const asyncErrorBoundary = require('../errors/ayncErrorBoundary')

// async function list(req, res) {
//   res.json({
//     data: [],
//   });
// }

async function create(req, res) {
  const data = await service.create(req.body.data);

  res.status(201).json({ data });
}

async function read(req, res) {
  res.json({ data: res.locals.reservation });
}

async function update(req, res) {
  const input = req.body.data;
  const updatedReservation = {};

  for (let prop in input) {
    if (!['status','created_at','updated_at','reservation_id'].includes(prop)) {
      updatedReservation[prop] = input[prop]
    };
  };
  
  const data = await service.update(input.reservation_id, updatedReservation)

  res.json({ data });
}


// --------------------------------------------------------------------------------
// ---------------------------------- MIDDLEWARE ----------------------------------
// --------------------------------------------------------------------------------

function validateParams(req, res, next) {
  const { data = null } = req.body;

  if (!data) next({ status: 400, message: "No parameters given" });

  // must have status of either 'booked' or 'cancelled'
  // if (data.status && data.status !== "booked" && data.status !== "cancelled") {
  //   return next({ status: 400, message: `No such status: ${data.status}` });
  // }

  const input = Object.keys(data);

  const required = [
    "first_name",
    "last_name",
    "reservation_date",
    "reservation_time",
    "mobile_number",
    "people",
  ];

  // must include each of the required fields
  for (let i = 0; i < required.length; i++) {
    const param = required[i];

    if (!input.includes(param) || !data[param]) {
      return next({ status: 400, message: `missing ${required[i]} parameter` });
    };
  };

  // 'people' must be a number greater than 1
  if ( typeof data.people != "number" || isNaN(data.people) || data.people < 1 ) {
    return next({ status: 400, message: "people must contain an integer greater than or equal to 1" });
  }

  // all dates must match the format of the JS date function
  const open = new Date(`${data.reservation_date}T10:30`);
  const close = new Date(`${data.reservation_date}T21:30`);
  const reservationDate = new Date(data.reservation_date)
  const reservationTime = new Date(`${data.reservation_date}T${data.reservation_time}`)

  // date must be in the correct form
  if (!reservationDate || reservationDate.toString() === "Invalid Date") {
    return next({ status: 400, message: "reservation_date is invalid" });
  }

  // time must be in the correct form
  if (!reservationTime || reservationTime.toString() === "Invalid Date") {
    return next({ status: 400, message: "reservation_time is invalid" });
  };
  
  // date must not be on a Tuesday
  if (reservationDate.getDay() === 2) {
    return next({ status: 400, message: "reservation_date must not fall on a Tuesday" });
  };

  // reservation time must be between 10:30am and 9:30pm
  if (reservationTime < open || reservationTime > close) {
    return next({ status: 400, message: "reservation_time must fall between 10:30 and 21:30" });
  }

  // reservation date must be in the future
  if (Date.parse(reservationDate) < Date.parse(new Date())) {
    return next({ status: 400, message: "reservation_date must be a future date" });
  }

  next();
}

function validateQuery(req, next) {
  const { query } = req;

  for (const property in query) {
    if (property !== 'mobile_number' && property!=='date') {
      return next({ status: 400, message: `property '${property}' is invalid - query must be either 'date' or 'mobile_number'` });
    };
  };

  next();
}

async function validateId(req, res, next) {
  const { reservation_id } = req.params;

  if (!reservation_id)
    return next({ status: 404, message: "missing reservation_id" });

  const data = await service.read(reservation_id);

  if (!data){
    return next({ status: 404, message: `no reservation for reservation_id: ${reservation_id}` });
  };

  res.locals.reservation = data;

  return next();
}

function validateStatus(req, res, next) {
  const { status = null } = req.body.data;
  const { reservation = null } = res.locals;

  if (!reservation){
    return next({ status: 400, message: "this reservation does not exist" });
  };

  if (!status){
    return next({ status: 400, message: "status must be included in reservation data" });
  };

  // status should only be 'booked', 'seated', 'finished', or 'cancelled'
  if ( status != "booked" && status !== "seated" && status !== "finished" && status !== "cancelled"){
    return next({ status: 400, message: `${status} is not a valid status ` });
  };

  // only accept mutable statuses
  if (reservation.status === "finished" || reservation.status === "cancelled"){
    return next({ status: 400, message: "Reservation status cannot be updated once in 'finished' or 'cancelled' state" });
  };

  res.locals.status = status;
  next();
}

module.exports = {
  // list,
  create: [validateParams, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(validateId), read],
  update: [validateParams, asyncErrorBoundary(validateId), asyncErrorBoundary(update)]
};
