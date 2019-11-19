import request from '@/utils/request'
export const getArticle = (channelId, timestamp) => {
  return request('app/v1_1/articles', 'get', {
    channel_id: channelId,
    // 时间戳
    timestamp,
    // 置顶
    with_top: 1
  })
}
