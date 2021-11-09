import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
const firebaseConfig = {
    apiKey: "AIzaSyBfez8ELB9LQ2DcUx9wIsoGEirBcQYKw4s",
    authDomain: "brgr-ce55d.firebaseapp.com",
    projectId: "brgr-ce55d",
    storageBucket: "brgr-ce55d.appspot.com",
    messagingSenderId: "192325240024",
    appId: "1:192325240024:web:eb8960af96ff5a771183ad",
    measurementId: "G-XPFN1HPNHW"
};

// init firebase
firebase.initializeApp(firebaseConfig);

// init firestore service
const projectAuth = firebase.auth()
const projectFirestore = firebase.firestore();
export {
    projectFirestore,
    projectAuth
}