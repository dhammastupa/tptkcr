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
    sendEmailVerification: 'ระบบได้ทำการส่งลิงก์สำหรับยืนยันไปยังอีเมลของคุณแล้ว กรุณาตรวจสอบและทำการกดลิงก์เพื่อเปิดใช้งานบัญชีผู้ใช้ของคุณ',
    wrongPassword: 'รหัสผ่านไม่ถูกต้อง',
    userNotFound: 'ไม่พบบัญชีผู้ใช้ตามที่ระบุ',
    sendPasswordResetEmail: 'ระบบได้ทำการส่งลิงก์สำหรับเปลี่ยนรหัสผ่าน ไปยังอีเมลของคุณแล้ว กรุณาตรวจสอบและทำการกดลิงก์เพื่อการกำหนดรหัสผ่านใหม่ที่ต้องการ'
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
    register: 'ลงทะเบียน',
    resetPassword: 'เปลี่ยนรหัสผ่าน'
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
    resetPassword: 'ส่งอีเมลเปลี่ยนรหัสผ่าน',
    resendEmail: 'ส่งอีเมลอีกครั้ง และออกจากระบบ',
    verifyAccount: '<p class="text-h6"> โปรดยืนยันอีเมลของคุณเพื่อทำการเปิดบัญชีผู้ใช้งานให้เสร็จสมบูรณ์.</p> <p class="q-py-sm text-body1">หลังจากทำการลงทะเบียน คุณจะได้รับอีเมลจากโครงการฯ ซึ่งจัดส่งไปถึงที่อยู่อีเมลที่คุณระบุไว้ กรุณาเปิดอีเมลฉบับนั้นและกดลิงค์ที่ได้ระบุไว้ เพื่อทำการยืนยัน</p>',
    wordOfBuddha: '<p class="text-h6">โย โว ธมฺโม จ วินโย จ เทสิโต ปญฺญตฺโต <br> โส โว มมจฺจเยน สตฺถา </p> <p class="q-py-sm text-body1">ธรรมและวินัย ที่เราแสดงแล้ว บัญญัติแล้ว <br>แก่พวกเธอทั้งหลาย <br><br>จักเป็นศาสดาของพวกเธอ <br>โดยกาลล่วงไปแห่งเรา</p>'
  },
  // mainNav
  mainNav: {
    home: 'หน้าแรก',
    project: 'โครงการ'
  }
}
