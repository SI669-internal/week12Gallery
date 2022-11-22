
import { actionTypes } from "./Actions"

const _loadUsers = (state, action) => {
  const {users} = action.payload;

  return {
    ...state,
    users: users
  }
}

// OBSOLETE?
const _savePicture = (state, action) => {
  const { pictureObject } = action.payload;
  return {
    ...state, 
    picture: pictureObject
  }
  
}

const _loadGallery = (state, action) => {
  const { gallery } = action.payload;
  return {
    ...state, 
    gallery: gallery
  }
}

const initialState = {
  users: [],
  //picture: {},
  gallery: []
}

function rootReducer(state=initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_USERS:
      return _loadUsers(state, action);
    case actionTypes.SAVE_PICTURE:
      return _savePicture(state, action);
    case actionTypes.LOAD_GALLERY:
      return _loadGallery(state, action);
    default:
      return state;
  }
}

export { rootReducer };