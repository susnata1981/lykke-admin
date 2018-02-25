import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyCerTXhFJVrxLwU6BXjkuG2v4iK88EXE4U",
  authDomain: "lykke-1e98b.firebaseapp.com",
  databaseURL: "https://lykke-1e98b.firebaseio.com",
  projectId: "lykke-1e98b",
  storageBucket: "lykke-1e98b.appspot.com",
  messagingSenderId: "91650177123"
};
firebase.initializeApp(config);

export default firebase;
