import request from '@/utils/request'
/**
 * 获取我的频道信息（如果没登录，获取的是后台设置的默认频道列表）
 */
export const getMyChannel = () => {
  return request('/app/v1_0/user/channels', 'get')
}

/**
 * 获取全部频道
 */
export const getAllChannels = () => {
  return request('app/v1_0/channels', 'get')
}
