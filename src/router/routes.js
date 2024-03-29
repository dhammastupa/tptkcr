import { requiresLogin } from 'src/functions/function-requires-login'
import { requiresPermission } from 'src/functions/function-requires-permission'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // non-restricted pages / profile
      {
        path: '',
        component: () => import('src/pages/Home/Index.vue')
      },
      {
        path: '/auth',
        name: 'auth',
        component: () => import('src/pages/Home/PageAuth.vue')
      },
      {
        path: '/project',
        name: 'project',
        component: () => import('pages/Home/Project.vue')
      },
      {
        path: '/my-account/profile',
        name: 'profile',
        component: () => import('pages/Profile/UpdateProfile.vue'),
        beforeEnter: (to, from, next) => requiresLogin(to, next)
      },
      // restricted pages
      // operation
      {
        path: '/tipitaka/:id',
        name: 'tipitaka',
        component: () => import('src/pages/Operation/Tipitaka.vue'),
        beforeEnter: (to, from, next) => requiresPermission(['tipitaka'], to, next)
      },
      {
        path: '/common-toc/:id',
        name: 'common-toc',
        component: () => import('src/pages/Operation/CommonToc.vue'),
        beforeEnter: (to, from, next) => requiresPermission(['common-toc'], to, next)
      },
      // setting
      // configuration
      {
        path: '/setting/configuration/tipitaka-edition',
        name: 'tipitaka-edition',
        component: () => import('src/pages/Setting/Configuration/TipitakaEdition.vue'),
        beforeEnter: (to, from, next) => requiresPermission(['configuration'], to, next)
      },
      {
        path: '/setting/configuration/toc-set',
        name: 'toc-set',
        component: () => import('src/pages/Setting/Configuration/TocSet.vue'),
        beforeEnter: (to, from, next) => requiresPermission(['configuration'], to, next)
      },
      {
        path: '/setting/configuration/content',
        name: 'webContent',
        component: () => import('src/pages/Setting/Configuration/WebContent.vue'),
        beforeEnter: (to, from, next) => requiresPermission(['configuration'], to, next)
      },
      // utility
      {
        path: '/setting/utility',
        name: 'utility',
        component: () => import('src/pages/Setting/Utility/index.vue'),
        beforeEnter: (to, from, next) => requiresPermission(['utility'], to, next)
      },
      {
        path: '/setting/utility/query',
        name: 'query',
        component: () => import('src/pages/Setting/Utility/Query.vue'),
        beforeEnter: (to, from, next) => requiresPermission(['utility'], to, next)
      },
      {
        path: '/setting/utility/mi1',
        name: 'mi1',
        component: () => import('src/pages/Setting/Utility/Mi1.vue'),
        beforeEnter: (to, from, next) => requiresPermission(['utility'], to, next)
      },
      {
        path: '/setting/utility/mi2',
        name: 'mi2',
        component: () => import('src/pages/Setting/Utility/Mi2.vue'),
        beforeEnter: (to, from, next) => requiresPermission(['utility'], to, next)
      },
      {
        path: '/setting/utility/mi3',
        name: 'mi3',
        component: () => import('src/pages/Setting/Utility/Mi3.vue'),
        beforeEnter: (to, from, next) => requiresPermission(['utility'], to, next)
      },
      {
        path: '/setting/utility/mi4',
        name: 'mi4',
        component: () => import('src/pages/Setting/Utility/Mi4.vue'),
        beforeEnter: (to, from, next) => requiresPermission(['utility'], to, next)
      },
      {
        path: '/setting/utility/mi5',
        name: 'mi5',
        component: () => import('src/pages/Setting/Utility/Mi5.vue'),
        beforeEnter: (to, from, next) => requiresPermission(['utility'], to, next)
      },
      {
        path: '/setting/utility/mi6',
        name: 'mi6',
        component: () => import('src/pages/Setting/Utility/Mi6.vue'),
        beforeEnter: (to, from, next) => requiresPermission(['utility'], to, next)
      },
      {
        path: '/setting/utility/mi7',
        name: 'mi7',
        component: () => import('src/pages/Setting/Utility/Mi7.vue'),
        beforeEnter: (to, from, next) => requiresPermission(['utility'], to, next)
      },
      {
        path: '/setting/utility/mi8',
        name: 'mi8',
        component: () => import('src/pages/Setting/Utility/Mi8.vue'),
        beforeEnter: (to, from, next) => requiresPermission(['utility'], to, next)
      },
      {
        path: '/setting/utility/mi9',
        name: 'mi9',
        component: () => import('src/pages/Setting/Utility/Mi9.vue'),
        beforeEnter: (to, from, next) => requiresPermission(['utility'], to, next)
      },
      // access control
      {
        path: '/setting/access-control/user',
        name: 'user',
        component: () => import('src/pages/Setting/AccessControl/User.vue'),
        beforeEnter: (to, from, next) => requiresPermission(['accessControl'], to, next)
      },
      {
        path: '/setting/access-control/group',
        name: 'group',
        component: () => import('src/pages/Setting/AccessControl/Group.vue'),
        beforeEnter: (to, from, next) => requiresPermission(['accessControl'], to, next)
      },
      {
        path: '/setting/access-control/permission',
        name: 'permission',
        component: () => import('src/pages/Setting/AccessControl/Permission.vue'),
        beforeEnter: (to, from, next) => requiresPermission(['accessControl'], to, next)
      }
    ]
  },

  {
    path: '/Error403',
    component: () => import('src/pages/Home/Error403.vue')
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('src/pages/Home/Error404.vue')
  }
]

export default routes
