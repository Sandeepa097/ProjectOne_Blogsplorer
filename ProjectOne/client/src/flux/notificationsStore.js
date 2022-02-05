import { EventEmitter } from "events";

import Dispatcher from "./dispatcher";
import Constants from "./constants";

let _notifications = []
let _count = 0

class NotificationsStore extends EventEmitter {
  constructor() {
    super();

    this.registerToActions = this.registerToActions.bind(this);
    this.setNotifications = this.setNotifications.bind(this);
    this.setCount = this.setCount.bind(this)

    Dispatcher.register(this.registerToActions.bind(this));
  }

  registerToActions({ actionType, payload }) {
    switch (actionType) {
      case Constants.RECIEVED_NOTIFY:
        this.setNotifications(payload);
        break;
      case Constants.SETCOUNT_NOTIFY:
          this.setCount(payload)
          break;
      default:
    }
  }

  setNotifications(payload) {
    console.log("payloadStore", payload)
    _notifications = [payload, ..._notifications]
    console.log("notificationsStore", _notifications)
    this.emit(Constants.NOTIFICATION_CHANGE);
  }

  setCount(count) {
    if(!count) {
        _count = 0
    }
    else{
        _count++
    }
  }

  getNotifications() {
    return _notifications;
  }

  getCount(){
      return _count
  }

  addChangeListener(callback) {
    this.on(Constants.NOTIFICATION_CHANGE, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(Constants.NOTIFICATION_CHANGE, callback);
  }
}

export default new NotificationsStore();
