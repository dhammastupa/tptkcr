import Vue from 'vue'
import Vuex from 'vuex'

import auth from './store-auth'
import settings from './store-settings'
import navs from './store-navs'

// import example from './module-example'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    auth,
    settings,
    navs
  },
  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: process.env.DEBUGGING
})
export default store
