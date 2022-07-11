const { table } = require("../db/connection");
const knex = require("../db/connection");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function read(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdTable) => createdTable[0]);
}

function update(table_id, reservation_id) {
  return knex.transaction(async (trx) => {
    await trx("reservations")
      .where({ reservation_id })
      .update({ status: "seated" });

    return await knex("tables")
      .select("*")
      .where({ table_id })
      .update({ reservation_id })
      .then((updatedTable) => updatedTable[0])
      .catch(console.log);
  });
}

function finish(table_id, reservation_id) {
  return knex.transaction(async (trx) => {
    await trx("reservations")
      .where({ reservation_id })
      .update({ status: "finished" });

    return trx("tables")
      .select("*")
      .where({ table_id })
      .update({ reservation_id: null }, "*")
      .then((finishedTable) => finishedTable[0])
      .catch(console.log);
  });
}
module.exports = {
  list,
  read,
  create,
  update,
  finish,
};
