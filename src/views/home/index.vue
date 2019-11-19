<template>
  <div class="container">
    <!-- swipeable 是否开启手势滑动切换 -->
    <van-tabs swipeable v-model="activeIndex">
      <!-- 频道 -->
      <van-tab :title="item.name" v-for="item of myChannels" :key="item.id">
        <div class="scroll-wrapper">
          <van-cell-group>
            <van-pull-refresh
              v-model="activeChannel.downLoading"
              @refresh="onRefresh"
              :success-text="refreshSuccessText"
            >
              <!-- 上拉加载 -->
              <van-list
                v-model="activeChannel.upLoading"
                :finished="activeChannel.finished"
                finished-text="没有更多了"
                @load="onload"
              >
                <van-cell v-for="article of activeChannel.articles" :key="article.id">
                  <div class="article_item">
                    <!-- van-ellipsis  vant内置的样式 当文本内容长度超过容器最大宽度时，自动省略多余的文本 -->
                    <h3 class="van-ellipsis">{{article.title}}</h3>
                    <!-- 三张图 -->
                    <div class="img_box" v-if="article.cover.type===3">
                      <van-image class="w33" fit="cover" :src="article.cover.images[0]" />
                      <van-image class="w33" fit="cover" :src="article.cover.images[1]" />
                      <van-image class="w33" fit="cover" :src="article.cover.images[2]" />
                    </div>
                    <!-- 一张图 -->
                    <div class="img_box" v-if="article.cover.type===1">
                      <van-image class="w100" fit="cover" :src="article.cover.images[0]" />
                    </div>
                    <div class="info_box">
                      <span>{{article.aut_name}}</span>
                      <span>{{article.comm_count}}评论</span>
                      <span>{{article.pubdate | relTime}}</span>
                      <span class="close">
                        <van-icon name="cross"></van-icon>
                      </span>
                    </div>
                  </div>
                </van-cell>
              </van-list>
            </van-pull-refresh>
          </van-cell-group>
        </div>
      </van-tab>
    </van-tabs>
    <span class="bar_btn" slot="nav-right">
      <van-icon name="wap-nav"></van-icon>
    </span>
  </div>
</template>

<script>
import { getMyChannel } from '@/api/channel'
import { getArticle } from '@/api/article'
export default {
  name: 'home-index',
  data () {
    return {
      // 上拉加载中
      upLoading: false,
      // 是否全部加载完成
      finished: false,
      // 文章列表
      articles: [],
      // 是否是刷新状态
      downLoading: false,
      // 刷新完成的提示  文案（暂无更新|更新成功）
      refreshSuccessText: '',
      // 我的频道列表(推荐频道默认拥有第一个频道)
      myChannels: [],
      // 激活的频道索引
      activeIndex: 0
    }
  },
  computed: {
    activeChannel () {
      return this.myChannels[this.activeIndex]
    }
  },
  methods: {
    // 上拉加载
    async onload () {
      // @load 事件触发时机：当滚动到列表的最下方触发
      // @load 组件初始化的时候默认触发一次 获取第一次数据
      // @load 加载一次数据后渲染列表，当渲染后列表高度不足一屏，自动触发事件加载数据。
      // window.setTimeout(() => {
      //   const data = []
      //   for (let i = this.articles.length; i < this.articles.length + 10; i++) {
      //     data.push(i + 1)
      //   }
      //   //  结束加载效果
      //   this.upLoading = false
      //   // 渲染列表
      //   this.articles.push(...data)
      //   // 判断所有数据是否加载完毕
      //   if (this.articles.length >= 50) {
      //     this.finished = true
      //   }
      // }, 1000)
      const data = await getArticle(
        this.activeChannel.id,
        this.activeChannel.timestamp
      )
      // 获取数据
      this.activeChannel.articles.push(...data.results)
      // 结束上拉加载效果
      this.activeChannel.upLoading = false
      // 判断数据是否全部加载完
      if (!data.pre_timestamp) {
        // 数据全部加载完
        this.activeChannel.finished = true
      } else {
        // 还有数据 把后端返回的时间戳 记录下来  下次请求需要使用
        this.activeChannel.timestamp = data.pre_timestamp
      }
    },
    // 下拉更新
    async onRefresh () {
      // // 手指离开时触发
      // window.setTimeout(() => {
      //   // 获取数据
      //   const data = [1, 2, 3, 4, 5]
      //   // 刷新结束
      //   this.downLoading = false
      //   // 两种情况
      //   if (data.length) {
      //     // 有数据 渲染页面 替换数据
      //     this.articles = data
      //     // 提示成功
      //     this.refreshSuccessText = '更新成功'
      //     // 主动加载下一屏数据 (防止不足一屏内容)
      //     this.onload()
      //     // 重置
      //     this.finished = false
      //   } else {
      //     // 没有数据
      //     this.refreshSuccessText = '暂无更新'
      //   }
      // }, 1000)

      // 获取最新时间
      this.activeChannel.timestamp = Date.now()
      const data = await getArticle(
        this.activeChannel.id,
        this.activeChannel.timestamp
      )
      // 刷新结束
      this.activeChannel.downLoading = false
      // 判断数据情况
      if (data.results.length) {
        // 有数据 渲染页面 替换数据
        this.activeChannel.articles = data.results
        // 提示成功
        this.refreshSuccessText = '更新成功'
        // 加上时间戳 加载下一页数据
        this.activeChannel.timestamp = data.pre_timestamp
        // 重置
        this.activeChannel.finished = false
        // 主动加载下一屏数据 (防止不足一屏内容)
        this.onload()
      } else {
        // 加载没有数据的文案
        this.refreshSuccessText = '暂无更新'
      }
    },
    // 获取频道数据
    async getMyChannels () {
      const data = await getMyChannel()
      this.myChannels = data.channels.map(item => {
        // 目前 myChannels： 频道id  频道名称
        // 扩展 myChannels： 频道id  频道名称  +文章列表 +加载中 +刷新中 +是否全部加载 +时间戳
        return {
          id: item.id,
          name: item.name,
          articles: [],
          upLoading: false,
          downLoading: false,
          finished: false,
          timestamp: Date.now()
        }
      })
    }
  },
  created () {
    this.getMyChannels()
  }
}
</script>

<style scoped lang='less'>
// van-tabs__wrap 整个tab频道栏
// van-tab 每个频道单元格
// van-tabs__line  下划线 样式
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
