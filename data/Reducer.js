
const SET_USER = 'SET_USER';
const SET_PICTURE = 'SET_PICTURE';

const _setUser = (state, user) => {
  return {
    ...state,
    currentUser: user
  }
}

const _setPicture = (state, pictureObj) => {
  return {
    ...state, 
    picture: pictureObj
  }
}

const initialState = {
  currentUser: {},
}

function rootReducer(state=initialState, action) {
  switch (action.type) {
    case SET_USER:
      return _setUser(state, action.payload.user);
    case SET_PICTURE:
      return _setPicture(state, action.payload.pictureObject);
    default:
      return state;
  }
}

export { rootReducer, SET_USER, SET_PICTURE };