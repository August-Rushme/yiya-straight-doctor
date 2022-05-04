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
              <view class="label">状态:</view>
              <u-tag text="预约中" v-if="item.status === 0"></u-tag>
              <u-tag text="进行中" type="warning" v-if="item.status === 1"></u-tag>
              <u-tag text="已完成" type="success" v-if="item.status === 2"></u-tag>
            </view>
            <view class="name d-flex j-sb a-center border-bottom pb-1 mt-2 pr-2">
              <view class="label">姓名:</view>
              <text class="font-weight">{{ item.name }}</text>
            </view>
            <view class="name d-flex j-sb a-center border-bottom pb-1 mt-2 pr-2">
              <view class="label">性别:</view>
              <text>{{ item.gender }}</text>
            </view>
            <view class="name d-flex j-sb a-center border-bottom pb-1 mt-2 pr-2">
              <view class="label">出生日期:</view>
              <text>{{ item.birthday }}</text>
            </view>
            <view class="name d-flex j-sb a-center border-bottom pb-1 mt-2 pr-2">
              <view class="label">手机号:</view>
              <text>{{ item.phone }}</text>
            </view>
            <view class="name d-flex j-sb a-center border-bottom pb-1 mt-2 pr-2">
              <view class="label">预约项目:</view>
              <text>{{ item.project }}</text>
            </view>
            <view class="name d-flex j-sb a-center border-bottom pb-1 mt-2 pr-2">
              <view class="label">预约时间:</view>
              <text>{{ item.appointmentTime }}</text>
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
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        userId: uni.getStorageSync('userInfo').id
      }
    };
  },

  onShow() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.post('/order/getAllOrder', this.pageInfo);
      this.orderList = res.list;
    }
  }
};
</script>

<style></style>
