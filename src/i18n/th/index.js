// This is just an example,
// so you can safely delete all default props below

export default {
  // ---------
  // general
  // ---------
  failed: 'Action failed',
  success: 'Action was successful',
  info: 'แจ้งเพื่อทราบ',
  error: 'เกิดข้อผิดพลาด',

  // ---------
  // system
  // ---------
  systemLabel: {
    projectName: 'ระบบ​เครือข่ายการอ้างอิง​ร่วมพระไตรปิฎก',
    switchLang: 'Language Switcher'
  },
  systemMessage: {
    error: 'เกิดข้อผิดพลาด โปรดติดต่อผู้ดูแลระบบของคุณ'
  },

  // ---------
  // store
  // ---------
  // storeAuth
  storeAuth: {
    emailAlreadyInUse: 'อีเมลนี้ถูกใช้โดยบัญชีผู้ใช้ท่านอื่นแล้ว',
    sendEmailVerification: 'ระบบได้ทำการส่งลิงก์ยืนยันไปยังอีเมลของคุณแล้ว กรุณาตรวจสอบและทำการกดลิงก์เพื่อเปิดใช้งานบัญชีผู้ใช้ของคุณ',
    wrongPassword: 'รหัสผ่านไม่ถูกต้อง',
    userNotFound: 'ไม่พบบัญชีผู้ใช้ตามที่ระบุ'
  },

  // ---------
  // layouts
  // ---------
  mainLayout: {
    login: 'เข้าระบบ',
    logout: 'ออกระบบ',
    navigation: 'เมนู'
  },

  // ---------
  // pages
  // ---------
  // pageAuth
  pageAuth: {
    login: 'เข้าระบบ',
    register: 'ลงทะเบียน'
  },

  // ---------
  // components
  // ---------
  // loginRegister
  loginRegister: {
    email: 'อีเมล',
    password: 'รหัสผ่าน',
    login: 'เข้าระบบ',
    logout: 'ออกระบบ',
    register: 'ลงทะเบียน',
    resendEmail: 'ส่งอีเมลยืนย้น',
    verifyAccount: '<p class="text-h6"> โปรดยืนยันอีเมลของคุณเพื่อทำการเปิดบัญชีผู้ใช้งานให้เสร็จสมบูรณ์.</p> <p class="q-py-sm text-body1">หลังจากทำการลงทะเบียน คุณจะได้รับอีเมลจากโครงการฯ ซึ่งจัดส่งไปถึงอีเมลที่คุณระบุไว้ ให้คุณกดเปิดลิงค์ที่ส่งไปพร้อมกับข้อความในอีเมลนั้นเพื่อทำการยืนยัน</p>'
  },
  // mainNav
  mainNav: {
    home: 'หน้าแรก',
    project: 'โครงการ'
  }
}
