import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('auth', ['loggedIn', 'email', 'userEmailVerified', 'permission'])
  },
  methods: {
    requiresPermission (navs) {
      const result = []
      navs.forEach(nav => {
        // ต้องล็อกอินไหม
        if (nav.loggedIn) {
          // ตรวจการล็อกอิน
          if (this.loggedIn) {
            // ต้องยืนยันตัวตนไหม
            if (nav.userEmailVerified) {
              if (this.userEmailVerified) {
                // ต้องระบุสิทธิ์ไหม
                console.log('userEmailVerified')
                if (nav.havePermission) {
                  if (this._.includes(this.permission, nav.havePermission)) {
                    result.push(nav)
                  }
                // ต้องล็อกอิน ต้นยืนยันตัวตน แต่ไม่ต้องระบุสิทธิ์
                } else {
                  result.push(nav)
                }
              }
            // ต้องล็อกอิน แต่ไม่ต้องยืนยันตัวตน
            } else {
              result.push(nav)
            }
          }
        // ไม่ต้องล็อกอิน
        } else {
          result.push(nav)
        }
      })
      return result
    }
  }
}
