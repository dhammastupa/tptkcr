import firebase from 'firebase/app'

import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBtf8GctGCOO94od6WI8m0kMiQK9VRzeqU',
  authDomain: 'tptkcr.firebaseapp.com',
  projectId: 'tptkcr',
  storageBucket: 'tptkcr.appspot.com',
  messagingSenderId: '246421686744',
  appId: '1:246421686744:web:8b05b78f7207cb795dcaad',
  measurementId: 'G-PKT6DLK2XQ'
}

const firebaseApp = firebase.initializeApp(firebaseConfig)
const firebaseAuth = firebaseApp.auth()
const firebaseDb = firebaseApp.firestore()

export { firebaseAuth, firebaseDb }
