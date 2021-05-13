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
      to: '/',
      class: 'text-black'
    },
    {
      label: 'mainNav.project',
      icon: 'history_edu',
      to: '/project',
      class: 'text-black'
    }
  ],
  profileNavs: [
    {
      icon: 'face',
      label: 'mainNav.profile',
      to: '/',
      class: 'q-pt-lg text-blue-grey',
      title: true,
      loggedIn: true,
      userEmailVerified: true,
      havePermission: ''
    },
    {
      icon: '',
      label: email,
      caption: dateFormattedString,
      to: '/my-account/profile',
      class: 'text-black',
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
      class: 'q-pt-lg text-blue-grey',
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
      class: 'q-pt-lg text-blue-grey',
      title: true,
      loggedIn: true,
      userEmailVerified: true,
      havePermission: 'accessControl'
    },
    {
      icon: 'people',
      label: 'mainNav.user',
      to: '/setting/access-control/user',
      class: 'text-black',
      loggedIn: true,
      userEmailVerified: true,
      havePermission: 'accessControl'
    },
    {
      icon: 'supervised_user_circle',
      label: 'mainNav.group',
      to: '/setting/access-control/group',
      class: 'text-black',
      loggedIn: true,
      userEmailVerified: true,
      havePermission: 'accessControl'
    },
    {
      icon: 'flaky',
      label: 'mainNav.permission',
      to: '/setting/access-control/permission',
      class: 'text-black',
      loggedIn: true,
      userEmailVerified: true,
      havePermission: 'accessControl'
    }
  ],
  configuratoinNavs: [
    {
      icon: 'settings_suggest',
      label: 'mainNav.configuration',
      to: '/',
      class: 'q-pt-lg text-blue-grey',
      title: true,
      loggedIn: true,
      userEmailVerified: true,
      havePermission: 'configuration'
    },
    {
      icon: 'snippet_folder',
      label: 'mainNav.tipitakaEdition',
      to: '/setting/configuration/tipitaka-edition',
      class: 'text-black',
      loggedIn: true,
      userEmailVerified: true,
      havePermission: 'configuration'
    },
    {
      icon: 'wysiwyg',
      label: 'mainNav.webContent',
      to: '/setting/configuration/content',
      class: 'text-black',
      loggedIn: true,
      userEmailVerified: true,
      havePermission: 'configuration'
    }
  ],
  utilityNavs: [
    {
      icon: 'build',
      label: 'mainNav.utility',
      to: '/setting/utility',
      class: 'text-black',
      title: false,
      loggedIn: true,
      userEmailVerified: true,
      havePermission: 'utility'
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
    db.collection('tipitakaEdition').orderBy('sequence').get()
      .then(querySnapshot => {
        querySnapshot.forEach((doc) => {
          menuItems.push({
            icon: 'remove',
            label: doc.data().name,
            caption: doc.data().description,
            to: '/tipitaka/' + doc.data().code,
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
