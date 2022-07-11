const knex = require("../db/connection");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function read(tableId) {
  return knex("tables").where({ table_id: tableId }).then((record) => record[0]);
}

function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdTable) => createdTable[0]);
}

async function update(updatedTable) {
  return knex.transaction(async (trx) => {
    await trx("reservations")
      .where({ reservation_id: updatedTable.reservation_id })
      .update({ status: "seated" });
      
    return await knex("tables")
      .select("*")
      .where({ table_id: updatedTable.table_id })
      .update(updatedTable, "*")
      .then((updatedRecords) => updatedRecords[0]);
  });
}

function finish(table_id, reservation_id) {
  return knex.transaction(async (trx) => {
    await trx("reservations")
      .where({ reservation_id })
      .update({ status: "finished" });

    return trx("tables")
      .select("*")
      .where({ table_id: table_id })
      .update({ reservation_id: null }, "*")
      .then((updatedRecords) => updatedRecords[0]);
  });
}

module.exports = {
  list,
  create,
  update, 
  read, 
  finish
};
