import * as firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

const config = {
    apiKey: "AIzaSyCrPx5pvMvrZrt_ZIDE-dbBtyWbVv9rt2I",
    authDomain: "firulove-aacf1.firebaseapp.com",
    projectId: "firulove-aacf1",
    storageBucket: "firulove-aacf1.appspot.com",
    messagingSenderId: "320168671367",
    appId: "1:320168671367:web:0cf50fba4328c6b11b6022",
    measurementId: "G-LKK4RCN64P"
}

const fireb = firebase.default.initializeApp(config);
const auth = fireb.auth()
const store = fireb.firestore()
const storage = fireb.storage()

export {auth, store, storage}