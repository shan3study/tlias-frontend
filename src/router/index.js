import { createRouter, createWebHistory } from 'vue-router'

import ClazzView from '@/views/clazz/index.vue'
import DeptView from '@/views/dept/index.vue'
import EmpView from '@/views/emp/index.vue'
import IndexView from '@/views/index/index.vue'
import LayoutView from '@/views/layout/index.vue'
import LogView from '@/views/log/index.vue'
import LoginView from '@/views/login/index.vue'
import EmpReportView from '@/views/report/emp/index.vue'
import StuReportView from '@/views/report/stu/index.vue'
import StuView from '@/views/stu/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      /* 这个父路由是顶级路由（没有被其他路由嵌套），
      它处于路由树的最外层，空路径在顶级自然等于 /，所以加不加/都行 */
      path: '',
      name: '',
      component: LayoutView,
      redirect: '/index',//重定向，如果访问的是根路径，默认跳转到/index
      children: [
        /* 子路由一律用相对路径，不能用绝对路径
        假设父路由为/admin
         写法：path: 'clazz' 最终url:/admin/clazz	拼接在父路径后面
         写法：path: '/clazz' 最终url:/clazz    	以 / 开头，忽略父路径 /admin*/
        { path: 'clazz', name: 'clazz', component: ClazzView },
        { path: 'dept', name: 'dept', component: DeptView },
        { path: 'emp', name: 'emp', component: EmpView },
        { path: 'index', name: 'index', component: IndexView },
        { path: 'log', name: 'log', component: LogView },
        { path: 'empReport', name: 'empReport', component: EmpReportView },
        { path: 'stuReport', name: 'stuReport', component: StuReportView },
        { path: 'stu', name: 'stu', component: StuView }
      ]
    },
    { path: '/login', name: 'login', component: LoginView }

  ]
})

export default router
