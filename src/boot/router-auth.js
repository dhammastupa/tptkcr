import { LocalStorage } from 'quasar'

export default async ({ router, store }) => {
  router.beforeEach((to, from, next) => {
    const loggedIn = LocalStorage.getItem('loggedIn')
    if (!loggedIn && (to.path !== '/auth')) {
      next('/auth')
    } else {
      next()
    }
  })
}
