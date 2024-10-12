import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/homeView.vue'
import Lobby from '@/components/lobby.vue'
import Privilege from '@/components/privilege.vue'
import Conference from '@/components/conference.vue'
import Board from '@/components/board.vue'
import Preview from '@/components/preview.vue'
import Demo from '@/components/demo.vue'
import Rule from '@/components/rule.vue'
import Log from '@/components/log.vue'
import RuleDemo from '@/components/ruleDemo.vue'
import Auth from '@/middleware/auth.vue'
import FailedLogin from '@/components/failedLogin.vue'

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
