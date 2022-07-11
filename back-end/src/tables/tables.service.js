const knex = require("../db/connection");

async function read(tableId) {
  return knex(table).select("*").where({ table_id: tableId }).first();
}

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdTables) => createdTables[0]);
}

function update(tableId, reservation_id = null) {
  return knex("tables")
    .select("*")
    .where({ table_id: tableId })
    .update({ reservation_id: reservation_id ? reservation_id : null });
}

function getTable(tableId) {
  return knex("tables").select("*").where({ table_id: tableId }).first();
}

function getReservation(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation_id })
    .first();
}

function changeStatus(reservation_id, newStatus) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation_id })
    .update({ status: newStatus });
}

function destroy(tableId) {
  return knex("tables").where({ table_id: tableId }).del();
}

module.exports = {
  read,
  list,
  create,
  update,
  getTable,
  getReservation,
  changeStatus,
  delete: destroy,
};
