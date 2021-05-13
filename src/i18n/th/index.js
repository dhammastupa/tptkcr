// This is just an example,
// so you can safely delete all default props below

export default {
  // ---------
  // system
  // ---------
  // label
  systemLabel: {
    projectName: 'ระบบ​เครือข่ายการอ้างอิง​ร่วมพระไตรปิฎก',
    switchLang: 'Language Switcher',
    submit: 'บันทึก',
    close: 'ปิด',
    verified: 'ยืนยันอีเมลแล้ว',
    createdOn: 'วันที่บันทึก',
    updatedOn: 'วันที่ปรับปรุง',
    createdBy: 'บันทึกโดย',
    updatedBy: 'ปรับปรุงโดย',
    create: 'สร้าง',
    update: 'ปรับปรุง',
    checkToDelete: 'ต้องการลบรายการ',
    requiredField: 'โปรดกรอกข้อมูล',
    userList: 'รายชื่อผู้ใช้',
    permissionList: 'รายการสิทธิ์',
    search: 'ค้นหา',
    backHome: 'กลับหน้าแรก',
    page404: 'ไม่พบหน้าที่ต้องการ',
    page403: 'ไม่ได้รับอนุญาต',
    checkPermissions: 'กำลังตรวจสอบสิทธิ์',
    notValid: 'กรอกข้อมูลไม่ถูกต้อง',
    deleteRecord: 'ลบข้อมูล',
    saveRecord: 'บันทึกข้อมูล',
    confirm: 'ยืนยัน',
    cancel: 'ยกเลิก',
    note: 'หมายเหตุ'
  },
  // message
  systemMessage: {
    infoTitle: '<span class="text-blue">แจ้งเพื่อทราบ</span>',
    errorTitle: '<span class="text-red">เกิดข้อผิดพลาด</span>',
    success: 'ดำเนินการสำเร็จ',
    error: 'ดำเนินการไม่สำเร็จ โปรดติดต่อเจ้าหน้าที่',
    deleted: 'ดำเนินการลบไฟล์สำเร็จ'
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
  // profile
  profile: {
    updateProfile: 'ประวัติ',
    firstName: 'ชื่อ',
    lastName: 'นามสกุล'
  },
  // accessControl
  accessControl: {
    uid: 'รหัส',
    email: 'อีเมล',
    user: 'รายการผู้ใช้',
    firstName: 'ชื่อ',
    lastName: 'นามสกุล',
    creationDate: 'วันลงทะเบียน',
    group: 'รายการกลุ่มผู้ใช้',
    role: 'บทบาท',
    description: 'รายละเอียด',
    permission: 'สิทธิ์การใช้งาน'
  },
  // operation
  operation: {
    tipitakaEdition: 'พระไตรปิฎก',
    digitization: 'รายการบันทึกพระไตรปิฎกในระบบฐานข้อมูลดิจิทัล',
    pageNumber: 'หมายเลขหน้า',
    volume: 'เล่มหนังสือ',
    number: 'เล่ม',
    name: 'ชื่อเล่ม',
    totalPages: 'จำนวนหน้า',
    selectVolume: 'เลือกเล่ม',
    volumesSet: 'เล่ม',
    pages: 'หน้า',
    imageReference: 'รูปภาพอ้างอิง',
    volumeNumber: 'เล่มที่',
    text: 'เนื้อความ',
    image: 'รูปภาพ',
    uploadImage: 'อัปโหลดไฟล์ภาพ',
    proofread: 'พิสูจน์อักษร',
    removeExtraSpace: 'ลบช่องว่างส่วนเกิน',
    increaseLineHeight: 'เพิ่มช่องว่างระหว่างบรรทัด',
    decreaseLineHeight: 'ลดช่องว่างระหว่างบรรทัด',
    lineSpacing: 'ระหว่างบรรทัด',
    paddingTop: 'บรรทัดแรก',
    confirmToCreateWrodlist: 'เมื่อสร้าง "รายการคำ" แล้ว ระบบจะไม่อนุญาตให้แก้ไขข้อความต้นฉบับ',
    confirmToRemoveWrodlist: 'ลบ "รายการคำ" ที่สร้างขึ้นจากหน้านี้ทั้งหมด'
  },
  // configuration
  configuration: {
    tipitakaEdition: 'ฉบับพระไตรปิฎก',
    sequence: 'ลำดับ',
    code: 'รหัส',
    name: 'ชื่อ',
    description: 'รายละเอียด',
    yearOfPublication: 'ปีที่พิมพ์',
    language: 'ภาษา',
    script: 'อักษร',
    volumes: 'จำนวนเล่ม',
    publisher: 'ผู้จัดพิมพ์',
    country: 'ประเทศ',
    buddhistEra: 'ตย. 2500',
    pali: 'ปาฬิ',
    burmese: 'พม่า',
    devanagari: 'เทวนาครี',
    khmer: 'เขมร',
    lanna: 'ล้านนา',
    laos: 'ลาว',
    roman: 'โรมัน',
    sinhala: 'สิงหล',
    thai: 'ไทย',
    sriLanka: 'ศรีลังกา',
    myanmar: 'พม่า',
    content: 'เนื้อหาเว็บไซต์',
    routeName: 'ชื่อเพจ',
    query: 'คิวรี่ข้อมูล',
    mi1: 'เครื่องมือ #1',
    mi2: 'เครื่องมือ #2',
    mi3: 'เครื่องมือ #3',
    mi4: 'เครื่องมือ #4'
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
    loginSuccessful: 'เข้าสู่ระบบสำเร็จ',
    resendEmail: 'ส่งอีเมลอีกครั้ง และออกจากระบบ',
    verifyAccount: '<p class="text-h6"> โปรดยืนยันอีเมลของคุณเพื่อทำการเปิดบัญชีผู้ใช้งานให้เสร็จสมบูรณ์.</p> <p class="q-py-sm text-body1">หลังจากทำการลงทะเบียน คุณจะได้รับอีเมลจากโครงการฯ ซึ่งจัดส่งไปถึงที่อยู่อีเมลที่คุณระบุไว้ กรุณาเปิดอีเมลฉบับนั้นและกดลิงค์ที่ได้ระบุไว้ เพื่อทำการยืนยัน</p>',
    wordOfBuddha: '<p class="text-subtitle1">โย โว ธมฺโม จ วินโย จ เทสิโต ปญฺญตฺโต <br> โส โว มมจฺจเยน สตฺถา </p> <p class="q-py-sm text-body1">ธรรมและวินัย ที่เราแสดงแล้ว บัญญัติแล้ว <br>แก่พวกเธอทั้งหลาย <br><br>จักเป็นศาสดาของพวกเธอ <br>โดยกาลล่วงไปแห่งเรา</p>'
  },
  // mainNav
  mainNav: {
    profile: 'ประวัติ',
    home: 'หน้าแรก',
    project: 'โครงการ',
    myProfile: 'ประวัติผู้ใช้',
    settings: 'ตั้งค่าระบบ',
    accessControl: 'การกำหนดสิทธิ์',
    user: 'บัญชีผู้ใช้',
    group: 'กลุ่มผู้ใช้',
    permission: 'การอนุญาต',
    membership: 'สมาชิก',
    configuration: 'การตั้งค่าระบบ',
    tipitakaEdition: 'ฉบับพระไตรปิฎก',
    tipitaka: 'พระไตรปิฎก',
    webContent: 'เนื้อหาเว็บไซต์',
    utility: 'เครื่องมือ'
  }
}
