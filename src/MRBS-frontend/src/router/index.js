import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Lobby from '@/components/Lobby.vue'
import Privilege from '@/components/Privilege.vue'
import Conference from '@/components/conference.vue'
import Board from '@/components/Board.vue'
import Preview from '@/components/Preview.vue'
import Demo from '@/components/Demo.vue'
import Rule from '@/components/Rule.vue'
import Log from '@/components/Log.vue'
import RuleDemo from '@/components/RuleDemo.vue'

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
    },
    {
      path: '/board/demo',
      name: 'board_demo',
      component: Demo
    },
    {
      path: '/board/preview',
      name: 'preview',
      component: Preview
    },
    {
      path: '/board',
      name: 'board',
      component: Board,
    },
    {
      path: '/rule/demo',
      name: 'rule_demo',
      component: RuleDemo
    },
    {
      path: '/rule',
      name: 'rule',
      component: Rule,
      children: [
        {
          path: ':doc_name',
          component: Rule
        }
      ],
    },
    {
      path: '/log',
      name: 'log',
      component: Log
    }
  ]
})

export default router
