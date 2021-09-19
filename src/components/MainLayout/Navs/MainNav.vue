<template>
  <q-drawer
    v-model="mySideMenu"
    :breakpoint="767"
    :width="250"
    show-if-above
    bordered
    content-class="bg-blue-grey-1"
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
      :navItems="operationMenu"
    />

    <!-- เมนูสารบัญ -->
    <nav-items
      :navItems="commonTocMenu"
    />

    <!-- เมนูตั้งค่าระบบ -->
    <nav-items
      :navItems="requiresPermission(this.configuratoinNavs)"
    />

    <!-- เมนูเครื่องมือ -->
    <nav-items
      :navItems="requiresPermission(this.utilityNavs)"
    />

    <!-- เมนูกำหนดสิทธิ์ -->
    <nav-items
      :navItems="requiresPermission(this.accessControlNavs)"
    />

    <!-- ท้ายเมนู -->
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
import requiresPermission from 'src/mixins/requires-permission'

export default {
  components: { NavItems },
  mixins: [requiresPermission],
  props: ['mySelectedLocale'],
  created () {
    this.createOperationNavs()
    this.createCommonTocNavs()
  },
  computed: {
    ...mapState('navs', [
      'sideMenu', 'nonRestrictedNavs', 'profileNavs', 'operationNavs', 'commonTocNavs', 'accessControlNavs', 'configuratoinNavs', 'utilityNavs']),
    mySideMenu: {
      get () {
        return this.sideMenu
      },
      set (value) {
        this.setSideMenu(value)
      }
    },
    operationMenu () {
      return this.requiresPermission(this.operationNavs)
    },
    commonTocMenu () {
      return this.requiresPermission(this.commonTocNavs)
    },
    profileMenu () {
      return this.requiresPermission(this.profileNavs)
    }
  },
  methods: {
    ...mapMutations('navs', ['setSideMenu', 'setOperationNavs']),
    ...mapActions('navs', ['createOperationNavs', 'createCommonTocNavs'])
  }
}
</script>
