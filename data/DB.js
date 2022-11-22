
import { getAuth, signOut } from 'firebase/auth';
import { getApps, initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  onSnapshot, 
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc, 
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes, 
  getDownloadURL
} from 'firebase/storage';
import { firebaseConfig } from '../Secrets';
import { actionTypes, loadUsers, loadGallery } from './Actions';

let firebaseApp = null;
const userCollection = 'users';
let userSnapshotUnsubscribe = null;
let gallerySnapshotUnsubscribe = null;

const getFBApp = () => {
  if (!firebaseApp) {
    if (getApps() == 0) {
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      firebaseApp = getApps()[0];
    }
  }
  return firebaseApp;
}

const getFBAuth = () => {
  return getAuth(getFBApp());
}

const getDB = () => {
  return getFirestore(getFBApp());
}

const getFBStorage = () => {
  return getStorage(getFBApp());
}

const signOutFB = () => {
  if (userSnapshotUnsubscribe) {
    userSnapshotUnsubscribe();
  }
  if (gallerySnapshotUnsubscribe) {
    gallerySnapshotUnsubscribe();
  }
  signOut(getAuth());
}

const processUserQuerySnapshot = (uqSnap) => {
  let newUsers = [];
  uqSnap.forEach(docSnap => {
    let newUser = docSnap.data();
    newUser.uid = docSnap.id;
    newUsers.push(newUser);
  });
  return newUsers;
}

const subscribeToUsers = (dispatch) => {
  if (userSnapshotUnsubscribe) {
    userSnapshotUnsubscribe();
  }
  userSnapshotUnsubscribe = onSnapshot(collection(getDB(), userCollection), qSnap => {
    let newUsers = processUserQuerySnapshot(qSnap);
    console.log('\n\nusers coll updated:\n\n', newUsers);
    dispatch(loadUsers(newUsers));
  });
}

const subscribeToUserGallery = (dispatch) => {
  if (gallerySnapshotUnsubscribe) {
    gallerySnapshotUnsubscribe();
  }
  const currUserDoc = doc(getDB(), userCollection, getFBAuth().currentUser.uid);
  gallerySnapshotUnsubscribe = onSnapshot(currUserDoc, docSnap => {
    const gallery = docSnap.data().gallery;
    console.log('got gallery', gallery);
    dispatch(loadGallery(gallery));
  })
}

const createUser = (action, dispatch) => {
  const { user } = action.payload;
  setDoc(doc(collection(getDB(), userCollection), user.uid), {
    displayName: user.displayName
  });
  // no need to dispatch to reducer
}

const savePictureAndDispatch = async (action, dispatch) => {
  const { pictureObject } = action.payload;

  const storageRef = ref(getFBStorage());
  const fileNameParts = pictureObject.uri.split('/');
  const fileName = fileNameParts[fileNameParts.length - 1];
  const currentPhotoRef = ref(storageRef, fileName);

  try {
    // fetch the image object from the local filesystem
    const response = await fetch(pictureObject.uri);
    const imageBlob = await response.blob(); // << seems to crash!!
    
    // then upload it to Firebase Storage
    await uploadBytes(currentPhotoRef, imageBlob);
    const downloadURL = await getDownloadURL(currentPhotoRef);

    // create a record in Firestore
    const currUserId = getFBAuth().currentUser.uid;
    const currUserDoc = doc(getDB(), userCollection, currUserId);
    const currUserSnap = await getDoc(currUserDoc);
    const currUser = currUserSnap.data();
    const newPictureObj = {...pictureObject, uri: downloadURL};
    if (currUser.gallery) {
      currUser.gallery.push(newPictureObj);
    } else {
      currUser.gallery = [newPictureObj]
    }
    await updateDoc(currUserDoc, {gallery: currUser.gallery})

    // action.payload.pictureObject.uri = downloadURL;
    // dispatch(action);
  } catch(e) {
    console.log(e);
  } 
}

const saveAndDispatch = (action, dispatch) => {
  console.log('saveAndDispatch', action);
  switch (action.type) {
    case actionTypes.CREATE_USER:
      return createUser(action, dispatch);
    case actionTypes.SAVE_PICTURE:
      return savePictureAndDispatch(action, dispatch);
  }
}

export { 
  saveAndDispatch, 
  subscribeToUsers, 
  subscribeToUserGallery,
  getFBAuth,
  signOutFB, 
};