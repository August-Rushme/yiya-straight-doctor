<template>
  <view class="my">
    <!-- 顶部栏 -->
    <view class="top-background  d-flex ">
      <view class="user_img position-absolute ">
        <u--image
          v-if="patientDetail.gender === '男'"
          src="https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/man.png"
          width="70"
          height="70"
          shape="circle"
        ></u--image>
        <u--image
          v-if="patientDetail.gender === '女'"
          src="https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/woman.png"
          width="70"
          height="70"
          shape="circle"
        ></u--image>
      </view>
      <view class="mt-4 ml-3">
        <view class="userInfo" style="width: 500rpx;">
          <view class="d-flex j-sb userInfo-row1">
            <view class=" d-flex j-start">
              <text class="mr-2 font-color">{{ patientDetail.gender }}</text>
              <text class="font-color">{{ patientDetail.age }}</text>
            </view>
            <view class="d-flex j-end">
              <view class="label mr-2 font-color">病历号:</view>
              <view class="font-color">{{ patientDetail.id }}</view>
            </view>
          </view>
          <view class="d-flex userInfo-row2 j-sb mt-2">
            <view class=" a-center pr-5" style="border-right: 2px solid #2586fe;">
              <text class="mr-2 font-color font-weight font-md">{{ patientDetail.userName }}</text>
              <view class="font-color ml-1" style="font-size: 18rpx;">患者</view>
            </view>
            <view class="a-center pr-5" style="border-right: 2px solid #2586fe;">
              <view class="label mr-2 font-color font-weight font-md" v-if="patientDetail.stage == '第一阶段'">
                1次
              </view>
              <view class="label mr-2 font-color font-weight font-md" v-if="patientDetail.stage == '第二阶段'">
                2次
              </view>
              <view class="label mr-2 font-color font-weight font-md" v-if="patientDetail.stage == '第三阶段'">
                3次
              </view>
              <view class="font-color ml-1" style="font-size: 18rpx;">就诊</view>
            </view>
            <view class="a-center ">
              <view class="label mr-2 font-color font-weight font-md">{{ patientDetail.doctor }}</view>
              <view class="font-color ml-2" style="font-size: 18rpx;">医生</view>
            </view>
          </view>
        </view>
      </view>

      <view class="my-card d-flex j-sb a-center px-4">
        <view class="consumption">
          <view class="d-flex">
            <view class="d-flex j-start mr-5 line-h">
              <text class="mr-1">累计消费:</text>
              <view class="font-md font-weight" style="color: #00cc9a;">33333.00 元</view>
            </view>
            <view class="d-flex j-end line-h">
              <text class="mr-1">欠费:</text>
              <view class="font-md font-weight" style="color: #c54748;">12000.00 元</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 分割线 -->
    <view class="divider"></view>

    <uni-card>
      <view class="title d-flex flex-row j-sb  a-center border-bottom pb-1">
        <view>阶段:</view>
        <u-tag
          :text="patientDetail.stage + '阶段'"
          plain
          v-if="patientDetail.stage == '第一阶段'"
          shape="circle"
        ></u-tag>
        <u-tag
          :text="patientDetail.stage + '阶段'"
          plain
          v-if="patientDetail.stage == '第二阶段'"
          shape="circle"
          type="warning"
        ></u-tag>
        <u-tag
          :text="patientDetail.stage + '阶段'"
          plain
          v-if="patientDetail.stage == '第三阶段'"
          shape="circle"
          type="success"
        ></u-tag>
      </view>
      <view class="contentAppointment">
        <view class="name d-flex j-sb a-center border-bottom pb-1 mt-2 pr-2">
          <view class="label">手机号:</view>
          <text>{{ patientDetail.doctorOrder.phone }}</text>
        </view>
        <view class="name d-flex j-sb a-center border-bottom pb-1 mt-2 pr-2">
          <view class="label">预约项目:</view>
          <text>{{ patientDetail.doctorOrder.project }}</text>
        </view>
        <view class="name d-flex j-sb a-center border-bottom pb-1 mt-2 pr-2">
          <view class="label">预约时间:</view>
          <text>{{ patientDetail.doctorOrder.appointmentTime }}</text>
        </view>
        <view class="name d-flex j-sb a-center border-bottom pb-1 mt-2 pr-2">
          <view class="label">诊所:</view>
          <text>{{ patientDetail.doctorOrder.clinic }}</text>
        </view>
        <view class="name d-flex j-sb a-center border-bottom pb-1 mt-2 pr-2">
          <view class="label w-50">处置:</view>
          <text>{{ patientDetail.handle }}</text>
        </view>
        <view class="name d-flex j-sb a-center border-bottom pb-1 mt-2 pr-2">
          <view class="label w-50">医嘱:</view>
          <text>{{ patientDetail.advice }}</text>
        </view>
      </view>
    </uni-card>
    <view class="mt-3 mx-3"><u-button type="primary" text="确认入诊" @click="handleConfirm"></u-button></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      patientDetail: {},
      avatar: 'https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/man.png'
    };
  },
  onLoad(options) {
    this.getPatientDetail(options.id, options.orderNumber);
    console.log(options);
  },
  methods: {
    //获得病历详情
    async getPatientDetail(id, orderNumber) {
      console.log(id, orderNumber);
      const { data: res } = await this.$http.post('/doctor/getRecordDet', { id: id, orderNumber: orderNumber });
      this.patientDetail = res;
      console.log(res);
    },
    handleRemind() {
      uni.$u.toast('提醒成功');
    },
    handleConfirm(){
      uni.$u.toast('确认成功');
    }
  }
};
</script>

<style scoped lang="scss">
.my {
  margin: 0;
  .top-background {
    width: 750rpx;
    height: 350rpx;
    // background: linear-gradient(to bottom, #55a2ef 30%, #1c7df5);
    background: #1b7bf7;
  }
  .my-card {
    position: absolute;
    width: 700rpx;
    height: 150rpx;
    margin-top: 270rpx;
    margin-left: 24rpx;
    background: #ffffff;
    border-radius: 15rpx;
  }
  .divider {
    width: 750upx;
    height: 100rpx;
    background-color: #f5f5f5;
  }

  .user_img {
    margin-left: 24rpx;
    margin-top: 40rpx;
  }
  .userInfo {
    margin-left: 160rpx;
  }
  .font-color {
    color: #ffffff;
  }
}
</style>
