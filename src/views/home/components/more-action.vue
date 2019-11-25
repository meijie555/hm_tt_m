<template>
  <!-- popup组件 弹出层 -->
  <van-popup :value="value" @input="$emit('input',$event)" @open="isReport=false">
    <van-cell-group v-if="!isReport">
      <van-cell @click="disLikes">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <van-cell v-for="item of reports " :key="item.value" @click="report(item.value)">{{item.label}}</van-cell>
    </van-cell-group>
  </van-popup>
</template>

<script>
import { disLike, report } from '@/api/article'
import { reports } from '@/api/constants'
export default {
  name: 'more-action',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    articleId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      // 不感兴趣
      isReport: false,
      // 举报文章
      reports
    }
  },
  methods: {
    // 不感兴趣
    async disLikes () {
      try {
        await disLike(this.articleId)
        // 提示
        this.$toast({ type: 'success', message: '操作成功' })
        // 关闭
        this.$emit('input', false)
        // 删除文章
        this.$emit('on-dislike')
      } catch (e) {
        this.$toast({ type: 'fail', message: '操作失败' })
      }
    },
    // 举报文章
    async report (type) {
      try {
        await report(this.articleId, type)
        // console.log(date)
        // 提示
        this.$toast.success('举报成功')
        // 关闭对话框
        this.$emit('input', false)
        // 删除文章
        this.$emit('on-report')
      } catch (e) {
        // 情况一：已经举报过不能再举报
        // 情况二：出错
        if (e.response.status === 409) {
          return this.$toast({ message: '已举报过' })
        } else {
          this.$toast.fail('举报失败')
        }
      }
    }
  }
}
</script>

<style scoped lang='less'>
.van-popup {
  width: 80%;
  border-radius: 4px;
}
</style>
