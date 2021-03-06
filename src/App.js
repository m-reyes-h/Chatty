import React, { useState, useEffect } from "react";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect
} from "react-router-dom";
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { auth } from "./services/firebase";

//---------------------------------------------------------------

function PrivateRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authenticated === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
}

//---------------------------------------------------------------

function PublicRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authenticated === false ? (
          <Component {...props} />
        ) : (
          <Redirect to="/chat" />
        )
      }
    />
  );
}

//---------------------------------------------------------------

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    });
  }, [authenticated]);

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home}></Route>
        <PrivateRoute
          path="/chat"
          authenticated={authenticated}
          component={Chat}
        ></PrivateRoute>
        <PublicRoute
          path="/signup"
          authenticated={authenticated}
          component={Signup}
        />
        <PublicRoute
          path="/login"
          authenticated={authenticated}
          component={Login}
        />
      </Switch>
    </Router>
  );
}

export default App;
