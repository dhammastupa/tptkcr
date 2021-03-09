const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    // 1 ไม่บังคับว่าต้องล็อกอิน
    // 2 ในกรณีที่ล็อกอินแล้ว หากผู้ใช้ยังไม่ยืนยันตัวตน จะแจ้งให้ทราบ
    //   โดยจะมี 2 ปุ่มให้เลือกคือ
    //   ปุ่มส่งอีเมลอีกครั้ง พร้อมล็อกเอาท์ และ ปุ่ม ล็อกเอาท์
    children: [
      {
        path: '',
        component: () => import('pages/Index.vue')
      },
      {
        path: '/auth',
        name: 'auth',
        component: () => import('pages/PageAuth.vue')
      },
      {
        path: '/verify-account',
        name: 'verifyAccount',
        component: () => import('pages/VerifyAcc.vue')
      },
      {
        path: '/project',
        name: 'project',
        component: () => import('pages/Project.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
