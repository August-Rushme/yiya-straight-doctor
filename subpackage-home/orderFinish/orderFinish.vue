<template>
  <view>
    <u-empty
      v-if="orderList.length == 0"
      mode="order"
      icon="http://cdn.uviewui.com/uview/empty/order.png"
      text="您还没有相关订单"
    ></u-empty>
    <view class="content" v-if="orderList.length > 0">
      <block v-for="(item, index) in orderList" :key="index">
        <uni-card>
          <view class="contentAppointment">
            <view class="name d-flex j-sb a-center border-bottom pb-1 mt-2 pr-2">
              <view class="info d-flex j-start">
                <text class=" mr-2" style="color: #333333;">{{ item.name }}</text>
                <text style="color: #333333;">{{ item.gender }}</text>
              </view>
              <view class="tag d-flex j-end">
                <u-tag text="预约中" v-if="item.status === 0"></u-tag>
                <u-tag text="进行中" type="warning" v-if="item.status === 1"></u-tag>
                <u-tag text="已完成" type="success" v-if="item.status === 2"></u-tag>
              </view>
            </view>
            <view class="name d-flex j-sb a-center pb-1 mt-1 pr-2">
              <view class="label">出生日期:</view>
              <text>{{ item.birthday }}</text>
            </view>
            <view class="name d-flex j-sb a-center pb-1 mt-1 pr-2">
              <view class="label">手机号:</view>
              <text>{{ item.phone }}</text>
            </view>
            <view class="name d-flex j-sb a-center pb-1 mt-1 pr-2">
              <view class="label">预约项目:</view>
              <text>{{ item.project }}</text>
            </view>
            <view class="name d-flex j-sb a-center pb-1 mt-1 pr-2">
              <view class="label">预约时间:</view>
              <text>{{ item.appointmentTime }}</text>
            </view>
            <view class="name d-flex j-sb a-center pb-1 mt-1 pr-2 border-bottom">
              <view class="label">单号:</view>
              <view class="d-flex">
                <text class="mr-2 d-flex font-md a-center ">{{ item.orderNumber }}</text>
                <view
                  class="copyBtn border a-center pl-1"
                  hover-class="cellhover"
                  style="width: 80rpx;height: 50rpx; border-radius:10rpx;padding-top: 5rpx;"
                  :hover-stay-time="200"
                  @click="copyOrderNumber(item.orderNumber)"
                >
                  <text class="" style="color: #666;">复制</text>
                </view>
              </view>
            </view>
            <view class="name d-flex j-sb a-center border-bottom pb-1 mt-2 pr-2">
              <view class="info d-flex j-start">
                <text class=" mr-2" style="color: #333333;">{{ doctor }}</text>
                <text style="color: #333333;">{{ clinic }}</text>
              </view>
              <view class="tag d-flex j-end">
                <u-tag text="已付款" type="success" shape="circle" v-if="item.status === 2"></u-tag>
                <u-tag text="待付款" type="error" shape="circle" v-if="item.status === 1"></u-tag>
              </view>
            </view>
          </view>
        </uni-card>
      </block>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orderList: [],
      userInfo: '',
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        userId: '',
        status: 2
      },
      doctor: '',
      clinic: ''
    };
  },

  onShow() {
    this.userInfo = uni.getStorageSync('userInfo');
    this.pageInfo.userId = this.userInfo.id;
    this.doctor = this.userInfo.name;
    this.clinic = this.userInfo.doctor.clinicName;
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.post('/order/getOrderByStatus', this.pageInfo);
      this.orderList = res.list;
    },
    // 复制单号
    copyOrderNumber(orderNumber) {
      uni.setClipboardData({
        data: orderNumber.toString(),
        success: function() {
          uni.$u.toast('复制成功');
          console.log('success');
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.copyBtn {
  background-color: #f8f8f8;
}
.cellhover {
  background-color: #dedede;
}
</style>
