<template>
  <q-btn
    v-if="!loggedIn"
    to="/auth"
    stretch
    icon-right="account_circle"
    :label="$t('mainLayout.login')"
    flat
  />

  <q-btn
    v-else
    @click="$emit('logoutUser')"
    stretch
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
