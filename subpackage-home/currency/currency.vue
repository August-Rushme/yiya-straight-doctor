<template>
  <view class="wrap">
    <view class="">
      <view class="" style="background-color: #f8f8f8; font-size: 30rpx; padding: 15rpx 32rpx 15rpx 30rpx;">
        <text class="text-left">消息提醒</text>
      </view>
      <u-cell-group :border="false">
        <u-cell title="接受消息提醒" :arrow="false">
          <u-switch v-model="message" slot="right-icon" class="u-m-l-20"></u-switch>
        </u-cell>
        <u-cell title="通知栏显示消息详情" :arrow="false">
          <u-switch v-model="messageBar" slot="right-icon" class="u-m-l-20"></u-switch>
          <text slot="label" class="mt-1 mr-1" style="font-size: 26rpx;color: #999999;">
            关闭后，当收到消息的时候，只显示有提示，不显示消息内容。
          </text>
        </u-cell>
      </u-cell-group>
    </view>
    <view class="">
      <view class="" style="background-color: #f8f8f8; font-size: 30rpx; padding: 15rpx 32rpx 15rpx 30rpx;">
        <text class="text-left">声音与振动</text>
      </view>
      <u-cell-group :border="false">
        <u-cell title="收到消息后播放声音或振动">
          <u-switch v-model="upgrade" slot="right-icon" class="u-m-l-20"></u-switch>
          <text slot="label" class="mt-1" style="font-size: 26rpx;color: #999999;">前往系统设置中，修改声音与振动</text>
        </u-cell>
      </u-cell-group>
    </view>
    <view class="">
      <view class="" style="background-color: #f8f8f8; font-size: 30rpx; padding: 15rpx 32rpx 15rpx 30rpx;">
        <text class="text-left">软件更新提醒</text>
      </view>
      <u-cell-group :border="false">
        <u-cell title="软件更新提醒" :arrow="false" :isLink="true" @click="openSettings">
          <text slot="label" class="mt-1" style="font-size: 26rpx;color: #999999;">
            当本软件有新版本发布时，给予提醒
          </text>
        </u-cell>
      </u-cell-group>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      message: true,
      messageBar: true,
      upgrade: true
    };
  },
  methods: {
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
<style lang="scss">
// page {
//   background-color: #f8f8f8;
// }

/deep/ .u-cell-title {
  padding: 25rpx 30rpx;
  font-size: 30rpx;
}
</style>
