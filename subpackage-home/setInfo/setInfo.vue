<template>
  <view class="wrap">
    <view class="list-cell">
      <image
        class="user-images"
        src="https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/yayiImage/doctor-man.png"
        style="width: 100rpx;height: 100rpx; border-radius: 50%;"
      ></image>
      <view class="user-name">
        <span>李满元</span>
        <br />
        <span class="user-other">用户编号：8888 8888</span>
      </view>
    </view>
    <divider></divider>
    <u-cell-group :border="false">
      <u-cell title="诊所" value="海南清河口腔" icon="home" :title-width="180" :arrow="false"></u-cell>
      <u-cell title="年龄" value="38岁" icon="account" :title-width="180" :arrow="false"></u-cell>
      <u-cell title="性别" value="男" icon="man" :title-width="180" :arrow="false"></u-cell>
      <u-cell title="手机" class="connect" value="18976329982" icon="phone" :title-width="180" :arrow="false"></u-cell>
      <u-cell
        title="邮箱"
        class="connect"
        value="864011713@qq.com"
        icon="email"
        :title-width="180"
        :arrow="false"
      ></u-cell>
      <divider></divider>
    </u-cell-group>
    <view class="mx-2 mt-5">
      <u-button type="primary" text="修改个人信息" @click="navTo('/subpackage-home/modifyInfo/modifyInfo')"></u-button>
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
      uni.$u.route({
        type: 'redirect',
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
