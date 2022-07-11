const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationService = require("../reservations/reservations.service");

async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

async function create(req, res) {
  const { data } = req.body;
  const value = await service.create(data);
  res.status(201).json({ data: value });
}

async function update(req, res, next) {
  const updatedTable = {
    table_id: res.locals.table.table_id,
    reservation_id: req.body.data.reservation_id,
  };
  const data = await service.update(updatedTable);
  res.json({data})
}

function validateTableName(req, res, next) {
  const { data } = req.body;
  if (!data) {
    next({
      status: 400,
      message: "Table name cannot be empty",
    });
  } else if (!data["table_name"] || data["table_name"].length < 2) {
    next({
      status: 400,
      message: "Please include valid table_name longer than one character",
    });
  }
  next();
}

async function reservationExists(req, res, next) {
  const { data } = req.body;
  const { reservation_id } = data;
  const reservation = await reservationService.read(reservation_id);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation with ID: ${reservation_id} cannot be found`,
  });
}

async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await service.read(table_id)
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({
    status: 404,
    message: `Table with ID: ${table_id} cannot be found`,
  });
}

function validateCapacity(req, res, next) {
  const { data } = req.body;
  if (!data) {
    next({
      status: 400,
      message: "capacity cannot be empty",
    });
  } else if (
    !data["capacity"] ||
    (typeof data["capacity"] !== "number" && data["capacity"] > 0)
  ) {
    next({
      status: 400,
      message: "capacity must include a number greater than zero",
    });
  }
  next();
}

async function tableHasCapacity(req, res, next) {
  const { table } = res.locals;
  return table.capacity >= res.locals.reservation.people
    ? next()
    : next({ status: 400, message: `table does not have enough capacity` });
}

function tableIsOccupied(req, res, next) {
  const { table } = res.locals;
  return !table.reservation_id
    ? next()
    : next({ status: 400, message: `This table is currently occupied` });
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

function reservationNotSeated(req, res, next) {
  const reservation = res.locals.reservation;
  if (reservation.status === "booked") {
    return next();
  }
  return next({
    status: 400,
    message: "Reservation is already seated or finished."
  })
}

function currentlyOccupied(req,res,next){
  if (!res.locals.table.reservation_id) {
    return next({
      status: 400,
      message: "Table is currently not occupied",
    });
  }
  next();
}

async function finish(req, res) {
  const table = res.locals.table;
  const data = await service.finish(table.table_id, table.reservation_id);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [validateCapacity, validateTableName, asyncErrorBoundary(create)],
  update: [
    bodyDataHas("reservation_id"),
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(tableExists),
    tableIsOccupied,
    tableHasCapacity,
    reservationNotSeated,
    asyncErrorBoundary(update),
  ],
  finish: [asyncErrorBoundary(tableExists), currentlyOccupied, asyncErrorBoundary(finish)],
};
