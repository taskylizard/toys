import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
  ],
})

export default router
