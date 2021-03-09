<template>
  <q-layout view="hHh LpR fff">

    <!-- ไทเทิลบาร์ -->
    <q-header elevated class="bg-brown-8 text-white">
      <!-- ทูลบาร์ -->
      <q-toolbar>
        <!-- เปิดปิดเมนู -->
        <menu-btn
          :left="left"
          @left="left=!left"/>
        <!-- ชื่อระบบ -->
        <app-title />
        <!-- เปลี่ยนภาษา -->
        <locale-switch
          :localeOnHeader="localeOnHeader"
          :langOptions="langOptions"
          :mySelectedLocale="mySelectedLocale"
          @onItemClick="onItemClick" />
        <!-- ปุ่มเข้าออกระบบ  -->
        <logged-in-out
          :loggedIn="loggedIn"
          @logoutUser="logoutUser"/>
      </q-toolbar>
    </q-header>

    <!-- เมนูนำทาง -->
    <q-drawer
      v-model="left"
      :breakpoint="767"
      :width="250"
      show-if-above
      bordered
      content-class="bg-brown-5"
    >
      <main-nav :email="email" />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import MainNav from 'src/components/MainLayout/Navs/MainNav'
import MenuBtn from 'src/components/MainLayout/Header/MenuBtn'
import AppTitle from 'src/components/MainLayout/Header/AppTitle'
import LocaleSwitch from 'src/components/MainLayout/Header/LocaleSwitch'
import LoggedInOut from 'src/components/MainLayout/Header/LoggedInOut'

export default {
  data () {
    return {
      left: false,
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
    ...mapActions('settings', ['setMySelectedLocale', 'getSettings']),
    ...mapActions('auth', ['logoutUser']),
    onItemClick (value) {
      this.mySelectedLocale = value
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

<style>
body {
  font-family: thsarabunnew;
  font-weight: 900;
}
</style>
