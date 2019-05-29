
const dev = {
  baseUrl: 'http://39.98.232.64:9091'
  // baseUrl: 'http://localhost:9091'
}
const prod = {
  baseUrl: 'http://47.111.12.191:9091'
}
const envConfig = process.env.NODE_ENV === 'development' ? dev : prod
export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: '职场司南',
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 3,
  /**
   * @description api请求基础路径
   */
  baseUrl: envConfig.baseUrl,
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home',

  port: 8081,
  /**
   * @description 需要加载的插件
   */
  plugin: {
    'error-store': {
      showInHeader: true, // 设为false后不会在顶部显示错误日志徽标
      developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
    }
  }

}
