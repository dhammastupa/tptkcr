<template>
  <q-btn
    v-if="!loggedIn"
    to="/auth"
    icon-right="account_circle"
    :label="$t('mainLayout.login')"
    flat
  />

  <q-btn
    v-else
    @click="$emit('logoutUser')"
    icon-right="account_circle"
    :label="$t('mainLayout.logout')"
    flat
  />
</template>

<script>
export default {
  props: ['loggedIn']
}
</script>
