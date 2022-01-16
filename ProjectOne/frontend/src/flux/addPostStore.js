import { EventEmitter } from "events"

import Dispatcher from "./dispatcher"
import Constants from "./constants"

let _post = {
    _id: '',
    backgroundImage: null,
    category: {design: false, development: false, writting: false, books: false},
    categoryTheme: '',
    author: '',
    authorAvatar: '',
    title: '',
    body: '',
    date: ''
  }

class AddPostStore extends EventEmitter {
  constructor() {
    super()

    this.registerToActions = this.registerToActions.bind(this)
    this.setPost = this.setPost.bind(this)
    this.resetPost = this.resetPost.bind(this)

    Dispatcher.register(this.registerToActions.bind(this))
  }

  registerToActions({ actionType, payload }) {
    switch (actionType) {
      case Constants.EDIT_POST:
        this.setPost(payload)
        break;

      case Constants.RESET_POST:
        this.resetPost()
        break;
        
      default:
    }
  }

  setPost(post) {
    _post = post
    this.emit(Constants.ADD_POST_CHANGE)
  }

  getPost() {
    return _post
  }

  resetPost() {
    _post = {
      _id: '',
      backgroundImage: null,
      category: {design: false, development: false, writting: false, books: false},
      categoryTheme: '',
      author: '',
      authorAvatar: '',
      title: '',
      body: '',
      date: ''
    }
    this.emit(Constants.ADD_POST_CHANGE)
  }

  addChangeListener(callback) {
    this.on(Constants.ADD_POST_CHANGE, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(Constants.ADD_POST_CHANGE, callback);
  }
}

export default new AddPostStore();
