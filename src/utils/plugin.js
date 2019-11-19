import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
dayjs.extend(relativeTime)

// 延时加载
const $sleep = () => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve()
    }, 1000)
  })
}
// 相对时间处理
const relTime = (time) => {
  // 依赖一个dayjs的插件 RelativeTime
  // dayjs() 获取当前时间
  // .from(time) 获取相对时间
  // 语言本地化 local
  return dayjs().locale('zh-cn').from(time)
}

export default {
  install (Vue) {
    Vue.prototype.$sleep = $sleep
    Vue.filter('relTime', relTime)
  }
}
