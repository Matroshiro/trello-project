import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAA-zkxwTNMoe2w7q1Ke_0YAKqPthoGVbs",
    authDomain: "trello-project-e4a2d.firebaseapp.com",
    databaseURL: "https://trello-project-e4a2d.firebaseio.com",
    projectId: "trello-project-e4a2d",
    storageBucket: "trello-project-e4a2d.appspot.com",
    messagingSenderId: "90007454666",
    appId: "1:90007454666:web:ac7dc735764c62a7bcc533",
    measurementId: "G-KXHJ01QF6G"
  };

  firebase.initializeApp(firebaseConfig);

  export default firebase;