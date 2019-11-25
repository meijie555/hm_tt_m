<template>
  <div class="page-user-chat">
    <van-nav-bar left-arrow @click-left="$router.back()" title="登录"></van-nav-bar>
    <van-cell-group>
      <van-field
        label="手机号"
        placeholder="请输入手机号"
        @blur="checkMobile"
        :error-message="errmsg.mobile"
        v-model="loginForm.mobile"
      />
      <van-field
        label="验证码"
        placeholder="请输入验证码"
        @blur="checkCode"
        :error-message="errmsg.code"
        v-model="loginForm.code"
      >
        <van-button slot="button" type="primary" size="mini" class="p5">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="btn_box">
      <van-button type="info" round block @click="login">登录</van-button>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  name: 'user-chat',
  data () {
    return {
      loginForm: {
        mobile: '',
        code: '246810'
      },
      errmsg: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    // 验证手机号信息
    checkMobile () {
      const value = this.loginForm.mobile
      // 手机号为空
      if (!value) {
        this.errmsg.mobile = '请输入手机号'
        return false
      }
      // 手机号格式错误
      if (!/^1[3-9]\d{9}$/.test(value)) {
        this.errmsg.mobile = '手机号格式错误'
        return false
      }
      // 正确
      this.errmsg.mobile = ''
    },
    // 验证校验码
    checkCode () {
      const value = this.loginForm.code
      // 校验码为空
      if (!value) {
        this.errmsg.code = '请输入验证码'
        return false
      }
      // 校验码格式错误
      if (!/^\d{6}$/.test(value)) {
        this.errmsg.code = '验证码格式错误'
        return false
      }
      // 校验码正确
      this.errmsg.code = ''
    },
    // 登录校验
    async login () {
      // 执行单个校验函数
      this.checkMobile()
      this.checkCode()
      // 判断是否有错误信息
      if (this.errmsg.mobile || this.errmsg.code) {
        return false
      }
      try {
        // 发请求
        const data = await login(this.loginForm)
        // console.log(data)
        // 更新vuex和本地存储的token相关的数据
        this.setUser(data)
        //  回跳 （地址栏有回跳地址，根据地址跳转，如果没有，默认个人中心）
        this.$router.push(this.$route.query.redirectUrl || '/user')
      } catch (e) {
        // console.log(e)
        this.$toast.fail('手机号或验证码错误')
      }
    },
    ...mapMutations(['setUser'])
  }
}
</script>

<style scoped lang='less'>
.p5 {
  padding: 0 5px;
}
.btn_box {
  padding: 10px;
  .van-button {
    height: 32px;
    line-height: 30px;
  }
}
</style>
