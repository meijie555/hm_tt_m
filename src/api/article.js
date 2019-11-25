import request from '@/utils/request'

/**
 * 获取文章列表
 * @param {Integer} channelId
 * @param {String} timestamp
 */
export const getArticle = (channelId, timestamp) => {
  return request('app/v1_1/articles', 'get', {
    channel_id: channelId,
    // 时间戳
    timestamp,
    // 置顶
    with_top: 1
  })
}

/**
 * 更多操作-对文章不感兴趣
 * @param {String} articleId
 */
export const disLike = (articleId) => {
  return request('app/v1_0/article/dislikes', 'post', {
    target: articleId
  })
}

/**
 * 举报文章
 * @param {String} articleId  文章id
 * @param {Integer} type  举报类型
 */
export const report = (articleId, type) => {
  return request('app/v1_0/article/reports', 'post', { target: articleId, type })
}
