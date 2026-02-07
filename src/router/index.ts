import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/base64',
      name: 'base64',
      component: () => import('../views/Base64View.vue'),
    },
    {
      path: '/diff',
      name: 'diff',
      component: () => import('../views/DiffView.vue'),
    },
    {
      path: '/markdown',
      name: 'markdown',
      component: () => import('../views/MarkdownView.vue'),
    },
    {
      path: '/http-status',
      name: 'http-status',
      component: () => import('../views/HttpStatusView.vue'),
    },
    {
      path: '/notes',
      name: 'notes',
      component: () => import('../views/NotesView.vue'),
    },
    {
      path: '/cron',
      name: 'cron',
      component: () => import('../views/CronView.vue'),
    },
    {
      path: '/url',
      name: 'url',
      component: () => import('../views/UrlView.vue'),
    },
    {
      path: '/ids',
      name: 'ids',
      component: () => import('../views/IdsView.vue'),
    },
    {
      path: '/hashes',
      name: 'hashes',
      component: () => import('../views/HashView.vue'),
    },
    {
      path: '/base-convert',
      name: 'base-convert',
      component: () => import('../views/BaseConvertView.vue'),
    },
    {
      path: '/color',
      name: 'color',
      component: () => import('../views/ColorView.vue'),
    },
    {
      path: '/poker',
      name: 'poker',
      component: () => import('../views/PokerView.vue'),
    },
  ],
})

export default router
