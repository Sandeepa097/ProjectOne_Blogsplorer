import React, {useEffect, useState} from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";

import routes from "./routes";
import withTracker from "./withTracker";
import SocketContex from "./websocket/socketContext";
import socket from "./websocket/webSocket"
import { UserStore } from "./flux";

import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";

const App = () => {
  const [authed, setAuthed] = useState(!!sessionStorage.getItem("userId"))

  useEffect(() => {
    UserStore.addChangeListener(setChange)
    return () => {
      UserStore.removeChangeListener(setChange)
    }
  }, []) 

  const setChange = () => {
    const isAuth = !!UserStore.getUserDetails().id
    setAuthed(isAuth)
  }
 
  const loginController = () => {
    if(!authed) {
      return <Redirect to = "/register" />
    }
    else if(authed && (window.location.pathname === "/register")) {
      socket.emit('join', sessionStorage.getItem("userId"))
      return <Redirect to = "/blog-posts" />
    }
    else{
      socket.emit('join', sessionStorage.getItem("userId"))
      return null
    }
  }

  return (
    <SocketContex.Provider value={socket}>
    <Router basename={process.env.REACT_APP_BASENAME || ""}>
      <div>
        {loginController()}
        <Switch>
        {routes.map((route, index) => {
          return (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={withTracker(props => {
                return (
                <route.layout {...props}>
                  <route.component {...props} />
                </route.layout>
                );
              })}
            />
          );
        })}
        </Switch>
      </div>
    </Router>
  </SocketContex.Provider>
  )
}

export default App