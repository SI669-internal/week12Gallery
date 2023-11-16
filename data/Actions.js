
import { initializeApp, getApps } from 'firebase/app';
import { 
  setDoc, 
  getDoc, 
  doc, 
  getFirestore, 
  updateDoc, 
  onSnapshot 
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';

import { firebaseConfig } from '../Secrets';
import { SET_USER, SET_PICTURE } from './Reducer';

let app;
const apps = getApps();
if (apps.length == 0) { 
  app = initializeApp(firebaseConfig);
} else {
  app = apps[0];
}
const db = getFirestore(app);
const storage = getStorage(app);

const addUser = (authUser) => {
  return async (dispatch) => {
    userToAdd = {
      displayName: authUser.displayName,
      email: authUser.email,
      key: authUser.uid
    };
    await setDoc(doc(db, 'users', authUser.uid), userToAdd);
  }
}

const setUser = (authUser) => {
  return async (dispatch) => {
    const userSnap = await getDoc(doc(db, 'users', authUser.uid));
    const user = userSnap.data();
    console.log('dispatching with user', authUser, user);
    dispatch({
      type: SET_USER,
      payload: {
        user: user
      }
    });
  }
}

const subscribeToUserOnSnapshot = (userId) => {
  console.log('subscribe to user', userId);
  return dispatch => {
    onSnapshot(doc(db, 'users', userId), (userSnapshot) => {
      const updatedUser = {
        ...userSnapshot.data(),
        key: userSnapshot.id
      };
      dispatch({
        type: SET_USER,
        payload: {
          user: updatedUser
        }
      });
    });
  }
}

// note: just a normal Action this time, not a Thunk
const setPicture = (pictureObject) => {
  return {
    type: SET_PICTURE,
    payload: {
      pictureObject: pictureObject
    }
  }
}


const savePicture = (pictureObject) => {

  return async (dispatch, getState) => {

    // grab the filename part of the uri
    const fileName = pictureObject.uri.split('/').pop(); 

    // this will be where we store the file in the cloud
    const currentPhotoRef = ref(storage, `images/${fileName}`);

    // fetch the image object (blob) from the local filesystem
    const response = await fetch(pictureObject.uri);

    // blob: binary large object
    const imageBlob = await response.blob();
    
    // then upload it to Firebase Storage
    await uploadBytes(currentPhotoRef, imageBlob);

    // get the URL
    const downloadURL = await getDownloadURL(currentPhotoRef);

    // create or add to the user's gallery
    const currentUser = getState().currentUser;
    const newPicture = {
      ...pictureObject,
      uri: downloadURL
    }
    const newGallery = currentUser.gallery ?
      currentUser.gallery.concat(newPicture) :
      [newPicture];
    
    // update the user doc with the new gallery
    await updateDoc(doc(db, 'users', currentUser.key), {gallery: newGallery});

    // dispatch({
    //   type: SET_PICTURE,
    //   payload: {
    //     pictureObject: {
    //       uri: downloadURL // all we need for now
    //     }
    //   }
    // });

  }
}

export { 
  addUser, 
  setUser, 
  setPicture, 
  savePicture, 
  subscribeToUserOnSnapshot
};