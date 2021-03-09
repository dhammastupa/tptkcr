import { LocalStorage } from 'quasar'

const state = {
  defaultSettings: {
    mySelectedLocale: 'en-us'
  },
  settings: {
    mySelectedLocale: ''
  }
}

const mutations = {
  setMySelectedLocale (state, value) {
    state.settings.mySelectedLocale = value
  },
  setSettings (state, settings) {
    Object.assign(state.settings, settings)
  }
}

const actions = {
  setMySelectedLocale ({ state, commit, dispatch }, value) {
    commit('setMySelectedLocale', value)
    dispatch('saveSetting')
  },
  saveSetting ({ state }) {
    LocalStorage.set('settings', state.settings)
  },
  getSettings ({ commit }) {
    const settings = LocalStorage.getItem('settings')
    if (settings) {
      commit('setSettings', settings)
    } else {
      commit('setSettings', state.defaultSettings)
    }
  }
}

const getters = {
  settings: state => {
    return state.settings
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
