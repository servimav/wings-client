import type { RouteRecordRaw } from 'vue-router'
import { ROUTES } from './names'
import { authGuard } from './guards'

const routes: RouteRecordRaw[] = [
  {
    path: '',
    name: ROUTES.HOME,
    components: {
      default: () => import('@/views/HomeView.vue'),
      top: () => import('@/components/layouts/SearchNavbar.vue'),
      bottom: () => import('@/components/layouts/BottomNavbar.vue')
    }
  },
  {
    path: 'encargos',
    name: ROUTES.INCOMMING,
    components: {
      default: () => import('@/views/IncommingView.vue'),
      top: () => import('@/components/layouts/NavBar.vue'),
      bottom: () => import('@/components/layouts/BottomNavbar.vue')
    }
  },
  {
    path: 'caret',
    name: ROUTES.CARET,
    components: {
      top: () => import('@/components/layouts/NavBar.vue'),
      default: () => import('@/views/CaretView.vue'),
      bottom: () => import('@/components/layouts/BottomNavbar.vue')
    }
  },
  {
    path: 'orders',
    name: ROUTES.ORDERS,
    beforeEnter: authGuard,
    components: {
      default: () => import('@/views/OrdersView.vue'),
      top: () => import('@/components/layouts/NavBar.vue'),
      bottom: () => import('@/components/layouts/BottomNavbar.vue')
    }
  },
  {
    path: 'orders/:orderId',
    // beforeEnter: authGuard,
    name: ROUTES.ORDER,
    components: {
      default: () => import('@/views/OrderView.vue'),
      top: () => import('@/components/layouts/NavBar.vue'),
      bottom: () => import('@/components/layouts/BottomNavbar.vue')
    }
  },
  {
    path: 'checkout',
    name: ROUTES.CHECKOUT,
    beforeEnter: authGuard,
    components: {
      default: () => import('@/views/CheckoutView.vue'),
      top: () => import('@/components/layouts/NavBar.vue')
    }
  },
  {
    path: 'offer/:offerId',
    name: ROUTES.SINGLE_OFFER,
    component: () => import('@/views/SingleOfferView.vue')
  },
  {
    path: 'filter',
    name: ROUTES.FILTER,
    components: {
      default: () => import('@/views/FilterView.vue'),
      top: () => import('@/components/layouts/SearchNavbar.vue'),
      bottom: () => import('@/components/layouts/BottomNavbar.vue')
    }
  },
  {
    path: 'under-construction',
    name: ROUTES.UNDER_CONSTRUCTION,
    component: () => import('@/views/UnderConstruction.vue')
  },
  {
    path: 'user',
    name: ROUTES.USER,
    beforeEnter: authGuard,
    components: {
      default: () => import('@/views/UserView.vue'),
      top: () => import('@/components/layouts/NavBar.vue'),
      bottom: () => import('@/components/layouts/BottomNavbar.vue')
    }
  }
]

export default routes
