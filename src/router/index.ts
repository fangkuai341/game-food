import { createMemoryHistory, createRouter } from 'vue-router'

import Game from '../view/Game.vue'
import Home from '../view/Home.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,

  },
{
    path: '/game',
    name: 'game',
    component: Game,
}
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
export default router