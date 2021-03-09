import { LocalStorage, Loading } from 'quasar'
import { firebaseAuth } from 'src/boot/firebase'
import { showMessage } from 'src/functions/function-show-message'

const state = {
  loggedIn: false,
  email: '',
  userEmailVerified: false,
  authGroup: [],
  authPermission: []
}

const mutations = {
  setLoggedIn (state, payload) {
    state.loggedIn = payload.loggedIn
    state.email = payload.email
    state.userEmailVerified = payload.userEmailVerified
  },
  setUserInfo (state, payload) {
    state.userInfo = payload
    console.log(payload)
  }
}

const actions = {
  registerUser ({ commit, dispatch }, payload) {
    Loading.show()
    firebaseAuth.createUserWithEmailAndPassword(payload.email, payload.password)
      .then(response => {
        // ส่งอีเมลเพื่อการยืนยัน
        firebaseAuth.currentUser.sendEmailVerification()
          .then(() => {
            // แสดงข้อความให้เปิดอีเมลเพื่อทำการยืนยัน
            showMessage('info', 'storeAuth.sendEmailVerification')
          })
          .catch(error => {
            showMessage('error', 'systemMessage.error')
            console.log('error: ', error)
          })
        // ทำการล็อกเอ๊าท์
        dispatch('logoutUser')
      })
      .catch(error => {
        switch (error.code) {
          case 'auth/email-already-in-use':
            showMessage('error', 'storeAuth.emailAlreadyInUse')
            break
          default:
            showMessage('error', 'systemMessage.error')
        }
        console.log('error: ', error)
      })
  },
  // ผู้ใช้งานเข้าระบบ
  loginUser ({ context }, payload) {
    Loading.show()
    firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password)
      .then(response => {
        console.log('response: ', response)
      })
      .catch(error => {
        switch (error.code) {
          case 'auth/wrong-password':
            showMessage('error', 'storeAuth.wrongPassword')
            break
          case 'auth/user-not-found':
            showMessage('error', 'storeAuth.userNotFound')
            break
          default:
            showMessage('error', 'systemMessage.error')
        }
        console.log('error: ', error)
      })
  },
  logoutUser () {
    firebaseAuth.signOut()
    this.$router.push('/auth').catch(() => {})
  },
  handleAuthStateChange ({ commit, dispatch }) {
    firebaseAuth.onAuthStateChanged(user => {
      Loading.hide()
      if (user) {
        const payload = {
          loggedIn: true,
          email: user.email,
          userEmailVerified: user.emailVerified
        }
        commit('setLoggedIn', payload)
        for (const property in payload) {
          LocalStorage.set(property, payload[property])
        }
        // this.$router.push('/').catch(() => {})
      } else {
        const payload = {
          loggedIn: false,
          email: '',
          userEmailVerified: false
        }
        commit('setLoggedIn', payload)
        LocalStorage.set('loggedIn', false)
        for (const property in payload) {
          LocalStorage.set(property, payload[property])
        }
        this.$router.replace('/auth').catch(() => {})
      }
    })
  },
  resendEmail ({ dispatch }) {
    firebaseAuth.currentUser.sendEmailVerification()
    dispatch('logoutUser')
  }
}

const getters = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
