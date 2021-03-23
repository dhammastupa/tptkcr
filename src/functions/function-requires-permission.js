import _ from 'lodash'
import store from 'src/store'

export function requiresPermission (requirePermission, to, next) {
  const n = 3
  let i = 0
  function keepTryAgain () {
    i++
    if (_.intersection(store.state.auth.permission, requirePermission).length) {
      return next()
    } else {
      if (i < n) {
        console.log('try again in 1 seconds')
        setTimeout(keepTryAgain, 1000) // try again in 1 seconds
      } else {
        next('/Error403')
        next({
          path: '/Error403/',
          query: {
            backUrl: to.fullPath
          }
        })
      }
    }
  }
  keepTryAgain()
}
