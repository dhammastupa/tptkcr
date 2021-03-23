<template>
  <q-btn-dropdown stretch flat :label="localeOnHeader">
    <q-list>
      <q-item
        v-for="n in langOptions" :key="n.value"
        clickable v-close-popup
        @click="$emit('onLocaleChange', (n.value))"
        v-model="mySelectedLocale">
        <q-item-section>
          <q-item-label>{{ n.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script>
export default {
  props: [
    'localeOnHeader',
    'langOptions',
    'mySelectedLocale'
  ]
}
</script>
