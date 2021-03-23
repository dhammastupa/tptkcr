<template>
  <q-layout view="hHh LpR lFf">

    <!-- ไทเทิลบาร์ -->
    <q-header elevated class="secondary text-white">
      <!-- ทูลบาร์ -->
      <q-toolbar>
        <!-- เปิดปิดเมนู -->
        <menu-btn
          :mySideMenu="mySideMenu"
          @onSideMenuClick="onSideMenuClick" />
        <!-- ชื่อระบบ -->
        <app-title />
        <!-- เปลี่ยนภาษา -->
        <locale-switch
          :localeOnHeader="localeOnHeader"
          :langOptions="langOptions"
          :mySelectedLocale="mySelectedLocale"
          @onLocaleChange="onLocaleChange" />
        <!-- ปุ่มเข้าออกระบบ  -->
        <logged-in-out
          :loggedIn="loggedIn"
          @logoutUser="logoutUser"/>
      </q-toolbar>
    </q-header>

    <!-- เมนูนำทาง -->
    <main-nav
      :mySelectedLocale="mySelectedLocale" />

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import MainNav from 'src/components/MainLayout/Navs/MainNav'
import MenuBtn from 'src/components/MainLayout/Header/MenuBtn'
import AppTitle from 'src/components/MainLayout/Header/AppTitle'
import LocaleSwitch from 'src/components/MainLayout/Header/LocaleSwitch'
import LoggedInOut from 'src/components/MainLayout/Header/LoggedInOut'

export default {
  data () {
    return {
      lang: this.$i18n.locale,
      langOptions: [
        { value: 'en-us', label: 'English' },
        { value: 'th', label: 'ไทย' }
      ]
    }
  },
  components: {
    MainNav,
    MenuBtn,
    AppTitle,
    LocaleSwitch,
    LoggedInOut
  },
  computed: {
    ...mapGetters('settings', ['settings']),
    ...mapState('auth', ['loggedIn', 'email', 'userEmailVerified']),
    ...mapState('navs', ['sideMenu']),
    mySideMenu: {
      get () {
        return this.sideMenu
      },
      set (value) {
        this.setSideMenu(value)
      }
    },
    mySelectedLocale: {
      get () {
        return this.settings.mySelectedLocale
      },
      set (value) {
        this.setMySelectedLocale(value)
      }
    },
    localeOnHeader () {
      let result = 'English'
      const checkResult = this._.find(this.langOptions, { value: this.mySelectedLocale })
      if (!this._.isEmpty(checkResult)) {
        result = checkResult.label
      }
      return result
    }
  },
  methods: {
    ...mapMutations('navs', ['setSideMenu']),
    ...mapActions('settings', ['setMySelectedLocale', 'getSettings']),
    ...mapActions('auth', ['logoutUser']),
    onLocaleChange (value) {
      this.mySelectedLocale = value
    },
    onSideMenuClick (value) {
      this.mySideMenu = !this.mySideMenu
    }
  },
  mounted () {
    this.getSettings()
  },
  watch: {
    mySelectedLocale (mySelectedLocale) {
      this.$i18n.locale = mySelectedLocale
    }
  }
}
</script>
