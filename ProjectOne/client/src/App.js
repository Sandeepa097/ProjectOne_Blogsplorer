import React, {useEffect, useState} from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";

import routes from "./routes";
import withTracker from "./withTracker";
import SocketContex from "./websocket/socketContext";
import socket from "./websocket/webSocket"
import { LoginStore, Constants, Dispatcher } from "./flux";

import Auth from "./views/Auth";
import { AuthLayout } from "./layouts";

import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";

const App = () => {
  const [authed, setAuthed] = useState(!!sessionStorage.getItem("userId"))

  useEffect(() => {
    LoginStore.addChangeListener(setChange)
    if(!authed) {
      return null
    }

    socket.on('join', (data) => {
      Dispatcher.dispatch({
        actionType: Constants.RECIEVE_ACTIVE,
        payload: data
      })
    })

    socket.on('user disconnect', (data) => {
      Dispatcher.dispatch({
        actionType: Constants.REMOVE_ACTIVE,
        payload: data
      })
    })

    socket.on('message', (msg) => {
      Dispatcher.dispatch({
        actionType: Constants.RECIEVE_SOCKET_MESSAGE,
        payload: msg
      })
    })
    
    socket.on('notify', (data) => {
      Dispatcher.dispatch({
        actionType: Constants.RECIEVED_NOTIFY,
        payload: data
      })
      Dispatcher.dispatch({
        actionType: Constants.SETCOUNT_NOTIFY,
        payload: 1
      })
    })

    return () => {
      LoginStore.removeChangeListener(setChange)
    }
  }, []) 

  const setChange = () => {
    const isAuth = LoginStore.getLoginStatus()
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
          <Route 
            path= "/register"
            exact= {true}
            render= {() => <AuthLayout><Auth /></AuthLayout>}
          />
        {!!authed && routes.map((route, index) => (
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
          )
        )}
        </Switch>
      </div>
    </Router>
  </SocketContex.Provider>
  )
}

export default App