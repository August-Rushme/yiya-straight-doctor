<template>
  <view class="a">
    <!-- 顶部登录 -->
  <!--  <view class=" " @click="handleApplyDetail">aaaa</view> -->
    <view class="top-background  d-flex j-center">
      <view class="my-card d-flex j-sb a-center px-4">
        <view class="userInfo d-flex">
          <u-avatar :src="avatar" size="50"></u-avatar>
          <view class="username ml-1 pt-1">
            <text class="line-h0 font-md font-weight">{{ username }}</text>
            <view class="" @click="goSetInfo">未认证用户 ></view>
          </view>
        </view>
        <template v-if="!token">
          <view class="toLogin" @click="gotoLogin">去登录</view>
        </template>
      </view>
    </view>
    <!-- 分割线 -->
    <view class="divider"></view>
    <view class="navB">
      <text class="font-weight ml-3 ">我的订单</text>
      <view class="nav row a-center mt-2">
        <view class="navItem span-5" @click="goToAll">
          <p>
            <image
              src="https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/yayiImage/img/%E5%85%A8%E9%83%A8%E8%AE%A2%E5%8D%95.png"
              style="height: 60rpx;width: 60rpx;"
              mode=""
            ></image>
          </p>
          <p>全部</p>
        </view>
        <view class="navItem span-5" @click="goToYu">
          <p>
            <image
              src="https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/yayiImage/img/%E9%A2%84%E7%BA%A6%E8%AE%A2%E5%8D%95.png"
              style="height: 60rpx;width: 60rpx;"
              mode=""
            ></image>
          </p>
          <p>预约</p>
        </view>
        <view class="navItem span-5" @click="goToIng">
          <p>
            <image
              src="https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/yayiImage/img/%E8%BF%9B%E8%A1%8C%E4%B8%AD%E8%AE%A2%E5%8D%95.png"
              style="height: 60rpx;width: 60rpx;"
              mode=""
            ></image>
          </p>
          <p>进行中</p>
        </view>
        <view class="navItem span-5" @click="goToFinish">
          <p>
            <image
              src="https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/yayiImage/img/%E5%B7%B2%E5%AE%8C%E6%88%90-%E8%AE%A2%E5%8D%95.png"
              style="height: 60rpx;width: 60rpx;"
              mode=""
            ></image>
          </p>
          <p>已完成</p>
        </view>
      </view>
    </view>
    <divider></divider>
    <!-- 其他导航 -->
    <view class="other-nav">
      <block v-for="item in otherNav" :key="item.name">
        <view class="navItem d-flex j-sb a-center border-bottom  py-2 px-3" @click="goToPage(item.pageName)">
          <view class="itemname d-flex">
            <image :src="item.src" mode="" style="width: 48rpx;height: 48rpx;"></image>
            <text class="ml-2">{{ item.name }}</text>
          </view>
          <view class="arrow font-md">></view>
        </view>
      </block>
    </view>
  </view>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      token: '',
      otherNav: [
        {
          name: '门店入驻',
          src: 'https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/yayiImage/img/Settled.png',
          pageName: 'hospitalized'
        },
        {
          name: '钱包',
          src: 'https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/yayiImage/img/wallet.png',
          pageName: 'wallet'
        },
        {
          name: '资质管理',
          src: 'https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/yayiImage/img/qualifications.png',
          pageName: 'management'
        },
        {
          name: '客服',
          src: 'https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/yayiImage/img/server.png',
          pageName: 'service'
        },
        {
          name: '问诊模板',
          src: 'https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/yayiImage/img/Consultation.png',
          pageName: 'template'
        },
        {
          name: '系统设置',
          src: 'https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/yayiImage/img/setInfo.png',
          pageName: 'setting'
        },
      ]
    };
  },
  onLoad() {
    this.token = uni.getStorageSync('token');
  },
  onShow() {
    this.token = uni.getStorageSync('token');
  },
  methods: {
    goAttestation() {
      uni.$u.route('/subpackage-home/entry-attestation/entry-attestation');
    },
    goToAll() {
      uni.$u.route('/subpackage-home/orderAll/orderAll');
    },
    goToYu() {
      uni.$u.route('/subpackage-home/orderYu/orderYu');
    },
    goToIng() {
      uni.$u.route('/subpackage-home/orderIng/orderIng');
    },
    goToFinish() {
      uni.$u.route('/subpackage-home/orderFinish/orderFinish');
    },
    // 登录
    gotoLogin() {
      uni.navigateTo({
        url: '/subpackage-home/login/login'
      });
    },
    handleApplyDetail() {
      uni.$u.route('/subpackage-home/applyDetail/applyDetail', {
        status: this.status
      });
    },
    // 设置个人信息
    goSetInfo() {
      if (this.token) {
        uni.navigateTo({
          url: '/subpackage-home/setInfo/setInfo'
        });
      } else {
        uni.navigateTo({
          url: '/subpackage-home/login/login'
        });
      }
    },
    //底部导航跳转
    goToPage(pageName) {
      if (1) {
        const pagePath = '/subpackage-home/' + pageName + '/' + pageName;
        uni.navigateTo({
          url: pagePath
        });
      } else {
        uni.navigateTo({
          url: '/subpackage-my/login/login'
        });
      }
    }
  },
  created() {}
};
</script>
<style lang="less" scoped>
.top-background {
  width: 750rpx;
  height: 150rpx;
  background: linear-gradient(to bottom, #55a2ef 20%, #1b7bf7);
}
.my-card {
  position: absolute;
  width: 700rpx;
  height: 150rpx;
  margin-top: 75rpx;
  background: #ffffff;
  border-radius: 15rpx;
}
.divider {
  width: 750upx;
  height: 100rpx;
  background-color: #f5f5f5;
}
.toLogin {
  width: 200rpx;
  height: 60rpx;
  border-radius: 30rpx;
  line-height: 60rpx;
  text-align: center;
  color: white;
  background: linear-gradient(to right, #55a2ef, #2884f5);
}

.span-5 {
  p {
    text-align: center;
  }
}
.py-1 {
  margin-top: 20px;
}
</style>
