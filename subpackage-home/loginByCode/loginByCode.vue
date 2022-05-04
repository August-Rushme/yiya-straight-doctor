<template>
  <view class="code">
    <view class="haeder ml-3" style="margin-top: 100rpx;margin-bottom: 20rpx;">
      <view class="text-code font-weight" style="color: #4473d6;">请输入验证码</view>
      <view class="font-sm" style="color: #c6c6c8;">验证码已发至+86 {{ phone }}</view>
    </view>
    <view class="codeInput d-flex j-center mt-5">
      <u-code-input
        v-model="code"
        mode="line"
        :space="40"
        :maxlength="4"
        hairline
        color="#3c9cff"
        @finish="finish"
        @change="change"
      ></u-code-input>
    </view>
    <u-code
      ref="uCode"
      @change="codeChange"
      keep-running
      change-text="倒计时XS"
      @start="disabled = true"
      @end="disabled = false"
    ></u-code>
    <view
      ref="getCodeRef"
      class="getCode text-center border-radius-sm mx-3 mb-3"
      :style="{ 'background-color': getCodeBtnColor }"
      @click="handleLogin"
    >
      <text class="font-md" :style="{ color: getCodeColor }">下一步</text>
    </view>
    <view class="btn-next mx-3">
      <u-button type="primary" text="重新发送" @click="getCode" :disabled="disabled" :text="tips"></u-button>
    </view>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
export default {
  data() {
    return {
      phone: '',
      code: '',
      getCodeColor: '#bec0cc',
      getCodeBtnColor: '#e8eaf6',
      disabled: false,
      tips: ''
    };
  },
  onLoad(option) {
    console.log(option);
    this.phone = option.phone;
    this.getCode();
  },
  methods: {
    // 验证码输入完成
    change() {
      this.getCodeBtnColor = '#e8eaf6';
      this.getCodeColor = '#bec0cc';
    },
    finish(e) {
      this.code = e;
      this.getCodeBtnColor = '#4d81e6';
      this.getCodeColor = '#ffffff';
      console.log(this.code);
    },
    // 获取验证码
    async getCode() {
      if (this.$refs.uCode.canGetCode) {
        // 向后端请求验证码
        uni.showLoading({
          title: '正在获取验证码'
        });
        const data = await this.$http.post('/user/getCodeByPhone', { phone: this.phone });
        console.log(data);
        setTimeout(() => {
          uni.hideLoading();
          // 这里此提示会被this.start()方法中的提示覆盖
          uni.$u.toast('验证码已发送');
          // 通知验证码组件内部开始倒计时
          this.$refs.uCode.start();
        }, 500);
      } else {
        uni.$u.toast('倒计时结束后再发送');
      }
    },
    codeChange(text) {
      this.tips = text;
    },
    // 处理登录校验
    async handleLogin() {
      const res = await this.$http.post('/user/loginByPhone', { phone: this.phone, code: this.code });
      console.log(res);
      if (res.code == 500) {
        this.$refs.uToast.show({
          type: 'error',
          icon: false,
          message: '验证码错误',
          iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
        });
      } else {
        uni.$u.toast('登录成功');
        uni.setStorageSync('userInfo', res.data);
        uni.setStorageSync('token', res.token);
        uni.switchTab({
          url: '/pages/home/home'
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.text-code {
  font-size: 50rpx;
}
.getCode {
  margin-top: 60rpx;
  height: 80rpx;
  line-height: 80rpx;
}
</style>
