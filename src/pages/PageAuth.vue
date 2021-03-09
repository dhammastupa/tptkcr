<template>
  <q-page padding>
    <!-- เข้าระบบ หรือ ลงทะเบียน -->
    <q-card v-if="!loggedIn"
      class="card-dialog">
      <!-- โลโก้ -->
      <logo />
      <!-- แท็บเลือกดำเนินการ -->
      <q-tabs
        v-model="tab" dense
        class="bg-grey-3 text-grey-7"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="login" :label="$t('pageAuth.login')" />
        <q-tab name="register" :label="$t('pageAuth.register')" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="login">
          <login-register :tab="tab" />
        </q-tab-panel>

        <q-tab-panel name="register" class="bg-grey-1">
          <login-register :tab="tab" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
    <!-- แจ้งสถานะการเข้าสู่ระบบ -->
    <q-card v-else
      class="card-dialog">
      <!-- โลโก้ -->
      <logo />

      <q-separator />

      <div v-if="userEmailVerified"
        class="q-pa-lg text-justify">
        {{ $t('pageAuth.login') }}
        {{ $t('loginRegister.verifyAccount') }}
      </div>
      <div v-else
        class="q-pa-lg text-justify"
        v-html="$t('loginRegister.verifyAccount')">
      </div>

      <q-separator />

      <q-card-actions align="center">
        <q-btn flat
          :label="$t('loginRegister.resendEmail')"
          @click="resendEmail"/>
        <q-btn flat icon="exit" :label="$t('loginRegister.logout')" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import LoginRegister from 'src/components/Auth/LoginRegister'
import Logo from 'src/components/Auth/Logo'

export default {
  name: 'PageAuth',
  components: {
    LoginRegister,
    Logo
  },
  data () {
    return {
      tab: 'login'
    }
  },
  computed: {
    ...mapState('auth', ['loggedIn', 'userEmailVerified'])
  },
  methods: {
    ...mapActions('auth', ['resendEmail'])
  }
}
</script>

<style scoped>
  .card-dialog {
    max-width: 500px;
    margin: 0 auto;
  }
</style>
