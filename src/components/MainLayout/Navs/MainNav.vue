<template>
  <q-drawer
    v-model="mySideMenu"
    :breakpoint="767"
    :width="250"
    show-if-above
    bordered
    content-class="bg-primary"
  >

    <!-- เมนูส่วนบุคคล -->
    <nav-items
      :navItems="profileMenu"
    />

    <!-- เมนูสาธารณะ -->
    <nav-items
      :navItems="nonRestrictedNavs"
    />

    <!-- เมนูแสดงตามสิทธิ -->
    <!-- เมนูทำงาน -->
    <nav-items
      :navItems="tipitakaMenu"
    />

    <!-- เมนูตั้งค่าระบบ -->
    <nav-items
      :navItems="requiresPermission(this.configuratoinNavs)"
    />

    <!-- เมนูกำหนดสิทธิ์ -->
    <nav-items
      :navItems="requiresPermission(this.accessControlNavs)"
    />

    <q-list bordered class="bg-white" padding>
      <q-item>
        <q-item-section>
            <q-item-label caption>
              <q-item-label>
                <a href="https://ptipitaka.org">
                  <img alt="Logo" src="~assets/system-images/logo-icon.png">
                </a>
              </q-item-label>
            </q-item-label>
          <q-item-label caption>มูลนิธิพระไตรปิฎกเพื่อประชาชน</q-item-label>
          <q-item-label overline>
            <a href="https://ptipitaka.org">ptipitaka.org</a></q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

  </q-drawer>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import NavItems from 'src/components/MainLayout/Navs/NavItems'

export default {
  components: { NavItems },
  props: ['mySelectedLocale'],
  created () {
    this.createOperationNavs()
  },
  computed: {
    ...mapState('auth', ['loggedIn', 'email', 'userEmailVerified', 'permission']),
    ...mapState('navs', [
      'sideMenu', 'nonRestrictedNavs', 'profileNavs', 'operationNavs', 'accessControlNavs', 'configuratoinNavs']),
    mySideMenu: {
      get () {
        return this.sideMenu
      },
      set (value) {
        this.setSideMenu(value)
      }
    },
    tipitakaMenu () {
      return this.requiresPermission(this.operationNavs)
    },
    profileMenu () {
      return this.requiresPermission(this.profileNavs)
    }
  },
  methods: {
    ...mapMutations('navs', ['setSideMenu', 'setOperationNavs']),
    ...mapActions('navs', ['createOperationNavs']),
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
</script>
