<template>
  <view class="wrap">
    <view class="list-cell">
      <image
        class="user-images"
        src="https://thirdwx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEJsAibhKl94xrSQVNECeRk35s4AZB5wk6U9SwmQPzRTnCuEwiaRjCsA1BBwwKic2jtO9PCUG9icFqznjQ/132"
        style="width: 100rpx;height: 100rpx; border-radius: 50%;"
      ></image>
      <view class="user-name">
        <span>August</span>
        <br />
        <span class="user-other">用户编号：8888 8888</span>
      </view>
    </view>
    <divider></divider>
    <u-cell-group :border="false">
      <u-cell title="诊所" value="海南清河口腔" icon="home" :title-width="180" :arrow="false"></u-cell>
      <u-cell title="年龄" value="32岁" icon="account" :title-width="180" :arrow="false"></u-cell>
      <u-cell title="性别" value="男" icon="man" :title-width="180" :arrow="false"></u-cell>
      <u-cell title="手机" class="connect" value="13898987878" icon="phone" :title-width="180" :arrow="false"></u-cell>
      <u-cell
        title="邮箱"
        class="connect"
        value="upugpbvrtge@188.com"
        icon="email"
        :title-width="180"
        :arrow="false"
      ></u-cell>
      <divider></divider>
    </u-cell-group>
    <view class="mx-2 mt-5">
      <u-button type="primary" text="修改个人信息"></u-button>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {};
  },
  onLoad() {},
  methods: {
    navTo(url) {
      uni.navigateTo({
        url: url
      });
    }
  }
};
</script>
<style lang="scss" scoped>
page {
  background-color: #f5f5f5;
}
.list-cell {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding: 10px 24rpx;
  overflow: hidden;
  color: #323233;
  font-size: 14px;
  line-height: 24px;
  background-color: #fff;
  align-items: center;
}
.user-images {
  width: 80rpx;
  height: 80rpx;
  margin-right: 10px;
}
.user-name {
  font-size: 32rpx;
  color: #000000;
  span {
  }
  .user-other {
    font-size: 26rpx;
    color: #999999;
    font-weight: normal;
  }
}
</style>
