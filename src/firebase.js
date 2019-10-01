import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

let config = {
  apiKey: "AIzaSyDf2t5d-_Fho0xyxfHF0i0wn-oI3yzdqKc",
  authDomain: "healthy-booth-230814.firebaseapp.com",
  databaseURL: "https://healthy-booth-230814.firebaseio.com",
  projectId: "healthy-booth-230814",
  storageBucket: "healthy-booth-230814.appspot.com",
  messagingSenderId: "965635793119",
  appId: "1:965635793119:web:bae679f1688e6d2b"
};

firebase.initializeApp(config);

export default firebase;
