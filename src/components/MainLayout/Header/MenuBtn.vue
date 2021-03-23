<template>
  <q-btn
    class="q-pa-sm" color="white" dense rounded
    @click="$emit('onSideMenuClick', mySideMenu)"
  >
    <img src="~assets/system-images/logo-genie.png"
      width="20px" />
  </q-btn>
</template>

<script>
export default {
  props: ['mySideMenu']
}
</script>
