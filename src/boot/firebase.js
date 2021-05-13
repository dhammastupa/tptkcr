import { firebase } from '@firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import { firestorePlugin } from 'vuefire'

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
const auth = firebaseApp.auth()
const db = firebaseApp.firestore()
const storage = firebaseApp.storage()
const { Timestamp, GeoPoint, FieldValue } = firebase.firestore

export default async ({ app, router, Vue, store }) => {
  // instantiate vuefire for firestore
  Vue.use(firestorePlugin)

  // enable the use of this.$firestore syntax
  Vue.prototype.$firestore = firebase.firestore()
  Vue.prototype.$Timestamp = Timestamp
  Vue.prototype.$GeoPoint = GeoPoint
  Vue.prototype.$FieldValue = FieldValue
}

export { auth, db, storage, Timestamp, GeoPoint, FieldValue }
