import { EventEmitter } from "events"

import Dispatcher from "./dispatcher"
import Constants from "./constants"

let _userTimeline = {
    id: "",
    authorAvatar: null,
    firstName: "",
    lastName: "",
    description: "",
    address: "",
    city: "",
    state: "",
    country: "",
    date: "",
    published: {
        blog : [],
        blogNoImage: []
    }
};

class UserTimeline extends EventEmitter {
  constructor() {
    super()

    this.registerToActions = this.registerToActions.bind(this)
    this.setUserTimeline = this.setUserTimeline.bind(this)

    Dispatcher.register(this.registerToActions.bind(this))
  }

  registerToActions({ actionType, payload }) {
    switch (actionType) {
      case Constants.RECIEVE_TIMELINE:
        this.setUserTimeline(payload)
        break;

      default:
    }
  }

  setUserTimeline(timeline) {
    _userTimeline = timeline
    this.emit(Constants.TIMELINE_CHANGE)
  }

  getUserTimeline(){
    return _userTimeline
  }

  addChangeListener(callback) {
    this.on(Constants.TIMELINE_CHANGE, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(Constants.TIMELINE_CHANGE, callback);
  }
}

export default new UserTimeline();