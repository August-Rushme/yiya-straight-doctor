<template>
  <view class="content">
    <view class=" mt-2">
      <view class="navB">
        <text class="font-weight ml-3 ">我的申请</text>
        <view class="nav row a-center mt-1">
          <view class="navItem span-5" @click="viewApply(3)">
            <p>
              <image
                src="https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/yayiImage/img/%E5%85%A8%E9%83%A8%E8%AE%A2%E5%8D%95.png"
                style="height: 60rpx;width: 60rpx;"
                mode=""
              ></image>
            </p>
            <p>全部</p>
          </view>
          <view class="navItem span-5" @click="viewApply(0)">
            <p>
              <image
                src="https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/yayiImage/img/%E9%A2%84%E7%BA%A6%E8%AE%A2%E5%8D%95.png"
                style="height: 60rpx;width: 60rpx;"
                mode=""
              ></image>
            </p>
            <p>申请中</p>
          </view>
          <view class="navItem span-5" @click="viewApply(1)">
            <p>
              <image
                src="https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/yayiImage/img/%E8%A2%AB%E9%A9%B3%E5%9B%9E.png"
                style="height: 60rpx;width: 60rpx;"
                mode=""
              ></image>
            </p>
            <p>被驳回</p>
          </view>
          <view class="navItem span-5" @click="viewApply(2)">
            <p>
              <image
                src="https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/yayiImage/img/%E5%B7%B2%E5%AE%8C%E6%88%90-%E8%AE%A2%E5%8D%95.png"
                style="height: 60rpx;width: 60rpx;"
                mode=""
              ></image>
            </p>
            <p>已通过</p>
          </view>
        </view>
      </view>
    </view>
    <divider></divider>

    <block v-for="(item, index) in clinicList" :key="index">
      <view class="goodsInfo d-flex flex-row m-2 a-center" @tap="goDetail">
        <u-image :showLoading="true" :src="item.img" width="70px" height="70px"></u-image>
        <view class="infoText flex-column mx-2">
          <text class="font-weight font-md">{{ item.name }}</text>
          <u-rate count="5" v-model="item.rate" readonly allowHalf="true"></u-rate>
          <text>{{ item.detailedAddress }}</text>
          <view class="flex-row j-center a-center "></view>
          <block v-for="(item2, index2) in item.newScope" :key="index2">
            <text style="border: #F0AD4E solid 1px; color: #E45656;" class="px-1 mr-1">{{ item2 }}</text>
          </block>
        </view>
      </view>
      <divider></divider>
    </block>
  </view>
</template>

<script>
export default {
  data() {
    return {
      clinicList: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  onShow() {
    this.getClinicList();
  },
  methods: {
    // 获取诊所列表
    async getClinicList() {
      const { data: res } = await this.$http.post('/doctor/getClinicList', this.pageInfo);
      this.clinicList = res.list;
    },
    // 查看申请
    viewApply(type) {
      uni.$u.route('/subpackage-home/clinic-application/clinic-application', {
        status: type
      });
    },
    goDetail() {
      console.log(111);
    }
  }
};
</script>

<style scoped lang="scss">
.span-5 {
  p {
    text-align: center;
  }
}
.py-1 {
  margin-top: 20px;
}
</style>
