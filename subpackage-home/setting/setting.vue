<template>
  <view class="wrap">
    <divider></divider>
    <u-cell-group :border="false">
      <u-cell title="通用" @click="navTo('/subpackage-home/currency/currency')" :isLink="true"></u-cell>
      <divider></divider>
      <u-cell title="版本更新" @click="openSettings" :isLink="true"></u-cell>
      <u-cell title="隐私政策" @click="navTo('')" :isLink="true"></u-cell>
      <u-cell title="用户协议" @click="navTo('')" :isLink="true"></u-cell>
    </u-cell-group>
    <divider></divider>
    <view class="mt-3"><u-button class="sign-out" @click="logout" :hair-line="false">退出登录</u-button></view>
  </view>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    navTo(url) {
      uni.navigateTo({
        url: url
      });
    },
    openSettings() {
      // #ifdef APP-PLUS
      uni.getSystemInfo({
        success(res) {
          if (res.platform == 'ios') {
            plus.runtime.openURL('app-settings://');
          } else if (res.platform == 'android') {
            var main = plus.android.runtimeMainActivity();
            var Intent = plus.android.importClass('android.content.Intent');
            var mIntent = new Intent('android.settings.SOUND_SETTINGS');
            main.startActivity(mIntent);
          }
        }
      });
      // #endif
      // #ifndef APP-PLUS
      this.$u.toast('小程序端或H5端已是最新版，无需检查更新！');
      // #endif
    },
    logout() {
      this.$u.api.logout().then(res => {
        this.$u.toast(res.msg);
        if (res.code == '200') {
          let self = this;
          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/sys/login/index'
            });
          }, 500);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
// page {
//   background-color: #f5f5f5;
// // }
// body {
//   background-color: #f5f5f5;
// }
// /deep/ .u-cell-title {
// }
</style>
