// import { Flex, Spinner } from "@chakra-ui/core";
import { Flex } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Task from "./pages/Task";
import Workflow from "./pages/Workflow";
import Register from "./pages/Register";
import Task_Graph from "./components/Task_Graph";
import { useSelector } from "react-redux";
import Unauthorised from "./components/Unauthorised";
import Unauthorised2 from "./components/Unauthorised2";
import Homepage from "./components/Homepage";
import Initialize from "./pages/Initialize";

export default function SiteRoutes() {

  const RequireAuth = ( { children, redirectTo, adminOnly } ) => {
    const auth = useSelector((state) => state.auth);

    if (auth.account == undefined) {
      return <Unauthorised2 />
    }

    if( adminOnly) {
      return auth.account.is_superuser ? children : <Unauthorised />
    }
    if( !adminOnly ) {
      return auth.account ? children : <Navigate to={redirectTo} />
    }
  }

  return (
    <Router>
      <React.Fragment>
        <Routes>
          
          <Route exact path="/" element={<Homepage />}></Route>

          <Route 
            path="/workflow"
            element={
              <RequireAuth redirectTo="/login" adminOnly={true}>
                <Workflow />
              </RequireAuth>
            }
          > 
          </Route>

          <Route 
            path="/task"
            element={
              <RequireAuth redirectTo="/login" adminOnly={false}>
                <Task />
              </RequireAuth>
            }
          > 
          </Route>

          <Route 
            path="/admin"
            element={
              <RequireAuth redirectTo="/login" adminOnly={true}>
                <Admin />
              </RequireAuth>
            }
          > 
          </Route>

          <Route 
            path="/dashboard"
            element={
              <RequireAuth redirectTo="/login" adminOnly={false}>
                <Dashboard />
              </RequireAuth>
            }
          > 
          </Route>

          <Route exact path="/initialize" element={<Initialize />}></Route>

          {/* <Route exact path="/dashboard" element={<Dashboard />}></Route> */}

          <Route exact path="/task" element={<Task />}></Route>

          {/* <Route exact path="/admin" element={<Admin />}></Route> */}

          <Route exact path="/login" element={<Login />}></Route>

          <Route exact path="/register" element={<Register />}></Route>

          <Route exact path="/task_graph" element={<Task_Graph />}></Route> 

        </Routes>
      </React.Fragment>
    </Router>
  );
}

export const LoadingPage = props => {
  return (
    <Flex
      justify="center"
      align="center"
      justifyContent="center"
      direction="column"
      h={["60vh", "75vh"]}
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="green.500"
        size="xl"
      />
    </Flex>
  );
};
