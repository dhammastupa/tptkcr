import { LocalStorage, Loading } from 'quasar'
import { auth, db } from 'src/boot/firebase'
import { showMessage } from 'src/functions/function-show-message'
import _ from 'lodash'

const state = {
  loggedIn: false,
  uid: '',
  email: '',
  userEmailVerified: false,
  // รายละเอียดผู้ใช้งาน
  firstName: '',
  lastName: '',
  group: [],
  permission: []
}

const mutations = {
  setLoggedIn (state, payload) {
    state.loggedIn = payload.loggedIn
    state.uid = payload.uid
    state.email = payload.email
    state.userEmailVerified = payload.userEmailVerified
  },
  setUserInfo (state, payload) {
    state.firstName = payload.firstName
    state.lastName = payload.lastName
  },
  setUserRight (state, payload) {
    state.group = payload.group
    state.permission = payload.permission
  }
}

const actions = {
  registerUser ({ commit, dispatch }, payload) {
    Loading.show()
    auth.createUserWithEmailAndPassword(payload.email, payload.password)
      .then(response => {
        // ส่งอีเมลเพื่อการยืนยัน
        auth.currentUser.sendEmailVerification()
          .then(() => {
            // แสดงข้อความให้เปิดอีเมลเพื่อทำการยืนยัน
            showMessage('systemMessage.infoTitle', 'storeAuth.sendEmailVerification')
          })
          .catch(error => {
            showMessage('systemMessage.errorTitle', 'systemMessage.error')
            console.log('error: ', error)
          })
        // ทำการล็อกเอ๊าท์
        dispatch('logoutUser')
      })
      .catch(error => {
        switch (error.code) {
          case 'auth/email-already-in-use':
            showMessage('systemMessage.errorTitle', 'storeAuth.emailAlreadyInUse')
            break
          default:
            showMessage('systemMessage.errorTitle', 'systemMessage.error')
        }
        console.log('error: ', error)
      })
  },
  // ผู้ใช้งานเข้าระบบ
  loginUser ({ context }, payload) {
    Loading.show()
    auth.signInWithEmailAndPassword(payload.email, payload.password)
      .then(response => {
        // console.log('response: ', response)
      })
      .catch(error => {
        switch (error.code) {
          case 'auth/wrong-password':
            showMessage('systemMessage.errorTitle', 'storeAuth.wrongPassword')
            break
          case 'auth/user-not-found':
            showMessage('systemMessage.errorTitle', 'storeAuth.userNotFound')
            break
          default:
            showMessage('systemMessage.errorTitle', 'systemMessage.error')
        }
        console.log('error: ', error)
      })
  },
  // ล็อกเอาท์ผู้ใช้งาน
  logoutUser () {
    auth.signOut()
    this.$router.push('/auth').catch(() => {})
  },
  // เปลี่ยนรหัสผ่าน
  resetPassword ({ context }, payload) {
    auth.sendPasswordResetEmail(payload.email)
      .then(() => {
        // แสดงข้อความให้เปิดอีเมลเพื่อทำการยืนยัน
        showMessage('systemMessage.infoTitle', 'storeAuth.sendPasswordResetEmail')
      })
      .catch(error => {
        showMessage('systemMessage.errorTitle', 'systemMessage.error')
        console.log('error: ', error)
      })
  },
  handleAuthStateChange ({ commit, dispatch }) {
    auth.onAuthStateChanged(user => {
      Loading.hide()
      // default
      // ผู้ใช้ระบบ
      let authPayload = {
        loggedIn: false,
        uid: '',
        email: '',
        userEmailVerified: false
      }
      // รายละเอียดผู้ใช้งาน
      const userInfoPayload = {
        firstName: '',
        lastName: ''
      }
      // รายละเอียดสิทธิ์
      const userRightPayload = {
        group: [],
        permission: []
      }
      // กระบวนการตรวจสอบ
      if (user) {
        authPayload = {
          loggedIn: true,
          uid: user.uid,
          email: user.email,
          userEmailVerified: user.emailVerified
        }
        commit('setLoggedIn', authPayload)
        for (const property in authPayload) {
          LocalStorage.set(property, authPayload[property])
        }
        db.collection('user').doc(user.uid).get()
          .then(snapshot => {
            const documents = snapshot.data()
            userInfoPayload.firstName = documents.firstName
            userInfoPayload.lastName = documents.lastName
            commit('setUserInfo', userInfoPayload)
          })
        db.collection('group').where('user', 'array-contains-any', [user.uid])
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach((doc) => {
              const element = doc.data()
              userRightPayload.group.push(element.role)
              element.permission.forEach(i => {
                userRightPayload.permission.push(i)
              })
            })
            userRightPayload.permission = _.uniq(userRightPayload.permission)
            commit('setUserRight', userRightPayload)
          })
        // this.$router.push('/').catch(() => {})
      } else {
        commit('setLoggedIn', authPayload)
        commit('setUserInfo', userInfoPayload)
        commit('setUserRight', userRightPayload)
        LocalStorage.set('loggedIn', false)
        for (const property in authPayload) {
          LocalStorage.set(property, authPayload[property])
        }
        this.$router.replace('/auth').catch(() => {})
      }
    })
  },
  resendEmail ({ dispatch }) {
    auth.currentUser.sendEmailVerification()
    dispatch('logoutUser')
  }
}

const getters = {
  userName: state => {
    return state.firstName + ' ' + state.lastName
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
