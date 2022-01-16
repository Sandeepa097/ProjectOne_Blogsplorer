import { EventEmitter } from "events"

import Dispatcher from "./dispatcher"
import Constants from "./constants"

let _chatWith = {
    id: "",
    authorAvatar: null,
    firstName: "",
    lastName: "",
    online: false
}

class ChatStore extends EventEmitter {
    constructor() {
      super()
  
      this.registerToActions = this.registerToActions.bind(this)
      this.setChatWith = this.setChatWith.bind(this)
  
      Dispatcher.register(this.registerToActions.bind(this))
    }
  
    registerToActions({ actionType, payload }) {
      switch (actionType) {
        case Constants.RECIEVE_CHAT_WITH:
          this.setChatWith(payload)
          break;
        default:
      }
    }
  
    setChatWith(details) {
      _chatWith = details
      this.emit(Constants.CHAT_WITH_CHANGE)
    }
  
    getChatWith() {
      return _chatWith
    }
  
    addChangeListener(callback) {
      this.on(Constants.CHAT_WITH_CHANGE, callback);
    }
  
    removeChangeListener(callback) {
      this.removeListener(Constants.CHAT_WITH_CHANGE, callback);
    }
  }
  
  export default new ChatStore();