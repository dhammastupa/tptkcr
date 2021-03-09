<template>
  <q-list dark>
    <q-item-label v-if="this.email" header>
      {{ this.email }}
    </q-item-label>
    <q-separator color="brown-4"/>
    <q-item
      v-for="nav in navs"
      :key="nav.label"
      :to="nav.to"
      class="text-white"
      exact-active-class="bg-brown-6"
      clickable
    >
      <q-item-section avatar>
        <q-icon :name="nav.icon" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ nav.label }}</q-item-label>
      </q-item-section>
    </q-item>
    <q-separator color="brown-4"/>
  </q-list>
</template>

<script>
export default {
  props: ['email'],
  data () {
    return {
    }
  },
  computed: {
    navs () {
      const result = [
        {
          label: this.$t('mainNav.home'),
          icon: 'home',
          to: '/'
        },
        {
          label: this.$t('mainNav.project'),
          icon: 'history_edu',
          to: '/project'
        },
        {
          label: this.$t('mainNav.verifyAcc'),
          icon: 'history_edu',
          to: '/verify-account'
        }
      ]
      return result
    }
  }
}
</script>
