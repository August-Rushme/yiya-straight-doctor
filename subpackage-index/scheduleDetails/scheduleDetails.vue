<template>
  <view class="scheduleDetails">
    <divider></divider>
    <view class="px-2 d-flex j-sb a-center py-3">
      <u-avatar :src="avatar" size="50" v-if="isShowDefaultAvatar"></u-avatar>
      <u--image
        v-if="gender === '男'"
        src="https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/man.png"
        width="50"
        height="50"
        shape="circle"
      ></u--image>
      <u--image
        v-if="gender === '女'"
        src="https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/woman.png"
        width="50"
        height="50"
        shape="circle"
      ></u--image>
      <view class="patient-content" v-if="!isShowDefaultAvatar">
        <view class="d-flex j-sb ">
          <view class="a-center d-flex j-start">
            <view class="name font-weight mr-3 font-md">{{ patientInfo.userName }}</view>

            <text class="mr-2 font-sm" v-if="gender === '男'" style="color: #1f86f7;">男</text>
            <text class="mr-2 font-sm" v-if="gender === '女'" style="color: #d45a8f;">女</text>
            <text class="font-sm font-weight">{{ patientInfo.age }}岁</text>
          </view>
          <view class="ml-3 a-center d-flex j-start">
            <view class="label mr-2">医生:</view>
            <view>{{ patientInfo.doctor }}</view>
          </view>
        </view>
        <view class="d-flex j-sb mt-1">
          <view class="a-center d-flex j-start">
            <view class="label mr-2">入诊:</view>
            <view class="" style="color: #999999;">{{ patientInfo.time }}</view>
          </view>
          <view class="content  a-center d-flex j-end"></view>
        </view>
      </view>
      <view class="choose line-h" style="color: #999999;font-size: 22rpx;" @click="choosePatient">
        {{ textInfo }} >
      </view>
    </view>
    <divider></divider>
    <view class="info px-2 mb-2">
      <view class="name d-flex j-sb a-center pb-1 mt-1 pr-2 border-bottom">
        <view class="label">诊所:</view>
        <text>{{ doctorInfo.doctor.clinicName }}</text>
      </view>
      <view class="name d-flex j-sb a-center pb-1 mt-1 pr-2 border-bottom">
        <view class="label">医生:</view>
        <text>{{ doctorInfo.name }}</text>
      </view>
      <view class="name d-flex j-sb a-center pb-1 mt-1 pr-2 border-bottom">
        <view class="label">预约项目:</view>
        <text>牙齿美白</text>
      </view>
    </view>
    <divider></divider>
    <view class="timeInfo px-2">
      <view class="name d-flex j-sb a-center pb-1 mt-1 pr-2 border-bottom">
        <view class="label">开始时间:</view>
        <text>{{ startTime }}</text>
      </view>
      <view class="name d-flex j-sb a-center pb-1 mt-1 pr-2 border-bottom">
        <view class="label">结束时间:</view>
        <text>{{ endTime }}</text>
      </view>
    </view>

    <view class="btns px-2 mt-5"><u-button type="primary" text="完成" @click="handleConfim"></u-button></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      doctorInfo: uni.getStorageSync('userInfo'),
      avatar: '',
      gender: '',
      textInfo: '请选择患者',
      patientInfo: {},
      isShowDefaultAvatar: true,
      startTime: '',
      endTime: '',
      date: ''
    };
  },
  onLoad(option) {
    console.log(option);
    this.startTime = option.startTime;
    this.endTime = option.endTime;
    this.date = option.date;
    this.patientInfo = option;
    if (this.patientInfo.gender) {
      this.gender = this.patientInfo.gender;
      this.isShowDefaultAvatar = false;
      this.textInfo = '重新选择患者';
    }
  },
  methods: {
    choosePatient() {
      uni.$u.route({
        type: 'redirect',
        url: '/subpackage-index/choosePatients/choosePatients',
        params: {
          startTime: this.startTime,
          endTime: this.endTime,
          date: this.date
        }
      });
    },
    async handleConfim() {
      if (this.isShowDefaultAvatar == true) {
        return this.$u.toast('请选择患者');
      }
      const res = await this.$http.post('/schedule/save', {
        recordId: this.patientInfo.id,
        userName: this.patientInfo.userName,
        projectName: '牙齿美白',
        startTime: this.startTime,
        endTime: this.endTime,
        date: this.date,
        userId: this.doctorInfo.id,
        doctorName: this.doctorInfo.name
      });
      if (res.code !== 200) {
        return this.$u.toast('新建日程失败！');
      }
      this.$u.toast('新建日程失败成功');
      uni.$u.route({
        type: 'redirect',
        url: '/subpackage-index/calendar/calendar',
      });
    }
  }
};
</script>

<style></style>
