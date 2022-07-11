import { createRouter, createWebHashHistory } from 'vue-router';
// import Poster from '@/pages/Poster.vue';
export const routes = [
  // {
  //   path: '/',
  //   redirect: '/poster',
  // },
  // {
  //   path: '/poster',
  //   name: 'poster',
  //   component: Poster,
  // },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 路由守卫，可在此处进行页面权限处理
// router.beforeEach((to) => {
// if (!isLogined()) {
//   return { name: "home" };
// }
// });
