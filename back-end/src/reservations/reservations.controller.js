const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//middleware

const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "created_at",
  "updated_at",
  "status",
  "reservation_id",
];

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;
  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

function validDate(req, res, next) {
  const { data = {} } = req.body;
  if (!data["reservation_date"].match(/\d{4}-\d{2}-\d{2}/)) {
    return next({
      status: 400,
      message: `reservation_date invalid.`,
    });
  }
  else if (new Date(data["reservation_date"]).getDay() + 1 === 2) {
    next({
      status: 400,
      message: `We are closed on Tuesdays, please pick a day when we are open!`,
    });
  }
  else if (Date.parse(data["reservation_date"]) < Date.now()) {
    next({
      status: 400,
      message: `Reservation must be reserved for a date in the future.`,
    });
  }
  next();
}

function validTime(req, res, next) {
  const { data = {} } = req.body;
  if (!data["reservation_time"].match(/[0-9]{2}:[0-9]{2}/)) {
    return next({
      status: 400,
      message: `reservation_time wrong`,
    });
  }
  let time = data["reservation_time"] && data["reservation_time"].replace(":", "");
  if (time < 1030) {
    next({
      status: 400,
      message: "Reservation cannot be before business hours!",
    });
  }
  if (time > 2130) {
    next({
      status: 400,
      message:
        "Reservation cannot be less than one hour before business closing!",
    });
  }
  next();
}

function validPeople(req, res, next) {
  const { data = {} } = req.body;
  const people = data.people;

  if (typeof people != "number") {
    return next({
      status: 400,
      message: `people wrong`,
    });
  }
  next();
}

function isStatusValid(req, res, next) {
  const { data = {} } = req.body;
  const { status } = data;
  if (status == "booked" || status == undefined) {
    return next();
  }
  return next({ status: 400, message: `Invalid status: ${status}` });
}

async function exists(req, res, next) {
  const { reservation_id } = req.params;
  const data = await service.read(reservation_id);
  if (data) {
    res.locals.reservation = data;
    return next();
  }
  return next({
    status: 404,
    message: `uhhh no: ${reservation_id} doesn't exist`,
  });
}

function validStatus(req, res, next) {
  const reservation = res.locals.reservation;
  const { data = {} } = req.body;
  const status = data.status;
  if (reservation.status === "finished") {
    return next({ status: 400, message: `Reservation is already finished` });
  }

  const validStatuses = ["finished", "booked", "seated", "cancelled"];
  if (validStatuses.includes(status)) {
    return next();
  }
  return next({ status: 400, message: `Invalid or unknown status: ${status}` });
}

//Controller Functions

async function list(req, res) {
  let current = new Date();
  let cDate =
    current.getFullYear() +
    "-" +
    (current.getMonth() + 1) +
    "-" +
    current.getDate();
  if (req.query.mobile_number) {
    const data = await service.search(req.query.mobile_number);
    res.json({ data });
  } else {
    const { date } = req.query;
    res.json({ data: await service.list(date || cDate) });
  }
}

function read(req, res) {
  res.json({ data: res.locals.reservation });
}
async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function statusUpdate(req, res) {
  const { status } = req.body.data;
  const reservation = res.locals.reservation;
  reservation.status = status;
  const data = await service.statusUpdate(reservation);
  res.json({ data });
}

async function update(req, res, next) {
  const updatedReservation = { ...req.body.data };
  updatedReservation.reservation_id = res.locals.reservation.reservation_id;
  const data = await service.update(updatedReservation);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    validDate,
    validTime,
    validPeople,
    isStatusValid,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(exists), read],
  statusUpdate: [
    asyncErrorBoundary(exists),
    validStatus,
    asyncErrorBoundary(statusUpdate),
  ],
  update: [
    asyncErrorBoundary(exists),
    hasOnlyValidProperties,
    hasRequiredProperties,
    validDate,
    validTime,
    validPeople,
    isStatusValid,
    asyncErrorBoundary(update),
  ],
};
