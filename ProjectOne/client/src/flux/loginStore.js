import { EventEmitter } from "events";

import Dispatcher from "./dispatcher";
import Constants from "./constants";

let _logged = false

class LoginStore extends EventEmitter {
  constructor() {
    super();

    this.registerToActions = this.registerToActions.bind(this);
    this.changeLogin = this.changeLogin.bind(this);

    Dispatcher.register(this.registerToActions.bind(this));
  }

  registerToActions({ actionType, payload }) {
    switch (actionType) {
      case Constants.LOGGED:
        this.changeLogin(payload);
        break;
      default:
    }
  }

  changeLogin(status) {
    _logged = status
    this.emit(Constants.LOGIN_CHANGE);
  }

  getLoginStatus() {
    return _logged;
  }

  addChangeListener(callback) {
    this.on(Constants.LOGIN_CHANGE, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(Constants.LOGIN_CHANGE, callback);
  }
}

export default new LoginStore();
