const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const dateFormatted = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
const timeFormatted = /[0-9]{2}:[0-9]{2}/;

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const validProperties = [
  "first_name",
  "last_name",
  "mobile_number",
  "people",
  "reservation_date",
  "reservation_time",
];

const validStatuses = ["booked", "cancelled", "finished", "seated"];

//Create reservation
async function create(req, res) {
  const reservation = await service.create(req.body.data);
  res.status(201).json({ data: reservation });
}

//VALIDATION: Reservation has valid properties
function hasValidProperties(req, res, next) {
  const { data = {} } = req.body;
  if (!data) {
    return next({
      status: 400,
      message: "requires request data",
    });
  }

  validProperties.forEach((property) => {
    if (!data[property]) {
      return next({
        status: 400,
        message: `requires ${property}`,
      });
    }

    if (property === "people" && !Number.isInteger(data.people)) {
      return next({
        status: 400,
        message: `requires ${property} to be a number`,
      });
    }

    if (
      property === "reservation_date" &&
      !dateFormatted.test(data.reservation_date)
    ) {
      return next({
        status: 400,
        message: `requires ${property} to be properly formatted as YYYY-MM-DD`,
      });
    }

    if (
      property === "reservation_time" &&
      !timeFormatted.test(data.reservation_time)
    ) {
      return next({
        status: 400,
        message: `requires ${property} to be properly formatted as HH:MM`,
      });
    }
  });

  next();
}

//VALIDATION: Date is already booked
function isBooked(req, res, next) {
  const { data } = req.body;
  if (data.status === "seated" || data.status === "finished") {
    return next({
      status: 400,
      message:
        "A new reservation cannot be created with a status of seated or finished",
    });
  }
  next();
}

//VALIDATION: Valid reservation date
function hasFutureWorkingDate(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const reservationDate = new Date(
      `${reservation_date}T${reservation_time}:00Z`
  );
  res.locals.time = reservationDate;
  const today = new Date();
  if (isNaN(reservationDate.getDate())) {
      next({
          message: `reservation_date / reservation_time incorrect`,
          status: 400,
      });
  }

  if (reservationDate.getUTCDay() == 2) {
      next({
          message: "Restaurant is closed on tuesdays",
          status: 400,
      });
  }

  if (reservationDate < today) {
      next({
          message: "Reservation needs to be in the future",
          status: 400,
      });
  }
  next();
}

//checks time against UTC time to make sure it is correct
function hasEligibleTime(req, res, next) {
  let hours = res.locals.time.getUTCHours();
  let minutes = res.locals.time.getUTCMinutes();
  if (
      hours < 10 ||
      (hours == 10 && minutes < 30) ||
      hours > 21 ||
      (hours == 21 && minutes > 30)
  ) {
      next({
          message: "Please select a time between 10:30 and 21:30",
          status: 400,
      });
  }
  next();
}


//List reservations
async function list(req, res) {
  const { date, mobile_number } = req.query;
  let reservations;
  if (date) {
    reservations = await service.listByDate(date);
  } else if (mobile_number) {
    reservations = await service.listByNumber(mobile_number);
  }

  res.json({ data: reservations });
}

function notFinished(req, res, next) {
  const { reservation_id } = req.params;
  const status = res.locals.reservation.status;
  if (status === "finished") {
    return next({
      status: 400,
      message: `Reservation ${reservation_id} is already finished`,
    });
  }
  next();
}

//Read reservation data
function read(req, res) {
  res.json({ data: res.locals.reservation });
}

//VALIDATION: Reservation exists
async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${reservation_id ? reservation_id : ""} Not Found`,
  });
}

//Update reservation
async function update(req, res, next) {
  const updated = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  service
    .update(updated)
    .then((data) => res.json({ data }))
    .catch(next);
}

//Update reservation Status
async function updateStatus(req, res, next) {
  const updated = {
    ...res.locals.reservation,
    status: res.locals.status,
  };
  service
    .update(updated)
    .then((data) => res.json({ data }))
    .catch(next);
}

//VALIDATION: Reservation status
function validStatus(req, res, next) {
  const { status } = req.body.data;
  if (validStatuses.includes(status)) {
    res.locals.status = status;
    next();
  } else {
    next({
      status: 400,
      message:
        "Status unknown! Status must be set to 'booked', 'seated', or 'finished'",
    });
  }
}

module.exports = {
  create: [
    hasValidProperties,
    hasFutureWorkingDate,
    hasEligibleTime,
    isBooked,
    asyncErrorBoundary(create),
  ],
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [
    asyncErrorBoundary(reservationExists),
    hasValidProperties,
    hasFutureWorkingDate,
    hasEligibleTime,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    validStatus,
    notFinished,
    asyncErrorBoundary(updateStatus),
  ],
};
