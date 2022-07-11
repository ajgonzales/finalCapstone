const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const dateTime = require("../utils/dateTime")

const { today } = dateTime;
/**
 * List handler for reservation resources
 */
async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function list(req, res) {
  if (req.query.mobile_number) {
    const data = await service.search(req.query.mobile_number);
    res.json({ data });
  } else {
    const currentDay = today();
    const data = await service.list(
      req.query.date ? req.query.date : currentDay
    );
    res.json({ data });
  }
}

function read(req, res) {
  const { reservation: data } = res.locals;
  res.json({ data });
}

function validPeople(req, res, next) {
  const { data: { people } = {} } = req.body;
  if (Number(people) > 0 && typeof people === "number") {
    next();
  } else {
    next({
      status: 400,
      message: "people must be greater than zero.",
    });
  }
}

function validDate(req, res, next) {
  const { data } = req.body;
  const regexDate = /^\d{4}-\d{2}-\d{2}$/;
  const today = new Date();
  const reservationDate = new Date(data["reservation_date"]);

  if (data["reservation_date"].match(regexDate) === null) {
    return next({
      status: 400,
      message: `reservation_date must be a valid date`,
    });
  }
  if (today > reservationDate.getTime() && reservationDate.getDay() == 1) {
    return next({
      status: 400,
      message:
        "Reservation date/time must occur in the future|The restaurant is closed on Tuesday",
    });
  } else if (today > reservationDate) {
    return next({
      status: 400,
      message: "Reservation date/time must occur in the future",
    });
  } else if (reservationDate.getDay() == 1) {
    return next({
      status: 400,
      message: "The restaurant is closed on Tuesday",
    });
  }
  next();
}

function validTime(req, res, next) {
  const { data } = req.body;
  const regexTime = /([0-1]?\d|2[0-3]):([0-5]?\d):?([0-5]?\d)/;
  const date = new Date(`${data.reservation_date}, ${data.reservation_time}`);
  const minutes = date.getHours() * 60 + date.getMinutes();
  const startingMinutes = 630;
  const endingMinutes = 1290;
  if (data["reservation_time"].match(regexTime) === null) {
    return next({
      status: 400,
      message: `reservation_time must be a valid time`,
    });
  }
  if (minutes < startingMinutes || minutes > endingMinutes) {
    return next({
      status: 400,
      message: "Please select a time between 10:30 and 21:30",
    });
  }
  next();
}

function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    data[propertyName]
      ? next()
      : next({
          status: 400,
          message: `Form must contain valid property ${propertyName}`,
        });
  };
}

function validStatus(req, res, next) {
  const reservation = res.locals.reservation;
  const { data = {} } = req.body;
  const status = data["status"];

  if (reservation.status === "finished") {
    return next({
      status: 400,
      message: "Reservation is already finished.",
    });
  }

  const validStatuses = ["booked", "seated", "finished", "cancelled"];
  if (validStatuses.includes(status)) {
    return next();
  }

  return next({
    status: 400,
    message: `Invalid or unknown status: ${status}`,
  });
}



async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  } else {
    return next({
      status: 404,
      message: `Reservation ID ${reservation_id} does not exist.`,
    });
  }
}

async function update(req, res) {
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  const data = await service.update(updatedReservation);
  res.json({ data });
}

async function updateStatus(req, res) {
  const reservation = res.locals.reservation;
  const { status } = req.body.data;
  const updatedReservation = {
    ...reservation,
    status,
  };
  const data = await service.updateStatus(updatedReservation);
  res.json({ data });
}

function bookedCheck(req, res, next) {
  const { data = {} } = req.body;
  const status = data["status"];

  if (status === "booked" || status === undefined) {
    return next();
  }
  return next({
    status: 400,
    message: `Invalid or unknown status: ${status}`,
  });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    bodyDataHas("reservation_time"),
    bodyDataHas("reservation_date"),
    validPeople,
    validDate,
    validTime,
    bookedCheck,
    asyncErrorBoundary(create),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    validStatus,
    asyncErrorBoundary(updateStatus),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [
    asyncErrorBoundary(reservationExists),
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    bodyDataHas("reservation_time"),
    bodyDataHas("reservation_date"),
    validDate,
    validTime,
    validPeople,
    bookedCheck,
    asyncErrorBoundary(update),
  ]
};
