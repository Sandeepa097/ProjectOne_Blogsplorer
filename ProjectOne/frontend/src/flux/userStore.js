import { EventEmitter } from "events"

import Dispatcher from "./dispatcher"
import Constants from "./constants"

let _userDetails = {
    id: "",
    authorAvatar: null,
    firstName: "",
    lastName: "",
    description: "",
    address: "",
    city: "",
    state: "",
    country: "",
    email: "",
    draft: [],
    published: []
};

class UserStore extends EventEmitter {
  constructor() {
    super()

    this.registerToActions = this.registerToActions.bind(this)
    this.setUserDetails = this.setUserDetails.bind(this)
    this.addNewDraft = this.addNewDraft.bind(this)
    this.deleteDraftPost = this.deleteDraftPost.bind(this)
    this.publishDraftPost = this.publishDraftPost.bind(this)

    Dispatcher.register(this.registerToActions.bind(this))
  }

  registerToActions({ actionType, payload }) {
    switch (actionType) {
      case Constants.RECIEVE_USER:
        this.setUserDetails(payload)
        break;

      case Constants.USER_LOGOUT:
        this.userLogout()
        break;

      case Constants.ADD_NEW_DRAFT:
        this.addNewDraft(payload)
        break;

      case Constants.DELETE_DRAFT:
        this.deleteDraftPost(payload.id)
        break;
      
      case Constants.PUBLISH_DRAFT:
        this.publishDraftPost(payload.id)
        break;

      default:
    }
  }

  setUserDetails(details) {
    _userDetails = details
    this.emit(Constants.USER_CHANGE)
  }

  getUserDetails() {
    return _userDetails
  }

  userLogout() {
    _userDetails = {
      id: "",
      authorAvatar: null,
      firstName: "",
      lastName: "",
      description: "",
      address: "",
      city: "",
      state: "",
      country: "",
      email: "",
      draft: [],
      published: []
    }
  }

  addNewDraft(post) {
    this.setUserDetails({
      ..._userDetails,
      draft: [post, ..._userDetails.draft]
    })
  }

  deleteDraftPost(id) {
    const restDraft = _userDetails.draft.filter(item => item._id !== id)
    this.setUserDetails({
      ..._userDetails,
      draft: restDraft
    })
  }

  publishDraftPost(id) {
    const restDraft = _userDetails.draft.filter(item => item._id !== id)
    this.setUserDetails({
      ..._userDetails,
      draft: restDraft,
      published: [..._userDetails.published, id]
    })
    console.log(_userDetails)
  }

  editDraft(id) {
    return _userDetails.draft.filter(item => item._id === id)[0]
  }

  addChangeListener(callback) {
    this.on(Constants.USER_CHANGE, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(Constants.USER_CHANGE, callback);
  }
}

export default new UserStore();