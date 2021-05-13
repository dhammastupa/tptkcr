<template>
  <q-page padding>
    <nav-items
      :navItems="requiresPermission(menuItem)"
    />
  </q-page>
</template>

<script>
import NavItems from 'src/components/MainLayout/Navs/NavItems'
import requiresPermission from 'src/mixins/requires-permission'
import { mapState } from 'vuex'

export default {
  mixins: [requiresPermission],
  components: { NavItems },
  data () {
    return {
      some: 'sss',
      menuItem: [
        {
          icon: 'pan_tool',
          label: 'configuration.query',
          to: '/setting/utility/query',
          class: 'text-grey',
          loggedIn: true,
          userEmailVerified: true,
          havePermission: 'utility'
        },
        {
          icon: 'pan_tool',
          label: 'configuration.mi1',
          to: '/setting/utility/mi1',
          class: 'text-grey',
          loggedIn: true,
          userEmailVerified: true,
          havePermission: 'utility'
        },
        {
          icon: 'pan_tool',
          label: 'configuration.mi2',
          to: '/setting/utility/mi2',
          class: 'text-grey',
          loggedIn: true,
          userEmailVerified: true,
          havePermission: 'utility'
        },
        {
          icon: 'pan_tool',
          label: 'configuration.mi3',
          to: '/setting/utility/mi3',
          class: 'text-grey',
          loggedIn: true,
          userEmailVerified: true,
          havePermission: 'utility'
        },
        {
          icon: 'pan_tool',
          label: 'configuration.mi4',
          to: '/setting/utility/mi4',
          class: 'text-grey',
          loggedIn: true,
          userEmailVerified: true,
          havePermission: 'utility'
        }
      ]
    }
  },
  computed: {
    ...mapState('navs', [
      'profileNavs'
    ])
  }
}
</script>
