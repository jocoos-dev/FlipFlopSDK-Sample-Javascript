import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StreamerView from '../views/StreamerView.vue'
import ViewerView from '../views/ViewerView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/viewer',
    name: 'viewer',
    component: ViewerView
  },
  {
    path: '/streamer',
    name: 'streamer',
    component: StreamerView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
