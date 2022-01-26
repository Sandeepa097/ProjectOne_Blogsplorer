import { EventEmitter } from "events"

import Dispatcher from "./dispatcher"
import Constants from "./constants"

let _posts = {
  postsListOne: [],
  postsListTwo: [],
  postsListThree: [],
  postsListFour: []
};

class PostStore extends EventEmitter {
  constructor() {
    super()

    this.registerToActions = this.registerToActions.bind(this)
    this.setPosts = this.setPosts.bind(this)

    Dispatcher.register(this.registerToActions.bind(this))
  }

  registerToActions({ actionType, payload }) {
    switch (actionType) {
      case Constants.RECIEVE_POSTS:
        this.setPosts(payload)
        break;
      default:
    }
  }

  setPosts(posts) {
    _posts = posts
    this.emit(Constants.POSTS_CHANGE)
  }

  getPosts() {
    return _posts
  }

  addChangeListener(callback) {
    this.on(Constants.POSTS_CHANGE, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(Constants.POSTS_CHANGE, callback);
  }
}

export default new PostStore();
