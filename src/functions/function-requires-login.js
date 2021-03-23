import store from 'src/store'

export function requiresLogin (to, next) {
  const n = 3
  let i = 0
  function keepTryAgain () {
    i++
    if (store.state.auth.loggedIn) {
      return next()
    } else {
      if (i < n) {
        console.log('try again in 1 seconds')
        setTimeout(keepTryAgain, 1000) // try again in 1 seconds
      } else {
        next('/auth')
      }
    }
  }
  keepTryAgain()
}
