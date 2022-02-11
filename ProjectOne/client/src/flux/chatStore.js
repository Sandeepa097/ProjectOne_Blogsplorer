import { EventEmitter } from "events"

import Dispatcher from "./dispatcher"
import Constants from "./constants"

let _allMessages = {
    old: [], 
    new: []
}

let _chatWith = {
    id: "",
    authorAvatar: null,
    fullName: "",
    online: false,
    messages: []
}

class ChatStore extends EventEmitter {
    constructor() {
      super()
  
      this.registerToActions = this.registerToActions.bind(this)
      this.setChatWith = this.setChatWith.bind(this)
      this.setMessages = this.setMessages.bind(this)
      this.setSocketMessage = this.setSocketMessage.bind(this)
  
      Dispatcher.register(this.registerToActions.bind(this))
    }
  
    registerToActions({ actionType, payload }) {
      switch (actionType) {
        case Constants.RECIEVE_CHAT_WITH:
          this.setChatWith(payload)
          break;
        case Constants.RECIEVE_MESSAGES:
          this.setMessages(payload)
          break;
        case Constants.RECIEVE_SOCKET_MESSAGE:
          this.setSocketMessage(payload)
          break;
        default:
      }
    }
  
    setChatWith(details) {
      const msges = [
        ..._allMessages.old.filter(msg => msg.from === details.id),
        ..._allMessages.new.filter(msg => msg.from === details.id)
      ]
      _allMessages = {..._allMessages,
        old: [..._allMessages.old, ..._allMessages.new.filter(msg => msg.from === details.id)],
        new: [..._allMessages.new.filter(msg => msg.from !== details.id)]
      }
      _chatWith = {...details, messages: msges}
      this.emit(Constants.CHAT_WITH_CHANGE)
    }

    setMessages(msg) {
      _allMessages = msg
      this.emit(Constants.CHAT_WITH_CHANGE)
    }

    setSocketMessage(msg) {
      console.log('socketmsg', msg)
      console.log('currentChat', _chatWith.id)
      if(msg.from === _chatWith.id){
        _allMessages = {..._allMessages, old: [..._allMessages.old, msg]}
        _chatWith = {..._chatWith, messages: [..._chatWith.messages, msg]}
      }
      else {
        _allMessages = {..._allMessages, new: [..._allMessages.new, msg]}
      }
      this.emit(Constants.CHAT_WITH_CHANGE)
    }
  
    getChatWith() {
      return _chatWith
    }

    getMessages() {
      return _allMessages
    }
  
    addChangeListener(callback) {
      this.on(Constants.CHAT_WITH_CHANGE, callback);
    }
  
    removeChangeListener(callback) {
      this.removeListener(Constants.CHAT_WITH_CHANGE, callback);
    }
  }
  
  export default new ChatStore();