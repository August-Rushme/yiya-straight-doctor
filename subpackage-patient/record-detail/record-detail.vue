<template>
  <view>
    <uni-card>
      <view class="title d-flex flex-row j-sb  a-center border-bottom pb-1">
        <view>病历号: {{patientDetail.id}}</view>
        <u-tag text="第一阶段治疗" plain shape="circle"></u-tag>
      </view>
      <view class="contentAppointment">
        <view class="name d-flex j-sb a-center border-bottom pb-1 mt-2 pr-2">
          <view class="label">姓名:</view>
          <text>{{patientDetail.userName}}</text>
        </view>
        <view class="name d-flex j-sb a-center border-bottom pb-1 mt-2 pr-2">
          <view class="label">性别:</view>
          <text>{{patientDetail.gender}}</text>
        </view>
        <view class="name d-flex j-sb a-center border-bottom pb-1 mt-2 pr-2">
          <view class="label">出生日期:</view>
          <text>{{patientDetail.appointment.birthday}}</text>
        </view>
        <view class="name d-flex j-sb a-center border-bottom pb-1 mt-2 pr-2">
          <view class="label">手机号:</view>
          <text>13888888888</text>
        </view>
        <view class="name d-flex j-sb a-center border-bottom pb-1 mt-2 pr-2">
          <view class="label">预约项目:</view>
          <text>牙齿美白</text>
        </view>
        <view class="name d-flex j-sb a-center border-bottom pb-1 mt-2 pr-2">
          <view class="label">医生:</view>
          <text>李四</text>
        </view>
        <view class="name d-flex j-sb a-center border-bottom pb-1 mt-2 pr-2">
          <view class="label">诊所:</view>
          <text>清合口腔</text>
        </view>
        <view class="name d-flex j-sb a-center border-bottom pb-1 mt-2 pr-2">
          <view class="label w-50">处置:</view>
          <text>处置吃吃吃吃吃吃</text>
        </view>
        <view class="name d-flex j-sb a-center border-bottom pb-1 mt-2 pr-2">
          <view class="label w-50">医嘱:</view>
          <text>医嘱吃吃吃吃吃吃医嘱吃吃吃吃吃吃医嘱吃吃吃吃吃吃医嘱吃吃吃吃吃吃医嘱吃吃吃吃吃吃</text>
        </view>
      </view>
    </uni-card>
    <view class="p-2"><u-button type="primary" @click="handleRemind">提醒看诊</u-button></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      patientDetail: {}
    };
  },
  onLoad(options) {
    this.getPatientDetail(options.id, options.appointmentId);
  },
  methods: {
    //获得病历详情
    async getPatientDetail(id, appointmentId) {
      console.log(id, appointmentId);
      const { data: res } = await this.$http.post('/doctor/getRecordDet', { recordId: id, appointId: appointmentId });
      this.patientDetail = res
      console.log(res);
    },
    handleRemind() {
      uni.$u.toast('提醒成功');
    }
  }
};
</script>

<style></style>
