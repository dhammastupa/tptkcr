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
      // setting
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
      },
      // configuration
      {
        path: '/setting/configuration/tipitaka-edition',
        name: 'bookSet',
        component: () => import('src/pages/Setting/Configuration/TipitakaEdition.vue'),
        beforeEnter: (to, from, next) => requiresPermission(['configuration'], to, next)
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
