import firebase from 'firebase';

export default firebase.apps.length === 0 ? firebase.initializeApp({
    apiKey: "AIzaSyBMuCmmUxG5Dw8Xt6RJLROuq1BMDhX0eis",
    authDomain: "social-outreach-5c78e.firebaseapp.com",
    databaseURL: "https://social-outreach-5c78e.firebaseio.com",
    storageBucket: "social-outreach-5c78e.appspot.com",
}) : firebase.app();
