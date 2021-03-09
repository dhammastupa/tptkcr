<template>
  <q-btn
    class="q-pa-sm" color="brown-4" dense rounded
    @click="$emit('left', left)"
  >
    <img src="~assets/system-images/logo-genie.png"
      width="20px" />
  </q-btn>
</template>

<script>
export default {
  props: ['left']
}
</script>
