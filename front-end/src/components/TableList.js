import React from "react";
import Table from "./Table";

export default function TableList({ tables, loadDashboard }) {

  const tableMap = tables.map((table) => (
    <Table key={table.table_id} table={table} loadDashboard={loadDashboard} />
  ));

  return (
    <div>
      {tableMap}
    </div>
  );
}