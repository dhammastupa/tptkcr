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

  // ---------
  // components
  // ---------
  // loginRegister
  loginRegister: {
    email: 'Email',
    password: 'Password',
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    resendEmail: 'Resend Email',
    verifyAccount: '<p class="text-h6">Please verify your email address to complete account activation.</p> <p class="q-py-sm text-body1">You should receive an email message from TCRP. Click the unique link provided in that email to finish verifying your email address. The web page which then launches will confirm your success.</p>'
  },
  // mainNav
  mainNav: {
    home: 'Home',
    project: 'Project'
  }
}
