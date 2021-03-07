<template>
  <q-layout view="hHh LpR fff">

    <!-- ไทเทิลบาร์ -->
    <q-header elevated class="bg-brown-8 text-white">
      <q-toolbar>
        <!-- เปิดปิดเมนู -->
        <q-btn
          class="q-pa-sm" color="brown-2" dense rounded
          @click="left = !left">
          <img src="~assets/system-images/logo-genie.png"
            width="20px" />
        </q-btn>

        <!-- ชื่อระบบ -->
        <q-toolbar-title>
        <span style="font-size: 18px;">{{ $t('systemLabel.projectName') }}</span>
        </q-toolbar-title>

        <!-- เปลี่ยนภาษา -->
        <q-btn-dropdown stretch flat :label="mySelectedLocale">
          <q-list>
            <q-item
              v-for="n in langOptions" :key="n.value"
              clickable v-close-popup @click="onItemClick(n.value)"
              v-model="mySelectedLocale">
              <q-item-section>
                <q-item-label>{{ n.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <!-- ปุ่มเข้าออกระบบ  -->
        <q-btn
          v-if="!loggedIn"
          to="/auth"
          icon-right="account_circle"
          :label="$t('mainLayout.login')"
          flat
        />

        <q-btn
          v-else
          @click="logoutUser"
          icon-right="account_circle"
          :label="$t('mainLayout.logout')"
          flat
        />
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
      <q-list dark>
        <q-item-label v-if="this.email" header>
          {{ this.email }}
        </q-item-label>
        <q-separator color="brown-4"/>
        <q-item
          v-for="nav in navs"
          :key="nav.label"
          :to="nav.to"
          class="text-grey-4"
          exact
          clickable
        >
          <q-item-section
            avatar
          >
            <q-icon :name="nav.icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ nav.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {

  data () {
    return {
      left: false,
      lang: this.$i18n.locale,
      langOptions: [
        { value: 'en-us', label: 'English' },
        { value: 'th', label: 'ไทย' }
      ],
      navs: [
        {
          label: 'Todo',
          icon: 'list',
          to: '/'
        },
        {
          label: 'Settings',
          icon: 'settings',
          to: '/settings'
        }
      ]
    }
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
    }
  },
  methods: {
    ...mapActions('settings', ['setMySelectedLocale', 'getSettings']),
    ...mapActions('auth', ['logoutUser']),
    onItemClick (i) {
      this.mySelectedLocale = i
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
