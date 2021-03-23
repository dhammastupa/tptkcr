import { date, LocalStorage } from 'quasar'
import { db } from 'src/boot/firebase'
import _ from 'lodash'

const email = LocalStorage.getItem('email')
const timeStamp = Date.now()
const dateFormattedString = date.formatDate(timeStamp, 'YYYY-MM-DD HH:mm')

const state = {
  sideMenu: false,
  nonRestrictedNavs: [
    {
      label: 'mainNav.home',
      icon: 'home',
      to: '/'
    },
    {
      label: 'mainNav.project',
      icon: 'history_edu',
      to: '/project'
    }
  ],
  profileNavs: [
    {
      icon: '',
      label: email,
      caption: dateFormattedString,
      to: '/my-account/profile',
      loggedIn: true,
      userEmailVerified: true,
      havePermission: ''
    }
  ],
  operationNavs: [
    {
      icon: 'auto_stories',
      label: 'mainNav.tipitaka',
      to: '/',
      title: true,
      loggedIn: true,
      userEmailVerified: true,
      havePermission: 'tipitaka'
    }
  ],
  accessControlNavs: [
    {
      icon: 'verified_user',
      label: 'mainNav.accessControl',
      to: '/',
      title: true,
      loggedIn: true,
      userEmailVerified: true,
      havePermission: 'accessControl'
    },
    {
      icon: 'people',
      label: 'mainNav.user',
      to: '/setting/access-control/user',
      loggedIn: true,
      userEmailVerified: true,
      havePermission: 'accessControl'
    },
    {
      icon: 'supervised_user_circle',
      label: 'mainNav.group',
      to: '/setting/access-control/group',
      loggedIn: true,
      userEmailVerified: true,
      havePermission: 'accessControl'
    },
    {
      icon: 'flaky',
      label: 'mainNav.permission',
      to: '/setting/access-control/permission',
      loggedIn: true,
      userEmailVerified: true,
      havePermission: 'accessControl'
    }
  ],
  configuratoinNavs: [
    {
      icon: 'build',
      label: 'mainNav.configuration',
      to: '/',
      title: true,
      loggedIn: true,
      userEmailVerified: true,
      havePermission: 'configuration'
    },
    {
      icon: 'snippet_folder',
      label: 'mainNav.tipitakaEdition',
      to: '/setting/configuration/tipitaka-edition',
      loggedIn: true,
      userEmailVerified: true,
      havePermission: 'configuration'
    }
  ]
}

const mutations = {
  setSideMenu (state, payload) {
    state.sideMenu = !state.sideMenu
  },
  setOperationNavs (state, payload) {
    const uniq = _.uniqBy([...state.operationNavs, ...payload], function (o) {
      return o.label
    })
    state.operationNavs = uniq
  }
}

const actions = {
  createOperationNavs ({ commit }, payload) {
    const menuItems = []
    db.collection('tipitakaEdition').orderBy('createdOn').get()
      .then(querySnapshot => {
        querySnapshot.forEach((doc) => {
          const element = doc.data()
          menuItems.push({
            icon: 'remove',
            label: element.name,
            caption: element.description,
            to: '/tipitaka/' + element.code,
            loggedIn: true,
            userEmailVerified: true,
            havePermission: 'tipitaka'
          })
        })
        commit('setOperationNavs', menuItems)
      })
  }
}

const getters = {
  getSideMenu: state => {
    return state.sideMenu
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
