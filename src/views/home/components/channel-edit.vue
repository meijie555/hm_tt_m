<template>
  <!-- @closed="editing=false" 关闭屉式菜单  重置编辑状态为不编辑 -->
  <!-- @closed="editing=false" 关闭屉式菜单  重置编辑状态为不编辑 -->
  <van-action-sheet
    :value="value"
    @closed="editing=false"
    @input="$emit('input', $event)"
    title="编辑频道"
  >
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else size="mini" type="danger" @click="editing=false" plain>完成</van-button>
      </div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(item, i) in myChannels" :key="item.id">
          <span class="f12" :class="{red:activeIndex===i}" @click="enterChannel(i)">{{item.name}}</span>
          <van-icon v-if="editing && i!==0" class="btn" name="cross" @click="delChannel(i,item.id)"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in optionalChannels" :key="item.id">
          <span class="f12">{{item.name}}</span>
          <van-icon name="plus" class="btn" @click="addChannel(item)"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </van-action-sheet>
</template>

<script>
import { getAllChannels, delChannel, addChannel } from '@/api/channel'
export default {
  name: 'channel-edit',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    // 频道列表
    myChannels: {
      type: Array,
      default: () => []
    },
    // 激活的索引
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      editing: false,
      allChannels: []
    }
  },
  computed: {
    // 可选频道
    optionalChannels () {
      // 公式： 可选频道 = 全部频道 - 我的频道
      return this.allChannels.filter(
        item =>
          this.myChannels.findIndex(myItem => myItem.id === item.id) === -1
      )
    }
  },
  methods: {
    // 添加频道
    async addChannel ({ id, name }) {
      try {
      // 把接口需要的参数组织好
      // 后台的请求需要：[{id,seq},...] 不包含推荐  seq 序号是从1开始
      // 本地的添加需要：{id,name}  push即可
      // 结论：需要上面两种数据API才能完成两种状态的业务，把数据合并
      // 数据：[{id,name,seq},...]
      // 得到有排序的数组
        const orderChannels = this.myChannels.map((item, i) => {
          return {
            id: item.id,
            name: item.name,
            seq: i
          }
        })
        // 追加一项
        orderChannels.push({ id, name, seq: orderChannels.length })
        // 删除推荐
        orderChannels.splice(0, 1)
        // console.log(orderChannels)
        // 调用添加的API即可
        await addChannel(orderChannels)
        // 提示
        this.$toast.success('添加成功')
        // 组件中的 myChannels追加一项  组件渲染
        this.myChannels.push({
          id,
          name,
          articles: [],
          upLoading: false,
          downLoading: false,
          finished: false,
          timestamp: Date.now(),
          // 阅读位置
          scrollTop: 0
        })
      } catch (e) {
        this.$toast.fail('添加失败')
      }
    },
    // 删除频道
    async delChannel (index, channelId) {
      try {
        // 1. 调用API来删除频道数据
        await delChannel(channelId)
        // 2. 提示
        this.$toast.success('删除成功')
        // 3. 当删除的索引 小于等于 当前激活频道的索引  让激活索引前移一位
        if (index <= this.activeIndex) {
          this.$emit('update:activeIndex', this.activeIndex - 1)
        }
        // 4. 删除组件依赖的我的频道数据 myChannels 中的索引对应的频道即可
        // 4.1 props接收的数据特点是：只读（单向数据流）
        // 4.2 如果是简单数据类型的父传子，是一定不能修改的
        // 4.3 如果是复杂数据类型的父传子，在保证引用地址不变的情况下，允许修改（影响父组件）
        // 总结：对应数组和对象，可以修改其中的值，不能重新赋值。
        this.myChannels.splice(index, 1)
      } catch (e) {
        this.$toast.fail('删除失败')
      }
    },
    // 获取所有频道
    async getAllChannels () {
      const data = await getAllChannels()
      this.allChannels = data.channels
    },
    // 点击进入频道
    enterChannel (index) {
      // 关闭窗口
      this.$emit('input', false)
      // 传id给父组件
      // this.$emit('update', index)
      this.$emit('update:activeIndex', index)
    }
  },
  created () {
    this.getAllChannels()
  }
}
</script>

<style scoped lang='less'>
.van-popup--bottom {
  &.van-popup--round {
    border-radius: 0;
  }
}
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
.channel {
  padding: 10px;
  .tit {
    line-height: 3;
    .tip {
      font-size: 10px;
      color: #999;
    }
  }
  .van-button {
    float: right;
    margin-top: 7px;
  }
  .btn {
    position: absolute;
    bottom: 0;
    right: 0;
    background: #ddd;
    font-size: 12px;
    color: #fff;
  }
  .f12 {
    font-size: 12px;
    color: #555;
  }
  .red {
    color: red;
  }
}
</style>
