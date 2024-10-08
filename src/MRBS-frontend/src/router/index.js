import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Lobby from '@/components/Lobby.vue'
import Privilege from '@/components/Privilege.vue'
import Conference from '@/components/conference.vue'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      //component: () => import('../views/AboutView.vue')
    },
    {
      path: '/lobby',
      name: 'lobby',
      component: Lobby
    },
    {
      path: '/privilege',
      name: 'privilege',
      component: Privilege
    },
    {
      path: '/conference',
      name: 'conference',
      component: Conference
    }
  ]
})

export default router
