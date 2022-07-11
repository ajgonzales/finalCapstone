exports.up = function (knex) {
  return knex.schema.createTable("tables", (table) => {
    table.increments("table_id");
    table.string("table_name").notNullable(); //must be at least 2 chars
    table.integer("capacity").notNullable();
    table
      .integer("reservation_id")
      .references("reservation_id")
      .inTable("reservations");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("tables");
};
