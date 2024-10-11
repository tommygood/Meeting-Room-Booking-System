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
import Auth from '@/middleware/Auth.vue'
import FailedLogin from '@/components/FailedLogin.vue'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/lobby',
      name: 'lobby',
      component: Lobby,
      meta: { requiresAuth: true }
    },
    {
      path: '/privilege',
      name: 'privilege',
      component: Privilege,
      meta: { requiresAuth: true }
    },
    {
      path: '/conference',
      name: 'conference',
      component: Conference,
      meta: { requiresAuth: true }
    },
    {
      path: '/board/demo',
      name: 'board_demo',
      component: Demo,
      meta: { requiresAuth: true }
    },
    {
      path: '/board/preview',
      name: 'preview',
      component: Preview,
      meta: { requiresAuth: true }
    },
    {
      path: '/board',
      name: 'board',
      component: Board,
      meta: { requiresAuth: true }
    },
    {
      path: '/rule/demo',
      name: 'rule_demo',
      component: RuleDemo,
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
      meta: { requiresAuth: true }
    },
    {
      path: '/log',
      name: 'log',
      component: Log,
      meta: { requiresAuth: true }
    },
    {
      path: '/failed_login',
      name: 'failed_login',
      component: FailedLogin
    }
  ]
})

// 全局導航守衛
router.beforeEach(async (to, from, next) => {
  // 檢查路由是否需要驗證
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const res = await Auth.methods.login();
    if (!res.suc) {
      // 如果未登入，重定向到登入頁面
      next({ name: 'failed_login', query: {error : res.reason} });
    } else {
      // 如果已登入，繼續導航
      next();
    }
  } else {
    // 如果路由不需要驗證，繼續導航
    next();
  }
});

export default router
