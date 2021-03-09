<template>
  <q-page padding>
    <q-card class="auth-tabs">
      <div
        class="q-pa-lg"
        style="text-align: center">
        <img src="~assets/system-images/logo.png">
      </div>
      <q-tabs
        v-model="tab"
        dense
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
  </q-page>
</template>

<script>
import LoginRegister from 'src/components/Auth/LoginRegister'

export default {
  name: 'PageAuth',
  data () {
    return {
      tab: 'login'
    }
  },
  components: {
    LoginRegister
  }
}
</script>

<style>
  .auth-tabs {
    max-width: 500px;
    margin: 0 auto;
  }
</style>
