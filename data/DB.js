import { getAuth, signOut } from 'firebase/auth';
import { getApps, initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  onSnapshot, 
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  query,
  orderBy,  
} from 'firebase/firestore';
import { firebaseConfig } from '../Secrets';
import { actionTypes, loadUsers, loadActiveChat } from './Actions';

let firebaseApp = null;
const userCollection = 'users';
const chatCollection = 'chats';
let activeChatUnsubscribe = undefined;
let usersUnsubscribe = undefined;

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

const signOutFB = () => {
  if (activeChatUnsubscribe) {
    activeChatUnsubscribe();
  }
  if (usersUnsubscribe) {
    usersUnsubscribe();
  }
  signOut(getAuth());
}

// SUBSCRIPTIONS
const subscribeToUsers = (dispatch) => {
  if (usersUnsubscribe) {
    usersUnsubscribe();
  }
  usersUnsubscribe = onSnapshot(collection(getDB(), userCollection), qSnap => {
    let newUsers = [];
    qSnap.forEach(docSnap => {
      let newUser = docSnap.data();
      newUser.uid = docSnap.id;
      newUsers.push(newUser);
    });
    dispatch(loadUsers(newUsers));
  });
}

const constructChatId = (id1, id2) => {
  return [id1, id2].sort().join('_');
}


const subscribeToChat = async (user1Id, user2Id, dispatch) => {

  const chatId = constructChatId(user1Id, user2Id);
  const chatDoc = doc(collection(getDB(), chatCollection), chatId);
  let chatDocSnap = await getDoc(chatDoc);

  if (!chatDocSnap.exists()) {
    console.log("Chat doesn't exist. Creating it with ID", chatId);
    await setDoc(chatDoc, { participants: [user1Id, user2Id] });
  }

  if (activeChatUnsubscribe) {
    console.log('unsubscribing in subscribeToChat');
    activeChatUnsubscribe();
  }
  const activeChatMessageCollection = collection(chatDoc, 'messages');
  const q = query(activeChatMessageCollection,
    orderBy('timestamp', 'asc'));

  console.log('Subscribing in subscribeToChat');

  activeChatUnsubscribe = onSnapshot(q, qSnap => {
    console.log('snapshot received');
    let newMessages = [];
    qSnap.forEach(docSnap => {
      let newMessage = docSnap.data();
      newMessage.key = docSnap.id;
      newMessage.timestamp = newMessage.timestamp.toDate().getTime();
      newMessages.push(newMessage);
    });
    dispatch(loadActiveChat(user1Id, user2Id, newMessages));
  });
}

// STATE MODIFYING ACTIONS
const createUser = (action, dispatch) => {
  const { user } = action.payload;
  setDoc(doc(collection(getDB(), userCollection), user.uid), {
    displayName: user.displayName
  });
  // no need to dispatch to reducer, onSnapshot will handle
}

const addChatMessageWithoutDispatch = async (action, dispatch) => {
  const { author, recipient, message } = action.payload;
  
  const newMessage = {
    author: author,
    recipient: recipient, 
    message: message,
    timestamp: new Date()
  }

  let chatId = constructChatId(author, recipient);
  let activeChatMessageCollection = collection(
    getDB(), chatCollection, chatId, 'messages');

  console.log('adding message', newMessage, 'to chat', chatId);
  await addDoc(activeChatMessageCollection, newMessage);
  // no need to dispatch to reducer, onSnapshot will handle
}

const saveAndDispatch = (action, dispatch) => {
  console.log('processing action:', action);
  switch (action.type) {
    case actionTypes.LOAD_USERS:
      return loadUsersAndDispatch(action, dispatch);
    case actionTypes.CREATE_USER:
      return createUser(action, dispatch); // change to WithoutDispatch?
    case actionTypes.ADD_CHAT_MESSAGE:
      return addChatMessageWithoutDispatch(action, dispatch);
  }
}

export { 
  saveAndDispatch, 
  subscribeToUsers, 
  subscribeToChat,
  getFBAuth,
  signOutFB 
};