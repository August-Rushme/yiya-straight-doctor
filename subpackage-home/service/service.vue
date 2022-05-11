<template>
  <view class="wrap">
    <view class="service-banner">
      <image class="" src="https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/yayiImage/service02.png"></image>
    </view>
    <divider></divider>
    <view class="contact mt-3">
      <block v-for="(item, index) in contact" :key="index">
        <view class="card-box mt-3">
          <view class="card-info py-2 d-flex" hover-class="cellhoverstyle" :hover-stay-time="200">
            <view class="phone py-2 mx-2"><img :src="item.url" alt="" style="height: 60rpx;width: 60rpx;" /></view>
            <view class=" d-flex j-sb a-center" style="flex: 1;">
              <view class="">
                <view class="" style="font-size: 30rpx;">{{ item.title }}</view>
                <view class="" style="color: #999;">{{ item.value }}</view>
              </view>
              <view class="font-lg pr-2" style="color: #969799;">></view>
            </view>
          </view>
        </view>
      </block>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      contact: [
        {
          url: 'https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/yayiImage/phone.png',
          title: '联系方式',
          value: '18976329982'
        },
        {
          url: 'https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/yayiImage/wx.png',
          title: '官方微信',
          value: '识别二维码,关注官方微信'
        },
        {
          url: 'https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/yayiImage/QQ%20%281%29.png',
          title: '官方QQ',
          value: '864011713、2435587095'
        }
      ]
    };
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.phone {
  height: 100rpx;
  width: 80rpx;
  border-right: 1px solid #d7d4d4;
}
.card-box {
  width: 100%;
  height: 140rpx;
  .card-info {
    margin: auto;
    width: 92%;
    height: 140rpx;
    background: #ffffff;
    box-shadow: 4px 4px 8px 2px rgba(190, 195, 199, 0.5);
    border-radius: 8rpx;
  }
  .cellhoverstyle {
    background-color: #f7f8f9;
  }
}
</style>
