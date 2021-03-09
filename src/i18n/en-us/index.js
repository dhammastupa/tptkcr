// This is just an example,
// so you can safely delete all default props below

export default {
  // ---------
  // general
  // ---------
  failed: 'Action failed',
  success: 'Action was successful',
  info: 'Infomation',
  error: 'Error',

  // ---------
  // system
  // ---------
  systemLabel: {
    projectName: 'Tipiṭaka Common Reference Platform',
    switchLang: 'เปลี่ยนภาษา'
  },
  systemMessage: {
    error: 'An error occurred. Please contact your system administrator'
  },

  // ---------
  // store
  // ---------
  // storeAuth
  storeAuth: {
    emailAlreadyInUse: 'The email address is already in use by another account.',
    sendEmailVerification: 'A verification link has been sent to your email account. Open it up to activate your account.',
    wrongPassword: 'The password is invalid or the user does not have a password.',
    userNotFound: 'There is no user record corresponding to this identifier. The user may have been deleted.'
  },

  // ---------
  // layouts
  // ---------
  mainLayout: {
    login: 'Login',
    logout: 'Logout',
    navigation: 'Navigation'
  },

  // ---------
  // pages
  // ---------
  // pageAuth
  pageAuth: {
    login: 'Login',
    register: 'Register'
  },

  // components
  // loginRegister
  loginRegister: {
    Email: 'Email',
    Password: 'Password',
    login: 'Login',
    register: 'Register'
  },
  // mainNav
  mainNav: {
    home: 'Home',
    project: 'Project'
  }
}
