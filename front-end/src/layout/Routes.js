import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import CreateReservation from "../components/CreateReservation";
import useQuery from "../utils/useQuery";
import TableForm from "../components/TableForm";
import SeatReservation from "../components/SeatReservation";
import SearchPage from "../components/SearchPage";
import EditReservation from "../components/EditReservation";
/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const query = useQuery();
  const date = query.get("date");

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/reservations/new">
        <CreateReservation />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={ date ? date : today()} />
      </Route>
      <Route exact={true} path="/tables/new">
        <TableForm /> 
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <SeatReservation />
      </Route>
      <Route path="/search">
        <SearchPage />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}


export default Routes;
