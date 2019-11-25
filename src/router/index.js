import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const Layout = () => import('@/views/layout.vue')
const Home = () => import('@/views/home/index.vue')
const Question = () => import('@/views/question/index')
const Video = () => import('@/views/video/index.vue')
const User = () => import('@/views/user/index.vue')
const UserProfile = () => import('@/views/user/profile')
const UserChat = () => import('@/views/user/chat')
const Login = () => import('@/views/user/login.vue')
const Search = () => import('@/views/search/index')
const SearchResult = () => import('@/views/search/result')
const Article = () => import('@/views/home/article')

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      // { path: '/', name: 'home', component: Home },
      { path: '/', name: 'home', component: Home, meta: { keepAlive: true } },
      { path: '/question', name: 'question', component: Question },
      { path: '/video', name: 'video', component: Video },
      { path: '/user', name: 'user', component: User }
    ]
  },
  { path: '/user/profile', name: 'user-profile', component: UserProfile },
  { path: '/user/chat', name: 'user-chat', component: UserChat },
  { path: '/login', name: 'login', component: Login },
  { path: '/search', name: 'search', component: Search },
  { path: '/search/result', name: 'search-result', component: SearchResult },
  // 做缓存处理
  // { path: '/article/:id', name: 'article', component: Article}
  { path: '/article/:id', name: 'article', component: Article, meta: { keepAlive: true } }
]

const router = new VueRouter({
  routes
})

// 使用导航守卫拦截登录
router.beforeEach((to, from, next) => {
  const { user } = store.state
  // 当未登录 且  页面为（个人中心 /user、编辑资料 /user/profile、小智同学 /user/chat）
  if (!user.token && to.path.startsWith('/user')) {
    // 现实登录后回跳  把当前想访问的地址传递给登录页面
    return next({ path: '/login', query: { redirectUrl: to.path } })
  }
  next()
})

export default router
