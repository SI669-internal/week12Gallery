
const actionTypes = {
  LOAD_USERS: 'LOAD_USERS',
  CREATE_USER: 'CREATE_USER',
  SAVE_PICTURE: 'SAVE_PICTURE',
  LOAD_GALLERY: 'LOAD_GALLERY'
}

const loadUsers = (users) => {
  return {
    type: actionTypes.LOAD_USERS,
    payload: {
      users: users
    }
  }
}

const createUser = (user) => {
  return {
    type: actionTypes.CREATE_USER,
    payload: {
      user: user
    }
  }
}

const savePicture = (pictureObject) => {
  return {
    type: actionTypes.SAVE_PICTURE,
    payload: {
      pictureObject: pictureObject
    }
  }
}

const loadGallery = (gallery) => {
  return {
    type: actionTypes.LOAD_GALLERY,
    payload: {
      gallery: gallery
    }
  }
}
export { 
  actionTypes, 
  loadUsers, 
  loadGallery,
  createUser, 
  savePicture,
};