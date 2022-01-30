import { EventEmitter } from "events"

import Dispatcher from "./dispatcher"
import Constants from "./constants"

let _activeAuthors = []

class ActiveAuthoreStore extends EventEmitter {
    constructor() {
      super()
  
      this.registerToActions = this.registerToActions.bind(this)
      this.setActive = this.setActive.bind(this)
      this.removeActive = this.removeActive.bind(this)
  
      Dispatcher.register(this.registerToActions.bind(this))
    }
  
    registerToActions({ actionType, payload }) {
      switch (actionType) {
        case Constants.RECIEVE_ACTIVE:
          this.setActive(payload)
          break;

        case Constants.REMOVE_ACTIVE:
            this.removeActive(payload)
            break;
        default:
      }
    }
  
    setActive(authors) {
        _activeAuthors = authors
        this.emit(Constants.ACTIVE_CHANGE)
    }

    removeActive(author) {
        _activeAuthors = _activeAuthors.filter(item => item !== author)
        this.emit(Constants.ACTIVE_CHANGE)
    }
  
    getActive() {
        return _activeAuthors
    }
  
    addChangeListener(callback) {
        this.on(Constants.ACTIVE_CHANGE, callback);
    }
  
    removeChangeListener(callback) {
        this.removeListener(Constants.ACTIVE_CHANGE, callback);
    }
  }
  
  export default new ActiveAuthoreStore();