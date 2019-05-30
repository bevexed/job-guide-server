import Main from '@/components/main'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/user',
    name: 'user',
    meta: {
      icon: 'md-person',
      title: '用户管理'
    },
    component: Main,
    children: [
      {
        path: 'user-list',
        name: 'user-list',
        meta: {
          title: '用户管理',
          icon: 'md-people'
        },
        component: () => import('@/view/user/user-list.vue')
      },
      {
        path: 'account-withdraw-list',
        name: 'account-withdraw-list',
        meta: {
          title: '用户提现管理',
          icon: 'md-cash'
        },
        component: () => import('@/view/user/account-withdraw-list.vue')
      }
    ]
  },
  {
    path: '/course',
    name: 'course',
    meta: {
      icon: 'md-menu',
      title: '课程管理'
    },
    component: Main,
    children: [
      {
        path: 'course-category-list',
        name: 'course-category-list',
        meta: {
          title: '课程类型管理',
          icon: 'logo-buffer'
        },
        component: () => import('@/view/course/course-category-list.vue')
      },
      {
        path: 'course_list',
        name: 'course_list',
        meta: {
          title: '课程管理',
          icon: 'md-videocam'
        },
        component: () => import('@/view/course/course-list.vue')
      }
    ]
  },
  {
    path: '/page',
    name: 'page',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'page-module-config-list',
        name: 'page-module-config-list',
        meta: {
          title: '网站页面配置',
          icon: 'md-construct'
        },
        component: () => import('@/view/page/page-module-config-list.vue')
      }
    ]
  },
  {
    path: '/order',
    name: 'order',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'order-list',
        name: 'order-list',
        meta: {
          title: '订单管理',
          icon: 'md-list'
        },
        component: () => import('@/view/order/order-list.vue')
      }
    ]
  },
  {
    path: '/vip/card',
    name: '/vip/card',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'vip-card-list',
        name: 'vip-card-list',
        meta: {
          title: '会员卡管理',
          icon: 'md-card'
        },
        component: () => import('@/view/vip-card/vip-card-list.vue')
      }
    ]
  },

  // 新增代码
  // 新增代码
  // 新增代码
  // 新增代码
  // 新增代码
  {
    path: '/dd/d',
    name: '/dd/d',
    meta: {
      icon: 'md-menu',
      title: '资讯管理'
    },
    component: Main,
    children: [
      {
        path: '0',
        name: '1',
        meta: {
          title: '招考政策',
          icon: 'logo-buffer',
        },
        component: () => import('@/view/new/1.vue')
      },
      {
        path: '1',
        name: '2',
        meta: {
          title: '高校动态',
          icon: 'md-videocam'
        },
        component: () => import('@/view/new/1.vue')

      },
      {
        path: '2',
        name: '3',
        meta: {
          title: '志愿指南',
          icon: 'md-videocam'
        },
        component: () => import('@/view/new/1.vue')
      },
      {
        path: '4',
        name: '4',
        meta: {
          title: '添加资讯',
          icon: 'md-videocam'
        },
        component: () => import('@/view/new/4.vue')
      }
    ]
  },

  {
    path: '/5',
    name: '5',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'ad',
        name: 'ad',
        meta: {
          title: '广告',
          icon: 'md-list'
        },
        component: () => import('@/view/new/ad.vue')
      }
    ]
  },


  {
    path: '/system/param',
    name: '/system/param',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'system-param-list',
        name: 'system-param-list',
        meta: {
          title: '参数配置',
          icon: 'md-cog'
        },
        component: () => import('@/view/system-param/system-param-setting.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
