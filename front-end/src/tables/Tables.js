import Table from "./Table";
export default function Tables({ tables }) {
  return (
    <>
      <legend className="text-center">Tables</legend>
      <table className="table table-hover text-center rounded">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">NAME</th>
            <th scope="col">CAPACITY</th>
            <th scope="col">FREE?</th>
            <th scope="col"> </th>
          </tr>
        </thead>
        <tbody>
          {tables && tables.map((table) => (
            <Table key={table.table_id} table={table} />
          ))}
        </tbody>
      </table>
    </>
  );
}
